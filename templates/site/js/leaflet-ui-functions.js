var shapeDict = {};

function createMap(city){
    var location={
        "Toronto":[43.6532, -79.3832],
        "London":[51.509865, -0.118092],
        "Hong Kong":[22.302711, 114.177216],
        "startPoint" : [43.1249, 1.254]
    };

    //Creates map with the map centre at the passed city
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
    createCoordinateInputField(map);

    //Adds panel to paste geojson
    createGeoJSONPanel(map);

    //Adds tooltip on cursor that shows latitude and longitude of cursor position
    createCursorTooltip(map);

    return map;
}

function clearShape(shapeDict){
    if(Object.keys(shapeDict).length > 0) {
        shapeDict["shape"].remove();
        delete shapeDict.shape;
    }
}

function clearText(elementID){
    var divLatLng = document.getElementById(elementID);
    divLatLng.innerText = "";
}

function createCursorTooltip(map){
    //Create tooltip to show latitude and longitude next to cursor
    var tooltip = L.tooltip();

    //Create tooltip for main map
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


    //Set listeners on UI elements for Tooltip actions
    //Close tooltip when moving mouse over any UI element
    //Open tooltip when moving mouse out of any UI element

    manageToolTipDomElement(map, tooltip, "drawMenuContainer");
    manageToolTipDomElement(map, tooltip, "coordinateContainer");
    manageToolTipDomElement(map, tooltip, "geoJSONPanelButton");
    manageToolTipDomElement(map, tooltip, "geoJSONPanelContainer");
    manageToolTipDomElement(map, tooltip, "fuseSearchControlContainer");

}

function manageToolTipDomElement(map, tooltip, elementID){
    var element = L.DomUtil.get(elementID);

    //Close tooltip when hovering over UI element
    L.DomEvent.on(element, 'mouseover', function(event){
        map.closeTooltip(tooltip);
    });

    //Create tooltip when moving mouse out of UI element
    L.DomEvent.on(element, 'mouseout', function(event){

        var mapLocation = map.mouseEventToLatLng(event);

        tooltip.setLatLng(mapLocation)
                .setContent(mapLocation.toString());

        map.openTooltip(tooltip);
    });
}


