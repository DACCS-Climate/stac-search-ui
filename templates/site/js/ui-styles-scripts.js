function setPlaceholderText(searchInputElement){
    searchInputElement.setAttribute("placeholder", "Search by keyword");
}
function updatePlaceholderText(searchInputElement){
    searchInputElement.setAttribute("placeholder", "Type to search");
}


function toggleDropdownStyles(elementID, className){
    var domElement = document.getElementById(elementID);

    domElement.classList.toggle(className);
}

function toggleDropdownTitleText(elementID, newText){
    var domElement = document.getElementById(elementID);
    var oldText = domElement.innerText
    var icon = document.getElementById("dropdownSourceIcon");

    if(oldText == "Source"){
        domElement.innerText = newText;
        icon.classList.toggle("display-none");
    }
    else{
        domElement.innerText = "Source";
        icon.classList.toggle("display-none");
    }


}

function toggleChevronRotate(){
    var dropdownChevron = document.getElementById("dropdownChevron")
    dropdownChevron.classList.toggle("dropdown-chevron-rotate");
    //dropdownChevron.classList.toggle("fa-rotate-180");
}

function removeAllDropdownStyles(){
    var dropdownLink = document.getElementById("dropdownLink");
    var dropdownChevron = document.getElementById("dropdownChevron");

    dropdownLink.classList.remove("dropdown-transition-styles");
    dropdownChevron.classList.remove("dropdown-chevron-rotate");
    //dropdownChevron.classList.remove("fa-rotate-180");
}

function setDropdownItemRemoveChevron(){
    var dropdownChevron = document.getElementById("dropdownChevron");
    var dropdownItemCollection = document.getElementsByClassName("dropdown-item");

    var dropdownItemsArray = Array.from(dropdownItemCollection);

        if(dropdownChevron.classList.contains("dropdown-chevron-rotate")) {
            dropdownItemsArray.forEach(item => {
                item.addEventListener("click", function() {
                    dropdownChevron.classList.remove("dropdown-chevron-rotate");
                })
            })
        }
}

