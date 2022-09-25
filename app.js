//declaring variables
const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document.querySelector(".close-cart");
const clearCartBtn = document.querySelector(".clear-cart");
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overaly");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const productsDOM = document.querySelector(".products-center"); 

//main cart 
let cart = [];
//buttons 
let buttonsDOM = [];
//getting the product
class Products{
    async getProducts(){
        try {
            let result = await fetch("products.json");
            let data = await result.json();
            let products = data.items;
            products = products.map(item =>{
                const {title, price} = item.fields;
                const {id} = item.sys;
                const image = item.fields.image.fields.file.url;
                return {title, price, id, image}
            })
            return products;
        }
        catch (error){
            console.log(error);
        }
    }

    
}
//displaying products 
class UI{
    displayProducts(products){
        let result = "";
        products.forEach(product => {
            result += `
            <!--product-->
                <article class="product">
                    <div class="img-container">
                        <img src=${product.image} alt="kales" class="product-img">
                        <button class="bag-btn" data-id=${product.id}>
                            <i class="fa fa-shopping-cart"></i>
                            Add to cart
                        </button>
                    </div>
                    <h3>${product.title}</h3>
                    <h4>$${product.price}</h4>
                </article>
                <!--single product-->
            
            `;
        });
        productsDOM.innerHTML = result;
    }
    getBagButtons(){
        const buttons = [...document.querySelectorAll(".bag-btn")];
        buttonsDOM = buttons;
        buttons.forEach(button => {
            let id = button.dataset.id;
            let inCart = cart.find(item  => item.id === id);
            if (inCart){
                button.innerText = "Added";
                button.disabled = true
            }
            
            button.addEventListener('click', (event) => {
                event.target.innerText = "Added";
                event.target.disabled = true;
                //get product from products
                let cartItem = { ...Storage.getProduct(id), amount: 1};
                
                //add product to cart 
                cart = [ ...cart, cartItem];
                
                //save cart in local storage 
                Storage.saveCart(cart);
                //set cart values 
                this.setCartValues(cart);
                //display cart items
                this.addCartItem(cartItem);

                //show the cart
                this.displayCart();

                });
        
        })
    }
setCartValues(cart){
    let tempTotal = 0;
    let itemsTotal = 0;
    cart.map(item => {
        tempTotal += item.price * item.amount;
        itemsTotal += item.amount;
    })
    cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
    cartItems.innerText = itemsTotal;
    
}
addCartItem(item){
    const div=document.createElement("div");
    div.classList.add('cart-item');
    div.innerHTML = `<img src=${item.image} alt="product">
    <div>
        <h4>${item.title}</h4>
        <h5>$${item.price}</h5>
        <span class="remove-item" data-id=${item.id}>Remove from cart</span>
    </div>
    <div>
        <i class="fa fa-chevron-up" data-id=${item.id}></i>
        <p class="item-amount">${item.amount}</p>
        <i class="fa fa-chevron-down" data-id=${item.id}></i>
    </div>`
    cartContent.appendChild(div);
    
}
displayCart(){
    cartOverlay.classList.add('transparentBcg');
    cartDOM.classList.add('showCart');
        }

}
//resume from 2:28:25
//local storage 
class Storage{ 
    static saveProducts(products){
        localStorage.setItem("products", JSON.stringify(products));
    }
    static getProduct(id){
        let products = JSON.parse(localStorage.getItem('products'));
        return products.find(product => product.id === id)
    }
    static saveCart(cart){
        localStorage.setItem('cart', JSON.stringify(cart));
    }

}
document.addEventListener("DOMContentLoaded", ()=> {
    const ui = new UI();
    const products = new Products();
    //get all products
    products.getProducts().then(products => {ui.displayProducts(products)
    Storage.saveProducts(products);
    }
    ).then(() => {
        ui.getBagButtons()
    });
    
});
