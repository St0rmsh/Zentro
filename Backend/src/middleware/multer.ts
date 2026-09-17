import multer from "multer";

const storage = multer.memoryStorage()


const uploadFile = multer({
    storage:storage,
    limits:{
        fileSize: 50*1024*1024
    },
    fileFilter(_ ,file ,cb ) {
        if(file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")){
            cb(null,true)
        }else{
            cb(new Error("Invalid file type"))
        }
    },
})

export default uploadFile