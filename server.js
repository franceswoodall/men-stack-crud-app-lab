// file imports
const express = require('express'); 
const dotenv = require('dotenv'); 
dotenv.config(); 
const mongoose = require('mongoose'); 
const methodOverride = require('method-override'); 
const morgan = require('morgan'); 

const app = express();

mongoose.connect(process.env.MONGODB_URI); 
mongoose.connection.on('connected', () => {
    console.log(`connected to MongoDB ${mongoose.connection.name}`); 
}); 

const Dog = require('./models/dog.js'); 

app.use(express.urlencoded({ extended: false })); 
app.use(methodOverride('_method')); 
app.use(morgan('dev')); 

// routes
app.get('/', async (req, res) => {
    res.render('index.ejs'); 
});

app.get('/dogs', async (req, res) => {
    const allDogs = await Dog.find(); 
    res.render('dogs/index.ejs', { dogs: allDogs });
}); 

app.get('/dogs/new', (req, res) => {
    res.render('dogs/new.ejs');
}); 

app.get('/dogs/:dogId', async (req, res) => {
    const foundDog = await Dog.findById(req.params.dogId); 
    res.render('dogs/show.ejs', {dog:foundDog}); 
}); 

app.post('/dogs', async (req, res) => {
    if (req.body.doesTricks === 'on') {
        req.body.doesTricks = true; 
    } else {
        req.body.doesTricks = false; 
    }
    await Dog.create(req.body); 
    res.redirect('/dogs'); 
}); 

app.delete('/dogs/:dogId', async (req, res) => {
    await Dog.findByIdAndDelete(req.params.dogId); 
    res.redirect('/dogs'); 
}); 

app.get('/dogs/:dogId/edit', async (req, res) => {
    const foundDog = await Dog.findById(req.params.dogId); 
    res.render('dogs/edit.ejs', {
        dog: foundDog, 
    });  
}); 

app.put('/dogs/:dogId', async (req, res) => {
    if (req.body.doesTricks === 'on') {
        req.body.doesTricks = true;
    } else {
        req.body.doesTricks = false; 
    }; 
    await Dog.findByIdAndUpdate(req.params.dogId, req.body); 
    res.redirect(`/dogs/${req.params.dogId}`); 
})

app.listen(3000, () => {
    console.log('listening on port 3000'); 
});

