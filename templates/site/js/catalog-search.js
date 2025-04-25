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
    var searchJSONDisplay = document.getElementById("mySearchFilters");
    var searchJSON = {
     "properties": {
         [queryableItemKeyType]: queryableItemKeyValue
     }
    };

    var displayJSON = JSON.stringify(searchJSON);
    searchJSONDisplay.innerText = displayJSON;
}

//TODO Delete filterSTACSearchResults() or change function to add keyword tags to the My Search area
function filterSTACSearchResults(){
    var productionURL = "{{ stac_catalog_url }}/search";
    var testingURL = "https://infomatics-dcs.cs.toronto.edu/stac/search";
    //var searchJSON = JSON.parse(document.getElementById("mySearchFilters").innerText);

    var filterJSON = {
  "filter": {
    "op" : "and",
    "args": [
      {
        "op": "=",
        "args": [ { "property": "id" }, "LC08_L1TP_060247_20180905_20180912_01_T1_L1TP" ]
      },
      {
        "op": "=",
        "args" : [ { "property": "collection" }, "landsat8_l1tp" ]
      }
    ]
  }
}

    var testSearch = '{"type":"FeatureCollection","features":[{"properties":{"enum":"Surface Air Pressure "}}]}';
    var testSearch = '{"properties":{"enum":"Surface Temperature"}}';

    fetch(testingURL, {
        headers:{
            "Content-Type":"application/json"
        },

        method: "POST",
        body: testSearch
    }).then(response => response.json()).then( json => {
        //Keep console log for testing filter functions
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
    var searchResultDiv = document.getElementById("searchResults");
    if(searchResultDiv.innerHTML != "")
    {
        searchResultDiv.innerHTML = "";
    }
    //TODO Uncomment for production

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


    Object.entries(json.features).forEach( ([featureKey, featureValue]) => {
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

              cellStartDateTimeValue.innerText = new Date(featureValue.properties.start_datetime);
              rowSearchResult.appendChild(cellStartDateTimeValue);
        }

        if(featureValue.properties.end_datetime){
              var cellEndDateTimeValue = document.createElement("td");

              cellEndDateTimeValue.innerText = new Date(featureValue.properties.end_datetime);
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


    //TODO Remove testing code for production
    //Testing Code Below
    /*

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
            //Keep these console statements until search results section done
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

    })*/


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
    //var metadataHeader = datasetDetailsHeaderTemplate("Metadata");
    var metadataBody = document.createElement("div");

    //datasetMetadataContainer.appendChild(metadataHeader);
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
        //TODO Change testingURL to productionURL for production
        stacSearchURL = productionURL;
    }

    if(!(stacSearchURL.includes("sortby"))){
        queryParams = new URLSearchParams({sortby: "+id"}).toString();
        stacSearchURL = stacSearchURL + decodeURIComponent(queryParams);
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
    var searchFilterCategories = ["Datasets", "Location", "Sub-Categories", "Time Frame", "Format"];
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
    var productionURL = "{{ stac_catalog_url }}/search";
    var stacSearchURL = productionURL;
    var argumentArray = [];
    var filterJSON = {"filter":{"op":"or","args":[]}};
    var fullFilterHiddenContainer = document.getElementById("fullFilterStringContainer");
    var datasetFilterHiddenContainer = document.getElementById("searchFilterDatasetsHidden");
    var timeframeFilterHiddenContainer = document.getElementById("searchFilterTimeFrameHidden");
    var datasetFilter = JSON.parse(datasetFilterHiddenContainer.innerText);
    var timeframeFilter = JSON.parse(timeframeFilterHiddenContainer.innerText);



    for(datasetItem of datasetFilter){
        filterJSON["filter"].args.push(datasetItem);
    }

    for(timeframeItem of timeframeFilter){
        filterJSON["filter"].args.push(timeframeItem);
    }

    console.log(filterJSON);
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