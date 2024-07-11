const Restaurant = require("../models/restaurant.model");

//create and save a new restaurant
exports.create = async (req, res) => {
  const { name, type, imageUrl } = req.body;
  //validate data
  if (!name || !type || !imageUrl) {
    res.status(400).send({
      message: "Name,Type or ImageUrl can not be empty !",
    });
  }
  await Restaurant.findOne({
    where: { name: name }
  }).then((restaurant) => {
    if (restaurant) {
      res.status(400).send({
        message: "Restaurant already exists!",
      });
      return;
    }


    const newRestaurant = {
      name: name,
      type: type,
      imageUrl: imageUrl,
    };
    Restaurant.create(newRestaurant)
      .then((data) => {
        res.send(data);
      })
      .catch((error) =>
        res.status(500).send({
          message:
            error.message ||
            "Something error occurred while creating a restaurant",
        })
      );
  });
};


//get all restaurant

exports.getAll = async(req,res)=>{
    await Restaurant.findAll().then((data=>{
        res.send(data)
    }).catch((error) =>{
        res.status(500).send({
            message:
              error.message ||
              "Something error occurred while creating a restaurant",
          })
    })
)
}

exports.getById = async(req,res)=>{
  const id = req.params.id
  await Restaurant.findByPk(id).then((data)=>{
    if(data){
      res.status(404).send({
        message: "No found restaurant with Id : "+ id
    });
    }else{
      res.send(data);
    }
  }).catch((error)=>{
    res.status(500).send({
      message:
              error.message ||
              "Something error occurred while creating a restaurant",
    })
  })
}