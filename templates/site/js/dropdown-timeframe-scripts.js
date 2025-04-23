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

function populateTimeframeFilter(datepickerStartID, timepickerStartID, datepickerEndID, timepickerEndID, checkboxAllDayID, checkboxRepeatID, radioNeverID, radioEndsOnID, datepickerEndsOnID){
        var filterDateTime = {datetime: ""};
        var timeFrameFilterDiv = document.getElementById("searchFilterTimeFrameBody")
        var timeFrameHiddenDiv = document.getElementById("searchFilterTimeFrameHidden");
        var datepickerStart = document.getElementById(datepickerStartID);
    var timepickerStart = document.getElementById(timepickerStartID);
    var datepickerEnd = document.getElementById(datepickerEndID);
    var timepickerEnd = document.getElementById(timepickerEndID);
    var checkboxAllDay = document.getElementById(checkboxAllDayID);
    var checkboxRepeat = document.getElementById(checkboxRepeatID);
    var radioNever = document.getElementById(radioNeverID);
    var radioEndsOn = document.getElementById(radioEndsOnID);
    var datepickerEndsOn = document.getElementById(datepickerEndsOnID);


    var dateStart = datepickerStart.value;
    var dateEnd = datepickerEnd.value;
    var timeStart = timepickerStart.value;
    var timeEnd = timepickerEnd.value;
    var allDay = checkboxAllDay.checked;
    var repeat = checkboxRepeat.checked;
    var neverEnds = radioNever.value;
    var endsOn = radioEndsOn.value;
    var endsOnDate = datepickerEndsOn.value;
    var dateRange = "";

    var startDateTimeInput = dateStart + " " + timeStart;
    console.log(startDateTimeInput);
    var startDateTime = new Date(startDateTimeInput);
    var startDateTimeISO = startDateTime.toISOString();
    var endDateTime = new Date(dateEnd + timeEnd);
    var endDateTimeISO = endDateTime.toISOString();

    if(allDay){
        filterDateTime.datetime = startDateTimeISO;
    }
    else{
            dateRange = startDateTimeISO + "/" + endDateTimeISO;
        filterDateTime.datetime = dateRange;
    }

    timeFrameHiddenDiv.innerText = JSON.stringify(filterDateTime);
    console.log(filterDateTime);

}