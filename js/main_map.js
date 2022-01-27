//var map = L.mapbox.map('map').setView([23.744271,38.023349], 14);
//var accessToken = "pk.eyJ1IjoiY29mbHliYiIsImEiOiJja2sybjBtcjExMzNwMm5vNTd6dDFoNTVsIn0.MZttxhCpctPxyPZw7KC16Q";
//L.mapbox.accessToken = accessToken;
//var map = L.mapbox.map("map").setView([40.595409521631176,23.039895966293173], 13);
L.mapbox.accessToken = 'pk.eyJ1IjoiZWdnbGV6b3NrIiwiYSI6ImNra2Z0NndyczBsYTUydm43Yjh3bDRvMHUifQ.cvUwSVInY69HPVpp1YdVIA';
var map = L.mapbox.map('map')
    .setView([40.57421474094349, 22.99714166131528], 18)
    .addLayer(L.mapbox.styleLayer('mapbox://styles/mapbox/satellite-v9'));

//var map = L.mapbox.map('map').setView([40.595409521631176,23.039895966293173], 18);
//var map = L.mapbox.map('map').setView([40.595409521631176,23.039895966293173], 18);




// Add layers to the map
/*
L.control.layers({
    'Satellite Map': L.mapbox.tileLayer('mapbox.satellite', {
        detectRetina: true
    }).addTo(map),
    'Terrain Map': L.mapbox.tileLayer('mapbox.mapbox-terrain-v2', {
        detectRetina: true
    })
}).addTo(map);
*/


var featureGroup = L.featureGroup().addTo(map);

var drawControl = new L.Control.Draw({
    edit: {
        featureGroup: featureGroup
    }
}).addTo(map);

map.on('draw:created', function(e) {

    // Each time a feaute is created, it's added to the over arching feature group
    featureGroup.addLayer(e.layer);
    /*
    var geojsonArea = require('@mapbox/geojson-area');

    var data = featureGroup.toGeoJSON();
    var area = geojsonArea.geometry(data["features"][0]["geometry"]);
    console.log(area);
    var acres = area * 0.00024711;
    jQuery('#acres_num').text(acres.toFixed(2) + ' Acres');
*/

});
//C:\Users\keglezos\Desktop\out_of\Resulted_Vis_image_representations\14-09-2020
//C:/Users/keglezos/Desktop/test.png


/* 
πανω: 40.57421474094349, 22.99714166131528
κατω: 40.57170592118361, 23.000285736115654
*/



map.on('draw:edited', function(e) {

    //featureGroup.addLayer(e.layer);
    var geojsonArea = require('@mapbox/geojson-area');

    var data = featureGroup.toGeoJSON();
    var area = geojsonArea.geometry(data["features"][0]["geometry"]);
    var acres = area * 0.00024711;
    jQuery('#acres_num').text(acres.toFixed(2) + ' Acres');

});


// on click, clear all layers
document.getElementById('delete').onclick = function(e) {
    featureGroup.clearLayers();
}


