mapboxgl.accessToken = 'pk.eyJ1IjoiYWltZXJmYXJpZCIsImEiOiJjanFmZTVsdnIxOTNmNDNuMnp1dWtzbWJiIn0.edYrBRvEfUl0ll83kVDZsg';

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v9',
  center: travel.coordinates,
  zoom: 5
});

// create a HTML element for our post location/marker
var el = document.createElement('div');
el.className = 'marker';

// make a marker for our location and add to the map
new mapboxgl.Marker(el)
  .setLngLat(travel.coordinates)
  .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
  .setHTML('<h3>' + travel.title + '</h3><p>' + travel.location + '</p>'))
  .addTo(map);
