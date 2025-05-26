document.addEventListener("DOMContentLoaded", function (){

    //Set placeholder text for the following elements

    //For search input box
    var searchInputElement = document.getElementById("searchInput");
    makeFuse(searchInputElement);
    setPlaceholderText(searchInputElement, "Search by keyword");
    addDefaultSearchAttributes(searchInputElement);


    searchInputElement.addEventListener("click", function(){
        setPlaceholderText(searchInputElement, "Type to search");
    });

    searchInputElement.addEventListener("focus", function(){
        setPlaceholderText(searchInputElement, "Type to search");
    });

    searchInputElement.addEventListener("blur", function(){
        setPlaceholderText(searchInputElement , "Search by keyword");
    });

    searchInputElement.addEventListener("input", function(event){
        removeReturnedResultStyle(event.target);
        clearListChildren();
        getWord(event.target, "searchInputContainer");
    });
})