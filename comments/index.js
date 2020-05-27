const express = require('express');
const bodyParser= require('body-parser');
const {randomBytes}= require('crypto');
const axios= require("axios");
const cors= require('cors');

const app= express();
app.use(bodyParser.json())
app.use(cors())

const commentsByPostId= {};

app.get('/posts/:id/comments', (req,res)=> {

    res.send(commentsByPostId[req.params.id] || []);
})

app.post('/posts/:id/comments', async (req,res)=>{
    const commentId= randomBytes(4).toString('hex');
    const {content}= req.body;
    
    const comments= commentsByPostId[req.params.id] || [];
    comments.push({id: commentId, content, status: "pending"})
    
    commentsByPostId[req.params.id]= comments;

    await axios.post('http://event-bus-srv:4005/events', {
        type:"CommentCreated",
        data: {
            postId: req.params.id,
            id: commentId, 
            content,
            status: "pending"
        }
    });

    res.status(201).send(comments);
})

app.post('/events', async (req,res)=> {
    console.log("Recieved Event", req.body.type)

    const {type, data}= req.body;

    if(type === "CommentModerated"){
        const {id, content, status, postId}= data;
        const comments= commentsByPostId[postId] || [];

        var foundIndex = comments.findIndex(c => c.id === id);
        comments[foundIndex].status = status;

        await axios.post('http://event-bus-srv:4005/events', {
        type:"CommentUpdated",
        data: { postId, id, content, status}
    });
    }

    res.status(201).send({});
})

app.listen(4001,()=> {
    console.log('Listening on port 4001')
});