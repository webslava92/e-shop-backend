const Router = require("express");
const router = new Router();
const typeController = require("../controllers/typeController");
const roleMiddleware = require("../middleware/roleMiddleware");

router.post("/", typeController.create);
router.get("/", typeController.getAll);
router.get("/:id", typeController.getOne);
router.put("/:id", typeController.edit);
router.delete("/:id", typeController.delete);

module.exports = router;
