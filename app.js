//jshint esversion:6
const express=require('express');
const bodyParser=require('body-parser');
const ejs=require('ejs');
const mongoose=require('mongoose');
const app=express();
var async = require('async');

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());


mongoose.connect('mongodb+srv://admin-michael:admin123@cluster0-hddv9.mongodb.net/test2020DB',{useNewUrlParser:true,useUnifiedTopology: true});

mongoose.set("useCreateIndex",true);

const infoSchema=new mongoose.Schema({
  name:{type:String},
  subject:{type:String},
  details:{type:String}

});
const Info=mongoose.model("Info",infoSchema);

app.get('/',function(req,res){
  Info.find({},function(err,messages){
    res.render('addForm',{title:'Home',msg:messages});
  });

});
app.post('/',function(req,res,next){
var newdata=new Info({
  name:req.body.name,
  subject:req.body.subject,
  details:req.body.details

});

res.redirect('/');
});

app.post('/addForm',function(req,res){
 var newMsg=new Info();
    newMsg.name=req.body.name;
    newMsg.subject=req.body.subject;
    newMsg.details=req.body.details;
    newMsg.save(function(err){
      if (err) {
        console.log(err);
      }
      res.redirect('/');
    });
});
app.post("/deleteMessage",function(req,res){
  const messageID=req.body.btnDelete;
  Info.findByIdAndDelete(messageID,function(err){
    if(err){console.log(err);
    }else{

      console.log("Successfully Deleted");
      res.redirect("/");

  }
});
});

app.get('/update/:id',function(req,res){
  Info.findById(req.params.id,function(err,data){
    if (err) {
      console.log(err);
    }
      res.render('update',{title:"Edit Message",info:data});
  });

});
app.post('/update/:id',function(req,res){
  var editData={
    name:req.body.name,
    subject:req.body.subject,
    details:req.body.details

  }

  Info.findByIdAndUpdate(req.params.id,editData,function(err){
    if (err) {
      res.redirect("update/"+req.params.id);
    }
    res.redirect("/");
  });
  });


app.listen(process.env.PORT||3000,function(){
  console.log('app is running on 3000');
});
