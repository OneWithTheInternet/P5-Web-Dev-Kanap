//API URL
export const api = 'http://localhost:3000/api/products';

//Homepage DOM elements
export const homeProductsSection = document.getElementById('items');

//Product page DOM elements
export const addToCartButton = document.getElementById('addToCart');

//Cart page DOM Elements
export const quantityInput = document.getElementsByClassName('itemQuantity');
export const deleteButton = document.getElementsByClassName('deleteItem');
export const itemDesciptionContainers = document.getElementsByClassName('cart__item__content__description');
export const totalQuantity = document.getElementById('totalQuantity');
export const totalPrice = document.getElementById('totalPrice');

//Cart page's submit Form DOM Elements
export const cartItems = document.getElementById('cart__items');
export const form = document.getElementsByTagName('form');
export const firstName = document.getElementById("firstName");
export const lastName = document.getElementById("lastName");
export const address = document.getElementById("address");
export const city = document.getElementById("city");
export const email = document.getElementById("email");
export const orderButton = document.getElementById('order');
export const firstNameErrorMsg = document.getElementById("firstNameErrorMsg");
export const lastNameErrorMsg = document.getElementById("lastNameErrorMsg");
export const addressErrorMsg = document.getElementById("addressErrorMsg");
export const cityErrorMsg = document.getElementById("cityErrorMsg");
export const emailErrorMsg = document.getElementById("emailErrorMsg");

//Confirmation page DOM elements
export const orderId = document.getElementById('orderId');

