var shapeDict = {};

function getLayers(map){
    map.eachLayer(function(layer){
        console.log(layer._leaflet_id);
    })
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

    //Creates map with the map centre at the given city
    var map = L.map('map',{
            editable: true,
            center: location[city],
            zoom: 13
        });

    //Adds map image
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    //Adds menu of buttons to draw shapes
    createDrawMenu(map);

    //Adds search box
    createSearchTool(map);

    //Adds textbox to input single coordinate
    createCoordinateInputField(map)

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

    return map;
}

function clearShape(shapeDict){
    if(Object.keys(shapeDict).length > 0) {
        shapeDict["shape"].remove();
        delete shapeDict.shape;
    }
}


function createDrawMenu(map){
    L.Control.Button = L.Control.extend({
    options:{
        position: "topleft"
    },
    onAdd: function(map) {

        //Create buttons for map menu
        //Allows drawing shapes, erasing shapes
        let newShape;
        var container = L.DomUtil.create("div", "leaflet-control leaflet-bar");

        var buttonDrawSquare = L.DomUtil.create("a", "leaflet-control-button", container);
        buttonDrawSquare.title = "Click and drag to draw a square";
        buttonDrawSquare.innerHTML = '<i class="fa-solid fa-square-full button-square-icon"></i>';
        L.DomEvent.disableClickPropagation(buttonDrawSquare);
        L.DomEvent.on(buttonDrawSquare, "click", function () {

            //Clear previously drawn shape/layer from map
            //Remove previously drawn shape/layer from dictionary
            //Clear text from div displaying the point coordinates of the shape
            clearShape(shapeDict);
            clearText("currentShapeLatLng");

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
            //Clear text from div displaying the point coordinates of the shape
            clearShape(shapeDict);
            clearText("currentShapeLatLng");

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
            //Clear text from div displaying the point coordinates of the shape
            clearShape(shapeDict);
            clearText("currentShapeLatLng");

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
            //Clear text from div displaying the point coordinates of the shape
            clearShape(shapeDict);
            clearText("currentShapeLatLng");

            //Add location marker to map
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
            //Clear text from div displaying the point coordinates of the shape
            clearShape(shapeDict);
            clearText("currentShapeLatLng");
        })


        var buttonCopy = L.DomUtil.create("a", "leaflet-control-button", container);
        var divLatLng = document.getElementById("currentShapeLatLng");
        let polygonLatLngArray;
        let markerCentre;
        let circleRadius;
        let circleCentre;
        let circleBounds;
        let circleBoundsCornerNE;
        let circleBoundsCornerSW;
        L.DomEvent.disableClickPropagation(buttonCopy);

        L.DomEvent.on(buttonCopy, "click", function () {

            if(Object.keys(shapeDict).length > 0){
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
                else if("_icon" in shapeDict["shape"]){
                    markerCentre = shapeDict["shape"].getLatLng();
                    divLatLng.innerText = markerCentre;
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

function createCoordinateInputField(map){
    L.Control.CoordinateInput = L.Control.extend({
        options:{
            position: "bottomleft"
        },
        onAdd: function(map){
            var bottomRightPanel = L.DomUtil.create("div", "bottom-right-panel");
            var coordinateContainer = L.DomUtil.create("div", "coordinate-input-container", bottomRightPanel);
            var coordinateLabel = L.DomUtil.create("label", "coordinate-input-label", coordinateContainer);
            var coordinateInputField = L.DomUtil.create("input", "coordinate-input-field", coordinateContainer);

            coordinateLabel.for = "inputCoordinateLatLng";
            coordinateLabel.innerHTML = "Point";
            coordinateInputField.id = "inputCoordinateLatLng";
            coordinateInputField.type = "text";
            coordinateInputField.placeholder = "Lat, Lng";

            L.DomEvent.on(coordinateInputField, 'keydown', function(event){
                if(event.key == "Enter"){
                    addCoordinate(coordinateInputField.value, map);
                }
            });

            return bottomRightPanel;
        },
        onRemove: function (map) {
        },
    })

    var coordinateInput = new L.Control.CoordinateInput();
    coordinateInput.addTo(map);
}

function createSearchTool(map){
    var defaultMapURL = "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_populated_places.geojson";
    let searchControl;
    let options;

    fetch(defaultMapURL).then( response => response.json()).then(jsonData => {

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

                    //Clear previously drawn shape/layer from map
                    //Remove previously drawn shape/layer from dictionary
                    clearShape(shapeDict);

                    shapeDict["shape"] = locationMarker;

                    locationMarker.addTo(map);
                    map.panTo([coordinates[1], coordinates[0]]);
                })
                container.appendChild(L.DomUtil.create('br', null, container));
            }
        }


        //Leaflet-fuse-search plugin
        searchControl = L.control.fuseSearch(options);
        searchControl.addTo(map);

        searchControl.indexFeatures(jsonData.features, ["NAME"]);

         L.geoJson(jsonData, {
             //style:stylePolygons, //Optionally customize how geoJSON polygons  are coloured
             onEachFeature: function (feature, layer) {
                 feature.layer = layer;
             }
        });
    });
}

//Optionally customize how geoJSON polygons  are coloured
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

function addCoordinate(coordinateValue, map){
    //TODO Uncomment if add coordinate input field is kept outside of map
    //var inputElement = document.getElementById(elementID);
    //var inputArray = inputElement.value.split(',');
    var inputArray = coordinateValue.split(',');
    var latitude = inputArray[0];
    var longitude = inputArray[1];
    var coordinateMarker = L.marker([latitude, longitude]);

    //Clear previously drawn shape/layer from map
    //Remove previously drawn shape/layer from dictionary
    clearShape(shapeDict);

    coordinateMarker.addTo(map);
    //Store point marker
    shapeDict["shape"] = coordinateMarker;
    map.panTo([latitude, longitude]);
}

function clearText(elementID){
    var divLatLng = document.getElementById(elementID);
    divLatLng.innerText = "";
}


async function getGeoJSON(map){
    let geojsonInput;
    let urlResponse;
    let geojsonDefaultURL = "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_populated_places_simple.geojson";
    var geojsonTextarea = document.getElementById("geojsonInput");

    if(geojsonTextarea.value != ''){
        geojsonInput = geojsonTextarea.value.json();
    }
    else{
        urlResponse = await fetch(geojsonDefaultURL);
        geojsonInput = await urlResponse.json();
        //geojsonInput = urlResponse;
        console.log("else");
        console.log(geojsonInput);
    }

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


