function initializeTimepicker(timepickerID, startTime, endTime){
    var timepickerElement = document.getElementById(timepickerID);
        flatpickr(timepickerElement, {
            enableTime: true,
            noCalendar: true,
            dateFormat: "H:i",
            minTime: startTime,
            maxTime: endTime
        });
    }