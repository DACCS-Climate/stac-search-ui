var filterPropertyList = {};

$(document).ready(function() {
    /*Initialize Popper.js and Tooltips.js*/
    $('[data-toggle="tooltip"]').tooltip();
    $('[data-toggle="popover"]').popover();
})

function fuseDictionary(_queryables, _path) {
    var found = {};
    if (_path === undefined) {
        _path = [];
    }
    if (_queryables === undefined) {
        return fetch("{{ stac_catalog_url }}/queryables").then(response => response.json())
                                                         .then(json => Object.entries(fuseDictionary(json.properties))
                                                                 .map(([key, val]) => {return {"key": key, "values": val} }) )
    } else if (typeof _queryables === "object") {
        Object.entries(_queryables).forEach(([q_key, q_value]) => {
            if (q_key === "properties") {
                Object.entries(q_value).forEach(([p_key, p_value]) => {
                    Object.entries(fuseDictionary(p_value, _path.concat(p_key))).forEach(([f_key, f_value]) => {
                        found[f_key] = found[f_key] || []
                        f_value.forEach(val => found[f_key].push(val))
                    });
                })
            } else if (q_key === "enum") {
                q_value.forEach(val => {
                    found[val] = found[val] || []
                    found[val].push([_path, "enum"])
                })
            } else {
                other = true;
                ["const", "title", "description"].forEach(key => {
                    if (q_key === key) {
                        found[q_value] = found[q_value] || []
                        found[q_value].push([_path, key])
                        other = false;
                    }
                })
                if (other) {
                    Object.entries(fuseDictionary(q_value, _path)).forEach(([o_key, o_value]) => {
                        found[o_key] = found[o_key] || []
                        o_value.forEach(val => found[o_key].push(val))
                        found[o_key]["stac_key"] = q_key;
                    });
                }
            }
        })
    } else if (typeof _queryables === "array") {
        _queryables.forEach(value => {
            fuseDictionary(value, _path).forEach(next_found => {
                found.push(next_found);
            });
        })
    }
    return found
}

let fuse = null;

function makeFuse(inputBox) {

    fuseDictionary().then(queryables => {
        fuse = new Fuse(queryables, {
            keys: ["key"],
            threshold: 0.2,
            includeMatches: true,
            includeScore: true
        });
        removeDefaultSearchAttributes(inputBox);
    })
}

