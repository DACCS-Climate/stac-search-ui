document.addEventListener("DOMContentLoaded", function (){
    var newMap = createMap("Toronto");

    //Keep in case coordinate point input field gets put back outside of map
/*
    var pointTextInput = document.getElementById("inputPointLatLng");

    pointTextInput.addEventListener('keydown', function(event){
        if(event.key == "Enter"){
            addCoordinate("inputPointLatLng", newMap);
        }
    });*/


    //Uploads geoJSON pasted into textarea
    var uploadGeoJSONButton = document.getElementById("uploadGeoJSON");
    uploadGeoJSONButton.addEventListener("click", function(){
        uploadGeoJSON(newMap);
    });
})


