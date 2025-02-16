import { Router } from "express";
import { cartsControllers } from "../controllers/carts.controller.js";
import { passportCall } from "../middlewares/passportCall.middelware.js";
import { authorization } from "../middlewares/authotirization.middleware.js";

const router=Router()

    router.post('/',cartsControllers.createCart);

    router.get('/:cid',cartsControllers.getByIdCart);

    router.post("/:cid/product/:pid", passportCall("jwt"),authorization("user"),cartsControllers.addProductToCart);
    
    router.delete("/:cid/product/:pid", passportCall("jwt"),authorization("user"),cartsControllers.deleteProductToCart);
    
    router.put("/:cid/product/:pid", passportCall("jwt"),authorization("user"),cartsControllers.updateQuantityProductInCart);
    
    router.delete("/:cid", passportCall("jwt"),authorization("user"), cartsControllers.clearProductsToCart);

    router. post("/:cid/purchase",passportCall("jwt"),authorization("user"),cartsControllers.purchaseCart)

export default router;