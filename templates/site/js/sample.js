document.addEventListener("DOMContentLoaded", function (){
    var searchInputElement = document.getElementById("searchInput");
    setPlaceholderText(searchInputElement);

    searchInputElement.addEventListener("click", function(){
        updatePlaceholderText(searchInputElement);
    });

    searchInputElement.addEventListener("focus", function(){
        updatePlaceholderText(searchInputElement);
    });

    searchInputElement.addEventListener("blur", function(){
        setPlaceholderText(searchInputElement);
    });

    var dropdownLink = document.getElementById("dropdownLink");
    dropdownLink.addEventListener("click", toggleDropdownStyles);
})