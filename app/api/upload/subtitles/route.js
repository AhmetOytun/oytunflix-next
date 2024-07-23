import { writeFile } from "fs/promises";
import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import ffmpeg from "fluent-ffmpeg";

export const POST = async (req, res) => {
    const formData = await req.formData();
    const uploadsPath = path.join(process.cwd(), "public", "subtitles");
    const file = formData.get("subtitles");
    const movieId = formData.get("movieId");

    const srtFilePath = path.join(uploadsPath, `${movieId}.srt`);
    const vttFilePath = path.join(uploadsPath, `${movieId}.vtt`);
  
    if (!fs.existsSync(uploadsPath)) {
      await fs.promises.mkdir(uploadsPath, { recursive: true });
    }
  
    if (!file) {
      return NextResponse.json({ error: "No files received." }, { status: 400 });
    }

    if (!movieId) {
        return NextResponse.json({ error: "No movie id received." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    try {
        await writeFile(srtFilePath, buffer);
        console.log("Subtitles saved as srt");
    }
    catch (error) {
        console.error("Error saving subtitles:", error);
        return NextResponse.json({ error: "Failed to save subtitles" }, { status: 500 });
    }

        if (file.mimetype  !== "text/vtt") {
        ffmpeg()
        .input(srtFilePath)
        .outputOptions("-c:s webvtt")
        .save(vttFilePath)
        .on('end', function() {
            console.log('File converted to vtt');
            if (fs.existsSync(srtFilePath)) {
                fs.unlinkSync(srtFilePath);
                console.log("Srt file deleted");
            }
        })
        .on('error', function(err) {
            console.error(err);
            return NextResponse.json({ error: "Failed to convert subtitles" }, { status: 500 });
        });

        return NextResponse.json({ message: "Subtitle uploaded successfully" }, { status: 200 });
    } else {
        console.log("File is already vtt");
        return NextResponse.json({ message: "Subtitle uploaded successfully" }, { status: 200 });
    }
  };
  