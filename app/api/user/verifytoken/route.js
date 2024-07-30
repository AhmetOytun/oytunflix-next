import { connectToDB } from '@/utils/database';
import User from '@/models/user';
import { NextResponse } from 'next/server';
import { getJwtSecretKey, verifyJwtToken } from '@/utils/auth';
import bcrypt from 'bcrypt';

export const POST = async (req) => {
    await connectToDB();
    const { Token,Password } = await req.json();

    try {
        const decodedToken = await verifyJwtToken(Token);

        const data = await User.findOne({ _id: decodedToken._id });
        if (!data) {
            return new NextResponse("User not found", { status: 404 });
        } else {
            data.Password = await bcrypt.hash(Password, 10);
            await data.save();
            return new NextResponse("Password has been reset", { status: 200 });
        }
    } catch (err) {
        console.log(err);
        return new NextResponse("An error occurred", { status: 500 });
    }
}

