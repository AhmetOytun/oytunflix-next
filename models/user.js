import {Schema,model,models} from "mongoose";

const UserSchema = new Schema({
    Name:{
        type:String,
        required:true,
    },
    Password:{
        type:String,
        required:true,
    },
    Username:{
        type:String,
        required:true,
    },
    Surname:{
        type:String,
        required:true,
    },
    Email:{
        type:String,
        required:true,
    },
    ProfilePicture:{
        type:Number,
        default:0,
    },
});

const User = models.User || model("User",UserSchema);

export default User;