async function getWordlist() {
    const resp = await fetch("{{ stac_catalog_url }}/collections")
    const json = await resp.json()
    const collection_ids = json.collections.map(collection => collection.id)
    return await Promise.all(collection_ids.map(async (id) => {
        const resp_1 = await fetch(`{{ stac_catalog_url }}/collections/${id}/queryables`)
        const json_1 = await resp_1.json()
        return Object.entries(json_1.properties).map(([key, val]) => {
            val["key"] = key
            return val
        })
    })).then(queryables => queryables.flat())
}

let fuse = null;

function makeFuse() {
    getWordlist().then(queryables => {
        fuse = new Fuse(queryables, {
            keys: ["title", "key", "enum"],
            threshold: 0.2, // TODO: experiment with threshold and distance values to get best results
            distance: 10,
            includeMatches: true
        });
        console.log("search is ready") // TODO: replace this with some proper message to the user
    })
}

makeFuse()

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

    inputBox.setAttribute("aria-expanded", "true");

    if (fuse !== null) {

        queryablesArray = fuse.search(inputBox.value).map(obj => obj.matches.map(match => match.value).flat()).flat();
        
        queryablesArray.forEach((item,key) =>{
            var queryResultListItem = document.createElement("li");
            queryableResultButton = document.createElement('a');
            queryableResultButton.setAttribute('role', 'button');
            queryableResultButton.id = item.toLowerCase() + key ;
            queryableResultButton.innerText = item;

            queryableResultButton.addEventListener('click', function(event){
                collapseSearchResults(inputBox, event.target.id);
            })

            queryResultListItem.appendChild(queryableResultButton);
            queryResultList.appendChild(queryResultListItem);

        })
    }
}

function collapseSearchResults(inputBox, buttonID){
    var listButton = document.getElementById(buttonID);
    inputBox.setAttribute("aria-expanded", "false");
    inputBox.value = listButton.innerText;
}
