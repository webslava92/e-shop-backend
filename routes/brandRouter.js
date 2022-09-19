const Router = require("express");
const router = new Router();
const brandController = require("../controllers/brandController");
const roleMiddleware = require("../middleware/roleMiddleware");

router.post("/", brandController.create);
router.get("/", brandController.getAll);
router.get("/:id", brandController.getOne);
router.put("/:id", brandController.edit);
router.delete("/:id", brandController.delete);

module.exports = router;
