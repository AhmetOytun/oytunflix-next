import User from '@/models/user';
import { connectToDB } from '@/utils/database';

export const GET = async (req) => {
    await connectToDB();
    const decodedToken = JSON.parse(req.headers.get('X-Decoded-Token'));

    try {
        const data = await User.findById(decodedToken._id);
        return new Response(JSON.stringify(data), { status: 200 });
    } catch (err) {
        console.log(err);
        return new Response("An error occurred", { status: 500 });
    }
}