function clearListChildren(){
    const element = document.getElementById("suggestedWordOutputList");
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

function getWord(inputBox, inputBoxContainerID){
    var queryablesArray = [];
    var queryableResultButton;
    var queryResultList = document.getElementById("suggestedWordOutputList");
    var inputBoxContainer = document.getElementById(inputBoxContainerID);


    if(inputBox.value !="") {
        inputBoxContainer.setAttribute("aria-expanded", "true");

        if (fuse !== null) {
            queryablesArray = fuse.search(inputBox.value);

            if(queryablesArray.length > 0){
                queryablesArray.forEach((queryableItem, queryableKey) => {
                    if(queryableItem.matches.length > 0)
                    {
                        queryableItem.matches.forEach((matchItem, matchKey) => {
                            var queryResultListItem = document.createElement("li");
                            var listItemFont = document.createElement("h5");
                            listItemFont.classList.add("margin-unset");

                            queryableResultButton = document.createElement('a');
                            queryableResultButton.innerText = matchItem.value;
                            queryableResultButton.setAttribute('role', 'button');
                            queryableResultButton.setAttribute('queryablekeystac', queryableItem.item.values.stac_key);
                            queryableResultButton.setAttribute('queryablekeytype', queryableItem.item.values[0][1]);
                            queryableResultButton.setAttribute('queryablekeyvalue', queryableItem.item.key);
                            queryableResultButton.id = "match" + queryablesArray.indexOf(queryableItem);

                            queryableResultButton.addEventListener('click', function (event) {
                                selectSearchResults(inputBox, event.target.id, queryableItem.item.values.stac_key, queryableItem.item.key);
                            })

                            listItemFont.appendChild(queryableResultButton);
                            queryResultListItem.appendChild(listItemFont);
                            queryResultList.appendChild(queryResultListItem);
                        });
                    }
                })
            }
            else{
                inputBoxContainer.setAttribute("aria-expanded", "false");
            }
        }
    }
    else{
        inputBoxContainer.setAttribute("aria-expanded", "false");
    }
}

function selectSearchResults(inputBox, buttonID,stacKey, queryableValue){
    var listButton = document.getElementById(buttonID);
    inputBox.value = listButton.innerText;
    inputBox.setAttribute("aria-expanded", "false");
    inputBox.setAttribute('queryablekeystac', stacKey);
    inputBox.setAttribute('queryablekeyvalue', queryableValue);
    inputBox.classList.add("returned-result")
}

function removeReturnedResultStyle(inputBox){
    inputBox.classList.remove("returned-result");
}

function addDefaultSearchAttributes(inputBox){
    inputBox.setAttribute("disabled", "disabled");
}

function removeDefaultSearchAttributes(inputBox){
    inputBox.removeAttribute("disabled");
}

function addSearchResultNavigation(json, searchHomeURL){

    var firstButton = document.getElementById("searchResultsFirst");
    var nextButton = document.getElementById("searchResultsNext");
    var previousButton = document.getElementById("searchResultsPrevious");
    var nextURL = "";
    var previousURL = "";

    if(firstButton.onclick != ""){
        firstButton.onclick = function () {
            getSTACSearchResults(searchHomeURL);
        }
    }
    else{
        firstButton.onclick = function () {
            getSTACSearchResults(searchHomeURL);
        }
    }


    Object.entries(json.links).forEach(([linkKey, linkValue]) => {
       if(linkValue.rel == "next"){
           if(!linkValue.href.includes("token") && !linkValue.href.includes("?")){
               nextURL = linkValue.href + "?" + "sortby=+id" + "&token=" + linkValue.body.token;
           }
           else{
               nextURL = linkValue.href;
           }

           nextButton.onclick = function() {
                getSTACSearchResults(nextURL);
           }
       }

       if(linkValue.rel == "previous"){
           if(!linkValue.href.includes("token") && !linkValue.href.includes("?")){
               previousURL = linkValue.href + "?" + "sortby=+id" + "&token=" +  linkValue.body.token;
           }
           else{
               previousURL = linkValue.href;
           }

           previousButton.onclick = function() {
                getSTACSearchResults(previousURL);
           }
       }
    })
}


function populateSearchResults(json){
    var searchResultDiv = document.getElementById("searchResults");
    if(searchResultDiv.innerHTML != "")
    {
        searchResultDiv.innerHTML = "";
    }

    var searchResultTable = document.createElement("table");
    var tableHeader = document.createElement("thead");
    var tableTitleFormatCell = document.createElement("td");
    var tableTitleDatasetCell = document.createElement("td");
    var tableTitleStartDatetimeCell = document.createElement("td");
    var tableTitleEndDatetimeCell = document.createElement("td");
    var errorRow = document.createElement("tr");
    var errorCell = document.createElement("td");
    var errorMessage = document.createElement("p");

    errorMessage.classList.add("subtitle-1", "error-search-results");

    tableTitleFormatCell.innerText = "Format";
    tableTitleDatasetCell.innerText = "Dataset ID";
    tableTitleStartDatetimeCell.innerText = "Start Datetime";
    tableTitleEndDatetimeCell.innerText = "End Datetime";
    errorMessage.innerText = "No results with the current query";

    errorCell.appendChild(errorMessage);
    errorRow.appendChild(errorCell);

    tableHeader.appendChild(tableTitleDatasetCell);
    tableHeader.appendChild(tableTitleStartDatetimeCell);
    tableHeader.appendChild(tableTitleEndDatetimeCell);
    tableHeader.appendChild(tableTitleFormatCell);
    var tableBody = document.createElement("tbody");
    var assetType;


    searchResultTable.appendChild(tableHeader);
    searchResultTable.appendChild(tableBody);
    searchResultDiv.appendChild(searchResultTable);


    if(Object.entries(json.features).length > 0) {
        Object.entries(json.features).forEach(([featureKey, featureValue]) => {
            var rowSearchResult = document.createElement("tr");
            tableBody.appendChild(rowSearchResult);

            var collectionAnchor = document.createElement("a");
            var cellFormat = document.createElement("td");
            cellFormat.classList.add("search-results-format");

            if (featureValue.id) {
                var cellDatasetTitle = document.createElement("td");
                var linkDatasetTitle = document.createElement("a");
                var datasetTitleArray;
                linkDatasetTitle.setAttribute("role", "button");

                linkDatasetTitle.onclick = function () {
                    swapDatasetDetails();
                    swapBackButtonText();
                    populateDatasetDetails(featureValue);
                };

                linkDatasetTitle.innerText = featureValue.id;

                cellDatasetTitle.appendChild(linkDatasetTitle);
                rowSearchResult.appendChild(cellDatasetTitle);
            }


            if (featureValue.properties.start_datetime) {
                var cellStartDateTimeValue = document.createElement("td");

                cellStartDateTimeValue.innerText = new Date(featureValue.properties.start_datetime);
                rowSearchResult.appendChild(cellStartDateTimeValue);
            }

            if (featureValue.properties.end_datetime) {
                var cellEndDateTimeValue = document.createElement("td");

                cellEndDateTimeValue.innerText = new Date(featureValue.properties.end_datetime);
                rowSearchResult.appendChild(cellEndDateTimeValue);
            }

            //Add Format
            Object.entries(featureValue.assets).forEach(([assetKey, assetValue]) => {

                var assetSpan = document.createElement("span");
                if (assetValue.type.includes("application/")) {
                    var assetTypeArray = assetValue.type.split('/');
                    assetType = assetTypeArray[1];
                } else {
                    assetType = assetValue.type;
                }

                assetSpan.innerText = assetType;
                cellFormat.appendChild(assetSpan);

            })
            rowSearchResult.appendChild(cellFormat);

        })
    }
    else{
        tableBody.appendChild(errorRow);
    }
}


function hideDetails(){
    var datasetDetailsContainer = document.getElementById("datasetDetails");
    datasetDetailsContainer.classList.add("display-none");
}

function swapDatasetDetails(){
    var searchResultContainer = document.getElementById("searchResults");
    var datasetDetailsContainer = document.getElementById("datasetDetails");
    var searchNavContainer = document.getElementById("searchNavContainer");

    if(searchResultContainer.classList.contains("display-none")){
        searchResultContainer.classList.remove("display-none");
    }
    else{
        searchResultContainer.classList.add("display-none")
    }

    if(datasetDetailsContainer.classList.contains("display-none")){
        datasetDetailsContainer.classList.remove("display-none");
    }
    else{
        datasetDetailsContainer.classList.add("display-none");
    }

    if(!searchNavContainer.classList.contains("display-none")){
        searchNavContainer.classList.add("display-none");
    }
    else{
        searchNavContainer.classList.remove("display-none");
    }
}


function populateDatasetDetails(features){
    var datasetName = document.getElementById("datasetName");
    var datasetCollectionName = document.getElementById("datasetCollectionName");
    var assetDetails = document.getElementById("datasetAssetsContainer");
    var assetDetailsList = document.getElementById("datasetAssetsList")
    assetDetailsList.classList.add("border-dataset-list-details");

    var extensionKey;
    var extensionName;


    var datasetMetadataContainer = document.getElementById("datasetMetadataList");
    var metadataBody = document.createElement("div");

    datasetMetadataContainer.appendChild(metadataBody);

    var datasetID;


         if ("properties" in features) {
            var metadataTable = document.createElement("table");

            if("stac_extensions" in features) {
                for (extension of features["stac_extensions"]) {
                    var metadataExtensionContainer = document.createElement("div");
                    var metadataSubHeaderRow = document.createElement("div");
                    var metadataSubBody = document.createElement("div");

                    metadataExtensionContainer.classList.add("div-metadata-extension-container");
                    metadataSubBody.classList.add("border-dataset-div-list-details");

                    metadataSubHeaderRow.id = extension + "Header";
                    metadataSubBody.id = extension + "Body";

                    metadataSubHeaderRow.classList.add("div-dataset-subheader");

                    metadataExtensionContainer.appendChild(metadataSubHeaderRow);
                    metadataExtensionContainer.appendChild(metadataSubBody);

                    datasetMetadataContainer.appendChild(metadataExtensionContainer);



                    Object.entries(features["properties"]).forEach(([propertyKey, propertyValue]) => {
                        if (propertyKey.includes(":")) {
                            var extensionKeyArray = propertyKey.split(":");
                            extensionKey = extensionKeyArray[0] + ":";
                            extensionName = extensionKeyArray[0]
                        }

                        if (propertyKey.includes(extensionKey)) {

                            if (extension.includes(extensionName)){
                                var metadataRow = document.createElement("div");
                                var metadataTitleCellDiv = document.createElement("div");
                                var metadataValueCellDiv = document.createElement("div");

                                var metadataKeyArray = propertyKey.split(":");

                                if(propertyKey.includes(":variables")) {
                                    metadataRow.classList.add("div-variable-row");
                                    metadataTitleCellDiv.classList.add("subtitle-1", "div-metadata-title", "text-dataset-capitalize");
                                }
                                else if(propertyKey.includes(":dimensions")){
                                    metadataRow.classList.add("div-dimension-row", "border-dataset-div-extension-details");
                                    metadataTitleCellDiv.classList.add("subtitle-1", "div-metadata-title", "text-dataset-capitalize");
                                }
                                else{
                                    metadataRow.classList.add("div-metadata-row");
                                    metadataTitleCellDiv.classList.add("subtitle-1", "div-metadata-type", "text-dataset-capitalize");
                                }

                                metadataValueCellDiv.classList.add("body-1");

                                metadataSubHeaderRow.innerText = extensionName;

                                metadataTitleCellDiv.innerText = metadataKeyArray[1];

                                metadataRow.appendChild(metadataTitleCellDiv);


                                if(typeof  propertyValue == "object"){

                                    Object.entries(propertyValue).forEach( ([extensionObjectKey, extensionObjectValue]) => {
                                        if(typeof extensionObjectValue == "object"){
                                            var extensionDetailsContainer = document.createElement("div");
                                            extensionDetailsContainer.classList.add("div-dataset-extension-details");

                                            if(propertyKey.includes(":dimensions")){
                                                var metadataDimensionTitle = document.createElement("div");
                                                metadataDimensionTitle.classList.add("subtitle-1", "div-metadata-subtitle", "text-dataset-capitalize");
                                                metadataDimensionTitle.innerText = extensionObjectKey;
                                                metadataRow.appendChild(metadataDimensionTitle);
                                            }

                                            Object.entries(extensionObjectValue).forEach( ([extensionItemKey, extensionItemValue]) => {
                                                var extensionItemRow = document.createElement("div");
                                                var extensionItemTitleDiv = document.createElement("div");
                                                var extensionItemValueDiv = document.createElement("div");
                                                var convertedExtensionItemValue;

                                                extensionItemRow.classList.add("div-metadata-extension-row");
                                                extensionItemTitleDiv.classList.add("div-metadata-extension-title");

                                                extensionItemRow.appendChild(extensionItemTitleDiv);
                                                extensionItemRow.appendChild(extensionItemValueDiv);

                                                extensionItemTitleDiv.innerText = extensionItemKey;

                                                if(extensionItemKey == "extent"){
                                                    if(Number(extensionItemValue[1]) > 180){
                                                        convertedExtensionItemValue = Number(extensionItemValue[1]) - 360;
                                                        extensionItemValueDiv.innerText = extensionItemValue[0] +  " , " + convertedExtensionItemValue;
                                                    }
                                                    else{
                                                        extensionItemValueDiv.innerText = extensionItemValue[0] +  " , " + extensionItemValue[1];
                                                    }
                                                }
                                                else{
                                                    extensionItemValueDiv.innerText = extensionItemValue;
                                                }

                                                if(extensionObjectKey == "time"){
                                                    if(extensionItemKey == "extent"){
                                                        var datetime1 = new Date(extensionItemValue[0]);
                                                        var datetime2 = new Date(extensionItemValue[1]);
                                                        extensionItemValueDiv.innerText = datetime1 +  " , " + datetime2;
                                                    }
                                                }
                                                extensionDetailsContainer.appendChild(extensionItemRow);
                                                metadataRow.appendChild(extensionDetailsContainer);
                                            })
                                        }
                                    })
                                }
                                else{
                                    if(typeof propertyValue != "string"){
                                        if(propertyValue == true){

                                            metadataValueCellDiv.innerHTML = '<i class="fa-solid fa-check icon-node-local-checkmark"></i>';
                                        }
                                        else{
                                            metadataValueCellDiv.innerHTML = '<i class="fa-solid fa-xmark icon-node-local-xmark"></i>;'
                                        }
                                    }
                                    else{
                                        metadataValueCellDiv.innerText = propertyValue;
                                    }
                                    metadataRow.appendChild(metadataValueCellDiv);
                                }

                                metadataSubBody.appendChild(metadataRow);
                                metadataBody.appendChild(metadataExtensionContainer);
                            }
                        }
                    })
                }
            }
        }




    Object.entries(features).forEach(([featureKey, featureValue]) => {

        if(featureKey == "id"){
            datasetName.innerHTML = "";
            datasetID = featureValue;
            /*Add asset title to details section main title*/
            var datasetTitle = document.createElement("h4");
            datasetTitle.innerText = featureValue;
            datasetName.appendChild(datasetTitle);
        }

        if(featureKey == "collection"){
            datasetCollectionName.innerText = featureValue;
        }

        if(featureKey == "assets"){
            Object.entries(featureValue).forEach( ([assetKey, assetValue]) => {
                var assetID = datasetID + assetKey;
                var assetListItem = document.createElement("li");
                var assetDiv = document.createElement("div");
                var assetTitle = document.createElement("p");
                var assetLink = document.createElement("a");
                var copyIconCellDiv = document.createElement("div");
                var copyIconLink =  document.createElement("a");
                var copyIcon = document.createElement("img");
                var downloadIconCellDiv = document.createElement("div");
                var downloadIconLink = document.createElement("a");
                var downloadIcon = document.createElement("img");

                copyIconCellDiv.appendChild(copyIconLink);
                downloadIconCellDiv.appendChild(downloadIconLink);

                copyIcon.setAttribute("src", "images/copy-icon.svg");
                copyIcon.classList.add("image-copy-icon");
                copyIconLink.id = assetID+"icon";
                copyIconLink.setAttribute("role", "button");
                copyIconLink.classList.add("a-icon-copy");
                copyIconLink.appendChild(copyIcon);


                downloadIcon.setAttribute("src", "images/download-icon.svg");
                downloadIcon.classList.add("image-download-icon")
                downloadIconLink.setAttribute("role", "button");
                downloadIconLink.classList.add("a-icon-download");
                downloadIconLink.appendChild(downloadIcon);

                assetDiv.classList.add("div-asset-list-entry");
                assetTitle.classList.add("p-asset-title");
                assetLink.classList.add("a-asset-link");


                if(assetKey == "HTTPServer" || assetKey == "NetcdfSubset") {
                    /*Sets href attribute for links meant to be downloaded*/
                    assetLink.href = assetValue.href;
                    downloadIconLink.href = assetValue.href;

                    /*Add hardcoded title in asset row entry*/
                    assetTitle.innerText = assetKey;
                    assetDiv.appendChild(assetTitle);

                    /*Sets attributes for Bootstrap tooltips for hover on the download icon and link text*/
                    var downloadIconHoverTooltip = new bootstrap.Tooltip(downloadIconLink, {
                        "trigger": "hover",
                        "placement": "top",
                        "title":"Click to download"});

                    var downloadHoverTooltip = new bootstrap.Tooltip(assetLink, {
                        "trigger": "hover",
                        "placement": "top",
                        "title":"Click to download"});

                    downloadIconLink.setAttribute("data-toggle", "tooltip");
                }
                else{
                    /*Add asset title entry in asset row entry*/
                    assetTitle.innerText = assetKey;
                    assetDiv.appendChild(assetTitle);


                    /*Set attributes for Bootstrap tooltip for asset link*/
                    var assetLinkClickTooltip = new bootstrap.Tooltip(assetLink, {
                        "trigger": "click",
                        "placement": "top",
                        "title":"Link copied"});
                    
                    var assetLinkHoverTooltip = new bootstrap.Tooltip(assetLink, {
                        "trigger": "hover",
                        "placement": "top",
                        "title":"Click to copy url"});
                    
                    assetLink.setAttribute("data-toggle", "tooltip");
                    /*Set value attribute for links meant to be copied to clipboard*/
                    assetLink.setAttribute("value", assetValue.href);
                    /*Set role of link as button*/
                    assetLink.setAttribute("role", "button");
                    assetLink.onclick = function(){
                        hideTooltip(assetLinkHoverTooltip);
                        showTooltip(assetLinkClickTooltip);
                        setClipboard(assetID, assetLinkClickTooltip)
                    };


                    /*Set attributes for Bootstrap tooltip for icon link*/
                    var copyIconClickTooltip = new bootstrap.Tooltip(copyIconLink, {
                        "trigger": "click",
                        "placement": "top",
                        "title":"Link copied"});

                    var copyIconHoverTooltip = new bootstrap.Tooltip(copyIconLink, {
                        "trigger": "hover",
                        "placement": "top",
                        "title":"Click to copy url"});

                    copyIconLink.setAttribute("data-toggle", "tooltip");
                    copyIconLink.setAttribute("data-bs-custom-class", "tooltip-asset-link");
                    copyIconLink.setAttribute("value", assetValue.href);
                    copyIconLink.onclick = function(){
                        hideTooltip(copyIconHoverTooltip);
                        showTooltip(copyIconClickTooltip);
                        setClipboard(copyIconLink.id, copyIconClickTooltip)
                    };
                }

                /*Add link entry*/
                assetLink.id = assetID;
                assetLink.innerText = assetValue.href;
                assetLink.classList.add("body-1");
                assetDiv.appendChild(assetLink);

                /*Add icon entry*/
                if(assetKey == "HTTPServer" || assetKey == "NetcdfSubset"){
                    assetDiv.appendChild(downloadIconLink);
                }
                else{
                    assetDiv.appendChild(copyIconLink);
                }

                assetListItem.appendChild(assetDiv);
                assetDetailsList.appendChild(assetListItem);

            })
        }



        if(featureKey == "geometry"){
            var geometryContainer = document.getElementById("datasetGeometryContainer");
            var leafletMapContainer = document.getElementById("datasetMapContainer");
            var geometryHeader = datasetDetailsHeaderTemplate("Geometries");

            geometryContainer.insertBefore(geometryHeader, leafletMapContainer);

            if(Object.keys(featureValue).includes("coordinates")){
                addSTACPolygon(featureValue["coordinates"]);
            }
        }


       if(featureKey == "bbox") {
            var bboxCoordsArray = addSTACBBox(featureValue);
        }
    })
}


function getSTACSearchResults(url){
    var productionURL = "{{ stac_catalog_url }}/search?";
    var stacSearchURL;
    var queryParams = "";

    if(url != ""){
        stacSearchURL = url;
    }
    else{
        stacSearchURL = productionURL;
    }


    if(!(stacSearchURL.includes("sortby"))){
        queryParams = new URLSearchParams({sortby: "+id"}).toString();

        if(stacSearchURL.includes("?"))
        {
            stacSearchURL = stacSearchURL + decodeURIComponent(queryParams);
        }
        else{
            stacSearchURL = stacSearchURL + "?" + decodeURIComponent(queryParams);
        }

    }


    fetch(stacSearchURL, {
        method: "GET"


    }).then(response => response.json()).then( json => {
        addSearchResultNavigation(json, stacSearchURL);
        populateSearchResults(json);
    })
}

async function setClipboard(elementID, tooltip) {
    var assetLinkElement = document.getElementById(elementID);
    var assetLink = assetLinkElement.getAttribute("value");
    const type = "text/plain";
    const clipboardItemData = {
    [type]: assetLink,
    };
    const clipboardItem = new ClipboardItem(clipboardItemData);
    await navigator.clipboard.write([clipboardItem]);

    setTimeout(() => hideTooltip(tooltip), "2000");
}

function hideTooltip(tooltip){
    tooltip.hide();
}

function showTooltip(tooltip){
    tooltip.show();
}

function datasetDetailsHeaderTemplate(headerText) {
    var headerContainer = document.createElement("div");
    headerContainer.classList.add("header-container");

    var header = document.createElement("div");
    header.classList.add("dataset-details-title", "div-dataset-details-header");

    var headerIcon = document.createElement("div");
    headerIcon.classList.add("dropdown-list-panel-search-icon-background");
    headerIcon.innerHTML = '<i id="" class="fa-solid fa-magnifying-glass dropdown-list-panel-search-icon"></i>';

    var headerTitle = document.createElement("h5");
    headerTitle.innerText = headerText;

    headerContainer.appendChild(header);
    header.appendChild(headerIcon);
    header.appendChild(headerTitle);

    return headerContainer;
}


function buildMySearchDisplay(){
    var searchFilterCategories = ["Collections", "Location", "Time Frame", "Frequency", "Other"];
    var mySearchDiv = document.getElementById("mySearchFilters");
    var mySearchHeader = datasetDetailsHeaderTemplate("My Search");
    var mySearchBody = document.createElement("div");

    mySearchDiv.appendChild(mySearchHeader);
    mySearchDiv.appendChild(mySearchBody);
    mySearchBody.classList.add("div-my-search-body");

    for(category of searchFilterCategories){
        var searchFilterContainer = document.createElement("div");
        var searchFilterHeader = document.createElement("div");
        var searchFilterTitle = document.createElement("div");
        var searchFilterBody = document.createElement("div");
        var searchFilterHidden = document.createElement("div");

        searchFilterContainer.classList.add("div-search-filter-container");
        searchFilterTitle.classList.add("subtitle-1", "text-all-caps", "text-colour-search-filter");
        searchFilterTitle.innerText = category;
        searchFilterBody.classList.add("div-my-search-filter");
        searchFilterHidden.classList.add("div-hidden-filter");

        if(category.includes("-")){

            searchFilterBody.id="searchFilter" + category.replace("-", "") +"Body";
            searchFilterHidden.id="searchFilter" + category.replace("-", "") + "Hidden";
        }
        else if(category.includes(" ")){
            searchFilterBody.id="searchFilter" + category.replace(" ", "") +"Body";
            searchFilterHidden.id="searchFilter" + category.replace(" ", "") + "Hidden";
        }
        else{
            searchFilterBody.id="searchFilter" + category +"Body";
            searchFilterHidden.id="searchFilter" + category + "Hidden";
        }

        mySearchBody.appendChild(searchFilterContainer);
        searchFilterHeader.appendChild(searchFilterTitle);
        searchFilterContainer.appendChild(searchFilterHeader);
        searchFilterContainer.appendChild(searchFilterBody);
        searchFilterContainer.appendChild(searchFilterHidden);
    }
}

function applyMySearch(){
    var productionURL = "{{ stac_catalog_url }}/search?";
    var stacSearchURL = productionURL;
    var filterJSON = {"filter":{"op":"and","args":[]}};
    var fullFilterHiddenContainer = document.getElementById("fullFilterStringContainer");
    var frequencyFilterHiddenContainer = document.getElementById("searchFilterFrequencyHidden");
    var datasetFilterHiddenContainer = document.getElementById("searchFilterCollectionsHidden");
    var timeframeFilterHiddenContainer = document.getElementById("searchFilterTimeFrameHidden");
    var locationFilterHiddenContainer = document.getElementById("searchFilterLocationHidden");
    var otherFilterHiddenContainer = document.getElementById("searchFilterOtherHidden");

    var datasetFilter;
    var frequencyFilter;
    var timeframeFilter;
    var locationFilter
    var otherFilter;


    if(datasetFilterHiddenContainer.innerText && datasetFilterHiddenContainer.innerText !== "" || datasetFilterHiddenContainer.innerText && datasetFilterHiddenContainer.innerText !== null){
        datasetFilter = JSON.parse(datasetFilterHiddenContainer.innerText);
        filterJSON["filter"].args.push(datasetFilter);
    }

    if(frequencyFilterHiddenContainer.innerText && frequencyFilterHiddenContainer.innerText !== "" || frequencyFilterHiddenContainer.innerText && frequencyFilterHiddenContainer.innerText !== null){
        frequencyFilter = JSON.parse(frequencyFilterHiddenContainer.innerText);
        filterJSON["filter"].args.push(frequencyFilter);
    }

    if(timeframeFilterHiddenContainer.innerText && timeframeFilterHiddenContainer.innerText !== "" || timeframeFilterHiddenContainer.innerText && timeframeFilterHiddenContainer.innerText !== null){
        timeframeFilter = JSON.parse(timeframeFilterHiddenContainer.innerText);
        filterJSON["filter"].args.push(timeframeFilter);
    }

    if(locationFilterHiddenContainer.innerText && locationFilterHiddenContainer.innerText !== "" || locationFilterHiddenContainer.innerText && locationFilterHiddenContainer.innerText !== null){
        locationFilter = JSON.parse(locationFilterHiddenContainer.innerText);

        Object.entries(locationFilter).forEach( ([key,value]) => {
            filterJSON[key] = value;
        })
    }

    if(otherFilterHiddenContainer.innerText && otherFilterHiddenContainer.innerText !== "" || otherFilterHiddenContainer.innerText && otherFilterHiddenContainer.innerText !== null){
        otherFilter = JSON.parse(otherFilterHiddenContainer.innerText);

        Object.entries(otherFilter).forEach( ([key,value]) => {
            filterJSON[key] = value;
        })
    }


    fullFilterHiddenContainer.innerText = JSON.stringify(filterJSON);

    fetch(stacSearchURL, {
        headers:{
                "Content-Type": "application/json",
        },
        method: "POST",
        body:JSON.stringify(filterJSON)

    }).then(response => response.json()).then( json => {
        addSearchResultNavigation(json, stacSearchURL);
        populateSearchResults(json);
    })

}

function clearMySearch(){
    var searchFilterContainer = document.getElementById("searchFilterContainer");
    var searchItemDivs = searchFilterContainer.querySelectorAll("div.div-my-search-filter, div.div-hidden-filter");
    var dropdownQueryableContainer = document.getElementById("dropdownQueryables");
    var dropdownQueryableCheckboxes = dropdownQueryableContainer.querySelectorAll('input[type=checkbox]');
    var dropdownCollectionsContainer = document.getElementById("dropdownListDefaultContainer");
    var dropdownCollectionsCheckboxes = dropdownCollectionsContainer.querySelectorAll('input[type=checkbox]');

    for(filterDiv of searchItemDivs){
        filterDiv.innerHTML = "";
        filterDiv.innerText = "";
    }

    for(checkbox of dropdownQueryableCheckboxes){
        if(checkbox.checked == true){
            checkbox.checked = false;
        }
    }

    for(checkbox of dropdownCollectionsCheckboxes){
        if(checkbox.checked == true){
            checkbox.checked = false;
        }
    }
}

async function checkSTACEndpoint(url){
    var response = await fetch(url);

    return response.status;
}

async function buildFrequencyFilterDropdown(){
    var productionCollectionsURL = "{{ stac_catalog_url }}/collections";
    var productionQueryablesURL = "{{ stac_catalog_url }}/queryables";

    var searchURL = "";
    var searchJSONNode = "";

    var endpointStatus = await checkSTACEndpoint(productionQueryablesURL);


    if(endpointStatus == 200){
        searchURL = productionQueryablesURL;
        searchJSONNode = "properties";
    }
    else{
        searchURL = productionCollectionsURL;
        searchJSONNode = "summaries";
    }

     fetch(searchURL, {
        headers:{
                "Content-Type": "application/json",
        }

    }).then(response => response.json()).then( json => {

        if(searchJSONNode == "summaries"){
            Object.entries(json.collections).forEach( ([key,value]) => {
                populateFrequencyFilterDropdownItems(value[searchJSONNode], searchJSONNode);
            })
        }
        else{
            populateFrequencyFilterDropdownItems(json[searchJSONNode], searchJSONNode);
        }
    })

}

function populateFrequencyFilterDropdownItems(json, dataEndpoint){
    var frequencyDropdownUL = document.getElementById("dropdownListRegularFrequency");
    var frequencyFilterDiv = document.getElementById("searchFilterFrequencyBody");
    var frequencyFilterDivHidden = document.getElementById("searchFilterFrequencyHidden");


    Object.entries(json).forEach( ([key, value]) => {

        var frequencyArray = [];
        var dropdownListItem = document.createElement("li");
            var dropdownListItemButton = document.createElement("a");
            dropdownListItemButton.setAttribute("role", "button");
            dropdownListItemButton.classList.add("button-advanced-filter-frequency");


        if(value["enum"]){
            frequencyArray = value["enum"];
        }
        else{
            frequencyArray = value;
        }

        for(frequencyItem in frequencyArray){
            if (key.includes("frequency")) {
                switch (frequencyArray[frequencyItem]) {
                    case "day":
                        dropdownListItemButton.innerText = "Day";

                        var filterString = buildFrequencyFilterJSON(dataEndpoint, key, value);

                        dropdownListItemButton.addEventListener('click', function () {
                            frequencyFilterDiv.innerText = "Day";
                            frequencyFilterDivHidden.innerText = JSON.stringify(filterString);
                        });
                        dropdownListItem.appendChild(dropdownListItemButton);
                        frequencyDropdownUL.appendChild(dropdownListItem);
                        break;

                    case "week":
                        dropdownListItemButton.innerText = "Week";

                        var filterString = buildFrequencyFilterJSON(dataEndpoint, key, value);

                        dropdownListItemButton.addEventListener('click', function () {
                            frequencyFilterDiv.innerText = "Week";
                            frequencyFilterDivHidden.innerText = JSON.stringify(filterString);
                        });
                        dropdownListItem.appendChild(dropdownListItemButton);
                        frequencyDropdownUL.appendChild(dropdownListItem);
                        break;

                    case "mon":
                        dropdownListItemButton.innerText = "Month";

                        var filterString = buildFrequencyFilterJSON(dataEndpoint, key, value);

                        dropdownListItemButton.addEventListener('click', function () {
                            frequencyFilterDiv.innerText = "Month";
                            frequencyFilterDivHidden.innerText = JSON.stringify(filterString);
                        });
                        dropdownListItem.appendChild(dropdownListItemButton);
                        frequencyDropdownUL.appendChild(dropdownListItem);
                        break;

                    case "year":
                        dropdownListItemButton.innerText = "Year";

                        var filterString = buildFrequencyFilterJSON(dataEndpoint, key, value);

                        dropdownListItemButton.addEventListener('click', function () {
                            frequencyFilterDiv.innerText = "Year";
                            frequencyFilterDivHidden.innerText = JSON.stringify(filterString);
                        });
                        dropdownListItem.appendChild(dropdownListItemButton);
                        frequencyDropdownUL.appendChild(dropdownListItem);
                        break;
                }
            }

        }
    })
}

function buildFrequencyFilterJSON(collectionAttribute, attributeName, attributeValue){
    var filterString =  {"op": "or", "args": []};
    var frequencyFilterString =  {"op":"=", "args": [{}, ""]};

    if(collectionAttribute == "summaries"){
        frequencyFilterString.args[0][collectionAttribute] = attributeName;
        frequencyFilterString.args[1] = attributeValue;

    }
    else{
        frequencyFilterString.args[0][collectionAttribute] = attributeName;
        frequencyFilterString.args[1] = {"enum":attributeValue.enum};
    }

    filterString.args.push(frequencyFilterString);
    return filterString;
}



function buildQueryablesFilterDropdown(){

    fuseDictionary().then(queryablesArray => {
        var groupedQueryablesExtensionNameArray;
        Object.entries(queryablesArray).forEach( ([queryablesArrayKey, queryablesArrayValue]) => {
            var stacKeyArray = queryablesArrayValue.values.stac_key.split(":");
            queryablesArray[queryablesArrayKey]["extension_name"] = stacKeyArray[0];
            queryablesArray[queryablesArrayKey]["extension_type"] = stacKeyArray[1];

        })

        groupedQueryablesExtensionNameArray =  Object.groupBy(queryablesArray, ({extension_name}) => extension_name);

        buildDropdownQueryableElements(groupedQueryablesExtensionNameArray);
    })
}

function buildDropdownQueryableElements(json){
    var filterDropdownQueryablesContainer = document.getElementById("dropdownQueryables");

        Object.entries(json).forEach( ([queryableKey, queryableValue]) => {
        var dropdownCollectionTitleContainer = document.createElement("div");
        var dropdownCollectionTitle = document.createElement("p");
        var extensionName = "";
        var extensionAttribute = "";

        if (!queryableKey.includes("marble") && queryableValue[0].values[0].includes("enum")) {
            dropdownCollectionTitle.innerText = queryableKey;
        }
        dropdownCollectionTitle.classList.add("subtitle-1", "title-advanced-filters");
        dropdownCollectionTitleContainer.appendChild(dropdownCollectionTitle);
        filterDropdownQueryablesContainer.appendChild(dropdownCollectionTitleContainer);


        var groupedByExtensionType = Object.groupBy(queryableValue, ({extension_type}) => extension_type);

        Object.entries(groupedByExtensionType).forEach( ([extensionTypeKey, extensionTypeValue]) => {

            var dropdownContainer = document.createElement("div");
            var dropdownDiv = document.createElement("div");
            var dropdownButton = document.createElement("a");
            var dropdownButtonText = document.createElement("div");
            var dropdownList = document.createElement("ul");

            for (extensionType of extensionTypeValue){

                if (queryableKey == extensionType.extension_name && !queryableKey.includes("marble") && extensionType.values[0] && extensionType.values[0].includes("enum")) {

                    extensionName = extensionType.extension_name.toUpperCase();

                    extensionAttribute = String(extensionType.extension_type).charAt(0).toUpperCase() + String(extensionType.extension_type).slice(1);

                    dropdownContainer.id = "dropdownListQueryables" + extensionName + extensionAttribute + "Container";
                    dropdownContainer.classList.add("dropdown-regular-list-container");

                    dropdownDiv.classList.add("dropdown");

                    dropdownButton.id = "dropdownListQueryables" + extensionName + extensionAttribute + "Button";
                    dropdownButton.classList.add("btn", "btn-secondary", "dropdown-toggle", "padding-unset",
                        "dropdown-regular-list-button", "dropdown-regular-list-chevron-icon");
                    dropdownButton.setAttribute("role", "button");
                    dropdownButton.setAttribute("data-bs-toggle", "dropdown");
                    dropdownButton.setAttribute("data-bs-display", "static");
                    dropdownButton.setAttribute("data-bs-auto-close", "outside");
                    dropdownButton.setAttribute("aria-expanded", "false");

                    dropdownButtonText.id = "dropdownListQueryables" + extensionName + extensionAttribute + "ButtonText";
                    dropdownButtonText.classList.add("subtitle-1", "dropdown-frequency-list-title", "margin-unset", "padding-unset");
                    dropdownButtonText.innerText = extensionAttribute.replaceAll("_", " ");

                    dropdownList.id = "dropdownListRegularQueryables" + extensionName + extensionAttribute;
                    dropdownList.classList.add("dropdown-menu", "margin-unset", "padding-unset", "dropdown-regular-list", "dropdown-regular-list-frequency");
                    dropdownList.setAttribute("aria-labelledby", "dropdownListQueryablesButtonText");

                    var dropdownListItem = document.createElement("li");
                    var checkboxBufferDiv = document.createElement("div");
                    var checkboxLabel = document.createElement("label");
                    var checkboxLabelText = document.createElement("p");
                    var checkmarkSpan = document.createElement("span");
                    var checkbox = document.createElement("input");
                    var checkboxID = (extensionType.values.stac_key.replaceAll(':', '_')
                        + extensionType.key.replaceAll(" ", "")).replaceAll('"','');

                    dropdownListItem.id = "listItem" + extensionType.key.replaceAll(' ', '');

                    checkmarkSpan.classList.add("checkmark");
                    checkboxLabel.classList.add("checkbox-container", "margin-unset");

                    checkboxLabel.setAttribute("for", checkboxID);
                    checkboxLabelText.classList.add("checkbox-label-text");
                    checkboxLabelText.innerText = extensionType.key.trim();

                    checkbox.setAttribute("type", "checkbox");
                    checkbox.id = checkboxID;
                    checkbox.setAttribute("propertyname", extensionType.values.stac_key);
                    checkbox.setAttribute("value", extensionType.key);

                    checkbox.addEventListener('change', function () {
                        buildQueryableFilterString(dropdownList);
                    });

                    checkboxBufferDiv.appendChild(checkboxLabel);
                    checkboxLabel.appendChild(checkbox);
                    checkboxLabel.appendChild(checkmarkSpan);
                    checkboxLabel.appendChild(checkboxLabelText);
                    checkboxBufferDiv.appendChild(checkboxLabel);
                    dropdownListItem.appendChild(checkboxBufferDiv);

                    dropdownList.appendChild(dropdownListItem);
                }
            }

            dropdownButton.appendChild(dropdownButtonText);
            dropdownDiv.appendChild(dropdownButton);
            dropdownDiv.appendChild(dropdownList);
            dropdownContainer.appendChild(dropdownDiv);

            filterDropdownQueryablesContainer.appendChild(dropdownContainer);

        });
    })
}

function buildQueryableFilterString(checkboxList){
    var filterQueryables = {"filter": {"op": "or", "args": []}};

    var searchFilterOtherBody = document.getElementById("searchFilterOtherBody");
    var searchFilterOtherHidden = document.getElementById("searchFilterOtherHidden");
    var checkboxArray = checkboxList.querySelectorAll('input[type=checkbox]');
        /*Adds entry under Other if checkbox is checked*/
        for(checkbox of checkboxArray){
            var filterProperty =  {"op": "=", "args": [{ "property": "" }, ""]};
            if(checkbox.checked == true ){

                var propertyKey = checkbox.getAttribute("propertyname");
                var propertyValue = checkbox.value;

                if(!(checkbox.id in filterPropertyList)){

                    if(checkKeywordsDisplayed(checkbox.value) == false){
                        var filterPropertyDisplay = document.createElement("p");
                        filterPropertyDisplay.id = checkbox.id + "Display";
                        filterPropertyDisplay.setAttribute("queryablekeyvalue", checkbox.value);
                        filterPropertyDisplay.classList.add("subtitle-2");
                        filterPropertyDisplay.innerText = propertyValue;
                        searchFilterOtherBody.appendChild(filterPropertyDisplay);
                    }

                    filterProperty.args[0].property = propertyKey;
                    filterProperty.args[1] = propertyValue;
                    filterPropertyList[checkbox.id] = filterProperty;
                }
            }

            if(checkbox.checked == false && checkbox.id in filterPropertyList){
                var propertyKey = checkbox.getAttribute("propertyname");

                    removeOtherEntry(propertyKey, checkboxList);
                    delete filterPropertyList[checkbox.id];
            }
        }

    Object.entries(filterPropertyList).forEach( ([key,value]) => {
        filterQueryables.filter.args.push(value);
    })
    searchFilterOtherHidden.innerText = JSON.stringify(filterQueryables);
}


function checkKeywordsDisplayed(checkboxValue){
    var keywordDisplayStatus;
    var searchFilterOtherBody = document.getElementById("searchFilterOtherBody");
    var paragraphArray = searchFilterOtherBody.querySelectorAll('p');

    if(paragraphArray.length > 0){
        for(paragraph of paragraphArray){
            var keywordValue = paragraph.getAttribute("queryablekeyvalue");
            if(checkboxValue == keywordValue){
                keywordDisplayStatus = true;
            }
            else{
                keywordDisplayStatus = false;
            }
        }
    }
    else{
        keywordDisplayStatus = false;
    }

    return keywordDisplayStatus;
}


/*Searchbox Keyword Functions*/

function addKeyword(keyword, stacKey){
    var propertyNameArray;
    var extensionName;
    var extensionAttribute;
    var checkboxList;

    if(stacKey != null){
        propertyNameArray = stacKey.split(":");
        extensionName = propertyNameArray[0].toUpperCase();
        extensionAttribute = String(propertyNameArray[1]).charAt(0).toUpperCase() + String(propertyNameArray[1]).slice(1);

        checkboxList = document.getElementById("dropdownListRegularQueryables" + extensionName + extensionAttribute);
    }

    if(keyword && (keyword != "" || keyword != null)) {
        removeOtherEntry(stacKey, checkboxList);

        /*Find corresponding checkbox, make it checked, and expand the dropdown it's in*/
        var selector = 'input[value=' + '"' + keyword + '"' + ']';
        var correspondingCheckboxList = document.querySelectorAll(selector);

        for(checkbox of correspondingCheckboxList){
            var correspondingCheckbox = document.getElementById(checkbox.id);
            var propertyName = correspondingCheckbox.getAttribute("propertyname");

            correspondingCheckbox.checked = true;

            if(propertyName.includes(":")){
                var propertyNameArray = propertyName.split(":");
                var extensionName = propertyNameArray[0].toUpperCase();
                var extensionAttribute = String(propertyNameArray[1]).charAt(0).toUpperCase() + String(propertyNameArray[1]).slice(1);
                var propertyKey = extensionName + extensionAttribute;
                var dropdownQueryablesButton = document.getElementById("dropdownListQueryables" + propertyKey + "Button");
                var dropdownQueryablesList = document.getElementById("dropdownListRegularQueryables" + propertyKey);

                dropdownQueryablesList.classList.add("show");
                dropdownQueryablesButton.setAttribute("aria-expanded", "true");
            }
        }

        /*Make the filter*/
        buildQueryableFilterString(checkboxList);
    }
}

function removeOtherEntry(propertyKey, checkboxList){
    var searchFilterOtherBody = document.getElementById("searchFilterOtherBody");
    var checkboxArray = checkboxList.querySelectorAll('input[type=checkbox]');
    var paragraphArray = searchFilterOtherBody.querySelectorAll('p');

    for (paragraph of paragraphArray) {
        for (checkbox of checkboxArray) {
            if(checkbox.checked == false) {
                /*Remove duplicate entries in Other if they contain the same value/content as the checkbox*/
                var paragraphValue = paragraph.getAttribute("queryablekeyvalue");
                var checkboxValue = checkbox.getAttribute("value");

                if (paragraphValue == checkboxValue) {
                    var paragraphEntry = document.getElementById(paragraph.id);
                    searchFilterOtherBody.removeChild(paragraphEntry);
                    delete filterPropertyList[checkbox.id];
                }
            }
        }
    }
}