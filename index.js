const express = require('express')
// Using express server
const app = express();
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
app.get("/", function(req, res){
    res.sendFile(path.join(__dirname, 'index.html'))
})

const port = 5000;

// sendFile will go here

app.listen(port, function(err){
    if(err){
        console.log(err, "Error in Listening port");
    }else{
        console.log("Server started at Port: ", 5000);
    }
});