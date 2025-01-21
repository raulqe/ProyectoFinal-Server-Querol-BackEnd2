import { Router } from "express";
import cartsRouter from "./carts.routes.js";
import productsRouter from "./products.routes.js";
import sesionsRouter from "./sesions.routes.js";
const router= Router();

router.use("/products",productsRouter);
router.use("/carts",cartsRouter);
router.use("/sesions",sesionsRouter);
export default router;