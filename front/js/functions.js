import { 

    api,
    homeProductsSection,
    quantityInput,
    deleteButton,
    itemDesciptionContainers,
    totalQuantity,
    totalPrice,
    cartItems,
    orderId,
    //form elements bellow this line
    form,
    firstName,
    lastName,
    address,
    city,
    email,
    orderButton,
    firstNameErrorMsg,
    lastNameErrorMsg, 
    addressErrorMsg,
    cityErrorMsg,
    emailErrorMsg,
} from "./variables.js";
import { item } from './classes.js';
 


/**
 * AJAX request that returns a promise with the JSON file.
 * Works for all requests by changing arguments.
 * @argument url 
 * @argument data
 * @returns response data
 */
 export function makeRequest(verb, url, data) {

    if (verb === 'POST' && !data) {

        reject({error: 'no data to POST'});

    } else {

        return new Promise((resolve, reject) => {

            let request = new XMLHttpRequest();
            request.open(verb, url);
            request.onreadystatechange = () => {
                if (request.readyState === 4){

                    if (request.status === 200 || request.status === 201) {

                        resolve(JSON.parse(request.response));
                        console.log('promise passed');

                    } else {

                        console.log('promise rejected');
                        reject(JSON.parse(request.response));

                    }

                } 

            }

            if (verb === 'POST') {

                request.setRequestHeader('Content-Type', 'application/json');
                request.send(JSON.stringify(data));

            } else {

                request.send();

            }

        });

    }

}



/**
 * Retrieves a specified parameter from curret window's URL
 * @param {*} parameterName can be id, colors, descrition, ect. from retrieved data
 */
 export function getParamenter( parameterName ) {
    let queryString = new URLSearchParams(window.location.search);
    return queryString.get(parameterName);
}



/**
 * Retrieves all elements from the API
 * Dysplays them in the homepage
 */
 export async function displayAll() {
    
    //retrieve API response data file
    let requestPromise = await makeRequest('GET', api);
    let requestResponse = requestPromise;
    
    //identify number of items in retrieved data
    let numberOfItems = requestResponse.length;

    //create articles in DOM and populates content using API data
    for (let i = 0; i < numberOfItems; i++) {
        
        //creating elements
        let card = document.createElement('a');
        let newArticle = document.createElement('article');
        let newImage = document.createElement('img');
        let newTitle = document.createElement('h3');
        let newParagraph = document.createElement('p');
        
        //adding styles
        newTitle.classList.add("productName");
        newParagraph.classList.add("productDescription");
        
        //appeinding elements to each other
        card.appendChild(newArticle);
        newArticle.appendChild(newImage);
        newArticle.appendChild(newTitle);
        newArticle.appendChild(newParagraph);
        
        //Appeding final element to the DOM
        homeProductsSection.appendChild(card);
        
        //Adding content to elements
        card.href = './product.html?id=' + requestResponse[i]._id;
        newImage.src = requestResponse[i].imageUrl;
        newTitle.textContent = requestResponse[i].name;
        newParagraph.textContent = requestResponse[i].description;
    }
}



/**
 * Displays details of the product that the user clicked on on previews page
 * Details are displayed on product page
 */
 export async function displayProduct() {
    
    //retriving product's ID from URL
    let productId = getParamenter('id');

    //retrieve API response data file
    let requestPromise = await makeRequest('GET', api + '/' + productId);
    let requestResponse = requestPromise;

    //retrieving DOM elements
    let image = document.getElementsByClassName('item__img')[0].children[0];
    let title = document.getElementById('title');
    let price = document.getElementById('price');
    let description = document.getElementById('description');
    let colors  =  document.getElementById('colors');

    //Replacing default content with server/response data
    image.src = requestResponse.imageUrl;
    image.alt = requestResponse.altTxt;
    title.textContent = requestResponse.name;
    price.textContent = requestResponse.price;
    description.textContent = requestResponse.description;

    //Creating color selector options from server/response data
    let colorCount = requestResponse.colors.length;
    for (let i = 0; i < colorCount; i++) {
        let option = document.createElement('option');
        option.value = requestResponse.colors[i];
        option.textContent = requestResponse.colors[i];
        colors.appendChild(option);
    }
}



