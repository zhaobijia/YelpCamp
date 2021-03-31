

mapboxgl.accessToken = maptoken;
const camp = JSON.parse(campground);
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/outdoors-v11', // style URL
    center: camp.geometry.coordinates, // starting position [lng, lat]
    zoom: 7 // starting zoom
});

var marker = new mapboxgl.Marker()
    .setLngLat(camp.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 20 })
            .setHTML(
                `<h5>${camp.title}</h5>`
            )
    )
    .addTo(map);
