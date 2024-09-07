// Initialize the map
var map = L.map('map').setView([20, 0], 2);

// Add a tile layer (basemap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Function to set marker size based on magnitude
function markerSize(magnitude) {
    return magnitude * 4;
}

// Function to set marker color based on depth
function markerColor(depth) {
    return depth > 90 ? '#FF0000' :
           depth > 70 ? '#FF4500' :
           depth > 50 ? '#FFA500' :
           depth > 30 ? '#FFD700' :
           depth > 10 ? '#ADFF2F' : '#00FF00';
}

// Load the GeoJSON data from USGS
var url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson';


// Fetch the earthquake GeoJSON data using D3
d3.json(url).then(function(data) {
    // Add earthquake markers to the map
    L.geoJSON(data, {
        pointToLayer: function (feature, latlng) {
            var mag = feature.properties.mag;
            var depth = feature.geometry.coordinates[2];
            
            return L.circleMarker(latlng, {
                radius: markerSize(mag),
                fillColor: markerColor(depth),
                color: '#000',
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        },
        onEachFeature: function (feature, layer) {
            layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>Magnitude: ${feature.properties.mag}<br>Depth: ${feature.geometry.coordinates[2]} km</p>`);
        }
    }).addTo(map);
});

/// Add a legend
var legend = L.control({ position: 'bottomright' });

legend.onAdd = function () {
    var div = L.DomUtil.create('div', 'info legend'),
        depths = [-10, 10, 30, 50, 70, 90],  // Depth intervals
        colors = ['#00FF00', '#ADFF2F', '#FFD700', '#FFA500', '#FF4500', '#FF0000'],  // Corresponding colors
        labels = [];

    div.innerHTML += "<h4>Depth (km)</h4>";

    // Loop through depth intervals and create a label with a colored square for each interval
    for (var i = 0; i < depths.length; i++) {
        labels.push(
            '<i style="background:' + colors[i] + '">&nbsp&nbsp&nbsp&nbsp</i> ' + 
            depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + ' km<br>' : '+ km')
        );
    }

    div.innerHTML += labels.join('');
    return div;
};

legend.addTo(map);