const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");

const listingController = require("../controllers/listing.js");
const multer  = require('multer');
const { storage } = require("..//cloudConfig.js");
const upload = multer({ storage });


    const ValidateReview = (req,res,next)=>{
        let {error} = reviewSchema.validate(req.body);
        
        if(error){
            let errMsg = error.details.map((el) => el.message).join(",");
            throw new ExpressError(400 , errMsg);
        }else{
            next();
        }
        };
        
router
.route("/")
.get(wrapAsync(listingController.index))

.post(
     isLoggedIn,
    
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing)
);



//New route
 
router.get("/new", isLoggedIn,listingController.renderNewForm);
 


router.route("/:id")
.get( wrapAsync(listingController.showListing)
)
.put(
 isLoggedIn,
 isOwner,
 upload.single("listing[image]"),
 validateListing,
 wrapAsync(listingController.updateListing)
)
.delete(
 isLoggedIn,
 isOwner,
 wrapAsync(listingController.destroyListing)
);

 
 
 //Edit Route
 
 router.get("/:id/edit",
 isLoggedIn,
 isOwner,
 wrapAsync(listingController.renderEditForm)
);
 
 
 
 








module.exports = router;
 
 //reviews
 //post route
 
 router.post(
     "/listings/:id/reviews", 
 ValidateReview, 
 wrapAsync(async(req,res) =>{
     let listing = await Listing.findById(req.params.id);
     let newReview = new Review(req.body.review);
 
     listing.reviews.push(newReview);
 
     await newReview.save();
     await listing.save();
 
 
 
     res.redirect(`/listings/${listing._id}`);
 
 }));
 
 //Delete Review Route
 
 router.delete("/listings/:id/reviews/:reviewId",wrapAsync(async(req,res)=>{
     let{id,reviewId}=req.params;
 
     await Listing.findByIdAndUpdate(id,{$pull: {reviews:reviewId}});
     await Review.findByIdAndDelete(reviewId);
 
     res.redirect(`/listings/${id}`);
 })
 );

 
 
 