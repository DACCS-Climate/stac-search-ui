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
        "Hong Kong":[22.302711, 114.177216],
        "startPoint" : [43.1249, 1.254]
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

function clear(){
    drawnItems.clearLayers();
}


var deleteShape = function (e) {
    if ((e.originalEvent.ctrlKey || e.originalEvent.metaKey) && this.editEnabled())
    {
          this.editor.deleteShapeAt(e.latlng);
    }

}





function createDrawMenu(map){
    L.Control.Button = L.Control.extend({
    options:{
        position: "topleft"
    },
    onAdd: function(map) {
        let selectArea;
        let selected_features;
        let shapeDict ={}  ;
        let newShape;
        var container = L.DomUtil.create("div", "leaflet-control leaflet-bar");

        var buttonDrawSquare = L.DomUtil.create("a", "leaflet-control-button", container);
        buttonDrawSquare.title = "Click and drag to draw a square";
        buttonDrawSquare.innerHTML = '<i class="fa-solid fa-square-full button-square-icon"></i>';
        L.DomEvent.disableClickPropagation(buttonDrawSquare);
        L.DomEvent.on(buttonDrawSquare, "click", function () {

            //Clear previously drawn shape/layer from map
            //Remove previously drawn shape/layer from dictionary
            if(Object.keys(shapeDict).length > 0){
                shapeDict["shape"].remove();
                delete shapeDict.shape;
            }

            // Start drawing rectangle
            newShape = map.editTools.startRectangle();

            //Store drawn shape
            shapeDict["shape"] = newShape;
        })


        var buttonDrawCircle = L.DomUtil.create("a", "leaflet-control-button", container);
        buttonDrawCircle.title = "Click and drag to draw a circle";
        buttonDrawCircle.innerHTML = '<i class="fa-solid fa-circle"></i>';
        L.DomEvent.disableClickPropagation(buttonDrawCircle);
        L.DomEvent.on(buttonDrawCircle, "click", function () {

            //Clear previously drawn shape/layer from map
            //Remove previously drawn shape/layer from dictionary
            if(Object.keys(shapeDict).length > 0){
                shapeDict["shape"].remove();
                delete shapeDict.shape;
            }

            // Start drawing circle
            newShape = map.editTools.startCircle();

            //Store drawn shape
            shapeDict["shape"] = newShape;
        })


        var buttonDrawPolygon = L.DomUtil.create("a", "leaflet-control-button", container);
        buttonDrawPolygon.title = "Click to add Polygon vertexes";
        buttonDrawPolygon.innerHTML = '<i class="fa-solid fa-draw-polygon"></i>';
        L.DomEvent.disableClickPropagation(buttonDrawPolygon);
        L.DomEvent.on(buttonDrawPolygon, "click", function () {

            //Clear previously drawn shape/layer from map
            //Remove previously drawn shape/layer from dictionary
            if(Object.keys(shapeDict).length > 0){
                shapeDict["shape"].remove();
                delete shapeDict.shape;
            }

            // Click to add points to map that will be automatically joined into a polygon
            newShape = map.editTools.startPolygon();

            //Store drawn shape
            shapeDict["shape"] = newShape;
        })


        var buttonLocationMarker = L.DomUtil.create("a", "leaflet-control-button", container);
        buttonLocationMarker.title = "Add Location marker";
        buttonLocationMarker.innerHTML = '<i class="fa-solid fa-location-dot button-location-icon"></i>';
        L.DomEvent.disableClickPropagation(buttonLocationMarker);
        L.DomEvent.on(buttonLocationMarker, "click", function () {

            //Clear previously drawn shape/layer from map
            //Remove previously drawn shape/layer from dictionary
            if(Object.keys(shapeDict).length > 0){
                shapeDict["shape"].remove();
                delete shapeDict.shape;
            }

            // Add location marker to map
            newShape = map.editTools.startMarker();

            //Store drawn shape
            shapeDict["shape"] = newShape;
        })


        var buttonClearFeatures = L.DomUtil.create("a", "leaflet-control-button", container);
        buttonClearFeatures.title = "Clear";
        buttonClearFeatures.innerHTML = '<i class="fa-solid fa-eraser"></i>';
        L.DomEvent.disableClickPropagation(buttonClearFeatures);
        L.DomEvent.on(buttonClearFeatures, "click", function () {
            //Clear previously drawn shape/layer from map
            //Remove previously drawn shape/layer from dictionary
            if(Object.keys(shapeDict).length > 0){
                shapeDict["shape"].remove();
                delete shapeDict.shape;
            }
        })


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




        return container;
    },
        onRemove: function (map) {
        },
    })
    var control = new L.Control.Button();
    control.addTo(map);
}

