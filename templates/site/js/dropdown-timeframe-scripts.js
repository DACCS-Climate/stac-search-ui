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

function calculateDays(startDate, endDate) {
    let start = new Date(startDate);
    let end = new Date(endDate);
    let timeDifference = end - start;
    let daysDifference = timeDifference / (1000 * 3600 * 24);
    return daysDifference;
}


function buildRepeatFilterString(repeatType, repeatInterval, startDateInput, endDateInput, endsOnDate){
    var repeatArray = [];
    var argumentRepeatDailyJSON = {"op":"=", "args":[{"property":"datetime"},{"timestamp":""}]}
    var productionURL = "{{ stac_catalog_url }}/search?";
    var testingURL = "https://infomatics-dcs.cs.toronto.edu/stac/search?";
    var stacSearchURL;
    var dateRepeatBegin;





    var numberOfDays = calculateDays(startDateInput, endsOnDate);

    switch(displayRepeatValue){
        case "Daily":
            dateRepeatBegin = startDateInput;
            for(var i = 1; i <= numberOfDays; i++){


                dateRepeatBegin.setDate(dateRepeatBegin.getDate() + i);
                argumentRepeatDailyJSON.args["timestamp"] = dateRepeatBegin;
                repeatArray.push(argumentRepeatDailyJSON);

            }


    }
    console.log(repeatArray);
    return repeatArray;

/*
    fetch(stacSearchURL, {
        method: "GET"

    }).then(response => response.json()).then( json => {

    })*/

}



