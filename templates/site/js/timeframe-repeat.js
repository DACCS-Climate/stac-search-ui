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

function buildRepeatFilterString(repeatType, startDateTimeInput, endDateTimeInput, startOnDate, endsOnDate, propertyTimeRangeStart){
    var initialTimeRangeArray = [];
    var initialIntervalArgumentList = {"op": "and", "args": []}
    var initialIntervalStartJSON = {"op": "<=", "args": [{"property": propertyTimeRangeStart}, ""]};
    var initialIntervalEndJSON = {"op": ">=", "args": [{"property": "end_datetime"}, ""]};
    var initialDateIntervalStart = new Date(startDateTimeInput);
    var initialDateIntervalEnd = new Date(endDateTimeInput);
    var amountOfTime = calculateTime(repeatType, startOnDate, endsOnDate);
    var repeatIntervalListArray = [];


    initialIntervalStartJSON.args[1].timestamp = initialDateIntervalEnd;
    initialIntervalEndJSON.args[1].timestamp = initialDateIntervalStart;

    initialTimeRangeArray.push(initialIntervalStartJSON);
    initialTimeRangeArray.push(initialIntervalEndJSON);
    initialIntervalArgumentList.args = initialTimeRangeArray;

    repeatIntervalListArray.push(initialIntervalArgumentList);

    for(var i = 1; i <= amountOfTime; i++) {
        var repeatDateTimeRangeArray = [];
        var dateIntervalArgumentList = {"op": "and", "args": []};
        var dateIntervalStartJSON = {"op": "<=", "args": [{"property": propertyTimeRangeStart}, ""]};
        var dateIntervalEndJSON = {"op": ">=", "args": [{"property": "end_datetime"}, ""]};
        var dateIntervalStart = new Date(startDateTimeInput);
        var dateIntervalEnd = new Date(endDateTimeInput);


        if(repeatType == "Daily") {
            dateIntervalStart.setDate((dateIntervalStart.getDate() + i));
            dateIntervalEnd.setDate((dateIntervalEnd.getDate() + i));

        }

        if(repeatType == "Weekly") {
            dateIntervalStart.setDate((dateIntervalStart.getDate() + (i * 7)));
            dateIntervalEnd.setDate((dateIntervalEnd.getDate() + (i * 7)));
        }

        if(repeatType == "Monthly") {
            dateIntervalStart.setMonth((dateIntervalStart.getMonth() + i));
            dateIntervalEnd.setMonth((dateIntervalEnd.getMonth() + i));
        }

        if(repeatType == "Yearly"){
            dateIntervalStart.setFullYear((dateIntervalStart.getFullYear() + i));
            dateIntervalEnd.setFullYear((dateIntervalEnd.getFullYear() + i));
        }

        if(repeatType == "Decade"){
            dateIntervalStart.setFullYear((dateIntervalStart.getFullYear() + i * 10));
            dateIntervalEnd.setFullYear((dateIntervalEnd.getFullYear() + i * 10));
        }


        dateIntervalStartJSON.args[1] = dateIntervalEnd;
        dateIntervalEndJSON.args[1] = dateIntervalStart;

        repeatDateTimeRangeArray.push(dateIntervalStartJSON);
        repeatDateTimeRangeArray.push(dateIntervalEndJSON);
        dateIntervalArgumentList.args = repeatDateTimeRangeArray;

        repeatIntervalListArray.push(dateIntervalArgumentList);
    }

    return repeatIntervalListArray;

}

