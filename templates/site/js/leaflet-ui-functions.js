

/*


L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

mouseLatLng();
*/
function mouseLatLng(){
    map.on("mousedown", function(event){
        //var latlng = map.mouseEventToLatLng(event.originalEvent);
        var latlng = event.latlng;
        console.log(latlng.lat + ", " + latlng.lng);
    })
}

function createMap(city){
    var location={
        "Toronto":[43.6532, -79.3832],
        "London":[51.509865, -0.118092],
        "Hong Kong":[22.302711, 114.177216]
    };

    var map = L.map('map',{
            editable: true,
            center: location[city],
            zoom: 13
        });

    return map;
}



function createDrawMenu(map){

    L.Control.Button = L.Control.extend({
    options:{
        position: "topleft"
    },
    onAdd: function(map) {
        var container = L.DomUtil.create("div", "leaflet-control leaflet-bar");

        var buttonDrawSquare = L.DomUtil.create("a", "leaflet-control-button", container);
        L.DomEvent.disableClickPropagation(buttonDrawSquare);
        L.DomEvent.on(buttonDrawSquare, "click", function () {
            // Start drawing rectangle
            map.editTools.startRectangle();
        })
        buttonDrawSquare.innerHTML = '<i class="fa-solid fa-square-full button-square-icon"></i>';

        var buttonDrawCircle = L.DomUtil.create("a", "leaflet-control-button", container);
        L.DomEvent.disableClickPropagation(buttonDrawCircle);
        L.DomEvent.on(buttonDrawCircle, "click", function () {
            // Start drawing circle
            map.editTools.startCircle();
        })
        buttonDrawCircle.innerHTML = '<i class="fa-solid fa-circle"></i>';

        var buttonDrawPolygon = L.DomUtil.create("a", "leaflet-control-button", container);
        L.DomEvent.disableClickPropagation(buttonDrawPolygon);
        L.DomEvent.on(buttonDrawPolygon, "click", function () {
            // Start drawing rectangle
            map.editTools.startPolygon();
        })
        buttonDrawPolygon.innerHTML = '<i class="fa-solid fa-draw-polygon"></i>';

        var buttonLocationMarker = L.DomUtil.create("a", "leaflet-control-button", container);
        L.DomEvent.disableClickPropagation(buttonLocationMarker);
        L.DomEvent.on(buttonLocationMarker, "click", function () {
            // Start drawing rectangle
            map.editTools.startMarker();
        })
        buttonLocationMarker.innerHTML = '<i class="fa-solid fa-location-dot button-location-icon"></i>';

        return container;
    },
        onRemove: function (map) {
        },
    })
    var control = new L.Control.Button();
    control.addTo(map);
}

function addSearch(map){

     var options = {
         maxResultLength: 15,
         threshold: 0.5,
         showInvisibleFeatures: true,
         showResultFct: function (feature, container) {
             props = feature.properties;
             var name = L.DomUtil.create('b', null, container);
             name.innerHTML = props.AREA_NAME;

             container.appendChild(L.DomUtil.create('br', null, container));

             //var cat = props.libtype ? props.libtype : props.libcategor,info = '' + cat + ', ' + props.commune;
             //container.appendChild(document.createTextNode(info));
         }
     }

    //Leaflet-fuse-search plugin
    var searchCtrl = L.control.fuseSearch(options);
    searchCtrl.addTo(map);

    //var icons = setupIcons();

     // Layer control, setting up 1 layer per category
    /*
    var layers = {},
        cultureLayer = L.layerGroup(),
        layerCtrl = L.control.layers();
    for (var icat in categories) {
        var layer = L.featureGroup();
        layers[icat] = layer;
        cultureLayer.addLayer(layer);

        var cat = categories[icat],
            desc = '<img class="layer-control-img" src="images/' + cat.icon + '"> ' + cat.desc;
        layerCtrl.addOverlay(layer, desc);
    }
    cultureLayer.addTo(map);*/




//var myLayer = L.geoJSON().addTo(map);

//layer.feature.properties.description
//https://raw.githubusercontent.com/jasonicarter/toronto-geojson/refs/heads/master/toronto_crs84.geojson
//https://raw.githubusercontent.com/adamw523/toronto-geojson/refs/heads/master/neighbourhoods.js
    fetch("https://raw.githubusercontent.com/jasonicarter/toronto-geojson/refs/heads/master/toronto_crs84.geojson").then(
        response => response.json()).then(jsonData => {
            console.log(jsonData);
            //displayFeatures(jsonData.features, layers, icons);
            var properties = ["AREA_S_CD", 'AREA_NAME']; //Optionally pass more than one feature property
            searchCtrl.indexFeatures(jsonData.features, ['AREA_NAME']);

            L.geoJson(jsonData, {
                onEachFeature: function (feature, layer) {
                feature.layer = layer;
                }
            })
            /*
            .bindPopup(function (layer) {
    return feature.layer;
}).addTo(map);*/
    //myLayer.addData(jsonData);


    })


}