import { connectToDB } from '@/utils/database';
import User from '@/models/user';
import { NextResponse } from 'next/server';
import { sendMail } from '@/utils/nodemailer';
import { SignJWT } from 'jose';
import { getJwtSecretKey } from '@/utils/auth';

export const POST = async (req) => {
    await connectToDB();
    const { Username } = await req.json();

    try {
        const data = await User.findOne({ Username});
        if (!data) {
            return new NextResponse("User not found", { status: 404 });
        }else{
            const passwordResetToken = await new SignJWT({
                _id: data._id,
            }).setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("5m")
            .sign(getJwtSecretKey());

            const subject = "Password Reset";
            const text = `This is your token for password reset, expires in 5 minutes - token: ${passwordResetToken}`;
            await sendMail(data.Email, subject, text);
            return new NextResponse("An email has been sent to your email address.", { status: 200 });
        }
    } catch (err) {
        console.log(err);
        return new NextResponse("An error occurred", { status: 500 });
    }
}

