const { application } = require('express');
const mongoose = require('mongoose'); 

const dogSchema = new mongoose.Schema({
    name: String, 
    breed: String, 
    doesTricks: Boolean, 
}); 

const Dog = mongoose.model("Dog", dogSchema); 

module.exports = Dog; 

