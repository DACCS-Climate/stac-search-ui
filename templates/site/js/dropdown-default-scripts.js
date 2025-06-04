function setSearchPageTitle(listULID, titleDivID){
    var titleDiv = document.getElementById(titleDivID);
    var list = document.getElementById(listULID);
    var dynamicTitle = "";
    var checkboxCount = 0;
    var checkboxArray = list.querySelectorAll('input[type=checkbox]');

     if(checkboxArray[0].checked == true){
        checkboxCount = -1;
    }

    for(checkbox of checkboxArray){
        if(checkbox.checked){
            checkboxCount = checkboxCount + 1;
        }
    }

    if(checkboxArray[0].checked == true){
        titleDiv.innerText = "All Collections";
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
    var checkboxArray = list.querySelectorAll('input[type=checkbox]');

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
        dropdownButtonTextElement.innerText = checkboxCount + " Collections Selected" ;
    }
}

function selectAllCheckbox(listULID, defaultDropdownButtonTextID, defaultDropdownLabelText){
    var checkboxCount = 0;
    var dropdownButtonTextElement = document.getElementById(defaultDropdownButtonTextID);
    var list = document.getElementById(listULID);
    var checkboxArray = list.querySelectorAll('input[type=checkbox]');

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
            dropdownButtonTextElement.innerText = checkboxCount + " Collections Selected" ;
        }
    }
    else{
        for(checkbox of checkboxArray){
            checkbox.checked = false;
        }
        dropdownButtonTextElement.innerText = defaultDropdownLabelText ;
    }
}

function setCheckboxFilterJSON(listULID){
    var searchFilterCollectionsHidden = document.getElementById("searchFilterCollectionsHidden");
    var list = document.getElementById(listULID);
    var checkboxArray = list.querySelectorAll('input[type=checkbox]');
    var argumentArray = [];
    var argumentJSON = JSON.parse('{"op": "or","args" : [ ]}');
    var argumentObject;

    if(checkboxArray[0].checked == true) {
        for(let i = 1; i < checkboxArray.length; i++){
            argumentObject = {'op': '=','args' : [{ 'property': 'collection' },  checkboxArray[i].value ]};
            argumentArray.push(argumentObject);
        }
    }
    else{
        for (checkbox of checkboxArray) {
            if(checkbox.checked){
                argumentObject = {'op': '=','args' : [{ 'property': 'collection' }, checkbox.value ]};
                argumentArray.push(argumentObject);
            }
        }
    }

    argumentJSON["args"] = argumentArray;
    searchFilterCollectionsHidden.innerText = JSON.stringify(argumentJSON);
}

function populateDatasetsFilter(listULID){
    var searchFilterCollectionsBody = document.getElementById("searchFilterCollectionsBody");
    var list = document.getElementById(listULID);
    var checkboxArray = list.querySelectorAll('input[type=checkbox]');

    searchFilterCollectionsBody.innerText = "";
    searchFilterCollectionsBody.classList.add("div-datasets-filter");

        if(checkboxArray[0].checked == true) {
        for(let i = 1; i < checkboxArray.length; i++){
            var datasetEntry = document.createElement("p");
            datasetEntry.classList.add("body-1");
            datasetEntry.innerText = checkboxArray[i].value;
            searchFilterCollectionsBody.appendChild(datasetEntry);
        }
    }
    else{
        for (checkbox of checkboxArray) {
            if(checkbox.checked){
                var datasetEntry = document.createElement("p");
                datasetEntry.classList.add("body-1");
                datasetEntry.innerText = checkbox.value;
                searchFilterCollectionsBody.appendChild(datasetEntry);
            }
        }
    }
}

