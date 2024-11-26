
document.addEventListener("DOMContentLoaded", function (){
    var map = createMap("Toronto");

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
//layeradd

    //Adds drawing menu
    createDrawMenu(map);

    //Uploads geoJSON pasted into textarea
    var uploadGeoJSONButton = document.getElementById("uploadGeoJSON");
    uploadGeoJSONButton.addEventListener("click", function(){
        uploadGeoJSON(map);
    });


    //Adds search box to map
    addSearch(map);

    var getLayersButton = document.getElementById("layerButton");
    getLayersButton.addEventListener("click", function(){
        getLayers(map);
    });

})


