const router =require("express").Router();

router.use("/", require("./swagger"));

router.get("/",(req,res)=>{
    //#swagger.tags= ["Hello world"]
    res.json({message:"Hello World"});
});



// ✅ Users en /users
router.use("/users",require("./users"));

module.exports = router;