const Router = require("express");
const router = new Router();
const productController = require("../controllers/productController");
const roleMiddleware = require("../middleware/roleMiddleware");

//roleMiddleware("ADMIN"),
router.post("/", productController.create);
router.get("/", productController.getAll);
router.get("/:id", productController.getOne);
router.put("/:id", productController.edit);
router.delete("/:id", productController.delete);

module.exports = router;
