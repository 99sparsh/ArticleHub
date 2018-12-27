const express=require('express');
const path=require('path');
const mongoose=require('mongoose');
const morgan=require('morgan');
const bodyParser=require('body-parser');
const expressValidator=require('express-validator');
const flash=require('connect-flash');
const session=require('express-session');
const config=require('./config/database');
const passport=require('passport');

mongoose.connect(config.database);
let db=mongoose.connection;
db.once('open',()=>{
        console.log("Connected succesfully to MongoDB server...");
});
db.on('error',(err)=>{
        console.log(err);
});
const app=express();
//console request logger
app.use(morgan('dev'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
//public folder
let Article=require('./models/article');
app.set('views',path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname, 'public')));

//express session middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

//express messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//express validator middleware
app.use(expressValidator());

//passport config
require('./config/passport')(passport);
//passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*',(req,res,next)=>{
        res.locals.user=req.user || null;
        next();
});

app.set('view engine','pug');
app.get('/',(req,res)=>{
        Article.find({},(err,articles)=>{
                if(err){ console.log(err);}
                else{
                res.render('index',{
                        title:"Articles",
                        articles: articles
                });
        }

        });
});

//route files
let articles=require('./routes/articles');
let users=require('./routes/users');
app.use('/articles',articles);
app.use('/users',users);

//start server
app.listen(3000,()=>{
        console.log('Server started on port 3000...');
});
