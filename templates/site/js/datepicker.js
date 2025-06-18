function initializeCalendar(datepickerID, startDate, endDate){
    var datepickerElement = document.getElementById(datepickerID);
    flatpickr(datepickerElement, {
        enableTime: true,
        time_24hr: true,
        dateFormat: "Y M d H:i",
        shorthandCurrentMonth: true,
        allowInput: true,
        monthSelectorType: "dropdown",
        minDate: startDate,
        maxDate: endDate
    });
}

function getEndDateString(){
    var currentDate = new Date();
    var nextYear = currentDate.getFullYear() + 1;
    var currentDateString = "12" + " " + "31" + " " + nextYear.toString();

    return currentDateString;
}