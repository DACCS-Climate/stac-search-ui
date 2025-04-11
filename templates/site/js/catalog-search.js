$(document).ready(function() {
    /*Initialize Popper.js and Tooltips.js*/
    $('[data-toggle="tooltip"]').tooltip();
    $('[data-toggle="popover"]').popover();
})

function getCollection(){
    var dropdownDefault = document.getElementById("dropdownListDefaultContainer");
    var checkboxes = dropdownDefault.querySelectorAll('li.dropdown-default-list-item label.checkbox-container input');
    return checkboxes;
}

function fuseDictionary(_queryables, _path) {
    var found = {};
    if (_path === undefined) {
        _path = [];
    }
    if (_queryables === undefined) {
        return fetch("{{ stac_catalog_url }}/queryables").then(response => response.json())
                                                         .then(json => Object.entries(fuseDictionary(json.properties))
                                                                             .map(([key, val]) => { return {"key": key, "values": val} }) )
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

function getWord(inputBox){
    var queryablesArray = [];
    var queryableResultButton;
    var queryResultList = document.getElementById("suggestedWordOutputList");


    if(inputBox.value !="") {
        inputBox.setAttribute("aria-expanded", "true");

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
                            queryableResultButton.setAttribute('queryablekeytype', queryableItem.item.values[0][1]);
                            queryableResultButton.setAttribute('queryablekeyvalue', queryableItem.item.key);
                            queryableResultButton.id = "match" + queryablesArray.indexOf(queryableItem);

                            queryableResultButton.addEventListener('click', function (event) {
                                selectSearchResults(inputBox, event.target.id);
                                formatSearch(queryableItem.item.values[0][1], queryableItem.item.key);
                            })

                            listItemFont.appendChild(queryableResultButton);
                            queryResultListItem.appendChild(listItemFont);
                            queryResultList.appendChild(queryResultListItem);
                        });
                    }
                })
            }
            else{
                inputBox.setAttribute("aria-expanded", "false");
            }
        }
    }
    else{
        inputBox.setAttribute("aria-expanded", "false");
    }
}

function selectSearchResults(inputBox, buttonID){
    var listButton = document.getElementById(buttonID);
    inputBox.value = listButton.innerText;
    inputBox.setAttribute("aria-expanded", "false");
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

function formatSearch(queryableItemKeyType, queryableItemKeyValue){
    var searchJSONDisplay = document.getElementById("searchJSON");
    var searchJSON = {
     "properties": {
         [queryableItemKeyType]: queryableItemKeyValue
     }
    };

    var displayJSON = JSON.stringify(searchJSON);
    searchJSONDisplay.innerText = displayJSON;
}

function filterSTACSearchResults(){
    var productionURL = "{{ stac_catalog_url }}/search";
    var testingURL = "https://infomatics-dcs.cs.toronto.edu/stac/search";
    //var searchJSON = JSON.parse(document.getElementById("searchJSON").innerText);
    var testSearch = '{"type":"FeatureCollection","features":[{"properties":{"enum":"Surface Air Pressure "}}]}';
    var testSearch = '{"properties":{"enum":"Surface Temperature"}}';

    fetch(testingURL, {
        headers:{
            "Content-Type":"application/json"
        },

        method: "POST",
        body: testSearch
    }).then(response => response.json()).then( json => {
        console.log(json);
    })
}

function addSearchResultNavigation(json, searchHomeURL){

    var firstButton = document.getElementById("searchResultsFirst");
    var nextButton = document.getElementById("searchResultsNext");
    var previousButton = document.getElementById("searchResultsPrevious");


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

           if(nextButton.onclick != ""){
                nextButton.onclick = function() {
                    getSTACSearchResults(linkValue.href);
                }
            }
           else {
                nextButton.onclick = function() {
                    getSTACSearchResults(linkValue.href);
                }
           }
       }

       if(linkValue.rel == "previous"){

           if(previousButton.onclick != ""){
               previousButton.onclick = function() {
                   getSTACSearchResults(linkValue.href);
               }
           }
           else {
               previousButton.onclick = function() {
                   getSTACSearchResults(linkValue.href);
               }
           }
       }
    })
}


