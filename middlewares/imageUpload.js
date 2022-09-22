const multer = require("multer");
const path = require("path");

// Define where to store images
const imageStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        let folder = "";

        if(req.baseUrl.includes("users")){
            folder = "users";
        } else if(req.baseUrl.includes("photos")){
            folder = "photos";
        }

        callback(null, `uploads/${folder}/`);
    },
    filename: (req, file, callback) => {
        callback(null, Date.now() + path.extname(file.originalname));
    }
});

const imageUpload = multer({
    storage: imageStorage,
    fileFilter(req, file, callback){
        // If file is not a png or jpg it should not upload
        if(!file.originalname.match(/\.(png|jpg)$/)){
            return callback(new Error("Por favor, envie uma imagem no formato jpg ou png."));
        };
        callback(undefined, true);
    }
});

module.exports = {imageUpload};