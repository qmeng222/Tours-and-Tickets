const locations = JSON.parse(document.getElementById('map').dataset.locations);
// console.log(locations);

mapboxgl.accessToken =
  'pk.eyJ1IjoicW1lbmcyMjIiLCJhIjoiY2xkNDV5MDNxMDZpbDNwcmt2djZsZ2RzOSJ9.xnsG6ylmbFR9TpLz3FMrCA';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/qmeng222/cld49y3t7000601tnkrfimbmy',
  scrollZoom: false,
  // center: [-118.113491, 34.111745],
  // zoom: 4,
  // interactive: false,
});

// this bounds object is the area that will be displayed on the map:
const bounds = new mapboxgl.LngLatBounds();

locations.forEach((loc) => {
  // create marker (the green map pin defined in style.css):
  const el = document.createElement('div');
  el.className = 'marker';

  // add marker:
  new mapboxgl.Marker({
    element: el,
    anchor: 'bottom',
  })
    .setLngLat(loc.coordinates)
    .addTo(map);

  // add popup to displays info about the location:
  new mapboxgl.Popup({
    offset: 30, // to avoid marker-info overlap
  })
    .setLngLat(loc.coordinates)
    .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
    .addTo(map);

  // extend map bounds to include current location (moves and zooms the map right to the bounds to actually fit all markers):
  bounds.extend(loc.coordinates);
});

map.fitBounds(bounds, {
  padding: {
    top: 200,
    bottom: 150,
    left: 100,
    right: 100,
  },
});
