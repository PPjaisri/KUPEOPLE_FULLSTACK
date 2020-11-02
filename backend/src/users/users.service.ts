import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity'
import { ObjectID } from 'mongodb';
import { User_info } from 'src/common/user_info';
import { CreateUserDto } from 'src/dto/create-user.dto';
import Thread from 'src/threads/thread.entity';
import Chatroom from 'src/entities/chatroom.entity';
import Notifications from 'src/entities/notification.entity';
import { count } from 'console';
import { UpdateUserDto } from 'src/dto_update/update-user.dto';
import Commentation from 'src/threads/comentation.entity';
import Reportment_comment from 'src/entities/reportment_comment.entity';
import Reportment_thread from 'src/entities/reportment_thread.entity';
import Threadnogen from 'src/entities/threadnogen.entity';

import {map, catchError } from 'rxjs/operators';
import {from ,throwError} from 'rxjs';
import { NotificationsService } from 'src/notification/notification.service';
import { changepassDto } from './changepass.dto';





@Injectable()
export class UsersService {
    
    private user_info: User[] = [];
    private info: User_info={userID: null,name:null,avatar_URL:null, exp:null, rank:null ,isLoggedIn:null };
    private newusers = [];
    private findoneuser = null;
    private iamuser = null;
    private mychatroom = [];
    private result = {chatroomInfo: null, membersinfo: [], numnotifiacation: null};

    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(Chatroom)
        private chatroomRepository: Repository<Chatroom>,
        @InjectRepository(Notifications)
        private notificationsRepository: Repository<Notifications>,
        @InjectRepository(Thread)
        private threadRepository: Repository<Thread>,
        @InjectRepository(Commentation)
        private commentRepository: Repository<Commentation>,
        @InjectRepository(Reportment_comment)
        private reportCRepository: Repository<Reportment_comment>,
        @InjectRepository(Reportment_thread)
        private reportTRepository: Repository<Reportment_thread>,
        @InjectRepository(Threadnogen)
        private threadnogenRopsitory: Repository<Threadnogen>,

