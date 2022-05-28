/**
 * API URL
 */
 const api = 'http://localhost:3000/api/products';


/**Calls functions when site loads
 * Displays all elements in the front page
 */
 window.addEventListener('load', () => {
    displayProduct();
});

/**
 * AJAX request that returns a promise with the JSON file.
 * Works for all requests by changing arguments.
 * @argument url 
 * @argument data
 * @returns response data
 */
 function makeRequest(verb, url, data) {
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
 * @param {*} parameterName 
 */
 function getParamenter( parameterName ) {
    let queryString = new URLSearchParams(window.location.search);
    return queryString.get(parameterName);
}


/**
 * Displays details of the product that the user clicked on on previews page
 * Details are displayed on product page
 */
 async function displayProduct() {
    
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
