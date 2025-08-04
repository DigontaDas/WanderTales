import multer from "multer";

//using multer to add images in the website
const storage=multer.diskStorage(
    {
        filename: function(req,file,callback){
            callback(null,file.originalname)
        }
    }
)
const upload=multer({storage})

export default upload