        private notificationsService: NotificationsService

            
    ) {}

    async changepass(userID: ObjectID, changepassdto: changepassDto): Promise<any> {
        let obj = { Isverified: null };
        let obj2 = { password: null };
        let thisuser = null;
        await this.usersRepository.findOne({where:{ _id: userID}})
            .then(oneuser => {
                thisuser = oneuser;
            });
        if (changepassdto.oldpass === thisuser.password) {
            obj.Isverified = true;
            var bcrypt =  require('bcrypt');
            const saltRounds = 10;
            const hash = bcrypt.hashSync(changepassdto.newpass, saltRounds);
            obj2.password = hash;
            this.usersRepository.update({userID: userID}, obj2);
            return obj;
        }
        else {
            obj.Isverified = false;
            return obj;
        }
    }

    async getoldpass(userID: ObjectID) {
        let thisuser = null;
        await this.usersRepository.findOne({where:{ _id: userID}})
            .then(oneuser => {
                thisuser = oneuser;
            });
        let oldpass = thisuser.password;
        let newname = thisuser.username;
        let newmail = thisuser.email;
        const mailgun = require("mailgun-js");
        const DOMAIN = "sandboxcc0d5624e84541f883e7c7a30536acaf.mailgun.org";
        const mg = mailgun({apiKey: "be32a7077097c68b2013827437aa6821-ea44b6dc-63bd2305", domain: DOMAIN});
        const data = {
            from: "Mailgun Sandbox <postmaster@sandboxcc0d5624e84541f883e7c7a30536acaf.mailgun.org>",
            to: `${newmail}`,
            subject: `KU-PEOPLE password verified code for username: ${newname}`,
            text: `Your password verified code is ${oldpass}`
        };
        mg.messages().send(data, function (error, body) {
            console.log(body);
        });
        // const nodemailer = require("nodemailer");
        // const { google } = require("googleapis");
        // const OAuth2 = google.auth.OAuth2;


        // const oauth2Client = new OAuth2(
        //     "1002709865150-eaebtmjtmsh41ek9b57us4k4i4e1d74i.apps.googleusercontent.com", // ClientID
        //     "zaQtoYTXJIf_EMVORC--5Zwm", // Client Secret
        //     "https://developers.google.com/oauthplayground" // Redirect URL
        // );

        // oauth2Client.setCredentials({
        //     refresh_token: "1//04ItGxNwFyiqzCgYIARAAGAQSNwF-L9Ir9AWhQsxRg8qeveuGliy9OLlv5ssy_3Jelq1-7Rbg8HLDjLZJT7vzYtyXFVichcLyNpE"
        // });
        // const accessToken = oauth2Client.getAccessToken()

        // const smtpTransport = nodemailer.createTransport({
        //     service: "gmail",
        //     auth: {
        //         type: "OAuth2",
        //         user: "ku.people.team@gmail.com", 
        //         clientId: "1002709865150-eaebtmjtmsh41ek9b57us4k4i4e1d74i.apps.googleusercontent.com",
        //         clientSecret: "zaQtoYTXJIf_EMVORC--5Zwm",
        //         refreshToken: "1//04ItGxNwFyiqzCgYIARAAGAQSNwF-L9Ir9AWhQsxRg8qeveuGliy9OLlv5ssy_3Jelq1-7Rbg8HLDjLZJT7vzYtyXFVichcLyNpE",
        //         accessToken: accessToken
        //     },
        //     tls: {
        //         rejectUnauthorized: false
        //     }
        // });

        // const mailOptions = {
        //     from: 'ku.people.team@gmail.com',
        //     to: `${newmail}`,
        //     subject: `KU-PEOPLE forget password Username: ${newname}`,
        //     generateTextFromHTML: true,
        //     text: `Your verified code is ${oldpass}`
        //     //html: '<body> <p id="a"> </p> <script> let name = 5; document.getElementById("a").innerHTML = "hello" + name; </script> </body>'
        // };

        // smtpTransport.sendMail(mailOptions, (error, response) => {
        //     error ? console.log(error) : console.log(response);
        //     smtpTransport.close();
        // });
    }

    async chatroomaction(userID: ObjectID, chatroomID: ObjectID,act: string): Promise<any> {
        if (act === 'add') {
            let obj = { chatmember_arr: [] };
            let obj2 = { member_arr: [], totalmember: null};
            let newuser = null;
            await this.usersRepository.findOne({where:{ _id: userID}})
                .then(oneuser => {
                    newuser = oneuser;
                });
            let newchatroom = null;
            await this.chatroomRepository.findOne({where:{ _id: chatroomID}})
                .then(onechatroom => {
                    newchatroom = onechatroom;
                });
            let newroom = newuser.chatmember_arr;
            let newroom2 = newchatroom.member_arr;
            let date = new Date();
            date.setMinutes(date.getMinutes()+7*60);
            let result = {
                chatroomID: chatroomID
            };
            let result2 = {
                userID: userID,
                date_join_chat: date,
                date_leave_chat: null
            };
            newroom.push(result);
            newroom2.push(result2);
            obj.chatmember_arr = newroom;
            obj2.member_arr = newroom2;
            obj2.totalmember = newchatroom.totalmember + 1;
            this.usersRepository.update({userID: userID}, obj);
            this.chatroomRepository.update({chatroomID: chatroomID}, obj2);
        }
        else if (act === 'delete') {
            let obj = { chatmember_arr: [] };
            let obj2 = { member_arr: [], totalmember: null };
            let newuser = null;
            await this.usersRepository.findOne({where:{ _id: userID}})
                .then(oneuser => {
                    newuser = oneuser;
                });
            let newchatroom = null;
            await this.chatroomRepository.findOne({where:{ _id: chatroomID}})
                .then(onechatroom => {
                    newchatroom = onechatroom;
                });
            let newroom = newuser.chatmember_arr;
            let newroom2 = newchatroom.member_arr;
            newroom = newroom.filter((obj3) => {if (obj3.chatroomID.toString() !== chatroomID.toString()) { return true; }});
            let date = new Date();
            date.setMinutes(date.getMinutes()+7*60);
            for (let i = 0; i < newroom2.length; i++) {
                if (newroom2[i].userID.toString() === userID.toString()) {
                    newroom2[i].date_leave_chat = date;
                }
            }
            obj.chatmember_arr = newroom;
            obj2.member_arr = newroom2;
            obj2.totalmember = newchatroom.totalmember - 1;
            this.usersRepository.update({userID: userID}, obj);
            this.chatroomRepository.update({chatroomID: chatroomID}, obj2);
        }
    }

    async friendaction(userID: ObjectID, userID2: ObjectID,act: string): Promise<any> {
        if (act === "add") {
            let obj = { friend_arr: []};
            let obj2 = { friend_arr: []};
            let send = null;
            await this.usersRepository.findOne({where:{ _id: userID}})
                .then(senduser => {
                    send = senduser;
                });
            let recieve = null;
            await this.usersRepository.findOne({where:{ _id: userID2}})
                .then(recieveuser => {
                    recieve = recieveuser;
                });
            let Sendfriend = send.friend_arr;
            let Recievefriend = recieve.friend_arr;
            let date = new Date();
            date.setMinutes(date.getMinutes()+7*60);
            let result = {
                userID: userID, 
                sender: true,
                isAccepted: false,
                date_add: date,
                date_accepted: null,
                date_delete: null
            };
            let result2 = {
                userID: userID2, 
                sender: false,
                isAccepted: false,
                date_add: date,
                date_accepted: null,
                date_delete: null
            };
            Sendfriend.push(result2);
            Recievefriend.push(result);
            obj.friend_arr = Sendfriend;
            obj2.friend_arr = Recievefriend;
            this.usersRepository.update({userID: userID}, obj);
            this.usersRepository.update({userID: userID2}, obj2);
            //noti
            await this.notificationsService.postFriendRequest(userID2,userID);
        }
        else if (act === "reject") {
            let obj = { friend_arr: []};
            let obj2 = { friend_arr: []};
            let send = null;
            await this.usersRepository.findOne({where:{ _id: userID}})
                .then(senduser => {
                    send = senduser;
                });
            let recieve = null;
            await this.usersRepository.findOne({where:{ _id: userID2}})
                .then(recieveuser => {
                    recieve = recieveuser;
                });
            let Sendfriend = send.friend_arr;
            let Recievefriend = recieve.friend_arr;
            Sendfriend = Sendfriend.filter((obj3) => {if (obj3.userID.toString() !== userID2.toString()) { return true; }});
            Recievefriend = Recievefriend.filter((obj4) => {if (obj4.userID.toString() !== userID.toString()) { return true; }});
            obj.friend_arr = Sendfriend;
            obj2.friend_arr = Recievefriend;
            this.usersRepository.update({userID: userID}, obj);
            this.usersRepository.update({userID: userID2}, obj2);
        }
        else if (act === "accept") {
            let obj = { friend_arr: [], numberfriends: null};
            let obj2 = { friend_arr: [], numberfriends: null};
            let send = null;
            await this.usersRepository.findOne({where:{ _id: userID}})
                .then(senduser => {
                    send = senduser;
                });
            let recieve = null;
            await this.usersRepository.findOne({where:{ _id: userID2}})
                .then(recieveuser => {
                    recieve = recieveuser;
                });
            let Sendfriend = send.friend_arr;
            let Recievefriend = recieve.friend_arr;
            let date = new Date();
            date.setMinutes(date.getMinutes()+7*60);
            for (let i = 0; i < Sendfriend.length; i++) {
                if (Sendfriend[i].userID.toString() === userID2.toString()) {
                    Sendfriend[i].isAccepted = true;
                    Sendfriend[i].date_accepted = date;
                }
            }
            for (let j = 0; j < Recievefriend.length; j++) {
               if (Recievefriend[j].userID.toString() === userID.toString()) {
                    Recievefriend[j].isAccepted = true;
                    Recievefriend[j].date_accepted = date;
               }
            }
            send.numberfriends++;
            recieve.numberfriends++;
            obj.numberfriends = send.numberfriends;
            obj2.numberfriends = recieve.numberfriends;
            obj.friend_arr = Sendfriend;
            obj2.friend_arr = Recievefriend;
            this.usersRepository.update({userID: userID}, obj);
            this.usersRepository.update({userID: userID2}, obj2);
            //noti
            await this.notificationsService.postAcceptFriend(userID,userID2);
        }
        else if (act === "delete") {
            let obj = { friend_arr: [], numberfriends: null};
            let obj2 = { friend_arr: [], numberfriends: null};
            let send = null;
            await this.usersRepository.findOne({where:{ _id: userID}})
                .then(senduser => {
                    send = senduser;
                });
            let recieve = null;
            await this.usersRepository.findOne({where:{ _id: userID2}})
                .then(recieveuser => {
                    recieve = recieveuser;
                });
            let Sendfriend = send.friend_arr;
            let Recievefriend = recieve.friend_arr;
            let date = new Date();
            date.setMinutes(date.getMinutes()+7*60);
            for (let i = 0; i < Sendfriend.length; i++) {
                if (Sendfriend[i].userID.toString() === userID2.toString()) {
                    Sendfriend[i].date_delete = date;
                }
            }
            for (let j = 0; j < Recievefriend.length; j++) {
               if (Recievefriend[j].userID.toString() === userID.toString()) {
                    Recievefriend[j].date_delete = date;
               }
            }
            send.numberfriends--;
            recieve.numberfriends--;
            obj.numberfriends = send.numberfriends;
            obj2.numberfriends = recieve.numberfriends;
            obj.friend_arr = Sendfriend;
            obj2.friend_arr = Recievefriend;
            this.usersRepository.update({userID: userID}, obj);
            this.usersRepository.update({userID: userID2}, obj2);
        }
    }

    async updateUser(createUserDto: UpdateUserDto, userID: ObjectID) {
        return this.usersRepository.update({userID: userID }, createUserDto);
    }

    async findownthreads(userID: ObjectID): Promise<any> {
        return this.threadRepository.find({where:{ userID: userID}});
    }

    async findowncomments(userID: ObjectID): Promise<any> {
        return this.commentRepository.find({where:{ userID: userID}});
    }

    async findownReportC(userID: ObjectID): Promise<any> {
        return this.reportCRepository.find({where:{ userID: userID}});
    }

    async findownReportT(userID: ObjectID): Promise<any> {
        return this.reportTRepository.find({where:{ userID: userID}});
    }

    async findallchatroom(userID: ObjectID): Promise<any> {
        this.mychatroom = [];
        this.result = {chatroomInfo: null, membersinfo: [], numnotifiacation: null};
        this.iamuser = null;
        await this.usersRepository.findOne({where:{ _id: userID}})
            .then(oneuser => {
                this.iamuser = oneuser;
            });
        let numroom = this.iamuser.chatmember_arr.length;
        //console.log(numroom);
        for (let i = 0; i < numroom; i++) {
            let thisroom = null;
            await this.chatroomRepository.findOne({where:{ _id: this.iamuser.chatmember_arr[i].chatroomID}})
                .then(oneroom => {
                    thisroom = oneroom;
                });
            this.result.chatroomInfo = thisroom;
            let nummember = thisroom.totalmember;
            for (let j = 0; j < nummember; j++) {
                let thismember = await this.findUserInfo(thisroom.member_arr[j].userID)
                //console.log(thismember);
                this.result.membersinfo.push(thismember);
            }
            let totalnotifi = null;
            await this.notificationsRepository.find({where: { userID: userID}})
                .then(totalnoti => {
                    totalnotifi = totalnoti;
                });
            let counter = 0;
            //console.log(totalnotifi)
            for (let k = 0; k < totalnotifi.length; k++) {
                //console.log(totalnotifi[k].object_type);
                if (totalnotifi[k].object_type === "chat") {
                    counter++;
                }
            }
            this.result.numnotifiacation = counter;
            this.mychatroom.push(this.result);
            this.result = {chatroomInfo: null, membersinfo: [], numnotifiacation: null};
        }
        this.mychatroom = this.mychatroom.sort((a: any, b: any) => {
            return a.chatroomInfo.date_lastactive.valueOf() - b.chatroomInfo.date_lastactive.valueOf();
        });
        this.mychatroom = this.mychatroom.reverse();
        return this.mychatroom;
    }

    async findallUser(): Promise<User[]> {
        return this.usersRepository.find();
    }


    async findOne(username: string): Promise<User | undefined> {
        this.newusers = [];
        await this.usersRepository.find()
            .then(setuser => {
                this.newusers = setuser;
            }); 
        return this.newusers.find(eachuser => eachuser.email === username);
    }
    // not Modify}

    async findOneUser(userID: ObjectID): Promise<User>{
        this.findoneuser = null;
        await this.usersRepository.findOne({where:{_id: userID }})
            .then(oneuser => {
                this.findoneuser = oneuser;
            });
        this.findoneuser.password = null;
        return this.findoneuser;
    }

    async findUserInfo(userID: ObjectID): Promise<User_info>{
        //console.log(userID);
        this.info = {userID: null,name:null,avatar_URL:null, exp:null, rank:null ,isLoggedIn:null };
        this.user_info = [];
        await this.usersRepository.find({where:{_id: userID}})
            .then(setuser_info => {
                this.user_info = setuser_info;
        }); 
        //var info: User_info;
        //console.log(this.user_info[0].userID);
        this.info.userID = this.user_info[0].userID;
        this.info.name = this.user_info[0].name;
        this.info.avatar_URL = this.user_info[0].avatar_URL;
        this.info.exp = this.user_info[0].exp;
        this.info.rank = this.user_info[0].rank;
        this.info.isLoggedIn = this.user_info[0].isLoggedIn;
        return this.info;

    }

    async createUser(createUserDto: CreateUserDto) {
        createUserDto.email = createUserDto.email.toLowerCase();
        let allUser:User[];
        await this.usersRepository.find()
            .then(setUsers=>{allUser = setUsers});
        
        //console.log(allUser.some(eachuser => {console.log(eachuser.email,createUserDto.email, eachuser.email === createUserDto.email);return eachuser.email === createUserDto.email}));

        if(allUser.some(eachuser => {return eachuser.email === createUserDto.email})){
            //console.log("this email has already used to sign up");
            //return {"message": "this email has already used to sign up"};
            throw new HttpException("this email has already used to sign up", HttpStatus.FORBIDDEN);
        }
        if(allUser.some(eachuser => { return eachuser.username === createUserDto.username})){
            //console.log("this username has already used to sign up");
            throw new HttpException("this username has already used to sign up", HttpStatus.FORBIDDEN);
        }
        
    
        
        let NO: Threadnogen;
        // Generate GuestNO. but use number from threadnogen entity
        await this.threadnogenRopsitory.find()
            .then(setNO=>{NO=setNO[1]});
        let userNO = (NO.threadNO+1).toString();
        createUserDto.name = "Guest"+ userNO;
        await this.threadnogenRopsitory.update({id:NO.id}, {threadNO: NO.threadNO+1});
        
        createUserDto.avatar_URL = null;
        createUserDto.exp = 0;
        createUserDto.rank = "Beginner";
        createUserDto.friend_arr = [];
        createUserDto.numberfriends = 0;
        createUserDto.quote = "";
        createUserDto.description = "";
        createUserDto.text_type = {bold:false, italic: false, font:"Arial", size:10};
        createUserDto.chatmember_arr = [];
        var date = new Date();
        date.setMinutes(date.getMinutes()+7*60); //Thailand timezone offset
        createUserDto.date_join = date;
        createUserDto.isAdmin = false;
        createUserDto.isLoggedIn = false;
        
        
        var bcrypt =  require('bcrypt');
        const saltRounds = 10;
        const hash = bcrypt.hashSync(createUserDto.password, saltRounds);
        createUserDto.password = hash;
        
        //uncomment above to hashpassword
        
        // Store hash in your password DB.
        //console.log(createUserDto.password);
        return from(this.usersRepository.save(createUserDto)).pipe( // don't show password
            map((user: User)=>{
                const{password, ...result} = user;
                return result;
            }),
            catchError(err => throwError(err))
        );
            
        
        
        
    }
}
