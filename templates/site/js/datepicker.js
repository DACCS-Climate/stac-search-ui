function initializeCalendar(datepickerID, startDate, endDate){
    var datepickerElement = document.getElementById(datepickerID);
    flatpickr(datepickerElement, {
        dateFormat: "Y M d",
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