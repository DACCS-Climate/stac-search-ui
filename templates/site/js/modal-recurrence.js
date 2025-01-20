document.addEventListener("DOMContentLoaded", function () {
    var inputNumber = document.getElementById("inputNumberRecurrence");

    setModal("modalRecurrence", ["openRecurrenceModalButton"], ["closeRecurrenceCloseModal"]);

    setRecurrenceListItems("dropdownSmallRecurrenceLabel", "recurrenceModalDayList");

    inputNumber.addEventListener('blur', function (){
        changeInputBGColour("inputNumberRecurrence");
    });

})

//For Recurrence dropdown

function setRecurrenceListItems(labelID, listID){
    var recurrenceDropdown = document.getElementById("recurrenceModalDay");
    var recurrenceDropdownList = document.getElementById(listID);
    var recurrenceDropdownLabel = document.getElementById(labelID);
    let listLink;

    var labelText = recurrenceDropdownLabel.innerText;

    var listItems = recurrenceDropdownList.querySelectorAll('li');

    listItems.forEach((item, index) => {
        listLink = item.children.item(0);
        listLink.addEventListener("click", function(){
        recurrenceDropdownLabel.innerHTML = this.innerHTML;
        })
    });

}


