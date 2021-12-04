export class Cart {
    products: any
    totalQuantity: any
    totalPrice: any
    constructor(cart: any) {
        if (cart) {
            this.products = JSON.parse(cart).products;
            this.totalQuantity = JSON.parse(cart).totalQuantity;
            this.totalPrice = JSON.parse(cart).totalPrice;
        } else {
            this.products = [];
            this.totalQuantity = 0;
            this.totalPrice = 0;
        }
    }

    addCart(product: any, id: any, quantity: any) {
        var newProduct = {
            'quantity': 0,
            'price': 0,
            'productInfo': product
        }
        if (this.products.length === 0) {
            newProduct.quantity = ~~quantity;
            newProduct.price = newProduct.quantity * product.price;
            this.products.push(newProduct);

        } else {
            var repeat = false;
            for (var i = 0; i < this.products.length; i++) {
                if (this.products[i].productInfo.productId== id) {
                    repeat = true;
                    this.products[i].quantity += ~~quantity;
                    this.products[i].price = product.price * this.products[i].quantity
                }
            }
            if (!repeat) {
                newProduct.quantity = ~~quantity;
                newProduct.price = newProduct.quantity * product.price;
                this.products.push(newProduct);
            }

        }

        this.totalPrice += product.price * ~~quantity;
        this.totalQuantity += ~~quantity;
    }
    deleteCart(product: any, id: any) {
        for (var i = 0; i < this.products.length; i++) {
            if (this.products[i].productInfo.productId== id) {
                this.products[i].quantity--;
                this.products[i].price = product.price * this.products[i].quantity
                if (this.products[i].quantity === 0)
                    this.products.splice(i, 1)
            }
        }
        this.totalPrice -= product.price;
        this.totalQuantity--;
    }
    removeCart(id: any) {
        for (var i = 0; i < this.products.length; i++) {
            if (this.products[i].productInfo.productId== id) {
                this.totalPrice -= this.products[i].price;
                this.totalQuantity -= this.products[i].quantity
                this.products.splice(i, 1)
            }
        }

    }

    updateCart(id: any, quantity: any) {
        for (var i = 0; i < this.products.length; i++) {
            if (this.products[i].productInfo.productId== id) {

                this.totalQuantity -= this.products[i].quantity;
                this.totalPrice -= this.products[i].price;

                this.products[i].quantity = quantity;
                this.products[i].price = this.products[i].productInfo.price * quantity;

                this.totalQuantity += ~~quantity;
                this.totalPrice += this.products[i].price;

            }
        }
    }
}
