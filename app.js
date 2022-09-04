const express=require('express')
const app=express()
const bodyparser=require('body-parser')
const ejs = require('ejs');
const mongoose = require('mongoose');

app.use(bodyparser.urlencoded({extended:true}))
app.set('view engine', 'ejs');
app.use(express.static('public'))

mongoose.connect('mongodb://localhost/budgetDB',{useNewUrlParser:true});

const listSchema = new mongoose.Schema({
    teamname: String,
    itemname:String,
    category:String,
    date:String,
    amount:Number
  });
  
const item = mongoose.model("item", listSchema);

app.get('/',(req,res)=>{
    res.render("index");
})
app.get('/raftaar',(req,res)=>{
    // res.render("BudgetManager", {
    //     data: foundItems,
    // });
    let url=req.url;
    let realurl="";
    for(let i=1;i<url.length;i++)
    {
        realurl+=url[i];
    }
    // console.log(realurl);
    item.find({teamname:realurl}, function (err, foundItems) {
        if (err) {
          console.log(err);
        } else {
          res.render("BudgetManager", {
            data: foundItems,
          });
        }
      });
})
app.post('/raftaar',(req,res)=>{
    let url=req.url;
    let realurl="";
    for(let i=1;i<url.length;i++)
    {
        realurl+=url[i];
    }
    // console.log(realurl);
    let itemname=req.body.itemname,category=req.body.category,amount=req.body.amount,teamname=realurl;
    let today = new Date();
    let options = {
        weekday: "long",
        day: "numeric",
        month: "long",
    };
    let date = today.toLocaleDateString("en-US", options);
    let newdata = new item({
        teamname: teamname,
        itemname:itemname,
        category:category,
        date:date,
        amount:amount
    });
    newdata.save();
    // newdata.save().then(()=>{
    //     res.send("This item has been saved to the database")
    // }).catch(()=>{
    //     res.status(400).send("Item was not saved to the databse")
    // })
    res.redirect('/raftaar');
})
// app.get('/',(req,res)=>{
//     res.render("index");
// })
// app.get('/',(req,res)=>{
//     res.render("index");
// })
// app.get('/',(req,res)=>{
//     res.render("index");
// })
// app.get('/',(req,res)=>{
//     res.render("index");
// })
// app.get('/',(req,res)=>{
//     res.render("index");
// })
// app.get('/',(req,res)=>{
//     res.render("index");
// })
// app.post('/update',(req,res)=>{

//     let checkItemid=req.body.update,itemname=req.body.
//     List.updateOne({_id:checkItemid},(err)=>{
//         if(err)
//         {
//             console.log(err)
//         }
//     })
//     res.redirect('/raftaar')
// })
app.post('/delete',(req,res)=>{
    const checkItemid=req.body.delete;
    item.deleteOne({_id:checkItemid},(err)=>{
        if(err)
        {
            console.log(err)
        }
    })
    res.redirect('/raftaar')
})





app.listen(3000)