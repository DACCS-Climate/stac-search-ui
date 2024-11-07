
/*
var map = L.map('map').setView([43.6532, -79.3832], 13);//[Lat, long], zoom level

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

function createMenu(){

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

}

