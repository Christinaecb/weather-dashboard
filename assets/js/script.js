/*Search by using city name (e.g. london) or a comma-separated city name along with the country code (e.g. london,ca)*/
var form = document.querySelector(".top-banner form");
var input = document.querySelector(".top-banner input");
var msg = document.querySelector(".top-banner .msg");
var list = document.querySelector(".ajax-section .cities");

var apiKey = "4d8fb5b93d4af21d66a2948710284366";

//Stops the form from submitting and grabs the value contained in the search field
form.addEventListener("submit", e => {
    e.preventDefault();
    let inputVal = input.value;
  
   