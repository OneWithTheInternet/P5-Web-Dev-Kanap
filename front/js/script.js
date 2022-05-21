/*
* Getting DOM Elements
*/
const productsSection = document.getElementById('items');


/*
* API URL
*/
const api = 'http://localhost:3000/api/products';


/*
* Event Listeners
*/
window.addEventListener('load', () => {
    displayAll();
});


/*
* Functions
*/

//AJAX request that returns a promise with the JSON file.
//Works for all requests by changing arguments.
function makeRequest(verb, url, data) {
    if (verb === 'POST' && !data) {
        reject({error: 'no data to POST'});
    } 
    return new Promise((resolve, reject) => {
        let request = new XMLHttpRequest();
        request.open(verb, url);
        request.onreadystatechange = () => {
            if (request.readyState === 4){
                resolve(JSON.parse(request.response));
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

//Retrieves all elements from the API
//Dysplays them in the homepage
async function displayAll() {
    
    //retrieve API response data file
    let requestPromise = await makeRequest('GET', api);
    let requestResponse = requestPromise;
    
    //identify number of items in retrieved data
    let numberOfItems = requestResponse.length;

    //create articles in DOM and populate content using API data
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
        productsSection.appendChild(card);
        
        //Adding content to elements
        card.href = './product.html?id=' + requestResponse[i]._id;
        newImage.src = requestResponse[i].imageUrl;
        newTitle.textContent = requestResponse[i].name;;
        newParagraph.textContent = requestResponse[i].description;
    }
}



















































// testElement = document.getElementsByTagName('h2');

// async function testThis() {
//     let requestPromise = makeRequest('GET', api);
//     let requestResponse = await requestPromise;
//     testElement[0].textContent = requestResponse[0]._id;
// }

// window.addEventListener('load', () => {
//     testThis();
// });