const express=require('express');
const path=require('path');
const mongoose=require('mongoose');
const morgan=require('morgan');
const bodyParser=require('body-parser');
mongoose.connect('mongodb://localhost/nodekb');
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
app.get('/articles/add',(req,res)=>{
        res.render('add_article',{
                title:"Articles",


        });
});
app.post('/articles/add',(req,res)=>{
        let article=new Article();
        article.title=req.body.title;
        article.author=req.body.author;
        article.body=req.body.body;
        article.save((err)=>{
                if(err){
                        console.log(err);
                        return;
                }
                else{
                        res.redirect('/');
                }
        });
});

app.listen(3000,()=>{
        console.log('Server started on port 3000...');
});