// SAVE PROJECT / CREATE FILE
jQuery('div#save_button').click(function() {

    if(jQuery('.leaflet-pane.leaflet-overlay-pane svg').length == 0){
        //console.log('teas');
        jQuery('div#pop_up_container').fadeIn(); 
    }
    //Prepare export data
    // Extract GeoJson from featureGroup
    var data = featureGroup.toGeoJSON();
    var polygonCenter = require('geojson-polygon-center');
    var center = polygonCenter(data["features"][0]["geometry"]);
    localStorage.setItem("LoadedProjectCenter", center["coordinates"][0] + ',' + center["coordinates"][1]);
    console.log("Center: " + center["coordinates"][0] + "," + center["coordinates"][1]);
    // Stringify the GeoJson
    var convertedData = 'text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data));

    var load_centers = load_projects_centers();
    var lentgh_centers = load_centers.split(",");
    console.log(lentgh_centers.length);
    var prepare_data = "";
    for (var in_i = 0; in_i < lentgh_centers.length; in_i++) {
        prepare_data += lentgh_centers[in_i] + ",";
    }
    prepare_data += "plan_name:" + jQuery('input#plan_name').val() + ";x:" + center["coordinates"][0] + ";y:" + center["coordinates"][1];
    console.log(prepare_data);
    //grab_data();

    if (jQuery('input#plan_name').val() == "" || data == 'undefined') {
        
        jQuery('div#pop_up_container').fadeIn();
        alert('not plan name found OR DATA');
    } else {

        /*/ LOAD PROJECT
        $.getJSON("C:/Users/ENGLEZOS/Desktop/data.geojson",function(data){
        // L.geoJson function is used to parse geojson file and load on to map
        L.geoJson(data).addTo(map);
        });
        */

        /*
        
        1. Na tsekarw ean uparxei idi to onoma sta centers kai na mhn to apothikeuw.
        2. Na emfanizetai sxetiko mnm gia to parapanw popup oxi alert.
    
        */
        const fs = require("fs");
        fs.mkdir('projects_centers', function() {
            fs.writeFileSync('./projects_centers/centers.txt', prepare_data);
        });
        var plan_name = jQuery('input#plan_name').val();
        const path = require('path');
        var running_on = path.resolve(__dirname);
        console.log(running_on);
        fs.mkdir(running_on + '/projects/' + plan_name, function() {
            fs.writeFileSync(running_on + '/projects/' + plan_name + '/map_data.geojson', JSON.stringify(featureGroup.toGeoJSON()));
            fs.writeFileSync(running_on + '/projects/' + plan_name + '/proj_settings.json', grab_data());
            fs.writeFileSync(running_on + '/projects/' + plan_name + '/disabled_paths.geojson', '');
            fs.writeFileSync(running_on + '/projects/' + plan_name + '/has_indeces.json', '{ "has_indeces": { "value": "0" } }');
            fs.writeFileSync(running_on + '/projects/' + plan_name + '/image_settings.json', '{ "ImageSettings": [ { "title": "", "Rotate": 0, "Top": 0, "Left":0 } ] }');
            fs.writeFileSync(running_on + '/projects/' + plan_name + '/field_actions.json', '{"field_actions":[]}');
            fs.writeFileSync(running_on + '/projects/' + plan_name + '/preview_project.json', '{"Name":"'+plan_name+'", "Center":"'+center["coordinates"][0]+','+center["coordinates"][1]+'" }');
        });

        //Create Dir in Order to save images that drone sends
        fs.mkdir(running_on + '/projects/' + plan_name + '/project_images/', function() {

        });

        // Create Dir in order to save Stiched Images
        fs.mkdir(running_on + '/projects/' + plan_name + '/stiched_images/', function(err) {

            if(err){
                console.log('ERROR CREATING SUBDIR');
                console.log(err);
            }else{
                //
            }
        
        });

       
        var dir = running_on + '/projects/' + plan_name + '/stiched_images/';
        var dir_two = running_on + '/projects/' + plan_name + '/project_images/';

        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }

        if (!fs.existsSync(dir_two)){
            fs.mkdirSync(dir_two);
        }

        

        localStorage.setItem("LoadProject", jQuery('input#plan_name').val());
        window.location = "./load_project.html";
        

        // SAVE PROJECT




    }

    //var data = featureGroup.toGeoJSON();
    //console.log(data["features"][0]["geometry"]);

    // loading GeoJSON file - Here my html and usa_adm.geojson file resides in same folder

    // CLOSE SAVE BUTTON
});

document.getElementById('export').onclick = function(e) {
    var data = featureGroup.toGeoJSON();
    var convertedData = 'text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data));
    // Create export
    document.getElementById('export').setAttribute('href', 'data:' + convertedData);
    document.getElementById('export').setAttribute('download', 'data.geojson');
}


function grab_data() {
    var plan_name = jQuery('input#plan_name').val();
    var calc_minutes = jQuery('span#minutes_calc').text();
    var calc_acres = jQuery('span#acres_num').text();
    var altitude = jQuery('input.input-range--custom.altitude').val();
    var rotation = jQuery('input.input-range--custom.direction').val();

    var prepare_json_project = '{"CoFly": { "Plan_Name":"' + plan_name + '", "Calculated_Minutes":"' + calc_minutes + '","Calculated_Acres":"' + calc_acres + '","Altitude":"' + altitude + '","Rotation":"' + rotation + '","Lock_Project":"0","Scanning_Distance":"0","Gimbal_Pitch":"0","Drone_Speed":"0" } }';

    return prepare_json_project;
    //console.log(prepare_json_project);

}

jQuery('div#exit_button').click(function() {
    window.location = "./index.html";
});

jQuery('.button_all_ok').click(function(){

jQuery('div#pop_up_container').fadeOut();

});

// Function in order to Call User database ( /login_system/users.txt)
function load_projects_centers() {
    var fs = require('fs');
    var contents = fs.readFileSync('./projects_centers/centers.txt', 'utf8');
    return contents;
}
