var express       = require("express"),
    app           = express(),
    bodyParser    = require("body-parser"),
    mongoose      = require("mongoose"),
    flash         = require("connect-flash"),
    passport      = require("passport"),
    LocalStratagy = require("passport-local"),
    methodOverride = require("method-override"),
    User          = require("./models/user"),
    seedDB        = require("./seeds");
    
//requiring routes
var campgroundRoutes = require("./routes/campgrounds"),
    commentRoutes = require("./routes/comments"),
    indexRoutes = require("./routes/index");

var url = process.env.DATABASEURL || "mongodb://localhost:27017/yelp_camp"    
mongoose.connect(url, {useNewUrlParser: true});    

app.use(bodyParser.urlencoded({extended: true})); 
app.set("view engine", "ejs"); 
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seed the database
// seedDB();

//Passport Configuration
app.use(require("express-session")({
    secret: "YelpCamp App",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratagy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Pass user to all routes
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The YelpCamp server has started!");    
});