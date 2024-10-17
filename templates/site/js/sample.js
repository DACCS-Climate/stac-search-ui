document.addEventListener("DOMContentLoaded", function (){
    var searchInputElement = document.getElementById("searchInput");
    setPlaceholderText();

    searchInputElement.addEventListener("click", updatePlaceholderText);
    searchInputElement.addEventListener("focus", updatePlaceholderText);
    searchInputElement.addEventListener("blur", setPlaceholderText);

})