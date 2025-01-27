function defaultRadioState(radioElementID, dateInputFieldID){

        var radioButton = document.getElementById(radioElementID);
        var dateInput = document.getElementById(dateInputFieldID);

        radioButton.checked = true;
        dateInput.disabled = true;

}

function enableEndsOnDateInput(radioElementID, dateInputFieldID){
        var radioButton = document.getElementById(radioElementID);
        var dateInput = document.getElementById(dateInputFieldID);

        if(radioButton.checked == true){
                dateInput.disabled = false;
        }
}

function disableEndsOnDateInput(radioElementID, dateInputFieldID){
        var radioButton = document.getElementById(radioElementID);
        var dateInput = document.getElementById(dateInputFieldID);

        if(radioButton.checked == true){
                dateInput.disabled = true;
        }
}
