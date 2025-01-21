import { Router } from "express";
import { cartDao } from "../dao/cart.dao.js";

const router=Router()

router.post('/', async(req,res) => {
    try {
        const cart = await cartDao.create();

        res.status(201).json({ status: "success", cart });
    } catch (error) {
        res.status(500).json({status:"Error",msg:"Internal server error"})
    }
})

router.get('/:cid', async(req,res) => {
    try {
        const { cid } = req.params;
        const cart = await cartDao.getById(cid);
        if (!cart) return res.status(404).json({ status: "Error", msg: "Carrito no encontrado" });
    } catch (error) {
        res.status(404).json({status:"erro",msg:"Internal server error"})
    }
})

export default router;