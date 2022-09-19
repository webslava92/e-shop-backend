const Router = require("express");
const router = new Router();
const basketController = require("../controllers/basketController");

router.get("/", basketController.getOne);
router.put("/product/:productId/:quantity", basketController.append);
// router.put("/product/:productId/:quantity/inc", basketController.inc);
// router.put("/product/:productId/:quantity/dec", basketController.dec);
// router.put("/product/:productId/remove", basketController.remove);
router.put("/clear", basketController.clear);

module.exports = router;
