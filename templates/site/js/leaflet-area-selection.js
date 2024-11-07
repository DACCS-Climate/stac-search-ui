var map = L.map('map', {editable: true});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
map.setView([0,0], 5);


createMenu()

var control = new L.Control.Button();
control.addTo(map);

//map.editTools.startPolyline();  // map.editTools has been created
                                // by passing editable: true option to the map


//import { DrawAreaSelection } from '@bopen/leaflet-area-selection';
//import '@bopen/leaflet-area-selection/dist/index.css';
//import L from 'leaflet';
/*
var map = L.map('map').setView([43.6532, -79.3832], 13);
//const map = L.map('root').setView([41.901493, 12.5009157], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

const areaSelection = new DrawAreaSelection();

map.addControl(areaSelection);

*/
/*
    const map = L.map('map').setView([51.505, -0.09], 13);

        const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        const marker = L.marker([51.5, -0.09]).addTo(map)
            .bindPopup('<b>Hello world!</b><br />I am a popup.').openPopup();

        const circle = L.circle([51.508, -0.11], {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.5,
            radius: 500
        }).addTo(map).bindPopup('I am a circle.');

        const polygon = L.polygon([
            [51.509, -0.08],
            [51.503, -0.06],
            [51.51, -0.047]
        ]).addTo(map).bindPopup('I am a polygon.');


        const popup = L.popup()
            .setLatLng([51.513, -0.09])
            .setContent('I am a standalone popup.')
            .openOn(map);

        function onMapClick(e) {
            popup
                .setLatLng(e.latlng)
                .setContent(`You clicked the map at ${e.latlng.toString()}`)
                .openOn(map);
        }

        map.on('click', onMapClick);

        const areaSelection = new window.leafletAreaSelection.DrawAreaSelection();
        map.addControl(areaSelection);
        */