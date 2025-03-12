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
        getWord(event.target);
    });


    //For text input small
    var textInputElement = document.getElementById("inputNumberSmall");

    setPlaceholderText(textInputElement, "1");

    textInputElement.addEventListener("click", function(){
        setPlaceholderText(textInputElement, "");
        setTextboxBackground(textInputElement);
    });

    textInputElement.addEventListener("focus", function(){
        setPlaceholderText(textInputElement, "");
    });

    textInputElement.addEventListener("blur", function(){
        setPlaceholderText(textInputElement , "1");
        setTextboxBackground(textInputElement);
    });
})