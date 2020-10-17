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
    friend_arr: {userID:ObjectID,sender:boolean, isAccepted:boolean, date_add:Date, date_accepted:Date, date_delete:Date}[];// userID, sender, isaccepted, date_add, date_delete
    @Column()
    numberfriends: number;
    @Column()
    description: string;
    @Column()
    isChatMember_arr: {chatroomID:ObjectID}[]; //chatroomID
    @Column()
    date_join: Date;
    @Column()
    isAdmin: boolean;
    @Column()
    isLoggedNn: boolean;
}
export default User;
