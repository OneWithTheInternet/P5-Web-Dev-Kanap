import { orderButton, quantityInput } from './variables.js';
import { displayCart, changeItemCount } from './functions.js';


/**
 * Displays all cart elements when page loads
 */
window.addEventListener('load', () => {
    
    displayCart();

});
