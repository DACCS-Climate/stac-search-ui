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
    firstItem.classList.remove("bottom-no-border-radius");
}

function swapBorderRadius(firstListItemID){
    var firstListItem = document.getElementById(firstListItemID);
    var ariaExpanded = firstListItem.getAttribute("aria-expanded");

    if (ariaExpanded == "true"){
        firstListItem.classList.add("bottom-no-border-radius");
    }
    else{
        firstListItem.classList.remove("bottom-no-border-radius");
    }
}