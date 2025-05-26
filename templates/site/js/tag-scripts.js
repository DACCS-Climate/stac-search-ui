var keywordList = {};

function addKeywordTag(keyword){
    var searchKeywordTagContainerDiv = document.getElementById("searchKeywordTagContainer");

    var keywordContainerID = keyword.replaceAll(" ", "") + "Tag";

    keywordList[keywordContainerID] = keyword;

    searchKeywordTagContainerDiv.appendChild(keywordTagTemplate(keywordContainerID, keyword));


}

function removeKeywordTag(keywordTagID){
    var searchKeywordTagContainerDiv = document.getElementById("searchKeywordTagContainer");
    var keywordTag = document.getElementById(keywordTagID);

    searchKeywordTagContainerDiv.removeChild(keywordTag);

}

function buildKeywordFilter(){
    var searchKeywordTagContainerDiv = document.getElementById("searchKeywordTagContainer");


    Object.entries(keywordList).forEach( ([key, value]) => {
        var keywordFilter
    })
}


function keywordTagTemplate(keywordTagID, keyword){
    var keywordCloseButtonID = "keyword" + keyword + "Close";

    var keywordTagContainer = document.createElement("div");
    var keywordTagText = document.createElement("p");
    var keywordCloseButtonContainer = document.createElement("div");
    var keywordCloseButton = document.getElementById("keywordCloseButtonID");

    keywordTagContainer.id = keywordTagID;
    keywordTagContainer.classList.add("keyword-tag-container");
    keywordCloseButtonContainer.classList.add("popup-button-close");
    keywordTagText.classList.add("subtitle-2");

    keywordTagText.innerText = keyword;
    keywordCloseButtonContainer.innerHTML = `{% with button_type = "close_button_x"%} {% set button_id = ` + keywordCloseButtonID + `%} {% include "partials/button.html" %}{% endwith %}`;

    keywordCloseButton.addEventListener('click', function(){
       removeKeywordTag(keywordTagID);
    });
    
    

    keywordTagContainer.appendChild(keywordTagText);
    keywordTagContainer.appendChild(keywordCloseButtonContainer);

    return keywordTagContainer;
}