/**
 * Adds currently displayed item to the cart
 * Uses local storage
 */
export function addToCart(){
    
    //retrieve current items' id from URL
    let productId = getParamenter('id');

    //retrieve product quantity and color from DOM input elements
    let selectedColor = document.getElementById('colors');
    let selectedQuantity = document.getElementById('quantity');

    //Validate user color and quantity input
    if ( selectedColor.value && selectedQuantity.value > 0 ) {
        
        //check if local storage is eampty
        if (localStorage.length == 0) {
        
            //if there is no product table, create an array that includes and object with the item's id, quantity and color
            let itemObject = new item(productId, selectedColor.value, selectedQuantity.value);

            let productArray = [
                itemObject
            ]

            //set a new local storage field and pass the array as the value
            localStorage.setItem('cart items', JSON.stringify(productArray));

        } else {
            
            //if there is a product table, retrieve its value as a JSON object
            let cartData = JSON.parse(localStorage.getItem('cart items'));
            
            //Identify cart item with same color and ID (if any) as item being added
            let i = 0;
            while ( i < cartData.length - 1) {
                
                if (cartData[i].color != selectedColor.value && cartData[i].id != productId ) {
                    i++;
                } else {
                    break;
                }

            }

            //if item being added has the SAME id and color as any of the items already in cart
            if (cartData[i].color == selectedColor.value && cartData[i].id == productId) {
                    
                //Add up duplicated object's current quantity and input field's current quantity
                let newQuantity = parseInt(cartData[i].quantity) + parseInt(selectedQuantity.value);

                //replace current object's quantity with addition result 
                cartData[i].quantity = '' + newQuantity;

                //replace current local storage field and pass the new array as the value
                localStorage.setItem('cart items', JSON.stringify(cartData));
            
                //if added item has DIFFERENT id and color than any of the items already in cart
            } else {
                
                //add item object to product table (array)
                let itemObject = new item(productId, selectedColor.value, selectedQuantity.value);

                cartData.push(itemObject);            

                //replace the old product table with the new product table in the cart
                localStorage.setItem('cart items', JSON.stringify(cartData));

            }

        }

        alert("Your selection was added to the cart");
        
        //restoring DOM element to default
        selectedColor.value = "";
        selectedQuantity.value = 0;
        selectedColor.style.borderColor = '';
        selectedColor.style.borderWidth = '1px';
        selectedQuantity.style.borderColor = '';
        selectedQuantity.style.borderWidth = '1px';

        //alert user of missing input data
    } else {
        
        alert("Please complete all fields before adding item to the cart");
       
        //change color of missing fields
        if ( !selectedColor.value ) {
            selectedColor.style.borderColor = 'red';
            selectedColor.style.borderWidth = '3px';
        }
        if ( selectedQuantity.value == 0 ) {
            selectedQuantity.style.borderColor = 'red';
            selectedQuantity.style.borderWidth = '3px';
        }
    }

}



/**
 * Displays all items added to the cart in the when cart page loads
 * Steps:
 * pulls item's ID, quantity and color from local storage
 * requests each item's remaining data from server
 * Adds prices up 
 * Detemines the total amount of items
 * prints data to the DOM
 */
