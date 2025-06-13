document.addEventListener("DOMContentLoaded", function (){
    setModal("modalLeafletMap", ["showLocationMap"], ["modalMapClose"]);

    /*Create Leaflet map instance when clicking Location button*/
    var showLocationMapButton = document.getElementById("showLocationMap");

    showLocationMapButton.addEventListener('click', function(){
        var mapModalInstance = instantiateMap("modalMap");
        createMap(mapModalInstance, true);
    });

    /*Create Leaflet map instance for dataset details*/
    var mapInstance = instantiateMap("datasetMapContainer");
    createMap(mapInstance, false);
})


