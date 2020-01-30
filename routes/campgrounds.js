var express    = require("express");
var router     = express.Router();
var Campground = require("../models/campgrounds");
var mongoose   = require("mongoose");
var middleware = require("../middleware");
mongoose.set('useFindAndModify', false);
//INEX ROUTE - show all campgrounds
router.get("/", function(req, res){
	//Get all campgrounds from DB
	Campground.find({},function(err, allCampgrounds){
		if(err){
			console.log(err);
		}else {
			res.render("campgrounds/index", {campgrounds:allCampgrounds, page: 'campgrounds'});
		}
	});
	
});
//CREATE ROUTE - add a new campground to the DB
router.post("/",middleware.isLoggedIn, function(req, res){
	var name = req.body.name;
	var price = req.body.price;
	var image = req.body.image;
	var desc = req.body.description;
	var author = {
		id:req.user._id,
		username:req.user.username
	}
	var newCampground  = {name:name,price:price, image:image, description:desc, author:author};
// create a new campground here and store it in the DB
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err);
		}else {
			// redirect us back to campground page
			res.redirect("/campgrounds");
		}
	});
	
});
//NEW - Show form to create a new campground
router.get("/new",middleware.isLoggedIn, function(req,res){
	res.render("campgrounds/new");
});
// SHOW -- show us more information about one campground
router.get("/:id",function(req,res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampGround){
		if(err){
			console.log(err);
		}else {
			res.render("campgrounds/show", {campground:foundCampGround});
		}
	});
	
});

// EDIT ROUTE 
router.get("/:id/edit",middleware.checkCampgroundOwnership, function(req,res){
		Campground.findById(req.params.id, function(err,foundCampground){
		res.render("campgrounds/edit",{campground:foundCampground});	
	});
});
// UPDATE ROUTE 

router.put("/:id", middleware.checkCampgroundOwnership,function(req,res){
	//find and update the correct campground
Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		}else {
				//redirect somewhere(show page)
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

//DESTROY CAMPGROUND ROUTE 
router.delete("/:id",middleware.checkCampgroundOwnership, function(req,res){
		Campground.findByIdAndRemove(req.params.id, function(err){
			if(err){
				res.redirect("/campgrounds");
			} else {
				res.redirect("/campgrounds");
			}
		});
});

module.exports = router;