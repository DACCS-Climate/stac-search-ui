document.addEventListener("DOMContentLoaded", function (){

    //setDropdownItemRemoveChevron();

    var searchInputElement = document.getElementById("searchInput");
    setPlaceholderText(searchInputElement);

    searchInputElement.addEventListener("click", function(){
        updatePlaceholderText(searchInputElement);
    });

    searchInputElement.addEventListener("focus", function(){
        updatePlaceholderText(searchInputElement);
    });

    searchInputElement.addEventListener("blur", function(){
        setPlaceholderText(searchInputElement);
    });

    //var dropdownLink = document.getElementById("dropdownLink");
   // dropdownLink.addEventListener("click", toggleDropdownStyles);

   // dropdownLink.addEventListener("click", toggleChevronRotate);

    //dropdownLink.addEventListener("blur", removeAllDropdownStyles);

    var dropdownRegular = document.getElementById("dropdownRegularLabel");
    dropdownRegular.addEventListener("click", function() {
        toggleDropdownStyles("dropdownRegularContainer", "dropdownRegularLabel", "dropdownRegularChevron");
    });


    var dropdownMedium = document.getElementById("dropdownMediumLabel");
    dropdownMedium.addEventListener("click", function() {
        toggleDropdownStyles("dropdownMediumContainer", "dropdownMediumLabel", "dropdownMediumChevron");
    });
})