/*Map controls*/
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
        container.id = "drawMenuContainer";

        var buttonDrawSquare = L.DomUtil.create("a", "leaflet-control-button", container);
        buttonDrawSquare.title = "Click and drag to draw a square";
        buttonDrawSquare.innerHTML = '<i class="fa-solid fa-square-full button-square-icon"></i>';
        L.DomEvent.disableClickPropagation(buttonDrawSquare);
        L.DomEvent.on(buttonDrawSquare, "click", function () {

            //Clear anything in coordinate input field
            clearCoordinate();

            //Hide coordinate input error message if visible
            hideCoordinateErrorPanel();

            //Clear previously drawn shape/layer from map
            //Remove previously drawn shape/layer from dictionary
            //Clear text from div displaying the point coordinates of the shape
            clearShape(shapeDict);
            clearText("currentShapeLatLng");

            // Start drawing rectangle
            newShape = map.editTools.startRectangle();
            newShape["shapeType"] = "Rectangle";

            //Store drawn shape
            shapeDict["shape"] = newShape;
        })


        var buttonDrawCircle = L.DomUtil.create("a", "leaflet-control-button", container);
        buttonDrawCircle.title = "Click and drag to draw a circle";
        buttonDrawCircle.innerHTML = '<i class="fa-solid fa-circle"></i>';
        L.DomEvent.disableClickPropagation(buttonDrawCircle);
        L.DomEvent.on(buttonDrawCircle, "click", function () {

            //Clear anything in coordinate input field
            clearCoordinate();

            //Hide coordinate input error message if visible
            hideCoordinateErrorPanel();

            //Clear previously drawn shape/layer from map
            //Remove previously drawn shape/layer from dictionary
            //Clear text from div displaying the point coordinates of the shape
            clearShape(shapeDict);
            clearText("currentShapeLatLng");

            // Start drawing circle
            newShape = map.editTools.startCircle();
            newShape["shapeType"] = "Circle";

            //Store drawn shape
            shapeDict["shape"] = newShape;
        })


        var buttonDrawPolygon = L.DomUtil.create("a", "leaflet-control-button", container);
        buttonDrawPolygon.title = "Click to add polygon vertexes";
        buttonDrawPolygon.innerHTML = '<i class="fa-solid fa-draw-polygon"></i>';
        L.DomEvent.disableClickPropagation(buttonDrawPolygon);
        L.DomEvent.on(buttonDrawPolygon, "click", function () {

            //Clear anything in coordinate input field
            clearCoordinate();

            //Hide coordinate input error message if visible
            hideCoordinateErrorPanel();

            //Clear previously drawn shape/layer from map
            //Remove previously drawn shape/layer from dictionary
            //Clear text from div displaying the point coordinates of the shape
            clearShape(shapeDict);
            clearText("currentShapeLatLng");

            // Click to add points to map that will be automatically joined into a polygon
            newShape = map.editTools.startPolygon();
            newShape["shapeType"] = "Polygon";

            //Store drawn shape
            shapeDict["shape"] = newShape;
        })


        var buttonLocationMarker = L.DomUtil.create("a", "leaflet-control-button", container);
        buttonLocationMarker.title = "Click to add a location marker";
        buttonLocationMarker.innerHTML = '<i class="fa-solid fa-location-dot button-location-icon"></i>';
        L.DomEvent.disableClickPropagation(buttonLocationMarker);
        L.DomEvent.on(buttonLocationMarker, "click", function () {

            //Clear anything in coordinate input field
            clearCoordinate();

            //Hide coordinate input error message if visible
            hideCoordinateErrorPanel();

            //Clear previously drawn shape/layer from map
            //Remove previously drawn shape/layer from dictionary
            //Clear text from div displaying the point coordinates of the shape
            clearShape(shapeDict);
            clearText("currentShapeLatLng");

            //Add location marker to map
            newShape = map.editTools.startMarker();
            newShape["shapeType"] = "Marker";

            //Store drawn shape
            shapeDict["shape"] = newShape;
        })


        var buttonClearFeatures = L.DomUtil.create("a", "leaflet-control-button", container);
        buttonClearFeatures.title = "Clear";
        buttonClearFeatures.innerHTML = '<i class="fa-solid fa-eraser"></i>';
        L.DomEvent.disableClickPropagation(buttonClearFeatures);
        L.DomEvent.on(buttonClearFeatures, "click", function () {

            //Clear anything in coordinate input field
            clearCoordinate();

            //Hide coordinate input error message if visible
            hideCoordinateErrorPanel();

            //Clear previously drawn shape/layer from map
            //Remove previously drawn shape/layer from dictionary
            //Clear text from div displaying the point coordinates of the shape
            clearShape(shapeDict);
            clearText("currentShapeLatLng");
            clearText("currentShapeGeoJSON");
        })


        var buttonCopy = L.DomUtil.create("a", "leaflet-control-button", container);
        var divLatLng = document.getElementById("currentShapeLatLng");
        var buttonGeoJSON = L.DomUtil.create("a", "leaflet-control-button", container);
        var divCurrentGeoJSON = document.getElementById("currentShapeGeoJSON");
        let polygonLatLngArray;
        let markerCentre;
        let circleRadius;
        let circleCentre;

        //Keep in case this information is needed
        /*
        let circleBounds;
        let circleBoundsCornerNE;
        let circleBoundsCornerSW;
        */

        buttonCopy.innerText = "Get LatLong";
        buttonGeoJSON.innerText = "GeoJSON";

        L.DomEvent.disableClickPropagation(buttonCopy);

        L.DomEvent.on(buttonCopy, "click", function () {

            //Hide coordinate input error message if visible
            hideCoordinateErrorPanel();

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

        })

        L.DomEvent.on(buttonGeoJSON, "click", function () {
            //Hide coordinate input error message if visible
            hideCoordinateErrorPanel();

            formatGeoJSON(shapeDict);
        })
        return container;
    },
    onRemove: function (map) {
        },
    })

    var control = new L.Control.Button();
    control.addTo(map);
}

