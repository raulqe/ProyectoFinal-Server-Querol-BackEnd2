import { cartDao } from "../dao/mongo/cart.dao.js";
import { productDao } from "../dao/mongo/product.dao.js";

export class CartsServices {

    async create (){
        return await cartDao.create()
    };
    async getById(id){
        return await cartDao.getById(id);
    };
    async addProductToCart(cid,pid){
        const cart = await cartDao.getById(cid);
        const cartProd= cart.products;
        const productInCart = cartProd.find((e) => e.product == pid);
        (productInCart) ? productInCart.quantity++ : cartProd.push({ product: pid, quantity: 1 });
      
        return await cartDao.update(cid, cart);
    };

    async deleteProductToCart(cid, pid){
        const cart= await cartDao.getById(cid);

        cart.products = cart.products.filter((element) => element.product != pid);
        
        return await cartDao.update(cid, {products:cart.products});
    };

    async updateQuantityProductInCart(cid, pid, quantity){
        const cart = await cartDao.getById(cid);
        const product = cart.products.find((element) => element.product == pid);

        product.quantity = quantity;
        
        return await cartDao.update(cid, { products: cart.products } );
    };

    async clearProductsToCart(cid){
        return await cartDao.update(cid, { products: []});
    };
    
    async purchaseToCart(cid){

        const cart= await cartDao.getById(cid);
        let total=0;
        const productsWhitOutStock=[];

        for(const productCart of cart.products) {

            const product=await productDao.getById(productCart.product);
            const stock = product.stock;
            const price = product.price;
            const quantity= productCart.quantity;

            (stock >= quantity) ? (
                ( total += price * quantity ),
                (await productDao.update(product.id,{stock:stock - quantity}))
            )
            :productsWhitOutStock.push(productCart);
            await cartDao.update(cid,{products:productsWhitOutStock});
        }
        return total;    
    };

};

export const cartsServices = new CartsServices();