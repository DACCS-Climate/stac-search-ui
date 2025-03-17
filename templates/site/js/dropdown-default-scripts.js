function setSearchPageTitle(listULID, titleDivID){
    var titleDiv = document.getElementById(titleDivID);
    var list = document.getElementById(listULID);
    var dynamicTitle = "";
    var checkboxCount = 0;
    var checkboxArray = list.querySelectorAll('input[type=checkbox]')
    console.log(checkboxArray);

     if(checkboxArray[0].checked == true){
        checkboxCount = -1;
    }

    for(checkbox of checkboxArray){
        if(checkbox.checked){
            checkboxCount = checkboxCount + 1;
        }
    }

    if(checkboxArray[0].checked == true){
        titleDiv.innerText = "All Categories";
    }
    else{
        for(checkbox of checkboxArray){
            if(checkbox.checked == true && checkboxCount == 1){
                dynamicTitle = dynamicTitle + checkbox.value;
            }

            if(checkbox.checked == true && checkboxCount > 1){
                dynamicTitle = dynamicTitle + checkbox.value + ",";
            }
        }
        titleDiv.innerText = dynamicTitle;
    }
}

function checkCheckboxCount( listULID, defaultDropdownButtonTextID, defaultDropdownButtonText){
    var dropdownButtonTextElement = document.getElementById(defaultDropdownButtonTextID);
    var checkboxCount = 0;

    var list = document.getElementById(listULID);
    var checkboxArray = list.querySelectorAll('input[type=checkbox]')

    if(checkboxArray[0].checked == true){
        checkboxCount = -1;
    }

    for(checkbox of checkboxArray){
        if(checkbox.checked){
            checkboxCount = checkboxCount + 1;
        }
    }

    if(checkboxCount == 0){
        dropdownButtonTextElement.innerText = defaultDropdownButtonText ;
    }
    else{
        if(checkboxCount == checkboxArray.length - 1){
            checkboxArray[0].checked = true;
        }
        else{
            checkboxArray[0].checked = false;
        }
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
