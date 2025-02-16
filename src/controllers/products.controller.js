import { productServices } from "../services/products.service.js";

export class ProductControllers {

    async getAll(req,res){
        try {
                const { limit, page, sort, category, status } = req.query;
        
                const options = {
                    limit: limit || 10,
                    page: page || 1,
                    sort: {
                        price: sort === "asc" ? 1 : -1,
                    },
                    learn: true,
                };
        
                if (category) {
                    const products = await productServices.getAll({ category }, options);
                    return res.status(200).json({ status: "success", products });
                }
        
                if (status) {
                    const products = await productServices.getAll({ status }, options);
                    return res.status(200).json({ status: "success", products });
                }
        
                const products = await productServices.getAll({}, options);
                res.status(200).json({ status: "success", products });
            } catch (error) {
                console.log(error);
                res.status(500).json({ status: "Erro", msg: "Internal server error." });
            };
        
    };

    async getById(req,res){
        try {
                const { pid } = req.params;
                const product = await productServices.getById(pid);
                if (!product) return res.status(404).json({ status: "Error", msg: "Product not found." });
        
                res.status(200).json({ status: "success", product });
            } catch (error) {
                console.log(error);
                res.status(500).json({ status: "Erro", msg: "Internal server error." });
            };
        
    };

    async deleteOne(req,res){
        try {
                    const { pid } = req.params;
                    const product = await productServices.deleteOne(pid);    
                    if (!product) return res.status(404).json({ status: "Error", msg: "Product not found." });
        
                    res.status(200).json({ status: "success", msg: `The product with the id: ${pid} was deleted.` });
            } catch (error) {
                    console.log(error);
                    res.status(500).json({ status: "Erro", msg: "Internal server error." });
            };

    };

    async update(req,res){
        try {
                const { pid } = req.params;
                const productData = req.body;
                const product = await productServices.update(pid, productData);
                if (!product) return res.status(404).json({ status: "Error", msg: "Product not found." });
    
                    res.status(200).json({ status: "success", product });
            } catch (error) {
                    console.log(error);
                    res.status(500).json({ status: "Erro", msg: "Internal server error." });
            };

    };

    async create(req,res){
        try {
                const productData = req.body;
                const product = await productServices.create(productData);
        
                res.status(201).json({ status: "success", product });
            } catch (error) {
                console.log(error);
                res.status(500).json({ status: "Erro", msg: "Internal server error." });
            };
        
    };
   
};

export const productControllers = new ProductControllers();