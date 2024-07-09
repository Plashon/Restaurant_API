require("dotenv").config();

module.exports = {
    HOST: "ep-square-night-a1yhcsnz-pooler.ap-southeast-1.aws.neon.tech",
    USER: "default",
    PASSWORD:"etzSGy0smAE9",
    DB:"verceldb",
    dialect: "postgres",
    pool:{
        max:5,
        min:0,
        acquire:30000,
        idle:10000,
    },
};