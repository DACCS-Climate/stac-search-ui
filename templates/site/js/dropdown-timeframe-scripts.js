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
        dateEnd.setAttribute('disabled', 'disabled');
        timeEnd.setAttribute('disabled', 'disabled');
    }
    else{
        timeStart.removeAttribute('disabled');
        dateEnd.removeAttribute('disabled');
        timeEnd.removeAttribute('disabled');
    }
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


    var dateStart;
    var dateEnd;
    var timeStart;
    var timeEnd;
    var repeat;

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
    }
    else{

        dateStart = datepickerStart.value;
        dateEnd = datepickerEnd.value;
        timeStart = timepickerStart.value;
        timeEnd = timepickerEnd.value;

        startDateTimeInput = dateStart + " " + timeStart + " UTC";
        endDateTimeInput = dateEnd + " " + timeEnd + " UTC"

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
                repeat = "month";
                break;
            case "Yearly":
                repeat = "year";
                break;
            case "Decade":
                repeat = "decade";
            case "Custom":
                repeat = "";
                break;
            case "Does Not Repeat":
                repeat = "none";
        }


    }
    console.log(repeat);
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
    timeFrameHiddenDiv.innerText = JSON.stringify(dateArgumentArray);
    //console.log(filterDateTimeArgument);
    console.log(dateArgumentArray)

}