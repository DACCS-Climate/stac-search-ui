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