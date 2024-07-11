const express = require("express");
const router = express.Router();
const restaurantController = require("../controllers/restaurant.controller");

//create a restaurant
router.post("/",restaurantController.create);
//getall
router.get("/",restaurantController.getAll)
//getById
router.get("/",restaurantController.getById)
//update
router.put("/",restaurantController.update)

module.exports = router;