function populateSearchResults(json){
    //TODO Delete redoakJSON variable for production
    var redoakJSON =  testSTACSearchGeneralResults();
    console.log("redoak search results");
    console.log(redoakJSON);

    var searchResultDiv = document.getElementById("searchResults");
    if(searchResultDiv.innerHTML != "")
    {
        searchResultDiv.innerHTML = "";
    }
    //TODO Uncomment for production
    /*
    var searchResultTable = document.createElement("table");
    var tableHeader = document.createElement("thead");
    var tableTitleFormatCell = document.createElement("td");
    var tableTitleDatasetCell = document.createElement("td");
    var tableTitleStartDatetimeCell = document.createElement("td");
    var tableTitleEndDatetimeCell = document.createElement("td");

    tableTitleFormatCell.innerText = "Format";
    tableTitleDatasetCell.innerText = "Dataset ID";
    tableTitleStartDatetimeCell.innerText = "Start Datetime";
    tableTitleEndDatetimeCell.innerText = "End Datetime";

    tableHeader.appendChild(tableTitleDatasetCell);
    tableHeader.appendChild(tableTitleStartDatetimeCell);
    tableHeader.appendChild(tableTitleEndDatetimeCell);
    tableHeader.appendChild(tableTitleFormatCell);
    var tableBody = document.createElement("tbody");
    var assetType;


    searchResultTable.appendChild(tableHeader);
    searchResultTable.appendChild(tableBody);
    searchResultDiv.appendChild(searchResultTable);


    Object.entries(redoakJSON.features).forEach( ([featureKey, featureValue]) => {
        var rowSearchResult = document.createElement("tr");
        tableBody.appendChild(rowSearchResult);

        var collectionAnchor = document.createElement("a");
        var cellFormat = document.createElement("td");
        cellFormat.classList.add("search-results-format");

        if(featureValue.id){
            var cellDatasetTitle = document.createElement("td");
            var linkDatasetTitle = document.createElement("a");
            var datasetTitleArray;
            linkDatasetTitle.setAttribute("role", "button");
            console.log("search result");
            console.log(featureValue);
            linkDatasetTitle.onclick = function(){
                swapDatasetDetails();
                populateDatasetDetails(featureValue);
            };

            linkDatasetTitle.innerText = featureValue.id;

            cellDatasetTitle.appendChild(linkDatasetTitle);
            rowSearchResult.appendChild(cellDatasetTitle);
        }


        if(featureValue.properties.start_datetime){
              var cellStartDateTimeValue = document.createElement("td");

              cellStartDateTimeValue.innerText = featureValue.properties.start_datetime;
              rowSearchResult.appendChild(cellStartDateTimeValue);
        }

        if(featureValue.properties.end_datetime){
              var cellEndDateTimeValue = document.createElement("td");

              cellEndDateTimeValue.innerText = featureValue.properties.end_datetime;
              rowSearchResult.appendChild(cellEndDateTimeValue);
        }

        //Add Format
        Object.entries(featureValue.assets).forEach( ([assetKey, assetValue]) => {

            var assetSpan = document.createElement("span");
            if(assetValue.type.includes("application/")){
                var assetTypeArray = assetValue.type.split('/');
                assetType = assetTypeArray[1];
            }
            else{
                assetType = assetValue.type;
            }

            assetSpan.innerText = assetType;
            cellFormat.appendChild(assetSpan);

        })
        rowSearchResult.appendChild(cellFormat);

    })
    */

    //TODO Remove testing code for production
    //Testing Code Below

    var searchResultTable = document.createElement("table");
    var tableHeader = document.createElement("thead");
    var tableTitleFormatCell = document.createElement("td");
    var tableTitleDatasetCell = document.createElement("td");
    var tableTitleDatetimeCell = document.createElement("td");

    tableTitleFormatCell.innerText = "Format";
    tableTitleDatasetCell.innerText = "Dataset ID";
    tableTitleDatetimeCell.innerText = "Datetime";

    tableHeader.appendChild(tableTitleDatasetCell);
    tableHeader.appendChild(tableTitleDatetimeCell);
    tableHeader.appendChild(tableTitleFormatCell);
    var tableBody = document.createElement("tbody");
    var assetType;


    searchResultTable.appendChild(tableHeader);
    searchResultTable.appendChild(tableBody);
    searchResultDiv.appendChild(searchResultTable);

    Object.entries(json.features).forEach( ([featureKey, featureValue]) => {
        var rowSearchResult = document.createElement("tr");
        tableBody.appendChild(rowSearchResult);

        var collectionAnchor = document.createElement("a");
        var cellFormat = document.createElement("td");
        cellFormat.classList.add("search-results-format");

        if(featureValue.assets.metadata_http){
            var cellDatasetTitle = document.createElement("td");
            var linkDatasetTitle = document.createElement("a");
            var datasetTitleArray;
            linkDatasetTitle.setAttribute("role", "button");
            console.log("search result");
            console.log(featureValue);
            linkDatasetTitle.onclick = function(){
                swapDatasetDetails();
                populateDatasetDetails(featureValue);
            };

            datasetTitleArray = featureValue.assets.metadata_http.title.split(".");
            linkDatasetTitle.innerText = datasetTitleArray[0];

            cellDatasetTitle.appendChild(linkDatasetTitle);
            rowSearchResult.appendChild(cellDatasetTitle);
        }


        if(featureValue.properties.datetime){
              var cellPropertyValue = document.createElement("td");


                cellPropertyValue.innerText = featureValue.properties.datetime;
                rowSearchResult.appendChild(cellPropertyValue);
                //cellPropertyValue.appendChild(collectionAnchor);
        }


        //Add Format
        Object.entries(featureValue.assets).forEach( ([assetKey, assetValue]) => {

            var assetSpan = document.createElement("span");
            var assetTypeArray = assetValue.type.split('/');
            var assetType = assetTypeArray[1];

            assetSpan.innerText = assetType;
            cellFormat.appendChild(assetSpan);

        })
        rowSearchResult.appendChild(cellFormat);

    })


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
    //TODO Delete redoakJSON variable for production
    var redoakJSON =  testDatasetProperties();

    var datasetName = document.getElementById("datasetName");
    var datasetCollectionName = document.getElementById("datasetCollectionName");
    var assetDetails = document.getElementById("datasetAssetsContainer");
    var assetDetailsList = document.getElementById("datasetAssetsList")
    assetDetailsList.classList.add("border-dataset-list-details");

    var extensionKey;
    var extensionName;


    var datasetMetadataContainer = document.getElementById("datasetMetadataList");
    //var metadataHeader = datasetDetailsHeaderTemplate("Metadata");
    var metadataBody = document.createElement("div");

    //datasetMetadataContainer.appendChild(metadataHeader);
    datasetMetadataContainer.appendChild(metadataBody);

    var datasetID;

    console.log("dataset features");
    console.log(features);



         if ("properties" in features) {
            //TODO Delete redoakJSON variable for production
            var redoakJSON = testDatasetProperties();
            //console.log("redoakJSON");
            //console.log(redoakJSON);

            var metadataTable = document.createElement("table");

            if("stac_extensions" in features) {
                //TODO Uncomment for loop start 'for(extension of feature["stac_extensions"])' below and delete 'for(extension of redoakJSON["stac_extensions"])' for production
                //for (extension of features["stac_extensions"]) {

                for (extension of redoakJSON["stac_extensions"]) {
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



                    //TODO Uncomment Object.entries line below and delete Object.entries using redoakJSON on line after for production
                    //Object.entries(feature["properties"]).forEach(([propertyKey, propertyValue]) => {
                    Object.entries(redoakJSON["properties"]).forEach(([propertyKey, propertyValue]) => {

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
                                }
                                else if(propertyKey.includes(":dimensions")){
                                    metadataRow.classList.add("div-dimension-row", "border-dataset-div-extension-details");
                                }
                                else{
                                    metadataRow.classList.add("div-metadata-row");
                                }

                                metadataValueCellDiv.classList.add("body-1");

                                metadataSubHeaderRow.innerText = extensionName;

                                metadataTitleCellDiv.innerText = metadataKeyArray[1];
                                metadataTitleCellDiv.classList.add("subtitle-1", "div-metadata-title", "text-dataset-capitalize");
                                metadataRow.appendChild(metadataTitleCellDiv);


                                console.log("propertyValueType")
                                console.log(typeof  propertyValue);
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

                                                extensionItemRow.classList.add("div-metadata-extension-row");
                                                extensionItemTitleDiv.classList.add("div-metadata-extension-title");

                                                extensionItemRow.appendChild(extensionItemTitleDiv);
                                                extensionItemRow.appendChild(extensionItemValueDiv);

                                                extensionItemTitleDiv.innerText = extensionItemKey;

                                                if(extensionItemKey == "extent"){
                                                    extensionItemValueDiv.innerText = extensionItemValue[0] +  " , " + extensionItemValue[1];
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




    //TODO Uncomment Object.entries line below and delete Object.entries using redoakJSON on line after for production
    //Object.entries(features).forEach(([featureKey, featureValue]) => {
    Object.entries(redoakJSON).forEach(([featureKey, featureValue]) => {

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

         //TODO Delete redoakJSON variable for production
            var redoakJSON =  testDatasetProperties();
                //TODO Uncomment Object.entries line below and delete Object.entries using redoakJSON on line after for production
            //Object.entries(featureValue).forEach( ([assetKey, assetValue]) => {
            Object.entries(redoakJSON["assets"]).forEach(([assetKey, assetValue]) => {
                console.log("redoakJSON");
            console.log(redoakJSON);
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
                    /*Set href attribute for links meant to be downloaded*/
                    assetLink.href = assetValue.href;
                    downloadIconLink.href = assetValue.href;

                    /*Add hardcoded title in asset row entry*/
                    assetTitle.innerText = assetKey;
                    assetDiv.appendChild(assetTitle);

                    /*Set attributes for Bootstrap tooltips for hover on the download icon and link text*/
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
            //TODO Delete redoakJSON variable for production
            var redoakJSON =  testDatasetProperties();

            //TODO Uncomment 'Object.keys(featureValue...' line below and delete 'Object.keys(redoakJSON...' using redoakJSON on line after for production
            //if(Object.keys(featureValue["geometry"]).includes("coordinates")){
            if(Object.keys(redoakJSON["geometry"]).includes("coordinates")){

                //TODO Uncomment 'addSTACPolygon(featureValue' line below and delete 'addSTACPolygon(redoakJSON...' using redoakJSON on line after for production
                //addSTACPolygon(featureValue["geometry"]["coordinates"]);
                addSTACPolygon(redoakJSON["geometry"]["coordinates"]);
            }
        }


       if(featureKey == "bbox") {
            var bboxList = document.getElementById("datasetBBoxList");
            bboxList.innerHTML = "";

            var bboxCoordsArray = addSTACBBox(featureValue);

            bboxCoordsArray.forEach( (bboxCoords) => {
                Object.entries(bboxCoords).forEach( ([coordKey, coordValue]) => {
                    var bboxListItem = document.createElement("li");
                    var bboxParagraph = document.createElement("p");

                    bboxParagraph.innerText = coordValue;
                    bboxListItem.appendChild(bboxParagraph);
                    bboxList.appendChild(bboxListItem);
                })

            })
        }
    })
}


function populateProperties(json){
                Object.entries(json.features).forEach( ([featureKey, featureValue]) => {
                    Object.entries(featureValue.properties).forEach(([propertyKey, propertyValue]) => {
                        var cellPropertyValue = document.createElement("td");

                        if (propertyKey == "collection_id") {
                            Object.entries(featureValue.links).forEach(([linkKey, linkValue]) => {
                                if (linkValue.rel == "collection") {
                                    collectionAnchor.setAttribute("href", linkValue.href);
                                }
                            })

                            collectionAnchor.innerText = propertyValue;
                            cellPropertyValue.appendChild(collectionAnchor);
                        } else {
                            cellPropertyValue.innerText = propertyValue;
                        }

                        rowSearchResult.appendChild(cellPropertyValue);
                    })
                })
}

function getSTACSearchResults(url){
    var productionURL = "{{ stac_catalog_url }}/search?";
    var testingURL = "https://infomatics-dcs.cs.toronto.edu/stac/search?";
    var stacSearchURL;
    var queryParams = "";

    if(url != ""){
        stacSearchURL = url;
    }
    else{
        stacSearchURL = testingURL;
    }

    if(!(stacSearchURL.includes("sortby"))){
        queryParams = new URLSearchParams({sortby: "+id"}).toString();
        stacSearchURL = stacSearchURL + decodeURIComponent(queryParams);
    }

    console.log(stacSearchURL);

    fetch(stacSearchURL, {
        method: "GET"


    }).then(response => response.json()).then( json => {
        console.log(json);
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


function testDatasetProperties() {

    var testJSONString = '{"id":"tasmin_day_UKESM1-0-LL_ssp585_r1i1p1f2_gn_2100","bbox":[0.125,-59.875,359.875,89.875],"type":"Feature","links":[{"rel":"collection","type":"application/json","href":"https://redoak.cs.toronto.edu/stac/collections/NEX-GDDP-CMIP6_UofT"},{"rel":"parent","type":"application/json","href":"https://redoak.cs.toronto.edu/stac/collections/NEX-GDDP-CMIP6_UofT"},{"rel":"root","type":"application/json","href":"https://redoak.cs.toronto.edu/stac/"},{"rel":"self","type":"application/geo+json","href":"https://redoak.cs.toronto.edu/stac/collections/NEX-GDDP-CMIP6_UofT/items/tasmin_day_UKESM1-0-LL_ssp585_r1i1p1f2_gn_2100"}],"assets":{"ISO":{"href":"https://redoak.cs.toronto.edu/twitcher/ows/proxy/thredds/iso/datasets/NEX-GDDP-CMIP6/UKESM1-0-LL/ssp585/r1i1p1f2/tasmin/tasmin_day_UKESM1-0-LL_ssp585_r1i1p1f2_gn_2100.nc","type":"","roles":[]},"WCS":{"href":"https://redoak.cs.toronto.edu/twitcher/ows/proxy/thredds/wcs/datasets/NEX-GDDP-CMIP6/UKESM1-0-LL/ssp585/r1i1p1f2/tasmin/tasmin_day_UKESM1-0-LL_ssp585_r1i1p1f2_gn_2100.nc","type":"application/xml","roles":["data"]},"WMS":{"href":"https://redoak.cs.toronto.edu/twitcher/ows/proxy/thredds/wms/datasets/NEX-GDDP-CMIP6/UKESM1-0-LL/ssp585/r1i1p1f2/tasmin/tasmin_day_UKESM1-0-LL_ssp585_r1i1p1f2_gn_2100.nc","type":"application/xml","roles":["visual"]},"NcML":{"href":"https://redoak.cs.toronto.edu/twitcher/ows/proxy/thredds/ncml/datasets/NEX-GDDP-CMIP6/UKESM1-0-LL/ssp585/r1i1p1f2/tasmin/tasmin_day_UKESM1-0-LL_ssp585_r1i1p1f2_gn_2100.nc","type":"","roles":[]},"UDDC":{"href":"https://redoak.cs.toronto.edu/twitcher/ows/proxy/thredds/uddc/datasets/NEX-GDDP-CMIP6/UKESM1-0-LL/ssp585/r1i1p1f2/tasmin/tasmin_day_UKESM1-0-LL_ssp585_r1i1p1f2_gn_2100.nc","type":"","roles":[]},"OpenDAP":{"href":"https://redoak.cs.toronto.edu/twitcher/ows/proxy/thredds/dodsC/datasets/NEX-GDDP-CMIP6/UKESM1-0-LL/ssp585/r1i1p1f2/tasmin/tasmin_day_UKESM1-0-LL_ssp585_r1i1p1f2_gn_2100.nc","type":"text/html","roles":["data"]},"HTTPServer":{"href":"https://redoak.cs.toronto.edu/twitcher/ows/proxy/thredds/fileServer/datasets/NEX-GDDP-CMIP6/UKESM1-0-LL/ssp585/r1i1p1f2/tasmin/tasmin_day_UKESM1-0-LL_ssp585_r1i1p1f2_gn_2100.nc","type":"application/x-netcdf","roles":["data"]},"NetcdfSubset":{"href":"https://redoak.cs.toronto.edu/twitcher/ows/proxy/thredds/ncss/datasets/NEX-GDDP-CMIP6/UKESM1-0-LL/ssp585/r1i1p1f2/tasmin/tasmin_day_UKESM1-0-LL_ssp585_r1i1p1f2_gn_2100.nc","type":"application/x-netcdf","roles":["data"]}},"geometry":{"type":"Polygon","coordinates":[[[0.125,-59.875],[0.125,89.875],[359.875,89.875],[359.875,-59.875],[0.125,-59.875]]]},"collection":"NEX-GDDP-CMIP6_UofT","properties":{"end_datetime":"2100-12-30T12:00:00Z","cube:variables":{"tasmin":{"type":"data","unit":"K","dimensions":["time","lat","lon"],"description":"Daily Minimum Near-Surface Air Temperature"}},"start_datetime":"2100-01-01T12:00:00Z","cube:dimensions":{"lat":{"axis":"y","type":"spatial","extent":[-59.875,89.875],"description":"projection_y_coordinate"},"lon":{"axis":"x","type":"spatial","extent":[0.125,359.875],"description":"projection_x_coordinate"},"time":{"type":"temporal","extent":["2100-01-01T12:00:00Z","2100-12-30T12:00:00Z"],"description":"time"}},"marble:is_local":true,"nexgddp:license":"CC-BY-SA 4.0","nexgddp:version":"1.0","marble:host_node":"UofTRedOak","nexgddp:calendar":"360_day","nexgddp:frequency":"day","nexgddp:source_id":"UKESM1-0-LL","nexgddp:Conventions":"CF-1.7","nexgddp:institution":"NASA Earth Exchange, NASA Ames Research Center, Moffett Field, CA 94035","nexgddp:variable_id":"tasmin","nexgddp:cmip_version":"CMIP6","nexgddp:experiment_id":"ssp585","nexgddp:variant_label":"r1i1p1f2","nexgddp:institution_id":"MOHC"},"stac_version":"1.0.0","stac_extensions":["https://raw.githubusercontent.com/DACCS-Climate/nexgddp-stac-extension/v1.0.0/json-schema/schema.json","https://stac-extensions.github.io/datacube/v2.2.0/schema.json","https://raw.githubusercontent.com/DACCS-Climate/marble-stac-extension/v1.0.0/json-schema/schema.json"]}'

    var testJSON = JSON.parse(testJSONString);

   return testJSON;
}

function testSTACSearchGeneralResults(){
    var testJSONString = '{"type":"FeatureCollection","context":{"limit":10,"returned":10},"features":[{"id":"tasmin_day_UKESM1-0-LL_ssp585_r1i1p1f2_gn_2100","bbox":[0.125,-59.875,359.875,89.875],"type":"Feature","links":[{"rel":"collection","type":"application/json","href":"https://redoak.cs.toronto.edu/stac/collections/NEX-GDDP-CMIP6_UofT"},{"rel":"parent","type":"application/json","href":"https://redoak.cs.toronto.edu/stac/collections/NEX-GDDP-CMIP6_UofT"},{"rel":"root","type":"application/json","href":"https://redoak.cs.toronto.edu/stac/"},{"rel":"self","type":"application/geo+json","href":"https://redoak.cs.toronto.edu/stac/collections/NEX-GDDP-CMIP6_UofT/items/tasmin_day_UKESM1-0-LL_ssp585_r1i1p1f2_gn_2100"}],"assets":{"ISO":{"href":"https://redoak.cs.toronto.edu/twitcher/ows/proxy/thredds/iso/datasets/NEX-GDDP-CMIP6/UKESM1-0-LL/ssp585/r1i1p1f2/tasmin/tasmin_day_UKESM1-0-LL_ssp585_r1i1p1f2_gn_2100.nc","type":"","roles":[]},"WCS":{"href":"https://redoak.cs.toronto.edu/twitcher/ows/proxy/thredds/wcs/datasets/NEX-GDDP-CMIP6/UKESM1-0-LL/ssp585/r1i1p1f2/tasmin/tasmin_day_UKESM1-0-LL_ssp585_r1i1p1f2_gn_2100.nc","type":"application/xml","roles":["data"]},"WMS":{"href":"https://redoak.cs.toronto.edu/twitcher/ows/proxy/thredds/wms/datasets/NEX-GDDP-CMIP6/UKESM1-0-LL/ssp585/r1i1p1f2/tasmin/tasmin_day_UKESM1-0-LL_ssp585_r1i1p1f2_gn_2100.nc","type":"application/xml","roles":["visual"]},"NcML":{"href":"https://redoak.cs.toronto.edu/twitcher/ows/proxy/thredds/ncml/datasets/NEX-GDDP-CMIP6/UKESM1-0-LL/ssp585/r1i1p1f2/tasmin/tasmin_day_UKESM1-0-LL_ssp585_r1i1p1f2_gn_2100.nc","type":"","roles":[]},"UDDC":{"href":"https://redoak.cs.toronto.edu/twitcher/ows/proxy/thredds/uddc/datasets/NEX-GDDP-CMIP6/UKESM1-0-LL/ssp585/r1i1p1f2/tasmin/tasmin_day_UKESM1-0-LL_ssp585_r1i1p1f2_gn_2100.nc","type":"","roles":[]},"OpenDAP":{"href":"https://redoak.cs.toronto.edu/twitcher/ows/proxy/thredds/dodsC/datasets/NEX-GDDP-CMIP6/UKESM1-0-LL/ssp585/r1i1p1f2/tasmin/tasmin_day_UKESM1-0-LL_ssp585_r1i1p1f2_gn_2100.nc","type":"text/html","roles":["data"]},"HTTPServer":{"href":"https://redoak.cs.toronto.edu/twitcher/ows/proxy/thredds/fileServer/datasets/NEX-GDDP-CMIP6/UKESM1-0-LL/ssp585/r1i1p1f2/tasmin/tasmin_day_UKESM1-0-LL_ssp585_r1i1p1f2_gn_2100.nc","type":"application/x-netcdf","roles":["data"]},"NetcdfSubset":{"href":"https://redoak.cs.toronto.edu/twitcher/ows/proxy/thredds/ncss/datasets/NEX-GDDP-CMIP6/UKESM1-0-LL/ssp585/r1i1p1f2/tasmin/tasmin_day_UKESM1-0-LL_ssp585_r1i1p1f2_gn_2100.nc","type":"application/x-netcdf","roles":["data"]}},"geometry":{"type":"Polygon","coordinates":[[[0.125,-59.875],[0.125,89.875],[359.875,89.875],[359.875,-59.875],[0.125,-59.875]]]},"collection":"NEX-GDDP-CMIP6_UofT","properties":{"end_datetime":"2100-12-30T12:00:00Z","cube:variables":{"tasmin":{"type":"data","unit":"K","dimensions":["time","lat","lon"],"description":"Daily Minimum Near-Surface Air Temperature"}},"start_datetime":"2100-01-01T12:00:00Z","cube:dimensions":{"lat":{"axis":"y","type":"spatial","extent":[-59.875,89.875],"description":"projection_y_coordinate"},"lon":{"axis":"x","type":"spatial","extent":[0.125,359.875],"description":"projection_x_coordinate"},"time":{"type":"temporal","extent":["2100-01-01T12:00:00Z","2100-12-30T12:00:00Z"],"description":"time"}},"marble:is_local":true,"nexgddp:license":"CC-BY-SA 4.0","nexgddp:version":"1.0","marble:host_node":"UofTRedOak","nexgddp:calendar":"360_day","nexgddp:frequency":"day","nexgddp:source_id":"UKESM1-0-LL","nexgddp:Conventions":"CF-1.7","nexgddp:institution":"NASA Earth Exchange, NASA Ames Research Center, Moffett Field, CA 94035","nexgddp:variable_id":"tasmin","nexgddp:cmip_version":"CMIP6","nexgddp:experiment_id":"ssp585","nexgddp:variant_label":"r1i1p1f2","nexgddp:institution_id":"MOHC"},"stac_version":"1.0.0","stac_extensions":["https://raw.githubusercontent.com/DACCS-Climate/nexgddp-stac-extension/v1.0.0/json-schema/schema.json","https://stac-extensions.github.io/datacube/v2.2.0/schema.json","https://raw.githubusercontent.com/DACCS-Climate/marble-stac-extension/v1.0.0/json-schema/schema.json"]},{"id":"tasmin_day_UKESM1-0-LL_ssp370_r1i1p1f2_gn_2100","bbox":[0.125,-59.875,359.875,89.875],"type":"Feature","links":[{"rel":"collection","type":"application/json","href":"https://redoak.cs.toronto.edu/stac/collections/NEX-GDDP-CMIP6_UofT"},{"rel":"parent","type":"application/json","href":"https://redoak.cs.toronto.edu/stac/collections/NEX-GDDP-CMIP6_UofT"},{"rel":"root","type":"application/json","href":"https://redoak.cs.toronto.edu/stac/"},{"rel":"self","type":"application/geo+json","href":"https://redoak.cs.toronto.edu/stac/collections/NEX-GDDP-CMIP6_UofT/items/tasmin_day_UKESM1-0-LL_ssp370_r1i1p1f2_gn_2100"}],"assets":{"ISO":{"href":"https://redoak.cs.toronto.edu/twitcher/ows/proxy/thredds/iso/datasets/NEX-GDDP-CMIP6/UKESM1-0-LL/ssp370/r1i1p1f2/tasmin/tasmin_day_UKESM1-0-LL_ssp370_r1i1p1f2_gn_2100.nc","type":"","roles":[]},"WCS":{"href":"https://redoak.cs.toronto.edu/twitcher/ows/proxy/thredds/wcs/datasets/NEX-GDDP-CMIP6/UKESM1-0-LL/ssp370/r1i1p1f2/tasmin/tasmin_day_UKESM1-0-LL_ssp370_r1i1p1f2_gn_2100.nc","type":"application/xml","roles":["data"]},"WMS":{"href":"https://redoak.cs.toronto.edu/twitcher/ows/proxy/thredds/wms/datasets/NEX-GDDP-CMIP6/UKESM1-0-LL/ssp370/r1i1p1f2/tasmin/tasmin_day_UKESM1-0-LL_ssp370_r1i1p1f2_gn_2100.nc","type":"application/xml","roles":["visual"]},"NcML":{"href":"https://redoak.cs.toronto.edu/twitcher/ows/proxy/thredds/ncml/datasets/NEX-GDDP-CMIP6/UKESM1-0-LL/ssp370/r1i1p1f2/tasmin/tasmin_day_UKESM1-0-LL_ssp370_r1i1p1f2_gn_2100.nc","type":"","roles":[]},"UDDC":{"href":"https://redoak.cs.toronto.edu/twitcher/ows/proxy/thredds/uddc/datasets/NEX-GDDP-CMIP6/UKESM1-0-LL/ssp370/r1i1p1f2/tasmin/tasmin_day_UKESM1-0-LL_ssp370_r1i1p1f2_gn_2100.nc","type":"","roles":[]},"OpenDAP":{"href":"https://redoak.cs.toronto.edu/twitcher/ows/proxy/thredds/dodsC/datasets/NEX-GDDP-CMIP6/UKESM1-0-LL/ssp370/r1i1p1f2/tasmin/tasmin_day_UKESM1-0-LL_ssp370_r1i1p1f2_gn_2100.nc","type":"text/html","roles":["data"]},"HTTPServer":{"href":"https://redoak.cs.toronto.edu/twitcher/ows/proxy/thredds/fileServer/datasets/NEX-GDDP-CMIP6/UKESM1-0-LL/ssp370/r1i1p1f2/tasmin/tasmin_day_UKESM1-0-LL_ssp370_r1i1p1f2_gn_2100.nc","type":"application/x-netcdf","roles":["data"]},"NetcdfSubset":{"href":"https://redoak.cs.toronto.edu/twitcher/ows/proxy/thredds/ncss/datasets/NEX-GDDP-CMIP6/UKESM1-0-LL/ssp370/r1i1p1f2/tasmin/tasmin_day_UKESM1-0-LL_ssp370_r1i1p1f2_gn_2100.nc","type":"application/x-netcdf","roles":["data"]}},"geometry":{"type":"Polygon","coordinates":[[[0.125,-59.875],[0.125,89.875],[359.875,89.875],[359.875,-59.875],[0.125,-59.875]]]},"collection":"NEX-GDDP-CMIP6_UofT","properties":{"end_datetime":"2100-12-30T12:00:00Z","cube:variables":{"tasmin":{"type":"data","unit":"K","dimensions":["time","lat","lon"],"description":"Daily Minimum Near-Surface Air Temperature"}},"start_datetime":"2100-01-01T12:00:00Z","cube:dimensions":{"lat":{"axis":"y","type":"spatial","extent":[-59.875,89.875],"description":"projection_y_coordinate"},"lon":{"axis":"x","type":"spatial","extent":[0.125,359.875],"description":"projection_x_coordinate"},"time":{"type":"temporal","extent":["2100-01-01T12:00:00Z","2100-12-30T12:00:00Z"],"description":"time"}},"marble:is_local":true,"nexgddp:license":"CC-BY-SA 4.0","nexgddp:version":"1.0","marble:host_node":"UofTRedOak","nexgddp:calendar":"360_day","nexgddp:frequency":"day","nexgddp:source_id":"UKESM1-0-LL","nexgddp:Conventions":"CF-1.7","nexgddp:institution":"NASA Earth Exchange, NASA Ames Research Center, Moffett Field, CA 94035","nexgddp:variable_id":"tasmin","nexgddp:cmip_version":"CMIP6","nexgddp:experiment_id":"ssp370","nexgddp:variant_label":"r1i1p1f2","nexgddp:institution_id":"MOHC"},"stac_version":"1.0.0","stac_extensions":["https://raw.githubusercontent.com/DACCS-Climate/nexgddp-stac-extension/v1.0.0/json-schema/schema.json","https://stac-extensions.github.io/datacube/v2.2.0/schema.json","https://raw.githubusercontent.com/DACCS-Climate/marble-stac-extension/v1.0.0/json-schema/schema.json"]},{"id":"tasmin_day_UKESM1-0-LL_ssp245_r1i1p1f2_gn_2100","bbox":[0.125,-59.875,359.875,89.875],"type":"Feature","links":[{"rel":"collection","type":"application/json","href":"https://redoak.cs.toronto.edu/stac/collections/NEX-GDDP-CMIP6_UofT"},{"rel":"parent","type":"application/json","href":"https://redoak.cs.toronto.edu/stac/collections/NEX-GDDP-CMIP6_UofT"},{"rel":"root","type":"application/json","href":"https://redoak.cs.toronto.edu/stac/"},{"rel":"self","type":"application/geo+json","href":"https://redoak.cs.toronto.edu/stac/collections/NEX-GDDP-CMIP6_UofT/items/tasmin_day_UKESM1-0-LL_ssp245_r1i1p1f2_gn_2100"}],"assets":{"ISO":{"href":"https://redoak.cs.toronto.edu/twitcher/ows/proxy/thredds/iso/datasets/NEX-GDDP-CMIP6/UKESM1-0-LL/ssp245/r1i1p1f2/tasmin/tasmin_day_UKESM1-0-LL_ssp245_r1i1p1f2_gn_2100.nc","type":"","roles":[]},"WCS":{"href":"https://redoak.cs.toronto.edu/twitcher/ows/proxy/thredds/wcs/datasets/NEX-GDDP-CMIP6/UKESM1-0-LL/ssp245/r1i1p1f2/tasmin/tasmin_day_UKESM1-0-LL_ssp245_r1i1p1f2_gn_2100.nc","type":"application/xml","roles":["data"]},"WMS":{"href":"https://redoak.cs.toronto.edu/twitcher/ows/proxy/thredds/wms/datasets/NEX-GDDP-CMIP6/UKESM1-0-LL/ssp245/r1i1p1f2/tasmin/tasmin_day_UKESM1-0-LL_ssp245_r1i1p1f2_gn_2100.nc","type":"application/xml","roles":["visual"]},"NcML":{"href":"https://redoak.cs.toronto.edu/twitcher/ows/proxy/thredds/ncml/datasets/NEX-GDDP-CMIP6/UKESM1-0-LL/ssp245/r1i1p1f2/tasmin/tasmin_day_UKESM1-0-LL_ssp245_r1i1p1f2_gn_2100.nc","type":"","roles":[]},"UDDC":{"href":"https://redoak.cs.toronto.edu/twitcher/ows/proxy/thredds/uddc/datasets/NEX-GDDP-CMIP6/UKESM1-0-LL/ssp245/r1i1p1f2/tasmin/tasmin_day_UKESM1-0-LL_ssp245_r1i1p1f2_gn_2100.nc","type":"","roles":[]},"OpenDAP":{"href":"https://redoak.cs.toronto.edu/twitcher/ows/proxy/thredds/dodsC/datasets/NEX-GDDP-CMIP6/UKESM1-0-LL/ssp245/r1i1p1f2/tasmin/tasmin_day_UKESM1-0-LL_ssp245_r1i1p1f2_gn_2100.nc","type":"text/html","roles":["data"]},"HTTPServer":{"href":"https://redoak.cs.toronto.edu/twitcher/ows/proxy/thredds/fileServer/datasets/NEX-GDDP-CMIP6/UKESM1-0-LL/ssp245/r1i1p1f2/tasmin/tasmin_day_UKESM1-0-LL_ssp245_r1i1p1f2_gn_2100.nc","type":"application/x-netcdf","roles":["data"]},"NetcdfSubset":{"href":"https://redoak.cs.toronto.edu/twitcher/ows/proxy/thredds/ncss/datasets/NEX-GDDP-CMIP6/UKESM1-0-LL/ssp245/r1i1p1f2/tasmin/tasmin_day_UKESM1-0-LL_ssp245_r1i1p1f2_gn_2100.nc","type":"application/x-netcdf","roles":["data"]}},"geometry":{"type":"Polygon","coordinates":[[[0.125,-59.875],[0.125,89.875],[359.875,89.875],[359.875,-59.875],[0.125,-59.875]]]},"collection":"NEX-GDDP-CMIP6_UofT","properties":{"end_datetime":"2100-12-30T12:00:00Z","cube:variables":{"tasmin":{"type":"data","unit":"K","dimensions":["time","lat","lon"],"description":"Daily Minimum Near-Surface Air Temperature"}},"start_datetime":"2100-01-01T12:00:00Z","cube:dimensions":{"lat":{"axis":"y","type":"spatial","extent":[-59.875,89.875],"description":"projection_y_coordinate"},"lon":{"axis":"x","type":"spatial","extent":[0.125,359.875],"description":"projection_x_coordinate"},"time":{"type":"temporal","extent":["2100-01-01T12:00:00Z","2100-12-30T12:00:00Z"],"description":"time"}},"marble:is_local":true,"nexgddp:license":"CC-BY-SA 4.0","nexgddp:version":"1.0","marble:host_node":"UofTRedOak","nexgddp:calendar":"360_day","nexgddp:frequency":"day","nexgddp:source_id":"UKESM1-0-LL","nexgddp:Conventions":"CF-1.7","nexgddp:institution":"NASA Earth Exchange, NASA Ames Research Center, Moffett Field, CA 94035","nexgddp:variable_id":"tasmin","nexgddp:cmip_version":"CMIP6","nexgddp:experiment_id":"ssp245","nexgddp:variant_label":"r1i1p1f2","nexgddp:institution_id":"MOHC"},"stac_version":"1.0.0","stac_extensions":["https://raw.githubusercontent.com/DACCS-Climate/nexgddp-stac-extension/v1.0.0/json-schema/schema.json","https://stac-extensions.github.io/datacube/v2.2.0/schema.json","https://raw.githubusercontent.com/DACCS-Climate/marble-stac-extension/v1.0.0/json-schema/schema.json"]},{"id":"tasmin_day_UKESM1-0-LL_ssp126_r1i1p1f2_gn_2100","bbox":[0.125,-59.875,359.875,89.875],"type":"Feature","links":[{"rel":"collection","type":"application/json","href":"https://redoak.cs.toronto.edu/stac/collections/NEX-GDDP-CMIP6_UofT"},{"rel":"parent","type":"application/json","href":"https://redoak.cs.toronto.edu/stac/collections/NEX-GDDP-CMIP6_UofT"},{"rel":"root","type":"application/json","href":"https://redoak.cs.toronto.edu/stac/"},{"rel":"self","type":"application/geo+json","href":"https://redoak.cs.toronto.edu/stac/collections/NEX-GDDP-CMIP6_UofT/items/tasmin_day_UKESM1-0-LL_ssp126_r1i1p1f2_gn_2100"}],"assets":{"ISO":{"href":"https://redoak.cs.toronto.edu/twitcher/ows/proxy/thredds/iso/datasets/NEX-GDDP-CMIP6/UKESM1-0-LL/ssp126/r1i1p1f2/tasmin/tasmin_day_UKESM1-0-LL_ssp126_r1i1p1f2_gn_2100.nc","type":"","roles":[]},"WCS":{"href":"https://redoak.cs.toronto.edu/twitcher/ows/proxy/thredds/wcs/datasets/NEX-GDDP-CMIP6/UKESM1-0-LL/ssp126/r1i1p1f2/tasmin/tasmin_day_UKESM1-0-LL_ssp126_r1i1p1f2_gn_2100.nc","type":"application/xml","roles":["data"]},"WMS":{"href":"https://redoak.cs.toronto.edu/twitcher/ows/proxy/thredds/wms/datasets/NEX-GDDP-CMIP6/UKESM1-0-LL/ssp126/r1i1p1f2/tasmin/tasmin_day_UKESM1-0-LL_ssp126_r1i1p1f2_gn_2100.nc","type":"application/xml","roles":["visual"]},"NcML":{"href":"https://redoak.cs.toronto.edu/twitcher/ows/proxy/thredds/ncml/datasets/NEX-GDDP-CMIP6/UKESM1-0-LL/ssp126/r1i1p1f2/tasmin/tasmin_day_UKESM1-0-LL_ssp126_r1i1p1f2_gn_2100.nc","type":"","roles":[]},"UDDC":{"href":"https://redoak.cs.toronto.edu/twitcher/ows/proxy/thredds/uddc/datasets/NEX-GDDP-CMIP6/UKESM1-0-LL/ssp126/r1i1p1f2/tasmin/tasmin_day_UKESM1-0-LL_ssp126_r1i1p1f2_gn_2100.nc","type":"","roles":[]},"OpenDAP":{"href":"https://redoak.cs.toronto.edu/twitcher/ows/proxy/thredds/dodsC/datasets/NEX-GDDP-CMIP6/UKESM1-0-LL/ssp126/r1i1p1f2/tasmin/tasmin_day_UKESM1-0-LL_ssp126_r1i1p1f2_gn_2100.nc","type":"text/html","roles":["data"]},"HTTPServer":{"href":"https://redoak.cs.toronto.edu/twitcher/ows/proxy/thredds/fileServer/datasets/NEX-GDDP-CMIP6/UKESM1-0-LL/ssp126/r1i1p1f2/tasmin/tasmin_day_UKESM1-0-LL_ssp126_r1i1p1f2_gn_2100.nc","type":"application/x-netcdf","roles":["data"]},"NetcdfSubset":{"href":"https://redoak.cs.toronto.edu/twitcher/ows/proxy/thredds/ncss/datasets/NEX-GDDP-CMIP6/UKESM1-0-LL/ssp126/r1i1p1f2/tasmin/tasmin_day_UKESM1-0-LL_ssp126_r1i1p1f2_gn_2100.nc","type":"application/x-netcdf","roles":["data"]}},"geometry":{"type":"Polygon","coordinates":[[[0.125,-59.875],[0.125,89.875],[359.875,89.875],[359.875,-59.875],[0.125,-59.875]]]},"collection":"NEX-GDDP-CMIP6_UofT","properties":{"end_datetime":"2100-12-30T12:00:00Z","cube:variables":{"tasmin":{"type":"data","unit":"K","dimensions":["time","lat","lon"],"description":"Daily Minimum Near-Surface Air Temperature"}},"start_datetime":"2100-01-01T12:00:00Z","cube:dimensions":{"lat":{"axis":"y","type":"spatial","extent":[-59.875,89.875],"description":"projection_y_coordinate"},"lon":{"axis":"x","type":"spatial","extent":[0.125,359.875],"description":"projection_x_coordinate"},"time":{"type":"temporal","extent":["2100-01-01T12:00:00Z","2100-12-30T12:00:00Z"],"description":"time"}},"marble:is_local":true,"nexgddp:license":"CC-BY-SA 4.0","nexgddp:version":"1.0","marble:host_node":"UofTRedOak","nexgddp:calendar":"360_day","nexgddp:frequency":"day","nexgddp:source_id":"UKESM1-0-LL","nexgddp:Conventions":"CF-1.7","nexgddp:institution":"NASA Earth Exchange, NASA Ames Research Center, Moffett Field, CA 94035","nexgddp:variable_id":"tasmin","nexgddp:cmip_version":"CMIP6","nexgddp:experiment_id":"ssp126","nexgddp:variant_label":"r1i1p1f2","nexgddp:institution_id":"MOHC"},"stac_version":"1.0.0","stac_extensions":["https://raw.githubusercontent.com/DACCS-Climate/nexgddp-stac-extension/v1.0.0/json-schema/schema.json","https://stac-extensions.github.io/datacube/v2.2.0/schema.json","https://raw.githubusercontent.com/DACCS-Climate/marble-stac-extension/v1.0.0/json-schema/schema.json"]},{"id":"tasmin_day_TaiESM1_ssp585_r1i1p1f1_gn_2100","bbox":[0.125,-59.875,359.875,89.875],"type":"Feature","links":[{"rel":"collection","type":"application/json","href":"https://redoak.cs.toronto.edu/stac/collections/NEX-GDDP-CMIP6_UofT"},{"rel":"parent","type":"application/json","href":"https://redoak.cs.toronto.edu/stac/collections/NEX-GDDP-CMIP6_UofT"},{"rel":"root","type":"application/json","href":"https://redoak.cs.toronto.edu/stac/"},{"rel":"self","type":"application/geo+json","href":"https://redoak.cs.toronto.edu/stac/collections/NEX-GDDP-CMIP6_UofT/items/tasmin_day_TaiESM1_ssp585_r1i1p1f1_gn_2100"}],"assets":{"ISO":{"href":"https://redoak.cs.toronto.edu/twitcher/ows/proxy/thredds/iso/datasets/NEX-GDDP-CMIP6/TaiESM1/ssp585/r1i1p1f1/tasmin/tasmin_day_TaiESM1_ssp585_r1i1p1f1_gn_2100.nc","type":"","roles":[]},"WCS":{"href":"https://redoak.cs.toronto.edu/twitcher/ows/proxy/thredds/wcs/datasets/NEX-GDDP-CMIP6/TaiESM1/ssp585/r1i1p1f1/tasmin/tasmin_day_TaiESM1_ssp585_r1i1p1f1_gn_2100.nc","type":"application/xml","roles":["data"]},"WMS":{"href":"https://redoak.cs.toronto.edu/twitcher/ows/proxy/thredds/wms/datasets/NEX-GDDP-CMIP6/TaiESM1/ssp585/r1i1p1f1/tasmin/tasmin_day_TaiESM1_ssp585_r1i1p1f1_gn_2100.nc","type":"application/xml","roles":["visual"]},"NcML":{"href":"https://redoak.cs.toronto.edu/twitcher/ows/proxy/thredds/ncml/datasets/NEX-GDDP-CMIP6/TaiESM1/ssp585/r1i1p1f1/tasmin/tasmin_day_TaiESM1_ssp585_r1i1p1f1_gn_2100.nc","type":"","roles":[]},"UDDC":{"href":"https://redoak.cs.toronto.edu/twitcher/ows/proxy/thredds/uddc/datasets/NEX-GDDP-CMIP6/TaiESM1/ssp585/r1i1p1f1/tasmin/tasmin_day_TaiESM1_ssp585_r1i1p1f1_gn_2100.nc","type":"","roles":[]},"OpenDAP":{"href":"https://redoak.cs.toronto.edu/twitcher/ows/proxy/thredds/dodsC/datasets/NEX-GDDP-CMIP6/TaiESM1/ssp585/r1i1p1f1/tasmin/tasmin_day_TaiESM1_ssp585_r1i1p1f1_gn_2100.nc","type":"text/html","roles":["data"]},"HTTPServer":{"href":"https://redoak.cs.toronto.edu/twitcher/ows/proxy/thredds/fileServer/datasets/NEX-GDDP-CMIP6/TaiESM1/ssp585/r1i1p1f1/tasmin/tasmin_day_TaiESM1_ssp585_r1i1p1f1_gn_2100.nc","type":"application/x-netcdf","roles":["data"]},"NetcdfSubset":{"href":"https://redoak.cs.toronto.edu/twitcher/ows/proxy/thredds/ncss/datasets/NEX-GDDP-CMIP6/TaiESM1/ssp585/r1i1p1f1/tasmin/tasmin_day_TaiESM1_ssp585_r1i1p1f1_gn_2100.nc","type":"application/x-netcdf","roles":["data"]}},"geometry":{"type":"Polygon","coordinates":[[[0.125,-59.875],[0.125,89.875],[359.875,89.875],[359.875,-59.875],[0.125,-59.875]]]},"collection":"NEX-GDDP-CMIP6_UofT","properties":{"end_datetime":"2100-12-31T12:00:00Z","cube:variables":{"tasmin":{"type":"data","unit":"K","dimensions":["time","lat","lon"],"description":"Daily Minimum Near-Surface Air Temperature"}},"start_datetime":"2100-01-01T12:00:00Z","cube:dimensions":{"lat":{"axis":"y","type":"spatial","extent":[-59.875,89.875],"description":"projection_y_coordinate"},"lon":{"axis":"x","type":"spatial","extent":[0.125,359.875],"description":"projection_x_coordinate"},"time":{"type":"temporal","extent":["2100-01-01T12:00:00Z","2100-12-31T12:00:00Z"],"description":"time"}},"marble:is_local":true,"nexgddp:license":"CC-BY-SA 4.0","nexgddp:version":"1.0","marble:host_node":"UofTRedOak","nexgddp:calendar":"365_day","nexgddp:frequency":"day","nexgddp:source_id":"TaiESM1","nexgddp:Conventions":"CF-1.7","nexgddp:institution":"NASA Earth Exchange, NASA Ames Research Center, Moffett Field, CA 94035","nexgddp:variable_id":"tasmin","nexgddp:cmip_version":"CMIP6","nexgddp:experiment_id":"ssp585","nexgddp:variant_label":"r1i1p1f1","nexgddp:institution_id":"AS-RCEC"},"stac_version":"1.0.0","stac_extensions":["https://raw.githubusercontent.com/DACCS-Climate/nexgddp-stac-extension/v1.0.0/json-schema/schema.json","https://stac-extensions.github.io/datacube/v2.2.0/schema.json","https://raw.githubusercontent.com/DACCS-Climate/marble-stac-extension/v1.0.0/json-schema/schema.json"]},{"id":"tasmin_day_TaiESM1_ssp370_r1i1p1f1_gn_2100","bbox":[0.125,-59.875,359.875,89.875],"type":"Feature","links":[{"rel":"collection","type":"application/json","href":"https://redoak.cs.toronto.edu/stac/collections/NEX-GDDP-CMIP6_UofT"},{"rel":"parent","type":"application/json","href":"https://redoak.cs.toronto.edu/stac/collections/NEX-GDDP-CMIP6_UofT"},{"rel":"root","type":"application/json","href":"https://redoak.cs.toronto.edu/stac/"},{"rel":"self","type":"application/geo+json","href":"https://redoak.cs.toronto.edu/stac/collections/NEX-GDDP-CMIP6_UofT/items/tasmin_day_TaiESM1_ssp370_r1i1p1f1_gn_2100"}],"assets":{"ISO":{"href":"https://redoak.cs.toronto.edu/twitcher/ows/proxy/thredds/iso/datasets/NEX-GDDP-CMIP6/TaiESM1/ssp370/r1i1p1f1/tasmin/tasmin_day_TaiESM1_ssp370_r1i1p1f1_gn_2100.nc","type":"","roles":[]},"WCS":{"href":"https://redoak.cs.toronto.edu/twitcher/ows/proxy/thredds/wcs/datasets/NEX-GDDP-CMIP6/TaiESM1/ssp370/r1i1p1f1/tasmin/tasmin_day_TaiESM1_ssp370_r1i1p1f1_gn_2100.nc","type":"application/xml","roles":["data"]},"WMS":{"href":"https://redoak.cs.toronto.edu/twitcher/ows/proxy/thredds/wms/datasets/NEX-GDDP-CMIP6/TaiESM1/ssp370/r1i1p1f1/tasmin/tasmin_day_TaiESM1_ssp370_r1i1p1f1_gn_2100.nc","type":"application/xml","roles":["visual"]},"NcML":{"href":"https://redoak.cs.toronto.edu/twitcher/ows/proxy/thredds/ncml/datasets/NEX-GDDP-CMIP6/TaiESM1/ssp370/r1i1p1f1/tasmin/tasmin_day_TaiESM1_ssp370_r1i1p1f1_gn_2100.nc","type":"","roles":[]},"UDDC":{"href":"https://redoak.cs.toronto.edu/twitcher/ows/proxy/thredds/uddc/datasets/NEX-GDDP-CMIP6/TaiESM1/ssp370/r1i1p1f1/tasmin/tasmin_day_TaiESM1_ssp370_r1i1p1f1_gn_2100.nc","type":"","roles":[]},"OpenDAP":{"href":"https://redoak.cs.toronto.edu/twitcher/ows/proxy/thredds/dodsC/datasets/NEX-GDDP-CMIP6/TaiESM1/ssp370/r1i1p1f1/tasmin/tasmin_day_TaiESM1_ssp370_r1i1p1f1_gn_2100.nc","type":"text/html","roles":["data"]},"HTTPServer":{"href":"https://redoak.cs.toronto.edu/twitcher/ows/proxy/thredds/fileServer/datasets/NEX-GDDP-CMIP6/TaiESM1/ssp370/r1i1p1f1/tasmin/tasmin_day_TaiESM1_ssp370_r1i1p1f1_gn_2100.nc","type":"application/x-netcdf","roles":["data"]},"NetcdfSubset":{"href":"https://redoak.cs.toronto.edu/twitcher/ows/proxy/thredds/ncss/datasets/NEX-GDDP-CMIP6/TaiESM1/ssp370/r1i1p1f1/tasmin/tasmin_day_TaiESM1_ssp370_r1i1p1f1_gn_2100.nc","type":"application/x-netcdf","roles":["data"]}},"geometry":{"type":"Polygon","coordinates":[[[0.125,-59.875],[0.125,89.875],[359.875,89.875],[359.875,-59.875],[0.125,-59.875]]]},"collection":"NEX-GDDP-CMIP6_UofT","properties":{"end_datetime":"2100-12-31T12:00:00Z","cube:variables":{"tasmin":{"type":"data","unit":"K","dimensions":["time","lat","lon"],"description":"Daily Minimum Near-Surface Air Temperature"}},"start_datetime":"2100-01-01T12:00:00Z","cube:dimensions":{"lat":{"axis":"y","type":"spatial","extent":[-59.875,89.875],"description":"projection_y_coordinate"},"lon":{"axis":"x","type":"spatial","extent":[0.125,359.875],"description":"projection_x_coordinate"},"time":{"type":"temporal","extent":["2100-01-01T12:00:00Z","2100-12-31T12:00:00Z"],"description":"time"}},"marble:is_local":true,"nexgddp:license":"CC-BY-SA 4.0","nexgddp:version":"1.0","marble:host_node":"UofTRedOak","nexgddp:calendar":"365_day","nexgddp:frequency":"day","nexgddp:source_id":"TaiESM1","nexgddp:Conventions":"CF-1.7","nexgddp:institution":"NASA Earth Exchange, NASA Ames Research Center, Moffett Field, CA 94035","nexgddp:variable_id":"tasmin","nexgddp:cmip_version":"CMIP6","nexgddp:experiment_id":"ssp370","nexgddp:variant_label":"r1i1p1f1","nexgddp:institution_id":"AS-RCEC"},"stac_version":"1.0.0","stac_extensions":["https://raw.githubusercontent.com/DACCS-Climate/nexgddp-stac-extension/v1.0.0/json-schema/schema.json","https://stac-extensions.github.io/datacube/v2.2.0/schema.json","https://raw.githubusercontent.com/DACCS-Climate/marble-stac-extension/v1.0.0/json-schema/schema.json"]},{"id":"tasmin_day_TaiESM1_ssp245_r1i1p1f1_gn_2100","bbox":[0.125,-59.875,359.875,89.875],"type":"Feature","links":[{"rel":"collection","type":"application/json","href":"https://redoak.cs.toronto.edu/stac/collections/NEX-GDDP-CMIP6_UofT"},{"rel":"parent","type":"application/json","href":"https://redoak.cs.toronto.edu/stac/collections/NEX-GDDP-CMIP6_UofT"},{"rel":"root","type":"application/json","href":"https://redoak.cs.toronto.edu/stac/"},{"rel":"self","type":"application/geo+json","href":"https://redoak.cs.toronto.edu/stac/collections/NEX-GDDP-CMIP6_UofT/items/tasmin_day_TaiESM1_ssp245_r1i1p1f1_gn_2100"}],"assets":{"ISO":{"href":"https://redoak.cs.toronto.edu/twitcher/ows/proxy/thredds/iso/datasets/NEX-GDDP-CMIP6/TaiESM1/ssp245/r1i1p1f1/tasmin/tasmin_day_TaiESM1_ssp245_r1i1p1f1_gn_2100.nc","type":"","roles":[]},"WCS":{"href":"https://redoak.cs.toronto.edu/twitcher/ows/proxy/thredds/wcs/datasets/NEX-GDDP-CMIP6/TaiESM1/ssp245/r1i1p1f1/tasmin/tasmin_day_TaiESM1_ssp245_r1i1p1f1_gn_2100.nc","type":"application/xml","roles":["data"]},"WMS":{"href":"https://redoak.cs.toronto.edu/twitcher/ows/proxy/thredds/wms/datasets/NEX-GDDP-CMIP6/TaiESM1/ssp245/r1i1p1f1/tasmin/tasmin_day_TaiESM1_ssp245_r1i1p1f1_gn_2100.nc","type":"application/xml","roles":["visual"]},"NcML":{"href":"https://redoak.cs.toronto.edu/twitcher/ows/proxy/thredds/ncml/datasets/NEX-GDDP-CMIP6/TaiESM1/ssp245/r1i1p1f1/tasmin/tasmin_day_TaiESM1_ssp245_r1i1p1f1_gn_2100.nc","type":"","roles":[]},"UDDC":{"href":"https://redoak.cs.toronto.edu/twitcher/ows/proxy/thredds/uddc/datasets/NEX-GDDP-CMIP6/TaiESM1/ssp245/r1i1p1f1/tasmin/tasmin_day_TaiESM1_ssp245_r1i1p1f1_gn_2100.nc","type":"","roles":[]},"OpenDAP":{"href":"https://redoak.cs.toronto.edu/twitcher/ows/proxy/thredds/dodsC/datasets/NEX-GDDP-CMIP6/TaiESM1/ssp245/r1i1p1f1/tasmin/tasmin_day_TaiESM1_ssp245_r1i1p1f1_gn_2100.nc","type":"text/html","roles":["data"]},"HTTPServer":{"href":"https://redoak.cs.toronto.edu/twitcher/ows/proxy/thredds/fileServer/datasets/NEX-GDDP-CMIP6/TaiESM1/ssp245/r1i1p1f1/tasmin/tasmin_day_TaiESM1_ssp245_r1i1p1f1_gn_2100.nc","type":"application/x-netcdf","roles":["data"]},"NetcdfSubset":{"href":"https://redoak.cs.toronto.edu/twitcher/ows/proxy/thredds/ncss/datasets/NEX-GDDP-CMIP6/TaiESM1/ssp245/r1i1p1f1/tasmin/tasmin_day_TaiESM1_ssp245_r1i1p1f1_gn_2100.nc","type":"application/x-netcdf","roles":["data"]}},"geometry":{"type":"Polygon","coordinates":[[[0.125,-59.875],[0.125,89.875],[359.875,89.875],[359.875,-59.875],[0.125,-59.875]]]},"collection":"NEX-GDDP-CMIP6_UofT","properties":{"end_datetime":"2100-12-31T12:00:00Z","cube:variables":{"tasmin":{"type":"data","unit":"K","dimensions":["time","lat","lon"],"description":"Daily Minimum Near-Surface Air Temperature"}},"start_datetime":"2100-01-01T12:00:00Z","cube:dimensions":{"lat":{"axis":"y","type":"spatial","extent":[-59.875,89.875],"description":"projection_y_coordinate"},"lon":{"axis":"x","type":"spatial","extent":[0.125,359.875],"description":"projection_x_coordinate"},"time":{"type":"temporal","extent":["2100-01-01T12:00:00Z","2100-12-31T12:00:00Z"],"description":"time"}},"marble:is_local":true,"nexgddp:license":"CC-BY-SA 4.0","nexgddp:version":"1.0","marble:host_node":"UofTRedOak","nexgddp:calendar":"365_day","nexgddp:frequency":"day","nexgddp:source_id":"TaiESM1","nexgddp:Conventions":"CF-1.7","nexgddp:institution":"NASA Earth Exchange, NASA Ames Research Center, Moffett Field, CA 94035","nexgddp:variable_id":"tasmin","nexgddp:cmip_version":"CMIP6","nexgddp:experiment_id":"ssp245","nexgddp:variant_label":"r1i1p1f1","nexgddp:institution_id":"AS-RCEC"},"stac_version":"1.0.0","stac_extensions":["https://raw.githubusercontent.com/DACCS-Climate/nexgddp-stac-extension/v1.0.0/json-schema/schema.json","https://stac-extensions.github.io/datacube/v2.2.0/schema.json","https://raw.githubusercontent.com/DACCS-Climate/marble-stac-extension/v1.0.0/json-schema/schema.json"]},{"id":"tasmin_day_TaiESM1_ssp126_r1i1p1f1_gn_2100","bbox":[0.125,-59.875,359.875,89.875],"type":"Feature","links":[{"rel":"collection","type":"application/json","href":"https://redoak.cs.toronto.edu/stac/collections/NEX-GDDP-CMIP6_UofT"},{"rel":"parent","type":"application/json","href":"https://redoak.cs.toronto.edu/stac/collections/NEX-GDDP-CMIP6_UofT"},{"rel":"root","type":"application/json","href":"https://redoak.cs.toronto.edu/stac/"},{"rel":"self","type":"application/geo+json","href":"https://redoak.cs.toronto.edu/stac/collections/NEX-GDDP-CMIP6_UofT/items/tasmin_day_TaiESM1_ssp126_r1i1p1f1_gn_2100"}],"assets":{"ISO":{"href":"https://redoak.cs.toronto.edu/twitcher/ows/proxy/thredds/iso/datasets/NEX-GDDP-CMIP6/TaiESM1/ssp126/r1i1p1f1/tasmin/tasmin_day_TaiESM1_ssp126_r1i1p1f1_gn_2100.nc","type":"","roles":[]},"WCS":{"href":"https://redoak.cs.toronto.edu/twitcher/ows/proxy/thredds/wcs/datasets/NEX-GDDP-CMIP6/TaiESM1/ssp126/r1i1p1f1/tasmin/tasmin_day_TaiESM1_ssp126_r1i1p1f1_gn_2100.nc","type":"application/xml","roles":["data"]},"WMS":{"href":"https://redoak.cs.toronto.edu/twitcher/ows/proxy/thredds/wms/datasets/NEX-GDDP-CMIP6/TaiESM1/ssp126/r1i1p1f1/tasmin/tasmin_day_TaiESM1_ssp126_r1i1p1f1_gn_2100.nc","type":"application/xml","roles":["visual"]},"NcML":{"href":"https://redoak.cs.toronto.edu/twitcher/ows/proxy/thredds/ncml/datasets/NEX-GDDP-CMIP6/TaiESM1/ssp126/r1i1p1f1/tasmin/tasmin_day_TaiESM1_ssp126_r1i1p1f1_gn_2100.nc","type":"","roles":[]},"UDDC":{"href":"https://redoak.cs.toronto.edu/twitcher/ows/proxy/thredds/uddc/datasets/NEX-GDDP-CMIP6/TaiESM1/ssp126/r1i1p1f1/tasmin/tasmin_day_TaiESM1_ssp126_r1i1p1f1_gn_2100.nc","type":"","roles":[]},"OpenDAP":{"href":"https://redoak.cs.toronto.edu/twitcher/ows/proxy/thredds/dodsC/datasets/NEX-GDDP-CMIP6/TaiESM1/ssp126/r1i1p1f1/tasmin/tasmin_day_TaiESM1_ssp126_r1i1p1f1_gn_2100.nc","type":"text/html","roles":["data"]},"HTTPServer":{"href":"https://redoak.cs.toronto.edu/twitcher/ows/proxy/thredds/fileServer/datasets/NEX-GDDP-CMIP6/TaiESM1/ssp126/r1i1p1f1/tasmin/tasmin_day_TaiESM1_ssp126_r1i1p1f1_gn_2100.nc","type":"application/x-netcdf","roles":["data"]},"NetcdfSubset":{"href":"https://redoak.cs.toronto.edu/twitcher/ows/proxy/thredds/ncss/datasets/NEX-GDDP-CMIP6/TaiESM1/ssp126/r1i1p1f1/tasmin/tasmin_day_TaiESM1_ssp126_r1i1p1f1_gn_2100.nc","type":"application/x-netcdf","roles":["data"]}},"geometry":{"type":"Polygon","coordinates":[[[0.125,-59.875],[0.125,89.875],[359.875,89.875],[359.875,-59.875],[0.125,-59.875]]]},"collection":"NEX-GDDP-CMIP6_UofT","properties":{"end_datetime":"2100-12-31T12:00:00Z","cube:variables":{"tasmin":{"type":"data","unit":"K","dimensions":["time","lat","lon"],"description":"Daily Minimum Near-Surface Air Temperature"}},"start_datetime":"2100-01-01T12:00:00Z","cube:dimensions":{"lat":{"axis":"y","type":"spatial","extent":[-59.875,89.875],"description":"projection_y_coordinate"},"lon":{"axis":"x","type":"spatial","extent":[0.125,359.875],"description":"projection_x_coordinate"},"time":{"type":"temporal","extent":["2100-01-01T12:00:00Z","2100-12-31T12:00:00Z"],"description":"time"}},"marble:is_local":true,"nexgddp:license":"CC-BY-SA 4.0","nexgddp:version":"1.0","marble:host_node":"UofTRedOak","nexgddp:calendar":"365_day","nexgddp:frequency":"day","nexgddp:source_id":"TaiESM1","nexgddp:Conventions":"CF-1.7","nexgddp:institution":"NASA Earth Exchange, NASA Ames Research Center, Moffett Field, CA 94035","nexgddp:variable_id":"tasmin","nexgddp:cmip_version":"CMIP6","nexgddp:experiment_id":"ssp126","nexgddp:variant_label":"r1i1p1f1","nexgddp:institution_id":"AS-RCEC"},"stac_version":"1.0.0","stac_extensions":["https://raw.githubusercontent.com/DACCS-Climate/nexgddp-stac-extension/v1.0.0/json-schema/schema.json","https://stac-extensions.github.io/datacube/v2.2.0/schema.json","https://raw.githubusercontent.com/DACCS-Climate/marble-stac-extension/v1.0.0/json-schema/schema.json"]},{"id":"tasmin_day_NorESM2-MM_ssp585_r1i1p1f1_gn_2100","bbox":[0.125,-59.875,359.875,89.875],"type":"Feature","links":[{"rel":"collection","type":"application/json","href":"https://redoak.cs.toronto.edu/stac/collections/NEX-GDDP-CMIP6_UofT"},{"rel":"parent","type":"application/json","href":"https://redoak.cs.toronto.edu/stac/collections/NEX-GDDP-CMIP6_UofT"},{"rel":"root","type":"application/json","href":"https://redoak.cs.toronto.edu/stac/"},{"rel":"self","type":"application/geo+json","href":"https://redoak.cs.toronto.edu/stac/collections/NEX-GDDP-CMIP6_UofT/items/tasmin_day_NorESM2-MM_ssp585_r1i1p1f1_gn_2100"}],"assets":{"ISO":{"href":"https://redoak.cs.toronto.edu/twitcher/ows/proxy/thredds/iso/datasets/NEX-GDDP-CMIP6/NorESM2-MM/ssp585/r1i1p1f1/tasmin/tasmin_day_NorESM2-MM_ssp585_r1i1p1f1_gn_2100.nc","type":"","roles":[]},"WCS":{"href":"https://redoak.cs.toronto.edu/twitcher/ows/proxy/thredds/wcs/datasets/NEX-GDDP-CMIP6/NorESM2-MM/ssp585/r1i1p1f1/tasmin/tasmin_day_NorESM2-MM_ssp585_r1i1p1f1_gn_2100.nc","type":"application/xml","roles":["data"]},"WMS":{"href":"https://redoak.cs.toronto.edu/twitcher/ows/proxy/thredds/wms/datasets/NEX-GDDP-CMIP6/NorESM2-MM/ssp585/r1i1p1f1/tasmin/tasmin_day_NorESM2-MM_ssp585_r1i1p1f1_gn_2100.nc","type":"application/xml","roles":["visual"]},"NcML":{"href":"https://redoak.cs.toronto.edu/twitcher/ows/proxy/thredds/ncml/datasets/NEX-GDDP-CMIP6/NorESM2-MM/ssp585/r1i1p1f1/tasmin/tasmin_day_NorESM2-MM_ssp585_r1i1p1f1_gn_2100.nc","type":"","roles":[]},"UDDC":{"href":"https://redoak.cs.toronto.edu/twitcher/ows/proxy/thredds/uddc/datasets/NEX-GDDP-CMIP6/NorESM2-MM/ssp585/r1i1p1f1/tasmin/tasmin_day_NorESM2-MM_ssp585_r1i1p1f1_gn_2100.nc","type":"","roles":[]},"OpenDAP":{"href":"https://redoak.cs.toronto.edu/twitcher/ows/proxy/thredds/dodsC/datasets/NEX-GDDP-CMIP6/NorESM2-MM/ssp585/r1i1p1f1/tasmin/tasmin_day_NorESM2-MM_ssp585_r1i1p1f1_gn_2100.nc","type":"text/html","roles":["data"]},"HTTPServer":{"href":"https://redoak.cs.toronto.edu/twitcher/ows/proxy/thredds/fileServer/datasets/NEX-GDDP-CMIP6/NorESM2-MM/ssp585/r1i1p1f1/tasmin/tasmin_day_NorESM2-MM_ssp585_r1i1p1f1_gn_2100.nc","type":"application/x-netcdf","roles":["data"]},"NetcdfSubset":{"href":"https://redoak.cs.toronto.edu/twitcher/ows/proxy/thredds/ncss/datasets/NEX-GDDP-CMIP6/NorESM2-MM/ssp585/r1i1p1f1/tasmin/tasmin_day_NorESM2-MM_ssp585_r1i1p1f1_gn_2100.nc","type":"application/x-netcdf","roles":["data"]}},"geometry":{"type":"Polygon","coordinates":[[[0.125,-59.875],[0.125,89.875],[359.875,89.875],[359.875,-59.875],[0.125,-59.875]]]},"collection":"NEX-GDDP-CMIP6_UofT","properties":{"end_datetime":"2100-12-31T12:00:00Z","cube:variables":{"tasmin":{"type":"data","unit":"K","dimensions":["time","lat","lon"],"description":"Daily Minimum Near-Surface Air Temperature"}},"start_datetime":"2100-01-01T12:00:00Z","cube:dimensions":{"lat":{"axis":"y","type":"spatial","extent":[-59.875,89.875],"description":"projection_y_coordinate"},"lon":{"axis":"x","type":"spatial","extent":[0.125,359.875],"description":"projection_x_coordinate"},"time":{"type":"temporal","extent":["2100-01-01T12:00:00Z","2100-12-31T12:00:00Z"],"description":"time"}},"marble:is_local":true,"nexgddp:license":"CC-BY-SA 4.0","nexgddp:version":"1.0","marble:host_node":"UofTRedOak","nexgddp:calendar":"365_day","nexgddp:frequency":"day","nexgddp:source_id":"NorESM2-MM","nexgddp:Conventions":"CF-1.7","nexgddp:institution":"NASA Earth Exchange, NASA Ames Research Center, Moffett Field, CA 94035","nexgddp:variable_id":"tasmin","nexgddp:cmip_version":"CMIP6","nexgddp:experiment_id":"ssp585","nexgddp:variant_label":"r1i1p1f1","nexgddp:institution_id":"NCC"},"stac_version":"1.0.0","stac_extensions":["https://raw.githubusercontent.com/DACCS-Climate/nexgddp-stac-extension/v1.0.0/json-schema/schema.json","https://stac-extensions.github.io/datacube/v2.2.0/schema.json","https://raw.githubusercontent.com/DACCS-Climate/marble-stac-extension/v1.0.0/json-schema/schema.json"]},{"id":"tasmin_day_NorESM2-MM_ssp370_r1i1p1f1_gn_2100","bbox":[0.125,-59.875,359.875,89.875],"type":"Feature","links":[{"rel":"collection","type":"application/json","href":"https://redoak.cs.toronto.edu/stac/collections/NEX-GDDP-CMIP6_UofT"},{"rel":"parent","type":"application/json","href":"https://redoak.cs.toronto.edu/stac/collections/NEX-GDDP-CMIP6_UofT"},{"rel":"root","type":"application/json","href":"https://redoak.cs.toronto.edu/stac/"},{"rel":"self","type":"application/geo+json","href":"https://redoak.cs.toronto.edu/stac/collections/NEX-GDDP-CMIP6_UofT/items/tasmin_day_NorESM2-MM_ssp370_r1i1p1f1_gn_2100"}],"assets":{"ISO":{"href":"https://redoak.cs.toronto.edu/twitcher/ows/proxy/thredds/iso/datasets/NEX-GDDP-CMIP6/NorESM2-MM/ssp370/r1i1p1f1/tasmin/tasmin_day_NorESM2-MM_ssp370_r1i1p1f1_gn_2100.nc","type":"","roles":[]},"WCS":{"href":"https://redoak.cs.toronto.edu/twitcher/ows/proxy/thredds/wcs/datasets/NEX-GDDP-CMIP6/NorESM2-MM/ssp370/r1i1p1f1/tasmin/tasmin_day_NorESM2-MM_ssp370_r1i1p1f1_gn_2100.nc","type":"application/xml","roles":["data"]},"WMS":{"href":"https://redoak.cs.toronto.edu/twitcher/ows/proxy/thredds/wms/datasets/NEX-GDDP-CMIP6/NorESM2-MM/ssp370/r1i1p1f1/tasmin/tasmin_day_NorESM2-MM_ssp370_r1i1p1f1_gn_2100.nc","type":"application/xml","roles":["visual"]},"NcML":{"href":"https://redoak.cs.toronto.edu/twitcher/ows/proxy/thredds/ncml/datasets/NEX-GDDP-CMIP6/NorESM2-MM/ssp370/r1i1p1f1/tasmin/tasmin_day_NorESM2-MM_ssp370_r1i1p1f1_gn_2100.nc","type":"","roles":[]},"UDDC":{"href":"https://redoak.cs.toronto.edu/twitcher/ows/proxy/thredds/uddc/datasets/NEX-GDDP-CMIP6/NorESM2-MM/ssp370/r1i1p1f1/tasmin/tasmin_day_NorESM2-MM_ssp370_r1i1p1f1_gn_2100.nc","type":"","roles":[]},"OpenDAP":{"href":"https://redoak.cs.toronto.edu/twitcher/ows/proxy/thredds/dodsC/datasets/NEX-GDDP-CMIP6/NorESM2-MM/ssp370/r1i1p1f1/tasmin/tasmin_day_NorESM2-MM_ssp370_r1i1p1f1_gn_2100.nc","type":"text/html","roles":["data"]},"HTTPServer":{"href":"https://redoak.cs.toronto.edu/twitcher/ows/proxy/thredds/fileServer/datasets/NEX-GDDP-CMIP6/NorESM2-MM/ssp370/r1i1p1f1/tasmin/tasmin_day_NorESM2-MM_ssp370_r1i1p1f1_gn_2100.nc","type":"application/x-netcdf","roles":["data"]},"NetcdfSubset":{"href":"https://redoak.cs.toronto.edu/twitcher/ows/proxy/thredds/ncss/datasets/NEX-GDDP-CMIP6/NorESM2-MM/ssp370/r1i1p1f1/tasmin/tasmin_day_NorESM2-MM_ssp370_r1i1p1f1_gn_2100.nc","type":"application/x-netcdf","roles":["data"]}},"geometry":{"type":"Polygon","coordinates":[[[0.125,-59.875],[0.125,89.875],[359.875,89.875],[359.875,-59.875],[0.125,-59.875]]]},"collection":"NEX-GDDP-CMIP6_UofT","properties":{"end_datetime":"2100-12-31T12:00:00Z","cube:variables":{"tasmin":{"type":"data","unit":"K","dimensions":["time","lat","lon"],"description":"Daily Minimum Near-Surface Air Temperature"}},"start_datetime":"2100-01-01T12:00:00Z","cube:dimensions":{"lat":{"axis":"y","type":"spatial","extent":[-59.875,89.875],"description":"projection_y_coordinate"},"lon":{"axis":"x","type":"spatial","extent":[0.125,359.875],"description":"projection_x_coordinate"},"time":{"type":"temporal","extent":["2100-01-01T12:00:00Z","2100-12-31T12:00:00Z"],"description":"time"}},"marble:is_local":true,"nexgddp:license":"CC-BY-SA 4.0","nexgddp:version":"1.0","marble:host_node":"UofTRedOak","nexgddp:calendar":"365_day","nexgddp:frequency":"day","nexgddp:source_id":"NorESM2-MM","nexgddp:Conventions":"CF-1.7","nexgddp:institution":"NASA Earth Exchange, NASA Ames Research Center, Moffett Field, CA 94035","nexgddp:variable_id":"tasmin","nexgddp:cmip_version":"CMIP6","nexgddp:experiment_id":"ssp370","nexgddp:variant_label":"r1i1p1f1","nexgddp:institution_id":"NCC"},"stac_version":"1.0.0","stac_extensions":["https://raw.githubusercontent.com/DACCS-Climate/nexgddp-stac-extension/v1.0.0/json-schema/schema.json","https://stac-extensions.github.io/datacube/v2.2.0/schema.json","https://raw.githubusercontent.com/DACCS-Climate/marble-stac-extension/v1.0.0/json-schema/schema.json"]}],"links":[{"rel":"next","type":"application/geo+json","method":"GET","href":"https://redoak.cs.toronto.edu/stac/search?token=next:tasmin_day_NorESM2-MM_ssp370_r1i1p1f1_gn_2100"},{"rel":"root","type":"application/json","href":"https://redoak.cs.toronto.edu/stac/"},{"rel":"self","type":"application/json","href":"https://redoak.cs.toronto.edu/stac/search"}]}';

    var testJSON = JSON.parse(testJSONString);

    return testJSON;
}

