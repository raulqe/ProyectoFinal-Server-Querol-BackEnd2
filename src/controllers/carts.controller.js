import { productDao } from "../dao/mongo/product.dao.js";
import { cartsServices } from "../services/carts.service.js";
import { ticketService } from "../services/ticket.service.js";


class CartsControllers {

    async createCart(req,res){
        try {
            const cart = await cartsServices.create();
    
            res.status(201).json({ status: "success", cart });
        } catch (error) {
            res.status(500).json({status:"Error",msg:"Internal server error"})
        };
    };

    async getByIdCart(req,res){
        try {
                const { cid } = req.params;
                const cart = await cartsServices.getById(cid);
                if (!cart) return res.status(404).json({ status: "Error", msg: "Cart not found" });

                res.status(200).json({ status: "success", cart });
            } catch (error) {
                res.status(404).json({status:"erro",msg:"Internal server error"})
            };
    };

    async addProductToCart(req,res){
        try {
            const { cid, pid } = req.params;
            const product = await productDao.getById(pid);
            if (!product) return res.status(404).json({ status: "Error", msg: `The product with the id ${pid} was not found` });
            const cart = await cartsServices.getById(cid);
            if (!cart) return res.status(404).json({ status: "Error", msg: `The cart with the id ${cid} was not found` });
        
            const cartUpdate = await cartsServices.addProductToCart(cid, pid);
        
            res.status(200).json({ status: "success", payload: cartUpdate });
        } catch (error) {
            console.log(error);
            res.status(500).json({ status: "Erro", msg: "Internal server error" });
        };
     
    };

    async deleteProductToCart(req,res){
        try {
            const { cid, pid } = req.params;
            const product = await productDao.getById(pid);
            if (!product) return res.status(404).json({ status: "Error", msg: `The product with the id ${pid} was not found` });
            const cart = await cartsServices.getById(cid);
            if (!cart) return res.status(404).json({ status: "Error", msg: `The cart with the id ${cid} was not found` });
        
            const cartUpdate = await cartsServices.deleteProductToCart(cid, pid);
        
            res.status(200).json({ status: "success", payload: cartUpdate });
        } catch (error) {
            console.log(error);
            res.status(500).json({ status: "Erro", msg: "Internal server error" });
        };
     
    };

    async updateQuantityProductInCart(req,res){
        try {
            const { cid, pid } = req.params;
            const { quantity } = req.body;
        
            const product = await productDao.getById(pid);
                
            if (!product) return res.status(404).json({ status: "Error", msg: `The product with the id ${pid} was not found` });
            const cart = await cartsServices.getById(cid);
            if (!cart) return res.status(404).json({ status: "Error", msg: `The cart with the id ${cid} was not found` });
            if(quantity <= 0) return res.status(404).json({ status: "Error", msg: `Please, it isn't allowed to enter 0 or negative numbers` });
            const cartUpdate = await cartsServices.updateQuantityProductInCart(cid, pid, Number(quantity));
        
            res.status(200).json({ status: "success", payload: cartUpdate });
        } catch (error) {
            console.log(error);
            res.status(500).json({ status: "Erro", msg: "Internal server error" });
        };
     
    };
    async clearProductsToCart(req,res){
        try {
            const { cid } = req.params;
            const cart = await cartsServices.clearProductsToCart(cid);
            if (!cart) return res.status(404).json({ status: "Error", msg: "Cart not found" });
        
            res.status(200).json({ status: "success", cart });
        } catch (error) {
            console.log(error);
            res.status(500).json({ status: "Erro", msg: "Internal server error" });
        };
    
    };
    async purchaseCart(req,res){
        try {
            const { cid } = req.params;
            const cart = await cartsServices.getById(cid);
            if (!cart) return res.status(404).json({ status: "Error", msg: "Cart not found" });
            const total= await cartsServices.purchaseToCart(cid);
            const ticket= await ticketService.create(total,req.user.email);
            res.status(200).json({ status: "success", ticket});
            
        } catch (error) {
            console.log(error);
            res.status(500).json({ status: "Erro", msg: "Internal server error" });
        };

    };
};
export const cartsControllers = new CartsControllers();