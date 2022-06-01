import { api, homeProductsSection } from "./variables.js";
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
    } 
    return new Promise((resolve, reject) => {
        let request = new XMLHttpRequest();
        request.open(verb, url);
        request.onreadystatechange = () => {
            if (request.readyState === 4){
                if (request.status === 200) {
                    resolve(JSON.parse(request.response));
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
        newTitle.textContent = requestResponse[i].name;;
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
 * increases cart number?
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

            console.log(i);
            console.log(cartData.length);

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