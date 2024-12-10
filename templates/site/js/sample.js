document.addEventListener("DOMContentLoaded", function (){

    //setDropdownItemRemoveChevron();

    //Set placeholder text for the following elements

    //For search input box
    var searchInputElement = document.getElementById("searchInput");
    setPlaceholderText(searchInputElement, "Search by keyword");

    searchInputElement.addEventListener("click", function(){
        setPlaceholderText(searchInputElement, "Type to search");
    });

    searchInputElement.addEventListener("focus", function(){
        setPlaceholderText(searchInputElement, "Type to search");
    });

    searchInputElement.addEventListener("blur", function(){
        setPlaceholderText(searchInputElement , "Search by keyword");
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

//For Date input regular
    var dateInputElement = document.getElementById("inputDateRegular");
    dateInputElement.addEventListener("blur", function(){
        convertDate("inputDateRegular");
    })


    //For Spin button
    var spinButtonUp = document.getElementById("spinButtonUp");
    spinButtonUp.addEventListener("click", function(){
        increment("inputNumberSmall");
    });

    var spinButtonDown = document.getElementById("spinButtonDown");
    spinButtonDown.addEventListener("click", function(){
        decrement("inputNumberSmall");
    });


    //var dropdownLink = document.getElementById("dropdownLink");
   // dropdownLink.addEventListener("click", toggleDropdownStyles);

   // dropdownLink.addEventListener("click", toggleChevronRotate);

    //dropdownLink.addEventListener("blur", removeAllDropdownStyles);

    var dropdownDefaultList = document.getElementById("dropdownListDefaultLabel");
    dropdownDefaultList.addEventListener("click", function() {
        toggleDropdownStyles("dropdownListDefaultContainer", "dropdown-transition-styles");
        toggleDropdownStyles("dropdownListDefaultLabel", "dropdown-default-list-label-toggle");
        toggleDropdownStyles("dropdownListDefaultChevron", "dropdown-chevron-rotate");
    });

    var dropdownRegularListMetadata = document.getElementById("dropdownListRegularMetadataLabel");
    dropdownRegularListMetadata.addEventListener("click", function() {
        toggleDropdownStyles("dropdownListRegularMetadataContainer", "dropdown-transition-styles");
       // toggleDropdownStyles("dropdownListRegularMetadataLabel", "dropdown-default-list-label-toggle");
        toggleDropdownStyles("dropdownListRegularMetadataChevron", "dropdown-chevron-rotate");
    });

    var dropdownRegularListLicense = document.getElementById("dropdownListRegularLicenseLabel");
    dropdownRegularListLicense.addEventListener("click", function() {
        toggleDropdownStyles("dropdownListRegularLicenseContainer", "dropdown-transition-styles");
       // toggleDropdownStyles("dropdownListRegularMetadataLabel", "dropdown-default-list-label-toggle");
        toggleDropdownStyles("dropdownListRegularLicenseChevron", "dropdown-chevron-rotate");
    });

    var dropdownRegularSource = document.getElementById("dropdownRegularSourceLabel");
    dropdownRegularSource.addEventListener("click", function() {
        toggleDropdownStyles("dropdownRegularSourceContainer", "dropdown-regular-container-transition");
        toggleDropdownStyles("dropdownRegularSourceChevron", "dropdown-chevron-rotate");
        toggleDropdownTitleText("dropdownRegularSourceTitle", "STAC Version: 1.0.0");
    });

    var dropdownRegularShare = document.getElementById("dropdownRegularShareLabel");
    dropdownRegularShare.addEventListener("click", function() {
        toggleDropdownStyles("dropdownRegularShareContainer", "dropdown-regular-container-transition");
        toggleDropdownStyles("dropdownRegularShareChevron", "dropdown-chevron-rotate");
    });
/*
    var dropdownMedium = document.getElementById("dropdownMediumLabel");
    dropdownMedium.addEventListener("click", function() {
        toggleDropdownStyles("dropdownMediumContainer", "dropdownMediumLabel", "dropdownMediumChevron");
    });*/
})