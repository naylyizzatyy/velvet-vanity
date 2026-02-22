const fs = require('fs');
const path = require('path');

let filePath = path.join(__dirname, 'Files', 'cart.txt');

function loadMakeup(){

fetch('http://makeup-api.herokuapp.com/api/v1/products.json')

.then(response => response.json())

.then(data => {

let output = "";

for(let i=0; i<5; i++){

let name = data[i].name;
let brand = data[i].brand;
let price = data[i].price;
let link = data[i].product_link;
let rating = data[i].rating;

output += `
<div class="product-card">

<h3>${name}</h3>

<p>Brand: ${brand}</p>

<p>Price: RM ${price}</p>

<p>Rating: ${rating ? rating : "No rating"} </p>

<a href="${link}" target="_blank">View Product</a>

<br><br>

<button onclick="addToCart('${name}','${brand}','${price}')">
Add to Cart
</button>

</div>
`;

}

document.getElementById("result").innerHTML = output;

});

}

function addToCart(name, brand, price){

let content = `Name: ${name}, Brand: ${brand}, Price: RM ${price}\n`;

fs.appendFile(filePath, content, function(err){

if(err){
alert("Error adding to cart");
return;
}
showNotification(name + " added to cart");

});

}
function calculateTotal(){

fs.readFile(filePath, 'utf8', function(err, data){

if(err){
alert("Error reading cart");
return;
}

let lines = data.split("\n");

let total = 0;

for(let i=0; i<lines.length; i++){

let match = lines[i].match(/Price: RM (\d+\.?\d*)/);

if(match){
total += parseFloat(match[1]);
}

}
document.getElementById("totalDisplay").innerHTML =
"Total Price: RM " + total.toFixed(2);
document.querySelector(".total-box").classList.add("show");
});

}

function goToCart(){

window.location.href = "cart.html";

}

function searchMakeup(){

let brand = document.getElementById("searchInput").value;

if(!brand){
alert("Please enter brand");
return;
}

fetch(`http://makeup-api.herokuapp.com/api/v1/products.json?brand=${brand}`)

.then(response => response.json())

.then(data => {

let output = "";

if(data.length === 0){

output = "No products found";

}

for(let i=0; i<Math.min(data.length, 8); i++){

let name = data[i].name;
let brand = data[i].brand;
let price = data[i].price;
let link = data[i].product_link;
let rating = data[i].rating;

output += `
<div class="product-card">

<h3>${name}</h3>

<p>Brand: ${brand}</p>

<p>Price: RM ${price}</p>

<p>Rating: ${rating ? rating : "No rating"} </p>

<a href="${link}" target="_blank">View Product</a>

<br><br>

<button onclick="addToCart('${name}','${brand}','${price}')">
Add to Cart
</button>

</div>
`;
}

document.getElementById("result").innerHTML = output;

})

.catch(error => {

console.log(error);

});

}
function readCart(){

fs.readFile(filePath, 'utf8', function(err, data){

if(err){
alert("Error reading cart");
return;
}

let lines = data.split("\n");

let output = "";

for(let i=0; i<lines.length; i++){

if(lines[i].trim() === "") continue;

// extract data
let match = lines[i].match(/Name: (.*), Brand: (.*), Price: RM (.*)/);

if(match){

let name = match[1];
let brand = match[2];
let price = match[3];

output += `
<div class="product-card">

<h3>${name}</h3>

<p>Brand: ${brand}</p>

<p>Price: RM ${price}</p>

</div>
`;

}

}
document.getElementById("cartResult").innerHTML = output;

document.querySelector(".total-box").classList.remove("show");

});

}

function clearCart(){

fs.writeFile(filePath, "", function(err){

if(err){
showNotification("Error clearing cart");
return;
}

showNotification("Cart cleared successfully");

// clear display juga
document.getElementById("cartResult").innerHTML = "";

document.getElementById("totalDisplay").innerHTML = "";
document.querySelector(".total-box").classList.remove("show");
});

}

function showNotification(message){

let notification = document.getElementById("notification");

notification.innerHTML = message;

notification.style.display = "block";

// hide after 3 seconds
setTimeout(() => {
notification.style.display = "none";
}, 3000);

}

