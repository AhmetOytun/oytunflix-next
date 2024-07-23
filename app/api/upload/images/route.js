import { writeFile } from "fs/promises";
import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";


export const POST = async (req, res) => {
    const formData = await req.formData();
    const uploadsPath = path.join(process.cwd(), "public", "images");
    const file = formData.get("smallImage");
    const originalName = file.name;
    const time = new Date().getTime();
    const smallImageName = `${time}-${originalName}`;
  
    if (!fs.existsSync(uploadsPath)) {
      await fs.promises.mkdir(uploadsPath, { recursive: true });
    }
  
    if (!file) {
      return NextResponse.json({ error: "No files received." }, { status: 400 });
    }
  
    const buffer = Buffer.from(await file.arrayBuffer());
    try {
        await writeFile(`${uploadsPath}/${smallImageName}`, buffer);
      return NextResponse.json({ smallImage:smallImageName, status: 201 });
    } catch (error) {
      console.log("Error occurred ", error);
      return NextResponse.json({ Message: "Failed", status: 500 });
    }
  };
  