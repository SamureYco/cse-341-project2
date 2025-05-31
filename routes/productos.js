const express = require("express");
const router = express.Router();
const productosController = require("../controllers/productos");

router.get("/", productosController.getAll);

router.get("/:id", productosController.getSingle);

router.post("/", productosController.createUser);

router.put("/:id", productosController.updateUser);

router.delete("/:id", productosController.deleteUser);

module.exports = router;