//Add this to the existing populateTimeFrameFilter() function in dropdown-timeframe-scripts.js
//DO NOT replace the existing populateTimeFrameFilter() function
function populateTimeFrameFilter() {
    var repeatIntervalArray = [];
    var repeatStartDateTimeIntervalArray = [];

    var errorMessage = document.createElement("p");
    var timeFrameRepeatErrorContainer = document.getElementById("timeFrameRepeatErrorContainer");
    //var argumentFirstDateTimeJSON  = {"op":"like", "args":[{"property":"datetime"}, {"timestamp":""}]};
    //var argumentFirstStartDateTimeJSON = {"op":"like", "args":[{"property":"start_datetime"}, {"timestamp":""}]};
    //var argumentSecondEndDateTimeJSON = {"op":"like", "args":[{"property":"end_datetime"}, {"timestamp":""}]};

    var argumentFirstDateTimeJSON = {"op": "like", "args": [{"property": "datetime"}, ""]};
    var argumentFirstStartDateTimeJSON = {"op": "like", "args": [{"property": "start_datetime"}, ""]};
    var argumentSecondEndDateTimeJSON = {"op": "like", "args": [{"property": "end_datetime"}, ""]};

    errorMessage.classList.add("error-timeframe", "content");
    timeFrameRepeatErrorContainer.appendChild(errorMessage);
    var displayRepeat = document.createElement("p");

    var dateStart;
    var dateEnd;
    var timeStart;
    var timeEnd;
    var timeStartMinute;
    var timeStartSecond;
    var timeEndMinute;
    var timeEndSecond;

    var dropdownRepeatLabel = document.getElementById(dropdownRepeatLabelID);
    var displayRepeatValue = "";
    var startDateTime;

    if (datepickerStart.value) {
        dateStart = datepickerStart.value;
    }

    startDateTimeInput = dateStart + " " + "UTC";
    startDateTime = new Date(startDateTimeInput);

    switch (dropdownRepeatLabel.innerText) {
        case "Daily":
            displayRepeatValue = "Repeats Daily";


            var argumentPairDateTimeArray = [];
            var argumentPairStartDateTimeArray = [];

            var startRepeatHour = startDateTime.getUTCHours().toString();
            //var startRepeatMinute = startDateTime.getUTCMinutes();
            var startRepeatMinute = timeStartMinute;
            //var startRepeatSeconds = startDateTime.getUTCSeconds();
            var startRepeatSeconds = timeStartSecond;

            var endRepeatHour = endDateTime.getUTCHours().toString();
            //var endRepeatMinute = endDateTime.getUTCMinutes();
            var endRepeatMinute = timeEndMinute;
            //var endRepeatSeconds = endDateTime.getUTCSeconds();
            var endRepeatSeconds = timeEndSecond;

            //var startRegexFilterString = "____-__-__" + "T" + startRepeatHour + ":" + startRepeatMinute + ":" + startRepeatSeconds + ".000Z";
            var startRegexFilterString = "%T" + startRepeatHour + ":" + startRepeatMinute + ":" + startRepeatSeconds + "Z";
            //var startRegexFilterString = "____-__-__" + "T" + startRepeatHour + ":" + startRepeatMinute + ":" + startRepeatSeconds;

            //var endRegexFilterString = "____-__-__" + "T" + endRepeatHour + ":" + endRepeatMinute + ":" + endRepeatSeconds + ".000Z";
            var endRegexFilterString = "%T" + endRepeatHour + ":" + endRepeatMinute + ":" + endRepeatSeconds + "Z";
            //var endRegexFilterString = "____-__-__" + "T" + endRepeatHour + ":" + endRepeatMinute + ":" + endRepeatSeconds;

            //argumentFirstDateTimeJSON.args[1] = startRegexFilterString ;
            //argumentFirstStartDateTimeJSON.args[1] = startRegexFilterString;
            //argumentSecondEndDateTimeJSON.args[1] = endRegexFilterString;

            //argumentFirstDateTimeJSON.args[1].timestamp = "'" + startRegexFilterString + "'" + "," + "'" + endRegexFilterString + "'";
            //argumentFirstStartDateTimeJSON.args[1].timestamp = "'" + startRegexFilterString + "'" + "," + "'" + endRegexFilterString + "'";
            //argumentSecondEndDateTimeJSON.args[1].timestamp = endRegexFilterString;

            argumentFirstDateTimeJSON.args[1].timestamp = '"' + startDateTimeISO + '"' + ',' + '"' + endDateTimeISO + '"';
            argumentFirstStartDateTimeJSON.args[1].timestamp = '"' + startDateTimeISO + '"' + "," + '"' + endDateTimeISO + '"';
            //argumentSecondEndDateTimeJSON.args[1].timestamp = endRegexFilterString;


            /*
            argumentPairDateTimeArray.push(argumentFirstDateTimeJSON);
            argumentPairDateTimeArray.push(argumentSecondEndDateTimeJSON);

            argumentPairDateTimeJSON.args = argumentPairDateTimeArray;

            argumentPairStartDateTimeArray.push(argumentFirstStartDateTimeJSON);
            argumentPairStartDateTimeArray.push(argumentSecondEndDateTimeJSON);

            argumentPairStartDateTimeJSON.args = argumentPairStartDateTimeArray;

            repeatIntervalArray.push(argumentPairDateTimeJSON);
            repeatIntervalArray.push(argumentPairStartDateTimeJSON);*/

            repeatIntervalArray.push(argumentFirstDateTimeJSON);
            repeatIntervalArray.push(argumentFirstStartDateTimeJSON)

            //repeatIntervalArray = buildRepeatFilterString("Daily", startDateTimeInput, endDateTimeInput, startDateTime, endsOnDate, "datetime");
            //repeatStartDateTimeIntervalArray = buildRepeatFilterString("Daily", startDateTimeInput, endDateTimeInput, startDateTime, endsOnDate, "start_datetime");
            break;

        case "Weekly":
            displayRepeatValue = "Repeats Weekly";
            repeatIntervalArray = buildRepeatFilterString("Weekly", startDateTimeInput, endDateTimeInput, startDateTime, endsOnDate, "datetime");
            repeatStartDateTimeIntervalArray = buildRepeatFilterString("Weekly", startDateTimeInput, endDateTimeInput, startDateTime, endsOnDate, "start_datetime");
            break;

        case "Monthly":
            displayRepeatValue = "Repeats Monthly";
            repeatIntervalArray = buildRepeatFilterString("Monthly", startDateTimeInput, endDateTimeInput, startDateTime, endsOnDate, "datetime");
            repeatStartDateTimeIntervalArray = buildRepeatFilterString("Monthly", startDateTimeInput, endDateTimeInput, startDateTime, endsOnDate, "start_datetime");
            break;

        case "Yearly":
            displayRepeatValue = "Repeats Yearly";
            repeatIntervalArray = buildRepeatFilterString("Yearly", startDateTimeInput, endDateTimeInput, startDateTime, endsOnDate, "datetime");
            repeatStartDateTimeIntervalArray = buildRepeatFilterString("Yearly", startDateTimeInput, endDateTimeInput, startDateTime, endsOnDate, "start_datetime");
            break;

        case "Decade":
            displayRepeatValue = "Repeats Decade";
            repeatIntervalArray = buildRepeatFilterString("Decade", startDateTimeInput, endDateTimeInput, startDateTime, endsOnDate, "datetime");
            repeatStartDateTimeIntervalArray = buildRepeatFilterString("Decade", startDateTimeInput, endDateTimeInput, startDateTime, endsOnDate, "start_datetime");
            break;

    }

    //timeFrameFilterDiv.appendChild(displayRepeat);

    //displayRepeat.innerText = displayRepeatValue;

        if(repeatIntervalArray.length > 0){
        repeatIntervalJSON.args = repeatIntervalArray;
        //repeatStartDateTimeIntervalJSON.args = repeatStartDateTimeIntervalArray;
        dateFilterArray.push(repeatIntervalJSON);
        //dateFilterArray.push(repeatStartDateTimeIntervalJSON);
    }
}

