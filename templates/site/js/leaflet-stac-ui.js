
document.addEventListener("DOMContentLoaded", function (){
    var newMap = createMap("Toronto");

    var pointTextInput = document.getElementById("inputPointLatLng");

    pointTextInput.addEventListener('keydown', function(event){
        if(event.key == "Enter"){
            addPoint("inputPointLatLng", newMap);
        }
    });

    //Adds drawing menu
    //createDrawMenu(newMap);

    //Uploads geoJSON pasted into textarea
    var uploadGeoJSONButton = document.getElementById("uploadGeoJSON");
    uploadGeoJSONButton.addEventListener("click", function(){
        uploadGeoJSON(newMap);
    });


    //Adds search box to map
    //addSearch(newMap);
/*
    var getLayersButton = document.getElementById("layerButton");
    getLayersButton.addEventListener("click", function(){
        getLayers(newMap);
    });*/

})


