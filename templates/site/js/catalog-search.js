function getCollection(){
    var dropdownDefault = document.getElementById("dropdownListDefaultContainer");
    var checkboxes = dropdownDefault.querySelectorAll('li.dropdown-default-list-item label.checkbox-container input');
    return checkboxes;
}

function findNode(currentNode, nestedNodesArray) {
    var currentChild;
    var nodeLength;

    if (Object.keys(currentNode).includes("type") && currentNode["type"] != "object") {
        nestedNodesArray.push(currentNode);
    } else {

        if (Array.isArray(currentNode)) {
            nodeLength = currentNode.length;
        } else {
            nodeLength = Object.keys(currentNode).length;
        }


        for (var i = 0; i < nodeLength; i += 1) {
            if (typeof currentNode[Object.keys(currentNode)[i]] != "string") {
                currentChild = currentNode[Object.keys(currentNode)[i]];
                findNode(currentChild, nestedNodesArray);
            }
        }
        return nestedNodesArray;
    }
}

async function getWordlist() {
//TODO Keep commented code for now until dropdown is built with collection ID as checkbox value
    /*
    var checkboxList = getCollection();
    var fetchURLArray = [];
    var fetchURL;


    checkboxList.forEach((checkbox) => {
        console.log(checkbox);
       if(checkbox.id != "allCheckbox" && checkbox.checked){
            fetchURLArray.push(`{{ stac_catalog_url }}/collections/${checkbox.value}/queryables`)
            //.then(queryables => queryables.flat())
       }

    });
    fetchURLArray.forEach(url => {
        console.log(url);
        fetch(url).then(response => response.json()).then(json => {
            return Object.entries(json_1.properties).map(([key, val]) => {
                val["key"] = key
                return val
            })
        })
    })
    */



    var returnedNodeArray;
    const resp = await fetch("{{ stac_catalog_url }}/queryables")
    const json = await resp.json()

    //const collection_ids = json.collections.map(collection => collection.id)

    return Object.entries(json.properties).map(([key, val]) => {

        if(json.properties[key].hasOwnProperty("anyOf")){

           json.properties[key]["anyOf"].forEach( (anyOfObject) => {
            var nestedNodesArray = [];
            returnedNodeArray = findNode(anyOfObject, nestedNodesArray);
            console.log(returnedNodeArray);
            val["anyOf"] = returnedNodeArray;
            //TODO Keep these console logs for now
            console.log(key);
            console.log(val);
           })

        }


            val["key"] = key
            return val
        })

    //return json;

//TODO Keep as reference
    /*
    return await  {
        //const resp_1 = await fetch(`{{ stac_catalog_url }}/collections/${id}/queryables`)
        //const json_1 = await resp_1.json()
        return Object.entries(json.properties).map(([key, val]) => {
            val["key"] = key
            return val
        })
    }.then(queryables => queryables.flat())

*/
    /*
    return await Promise.all(collection_ids.map(async (id) => {

    })).then(queryables => queryables.flat())
    */
}

let fuse = null;

function makeFuse(inputBox) {
    getWordlist().then(queryables => {
        fuse = new Fuse(queryables, {
            keys: ["title", "key", "enum", "anyOf", "description"],
            threshold: 0.2, // TODO: experiment with threshold and distance values to get best results
            distance: 100,
            includeMatches: true,
            includeScore: true
        });
        removeDefaultSearchAttributes(inputBox);
    })
}

const wordOutput = document.getElementById("suggestedWordOutput");

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
            console.log(queryablesArray);
            if(queryablesArray.length > 0){

                queryablesArray.forEach((queryableItem, queryableKey) => {
                //console.log(queryableItem);
                    if(queryableItem.matches.length > 0)
                    {
                        queryableItem.matches.forEach((matchItem, matchKey) => {
                            var queryResultListItem = document.createElement("li");
                            var listItemFont = document.createElement("h5");
                            listItemFont.classList.add("margin-unset");

                            queryableResultButton = document.createElement('a');
                            queryableResultButton.innerText = matchItem.value;
                            queryableResultButton.setAttribute('role', 'button');
                            queryableResultButton.setAttribute('queryablekeytype', matchItem.key);
                            queryableResultButton.setAttribute('queryablekeyvalue', queryableItem.item.key);
                            queryableResultButton.id = "match" + matchKey;

                            queryableResultButton.addEventListener('click', function (event) {
                                selectSearchResults(inputBox, event.target.id);
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

//TODO get the focus onto the first list item when search input box detects arrowdown
function focusOnResults(){

    const resultList = document.getElementById("suggestedWordOutputList");

    var resultLinkArray = resultList.querySelectorAll('li h5 a')
    //console.log(resultLinkArray);
    //if(keyPressed === "ArrowDown"){
        var firstLink = document.getElementById(resultLinkArray[0].id)
        //console.log(firstLink);
        firstLink.focus();
    //}
}

//TODO Switch focus to next list item when list item, or anchor tag, detects arrowdown