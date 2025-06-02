var keywordList = {};

function addKeywordTag(keyword, stacKey, queryableValue){
    var searchKeywordTagContainerDiv = document.getElementById("searchKeywordTagContainer");

    if(keyword != "" || keyword!= null) {
        var keywordContainerID = keyword.replaceAll(" ", "") + "_Tag";
        var keywordTag = keywordTagTemplate(keywordContainerID, keyword, stacKey, queryableValue);

        keywordList[keywordContainerID] = {"keyword":keyword, "stacKey": stacKey};
        searchKeywordTagContainerDiv.appendChild(keywordTag);
        buildKeywordFilter();
    }
}

function removeKeywordTag(keywordTagID){
    var searchKeywordTagContainerDiv = document.getElementById("searchKeywordTagContainer");
    var keywordTag = document.getElementById(keywordTagID);

    searchKeywordTagContainerDiv.removeChild(keywordTag);
    delete keywordList[keywordTagID];

    buildKeywordFilter();
}

function buildKeywordFilter(){
    var searchFilterKeywordHiddenDiv = document.getElementById("searchFilterKeywordHidden");
    var keywordFilter = {"op":"or", "args": []};

    Object.entries(keywordList).forEach( ([key, value]) => {
        var tagFilter = {"op":"=", "args":[{"property": value.stacKey}, value.keyword]};
        keywordFilter.args.push(tagFilter);
    });
    searchFilterKeywordHiddenDiv.innerText = JSON.stringify(keywordFilter);
}


function keywordTagTemplate(keywordTagID, keyword, stacKey, queryableValue) {
    if(keyword != '') {
        var keywordCloseButtonID = "keyword" + keyword + "Close";

        var closeButtonLink = document.createElement("a");
        var closeButtonTag = document.createElement("button");
        var closeButtonIcon = document.createElement("i");

        closeButtonTag.id = keywordCloseButtonID;
        closeButtonTag.classList.add("button-close-x", "button-close-x-tag-colour", "button-close-x-tag-size");
        closeButtonIcon.classList.add("fa-solid", "fa-xmark");

        closeButtonTag.appendChild(closeButtonIcon);
        closeButtonLink.appendChild(closeButtonTag);

        var keywordTagContainer = document.createElement("div");
        var keywordTagText = document.createElement("p");
        var keywordCloseButtonContainer = document.createElement("div");


        keywordTagContainer.id = keywordTagID;
        keywordTagContainer.setAttribute('queryablekeystac', stacKey);
        keywordTagContainer.setAttribute('queryablekeyvalue', queryableValue);
        keywordTagContainer.classList.add("div-keyword-tag-container");
        keywordTagText.classList.add("subtitle-2", "margin-unset");

        keywordTagText.innerText = keyword;
        keywordCloseButtonContainer.appendChild(keywordTagText);
        keywordCloseButtonContainer.appendChild(closeButtonLink);


        closeButtonTag.addEventListener('click', function () {
            removeKeywordTag(keywordTagID);
        });

        keywordTagContainer.appendChild(keywordTagText);
        keywordTagContainer.appendChild(keywordCloseButtonContainer);

        return keywordTagContainer;

    }
}