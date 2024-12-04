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