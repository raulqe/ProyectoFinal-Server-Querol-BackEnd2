import { Router } from "express";
import { productControllers } from "../controllers/products.controller.js";
import { checkProductData } from "../middlewares/checkProductData.middleware.js";
import { passportCall } from "../middlewares/passportCall.middelware.js";
import { authorization } from "../middlewares/authotirization.middleware.js";


const router = Router();

router.get("/", productControllers.getAll);

router.get("/:pid", productControllers.getById);

router.delete("/:pid", passportCall("jwt"),authorization("admin"), productControllers.deleteOne);

router.put("/:pid", passportCall("jwt"),authorization("admin"), productControllers.update);

router.post("/", passportCall("jwt"),authorization("admin"), checkProductData, productControllers.create);

export default router;