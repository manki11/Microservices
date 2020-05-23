const express = require('express');
const axios= require("axios");
const bodyParser= require('body-parser');

const app= express();
app.use(bodyParser.json());

app.post('/events', async (req, res)=> {
    const {type, data}= req.body;

    if(type === "CommentCreated"){
        const {id, content, postId}= data;
        
        var status = content.search("orange") == -1 ? "accept" : "reject";

        await axios.post('http://localhost:4005/events', {
        type:"CommentModerated",
        data: { postId, id, content, status}});

        console.log("Comment Moderated:", status)
    }

    res.status(201);
})


app.listen(4003,()=> {
    console.log('Listening on port 4003')
});