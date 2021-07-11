const { render } = require('ejs');
const express = require('express');
const articleRouter = require('./routes/index');

const { Blogs } = require('./data/data');

const app = express();

require('dotenv').config();

app.set('view engine','ejs'); //used to renger html, convert eje to html

app.use(express.urlencoded({ extended: false}));//get access to the fields in the form eg req.body.title

app.use('/articles',articleRouter);
app.use('/',(req,res) =>{
    res.render('blog-articles',{articles: Blogs})
});




app.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}`));