import Movie from '@/models/movie';
import { connectToDB } from '@/utils/database';

export const GET = async (req) => {
    await connectToDB();
    try {
        const data = await Movie.find();
        return new Response(JSON.stringify(data), { status: 200 });
    } catch (err) {
        console.log(err);
        return new Response("An error occurred", { status: 500 });
    }
}