function resetTimeFrameInput(dateStartElementID, timeStartElementID, dateEndElementID, timeEndElementID, allDayElementID
                             , repeatDropdownElementID, repeatLabelElementID, radioNeverElementID, radioEndsOnElementID
                             , dateEndsOnElementID, timeFrameErrorMessageContainer){

    var dateStart = document.getElementById(dateStartElementID);
    var timeStart = document.getElementById(timeStartElementID)
    var dateEnd = document.getElementById(dateEndElementID);
    var timeEnd  = document.getElementById(timeEndElementID);
    var allDayCheckbox = document.getElementById(allDayElementID);
    var repeatDropdown = document.getElementById(repeatDropdownElementID);
    var repeatDropdownLabel = document.getElementById(repeatLabelElementID);
    var radioNever = document.getElementById(radioNeverElementID);
    var radioEndsOn = document.getElementById(radioEndsOnElementID);
    var dateEndsOn = document.getElementById(dateEndsOnElementID);
    var timeFrameErrorContainer = document.getElementById(timeFrameErrorMessageContainer);

    dateStart.value = "";
    timeStart.value = "";
    dateEnd.value = "";
    timeEnd.value = "";
    dateEndsOn.value = "";

    if(allDayCheckbox.checked){
        allDayCheckbox.checked = false;
    }

    if(repeatDropdownLabel.innerText != "Does Not Repeat"){
        var repeatListItemID = repeatDropdownLabel.getAttribute('swappedid');
        var listItem = document.getElementById(repeatListItemID);

        var repeatDropdownLabelText = repeatDropdownLabel.innerText;

        repeatDropdownLabel.innerText = listItem.innerText;
        listItem.innerText = repeatDropdownLabelText;
    }

    if(!radioNever.checked){
        radioNever.checked = true;
    }

    if(radioEndsOn.checked){
        radioEndsOn.checked = false;
    }

    timeFrameErrorContainer.innerHTML = "";
}

