import { IsInt , IsNotEmpty , IsBoolean , IsDate , IsString , IsArray} from "class-validator";
import {ObjectID} from 'mongodb';


export class CreateChatroomDto{
    @IsString()
    room_name:string;
    
    member_arr: {userID:ObjectID,date_join: Date, date_leave: Date}[]; //userID, date_join, date_leave
    @IsInt()
    totalmember:number;
    @IsDate()
    date_create:Date;
    @IsDate()
    date_delete:Date;
    @IsArray()
    members: ObjectID[];
    
}