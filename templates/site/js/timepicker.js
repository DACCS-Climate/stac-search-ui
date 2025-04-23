function initializeTimepicker(timepickerID, startTime, endTime){
    var timepickerElement = document.getElementById(timepickerID);
    var timepicker = "#" + timepickerID;
        flatpickr(timepicker, {
            enableTime: true,
            noCalendar: true,
            dateFormat: "H:i",
            minTime: startTime,
            maxTime: endTime
        });
    }