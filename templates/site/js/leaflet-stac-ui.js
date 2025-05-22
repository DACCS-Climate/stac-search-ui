document.addEventListener("DOMContentLoaded", function (){

    var showLocationMapButton = document.getElementById("showLocationMap");

    showLocationMapButton.addEventListener('click', function(){
        var mapModal = document.getElementById("modalLeafletMap");
        mapModal.showModal();

        var mapModalInstance = instantiateMap("modalMap");
        createMap(mapModalInstance, true);
    });


    var closeMapModalButton = document.getElementById("modalMapClose");
    closeMapModalButton.addEventListener('click', function(){
        var mapModal = document.getElementById("modalLeafletMap");
        mapModal.close();
    });

    /*Create Leaflet map instance for dataset details*/
    var mapInstance = instantiateMap("datasetMapContainer");
    createMap(mapInstance, false);
})


