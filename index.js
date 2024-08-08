const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 5000;
const restaurantRouter = require("./routers/restaurant.router");
const authRouter = require("./routers/auth.router");
const db = require("./models/");
const cors = require("cors");
const role = db.Role;

const corsOption = {
  origin: "http://localhost:5173",
};
//dev mode
// db.sequelize.sync({force:false}).then(()=>{
//   initRole();
//   console.log("drop and sync data");
// })

const initRole = () => {
  role.create({ id: 1, name: "user" });
  role.create({ id: 2, name: "moderator" });
  role.create({ id: 3, name: "admin" });
};

// Use middleware
//app.use(express.json);ลืมวงเล็บ
app.use(cors(corsOption));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Use router
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/restaurants", restaurantRouter);

app.get("/", (req, res) => {
  res.send("<h1>Hello Restaurant API</h1>");
});
app.listen(PORT, () => {
  console.log("Listening to http://localhost:" + PORT);
});


