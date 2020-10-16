import { Entity, Column, ObjectIdColumn } from 'typeorm';
import { ObjectID } from 'mongodb'
@Entity()
export class User{
    @ObjectIdColumn()
    userID?: ObjectID;
    @Column()
    username: string;
    @Column()
    email: string;
    @Column()
    password: string;
    @Column()
    avatar_URL: string;
    @Column()
    exp: number;
    @Column()
    rank: string;
    @Column()
    friend_arr: {user:ObjectID,sender:boolean, isaccepted:boolean, date_request:Date, date_add:Date, date_delete:Date}[];// userID, sender, isaccepted, date_add, date_delete
    @Column()
    numberfriends: number;
    @Column()
    description: string;
    @Column()
    ischatmember_arr: {chatroomID:ObjectID}[]; //chatroomID
    @Column()
    date_join: Date;
    @Column()
    isloggedin: boolean
}
export default User;