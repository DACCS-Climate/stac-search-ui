function setPlaceholderText(searchInputElement){
    searchInputElement.setAttribute("placeholder", "Search by keyword");
}
function updatePlaceholderText(searchInputElement){
    searchInputElement.setAttribute("placeholder", "Type to search");
}


function toggleDropdownStyles(){

    //var dropdownLink = document.getElementById("dropdownLink");
    var dropdownRegularContainer = document.getElementById("dropdownRegularContainer");
    var dropdownLabel = document.getElementById("dropdownRegularLabel");
    var dropdownChevron = document.getElementById("dropdownRegularChevron");
    /*if(dropdownLink.classList.contains("dropdown-transition-styles"))
    {
        dropdownLink.classList.remove("dropdown-transition-styles")
    }
    else{
        dropdownLink.classList.add("dropdown-transition-styles")
    }*/
    dropdownRegularContainer.classList.toggle("dropdown-transition-styles");
    dropdownLabel.classList.toggle("dropdown-label-toggle");
    dropdownChevron.classList.toggle("dropdown-chevron-dark");
    dropdownChevron.classList.toggle("dropdown-chevron-rotate");
    //dropdownChevron.classList.toggle("dropdown-chevron-unrotate");

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

