import { orderButton, form } from './variables.js';
import { displayCart, submitOrder } from './functions.js';


/**
 * Displays all cart elements when page loads
 */
window.addEventListener('load', () => {
    
    displayCart();

});

form[0].addEventListener('submit', ($event) => {

    $event.preventDefault();
    submitOrder($event);

});

