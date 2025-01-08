function toggleTextColour(elementID, className){
    var dropdownTitle = document.getElementById(elementID)

    if(dropdownTitle.classList.contains(className)){
        dropdownTitle.classList.remove(className);
    }
    else{
        dropdownTitle.classList.add(className);
    }
}

function removeTextColour(elementID, className){
    var dropdownTitle = document.getElementById(elementID)

    dropdownTitle.classList.remove(className);

}

function toggleChevronRotate(elementID, className){
    var dropdownTitle = document.getElementById(elementID)

    if(dropdownTitle.classList.contains(className)){
        dropdownTitle.classList.remove(className);
    }
    else{
        dropdownTitle.classList.add(className);
    }

}

function removeChevronRotate(elementID, className){
    var dropdownTitle = document.getElementById(elementID)

    dropdownTitle.classList.remove(className);

}

function toggleDropdownPanelBackground(elementID){
    var dropdownTitle = document.getElementById(elementID)

    if(dropdownTitle.classList.contains("dropdown-panel-background-white")){
        dropdownTitle.classList.remove("dropdown-panel-background-white");
    }
    else{
        dropdownTitle.classList.add("dropdown-panel-background-white");
    }
}

function removeDropdownPanelBackground(elementID){
    var dropdownTitle = document.getElementById(elementID)

    dropdownTitle.classList.remove("dropdown-panel-background-white");
}

//Toggles text in Source dropdown to show STAC version
function toggleDropdownPanelTitleText(){
    var titleText = document.getElementById("dropdownTitleText");
    var titleStacVersionDiv = document.getElementById("dropdownStacTitle");

    if(titleText.classList.contains("display-none")){
        titleText.classList.remove("display-none");
    }
    else{
        titleText.classList.add("display-none");
    }

    if(titleStacVersionDiv.classList.contains("display-none")){
        titleStacVersionDiv.classList.remove("display-none");
    }
    else{
        titleStacVersionDiv.classList.add("display-none");
    }

}


function populateStacVersion(elementID){
    var titleStacVersionDiv = document.getElementById(elementID);

    getStacVersion().then(json => {
        titleStacVersionDiv.innerHTML = json.stac_version;

     });
}

async function getStacVersion(){
    const servicesURLFragment = "/stac";

    const response = await fetch(servicesURLFragment, {
        method: "GET",
        headers: {
            "Accept": "application/json, text/plain",
            "Content-Type": "application/json"
        }
    });
    return await response.json();
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

