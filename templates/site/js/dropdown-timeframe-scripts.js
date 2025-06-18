function resetTimeFrameInput(dateStartElementID, dateEndElementID){

    var dateStart = document.getElementById(dateStartElementID);
    var dateEnd = document.getElementById(dateEndElementID);

    dateStart.value = "";
    dateEnd.value = "";
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


function populateTimeframeFilter(datepickerStartID, datepickerEndID){
    var argumentDateFilterJSON = JSON.parse('{"op": "or","args" : [ ]}');
    var argumentDateTimeJSON = JSON.parse('{"op": "or","args" : [ ]}');
    var argumentDateTimeRangeJSON = JSON.parse('{"op": "and","args" : [ ]}');
    var argumentSearchDateTimeRangeJSON = JSON.parse('{"op": "and","args" : [ ]}');
    var argumentSearchStartDateTimeRangeJSON = JSON.parse('{"op": "and","args" : [ ]}');
    var argumentDateTimeStartJSON = {"op":">=", "args":[{"property":"datetime"}, ""]};
    var argumentDateTimeEndJSON = {"op":"<=", "args":[{"property":"datetime"}, ""]};
    var argumentStartDateTimeJSON = {"op":"<=", "args":[{"property":"start_datetime"}, ""]};
    var argumentDateTimeStartRangeJSON = {"op":"<=", "args":[{"property":"datetime"}, ""]};
    var argumentDateTimeEndRangeJSON = {"op":">=", "args":[{"property":"end_datetime"}, ""]};
    var dateSingleArgumentArray = [];
    var dateArgumentArray = [];
    var dateStartTimeRangeArgumentArray = [];
    var dateRangeArgumentArray = [];
    var dateFilterArray = [];
    var timeFrameFilterDiv = document.getElementById("searchFilterTimeFrameBody")
    var timeFrameHiddenDiv = document.getElementById("searchFilterTimeFrameHidden");
    var datepickerStart = document.getElementById(datepickerStartID);
    var datepickerEnd = document.getElementById(datepickerEndID);

    var displayDateRangeContainer = document.createElement("div");
    var displayDateRangeStart = document.createElement("p");
    var displayDateRangeEnd = document.createElement("p");

    var errorMessage = document.createElement("p");
    var displayTimeStart = "";

    errorMessage.classList.add("error-timeframe", "content");

    displayDateRangeContainer.appendChild(displayDateRangeStart);
    displayDateRangeContainer.appendChild(displayDateRangeEnd);

    timeFrameFilterDiv.innerText = "";
    timeFrameHiddenDiv.innerText = "";
    displayDateRangeContainer.classList.add("div-search-timeframe-container");
    displayDateRangeStart.classList.add("subtitle-1");
    displayDateRangeEnd.classList.add("subtitle-1");

    var dateStart;
    var dateEnd;
    var timeStartMinute;
    var timeStartSecond;
    var timeEndMinute;
    var timeEndSecond;
    var startDateTimeInput;
    var endDateTimeInput;
    var startDateTime ;
    var startDateTimeISO;
    var endDateTime ;
    var endDateTimeISO;

    if (datepickerStart.value) {
        dateStart = datepickerStart.value;
    }

    if(datepickerEnd.value) {
        dateEnd = datepickerEnd.value;
    }
    else{
        dateEnd = datepickerStart.value;
    }


    startDateTimeInput = dateStart + " " +  "UTC";
    startDateTime = new Date(startDateTimeInput);
    startDateTimeISO = startDateTime.toISOString();

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

    displayDateRangeStart.innerText = startDateTime.getUTCFullYear() + " - " + startDateTime.getUTCMonth() + " - " +
    startDateTime.getUTCDate() + " " + displayTimeStart + " ";

    endDateTimeInput = dateEnd + " " + "UTC";
    endDateTime = new Date(endDateTimeInput);
    endDateTimeISO = endDateTime.toISOString();


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

    displayDateRangeEnd.innerText = " - " + endDateTime.getFullYear().toString() + " - " + endDateTime.getMonth().toString() + " - "
        + endDateTime.getDate().toString() + " "
        + endDateTime.getUTCHours().toString() + ":" + timeEndMinute + ":" + timeEndSecond;




    var daysBetweenStartEnd = Math.floor(calculateTime("Daily", startDateTime, endDateTime));

    if (daysBetweenStartEnd > 0) {
        //Item with just datetime
        argumentDateTimeEndJSON.args[1] = startDateTimeISO;
        argumentDateTimeStartJSON.args[1] = endDateTimeISO;
        dateSingleArgumentArray.push(argumentDateTimeStartJSON);
        dateSingleArgumentArray.push(argumentDateTimeEndJSON);

        //Item with datetime and end_datetime
        argumentDateTimeEndRangeJSON.args[1] = startDateTimeISO;
        argumentDateTimeStartRangeJSON.args[1] = endDateTimeISO;
        dateRangeArgumentArray.push(argumentDateTimeStartRangeJSON);
        dateRangeArgumentArray.push(argumentDateTimeEndRangeJSON);

        //Item with start_datetime and end_datetime
        argumentDateTimeEndRangeJSON.args[1] = startDateTimeISO;
        argumentStartDateTimeJSON.args[1] = endDateTimeISO;
        dateStartTimeRangeArgumentArray.push(argumentStartDateTimeJSON);
        dateStartTimeRangeArgumentArray.push(argumentDateTimeEndRangeJSON);
    } else {
        //Item with just datetime
        argumentDateTimeStartJSON.args[1] = startDateTimeISO;
        argumentDateTimeEndJSON.args[1] = endDateTimeISO;
        dateArgumentArray.push(argumentDateTimeStartJSON);
        dateArgumentArray.push(argumentDateTimeEndJSON);
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



    argumentDateFilterJSON.args = dateFilterArray;
    timeFrameHiddenDiv.innerText = JSON.stringify(argumentDateFilterJSON);


    if(datepickerEnd.value != "" || datepickerEnd.value != null){
        timeFrameFilterDiv.appendChild(displayDateRangeContainer);
    }

}

function checkTimeFrameInputs(datepickerStartID, datepickerEndID, ){
    var datepickerStart = document.getElementById(datepickerStartID);
    var datepickerEnd = document.getElementById(datepickerEndID);
    var startDateTimeErrorContainer = document.getElementById("startDateTimeError");
    var endDateTimeErrorContainer = document.getElementById("endDateTimeError");


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
}