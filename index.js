const express = require('express');
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 9000;
const restaurantRouter = require("./routers/restaurant.router");

//middelware
app.use(express.json);
app.use(express.urlencoded({extended:true}));

//use router
app.use("/api/v1/restaurant", restaurantRouter)


app.get("/",(req,res) => {
    res.send("<h1>Hello restaurant api</h>")
});
app.listen(PORT, ()=>{
    console.log("Listen to http://localhost:"+PORT);
})
