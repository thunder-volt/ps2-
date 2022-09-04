const express=require('express')
const app=express()
const bodyparser=require('body-parser')
const ejs = require('ejs');
const mongoose = require('mongoose');
// const Chart = require('chart.js')

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
    let url=req.url;
    let realurl="";
    for(let i=1;i<url.length;i++)
    {
        realurl+=url[i];
    }
    let c1=0,c2=0,c3=0,c4=0,c5=0;
    item.find({}, function (err, foundItemschart) {
        if (err) {
          console.log(err);
        } else {
            for(let i=0;i<foundItemschart.length;i++)
            {
                if(foundItemschart[i].category=="Transport")
                {
                    c1+=foundItemschart[i].amount;
                }
                else if(foundItemschart[i].category=="Marketing")
                {
                    c2+=foundItemschart[i].amount;
                }
                else if(foundItemschart[i].category=="Items")
                {
                    c3+=foundItemschart[i].amount;
                }
                else if(foundItemschart[i].category=="Team members")
                {
                    c4+=foundItemschart[i].amount;
                }
                else
                {
                    c5+=foundItemschart[i].amount;
                }
            }
        }
      })
      
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
    res.redirect('/raftaar');
})

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