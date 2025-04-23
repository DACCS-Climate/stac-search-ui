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