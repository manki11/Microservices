const express = require('express');
const bodyParser= require('body-parser');
const cors= require('cors');

const app= express();
app.use(bodyParser.json());
app.use(cors());

const posts={}

app.get('/posts', (req, res)=> {
    res.status(201).send(posts)
})

app.post('/events', (req, res)=> {
    const {type, data}= req.body;

    if(type === "PostCreated"){
        const {id, title}= data;
        posts[id] = {
            id,
            title,
            comments:[]
        }; 
    }

    if(type === "CommentCreated"){
        const {id, content, postId, status}= data;
        posts[postId].comments.push({
            id,
            content,
            status
        })
    }

    if(type=== "CommentUpdated"){
        const {id, postId}= data;

        var foundIndex = posts[postId].comments.findIndex(c => c.id === id);
        posts[postId].comments[foundIndex] = data;

        console.log(posts[postId])
        console.log(data)
    }

    res.status(201);
})


app.listen(4002,()=> {
    console.log('Listening on port 4002')
});