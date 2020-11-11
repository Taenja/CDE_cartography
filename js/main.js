// Initializing the map
var map = L.map('map');
map.setView([47.8095, 13.0550], 12);

// Adding base layer
var baseLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 19
})
baseLayer.addTo(map);

// Adding side bar
var sidebar = L.control.sidebar('sidebar').addTo(map);

// Adding scale
L.control.scale({position:'bottomright', imperial:false}).addTo(map);

// Adding marker 1
var icon1 = L.icon({
	iconUrl: 'Data/Image/department.png',
	iconSize: [30, 30]
	});
var department = L.marker([47.823629, 13.039131], {icon: icon1, clickable: true }).addTo(map);
department.bindPopup("Interfaculty Department of Geoinformatics");

// Adding marker 2
var icon2 = L.icon({
	iconUrl: 'Data/Image/university.png',
	iconSize: [30, 30]
	});
var uni = L.marker([47.797362, 13.048683], {icon: icon2, clickable: true }).addTo(map);
uni.bindPopup("University of Salzburg");

var dormIcon = {
	radius : 8.5,
	fillColor: "#6699ff",
    color: "#ffffff",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.9
};
 
//Adding geoJSON data
var points = $.getJSON("Data/dormitory.geojson", function(hoodData) {
	geojson = L.geoJson(hoodData, {
		onEachFeature: onEachFeature,
		pointToLayer: function(feature,latlng) {
		  var marker = L.circleMarker(latlng, dormIcon);
		  marker.bindPopup("<center><img src=" + feature.properties.image + " width='50%'></img></center>"+ '<br>'+'<b> Name: </b>' + feature.properties.Name + '<br>' + '<b> Address: </b>' + feature.properties.HouseNumber +
		  '<br>' + feature.properties.Street + '<br>' + '<b> RoomType: </b>' + feature.properties.RoomType + '<br>' + '<b> Rent/Month (Euro): </b>'
		  + feature.properties.Rent + '<br>' + '<b> Distance from University: </b>' + feature.properties.DUni
		  + '<br>' + '<b> Distance from TechnoZ: </b>' + feature.properties.DT + '<br>' + '<b> Website: </b>' +
		  "<a href='" + feature.properties.website + "'>" + feature.properties.website + "</a>"
		  );
		  return marker;
		}
	  }).addTo(map);
});

// add salzburg city outline
var cityStyle = {
	"color": "#666699",
	"fillColor": "#ffffff",
    "weight": 3,
    "opacity": 1
};
L.geoJSON(salz, {
	style: cityStyle
	
}).addTo(map);

//function zoomToFeature(e)
//{
//  var latLngs = [e.target.getLatLng()];
//  var markerBounds = L.latLngBounds(latLngs);
//  map.fitBounds(markerBounds);
//} 		

function highlightFeature(e) {
    var layer = e.target;
    layer.setStyle({
        weight: 5,
        color: 'yellow',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
}

function resetHighlight(e) {
    geojson.resetStyle(e.target);
}

function onEachFeature(feature, layer) {
    layer.on({
		mouseover: highlightFeature,
		mouseout: resetHighlight
    });
}

// Layer control
var department = L.layerGroup([department]);
var uni = L.layerGroup([uni]);

var baseMaps = {
    "Grayscale": baseLayer,
    "Streets": baseLayer
};
L.control.layers(null, {"University": uni, "department":department}).addTo(map);
