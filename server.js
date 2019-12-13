const express = require('express'); // express is for APIs 
const cors  = require('cors'); //allow interface of frontend and backend
const mongoose = require('mongoose'); //for schema building(tables for dbase)
const passport = require("passport"); // for login
const path = require('path')

require('./passport');



require('dotenv').config(); //allow .env files for variable storage

const app = express();
const PORT = process.env.PORT || 5000; //set the localhost server site

app.set('view-engine', 'ejs');

app.use(cors()); //express uses cors - cross hosting my front and back end
app.use(express.json()); //will tell the app to use the JSON data for express

const dbase = process.env.MONGODB_URI; //connect using my .env file variable
mongoose.connect(dbase || process.env.ATLAS_DBI, {useNewUrlParser: true, useCreateIndex: true}); // depreciation warnings(?) to sort the data in dbase

const connection = mongoose.connection; //set up the connection
connection.once('open', () => {
    console.log("Connected to MongoDB cluster");
})

app.use(express.json());

const auditorRouter = require('./routes/auditors');
app.use('/', auditorRouter);

const registerRouter = require('./routes/register');
app.use('/', registerRouter);

const loginRouter = require('./routes/login');
app.use('/', loginRouter);

const recipeRouter = require('./routes/recipes');
app.use('/recipes', recipeRouter);

const notificationRouter = require('./routes/notifications');
app.use('/notifs', notificationRouter);


//for heroku
if(process.env.NODE_ENV === "production") {
    app.use(express.static('frontEnd/build'));

    app.get('*', (req,res)=> {
        res.sendFile(path.resolve(__dirname, 'frontEnd','build','index.html'))
    })
}

//end heroku

app.listen(PORT, () => {
    console.log(`Node server running on port: ${PORT}`);
})