export async function displayCart(){
    
    //if there is something in the cart and that something is not eampty
    if (localStorage.getItem("cart items") !== null && localStorage.getItem("cart items") !== '[]') {

        //Accessing local Storage
        let cartData = JSON.parse(localStorage.getItem('cart items'));
        
        //Access each item in the cart one at a time
        for ( let i = 0; i < cartData.length; i++) {

            //Request item's info from server
            let requestResponse = await makeRequest ("GET", api + "/" + cartData[i].id); 

            //Creating necessary DOM
            let article = document.createElement('article');
            let article__imageContainer = document.createElement('div');
            let article__imageContainer__image = document.createElement('img');
            let article__content = document.createElement('div');
            let article__content__descriptionContainer = document.createElement('div');
            let article__content__descriptionContainer__title = document.createElement('h2');
            let article__content__descriptionContainer__color = document.createElement('p');
            let article__content__descriptionContainer__price = document.createElement('p');
            let article__content__settingsContainer = document.createElement('div');
            let article__content__settingsContainer__quantityContainer = document.createElement('div');
            let article__content__settingsContainer__quantityContainer__text = document.createElement('p');
            let article__content__settingsContainer__quantityContainer__input = document.createElement('input');
            let article__content__settingsContainer__deleteButtonContainer = document.createElement('div');
            let article__content__settingsContainer__deleteButtonContainer__button = document.createElement('p');

            //Adding styles content and attributes to newly created DOM elements
            article.classList.add('cart__item');
            article.setAttribute("data-id", cartData[i].id);
            article.setAttribute("data-color", cartData[i].color);
            article__imageContainer.classList.add('cart__item__img');
            article__imageContainer__image.setAttribute("src", requestResponse.imageUrl);
            article__imageContainer__image.setAttribute("alt", requestResponse.altTxt);
            article__content.classList.add("cart__item__content");
            article__content__descriptionContainer.classList.add("cart__item__content__description"),
            article__content__descriptionContainer__title.innerText = requestResponse.name;
            article__content__descriptionContainer__color.innerText = cartData[i].color;
            article__content__descriptionContainer__price.innerHTML = "<span>$</span>" + "<span>" + requestResponse.price + "</span>";
            article__content__settingsContainer.classList.add("cart__item__content__settings");
            article__content__settingsContainer__quantityContainer.classList.add("cart__item__content__settings__quantity");
            article__content__settingsContainer__quantityContainer__text.innerHTML = "Qté : ";
            article__content__settingsContainer__quantityContainer__input.classList.add("itemQuantity");
            article__content__settingsContainer__quantityContainer__input.setAttribute("type", "number");
            article__content__settingsContainer__quantityContainer__input.setAttribute("name", "itemQuantity");
            article__content__settingsContainer__quantityContainer__input.setAttribute("min", "1");
            article__content__settingsContainer__quantityContainer__input.setAttribute("max", "100");
            article__content__settingsContainer__quantityContainer__input.setAttribute("value", cartData[i].quantity);
            article__content__settingsContainer__deleteButtonContainer.classList.add("cart__item__content__settings__delete");
            article__content__settingsContainer__deleteButtonContainer__button.classList.add("deleteItem");
            article__content__settingsContainer__deleteButtonContainer__button.innerHTML = "Delete";        

            //Appending DOM Elements
            cartItems.appendChild(article);
            article.appendChild(article__imageContainer);
            article.appendChild(article__content);
            article__imageContainer.appendChild(article__imageContainer__image);
            article__content.appendChild(article__content__descriptionContainer);
            article__content.appendChild(article__content__settingsContainer);
            article__content__descriptionContainer.appendChild(article__content__descriptionContainer__title);
            article__content__descriptionContainer.appendChild(article__content__descriptionContainer__color);
            article__content__descriptionContainer.appendChild(article__content__descriptionContainer__price);
            article__content__settingsContainer.appendChild(article__content__settingsContainer__quantityContainer);
            article__content__settingsContainer.appendChild(article__content__settingsContainer__deleteButtonContainer);
            article__content__settingsContainer__quantityContainer.appendChild(article__content__settingsContainer__quantityContainer__text);
            article__content__settingsContainer__quantityContainer.appendChild(article__content__settingsContainer__quantityContainer__input);
            article__content__settingsContainer__deleteButtonContainer.appendChild(article__content__settingsContainer__deleteButtonContainer__button);

        }

        //adding event listeners to quantity input field and delete button
        for (let i = 0; i < quantityInput.length; i++) {

            quantityInput[i].addEventListener('change', ($event) => {
            
                changeItemCount($event);
            
            });

            deleteButton[i].addEventListener('click', ($event) => {
            
                deleteCartItem($event);
            
            });
            
        }

    } else {

        alert("You have not added anything to the cart yet");

    }


    //display the total money amount of the items in the cart
    displayTotalPrice();

    //display the total amount of items in the cart
    displayCartCount();
    
}



/**
 * Reacts to changes in the quantity input fields by updating the quantity of the desired item in the local storage
 * @param {*} currentEvent This parameter will always be the $event object from the event-listener that called this function.
 */
