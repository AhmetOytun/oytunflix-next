import { writeFile } from "fs/promises";
import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import ffmpeg from "fluent-ffmpeg";

const replacements = {
    'Ý': 'İ',
    'ý': 'ı',
    'þ': 'ş',
    'Þ': 'Ş',
    'ð': 'ğ',
    'Ð': 'Ğ',
    'Ç': 'Ç',
    'ç': 'ç',
    'Ü': 'Ü',
    'ü': 'ü',
    'İ': 'İ',
    'ı': 'ı',
    "Ã§": "ç",
    "Ã": "Ç",
    "Ã¢": "â",
    "Ä±": "ı",
    "Ã": "Ý",
    "Å": "ş",
    "Å": "Ş",
    "Ã¼": "ü",
    "Ã": "Ü",
    "Ã¶": "ö",
    "Ã": "Ö",
    "Ä": "ğ",
    "Ä": "Ğ",
    "Ä°": "İ",
    "Ã§": "ç",
    "Ä±": "ı",
    "Ä": "ğ",
    "Å": "ş",
};

const correctCharacters = (data) => {
    let correctedData = data;
    
    for (const [incorrect, correct] of Object.entries(replacements)) {
        const regex = new RegExp(incorrect, 'g');
        correctedData = correctedData.replace(regex, correct);
    }
    
    return correctedData;
};

export const POST = async (req, res) => {
    const formData = await req.formData();
    const uploadsPath = path.join(process.cwd(), "public", "subtitles");
    const file = formData.get("subtitles");
    const movieId = formData.get("movieId");
    const language = formData.get("language");

    const srtFilePath = path.join(uploadsPath, `${movieId}-${language}.srt`);
    const vttFilePath = path.join(uploadsPath, `${movieId}-${language}.vtt`);
  
    if (!fs.existsSync(uploadsPath)) {
      await fs.promises.mkdir(uploadsPath, { recursive: true });
    }
  
    if (!file) {
      return NextResponse.json({ error: "No files received." }, { status: 400 });
    }

    if (!movieId) {
        return NextResponse.json({ error: "No movie id received." }, { status: 400 });
    }

    if (!language) {
        return NextResponse.json({ error: "No language received." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const srtContent = buffer.toString("latin1");
    const correctedSrtContent = correctCharacters(srtContent);

    try {
        await writeFile(srtFilePath, correctedSrtContent);
        console.log("Subtitles saved as srt with UTF-8 encoding and corrected characters");
    }
    catch (error) {
        console.error("Error saving subtitles:", error);
        return NextResponse.json({ error: "Failed to save subtitles" }, { status: 500 });
    }

    if (file.mimetype !== "text/vtt") {
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

        return NextResponse.json({ message: "Subtitle uploaded and converted successfully" }, { status: 200 });
    } else {
        console.log("File is already vtt");
        return NextResponse.json({ message: "Subtitle uploaded successfully" }, { status: 200 });
    }
};