function createSearchTool(map){
    var defaultMapURL = "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_populated_places.geojson";
    var searchControlContainer;
    let searchControl;
    var locationButtonContainer;
    let options;

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

                    //Clear anything in coordinate input field
                    clearCoordinate()

                    //Hide coordinate input error message if visible
                    hideCoordinateErrorPanel();

                    //Clear previously drawn shape/layer from map
                    //Remove previously drawn shape/layer from dictionary
                    clearShape(shapeDict);

                    locationMarker["shapeType"] = "Marker";
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

        fetch(defaultMapURL).then( response => response.json()).then(jsonData => {
            searchControl.indexFeatures(jsonData.features, ["NAME"]);
        });

        searchControlContainer = searchControl.getContainer();
        searchControlContainer.id = "fuseSearchControlContainer";
}

/*Single coordinate input field*/
function createCoordinateInputField(map){
    L.Control.CoordinateInput = L.Control.extend({
        options:{
            position: "bottomleft"
        },
        onAdd: function(map){

            var bottomLeftPanel = L.DomUtil.create("div", "bottom-left-panel");
            var inputPanel = L.DomUtil.create("div", "bottom-left-input-panel", bottomLeftPanel);
            var coordinateContainer = L.DomUtil.create("div", "coordinate-input-container", inputPanel);
            coordinateContainer.id="coordinateContainer";

            var errorPanel = L.DomUtil.create("div", "bottom-left-error-panel", bottomLeftPanel);
            var coordinateErrorContainer = L.DomUtil.create("div", "coordinate-error-container", errorPanel);
            errorPanel.id = "coordinateErrorPanel";

            var coordinateLabel = L.DomUtil.create("label", "coordinate-input-label", coordinateContainer);
            L.DomUtil.addClass(coordinateLabel, "button");
            coordinateLabel.for = "inputCoordinateLatLng";
            coordinateLabel.innerHTML = "Point";

            var coordinateInputField = L.DomUtil.create("input", "coordinate-input-field", coordinateContainer);
            L.DomUtil.addClass(coordinateInputField, "caption");
            coordinateInputField.id = "inputCoordinateLatLng";
            coordinateInputField.type = "text";
            coordinateInputField.placeholder = "Lat, Lng";

            L.DomEvent.on(coordinateInputField, 'keydown', function(event){
                if(event.key == "Enter"){
                    addCoordinate(coordinateInputField.value, map);
                }
            });

            var coordinateError = L.DomUtil.create("p", "coordinate-error-message", coordinateErrorContainer);
            coordinateError.innerHTML = "Coordinate outside of range.  Latitude (-90 to 90), longitude (-180 to 180)";
            L.DomUtil.addClass(coordinateError, 'content');

            return bottomLeftPanel;
        },
        onRemove: function (map) {
        }
    })

    var inputField = new L.Control.CoordinateInput(map);
    inputField.addTo(map);
}
/*
function createCoordinateInputField(map){

    var options = {
            position: "bottomleft"
        }

    var coordinateInput = new L.Control.CoordinateInput();
    coordinateInput.addTo(map);
    return coordinateInput;
    //var inputCoordinateControl = L.control.CoordinateInput(options);
    //inputCoordinateControl.addTo(map);

    //return inputCoordinateControl;
}
*/


function checkCoordinate(latitude, longitude){
    if(  (latitude >= -90 && latitude <= 90) && (longitude >= -180 && longitude <= 180) ){
        return true;
    }
    else{
        return false;
    }
}

function showCoordinateErrorPanel(){
    var coordinateErrorPanel = L.DomUtil.get("coordinateErrorPanel");
    L.DomUtil.addClass(coordinateErrorPanel, "visible");
}

function hideCoordinateErrorPanel(){
    var coordinateErrorPanel = L.DomUtil.get("coordinateErrorPanel");

    if(L.DomUtil.hasClass(coordinateErrorPanel, "visible")){
        L.DomUtil.removeClass(coordinateErrorPanel, "visible");
    }
}

function addCoordinate(coordinateValue, map){

    var inputArray = coordinateValue.split(',');
    var latitude = inputArray[0];
    var longitude = inputArray[1];
    var coordinateMarker;

    hideCoordinateErrorPanel();

    if(checkCoordinate(latitude, longitude)){
        coordinateMarker = L.marker([latitude, longitude]);

        //Clear previously drawn shape/layer from map
        //Remove previously drawn shape/layer from dictionary
        clearShape(shapeDict);

        coordinateMarker.addTo(map);

        coordinateMarker['shapeType'] = "Marker";
        //Store point marker
        shapeDict["shape"] = coordinateMarker;
        map.panTo([latitude, longitude]);
    }
    else{
        showCoordinateErrorPanel();

    }


}

