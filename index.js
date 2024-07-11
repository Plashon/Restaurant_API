const express = require('express');
const app = express();
const PORT = 5000;

app.get("/",(req,res) => {
    res.send("<h1>Hello restaurant api</h>")
});
app.listen(PORT, ()=>{
    console.log("Listen to http://localhost:"+PORT);
})
