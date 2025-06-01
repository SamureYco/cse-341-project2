const passport = require("passport");

const router =require("express").Router();

router.use("/", require("./swagger"));

router.get("/",(req,res)=>{
    //#swagger.tags= ["Welcome to my new API"]
    res.json({message:"Welcome to my new API"});
});

router.get("/login", passport.authenticate("github", { scope: ["user:email"] }), (req,res) => {});

router.get("/logout", function(req, res, next) {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect("/");
    });
});
/*router.get("/logout", function(req,res, next){
    req.logout(function(req,res,next){
        req.logout(function(err){
            if(err){ return next(err);}
            res.redirect("/")
        })
    })
});*/

// ✅ Clientes en ./clientes
router.use("/clientes",require("./clientes"));

// ✅ Agregando la ruta de productos
router.use("/productos", require("./productos"));

module.exports = router;