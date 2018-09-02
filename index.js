var express=require('express');
var bodyParser = require('body-parser');
var mongojs = require('mongojs');
var cookiesParser = require('cookie-parser');
var urlencoderParser = bodyParser.urlencoded({extended:false});
var expressSession = require('express-session');
var multer=require('multer');
var app=express();
var name;
var port = process.env.port||4545;
var storage=multer.diskStorage({
    destination:function(req,file,callback){
    callback(null,'./upload');
},
    filename:function (req,file,callback) {
    callback(null,file.originalname);
    
}
});
var upload=multer({storage:storage}).single('myfile');

app.use('/static',express.static(__dirname+'/public'));
app.set('view engine','ejs');
app.use(cookiesParser());
app.use(expressSession({
    secret:'MySESSionKeY',
    resave:true,
    saveUninitialized:true
}));
var db = mongojs('meandb',['users']);
var mob =mongojs('meandb',['mobiles']);
var lap =mongojs('meandb',['laptops']);
var mu =mongojs('meandb',['musics']);

app.get("/",function(req,res){
    res.render('index',{
        title:"Welcome To MySite"
        
    });
});

app.get("/register",function(req,res){
    res.render('register',{
        title:"Register Here"
    });
});
app.post('/register',urlencoderParser,function(req,res){
    db.users.insert(req.body,function(err,doc){
        console.log(doc)
        res.redirect("/login");
    });
});

app.get("/login",function(req,res){
    res.render('login',{
        title:"Login Here"
    });
});
app.post('/login',urlencoderParser,function(req,res){
    
    var uid=req.body.userid;
    var upass=req.body.password;
    db.employee.findOne({$and:[{"userid":uid},{"password":upass}]},function(err,doc){
        req.session.userid=uid;
        res.redirect("/home");
    });
    
});

app.get("/mobile",function(req,res){
    if(req.session.userid){
        mob.mobiles.find(function(err,docs){
            console.log(docs);
            res.render('mobile',{
                title:"Add new Mobile",
                username:req.session.userid,
                mobilelist:docs
                
            });
            
        });
    }
    else{
        res.send("<script>alert('Please Login to continue')</script>");
    }
});
app.get('/uploadimage',function(req,res){
    if(req.session.userid){
        res.render('uploadimage');
    }
});
app.post('/uploadimage',function(req,res){  
    upload(req,res,function(err) {  
        if(err) {  
            return res.end("Error uploading file.");  
        }  
        
        res.end("File is uploaded successfully!");  
         name = res.req.file.filename;
        console.log(name); 
    });  
    
    
});  
app.post('/mobile',urlencoderParser,function(req,res){
    dat=req.body;
    fulld={dat,name};
    name="";
    console.log(fulld);
    mob.mobiles.insert(fulld,function(err,doc){
        // console.log(doc);
        res.redirect("/mobile");
    });
});

app.get("/laptop",function(req,res){
    if(req.session.userid){
        lap.laptops.find(function(err,docs){
            console.log(docs);
            res.render('laptop',{
                title:"Add new Laptop",
                username:req.session.userid,
                laptoplist:docs
                
            });
            
        });
    }
    else{
        res.send("<script>alert('Please Login to continue')</script>");
    }
});

app.post('/laptop',urlencoderParser,function(req,res){
    lap.laptops.insert(req.body,function(err,doc){
        console.log(doc)
        res.redirect("/laptop");
    });
});


app.get("/music",function(req,res){
    if(req.session.userid){
        mu.musics.find(function(err,docs){
            console.log(docs);
            res.render('music',{
                title:"Add new Music System",
                username:req.session.userid,
                musiclist:docs
                
            });
            
        });
    }
    else{
        res.send("<script>alert('Please Login to continue')</script>");
    }
});

app.post('/music',urlencoderParser,function(req,res){
    mu.musics.insert(req.body,function(err,doc){
        console.log(doc)
        res.redirect("/music");
    });
});





app.get("/home",function(req,res){
    if(req.session.userid){
        res.render('home',{
            title:"Home Page",
            username:req.session.userid
        });
    }
    else{
        res.send("<script>alert('Please Login to continue')</script>");
    }
});

app.get("/about",function(req,res){
    if(req.session.userid){
        res.render('about',{
            title:"About Page",
            username:req.session.userid
        });
    }
    else{
        res.send("<script>alert('Please Login to continue')</script>");
    }
});

app.get("/contact",function(req,res){
    if(req.session.userid){
        res.render('contact',{
            title:"Contact Page",
            username:req.session.userid
        });
    }
    else{
        res.send("<script>alert('Please Login to continue')</script>");
    }
});

app.get("/gallery",function(req,res){
    if(req.session.userid){
        res.render('gallery',{
            title:"Gallery Page",
            username:req.session.userid
        });
    }
    else{
        res.send("<script>alert('Please Login to continue')</script>");
    }
});

