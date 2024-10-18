function setPlaceholderText(searchInputElement){
    searchInputElement.setAttribute("placeholder", "Search by keyword");
}
function updatePlaceholderText(searchInputElement){
    searchInputElement.setAttribute("placeholder", "Type to search");
}

function toggleDropdownStyles(){
    var dropdownLink = document.getElementById("dropdownLink");
    dropdownLink.classList.toggle("dropdown-transition-styles");
}