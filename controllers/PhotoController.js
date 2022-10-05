const Photo = require("../models/Photo");
const User = require("../models/User");


const  mongoose = require("mongoose");
const { use } = require("../routes/PhotoRoutes");

// Insert a photo and relate it to a user
const insertPhoto = async(req, res) => {
    const {title} = req.body;
    const image = req.file.filename;

    const reqUser = req.user;

    const user = await User.findById(reqUser._id);

    const newPhoto = await Photo.create({
        image,
        title,
        userId: user._id,
        userName: user.name,

    });

    if(!newPhoto){
        res.status(422).json({errors: ["Algo deu errado, por favor, tente novamente mais tarde."]});
        return;
    }

    res.status(201).json(newPhoto);
}

const deletePhoto = async(req, res) => {
    const {id} = req.params;

    const reqUser = req.user;

    try {

        const photo = await Photo.findById(mongoose.Types.ObjectId(id));

        if(!photo){
            res.status(422).json({errors: ["A foto não existe."]});
            return;
        }
    
        if (!photo.userId.equals(reqUser._id)) {
            res.status(422).json({ errors: ["Ocorreu um erro, tente novamente mais tarde."] });
            return;
        }
    
        await Photo.findByIdAndDelete(photo._id);
    
        res.status(200).json({id: photo._id, message: "Foto excluída com sucesso."});

    } catch (error) {
        
        res.status(422).json({ errors: ["A foto não existe."] });
        return;

    }
}

const getAllPhotos = async(req, res) => {
    
    const photos = await Photo.find({}).sort([["createdAt", -1]]).exec();

    res.status(200).json(photos);
}

const getUserPhotos = async(req, res) => {

    const {id} = req.params;

    const photos = await Photo.find({userId: id}).sort([["createdAt", -1]]).exec();

    res.status(200).json(photos);
}

const getPhotoById = async(req, res) => {

    const {id} = req.params;

    const photo = await Photo.findById(mongoose.Types.ObjectId(id));

    if(!photo){
        res.status(422).json({ errors: ["A foto não existe."] });
        return;
    }   

    res.status(200).json(photo);
}

const updatePhoto = async(req, res) => {

    const {id} = req.params;
    const {title} = req.body;

    const reqUser = req.user;

    const photo = await Photo.findById(id);

    if (!photo){
        res.status(422).json({ errors: ["A foto não existe."] });
        return;
    }

    if (!photo.userId.equals(reqUser._id)){
        res.status(422).json({ errors: ["Você não pode editar a foto de outro usuário."] });
        return;
    }

    if (title){
        photo.title = title;
    }

    await photo.save();

    res.status(200).json({photo, message: "Foto atualizada."});

}

const likePhoto = async(req, res) => {
    
    const {id} = req.params;
    const reqUser = req.user;

    const photo = await Photo.findById(id);

    if (!photo){
        res.status(422).json({ errors: ["A foto não existe."] });
        return;
    }

    if(photo.likes.includes(reqUser._id)){
        res.status(422).json({ errors: ["Você já curtiu essa foto."] });
        return;
    }

    photo.likes.push(reqUser._id);

    photo.save();

    res.status(200).json({photoId: id, userId: reqUser._id, message: "Foto curtida."});

}

const commentPhoto = async(req, res) => {

    const {id} = req.params;
    const {comment} = req.body;
    const reqUser = req.user;

    const photo = await Photo.findById(id);
    const user = await User.findById(reqUser._id);

    if (!photo){
        res.status(422).json({ errors: ["A foto não existe."] });
        return;
    }

    const userComment = {
        comment,
        userName: user.name,
        userImage: user.profileImage,
        userId: user._id
    }

    photo.comments.push(userComment);
    
    await photo.save();

    res.status(200).json({comment: userComment, message: "O comentário foi adicionado."});

}

const searchPhotos = async(req, res) => {

    const {q} = req.query;

    const photos = await Photo.find({title: new RegExp(q, "i")}).exec();

    res.status(200).json(photos);
}

module.exports = {
    insertPhoto,
    deletePhoto,
    getAllPhotos,
    getUserPhotos,
    getPhotoById,
    updatePhoto,
    likePhoto,
    commentPhoto, 
    searchPhotos
}