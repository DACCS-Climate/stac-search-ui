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

function convertDate(elementID){
    var domElement = document.getElementById(elementID);
    if(typeof domElement.value != "date") {
        var dateParse = Date.parse(domElement.value);
        var newDate = new Date(dateParse).toUTCString();
        var dateArray = newDate.split(" ");

        domElement.value = dateArray[2] + " - " + dateArray[1] + " - " + dateArray[3];
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

