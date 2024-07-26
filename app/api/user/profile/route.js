import User from '@/models/user';
import { connectToDB } from '@/utils/database';

export const POST = async (req) => {
    await connectToDB();
    const decodedToken = JSON.parse(req.headers.get('X-Decoded-Token'));
    const data = await req.json();

    try {
        const user = await User.findById(decodedToken._id);
        user.ProfilePicture = data.ProfilePicture;
        await user.save();
        return new Response(JSON.stringify(data), { status: 200 });
    } catch (err) {
        console.log(err);
        return new Response("An error occurred", { status: 500 });
    }
}

