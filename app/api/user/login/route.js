import User from "@/models/user";
import { getJwtSecretKey } from "@/utils/auth";
import { connectToDB } from "@/utils/database";
import bcrypt from "bcrypt";
import { SignJWT } from "jose";
import { NextResponse } from "next/server";

export const POST = async (req, res) => {
    try{
        await connectToDB(); // connect to the database
        const data = await req.json(); // get the data
        const userLogin = await User.findOne({Username:data.Username}); // find the user

        if(!userLogin){ // if the user does not exist
            return new NextResponse("User not found", { status: 400 });
        }                   

        const isValid = await bcrypt.compare(data.Password,userLogin.Password); // compare the password

        if(!isValid){ // if the password is incorrect
            return new Response("User not found", { status: 400 });
        }

        const token = await new SignJWT({
            _id: userLogin._id,
        })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(getJwtSecretKey());

        return new NextResponse(token, { status: 200 });
    }
    catch(err){
        console.log(err);
        return new NextResponse("An error occurred", { status: 500 });
    }
}