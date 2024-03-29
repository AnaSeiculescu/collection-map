
let search_map = document.getElementById('search-map');

function generate_map(map_el = search_map, lat_val = 51.508742, lng_val = -0.120850, descr_val = 'London') {
    
    let map_options_obj = {
        zoom: 12,
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

function defineCheckBox(tickedOff, id){
    const checkBox = document.createElement("input");
    checkBox.type = "checkbox";
    checkBox.checked = tickedOff;
    checkBox.dataset.id = id;
    checkBox.addEventListener("click", handleCheckboxClick);
    return checkBox;
}

function handleCheckboxClick(event) {
    const checkboxInput = event.target;
    const isChecked = checkboxInput.checked;
    const id = checkboxInput.dataset.id;

    const li = document.querySelector(`li[data-id="${id}"]`);
    li.dataset.checked = isChecked;

    addDecorText(isChecked, id);
}

function addSpace() {
    const space = document.createElement("span");
    space.textContent = " ";
    return space;
}

function addDeleteBox() {
    const deleteBtn = document.createElement("i");
    deleteBtn.classList.add("fa-solid");
    deleteBtn.classList.add("fa-circle-xmark");
    deleteBtn.classList.add("fa-lg");
    deleteBtn.style.color = "#f7ce3e";
    return deleteBtn;
}

function insertElementsTogether(element, box, space, deleteBtn) {
    element.insertAdjacentElement('afterbegin', box);
    element.insertAdjacentElement('beforeend', space);
    element.insertAdjacentElement('beforeend', space);
    element.insertAdjacentElement('beforeend', deleteBtn);
    list_collection.appendChild(element);
}

function addDeleteItem(deleteBtn, id) {
    deleteBtn.addEventListener("click", function() {
        const liToDelete = document.querySelector(`li[data-id="${id}"]`);
        for (let i = 0; i < collection.length; i++) {
            if (collection[i][2].trim() === liToDelete.innerText.trim()) {
                collection.splice(i, 1);
                break;
            }
        }

        liToDelete.remove();

        if (collection.length == 0) {
            document.getElementById("empty-text").style.display = "block";

            let right = document.getElementById("right");
            right.style.width = "0";
            map_collection.style.display = "none";

            document.getElementById("content").classList.remove("flex-container");
            document.getElementById("middle").classList.remove("middle-element");

            document.getElementById("my-collection").click();

            document.getElementById("left").classList.remove("appearance");
            document.getElementById("middle").classList.remove("middle-element-appearance");
        }
        remove_loc_from_collection(); 
    })
}

function addDecorText(isChecked, id) {
    const li = document.querySelector(`li[data-id="${id}"]`);
    if (isChecked) {
        li.style.textDecoration = "line-through 2px red";
    } else {
        li.style.textDecoration = "none";
    }
}

function addCollectionItem(item, tickedOff, id) {
    const element = defineElem(item, id);
    const box = defineCheckBox(tickedOff, id);
    const deleteBtn = addDeleteBox();
    const space = addSpace();
    insertElementsTogether(element, box, space, deleteBtn);
    addDeleteItem(deleteBtn, id);
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

document.getElementById("add-button").onclick = function(event) {
    event.preventDefault();

    let nextId = getNextId();

    console.log(collection.length);
    console.log(new_lat, new_lng);

    if (!new_lat || !new_lng) {
        alert("You must search for a location first!");

    } else if (collection.length == 0) {
        show_collection_map();
        generate_map(map_collection, new_lat, new_lng, new_descr);
        collection.push([new_lat, new_lng, new_descr]);
        addCollectionItem(new_descr, false, nextId);

        document.getElementById("empty-text").style.display = "none";

    } else if (collection.length == 1) {
        let first_lat = collection[0][0];
        let first_lng = collection[0][1];
        if (new_lat == first_lat && new_lng == first_lng) {
            alert("You already collected this location!");
        } else {
            new_loc_in_collection ();
            addCollectionItem(new_descr, false, nextId);
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
                addCollectionItem(new_descr, false, nextId);
            } else {
                alert("You already collected this location!");
            }
        }
    }

    // midd_el.classList.remove("priority");
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
        // zoom: 10,
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

function remove_loc_from_collection() {

    let bound_in_polygon = new google.maps.LatLngBounds();

    for (let i = 0; i < collection.length; i++) {
        bound_in_polygon.extend(new google.maps.LatLng(collection[i][0], collection[i][1]));
    }

    let new_map_options_obj = {
        // zoom: 10,
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
// let middle = document.getElementById("middle");

function show_collection_map() {
    left.classList.remove("appearance-none");
    // midd_el.classList.add("priority");

    if (left.classList.contains("appearance-none")) {
        
        // document.getElementById("middle").classList.add("priority");
        // jQuery("#left.appearance-none").css({'transition': 'width 2s'});
        // jQuery("#middle.midd-el none priority").css({'transition': 'width 3s'});

        // left.style.transition = "width 1s";
        // midd_el.style.transition = "width 4s";

    }

    let right = document.getElementById("right");
    right.style.width = "100%";
    right.style.transition = "width 1s";
    document.getElementById("middle").style.transition = "width 2s";
    map_collection.style.display = "block";

    // jQuery("#content").toggleClass("flex-container");  
            // asta de deasupra aici, ramane in locul celui de dedesupt dupa ce collection-map va disparea la stergerea ultimului item din lista
    document.getElementById("content").classList.add("flex-container");
    // jQuery("#middle").toggleClass("middle-element");

    document.getElementById("middle").classList.add("middle-element");
    // document.getElementById("middle").classList.add("priority");
    // document.getElementById("empty-text").style.display = "none";

            
}

document.getElementById("my-collection").onclick = function(ev) {
    ev.preventDefault();

    // if (midd_el.classList.contains("priority")) {
    //     midd_el.classList.remove("priority");
    // }

    if (collection.length == 0) {
        jQuery("#middle").toggleClass("none");
        jQuery("#left").toggleClass("appearance-none");   

    } else if (collection.length > 0) {
        jQuery("#left").toggleClass("appearance");
        jQuery("#middle").toggleClass("middle-element-appearance");
    }

    if (left.classList.contains("appearance")) {
        left.style.transition = "width 2s";
        midd_el.style.transition = "width 1s";
        // midd_el.classList.remove("priority");
    } else {
        left.style.transition = "width 1s";
        midd_el.style.transition = "width 2s";
    }

}





