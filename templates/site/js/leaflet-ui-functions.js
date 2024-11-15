//let selectArea;
//let selected_features;

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

function getLayers(map){
    map.eachLayer(function(layer){
        console.log(layer._leaflet_id);
    })
}

function removeLayers(map){
    map.eachLayer(function(layer){
        if(layer._leaflet_id != 24 && layer._leaflet_id != 25 && layer._leaflet_id != 27){
            map.removeLayer(layer);
        }

    })
}

function createDrawMenu(map){
    L.Control.Button = L.Control.extend({
    options:{
        position: "topleft"
    },
    onAdd: function(map) {
        let selectArea;
        let selected_features;
        let newRectangle;
        var container = L.DomUtil.create("div", "leaflet-control leaflet-bar");


        var buttonDrawSquare = L.DomUtil.create("a", "leaflet-control-button", container);
        buttonDrawSquare.title = "Click and drag to draw a square";
        L.DomEvent.disableClickPropagation(buttonDrawSquare);
        L.DomEvent.on(buttonDrawSquare, "click", function () {
            //Clear previously drawn layer(s)
            removeLayers(map);

            // Start drawing rectangle
            map.editTools.startRectangle();
        })

        /*
                map.on("mouseup", function () {
                   //getRectangleFeature()
                    selected_features = selectArea.getFeaturesSelected( 'rectangle' );
                    console.log(selected_features);
                })*/

        buttonDrawSquare.innerHTML = '<i class="fa-solid fa-square-full button-square-icon"></i>';


        var buttonDrawCircle = L.DomUtil.create("a", "leaflet-control-button", container);
        buttonDrawCircle.title = "Click and drag to draw a circle";
        L.DomEvent.disableClickPropagation(buttonDrawCircle);
        L.DomEvent.on(buttonDrawCircle, "click", function () {
            //Clear previously drawn layer(s)
            removeLayers(map);
            // Start drawing circle
            map.editTools.startCircle();
        })
        buttonDrawCircle.innerHTML = '<i class="fa-solid fa-circle"></i>';


        var buttonDrawPolygon = L.DomUtil.create("a", "leaflet-control-button", container);
        buttonDrawPolygon.title = "Click to add Polygon vertexes";
        L.DomEvent.disableClickPropagation(buttonDrawPolygon);
        L.DomEvent.on(buttonDrawPolygon, "click", function () {
            //Clear previously drawn layer(s)
            removeLayers(map);
            // Click to add points to map that will be automatically joined into a polygon
            map.editTools.startPolygon();
        })
        buttonDrawPolygon.innerHTML = '<i class="fa-solid fa-draw-polygon"></i>';


        var buttonLocationMarker = L.DomUtil.create("a", "leaflet-control-button", container);
        buttonLocationMarker.title = "Add Location marker";
        L.DomEvent.disableClickPropagation(buttonLocationMarker);
        L.DomEvent.on(buttonLocationMarker, "click", function () {
            //Clear previously drawn layer(s)
            removeLayers(map);
            // Add location marker to map
            map.editTools.startMarker();
        })
        buttonLocationMarker.innerHTML = '<i class="fa-solid fa-location-dot button-location-icon"></i>';

        var buttonClearFeatures = L.DomUtil.create("a", "leaflet-control-button", container);
        buttonClearFeatures.title = "Clear";
        L.DomEvent.disableClickPropagation(buttonClearFeatures);
        L.DomEvent.on(buttonClearFeatures, "click", function () {
            //Remove added shape
            removeLayers(map);
        })
        buttonClearFeatures.innerHTML = '<i class="fa-solid fa-eraser"></i>';


        var buttonSelectRectangleArea = L.DomUtil.create("a", "leaflet-control-button", container);
        L.DomEvent.disableClickPropagation(buttonSelectRectangleArea);
        L.DomEvent.on(buttonSelectRectangleArea, "click", function () {
            //Enable select area plugin
            selectArea = map.selectAreaFeature.enable();
            selectArea.options.color = '#663399';
            selectArea.options.weight = 3;
            //enableSelectArea();
        })
        buttonSelectRectangleArea.innerText = 'Enable';


        var buttonDisableSelectArea = L.DomUtil.create("a", "leaflet-control-button", container);
        L.DomEvent.disableClickPropagation(buttonDisableSelectArea);
        L.DomEvent.on(buttonDisableSelectArea, "click", function () {
            // Disable select area plugin
            selectArea.disable();
            //disableSelectArea();
        })
        buttonDisableSelectArea.innerText = 'Disable';

        var buttonSelectFeatures = L.DomUtil.create("a", "leaflet-control-button", container);
        L.DomEvent.disableClickPropagation(buttonSelectFeatures);
        L.DomEvent.on(buttonSelectFeatures, "click", function () {
            // Disable select area plugin
            selected_features = selectArea.getFeaturesSelected('rectangle');
            console.log(selected_features);
            //disableSelectArea();
        })
        buttonSelectFeatures.innerText = 'Select';

        var buttonNewRectangle = L.DomUtil.create("a", "leaflet-control-button", container);
        L.DomEvent.disableClickPropagation(buttonNewRectangle);
        L.DomEvent.on(buttonNewRectangle, "click", function () {
            // Disable select area plugin
            //selected_features = selectArea.getFeaturesSelected( 'rectangle' );
            //console.log(selected_features);
            //disableSelectArea();
            var bounds = [[0, 0], [0, 0]]
            L.rectangle()
            L.Draw.Rectangle.initialize()
        })
        buttonNewRectangle.innerText = 'Rect';


        /*
        var buttonSelectArea = L.DomUtil.create("a", "leaflet-control-button", container);
        L.DomEvent.disableClickPropagation(buttonSelectArea);
        L.DomEvent.on(buttonSelectArea, "click", function () {
            // Disable select area plugin
            //selected_features = selectArea.getFeaturesSelected( 'rectangle' );
            //console.log(selected_features);
            //disableSelectArea();

        })
        buttonNewRectangle.innerText = 'NewR';
        */

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

             var name = L.DomUtil.create('a', null, container);
             name.innerText = props.AREA_NAME;

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

            //displayFeatures(jsonData.features, layers, icons);
            var properties = ['AREA_NAME']; //Optionally pass more than one feature property by adding to the array

            searchCtrl.indexFeatures(jsonData.features, properties);

            L.geoJson(jsonData, {
                onEachFeature: function (feature, layer) {

                    feature.layer = layer;
                    feature.properties.AREA_S_CD
                    //feature.properties.AREA_S_CD.setStyle
                }
            })



            /*
            .bindPopup(function (layer) {
    return feature.layer;
}).addTo(map);*/
    //myLayer.addData(jsonData);


    })


}

/** @param {Event} event */
function handleSubmit(event) {
    const form = event.currentTarget;
    const url = new URL(form.action);
    const formData = new FormData(form);


    const fetchOptions = {
        method: form.method,
        body: formData,
    };

fetch(url, fetchOptions);

    event.preventDefault();
}

function addCustomGeoJSON(){
    ,
                style: {
                    "color": "#238858",
                    "weight": 0,
                    "fillOpacity": .75
                }
}

function enableSelectArea(){

    selectArea = map.selectAreaFeature.enable();
}

function disableSelectArea(){
    selectArea.disable();
}

function getRectangleFeature(){
    selected_features = selectArea.getFeaturesSelected( 'rectangle' );
    console.log(selected_features);
}