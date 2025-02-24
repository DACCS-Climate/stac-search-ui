function swapListItems(firstItemID, secondItemID){
    var firstItem = document.getElementById(firstItemID);
    var secondItem = document.getElementById(secondItemID);
    
    var firstItemValue = firstItem.innerHTML;

    firstItem.innerHTML = secondItem.innerHTML;
    secondItem.innerHTML = firstItemValue;
}

function replaceListItem(placeholderValue, firstItemID, secondItemID){
    var firstItem = document.getElementById(firstItemID);
    var secondItem = document.getElementById(secondItemID);

    firstItem.innerHTML = secondItem.innerHTML;
   // firstItem.classList.remove("bottom-no-border-radius");
}