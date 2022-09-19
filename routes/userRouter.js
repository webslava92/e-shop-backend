const Router = require("express");
const router = new Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const { body } = require("express-validator");

router.post(
  "/registration",
  body("email").isEmail(),
  body("phone").isMobilePhone("ru-RU"),
  body("password").isLength({ min: 3, max: 32 }),
  userController.registration
);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.get("/activate/:link", userController.activate);
router.post("/refresh", userController.refresh);
router.get("/", authMiddleware, userController.getAll);
router.get("/:id", userController.getOne);
router.put("/:id", userController.edit);
router.delete("/:id", userController.delete);

module.exports = router;
