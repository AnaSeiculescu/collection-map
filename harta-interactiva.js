
let search_map = document.getElementById('search-map');

function generate_map(map_el = search_map, lat_val = 51.508742, lng_val = -0.120850, descr_val = 'London') {
    
    let map_options_obj = {
        zoom: 13,
        center: {lat: lat_val, lng: lng_val},
    }

    let map_obj = new google.maps.Map(map_el, map_options_obj);

    let marker_options_obj = {
        position: map_options_obj.center,
        map: map_obj,
    };

    let marker_obj = new google.maps.Marker(marker_options_obj);

    let info_options_obj = {

        content: '<h4>' + descr_val + '</h4>',

    };

    let info_obj = new google.maps.InfoWindow(info_options_obj);
    info_obj.open(map_obj, marker_obj);

    marker_obj.addListener("click", function(ev) {
        info_obj.open(map_obj, marker_obj);
    });

}

generate_map();

let new_lat
let new_lng
let new_descr

let list_collection = document.getElementById("my-list");

function defineElem(item, id) {
    const theElem = document.createElement("li");
    theElem.dataset.id = id;
    theElem.innerText = item;
    return theElem;
}

let lastId = 0;

function getNextId() {
    lastId ++;
    return(lastId);
}

document.getElementById('search-button').onclick = function(event) {

    event.preventDefault();

    search_new_location();

};

let map_collection = document.getElementById('collection-map');
let collection = [];

const locations_list = [];

document.getElementById("add-button").onclick = function(event) {

    event.preventDefault();

    let nextId = getNextId();
    const elem = defineElem(new_descr, nextId);

    console.log(collection.length);
    console.log(new_lat, new_lng);

    if (!new_lat || !new_lng) {

        alert("You must search for a location first!");

    } else if (collection.length == 0) {

        show_collection_map();
        generate_map(map_collection, new_lat, new_lng, new_descr);
        collection.push([new_lat, new_lng, new_descr]);

        list_collection.appendChild(elem);

        

    } else if (collection.length == 1) {

        let first_lat = collection[0][0];
        let first_lng = collection[0][1];

        if (new_lat == first_lat && new_lng == first_lng) {
            alert("You already collected this location!");
        } else {
            new_loc_in_collection ();

            list_collection.appendChild(elem);
        }

    } else {

        if ( collection.length > 1 ) {
    
            let good_for_collection = true;

            for (let k = 0; k < collection.length; k++) {

                let old_lat = collection[k][0];
                let old_lng = collection[k][1];

                if (new_lat == old_lat && new_lng == old_lng) {
                    good_for_collection = false;
                } 

            }

            if (good_for_collection) {
                new_loc_in_collection ();

                list_collection.appendChild(elem);
            } else {
                alert("You already collected this location!");
            }
    
        }

    }

};

function search_new_location() {

    let search_str = document.getElementById('search-box').value;

    let geocoder_obj = new google.maps.Geocoder();

    geocoder_obj.geocode({address: search_str}, function(results, status) {

        if (!results || status == "ZERO_RESULTS") {
            alert("Location not found!");
        } else {
            console.log(results);

            new_lat = results[0].geometry.location.lat();
            new_lng = results[0].geometry.location.lng();
            new_descr = results[0].formatted_address;

            generate_map(search_map, new_lat, new_lng, new_descr);
        }

    });

}

function new_loc_in_collection () {

    collection.push([new_lat, new_lng, new_descr]);

    let bound_in_polygon = new google.maps.LatLngBounds();

    for (let i = 0; i < collection.length; i++) {
        bound_in_polygon.extend(new google.maps.LatLng(collection[i][0], collection[i][1]));
    }

    let new_map_options_obj = {
        zoom: 10,
        center: bound_in_polygon.getCenter(),
    };

    let new_map_obj = new google.maps.Map(map_collection, new_map_options_obj);

    let marker

    for (let j = 0; j < collection.length; j++) {

        marker = new google.maps.Marker({
            position: new google.maps.LatLng(collection[j][0], collection[j][1]),
            map: new_map_obj,
            title: collection[j][2],
            content: '<h4>' + collection[j][2] + '</h4>',
        });

        let infowindow_options_obj = {
            content: '<h4>' + collection[j][2] + '</h4>',
        };

        let infowindow = new google.maps.InfoWindow(infowindow_options_obj);
        infowindow.open(new_map_obj, marker);
        google.maps.event.addListener(marker, 'click', function() {
            infowindow.setContent(this.content);
            infowindow.open(this.getMap(), this);
        });

    }

    new_map_obj.fitBounds(bound_in_polygon, 90);

}

let left = document.getElementById("left");
let midd_el = document.getElementsByClassName("midd-el")[0];

function show_collection_map() {

    let right = document.getElementById("right");
    right.style.width = "100%";
    map_collection.style.display = "block";

    jQuery("#content").toggleClass("flex-container");
    jQuery("#middle").toggleClass("middle-element");

    document.getElementById("empty-text").remove();

        if (left.classList.contains("appearance-none")) {
            left.classList.remove("appearance-none");
        }    

}

document.getElementById("my-collection").onclick = function(ev) {

    ev.preventDefault();

    if (collection.length == 0) {
        jQuery("#middle").toggleClass("none");
        jQuery("#left").toggleClass("appearance-none");   

    } else if (collection.length > 0) {
        jQuery("#left").toggleClass("appearance");
        jQuery("#middle").toggleClass("middle-element-appearance");
    }

    if (left.classList.contains("appearance")) {
        left.style.transition = "width 2.5s";
        midd_el.style.transition = "width 1s";
    } else {
        left.style.transition = "width 1s";
        midd_el.style.transition = "width 2s";
    }

}




