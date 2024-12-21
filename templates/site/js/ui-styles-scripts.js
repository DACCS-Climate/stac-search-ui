function toggleChevronRotate(elementID){
    var dropdownChevron = document.getElementById(elementID)
    //dropdownChevron.classList.toggle("dropdown-chevron-rotate");
    dropdownChevron.classList.toggle("dropdown-panel-icon");
}

function toggleDropdownPanelBackground(elementID){
    var dropdownChevron = document.getElementById(elementID)
    dropdownChevron.classList.toggle("dropdown-panel-title-white");
}

function setPlaceholderText(element, text){
    element.setAttribute("placeholder", text);
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

function setTextboxBackground(element){
    if(element.classList.contains("input-number-small-background")){
        element.classList.remove("input-number-small-background");
    }

    if(element.value.length > 0){
        element.classList.add("input-number-small-background");
    }
}

function removeAllDropdownStyles(){
    var dropdownLink = document.getElementById("dropdownLink");
    var dropdownChevron = document.getElementById("dropdownChevron");

    dropdownLink.classList.remove("dropdown-transition-styles");
    dropdownChevron.classList.remove("dropdown-chevron-rotate");
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