async function addSearch(map){
    //var geojsonTextarea = document.getElementById("geojsonInput");
    let jsonData;
    let properties;

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

    getGeoJSON().then( response => response.json()).then( jsonData => {
        console.log(jsonData);
            if(jsonData.features.properties.name != null){
                properties = ['name']; //Optionally pass more than one feature property by adding to the array
            }
            else{
                properties = ['AREA_NAME']; //Optionally pass more than one feature property by adding to the array
            }



            searchCtrl.indexFeatures(jsonData.features, properties);

            L.geoJson(jsonData, {
                onEachFeature: function (feature, layer) {

                    feature.layer = layer;

                    if (feature.properties.AREA_S_CD != null){
                        feature.properties.AREA_S_CD;

                        if(feature.geometry.type == "Polygons"){
                            L.geoJson(jsonData, {
                                style: stylePolygons
                            }).addTo(map);
                        }
                    }
                    else{
                        feature.properties.name;
                    }



                    //stylePolygons(feature.geometry);

                }

            }).addTo(map);

    })

    //console.log(jsonData.features);




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

    //fetch("https://raw.githubusercontent.com/jasonicarter/toronto-geojson/refs/heads/master/toronto_crs84.geojson").then(
        //response => response.json()).then(jsonData => {

            //displayFeatures(jsonData.features, layers, icons);
           // var properties = ['AREA_NAME']; //Optionally pass more than one feature property by adding to the array










            /*
            .bindPopup(function (layer) {
    return feature.layer;
}).addTo(map);*/
    //myLayer.addData(jsonData);


   // })


}

function stylePolygons(feature) {
    return {
        fillColor: '#bab6e7',
        fillOpacity: 0.7,
        weight: 2,
        opacity: 1,
        color: '#9999ff' //Outline color

    };
}

function submitFile(){
    const selectedFile = document.getElementById("uploadFile").files[0];
    let formData = new FormData();

    formData.append("uploadedFile", selectedFile);

    fetch('/upload/geojson', {method: "POST", body: formData});

}



async function getGeoJSON(){
    let geojsonInput;
    let urlResponse;
    let geojsonDefaultURL = "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_populated_places_simple.geojson";
    var geojsonTextarea = document.getElementById("geojsonInput");

    if(geojsonTextarea.value != ''){
        geojsonInput = geojsonTextarea.value.json();
    }
    else{
        urlResponse = await fetch(geojsonDefaultURL);
        //geojsonInput = await urlResponse.json();
        geojsonInput = urlResponse;
        console.log("else");
        console.log(geojsonInput);
    }
/*
async function getWordlist() {
    const resp = await fetch("{{ stac_catalog_url }}/collections")
    const json = await resp.json()
    const collection_ids = json.collections.map(collection => collection.id)
    return await Promise.all(collection_ids.map(async (id) => {
        const resp_1 = await fetch(`{{ stac_catalog_url }}/collections/${id}/queryables`)
        const json_1 = await resp_1.json()
        return Object.entries(json_1.properties).map(([key, val]) => {
            val["key"] = key
            return val
        })
    })).then(queryables => queryables.flat())
}
    */
return geojsonInput;
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