function populateTimeframeFilter(datepickerStartID, timepickerStartID, datepickerEndID, timepickerEndID, checkboxAllDayID, dropdownRepeatID, dropdownRepeatLabelID, radioNeverID, radioEndsOnID, datepickerEndsOnID){
    var argumentDateFilterJSON = JSON.parse('{"op": "or","args" : [ ]}');
    var argumentDateTimeJSON = JSON.parse('{"op": "or","args" : [ ]}');
    var argumentDateTimeRangeJSON = JSON.parse('{"op": "and","args" : [ ]}');



    var argumentDateTimeSingleJSON = {"op":"=", "args":[{"property":"datetime"},{"timestamp":""}]};

    var argumentDateTimeStartJSON = {"op":">=", "args":[{"property":"datetime"},{"timestamp":""}]};
    var argumentDateTimeEndJSON = {"op":"<=", "args":[{"property":"datetime"},{"timestamp":""}]};

    var argumentDateTimeStartRangeJSON = {"op":"<=", "args":[{"property":"datetime"},{"timestamp":""}]};
    var argumentDateTimeEndRangeJSON = {"op":">=", "args":[{"property":"end_datetime"},{"timestamp":""}]};
    var filterDateTimeArgument = {"op":"=", "args":[]};
    var dateArgumentArray = [];
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

    var displayDateRange = document.createElement("p");
    var displayTimeRangeContainer = document.createElement("div");
    var displayTimeRangeStart = document.createElement("p");
    var displayTimeRangeEnd = document.createElement("p");
    var displayRepeat = document.createElement("p");
    var displayTimeStart = "";
    var displayTimeEnd = "";
    var displayRepeatValue = "";

    displayTimeRangeContainer.appendChild(displayTimeRangeStart);
    displayTimeRangeContainer.appendChild(displayTimeRangeEnd);

    timeFrameFilterDiv.innerText = "";
    timeFrameHiddenDiv.innerText = "";
    displayTimeRangeContainer.classList.add("div-search-timeframe-container");
    displayDateRange.classList.add("subtitle-1");
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
    var repeatInterval;


    var neverEnds = radioNever.checked;
    var endsOn = radioEndsOn.checked;
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

    console.log(endsOn);
    if(endsOn){
        console.log(datepickerEndsOnID);
        console.log(datepickerEndsOn);
        endsOnDateInput = datepickerEndsOn.value + " " + "UTC";
        endsOnDate = new Date(endsOnDateInput);
        endsOnDateISO = endsOnDate.toISOString();
        console.log(endsOnDate);

    }

    if(checkboxAllDay.checked){
        timeStart = "00:00";
        timeEnd = "24:00";
        dateStart = datepickerStart.value;
        dateEnd = dateStart;

        startDateTimeInput = dateStart + " " + timeStart + " " +  "UTC";
        endDateTimeInput = dateEnd + " " + timeEnd + " " + "UTC";
        startDateTimeInput = dateStart + " " + timeStart;
        endDateTimeInput = dateEnd + " " + timeEnd;

        startDateTime = new Date(startDateTimeInput);
        startDateTimeISO = startDateTime.toISOString();
        endDateTime = new Date(endDateTimeInput);
        endDateTimeISO = endDateTime.toISOString();

        dateRange = startDateTimeISO + "/" + endDateTimeISO;

        datetimeObject.datetime = dateRange;
        filterDateTimeArgument["args"].push(datetimeObject);
        dateArgumentArray.push(filterDateTimeArgument);

        displayTimeStart = "All Day";


    }
    else {
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
            /*
            if(timepickerStart.value){
                timeEnd = "24:00:00";
            }else{
                timeEnd = "00:00:00";
            }*/

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

        displayDateRange.innerText = startDateTime.toDateString();




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

         displayTimeEnd = " - " + endDateTime.getUTCHours().toString() + ":" + timeEndMinute + ":" + timeEndSecond;

         argumentDateTimeStartJSON.args[1].timestamp = startDateTimeNoMilliSeconds;
         argumentDateTimeEndJSON.args[1].timestamp = endDateTimeNoMilliSeconds;
         dateArgumentArray.push(argumentDateTimeStartJSON);
         dateArgumentArray.push(argumentDateTimeEndJSON);

         argumentDateTimeEndRangeJSON.args[1].timestamp = startDateTimeNoMilliSeconds;
         argumentDateTimeStartRangeJSON.args[1].timestamp = endDateTimeNoMilliSeconds;

         dateRangeArgumentArray.push(argumentDateTimeStartRangeJSON);
         dateRangeArgumentArray.push(argumentDateTimeEndRangeJSON);


    }






        //dateRange = startDateTimeISO + "/" + endDateTimeISO;

        //TODO get the passed datetime from the collection start_datetime and end_datetime
        //datetimeObject.datetime = dateRange;
        //dateArgumentArray.push(datetimeObject);
        //argumentDateTimeJSON.args = dateArgumentArray;


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
                
                //argumentJSON.args = repeatDailyDates;

                dateArgumentArray = buildRepeatFilterString(displayRepeatValue, repeatInterval, startDateInput, endDateInput, endsOnDate);
                


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
                displayRepeatValue = "Does Not Repeat";
        }








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

    if(dateArgumentArray.length > 0 ){
        argumentDateTimeJSON.args = dateArgumentArray;

        dateFilterArray.push(argumentDateTimeJSON);
        //argumentDateFilterJSON.args = dateFilterArray;
        //timeFrameHiddenDiv.innerText = JSON.stringify(argumentDateFilterJSON);
        //console.log(filterDateTimeArgument);
        //console.log(argumentDateFilterJSON)
    }

    if(dateRangeArgumentArray.length > 0 ){
        argumentDateTimeRangeJSON.args = dateRangeArgumentArray;
        // dateFilterArray.push(argumentDateTimeRangeJSON);

        //argumentDateTimeJSON.args = dateRangeArgumentArray;

        dateFilterArray.push(argumentDateTimeRangeJSON);
        //argumentDateFilterJSON.args = dateFilterArray;
        //timeFrameHiddenDiv.innerText = JSON.stringify(argumentDateFilterJSON);
        //console.log(filterDateTimeArgument);
        //console.log(argumentDateFilterJSON)
    }

    argumentDateFilterJSON.args = dateFilterArray;
    timeFrameHiddenDiv.innerText = JSON.stringify(argumentDateFilterJSON);
    //console.log(filterDateTimeArgument);
    console.log(argumentDateFilterJSON)


    displayTimeRangeStart.innerText = displayTimeStart;
    displayTimeRangeEnd.innerText = displayTimeEnd;
    displayRepeat.innerText = displayRepeatValue;

    timeFrameFilterDiv.appendChild(displayDateRange);
    timeFrameFilterDiv.appendChild(displayTimeRangeContainer);
    timeFrameFilterDiv.appendChild(displayRepeat);



}