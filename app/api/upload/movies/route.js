import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";
import Movie from "@/models/movie";
import { connectToDB } from "@/utils/database";
import sharp from "sharp";

const mergeChunks = async (fileName, totalChunks, mergedTime) => {
  const chunkDir = path.join(process.cwd(), "public", "chunks");
  const mergedFilePath = path.join(process.cwd(), "public", "movies");

  const maxRetries = 5;

  if (!fs.existsSync(mergedFilePath)) {
    await fs.promises.mkdir(mergedFilePath, { recursive: true });
  }

  let startChunk = 0;

  const outputFilePath = `${mergedFilePath}/${mergedTime}-${fileName}`;
  const writeStream = fs.createWriteStream(outputFilePath, { flags: "a" });

  writeStream.on("error", (err) => {
    console.error("Error writing to file:", err);
    writeStream.destroy();
  });

  try {
    for (let i = startChunk; i < totalChunks; i++) {
      const chunkFilePath = `${chunkDir}/${fileName}.part_${i}`;
      let chunkBuffer;

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          chunkBuffer = await fs.promises.readFile(chunkFilePath);
          break;
        } catch (err) {
          console.error(`Error reading chunk ${i} (attempt ${attempt}):`, err);
          if (attempt === maxRetries) throw err;
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          if (!writeStream.write(chunkBuffer)) {
            await new Promise((resolve) => writeStream.once("drain", resolve));
          }
          break;
        } catch (err) {
          console.error(`Error writing chunk ${i} (attempt ${attempt}):`, err);
          if (attempt === maxRetries) throw err;
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }

      fs.unlinkSync(chunkFilePath);
    }

    writeStream.end();
  } catch (err) {
    console.error("Error during merging:", err);
    writeStream.destroy();
  }
};

const convertToMp4 = async (mergedTime, fileName) => {
    if(fileName.endsWith(".mp4")){
        console.log("File is already mp4");
        return;
    }
    return new Promise((resolve, reject) => {
        console.log("fileName",fileName)
        const mergedFilePath = path.join(__dirname, '..', 'uploads', 'movies', `${mergedTime}-${fileName}`);
        const mp4FilePath = path.join(__dirname, '..', 'uploads', 'movies', `${mergedTime}-${fileName}.mp4`);

        ffmpeg()
        .input(mergedFilePath)
        .outputOptions("-codec copy")
        .save(mp4FilePath)
        .on('end', function() {
            console.log('File converted to mp4');
            resolve();
        })
        .on('error', function(err) {
            console.error(err);
            reject(err);
        });
    });
}


const extractScreenshots = async (movieFilePath, mergedTime, fileName) => {
  return new Promise((resolve, reject) => {
      const screenshotsDir = path.join(process.cwd(), 'public', 'screenshots');
      const ssCount = 5;

      if (!fs.existsSync(screenshotsDir)) {
          fs.mkdirSync(screenshotsDir, { recursive: true });
      }

      ffmpeg.ffprobe(movieFilePath, (err, metadata) => {
          if (err) {
              console.error("Error getting video metadata:", err);
              reject(err);
          }

          const duration = metadata.format.duration;
          const interval = duration / (ssCount + 1);

          let processedCount = 0;

          for (let i = 1; i <= ssCount; i++) {
              const ssFilePath = path.join(screenshotsDir, `${mergedTime}-${fileName}_screenshot_${i}.png`);
              const ssTime = i * interval;

              ffmpeg(movieFilePath)
                  .seekInput(ssTime)
                  .output(ssFilePath)
                  .on('end', async function() {
                  })
                  .on('error', async function(err) {
                    // DO NOTHING DONT DELETE THIS
                    try {
                      await sharp(ssFilePath)
                          .jpeg({ quality: 50 })
                          .toFile(ssFilePath.replace('.png', '.jpg'));
                          fs.unlinkSync(ssFilePath);
                          ssFilePath = ssFilePath.replace('.png', '.jpg');
                  } catch (err) {
                      console.error("Error compressing image:", err);
                      reject(err);
                  }
                  })
                  .run();
          }
          resolve();
      });
  });
};

export const POST = async (req, res) => {
    const formData = await req.formData();
    const uploadsPath = path.join(process.cwd(), "public", "movies");
    const chunkDir = path.join(process.cwd(), "public", "chunks");
    const originalName = formData.get("filename");
    let fileName = formData.get("originalname");
    const chunkNumber = Number(formData.get("chunkNumber"));
    const totalChunks = Number(formData.get("totalChunks"));
    const chunkFilePath = `${chunkDir}/${fileName}.part_${chunkNumber}`;
  
    if (!fs.existsSync(uploadsPath)) {
      await fs.promises.mkdir(uploadsPath, { recursive: true });
    }
  
    if (!fs.existsSync(chunkDir)) {
      await fs.promises.mkdir(chunkDir, { recursive: true });
    }
  
    const file = formData.get("movie");
    if (!file) {
      return NextResponse.json({ error: "No files received." }, { status: 400 });
    }
  
    const buffer = Buffer.from(await file.arrayBuffer());
    try {
      await writeFile(chunkFilePath, buffer);
  
      if (chunkNumber === totalChunks - 1) {
        const mergedTime = new Date().getTime();
        await mergeChunks(fileName, totalChunks, mergedTime);

        await convertToMp4(mergedTime, fileName);
        if(!fileName.endsWith(".mp4")){
            const originalFilePath = path.join(process.cwd(), 'public', 'movies', `${mergedTime}-${fileName}`);
            fs.unlink(originalFilePath, (err) => {
                if (err) {
                    console.error(`Error deleting the original file: ${err}`);
                } else {
                    console.log(`Original file ${fileName} deleted successfully.`);
                }
            });
            fileName = `${fileName}.mp4`;
        }

        await extractScreenshots(`${uploadsPath}/${mergedTime}-${fileName}`, mergedTime, fileName);

        await connectToDB();

        Movie.create({
            MovieName: formData.get("MovieName"),
            MovieDescription: formData.get("MovieDescription"),
            MovieYear: formData.get("MovieYear"),
            MovieGenre: formData.get("MovieGenre"),
            MovieStars: formData.get("MovieStars"),
            MovieDirector: formData.get("MovieDirector"),
            MovieCountry: formData.get("MovieCountry"),
            MovieFileName: `${mergedTime}-${fileName}`,
            MovieSmallImage: formData.get("MovieSmallImage"),
            MovieDuration: formData.get("MovieDuration"),
            MovieScreenshots: Array.from({ length: 5 }, (_, i) => `${mergedTime}-${fileName}_screenshot_${i + 1}.png`),
        });

        console.log("Movie saved successfully");

        return NextResponse.json({ Message: "Success", status: 201 });
      }
      return NextResponse.json({ Message: "Success", status: 201 });
    } catch (error) {
      console.log("Error occurred ", error);
      return NextResponse.json({ Message: "Failed", status: 500 });
    }
  };