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

function selectAllCheckbox(listULID, defaultDropdownButtonTextID, defaultDropdownLabelText){
    var checkboxCount = 0;
    var dropdownButtonTextElement = document.getElementById(defaultDropdownButtonTextID);
    var list = document.getElementById(listULID);
    var checkboxArray = list.querySelectorAll('input[type=checkbox]')

    if(checkboxArray[0].checked == true){
        for(checkbox of checkboxArray){
            checkbox.checked = true
            if(checkbox.checked){
                checkboxCount = checkboxCount + 1;
            }
        }

        checkboxCount = checkboxCount - 1;

        if(checkboxCount == 0){
            dropdownButtonTextElement.innerText = defaultDropdownLabelText ;
        }
        else{
            dropdownButtonTextElement.innerText = checkboxCount + " Catalogs Selected" ;
        }
    }
    else{
        for(checkbox of checkboxArray){
            checkbox.checked = false;
        }
        dropdownButtonTextElement.innerText = defaultDropdownLabelText ;
    }
}

