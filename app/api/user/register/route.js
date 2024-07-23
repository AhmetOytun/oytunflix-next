import User from "@/models/user";
import { connectToDB } from "@/utils/database";
import bcrypt from "bcrypt";

export const POST = async (req, res) => {
    try{
        await connectToDB();
        const data = await req.json();
        const userRegister = await User.findOne({Username:req.body.Username});
        
        if(userRegister){
            return new Response("User already exists", { status: 400 });
        }else{
            let hashedPassword = await bcrypt.hash(data.Password,10);

            const newUser = await User.create({
                Username: data.Username,
                Password: hashedPassword,
                Name: data.Name,
                Surname: data.Surname,
                Email: data.Email,
            });

            await newUser.save();
            console.log(`User created: ${newUser.Name} ${newUser.Surname}`);

            return new Response("User created", { status: 200 });
        }
    }
    catch(err){
        console.log(err);
        return new Response("An error occurred", { status: 500 });
    }
}