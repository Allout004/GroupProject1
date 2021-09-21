
$(document).ready(function () {
  $('input.autocomplete').autocomplete({
    data: {
      "Chris Evans": null,
      "Scarlett Johansson": null,
      "Robert Downey": 'https://m.media-amazon.com/images/M/MV5BZmUyMDEyOTgtZmUwOS00NTdkLThlNzctNTM1ODQ4M2VhMjdhXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg',
      // "InsertNameHere": "addImageHereORNull",
      // "InsertNameHere": "addImageHere",
      // "InsertNameHere": "addImageHere",
      // "InsertNameHere": "addImageHere",
      // "InsertNameHere": "addImageHere",
      // "InsertNameHere": "addImageHere",
      // "InsertNameHere": "addImageHere",
      // "InsertNameHere": "addImageHere",
    },
    limit: 3,
  });
});

// onAutocomplete()
// console.log("suh")


//  need to import data dynamically or thru API call on page load
var searchBar = document.getElementById("search")
// Execute a function when the user releases a key on the keyboard

searchBar.addEventListener("keyup", function () {
  console.log("keyup", searchBar.value)
})


$(document).submit(function (event) {
  console.log("This is a the submit function working")
  event.preventDefault();
  // Get value from text field.
  const searchString = $('#search').val();
  // call searchForActor()
  searchForActor(searchString);
})