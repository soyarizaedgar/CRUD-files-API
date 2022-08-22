const express =  require('express');
const cors =  require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(cors());
const port = 4000;

require("../src/routes/routes.users")(app);
require("../src/routes/routes.files")(app);

app.use('/public',express.static('public'));

const pool = require('./models/db')

app.listen(port, ()=>{
    console.log("It's working");
});

const adminpath = 'public/00000000'
const adminpathfiles = 'public/00000000/files'
const adminpathprofile = 'public/00000000/profile'

if (!fs.existsSync(adminpath)){
    fs.mkdirSync(adminpath,(err)=>{
        if (err) {
            return console.error(err);
        }
    });
}
if (!fs.existsSync(adminpathfiles)){
    fs.mkdirSync(adminpathfiles,(err)=>{
        if (err) {
            return console.error(err);
        }
    });
}
if (!fs.existsSync(adminpathprofile)){
    fs.mkdirSync(adminpathprofile,(err)=>{
        if (err) {
            return console.error(err);
        }
    });
}
