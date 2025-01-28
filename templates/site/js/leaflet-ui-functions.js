function mouseLatLng(){
    map.on("mousedown", function(event){
        //var latlng = map.mouseEventToLatLng(event.originalEvent);
        var latlng = event.latlng;
        console.log(latlng.lat + ", " + latlng.lng);
    })
}

function getLayers(map){
    map.eachLayer(function(layer){
        console.log(layer._leaflet_id);
    })
}

function checkControlExists(customControl){
    L.Map.include({
    hasCustomControl: function (customControl) {
        if(this.customControl){
            return true;
        }
        else{
            return false;
        }

    }
});
}

function getTextareaGeoJSON(){
    var geojsonTextarea = document.getElementById("geojsonInput");

    if(geojsonTextarea.value != ''){
        return geojsonTextarea.value;
    }
    else {
        return false;
    }
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



function createDrawMenu(map){
    L.Control.Button = L.Control.extend({
    options:{
        position: "topleft"
    },
    onAdd: function(map) {

        //Create tooltip to show latitude and longitude next to cursor
        var tooltip = L.tooltip();
        map.on('mouseover', function(event){

            tooltip.setLatLng(event.latlng)
            .setContent(event.latlng.toString());

            map.openTooltip(tooltip);

        });

        map.on('mousemove', function (event){
            tooltip.setLatLng(event.latlng)
                .setContent(event.latlng.toString());

            tooltip.update();
        });

        map.on('mouseout', function (event){
            map.closeTooltip(tooltip);
        });

        //Create buttons for map menu
        //Allows drawing shapes, erasing shapes
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

                clearText("currentShapeLatLng");
            }

            // Start drawing rectangle
            newShape = map.editTools.startRectangle();
/*
            newShape.on("dragend", function(){
                console.log(newShape);
            })
*/
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

                clearText("currentShapeLatLng");
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

                clearText("currentShapeLatLng");
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

                clearText("currentShapeLatLng");
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

                clearText("currentShapeLatLng");
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



        var buttonCopy = L.DomUtil.create("a", "leaflet-control-button", container);
        var divLatLng = document.getElementById("currentShapeLatLng");
        let polygonLatLngArray;
        let circleRadius;
        let circleCentre;
        let circleBounds;
        let circleBoundsCornerNE;
        let circleBoundsCornerSW;
        L.DomEvent.disableClickPropagation(buttonCopy);

        L.DomEvent.on(buttonCopy, "click", function () {

            if(Object.keys(shapeDict).length > 0){
                console.log(shapeDict);
                if("_radius" in shapeDict["shape"]){

                    circleRadius = shapeDict["shape"].getRadius();
                    circleCentre = shapeDict["shape"].getLatLng();

                    //Keep in case this information is needed
                    /*
                    circleBounds = shapeDict["shape"].getBounds();
                    circleBoundsCornerNE = circleBounds.getNorthEast();
                    circleBoundsCornerSW = circleBounds.getSouthWest();
                    */

                    divLatLng.innerText = "Centre = " + circleCentre + "\n" +  "Radius = " + circleRadius;
                }
                else{
                    polygonLatLngArray = shapeDict["shape"].getLatLngs();
                    divLatLng.innerText = polygonLatLngArray;
                }
            }

        });
        buttonCopy.innerText = "Get LatLong";


        return container;
    },
        onRemove: function (map) {
        },
    })
    var control = new L.Control.Button();
    control.addTo(map);
}

function addSearch(map){
    var defaultMapURL = "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_populated_places.geojson";
    let options;

    fetch(defaultMapURL).then( response => response.json()).then(jsonData => {
        let locationMarkerList = {};

        options = {
            maxResultLength: 15,
            threshold: 0.5,
            showInvisibleFeatures: true,
            showResultFct: function (feature, container) {
                var name = L.DomUtil.create('button', 'button-search-result', container);
                props = feature.properties;
                geoms = feature.geometry;
                name.innerText = props.NAME;
                name.id = props.NAME;
                name.value = geoms.coordinates;

                //Add click function to search result button
                //Removes previous location marker from map when a new one is added/ when new location is clicked
                name.addEventListener('click', function(){
                    var coordinates = name.value.split(',');
                    var locationMarker = L.marker([coordinates[1], coordinates[0]]);

                    if(Object.keys(locationMarkerList).length > 0){
                        locationMarkerList["marker"].remove();
                        delete locationMarkerList.marker;
                    }

                    locationMarker.addTo(map);
                    locationMarkerList["marker"] = locationMarker;

                    map.panTo([coordinates[1], coordinates[0]]);
                })
                container.appendChild(L.DomUtil.create('br', null, container));
            }
        }


        //Leaflet-fuse-search plugin
        var searchCtrl = L.control.fuseSearch(options);
        searchCtrl.addTo(map);

        searchCtrl.indexFeatures(jsonData.features, ["NAME"]);

         L.geoJson(jsonData, {
             //style:stylePolygons, //Optionally customize how geoJSON polygons  are coloured
             onEachFeature: function (feature, layer) {
                 feature.layer = layer;
             }
        })
    })
}

function stylePolygons() {
    return {
        fillColor: '#bab6e7',
        fillOpacity: 0.7,
        weight: 2,
        opacity: 1,
        color: '#9999ff' //Outline color

    };
}

function uploadGeoJSON(map){
    var geojsonTextarea = document.getElementById("geojsonInput");
    let geoJSONData;

    try{
        JSON.parse(geojsonTextarea.value)
        geoJSONData = JSON.parse(geojsonTextarea.value);
    }
    catch (error){
        var errorDiv = document.getElementById("geoJSONError");
        errorDiv.innerText = error;
    }

    L.geoJson(geoJSONData, {
        //style:stylePolygons, //Optionally customize how geoJSON items are coloured
        onEachFeature: function (feature, layer) {

            feature.layer = layer;
            feature.properties;

        }
    }).addTo(map);
}




async function getGeoJSON(map){
    let geojsonInput;
    let urlResponse;
    let geojsonDefaultURL = "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_populated_places_simple.geojson";
    var geojsonTextarea = document.getElementById("geojsonInput");

    if(geojsonTextarea.value != ''){
        geojsonInput = geojsonTextarea.value.json();
        //addSearch(map, geojsonInput);
    }
    else{
        urlResponse = await fetch(geojsonDefaultURL);
        geojsonInput = await urlResponse.json();
        //geojsonInput = urlResponse;
        console.log("else");
        console.log(geojsonInput);
        //addSearch(map, geojsonInput);
    }

return geojsonInput;
}

function clearText(elementID){
    var divLatLng = document.getElementById(elementID);
    divLatLng.innerText = "";
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