app.get("/feedback",function(req,res){
    if(req.session.userid){
        res.render('feedback',{
            title:"Feedback Page",
            username:req.session.userid
        });
    }
    else{
        res.send("<script>alert('Please Login to continue')</script>");
    }
});


app.get("/update/:id",function(req,res){
    var i = req.params.id;
    console.log(i);
    mob.mobiles.findOne({id:i},function(err,doc){
        console.log(doc);
        res.render('update',{
            title:"Modify Mobile",
            mobile:doc
        });
    });
    
});

app.post('/update/:id',urlencoderParser,function(req,res){
    var i = req.params.id;
    console.log(i);    
    mob.mobiles.findAndModify({
        query:{id:i},
        update:{$set:{company:req.body.company,Type:req.body.Type,city:req.body.process,salary:req.body.price}},
        new:true
    },function(err,doc){
        console.log(doc);
        res.redirect("/mobile");
    });

});



app.get("/retrieve/:id",function(req,res){
    var i = req.params.id;
    console.log(i);
    mob.mobiles.findOne({id:i},function(err,doc){
        console.log(doc);
        res.render('retrieve',{
            title:"Mobile Details",
            mobile:doc
        });
    });
});



app.get("/delete/:id",function(req,res){
    var i = req.params.id;
    console.log(i);
    mob.mobiles.findOne({id:i},function(err,doc){
        console.log(doc);
        res.render('delete',{
            title:"Are You sure you want to delete this employee",
            mobile:doc
        });
    });
});
app.post('/delete/:id',urlencoderParser,function(req,res){
    console.log(req.body.id);
    mob.mobiles.remove({id:req.body.id},function(err,doc){
        console.log(doc);
        res.redirect("/mobile");
    });
});



/////////////////////////////////////////////////////

app.get("/updatelaptop/:id",function(req,res){
    var i = req.params.id;
    console.log(i);
    lap.laptops.findOne({id:i},function(err,doc){
        console.log(doc);
        res.render('updatelaptop',{
            title:"Modify laptop",
            laptop:doc
        });
    });
    
});

app.post('/updatelaptop/:id',urlencoderParser,function(req,res){
    var i = req.params.id;
    console.log(i);    
    lap.laptops.findAndModify({
        query:{id:i},
        update:{$set:{company:req.body.company,Type:req.body.Type,city:req.body.process,salary:req.body.price}},
        new:true
    },function(err,doc){
        console.log(doc);
        res.redirect("/laptop");
    });

});



app.get("/retrievelaptop/:id",function(req,res){
    var i = req.params.id;
    console.log(i);
    lap.laptops.findOne({id:i},function(err,doc){
        console.log(doc);
        res.render('retrievelaptop',{
            title:"laptop Details",
            laptop:doc
        });
    });
});



app.get("/deletelaptop/:id",function(req,res){
    var i = req.params.id;
    console.log(i);
    lap.laptops.findOne({id:i},function(err,doc){
        console.log(doc);
        res.render('deletelaptop',{
            title:"Are You sure you want to delete this laptop",
            laptop:doc
        });
    });
});
app.post('/deletelaptop/:id',urlencoderParser,function(req,res){
    console.log(req.body.id);
    lap.laptops.remove({id:req.body.id},function(err,doc){
        console.log(doc);
        res.redirect("/laptop");
    });
});
////////////////////////////////////

app.get("/updatemusic/:id",function(req,res){
    var i = req.params.id;
    console.log(i);
    mu.musics.findOne({id:i},function(err,doc){
        console.log(doc);
        res.render('updatemusic',{
            title:"Modify Music",
            music:doc
        });
    });
    
});

app.post('/updatemusic/:id',urlencoderParser,function(req,res){
    var i = req.params.id;
    console.log(i);    
    mu.musics.findAndModify({
        query:{id:i},
        update:{$set:{company:req.body.company,Type:req.body.Type,city:req.body.process,salary:req.body.price}},
        new:true
    },function(err,doc){
        console.log(doc);
        res.redirect("/music");
    });

});



app.get("/retrievemusic/:id",function(req,res){
    var i = req.params.id;
    console.log(i);
    mu.musics.findOne({id:i},function(err,doc){
        console.log(doc);
        res.render('retrievemusic',{
            title:"Music Details",
            music:doc
        });
    });
});



app.get("/deletemusic/:id",function(req,res){
    var i = req.params.id;
    console.log(i);
    mu.musics.findOne({id:i},function(err,doc){
        console.log(doc);
        res.render('deletemusic',{
            title:"Are You sure you want to delete this music",
            music:doc
        });
    });
});
app.post('/deletemusic/:id',urlencoderParser,function(req,res){
    console.log(req.body.id);
    mu.musics.remove({id:req.body.id},function(err,doc){
        console.log(doc);
        res.redirect("/music");
    });
});







app.get("/logout",function(req,res){
    req.session.destroy();
    res.redirect("/");
});


app.listen(port);
console.log("Application is running on http://127.0.0.1:3000");