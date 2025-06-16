const mongoose = require('mongoose');
const figlet = require('figlet');

function connectMongoDB(DB_URI) {
    mongoose.connect(DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .then(() => figlet("C o n n e c t e d  t o  M o n g o D B  A t l a s", (err, data)=>{
            if(err){
                console.log("Figlet Error.");
            }else{
                console.log(data);
            }
        }))
        .catch(err => console.error("MongoDB connection error:", err))
}

module.exports = connectMongoDB;