var bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    mongoose = require("mongoose"),
    express = require("express"),
    sanitizer = require("express-sanitizer"),
    app = express();

//App Config    
mongoose.connect("mongodb+srv://Anshuman:Anshu2121@anshumancluster-uabpz.mongodb.net/restful_blog?retryWrites=true&w=majority",{ useNewUrlParser: true });
app.set("view engine","ejs");
app.use(methodOverride("_method"));
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(sanitizer());
mongoose.set('useFindAndModify', false);

//Mongoose Config
var blogSchema = new mongoose.Schema({
    title: String,
    image: {type: String, default: "https://uwosh.edu/facilities/wp-content/uploads/sites/105/2018/09/no-photo-768x768.png"},
    body: String,
    created : { type: Date, default: Date.now}
});

var blog = mongoose.model("blog", blogSchema);

// blog.create({
//     title: "First blog",
//     image: "https://www.itvedant.com/wp-content/uploads/2013/03/Hello-world-in-all-programming-languages.png",
//     body: "This is the first Post",

// });

//Restful Routes
//Index Route
app.get("/blogs",function (req,res) { 
    blog.find({}, function(err, data){
        if(err){
            console.log(err);
        } else{
            res.render("index",{data:data});
        }
    });
 });

 //New Route
 app.get("/blogs/new", function(req, res){
     res.render("new");
 });

 //Create Route
 app.post("/blogs", function(req,res){
     //create blog
     req.body.blog.body = req.sanitize(req.body.blog.body);
    blog.create(req.body.blog, function(err, data){
        if(err){
            console.log(err);
        } else{
            res.redirect("/blogs");
        }
    });
});

//Show Route
app.get("/blogs/:id", function (req, res) {
    blog.findById(req.params.id, function(err, data){
        if(err){
            res.redirect("/blogs");
        } else{
            res.render("show", {data : data});
        }
    });
  });

app.get("/", function(req, res){
    res.redirect("/blogs");
});

//Edit Route
app.get("/blogs/:id/edit", function(req, res){
    blog.findById(req.params.id, function(err, data){
        if(err){
            console.log(err);
        } else {
            res.render("edit", {data: data});
        }
    });
});

app.put("/blogs/:id", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, data){
        if(err){
            console.log(err);
        } else{
            res.redirect("/blogs/" + req.params.id);
        }
    })
});

//Delete Route
app.delete("/blogs/:id", function(req, res){
    blog.findByIdAndRemove(req.params.id, function(err){
        if (err) {
            res.redirect("/blogs");
          } else {
            res.redirect("/blogs");
          }
        
        });
});

 app.listen(80, function(){ 
     console.log("FirstBlog Site is started")
  });