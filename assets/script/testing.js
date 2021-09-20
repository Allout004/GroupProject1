<<<<<<< HEAD
document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems, options);
  });

  // Or with jQuery

  $(document).ready(function(){
    $('.sidenav').sidenav();
  });

  M.AutoInit();


  
  document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.autocomplete');
    var instances = M.Autocomplete.init(elems, options);
  });


  // Or with jQuery

  $(document).ready(function(){
    $('input.autocomplete').autocomplete({
      data: {
        "Apple": null,
        "Microsoft": null,
        "Google": 'https://placehold.it/250x250'
      },
    });
  });
=======

$(document).ready(function(){
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

searchBar.addEventListener("keyup", function() {
    console.log(searchBar.value)
})


$(document).submit(function(event) {
    console.log("This is a the submit function working")
    event.preventDefault();
})
>>>>>>> 07e825daa162727809e0588672a524cefe84594e
