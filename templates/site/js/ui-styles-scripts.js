//Used in production to get STAC version and put it in the title of the Source dropdown panel
function populateStacVersion(elementID){
    var titleStacVersionDiv = document.getElementById(elementID);

    getStacVersion().then(json => {
        titleStacVersionDiv.innerHTML = json.stac_version;

     });
}

async function getStacVersion(){
    const servicesURLFragment = "/stac";

    const response = await fetch(servicesURLFragment, {
        method: "GET",
        headers: {
            "Accept": "application/json, text/plain",
            "Content-Type": "application/json"
        }
    });
    return await response.json();
}

function setPlaceholderText(element, text){
    element.setAttribute("placeholder", text);
}

function setTextboxBackground(element){
    if(element.classList.contains("input-number-small-background")){
        element.classList.remove("input-number-small-background");
    }

    if(element.value.length > 0){
        element.classList.add("input-number-small-background");
    }
}

