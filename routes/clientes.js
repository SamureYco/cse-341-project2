const express= require("express");
const router = express.Router();

const usersController= require("../controllers/clientes");

const{ isAuthenticated }= require ("../middleware/authenticate");

router.get("/", usersController.getAll);

router.get("/:id", usersController.getSingle);

router.post("/", isAuthenticated, usersController.createUser);

router.put("/:id", isAuthenticated, usersController.updateUser);

router.delete("/:id", isAuthenticated, usersController.deleteUser);

module.exports = router;