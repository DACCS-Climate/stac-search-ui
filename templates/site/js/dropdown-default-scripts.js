document.addEventListener("DOMContentLoaded", function () {
    //Runs functions from ui-styles-scripts.js
    var dropdownContainer = document.getElementById("dropdownListDefaultContainer");

    dropdownContainer.addEventListener('click', function (event) {
        toggleChevronRotate("dropdownListDefaultButton", "dropdown-list-icon-rotate");
        toggleTextColour("dropdownListTitleText", "dropdown-list-title-text");
        toggleDropdownPanelBackground("dropdownListDefaultContainer");
    });

    dropdownContainer.addEventListener('blur', function(){
        removeChevronRotate("dropdownListDefaultButton", "dropdown-list-icon-rotate");
        removeTextColour("dropdownListTitleText", "dropdown-list-title-text");
        removeDropdownPanelBackground("dropdownListDefaultContainer");
    });
});

function checkCheckboxCount( listULID, defaultDropdownButtonTextID, defaultDropdownButtonText){
    var dropdownButtonTextElement = document.getElementById(defaultDropdownButtonTextID);
    var checkboxCount = 0;

    var list = document.getElementById(listULID);
    var checkboxArray = list.querySelectorAll('input[type=checkbox]')


    for(checkbox of checkboxArray){
        if(checkbox.checked){
            checkboxCount = checkboxCount + 1;
        }
    }
    if(checkboxCount == 0){
        dropdownButtonTextElement.innerText = defaultDropdownButtonText ;
    }
    else{
        dropdownButtonTextElement.innerText = checkboxCount + " Catalogs Selected" ;
    }
}

function selectAllCheckbox(listULID, defaultDropdownButtonTextID, allCheckboxID, defaultDropdownLabelText){
    var checkboxCount = 0;
    var dropdownButtonTextElement = document.getElementById(defaultDropdownButtonTextID);
    var allCheckbox = document.getElementById(allCheckboxID);
    var list = document.getElementById(listULID);
    var checkboxArray = list.querySelectorAll('input[type=checkbox]')

        console.log(checkboxArray);

    //var checkboxResultArray = checkboxArray.splice(0,1);

    for(checkbox of checkboxArray){
        checkbox.checked = true

        checkboxCount = (checkboxCount + 1) - 1;
    }

    if(checkboxCount == 0){
        dropdownButtonTextElement.innerText = defaultDropdownLabelText ;
    }
    else{
        dropdownButtonTextElement.innerText = checkboxCount + " Catalogs Selected" ;
    }



}