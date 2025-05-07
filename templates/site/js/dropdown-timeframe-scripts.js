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

function checkboxToggleAllDay(checkboxID, timeStartID, dateEndID,  timeEndID){
    var checkboxAllDay = document.getElementById(checkboxID);
    var timeStart = document.getElementById(timeStartID);
    var dateEnd = document.getElementById(dateEndID);
    var timeEnd = document.getElementById(timeEndID);

    if(checkboxAllDay.checked){
        timeStart.setAttribute('disabled', 'disabled');
        dateEnd.setAttribute('disabled', 'disabled');
        timeEnd.setAttribute('disabled', 'disabled');

    }
    else{
        timeStart.removeAttribute('disabled');
        dateEnd.removeAttribute( 'disabled');
        timeEnd.removeAttribute('disabled');
    }
}

function resetDateEndInput(elementID){
    var dateEndInput = document.getElementById(elementID);
    dateEndInput.value = "";
}

function resetTimeInput(elementID){
    var timeInput = document.getElementById(elementID);
    timeInput.value = "";
}

function closeTimeFramePanel(dropdownHrefButtonID, dropdownListID){
    var dropdownButton = document.getElementById(dropdownHrefButtonID);
    var dropdownList = document.getElementById(dropdownListID);

    dropdownButton.setAttribute('aria-expanded', "false");

    if(dropdownList.classList.contains("show")){
        dropdownList.classList.remove("show");
        dropdownButton.classList.remove("show");
    }
}

function resetTimeFrameInput(dateStartElementID, timeStartElementID, dateEndElementID, timeEndElementID, allDayElementID, repeatDropdownElementID, repeatLabelElementID, radioNeverElementID, radioEndsOnElementID, dateEndsOnElementID){

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
}

function calculateTime(timeType, startDate, endDate) {
    var timeDifference;

    switch (timeType){
        case "Daily":
            let dateDifference = endDate - startDate;
            timeDifference = dateDifference / (1000 * 3600 * 24);
            break;

        case "Weekly":

            let dayDifference = endDate - startDate;
            timeDifference = dayDifference / (1000 * 3600 * 24 * 7);

        case "Monthly":

            timeDifference = endDate.getMonth() - startDate.getMonth() + (12 * (endDate.getFullYear() - startDate.getFullYear()));
            break;

        case "Yearly":

            timeDifference = endDate.getFullYear() - startDate.getFullYear()
            break;

        case "Decade":

            timeDifference = (endDate.getFullYear() - startDate.getFullYear()) / 10;
            break;

        case "Custom":
    }

    return timeDifference;
}

function buildRepeatFilterString(repeatType, startDateTimeInput, endDateTimeInput, startOnDate, endsOnDate, propertyTimeRangeStart){
    var initialTimeRangeArray = [];
    var initialIntervalArgumentList = {"op": "and", "args": []}
    var initialIntervalStartJSON = {"op": "<=", "args": [{"property": propertyTimeRangeStart}, {"timestamp": ""}]};
    var initialIntervalEndJSON = {"op": ">=", "args": [{"property": "end_datetime"}, {"timestamp": ""}]};
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
        var dateIntervalStartJSON = {"op": "<=", "args": [{"property": propertyTimeRangeStart}, {"timestamp": ""}]};
        var dateIntervalEndJSON = {"op": ">=", "args": [{"property": "end_datetime"}, {"timestamp": ""}]};
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


        dateIntervalStartJSON.args[1].timestamp = dateIntervalEnd;
        dateIntervalEndJSON.args[1].timestamp = dateIntervalStart;

        repeatDateTimeRangeArray.push(dateIntervalStartJSON);
        repeatDateTimeRangeArray.push(dateIntervalEndJSON);
        dateIntervalArgumentList.args = repeatDateTimeRangeArray;

        repeatIntervalListArray.push(dateIntervalArgumentList);
    }

    return repeatIntervalListArray;

}



