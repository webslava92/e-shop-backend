const Router = require("express");
const router = new Router();
const userRouter = require("./userRouter");
const basketRouter = require("./basketRouter");
const typeRouter = require("./typeRouter");
const brandRouter = require("./brandRouter");
const productRouter = require("./productRouter");

router.use("/user", userRouter);
router.use("/basket", basketRouter);
router.use("/type", typeRouter);
router.use("/brand", brandRouter);
router.use("/product", productRouter);

module.exports = router;
