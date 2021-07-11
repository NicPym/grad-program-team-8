const router = require('express').Router();
const { render } = require('ejs');
const { Blogs } = require('../data/data');
module.exports = router;

router.get('/',(req,res) =>{
    res.render('articles/my-articles',{articles: Blogs})
});

router.get('/new',(req,res) =>{
    res.render('articles/new-article')
});
router.get('/edit',(req,res) =>{
    res.render('articles/edit-article',{articles: Blogs})
});

// router.get('/edit/id',(req,res) =>{
//     res.render('articles/edit-article',{articles: Blogs})
// });

router.get('/:id',(req,res) =>{
   // res.send(req.params.id);
    const art = Blogs.find(x=>{
        return x.id =req.params.id;
    });
    //console.log(art);
    if(art == null) res.redirect('/articles/my-articles')
    res.render('articles/show-article', {article: art});
});


router.post('/',(req,res) =>{
    const obj = { id:"asdfa2f32342334fdasfd",
    title:req.body.title,
    createdAt:new Date(),
    description: req.body.description,
    markdown: "This is the first markdown"
  };
  Blogs.push(obj);
  res.redirect(`articles/${obj.id}`);
});
