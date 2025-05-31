const router =require("express").Router();

router.use("/", require("./swagger"));

router.get("/",(req,res)=>{
    //#swagger.tags= ["Welcome to my new API"]
    res.json({message:"Welcome to my new API"});
});



// ✅ Clientes en ./clientes
router.use("/clientes",require("./clientes"));

// ✅ Agregando la ruta de productos
router.use("/productos", require("./productos"));

module.exports = router;