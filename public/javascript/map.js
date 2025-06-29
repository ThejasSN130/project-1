const coords = ol.proj.fromLonLat(28, 77);

const map = new ol.Map({
  target: "map",
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM(),
    }),
  ],
  view: new ol.View({
    center: coords,
    zoom: 12,
  }),
});

const marker = new ol.Feature({
  geometry: new ol.geom.Point(coords),
});

const markerLayer = new ol.layer.Vector({
  source: new ol.source.Vector({
    features: [marker],
  }),
});

map.addLayer(markerLayer);

console.log(`Map initialized with coordinates: ${lon}, ${lat}`);
