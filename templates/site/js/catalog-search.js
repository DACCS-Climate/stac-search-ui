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
/*
    var searchJSON = {
        "type": "FeatureCollection",
        "features": [
            {
                "properties": {
                    [queryableItemKeyType]: queryableItemKeyValue
                }
            }
        ]

    };*/
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



function makeSearchResultTitle(jsonProperties, tableHeader){

    var tableTitleFormatCell = document.createElement("td");
    tableTitleFormatCell.innerText = "Format";

    var tableTitleDatasetCell = document.createElement("td");
    tableTitleDatasetCell.innerText = "Dataset ID";

    var tableTitleDatatimeCell = document.createElement("td");
    tableTitleDatatimeCell.innerText = "Datetime";

    tableHeader.appendChild(tableTitleDatasetCell);
    tableHeader.appendChild(tableTitleDatatimeCell);
    tableHeader.appendChild(tableTitleFormatCell);
}


function populateSearchResults(json){
    var searchResultDiv = document.getElementById("searchResults");
    var searchResultTable = document.createElement("table");
    var tableHeader = document.createElement("thead");
    var tableBody = document.createElement("tbody");

    if(searchResultDiv.innerHTML != "")
    {
        searchResultDiv.innerHTML = "";
    }

    makeSearchResultTitle(json.features[0].properties, tableHeader);

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
            linkDatasetTitle.onclick = function(){
                swapDatasetDetails();
                populateDatasetDetails(featureValue);
            };

            //if(assetKey == "metadata_http"){
            //linkDatasetTitle.setAttribute("href", assetValue.href);
            datasetTitleArray = featureValue.assets.metadata_http.title.split(".");
            linkDatasetTitle.innerText = datasetTitleArray[0];

            cellDatasetTitle.appendChild(linkDatasetTitle);

            rowSearchResult.appendChild(cellDatasetTitle);
            //}
        }

        /*
        Object.entries(featureValue.assets).forEach( ([assetKey, assetValue]) => {
            var cellDatasetTitle = document.createElement("td");
            var linkDatasetTitle = document.createElement("a");
            var datasetTitleArray;

            if(assetKey == "metadata_http"){
            //linkDatasetTitle.setAttribute("href", assetValue.href);
            datasetTitleArray = assetValue.title.split(".");
            linkDatasetTitle.innerText = datasetTitleArray[0];

            cellDatasetTitle.appendChild(linkDatasetTitle);

            rowSearchResult.appendChild(cellDatasetTitle);
            }

        })*/


        if(featureValue.properties.datetime){
              var cellPropertyValue = document.createElement("td");


                cellPropertyValue.innerText = featureValue.properties.datetime;
                rowSearchResult.appendChild(cellPropertyValue);
                //cellPropertyValue.appendChild(collectionAnchor);
        }
        /*
        Object.entries(featureValue.properties).forEach(([propertyKey, propertyValue]) => {


            if (propertyKey == "datetime") {
                var cellPropertyValue = document.createElement("td");


                cellPropertyValue.innerText = propertyValue;
                rowSearchResult.appendChild(cellPropertyValue);
                //cellPropertyValue.appendChild(collectionAnchor);
            }
        })*/



        /*Add Format*/
        Object.entries(featureValue.assets).forEach( ([assetKey, assetValue]) => {

            var assetSpan = document.createElement("span");
            var assetTypeArray = assetValue.type.split('/');
            var assetType = assetTypeArray[1];

            assetSpan.innerText = assetType;
            cellFormat.appendChild(assetSpan);

        })
        rowSearchResult.appendChild(cellFormat);

        console.log(featureKey);
        console.log(featureValue);


    })

}


function hideDetails(){
    var datasetDetailsContainer = document.getElementById("datasetDetails");
    datasetDetailsContainer.classList.add("display-none");
}

function swapDatasetDetails(){
    var searchResultContainer = document.getElementById("searchResults");
    var datasetDetailsContainer = document.getElementById("datasetDetails");

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
}


function populateDatasetDetails(features){
    var datasetName = document.getElementById("datasetName");
    var metadataDetails = document.getElementById("datasetMetadataContainer");
    console.log("dataset features");
    console.log(features);
    Object.entries(features).forEach(([featureKey, featureValue]) => {
        if(featureKey == "assets"){
            Object.entries(featureValue).forEach(([assetKey, assetValue]) => {
                if(assetKey == "metadata_http") {
                    var datasetTitle = document.createElement("h4");
                    var titleArray = assetValue.title.split(".");
                    datasetTitle.innerText = titleArray[0];
                    datasetName.appendChild(datasetTitle);
                }
            })
        }


        if(featureKey == "properties"){
            var metadataTable = document.createElement("table");

            Object.entries(featureValue).forEach(([propertyKey, propertyValue]) => {
                var metadataTableRow = document.createElement("tr");
                if(propertyKey == "variable_id") {
                    var metadataTitleCell = document.createElement("td");
                    var metadataNameCell = document.createElement("td");
                    var metadataTitle = document.createElement("p");
                    var metadataName = document.createElement("p");

                    metadataTitle.classList.add("subtitle-1");
                    metadataName.classList.add("body-1");

                    metadataTitle.innerText = propertyKey;
                    metadataName.innerText = propertyValue;

                    metadataTitleCell.appendChild(metadataTitle);
                    metadataNameCell.appendChild(metadataName);
                    metadataTableRow.appendChild(metadataTitleCell);
                    metadataTableRow.appendChild(metadataNameCell);
                }
                metadataTable.appendChild(metadataTableRow);

            })
            metadataDetails.appendChild(metadataTable);
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