function clearCoordinate(){
    var coordinateInputField = L.DomUtil.get("inputCoordinateLatLng");

    if(coordinateInputField.value != ""){
        coordinateInputField.value = "";
    }
}

/*
     L.Control.CoordinateInput = L.Control.extend({
        options:{
            position: "bottomleft"
        },
        initialize: function(options) {
            L.setOptions(this, options);
        },
        onAdd: function(map){
            var newCoordinateInput = this.createControl(map);
            return newCoordinateInput;

        },
        createControl: function(map){
            var bottomLeftPanel = L.DomUtil.create("div", "bottom-left-panel");
            var coordinateContainer = L.DomUtil.create("div", "coordinate-input-container", bottomLeftPanel);
            var coordinateLabel = L.DomUtil.create("label", "coordinate-input-label", coordinateContainer);
            var coordinateInputField = L.DomUtil.create("input", "coordinate-input-field", coordinateContainer);

            coordinateLabel.for = "inputCoordinateLatLng";
            coordinateLabel.innerHTML = "Point";
            coordinateInputField.id = "inputCoordinateLatLng";
            coordinateInputField.type = "text";
            coordinateInputField.placeholder = "Lat, Lng";

            L.DomEvent.on(coordinateInputField, 'keydown', function(event){
                if(event.key == "Enter"){
                    this.addCoordinate(coordinateInputField.value, map);
                }
            });

            return bottomLeftPanel;
        },
        addCoordinate: function(coordinateValue, map){
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
        },
        onRemove: function (map) {
        }
    })*/

/*geojson panel*/
function createGeoJSONPanel(map){
    L.Control.GeoJSONInput = L.Control.extend({

        options:{
            position: "bottomright"
        },

        initialize: function(options) {
            L.setOptions(this, options);
            this._panelOnLeftSide = (this.options.position.indexOf("left") !== -1);
        },

        onAdd: function(map){
            var panelButton = this.createButton(map);
            this.createPanel(map);

            return panelButton;

        },
        createButton: function(){
            var geoJSONPanelButton = L.DomUtil.create('button', 'geojson-panel-button');
            geoJSONPanelButton.id = "geoJSONPanelButton";
            geoJSONPanelButton.innerText = "Paste GeoJSON";

            L.DomEvent.on(geoJSONPanelButton, 'click', function(){
                //Hide coordinate input error message if visible
                hideCoordinateErrorPanel();
            });

            L.DomEvent.on(geoJSONPanelButton, 'click', this.showPanel, this)

            return geoJSONPanelButton;

        },
        createPanel: function(map){
            var mapContainer = map.getContainer();
            var bottomRightPanel = this._panel = L.DomUtil.create('div', 'bottom-right-panel', mapContainer);
            bottomRightPanel.id = "bottomRightPanel";

            var geoJSONPanelContainer = L.DomUtil.create('div', 'geojson-panel-container', bottomRightPanel);
            geoJSONPanelContainer.id = "geoJSONPanelContainer";

            var geoJSONButtonContainer = L.DomUtil.create('div', 'geojson-button-container', geoJSONPanelContainer);
            var geoJSONCloseButton = L.DomUtil.create('button', 'geojson-close-button', geoJSONButtonContainer);
            geoJSONCloseButton.innerText = "Close";
            L.DomEvent.on(geoJSONCloseButton, 'click', this.hidePanel, this);

            var geoJSONContentContainer = L.DomUtil.create('div', 'geojson-content-container', geoJSONPanelContainer);

            var geoJSONTextArea = L.DomUtil.create('textarea', 'geojson-textarea', geoJSONContentContainer);
            geoJSONTextArea.id = "geojsonInput";
            geoJSONTextArea.rows = "12";
            geoJSONTextArea.cols = "30";

            var geoJSONUploadButton = L.DomUtil.create('button', 'geojson-upload-button', geoJSONContentContainer);
            geoJSONUploadButton.innerText = "Upload GeoJSON";
            L.DomEvent.on(geoJSONUploadButton, 'click', function() {
                //Clear anything in coordinate input field
                clearCoordinate()

                uploadGeoJSON(map)
            });


            if (this._panelOnLeftSide) {
                L.DomUtil.addClass(bottomRightPanel, 'left');
            } else {
                L.DomUtil.addClass(bottomRightPanel, 'right');
            }

            return bottomRightPanel;
        },

        isPanelVisible: function () {
            return L.DomUtil.hasClass(this._panel, 'visible');
        },

        showPanel: function () {
            console.log(this);
            if (! this.isPanelVisible()) {
                L.DomUtil.addClass(this._panel, 'visible');
                // Preserve map centre
                this._map.panBy([this.getOffset() * 0.5, 0], {duration: 0.5});

                // Search again as visibility of features might have changed
                //this.searchFeatures(this._input.value);
            }
        },

        hidePanel: function (e) {
            if (this.isPanelVisible()) {
                L.DomUtil.removeClass(this._panel, 'visible');
                // Move back the map centre - only if we still hold this._map
                // as this might already have been cleared up by removeFrom()
                if (null !== this._map) {
                    this._map.panBy([this.getOffset() * -0.5, 0], {duration: 0.5});
                };
                //this.fire('hide');
                if(e) {
                    L.DomEvent.stopPropagation(e);
                }
            }
        },

        getOffset: function() {
            if (this._panelOnLeftSide) {
                return - this._panel.offsetWidth;
            } else {
                return this._panel.offsetWidth;
            }
        },
        onRemove: function (map) {
        }
    })

    var geoJSONPanel = new L.Control.GeoJSONInput(map);
    geoJSONPanel.addTo(map);

}


