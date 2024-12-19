document.addEventListener("DOMContentLoaded", function () {
    setModal("modalRecurrence", ["openRecurrenceModalButton"], ["closePasswordResetModal"]);

    setRecurrenceListItems("dropdownSmallRecurrenceLabel", "recurrenceModalDayList");
})

//For Spin button
var spinButtonUp = document.getElementById("spinButtonUpRecurrence");
spinButtonUp.addEventListener("click", function(){
    increment("inputNumberRecurrence");
});

var spinButtonDown = document.getElementById("spinButtonDownRecurrence");
spinButtonDown.addEventListener("click", function(){
    decrement("inputNumberRecurrence");
});


//For Recurrence dropdown
function resetRecurrenceFirstItem(labelID){
    var recurrenceDropdownFirstItem = document.getElementById(labelID);
    recurrenceDropdownFirstItem.innerText = "Day";
}


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
