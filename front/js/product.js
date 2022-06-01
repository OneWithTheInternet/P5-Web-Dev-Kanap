import { displayProduct, addToCart } from './functions.js';
import { addToCartButton } from './variables.js';

/**Calls functions when site loads
 * Displays all elements in the front page
 */
 window.addEventListener('load', () => {
    displayProduct();
});


/**
 * Calls fuction to add current item to the cart
 */
addToCartButton.addEventListener('click', () => {
    addToCart();
});

