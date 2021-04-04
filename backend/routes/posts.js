const express = require("express");

const router = express.Router();
const multer = require('multer');
const Post = require('../models/post');
let postsCount;

const MIME_TYPE_MAP = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
}

const storage = multer.diskStorage({
  destination: (req , file , cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('invalid mime type');
    if (isValid){
      error = null;
    }
    cb (error , 'backend/images');
  },
  filename: (req , file , cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext =  MIME_TYPE_MAP[file.mimetype];
    cb (null , name + "-" + Date.now() + "." + ext);
  }
});

router.post('' , multer({storage: storage}).single("image") , (req , res , next) => {
  const url = req.protocol + '://' + req.get('host');
  const post = new Post({
    title: req.body.title,
    body: req.body.body,
    imagePath: url + "/images/" + req.file.filename,
  });
  post.save().then((postCreated) => {
    postsCount += 1;
    res.status(201).json({
      message: 'created successfully',
      post: {
        id: postCreated._id,
        title: postCreated.title,
        body: postCreated.body,
        imagePath: postCreated.imagePath
      }
    });
  }).catch(err => {
    console.log(err);
  });
});

router.put('/:id' ,  multer({storage: storage}).single("image") , (req , res , next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + "/images/" + req.file.filename
  }

  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    body: req.body.body,
    imagePath: imagePath
});

Post.updateOne({_id: req.params.id} , post).then(result => {
    res.status(201).json({message: 'Succesfull Update'});
  })
});

router.get('', (req , res , next) => {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.currentPage;
  if (pageSize && currentPage) {
    Post.find().then(posts => {
      postsCount = posts.length;
    });
    Post.find().skip(pageSize * (currentPage - 1)).limit(pageSize).then((documents) => {
      res.status(200).json({
        message:'Posts fetched Successfully',
        posts: documents,
        postsCount: postsCount
      });
    }).catch(err => {
      console.log(err);
    });
  }
});

router.get('/:id', (req ,  res , next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(201).json(post)
    }
    else {
      res.status(404).json({
        message: 'Post not found'
      })
    }
  })
});

router.delete('/:id', (req , res , next) => {
  Post.deleteOne({_id: req.params.id}).then((result) => {
    postsCount -= 1;
    res.status(200).json({message: 'post deleted'});
  }).catch(err => console.log(err))
});


module.exports = router;