function uploadGeoJSON(map){
    //TODO Add map to shapeDict
    // OR make another way to clear map
    // Make way to get map geojson into search geojson for api
    var geojsonTextarea = document.getElementById("geojsonInput");
    let geoJSONData;
    var geoJSONLayer = L.geoJson();
    var firstPoint;

    //Clear previously drawn shape/layer from map
    //Remove previously drawn shape/layer from dictionary
    clearShape(shapeDict);

    try{
        JSON.parse(geojsonTextarea.value)
        geoJSONData = JSON.parse(geojsonTextarea.value);
    }
    catch (error){
        var errorDiv = document.getElementById("geoJSONError");
        errorDiv.innerText = error;
    }

    geoJSONLayer.addData(geoJSONData);
    geoJSONLayer.addTo(map);

    //Add geojson layer instead of the individual polygons or entire geojson object to the shapeDict
    geoJSONLayer["shapeType"] = "Map";
    shapeDict["shape"] = geoJSONLayer;
    shapeDict['shapeData'] = geoJSONData;


    firstPoint = geoJSONData["features"]["0"]["geometry"]["coordinates"]["0"]["0"];
    map.flyTo([firstPoint[1], firstPoint[0]], 13);
}


function formatGeoJSON(shapeDict){
    var shapeType = shapeDict['shape']['shapeType'];
    var shape = shapeDict['shape'];
    var currentShapeGeoJSONDiv = document.getElementById("currentShapeGeoJSON");
    var shapeGeoJSON;
    var bounds;
    var bbox
    var stacGeoJSON  = JSON.parse('{"type": "FeatureCollection", "features": [{}]}');

    if(shapeType == "Marker"){
        shapeGeoJSON = shape.toGeoJSON();
        stacGeoJSON["features"] = shapeGeoJSON;
    }else if(shapeType == "Map"){
        stacGeoJSON = shapeDict['shapeData'];
    }
    else{
        shapeGeoJSON = shape.toGeoJSON();
        bounds = shape.getBounds();
        bbox = [bounds._northEast["lat"], bounds._northEast["lng"], bounds._southWest["lat"], bounds._southWest["lng"]]
        shapeGeoJSON["bbox"] = bbox;
        stacGeoJSON["features"] = shapeGeoJSON;
    }

    console.log(stacGeoJSON);
    currentShapeGeoJSONDiv.innerText = JSON.stringify(stacGeoJSON);
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



