import Movie from "@/models/movie";
import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export const GET = async (req) => {
    try {
        const filepath = path.join(process.cwd(), "public", "movies");
        const url = new URL(req.url);
        const pathname = url.pathname;
        const segments = pathname.split('/');
        const movieId = segments[2];
        const movie = await Movie.findById(movieId);
        const mimeModule = await import("mime");
        const mime = mimeModule.default;
        const videoFileName = movie.MovieFileName;
        const videoPath = path.join(filepath, videoFileName);
        const videoStat = fs.statSync(videoPath);
        const fileSize = videoStat.size;
        const videoRange = req.headers.get('range');
        const contentType = mime.getType(videoPath);

        if (videoRange) {
            const parts = videoRange.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
            const chunkSize = (end - start) + 1;
            const file = fs.createReadStream(videoPath, { start, end });

            const headers = new Headers({
                "Content-Range": `bytes ${start}-${end}/${fileSize}`,
                "Accept-Ranges": "bytes",
                "Content-Length": chunkSize,
                "Content-Type": contentType,
            });

            return new NextResponse(file, {
                status: 206,
                headers: headers,
            });
        } else {
            const headers = new Headers({
                "Content-Length": fileSize,
                "Content-Type": contentType,
            });

            const file = fs.createReadStream(videoPath);
            return new NextResponse(file, {
                status: 200,
                headers: headers,
            });
        }
    } catch (error) {
        console.error("Error streaming video:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
};