function populateTimeframeFilter(datepickerStartID, timepickerStartID, datepickerEndID, timepickerEndID, checkboxAllDayID, dropdownRepeatID, dropdownRepeatLabelID, radioNeverID, radioEndsOnID, datepickerEndsOnID){
    var argumentDateFilterJSON = JSON.parse('{"op": "or","args" : [ ]}');
    var argumentDateTimeJSON = JSON.parse('{"op": "or","args" : [ ]}');
    var argumentDateTimeRangeJSON = JSON.parse('{"op": "and","args" : [ ]}');
    var argumentSearchDateTimeRangeJSON = JSON.parse('{"op": "and","args" : [ ]}');
    var argumentSearchStartDateTimeRangeJSON = JSON.parse('{"op": "and","args" : [ ]}');
    var repeatIntervalJSON = JSON.parse('{"op": "or","args" : [ ]}');
    var repeatStartDateTimeIntervalJSON = JSON.parse('{"op": "or","args" : [ ]}');
    var argumentDateTimeSingleJSON = {"op":"=", "args":[{"property":"datetime"},{"timestamp":""}]};

    var argumentDateTimeStartJSON = {"op":">=", "args":[{"property":"datetime"},{"timestamp":""}]};
    var argumentDateTimeEndJSON = {"op":"<=", "args":[{"property":"datetime"},{"timestamp":""}]};

    var argumentStartDateTimeJSON = {"op":"<=", "args":[{"property":"start_datetime"},{"timestamp":""}]};

    var argumentDateTimeStartRangeJSON = {"op":"<=", "args":[{"property":"datetime"},{"timestamp":""}]};
    var argumentDateTimeEndRangeJSON = {"op":">=", "args":[{"property":"end_datetime"},{"timestamp":""}]};
    var filterDateTimeArgument = {"op":"=", "args":[]};
    var dateSingleArgumentArray = [];
    var dateArgumentArray = [];
    var dateStartTimeRangeArgumentArray = [];
    var dateRangeArgumentArray = [];
    var dateFilterArray = [];
    var datetimeObject = {"datetime": ""};
    var timeFrameFilterDiv = document.getElementById("searchFilterTimeFrameBody")
    var timeFrameHiddenDiv = document.getElementById("searchFilterTimeFrameHidden");
    var datepickerStart = document.getElementById(datepickerStartID);
    var timepickerStart = document.getElementById(timepickerStartID);
    var datepickerEnd = document.getElementById(datepickerEndID);
    var timepickerEnd = document.getElementById(timepickerEndID);
    var checkboxAllDay = document.getElementById(checkboxAllDayID);
    var dropdownRepeatLabel = document.getElementById(dropdownRepeatLabelID);
    var radioNever = document.getElementById(radioNeverID);
    var radioEndsOn = document.getElementById(radioEndsOnID);
    var datepickerEndsOn = document.getElementById(datepickerEndsOnID);
    var timeframeErrorContainer = document.getElementById("timeframeErrorContainer");

    var displayDateRangeContainer = document.createElement("div");
    var displayDateRangeStart = document.createElement("p");
    var displayDateRangeEnd = document.createElement("p");
    var displayTimeRangeContainer = document.createElement("div");
    var displayTimeRangeStart = document.createElement("p");
    var displayTimeRangeEnd = document.createElement("p");
    var displayRepeat = document.createElement("p");
    var errorMessage = document.createElement("p");
    var displayTimeStart = "";
    var displayTimeEnd = "";
    var displayRepeatValue = "";

    errorMessage.classList.add("error-timeframe", "content");
    timeframeErrorContainer.appendChild(errorMessage);


    displayDateRangeContainer.appendChild(displayDateRangeStart);
    displayDateRangeContainer.appendChild(displayDateRangeEnd);

    displayTimeRangeContainer.appendChild(displayTimeRangeStart);
    displayTimeRangeContainer.appendChild(displayTimeRangeEnd);

    timeFrameFilterDiv.innerText = "";
    timeFrameHiddenDiv.innerText = "";
    displayDateRangeContainer.classList.add("div-search-timeframe-container");
    displayTimeRangeContainer.classList.add("div-search-timeframe-container");
    displayDateRangeStart.classList.add("subtitle-1");
    displayDateRangeEnd.classList.add("subtitle-1");
    displayTimeRangeStart.classList.add("subtitle-1");
    displayTimeRangeEnd.classList.add("subtitle-1");


    var dateStart;
    var dateEnd;
    var timeStart;
    var timeEnd;
    var timeStartMinute;
    var timeStartSecond;
    var timeEndMinute;
    var timeEndSecond;



    var neverEnds = radioNever.checked;
    var endsOn = radioEndsOn.checked;
    var endsOnDate;
    var endsOnDateInput;
    var endsOnDateISO;
    var dateRange = "";

    var startDateTimeInput;
    var endDateTimeInput;

    var startDateTime ;
    var startDateTimeISO;
    var endDateTime ;
    var endDateTimeISO;

    //TODO: Keep for switch-case for repetition filters
    var repeatIntervalArray = [];
    var repeatStartDateTimeIntervalArray = [];



    if(endsOn){
        endsOnDateInput = datepickerEndsOn.value + " " + "UTC";
        endsOnDate = new Date(endsOnDateInput);
        endsOnDateISO = endsOnDate.toISOString();
    }

    if (datepickerStart.value) {
        dateStart = datepickerStart.value;

        if (timepickerStart.value) {
            timeStart = timepickerStart.value;
        }
        else{
            timeStart = "00:00:00";
        }
    }

    if(datepickerEnd.value) {
        dateEnd = datepickerEnd.value;
    }
    else{
        dateEnd = datepickerStart.value;
    }

    if (timepickerEnd.value) {
        timeEnd = timepickerEnd.value;
    }
    else{
        timeEnd = "24:00:00";
    }


    startDateTimeInput = dateStart + " " + timeStart + " " +  "UTC";
    startDateTime = new Date(startDateTimeInput);
    startDateTimeISO = startDateTime.toISOString();
    var startDateTimeNoMilliSeconds = startDateTimeISO.slice(0, startDateTimeISO.lastIndexOf("."));
    startDateTimeNoMilliSeconds = startDateTimeNoMilliSeconds + "Z";

    if(startDateTime.getUTCMinutes() < 10){
        timeStartMinute = "0" + startDateTime.getUTCMinutes().toString();
    }
    else{
        timeStartMinute = startDateTime.getUTCMinutes().toString();
    }

    if(startDateTime.getUTCSeconds() < 10){
        timeStartSecond = "0" + startDateTime.getUTCSeconds().toString();
    }
    else{
        timeStartSecond = startDateTime.getUTCSeconds().toString();
    }

    displayTimeStart = startDateTime.getUTCHours().toString() + ":" + timeStartMinute + ":" + timeStartSecond;

    displayDateRangeStart.innerText = startDateTime.toDateString();




    endDateTimeInput = dateEnd + " " + timeEnd + " " + "UTC";
    endDateTime = new Date(endDateTimeInput);
    endDateTimeISO = endDateTime.toISOString();
    var endDateTimeNoMilliSeconds = endDateTimeISO.slice(0, endDateTimeISO.lastIndexOf("."));
    endDateTimeNoMilliSeconds = endDateTimeNoMilliSeconds + "Z";

    if(endDateTime.getUTCMinutes() < 10){
        timeEndMinute = "0" + endDateTime.getUTCMinutes().toString();
    }
    else{
        timeEndMinute = endDateTime.getUTCMinutes().toString();
    }

    if(endDateTime.getUTCSeconds() < 10){
        timeEndSecond = "0" + endDateTime.getUTCSeconds().toString();
    }
    else{
        timeEndSecond = endDateTime.getUTCSeconds().toString();
    }

    displayDateRangeEnd.innerText = " - " + endDateTime.toDateString();
    displayTimeEnd = " - " + endDateTime.getUTCHours().toString() + ":" + timeEndMinute + ":" + timeEndSecond;




    if(dropdownRepeatLabel.innerText == "Does Not Repeat"){
        displayRepeatValue = "Does Not Repeat";

        if(checkboxAllDay.checked){
            timeStart = "00:00";
            timeEnd = "24:00";
            dateStart = datepickerStart.value;
            dateEnd = dateStart;

            startDateTimeInput = dateStart + " " + timeStart + " " +  "UTC";
            startDateTime = new Date(startDateTimeInput);
            startDateTimeISO = startDateTime.toISOString();
            var startDateTimeNoMilliSeconds = startDateTimeISO.slice(0, startDateTimeISO.lastIndexOf("."));
            startDateTimeNoMilliSeconds = startDateTimeNoMilliSeconds + "Z";

            endDateTimeInput = dateEnd + " " + timeEnd + " " + "UTC";
            endDateTime = new Date(endDateTimeInput);
            endDateTimeISO = endDateTime.toISOString();
            var endDateTimeNoMilliSeconds = endDateTimeISO.slice(0, endDateTimeISO.lastIndexOf("."));
            endDateTimeNoMilliSeconds = endDateTimeNoMilliSeconds + "Z";

            //Item with just datetime and within 24 hours
             argumentDateTimeEndJSON.args[1].timestamp = startDateTimeNoMilliSeconds;
             argumentDateTimeStartJSON.args[1].timestamp = endDateTimeNoMilliSeconds;
             dateSingleArgumentArray.push(argumentDateTimeStartJSON);
             dateSingleArgumentArray.push(argumentDateTimeEndJSON);

             displayTimeStart = "All Day";
        }
        else {
            var daysBetweenStartEnd = Math.floor(calculateTime("Daily", startDateTime,  endDateTime));

            if(daysBetweenStartEnd > 0){
                //Item with just datetime
                 argumentDateTimeEndJSON.args[1].timestamp = startDateTimeNoMilliSeconds;
                 argumentDateTimeStartJSON.args[1].timestamp = endDateTimeNoMilliSeconds;
                 dateSingleArgumentArray.push(argumentDateTimeStartJSON);
                 dateSingleArgumentArray.push(argumentDateTimeEndJSON);

                 //Item with datetime and end_datetime
                 argumentDateTimeEndRangeJSON.args[1].timestamp = startDateTimeNoMilliSeconds;
                 argumentDateTimeStartRangeJSON.args[1].timestamp = endDateTimeNoMilliSeconds;
                 dateRangeArgumentArray.push(argumentDateTimeStartRangeJSON);
                 dateRangeArgumentArray.push(argumentDateTimeEndRangeJSON);

                 //Item with start_datetime and end_datetime
                 argumentDateTimeEndRangeJSON.args[1].timestamp = startDateTimeNoMilliSeconds;
                 argumentStartDateTimeJSON.args[1].timestamp = endDateTimeNoMilliSeconds;
                 dateStartTimeRangeArgumentArray.push(argumentStartDateTimeJSON);
                 dateStartTimeRangeArgumentArray.push(argumentDateTimeEndRangeJSON);
            }
            else{
                //Item with just datetime
                 argumentDateTimeStartJSON.args[1].timestamp = startDateTimeNoMilliSeconds;
                 argumentDateTimeEndJSON.args[1].timestamp = endDateTimeNoMilliSeconds;
                 dateArgumentArray.push(argumentDateTimeStartJSON);
                 dateArgumentArray.push(argumentDateTimeEndJSON);
            }
        }
    }
    else{
        //TODO: Add repetition for Custom
        switch(dropdownRepeatLabel.innerText){
        case "Daily":
            displayRepeatValue = "Repeats Daily";
            repeatIntervalArray = buildRepeatFilterString("Daily", startDateTimeInput, endDateTimeInput, startDateTime, endsOnDate, "datetime");
            repeatStartDateTimeIntervalArray = buildRepeatFilterString("Daily", startDateTimeInput, endDateTimeInput, startDateTime, endsOnDate, "start_datetime");
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

        case "Custom":
            displayRepeatValue = "";


        }
    }


    if(dateArgumentArray.length > 0 ){
        argumentDateTimeJSON.args = dateArgumentArray;
        dateFilterArray.push(argumentDateTimeJSON);
    }

    if(dateSingleArgumentArray.length > 0 ){
        argumentSearchDateTimeRangeJSON.args = dateSingleArgumentArray;
        dateFilterArray.push(argumentSearchDateTimeRangeJSON);
    }

    if(dateRangeArgumentArray.length > 0 ){
        argumentDateTimeRangeJSON.args = dateRangeArgumentArray;
        dateFilterArray.push(argumentDateTimeRangeJSON);
    }

    if(dateStartTimeRangeArgumentArray.length > 0 ){
        argumentSearchStartDateTimeRangeJSON.args = dateStartTimeRangeArgumentArray;
        dateFilterArray.push(argumentSearchStartDateTimeRangeJSON);
    }

    if(repeatIntervalArray.length > 0){
        repeatIntervalJSON.args = repeatIntervalArray;
        repeatStartDateTimeIntervalJSON.args = repeatStartDateTimeIntervalArray;
        dateFilterArray.push(repeatIntervalJSON);
        dateFilterArray.push(repeatStartDateTimeIntervalJSON);
    }

    argumentDateFilterJSON.args = dateFilterArray;
    timeFrameHiddenDiv.innerText = JSON.stringify(argumentDateFilterJSON);

    //TODO: Keep console log for final filter JSON for now
    console.log(argumentDateFilterJSON)

    if(datepickerEnd.value == "" || datepickerEnd.value == null){
        if(!checkboxAllDay.checked){
            errorMessage.innerText = "End Date needed";

        }
    }
    else{
        displayTimeRangeStart.innerText = displayTimeStart;
        displayTimeRangeEnd.innerText = displayTimeEnd;
        displayRepeat.innerText = displayRepeatValue;

    timeFrameFilterDiv.appendChild(displayDateRangeContainer);
    timeFrameFilterDiv.appendChild(displayTimeRangeContainer);
    timeFrameFilterDiv.appendChild(displayRepeat);
    }



}