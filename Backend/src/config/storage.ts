import ImageKit from "@imagekit/nodejs";
import config from "./config.js";
import type { uploads } from "../types/media/imageKit.types.js";

const imagekit = new ImageKit({
  privateKey:config.IMAGEKIT_PRIVATE_KEY,
  
})


export const uploadBuffer = async ({
    buffer,
    fileName,
    folder = "Zentro"
}: uploads) => {

    const result = await imagekit.files.upload({
        file: buffer.toString("base64"),
        fileName,
        folder
    });

    return result;
};

export const deleteFile = async(fileId:string)=>{
    const result = await imagekit.files.delete(fileId)
    return result
}