export function changeItemCount(currentEvent) {

    //Reatreaving cart items' local storage data
    let cartData = JSON.parse(localStorage.getItem('cart items'));
    
    //retreaving input element's closest article element
    let currentArticle = currentEvent.target.closest('article');

    //Checking if the current article's dataset values match the id and color of any of the items in the cart 
    for (let i = 0; i < cartData.length; i++) {

        //If there is a match change the quantity of the local storage object to match user input
        if (currentArticle.dataset.id == cartData[i].id && currentArticle.dataset.color == cartData[i].color) {
        
            cartData[i].quantity = currentEvent.target.value;
            localStorage.setItem('cart items', JSON.stringify(cartData));
            break;
        }

    }

}



/**
 * deletes item from cart when user clicks on specified item.
 * @param {*} currentEvent This parameter will always be the $event object from the event-listener that called this function.
 */
 export function deleteCartItem(currentEvent) {

    //Reatreaving cart items' local storage data
    let cartData = JSON.parse(localStorage.getItem('cart items'));
    
    //retreaving input element's closest article element
    let currentArticle = currentEvent.target.closest('article');

    for (let i = 0; i < cartData.length; i++) {

        //If the current article's dataset values match the id and color of any of the items in the cart, remove the item from local storage and DOM 
        if (currentArticle.dataset.id == cartData[i].id && currentArticle.dataset.color == cartData[i].color) {
            
            let newCartData = [];
            
            for (let x = 0; x < cartData.length; x++) {

                if (cartData[i] !== cartData[x]) {

                    newCartData.push(cartData[x]);

                }

            }

            //if all cart items have been deleted
            if (newCartData.length == 0) {

                localStorage.clear();

                //Removing item from DOM
                currentArticle.parentElement.removeChild(currentArticle);
            
            } else {

                //Replacing cart items in local storage with new array
                localStorage.setItem("cart items", JSON.stringify(newCartData));

                //Removing item from DOM
                currentArticle.parentElement.removeChild(currentArticle);

            }

            break;

        }

    }

}



/**
 * Adds up cart item prices and displays this in the DOM
 */
function displayTotalPrice() {

    //Clearing the total price field in DOM
    totalPrice.textContent = ''; 

    //Creating a price counter
    let priceCounter = 0;

    //adding all prices up
    for (let i = 0; i < itemDesciptionContainers.length; i++) {

        //retrieving item's price
        let currentItemPrice = itemDesciptionContainers[i].children[2].children[1].textContent; 

        //adding current item's price to price counter
        priceCounter = priceCounter + parseInt(currentItemPrice);
        
    };

    //appending result to DOM
    totalPrice.textContent = priceCounter;

}



/**
 * Determines amount of items in cart and displays resul in the DOM
 */
function displayCartCount() {

    totalQuantity.textContent = "";

    totalQuantity.textContent = itemDesciptionContainers.length + 1;

}



/**
 * Submits an order to the server cart items information and user's contact information
 * Clears the cart
 * @param {*} currentEvent captures the current event object from the event listener that triggered this function 
 * @returns a request response from API
 */
export async function submitOrder(currentEvent){

    //Create an object with form's data
    let contactObject = {

        firstName: firstName.value,
        lastName: lastName.value,
        address: address.value,
        city: city.value,
        email: email.value

    };
    
    //Retrieve cart data id into a new object
    let cartData = JSON.parse(localStorage.getItem("cart items"));
    
    let productTable = [];

    for (let i = 0; i < cartData.length; i++) {

        productTable.push(cartData[i].id);

    }

    //creates a single object with both objects
    let postObject = {

        contact: contactObject,
        products: productTable

    };

    //submits it as a post request


    let requestPromise = await makeRequest ("POST", api + "/order", postObject);
    let requestResponse = requestPromise;

    //clear cart data from local storage and DOM
    localStorage.clear();
    while (cartItems.hasChildNodes()) {

        cartItems.removeChild(cartItems.firstChild);

    }

    //storing API's response
    sessionStorage.setItem('order confirmation', JSON.stringify(requestResponse));

    //redirecting to confirmaiton page
    location.href = './confirmation.html'

    return requestResponse;

}


/**
 * Displays order ID in DOM
 */
export function displayOrderConfirmation() {

    //retrieves order ID from setion storage and prints in the DOM
    orderId.textContent = "";
    let orderData = JSON.parse(sessionStorage.getItem('order confirmation'));
    orderId.textContent = orderData.orderId; 

}