function checkTimeFrameInputs(datepickerStartID, datepickerEndID, checkboxAllDayID, dropdownRepeatID,
                              dropdownRepeatLabelID, radioNeverID, radioEndsOnID, datepickerEndsOnID, divTimeFrameErrorID){
    var datepickerStart = document.getElementById(datepickerStartID);

    var datepickerEnd = document.getElementById(datepickerEndID);

    var checkboxAllDay = document.getElementById(checkboxAllDayID);
    var dropdownRepeatLabel = document.getElementById(dropdownRepeatLabelID);
    var radioNever = document.getElementById(radioNeverID);
    var radioEndsOn = document.getElementById(radioEndsOnID);
    var datepickerEndsOn = document.getElementById(datepickerEndsOnID);
    var startDateTimeErrorContainer = document.getElementById("startDateTimeError");
    var endDateTimeErrorContainer = document.getElementById("endDateTimeError");
    var divTimeFrameErrorContainer = document.getElementById(divTimeFrameErrorID);

    if(datepickerStart.value == "" || datepickerStart.value == null){
        var dateStartError = document.createElement("p");
        dateStartError.classList.add("error-timeframe", "button");
        dateStartError.innerText = "Please enter a start datetime";
        startDateTimeErrorContainer.appendChild(dateStartError);

    }

    if(datepickerEnd.value == "" || datepickerEnd.value == null){
        var dateEndError = document.createElement("p");
        dateEndError.classList.add("error-timeframe", "button");
        dateEndError.innerText = "Please enter an end datetime";
        endDateTimeErrorContainer.appendChild(dateEndError);
    }

    if(radioEndsOn.checked == false && dropdownRepeatLabel.innerText != "Does Not Repeat" && datepickerEndsOn.value == "" || radioEndsOn.checked == false && dropdownRepeatLabel.innerText != "Does Not Repeat" && datepickerEndsOn.value == null){
        var dateEndsOnError = document.createElement("p");
        dateEndsOnError.classList.add("error-timeframe", "button");
        dateEndsOnError.innerText = "Please enter the date the repeat ends on."
        divTimeFrameErrorContainer.appendChild(dateEndsOnError);
    }


}
