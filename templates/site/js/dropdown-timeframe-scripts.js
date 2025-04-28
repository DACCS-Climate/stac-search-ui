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

function checkboxToggleAllDay(checkboxID, timeStartID, dateEndID, timeEndID){
    var checkboxAllDay = document.getElementById(checkboxID);
    var timeStart = document.getElementById(timeStartID);
    var dateEnd = document.getElementById(dateEndID);
    var timeEnd = document.getElementById(timeEndID);

    if(checkboxAllDay.checked){
        timeStart.setAttribute('disabled', 'disabled');
        timeEnd.setAttribute('disabled', 'disabled');
    }
    else{
        timeStart.removeAttribute('disabled');
        timeEnd.removeAttribute('disabled');
    }
}

function buildRepeatFilterString(repeatInterval){

}



function populateTimeframeFilter(datepickerStartID, timepickerStartID, datepickerEndID, timepickerEndID, checkboxAllDayID, dropdownRepeatID, dropdownRepeatLabelID, radioNeverID, radioEndsOnID, datepickerEndsOnID){
    var argumentJSON = JSON.parse('{"op": "or","args" : [ ]}');
    var argumentDateTimeStartJSON = {"op":">=", "args":[{"property":"datetime"},{"timestamp":""}]}
    var argumentDateTimeEndJSON = {"op":"<=", "args":[{"property":"datetime"},{"timestamp":""}]}
    var filterDateTimeArgument = {"op":"=", "args":[]};
    var dateArgumentArray = [];
    var datetimeObject = {"datetime": ""};
    var timeFrameFilterDiv = document.getElementById("searchFilterTimeFrameBody")
    var timeFrameHiddenDiv = document.getElementById("searchFilterTimeFrameHidden");
    var displayDateTimeArgument = "[";
    var datepickerStart = document.getElementById(datepickerStartID);
    var timepickerStart = document.getElementById(timepickerStartID);
    var datepickerEnd = document.getElementById(datepickerEndID);
    var timepickerEnd = document.getElementById(timepickerEndID);
    var checkboxAllDay = document.getElementById(checkboxAllDayID);
    var dropdownRepeatLabel = document.getElementById(dropdownRepeatLabelID);
    var radioNever = document.getElementById(radioNeverID);
    var radioEndsOn = document.getElementById(radioEndsOnID);
    var datepickerEndsOn = document.getElementById(datepickerEndsOnID);

    var displayDateRange = document.createElement("p");
    var displayTimeRange = document.createElement("p");
    var displayRepeat = document.createElement("p");
    var displayTime = "";
    var displayRepeatValue = "";

    timeFrameFilterDiv.innerText = "";
    displayDateRange.classList.add("subtitle-1");
    displayTimeRange.classList.add("subtitle-1");



    var dateStart;
    var dateEnd;
    var timeStart;
    var timeEnd;
    var timeStartMinute;
    var timeStartSecond;
    var timeEndMinute;
    var timeEndSecond;
    var repeatInterval;


    var neverEnds = radioNever.value;
    var endsOn = radioEndsOn.value;
    var endsOnDate;
    var endsOnDateInput;
    var endsOnDateISO;
    var dateRange = "";

    var startDateInput;
    var startTimeInput;
    var endDateInput;
    var endTimeInput;
    var startDateTimeInput;
    var endDateTimeInput;

    var startDateISO;
    var startTimeISO;
    var endDateISO;
    var endTimeISO;

    var startDateTime ;
    var startDateTimeISO;
    var endDateTime ;
    var endDateTimeISO;

    var currentDailyDate;

    var timeDifference;
    var dayDifference = 0;

    if(endsOn){
        endsOnDateInput = datepickerEndsOn.value + " " + + "UTC";
        endsOnDate = new Date(endsOnDateInput);
        endsOnDateISO = endsOnDate.toISOString();

    }

    if(checkboxAllDay.checked){
        timeStart = "00:00";
        timeEnd = "24:00";
        dateStart = datepickerStart.value;
        dateEnd = dateStart;

        startDateTimeInput = dateStart + " " + timeStart + " " +  "UTC";
        endDateTimeInput = dateEnd + " " + timeEnd + " " + "UTC"

        startDateTime = new Date(startDateTimeInput);
        startDateTimeISO = startDateTime.toISOString();
        endDateTime = new Date(endDateTimeInput);
        endDateTimeISO = endDateTime.toISOString();

        dateRange = startDateTimeISO + "/" + endDateTimeISO;

        datetimeObject.datetime = dateRange;
        filterDateTimeArgument["args"].push(datetimeObject);
        dateArgumentArray.push(filterDateTimeArgument);

        displayTime = "All Day";


    }
    else{

        dateStart = datepickerStart.value;
        dateEnd = datepickerEnd.value;
        timeStart = timepickerStart.value;
        timeEnd = timepickerEnd.value;

        startDateTimeInput = dateStart + " " + timeStart + " UTC";
        endDateTimeInput = dateEnd + " " + timeEnd + " UTC";

        console.log(startDateTimeInput);

        startDateTime = new Date(startDateTimeInput);
        startDateTimeISO = startDateTime.toISOString();
        endDateTime = new Date(endDateTimeInput);
        endDateTimeISO = endDateTime.toISOString();



        argumentDateTimeStartJSON.args[1].timestamp = startDateTimeISO;
        dateArgumentArray.push(argumentDateTimeStartJSON);


        argumentDateTimeEndJSON.args[1].timestamp = endDateTimeISO;
        dateArgumentArray.push(argumentDateTimeEndJSON);


        //dateRange = startDateTimeISO + "/" + endDateTimeISO;

        //TODO get the passed datetime from the collection start_datetime and end_datetime
        //datetimeObject.datetime = dateRange;
        //dateArgumentArray.push(datetimeObject);
        //argumentJSON.args = dateArgumentArray;


            switch(dropdownRepeatLabel.innerText){
            case "Daily":
                displayRepeatValue = "Daily";
                repeatInterval = 1;

                var repeatDailyDates = [];

                startDateInput = new Date(dateStart + " UTC");
                startDateISO = startDateInput.toISOString();
                endDateInput = new Date(dateEnd + " UTC");
                endDateISO = endDateInput.toISOString();

                currentDailyDate = startDateInput;

                while(currentDailyDate < endDateInput){
                    var dailyDateJSON = JSON.parse('{"datetime"}')
                    dailyDateJSON.datetime = currentDailyDate;
                    repeatDailyDates.push(dailyDateJSON);
                    currentDailyDate.setDate(currentDailyDate.getDate() + 1);
                }
                
                argumentJSON.args = repeatDailyDates;
                


                break;
            case "Weekly":
                displayRepeatValue = "Weekly";

                var repeatWeeklyDates = [];

                startDateInput = new Date(dateStart + " UTC");
                startDateISO = startDateInput.toISOString();
                endDateInput = new Date(dateEnd + " UTC");
                endDateISO = endDateInput.toISOString();

                currentDailyDate = startDateInput;

                while(currentDailyDate < endDateInput){
                    var dailyDateJSON = JSON.parse('{"datetime"}')
                    dailyDateJSON.datetime = currentDailyDate;
                    repeatWeeklyDates.push(dailyDateJSON);
                    currentDailyDate.setDate(currentDailyDate.getDate() + 7);
                }

                //argumentJSON.args = repeatWeeklyDates;


                break;
            case "Monthly":
                displayRepeatValue = "Monthly";
                break;
            case "Yearly":
                displayRepeatValue = "Yearly";
                break;
            case "Decade":
                displayRepeatValue = "Decade";
            case "Custom":
                displayRepeatValue = "";
                break;
            case "Does Not Repeat":
                displayRepeatValue = "none";
        }

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


        displayTime = startDateTime.getUTCHours().toString() + ":" + timeStartMinute + ":" + timeStartSecond +
        " - " + endDateTime.getUTCHours().toString() + ":" + timeEndMinute + ":" + timeEndSecond;

    }
    console.log(displayRepeatValue);
/*
    if(dropdownRepeat.checked){
        dateStart = datepickerStart.value;
        dateEnd = datepickerEnd.value;
        timeStart = timepickerStart.value;
        timeEnd = timepickerEnd.value;
    }*/


    //dateArgumentArray = [{"datetime": datetimeObject}];

    //timeFrameHiddenDiv.innerText = JSON.stringify(argumentJSON);
    //for(arrayItem of dateArgumentArray){
      //  var argumentString = JSON.stringify(arrayItem);
     //   displayDateTimeArgument = displayDateTimeArgument + argumentString;
    //}
    //displayDateTimeArgument = displayDateTimeArgument + "]";
    //timeFrameHiddenDiv.innerText = dateArgumentArray;

    //timeFrameHiddenDiv.innerText = displayDateTimeArgument;
    displayDateRange.innerText = startDateTime.toDateString() + " - " + endDateTime.toDateString();
    displayTimeRange.innerText = displayTime;
    displayRepeat.innerText = displayRepeatValue;

    timeFrameFilterDiv.appendChild(displayDateRange);
    timeFrameFilterDiv.appendChild(displayTimeRange);
    timeFrameFilterDiv.appendChild(displayRepeat);

    timeFrameHiddenDiv.innerText = JSON.stringify(dateArgumentArray);
    //console.log(filterDateTimeArgument);
    console.log(dateArgumentArray)

}