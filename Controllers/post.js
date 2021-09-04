const Post = require('../models/Post');
exports.getPosts = async (req,res)=>{
    try{
      const posts = await Post.find();
      res.staus(200).json(posts);  
    }catch(err){
        res.json({message:err});
    }
  };

  exports.getPostsById = async (req,res)=>{
    try{
        const post = await Post.findById(req.params.postId);
    res.status(200).json(post);
    }catch(err){
        res.json({message:err});
    }
    
};

exports.deletePostById = async (req,res)=>{
    try{
        const removedPost = await Post.remove({_id:req.params.postId});
        res.status(200).json(removedPost);
    }catch(err){
        res.json({ message : err});
    }
};

exports.updatePostById =  async (req,res) => {
    try{
        const updatedPost = await Post.updateOne(
            {_id:req.params.postId},
            { $set: { title : req.body.title,
            description:req.body.description}}
        );
        res.json(updatedPost);
    }catch(err){
        res.json({ message : err});
    }  
};

exports.createNewPost = async(req,res)=>{
    const post = new Post({
        title:req.body.title,
        description:req.body.description
    });

    try{
        const savedPost = await post.save();
        res.json(savedPost);
    }catch(err){
        res.json({ message : err});
    }

   
};

 