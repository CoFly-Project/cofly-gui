const { off } = require('process');

jQuery(document).ready(function() {

        
        if(localStorage.getItem("MQTT_HOST") == null){
            localStorage.setItem("MQTT_HOST","");
            localStorage.setItem("MQTT_PORT","");

            jQuery('#communication_server').removeClass('online');
            jQuery('#communication_server').addClass('offline');
        }else{
            jQuery('#mqtt_host').val(localStorage.getItem("MQTT_HOST"));
            jQuery('#mqtt_port').val(localStorage.getItem("MQTT_PORT"));
        }

        // Dynamic Configuration for MQTT Connection
        var g_host = localStorage.getItem("MQTT_HOST");
        var g_port = localStorage.getItem("MQTT_PORT");

        // NEW MQTT 
        var mqtt = require('mqtt')
        var client  = mqtt.connect('mqtt://'+g_host+':'+g_port);
        var can_save_image = false;
        var camera_topic;
        //alert('eftasa');
    
        client.on('connect', function () {
            console.log('MQTT SERVER SUCCESSFULLY CONNECTED');

            jQuery('#communication_server').removeClass('offline');
            jQuery('#communication_server').addClass('online');
            
            client.subscribe('telemetry/dji.phantom.4.pro.hawk.1', function (err) {
                if (!err) {
                    client.publish('presence', 'Hello mqtt')
                }else{
                    console.log(err);
                }
            })
            
    
            client.subscribe('camera/dji.phantom.4.pro.hawk.1', function (err) {
                if (!err) {
                    client.publish('presence', 'Hello mqtt')
                }
            })
    
            client.subscribe('missionStatus/dji.phantom.4.pro.hawk.1', function (err) {
                if (!err) {
                    client.publish('presence', 'Hello mqtt')
                }
            })
    
            client.subscribe('missionStart/dji.phantom.4.pro.hawk.1', function (err) {
                if (!err) {
                    client.publish('presence', 'Hello mqtt')
                }
            })
    
            
    
        })
    
        client.on('disconnect', function () {
            console.log('MQTT DISCONNECTED');
        })
        var image_id =0;
        client.on('message', function (topic, message) {
            // message is Buffer
            console.log(topic)
            
            // Camera Topic
            if(topic.toString().indexOf("camera/dji.phantom.4.pro.hawk.1") != -1){
                //console.log('REA CAMERA');
                if (can_save_image){
                    image_id++;
                //console.log('Receive Camera');
                camera_topic = JSON.parse(message);
                console.log(camera_topic);
                if(camera_topic.image == null){
                    console.log('Null Photo');
                    return
                }
                var base64Data = camera_topic.image.replace(/^data:image\/png;base64,/, "");
                const uuidv4 = require('uuid/v4'); // I chose v4 ‒ you can select others
                //var filename = uuidv4(); // '110ec58a-a0f2-4ac4-8393-c866d813b8d1'
                var filename = 'ID_'+image_id+'_UAV_dji.phantom.4.pro.hawk.1_[Lat='+camera_topic.latitude+',Lon='+camera_topic.longitude+',Alt='+camera_topic.altitude+']_DATE_'+camera_topic.timestamp;
                // 'ID_'+image_id'+_UAV_dji.phantom.4.pro.hawk.1_[Lat='+camera_topic.latitude+',Lon='+camera_topic.longitude+',Alt='+camera_topic.altitude+']_DATE_'+timestamp
                // ID_0_UAV_dji.phantom.4.pro.hawk.1_[Lat=40.573284372317666,Lon=22.998578042988207,Alt=21.200000762939453]_DATE_24_07_2020_20_35_4467f3f951-7e7f-4757-8025-8e6855981a66
        
                require("fs").writeFile(localStorage.getItem('Save_Image_Path') +'/' + filename + '.jpg', base64Data, 'base64', function(err) {
                
                    if(err){
                        console.log(err);
                    }else{
                        //print_project_gallery();
                        console.log('SAVE DONE');
                    }
                });
    
                }
                
            }
            // End Camera Topic 
    
            // Telemetry Topic
            if(topic.toString().indexOf("telemetry/dji.phantom.4.pro.hawk.1") != -1){
    
                //console.log('Receive Camera');
                telemetry_topic = JSON.parse(message);
                latitude = telemetry_topic.latitude
                longitude = telemetry_topic.longitude
    
                //console.log(latitude,longitude);
    
                jQuery('.leaflet-marker-pane img').remove();
    
                // draw new marker [Current] drone location

           

                if(latitude == "37.316314"){
                    console.log('demo_position');
                    var marker = L.marker(
                        [40.57300986880264, 22.99893490662799], {
                            title: 'Drone Current Position',
                            icon: drone_icon
                        }
                    ).addTo(map);
            
                    //map.panTo(new L.LatLng(40.57300986880264, 22.99893490662799));
                }else{

                    var marker = L.marker(
                        [latitude,longitude], {
                            title: 'Drone Current Position',
                            icon: drone_icon
                        }
                    ).addTo(map);
            
                    //map.panTo(new L.LatLng(latitude, longitude));

                }
             
                
                 
            }
            // End Telemetry
    
            // Mission Status
            if(topic.toString().indexOf("missionStatus/dji.phantom.4.pro.hawk.1") != -1){
    
                //console.log('Receive status');
                //console.log(message);
                var missionStatusData = JSON.parse(message.toString());
                var mission_status = missionStatusData.missionStatus;
                if(mission_status == "ONROUTE"){
                    can_save_image = true;
                    console.log('SAVE IMAGE');
                }else if(mission_status == "ABORTED"){
                    can_save_image = false;
                }else if(mission_status == "COMPLETED"){
                    can_save_image = false;
                    scan_complete();
                    scan_completed();
                    //alert('fe');
                }
                console.log(mission_status);

                 
            }
            // End Status
    
    
            // Mission Start
            if(topic.toString().indexOf("missionStart/dji.phantom.4.pro.hawk.1") != -1){
    
                console.log('Receive start');
                //console.log(message.toString());
                    
            }
            // End Status
    
    
    
            // client.end()
        })
    
        // Click to Start And send mission
        /* 
        {
       "timestamp":1591881061228,
       "missionId":"ee31b81e-ceaf-4539-8f97-a225f258ff31",
       "destinationSystem":"dji.phantom.4.pro.hawk.1",
       "sourceSystem":"choosepath-backend",
       "speed":10.0,
       "timeout":1800.0,
       "cornerRadius":2.0,
       "gimbalPitch":-87.0,
       "waypoints":[
          {
             "latitude":38.023959787799186,
             "longitude":23.743319065035404,
             "altitude":35.0
          },
          {
             "latitude":38.02260849889491,
             "longitude":23.743339065022948,
             "altitude":35.0
          }
       ]
    }
    
    
        */


    //var pathsad = require("path");
    //console.log(pathsad.resolve(__dirname, './projects/').replace(/\\/g,"/")+ "/" +localStorage.getItem("LoadProject") + "/project_images/");

    // Create Drone Location Marker
    var drone_icon = L.icon({
        iconUrl: 'img/our_marker.png',
        /*shadowUrl: 'img/leaf-shadow.png',*/
        iconSize: [50, 73], // size of the icon
        shadowSize: [50, 64], // size of the shadow
        iconAnchor: [25, 70], // point of the icon which will correspond to marker's location
        shadowAnchor: [4, 62], // the same for the shadow
        popupAnchor: [0, -76] // point from which the popup should open relative to the iconAnchor
    });



    // Create Mark for photo indeces marker
    var alert_indeces = L.icon({
        iconUrl: 'img/Alert_Indeces.png',
        /*shadowUrl: 'img/leaf-shadow.png',*/
        iconSize: [50, 73], // size of the icon
        shadowSize: [50, 64], // size of the shadow
        iconAnchor: [25, 70], // point of the icon which will correspond to marker's location
        shadowAnchor: [4, 62], // the same for the shadow
        popupAnchor: [0, -76] // point from which the popup should open relative to the iconAnchor
    });
    
    

    //print_project_gallery();
    var show_slide = true;

    // check if load project exists
    var project_path = localStorage.getItem("LoadProject");
    load_project_calulated_path();
    draw_stiched_image();

    var get_center = localStorage.getItem("LoadedProjectCenter");
    var clean_center = get_center.split(",");


    // Initialize map
    /*
    var accessToken = "pk.eyJ1IjoiY29mbHliYiIsImEiOiJja2sybjBtcjExMzNwMm5vNTd6dDFoNTVsIn0.MZttxhCpctPxyPZw7KC16Q";
    L.mapbox.accessToken = accessToken;
    var map = L.mapbox.map('map').setView([parseFloat(clean_center[1]), parseFloat(clean_center[0])], 17);
    */

    L.mapbox.accessToken = 'pk.eyJ1IjoiZWdnbGV6b3NrIiwiYSI6ImNra2Z0NndyczBsYTUydm43Yjh3bDRvMHUifQ.cvUwSVInY69HPVpp1YdVIA';
var map = L.mapbox.map('map')
    .setView([parseFloat(clean_center[1]), parseFloat(clean_center[0])], 18)
    .addLayer(L.mapbox.styleLayer('mapbox://styles/mapbox/satellite-v9'));
    map.scrollWheelZoom.disable();

    //map.addControl(new mapboxgl.NavigationControl());

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





    // Ftiaxnw ton marker gia tis eikones pou erxontai
    var image_icon = L.icon({
        iconUrl: 'img/1pixel_transparent.png',
        /*shadowUrl: 'img/leaf-shadow.png',*/

        iconSize: [50, 73], // size of the icon
        /*
        shadowSize: [50, 64], // size of the shadow
        //iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
        iconAnchor: [25, 70], // point of the icon which will correspond to marker's location
        shadowAnchor: [4, 62], // the same for the shadow
        */
        popupAnchor: [0, 0] // point from which the popup should open relative to the iconAnchor

    });
    
    /* Apofugei empodiwn draw new polygons */
    
    console.log(disabled_paths());
    map.on('draw:created', function(e) {
        //alert('Create new');
        /* 
        var disabledStyleF = {
            "className" : "DisabledPathDraw"
        };
        e.layer.options = disabledStyleF;
        */
        //console.log(e.layer);
        e.layer.options.className = "DisabledPathDraw";
        // Each time a feaute is created, it's added to the over arching feature group
        featureGroup.addLayer(e.layer);
        all_new_disabled_paths = featureGroup.toGeoJSON();
        var old_disabled = disabled_paths_read();
        temp_json = JSON.stringify(all_new_disabled_paths["features"]).slice(0,-1);
        if(old_disabled == "" || old_disabled == " "){
            //alert('einai adeio');
            fs.writeFileSync('./projects/' + project_path.replace(" ", "") + '/disabled_paths.geojson','{"type":"FeatureCollection","features":['+temp_json.slice(1) + ']}');
        }else{
            var old_disabled = disabled_paths_read().slice(0,-2);
            console.log(old_disabled + ','+ temp_json.slice(1) + ']}');
            fs.writeFileSync('./projects/' + project_path.replace(" ", "") + '/disabled_paths.geojson', old_disabled + ','+ temp_json.slice(1) + ']}');
        }
        
    });



    const path = require('path');
    /* LISTEN NEW SERVICE  UPLOAD FILE TO PROJECT FILE */
    const express = require('express');
    const multer = require('multer');
    const upload = multer();
    var bodyParser = require("body-parser");
    const fs = require('fs');

    var app = express();
    app.use(express.static(__dirname));
    app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
    app.use(bodyParser.json());


    app.post('/scan_completed', function(req, res) {

        var path = req.body;
        //alert('Job Done');
        console.log(path);
        can_save_image = false;
        show_slide = true;
        res.status(200).send('ok');

        jQuery('#scan_completed').fadeIn();
        jQuery('div#start_scanning').fadeIn();
        jQuery('div#cancel_scanning').fadeOut();

        var get_center = localStorage.getItem('LoadedProjectCenter').split(",");
        // create link depending the center of project and call the weather api 
        jQuery.get( 'http://api.openweathermap.org/data/2.5/weather?lat='+get_center[1]+'&lon='+get_center[0]+'&APPID=f6f1b45b882965c039fae9390a8250e4', function( data ) {
            console.log(data);

            var wind_speed = data.wind["speed"];
            var max_temp = Math.abs(data.main["temp_max"]-272.15);
            var min_temp = Math.abs(data.main["temp_min"]-272.15);
            var humidity = data.main["humidity"];
            var weather_description = data.weather[0]["description"];

            let unix_timestamp = data.sys["sunset"];
            var date = new Date(unix_timestamp * 1000);
            var hours = date.getHours();
            var minutes = "0" + date.getMinutes();
            var seconds = "0" + date.getSeconds();
            var sunset = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
            
            //console.log(parseInt(max_temp),parseInt(min_temp),humidity,wind_speed,sunset,weather_description);
            // Set Content 
            jQuery('span#weather_desc').text(weather_description);
            jQuery('.weather_stats ul li:nth-child(1) p').text(parseInt(min_temp) + ' - ' + parseInt(max_temp) + ' °C');
            jQuery('.weather_stats ul li:nth-child(2) p').text(humidity + ' %');
            jQuery('.weather_stats ul li:nth-child(3) p').text(wind_speed + ' km/h');
            jQuery('.weather_stats ul li:nth-child(4) p').text(sunset);

          });


    });



    // Receive data to trigger save image
    app.post('/can_save_image', function(req, res) {

        can_save_image = true;
        res.status(200).send('ok');
        

    });
    

    // To python script apo KETA stelnei se auto to link to ypologismeno monopati pou tha akoloutheisei to drone.

   app.post('/calculated_path', function(req, res) {
        
            //console.log(req.body);

            // Remove extra layer if exist from previous calculation
            if(jQuery('.CalculatedPathRender').length > 0){
                jQuery('.CalculatedPathRender').remove();
            }
    
            var path = req.body;
            console.log(path);
            var pointList = [];
        
            for (var points = 0; points < path.DataObject.path.waypoints.length; points++) {
    
                //var tmp_point = new L.LatLng(path.DataObject.path.waypoints[points]);
    
    
                var test = String(path.DataObject.path.waypoints[points]);
                //console.log(test);
                var res_g = test.split("{latitude: ", 3);
                var res_t = test.split(", lognitude :", 3);
                var lon = res_t[1].split(" }", 3);
                var lat = res_g[1].split(" ,", 3);
    
                var tmp_point = new L.LatLng($.trim(lon[0]), $.trim(lat[0]));
                pointList.push(tmp_point);
            }
        //console.log(pointList);
        var firstpolyline = new L.Polyline(pointList, {
            color: 'white',
            weight: 3,
            opacity: 0.8,
            smoothFactor: 1,
            className : 'CalculatedPathRender'
        });
        // This is an amazing polyline in order to communicate 
        firstpolyline.addTo(map);

        //console.log(pointList);

        res.status(200).send('Path Received');

        jQuery('#pop_up_container').fadeOut();
        //jQuery('div#calculate_path_planing').fadeOut();
        jQuery('div#start_scanning').fadeIn();
        jQuery('.button_all_ok').attr('style', 'display:block;');
        jQuery('path.leaflet-clickable').first().attr('style','fill:transparent;');

        // Exei lifthei to monopati opote to apothikeuw se arxeio ston fakelo tou project

        // register variables in order to send it to json
        var altitude = jQuery('#altitude_show').val().split("m", 2);
        var gimbal_pitch = jQuery('input#gimbal_pitch').val().split("°", 2);
        var n_speed = jQuery('input#drone_speed').val().split("m/s", 2);

        var create_json = '{ "SenderID":"IKHEditor", "DataObject": { "generated_path": { "waypoints": ' + JSON.stringify(pointList) + ' , "altitude": ' + parseFloat(altitude[0]) + ', "speed": ' + parseFloat(n_speed[0]) + ', "Gimbal Pitch": ' + parseFloat(gimbal_pitch[0]) + ' } } }';

        // get pathname of project
        var plan_name = jQuery('input#plan_name').val();
        console.log('Trying to create the folder');
        // make dir if does not exist and create file with path included
        fs.mkdir('./projects/' + plan_name + '/paths', function() {
            fs.writeFileSync('./projects/' + plan_name + '/paths/calculated_path.json', JSON.stringify(create_json));
        });


    });

    // Calculate Path Error Return PopUp Box + Error Text from DICT
    app.post('/calculation_path_error', function(req, res) {
        console.log(req.query.error_code);
        jQuery('.f-modal-alert').fadeIn(); 
        jQuery('.error_popup_title').text('Demo Beta Error: ' + req.query.error_code); 
        res.status(200).send('OK');
        setTimeout(function(){
            jQuery('.f-modal-alert').fadeOut(); 
     }, 5000);

    });
    



    app.listen(process.env.PORT || 8081);




    // Function pou deixnei slide message gia kapoia wra kai meta to krubei 
    function show_slide_message(message_string) {
        jQuery('.slide_messages ul p').text(message_string);

        if (show_slide) {
            show_slide = false;
            jQuery(".slide_messages ul").animate({
                width: 'toggle'
            }, 350);

        }

        //setimout
        setTimeout(function() {

            jQuery(".slide_messages ul").animate({
                width: 'toggle'
            }, 350);

        }, 5000);

        setTimeout(function() {

            //show_slide = true;

        }, 10000);




    }


    // Calculate path button trigger
    jQuery('div#calculate_path_planing').click(function() {

        console.log('Calculate Path Triggered');
        const fixPath = require('fix-path');
//=> '/usr/local/bin:/usr/bin'
        // RUN EXCECUTABLE HERE

    var child = require('child_process').execFile;
    var final_path = path.resolve(__dirname+'/third_party_plugins/PathPlanning', 'GeoCordinates.exe');
    console.log(final_path);
    var executablePath = final_path;
    var running_on = path.resolve(__dirname);
    var parameters = [running_on.replace(/\\/g, "/") + "/projects/"+localStorage.getItem("LoadProject").trim()+"/map_data.geojson", running_on.replace(/\\/g, "/") +"/projects/"+localStorage.getItem("LoadProject").trim()+"/disabled_paths.geojson", jQuery('input#direction_show').val().slice(0,-1), jQuery('input#scanning_distance_now').val().slice(0,-1),jQuery('#mission_type').val(),jQuery('input#drone_speed').val().replace("m/s","")];
    //var parameters = ["./projects/"+localStorage.getItem("LoadProject").trim()+"/map_data.geojson"];
        console.log(parameters)
    child(executablePath,parameters, function(err, data) {
        console.log(err)
        console.log(data.toString());
        var temp_time = data.split("Time (min) : ");
        var final_time = temp_time[1].split("Communication");
        var fix_format = parseFloat(final_time[0]).toFixed(2);
        jQuery('span#minutes_calc').text(fix_format.replace(".",":") + " Mins");
        //jQuery('div#pop_up_container').fadeOut();
        jQuery('#Loader_Proccess_PopUp').fadeOut(2000);
    });

            // show loading pop up
            //jQuery('#pop_up_container').fadeIn();
            jQuery('#Loader_Proccess_PopUp').fadeIn(1000);
            //jQuery('.pop_up_content').prepend('<div class="loader loader--style5" title="4"> <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="24px" height="30px" viewBox="0 0 24 30" style="enable-background:new 0 0 50 50;" xml:space="preserve"> <rect x="0" y="0" width="4" height="10" fill="#333"> <animateTransform attributeType="xml" attributeName="transform" type="translate" values="0 0; 0 20; 0 0" begin="0" dur="0.6s" repeatCount="indefinite" /> </rect> <rect x="10" y="0" width="4" height="10" fill="#333"> <animateTransform attributeType="xml" attributeName="transform" type="translate" values="0 0; 0 20; 0 0" begin="0.2s" dur="0.6s" repeatCount="indefinite" /> </rect> <rect x="20" y="0" width="4" height="10" fill="#333"> <animateTransform attributeType="xml" attributeName="transform" type="translate" values="0 0; 0 20; 0 0" begin="0.4s" dur="0.6s" repeatCount="indefinite" /> </rect> </svg> </div>');
            //jQuery('.pop_up_content p').text('Path Calculation Started');
            //jQuery('.button_all_ok').attr('style', 'display:none;');




    // Debug kill after 1 min if path doesn't appear
    setTimeout(function(){ 
        
        if(!jQuery('div#Loader_Proccess_PopUp').is(':hidden')){
            //jQuery('#pop_up_container').fadeOut();
            //alert('ERROR WHILE CALCULATING THE PATH');
            console.log('CALCULATION TIME IS SLOW - MAYBE ERROR !?');
            jQuery('.card-information__text').html('<a style="color: red !important;" href="#">Slow, path calculation detected! Cancel job & change settings? </a>');

        }

    }, 60000);



    });


    // Excecute RGB VLS INDECES 
    // Pattern Navigation: projects/[project_name]/rgb_vls_results/


    jQuery('div#calculate_rgb_vls').click(function(){

        toast({
            title: "Starting...",
            message: "Calculation of photo indeces has started",
            type: "success",
            duration: 5000
          });
        
        console.log('Calculate Path Triggered');
        const fixPath = require('fix-path');
//=> '/usr/local/bin:/usr/bin'
        // RUN EXCECUTABLE HERE

    var child = require('child_process').execFile;
    var final_path = path.resolve(__dirname+'/third_party_plugins/RGB_VLS', 'idx_calculation.exe');
    console.log(final_path);
    var executablePath = final_path;
    var running_on = path.resolve(__dirname);
    // Path of stiched image & path of project 
    var parameters = [running_on.replace(/\\/g, "/") + "/projects/"+localStorage.getItem("LoadProject").trim()+"/docker_stitching/project/odm_orthophoto/odm_orthophoto.tif", running_on.replace(/\\/g, "/") +"/projects/"+localStorage.getItem("LoadProject").trim()+"/"+localStorage.getItem("LoadProject").trim()];
    //var parameters = ["./projects/"+localStorage.getItem("LoadProject").trim()+"/map_data.geojson"];
        console.log(parameters)
    child(executablePath,parameters, function(err, data) {
        if(err){
            //alert('Error occured on calculation vls');
            toast({
                title: "Kill task...",
                message: "Calculation Photo indeces error. Aborting operation. Please try again manually",
                type: "error",
                duration: 8000
              });

            return;
        }
        console.log(data.toString());
        jQuery('div#pop_up_container').fadeOut();
        // Change state on file from now on indeces exists 
        fs.mkdir(running_on + '/projects/' + localStorage.getItem("LoadProject").replace(" ",""), function() {
            fs.writeFileSync(running_on + '/projects/' + localStorage.getItem("LoadProject").replace(" ","") + '/has_indeces.json', '{ "has_indeces": { "value": "1" } }');
        });

        // Read JSON Files 
        draw_photo_indices();
        rgb_centers_area();
        //alert('Now Draw Photo Indices');

    });


    });

    function rgb_centers_area(){

        toast({
            title: "Starting...",
            message: "Calculate the centers of problatics areas",
            type: "success",
            duration: 5000
          });


            console.log('Calculate Path Triggered');
            const fixPath = require('fix-path');
            //=> '/usr/local/bin:/usr/bin'
                    // RUN EXCECUTABLE HERE

                var child = require('child_process').execFile;
                var final_path = path.resolve(__dirname+'/third_party_plugins/RGB_CENTERS', 'centers.exe');
                console.log(final_path);
                var executablePath = final_path;
                var running_on = path.resolve(__dirname);
                // The new parameters are Calculated Tifs from Index Calculation + Txt file with photo names from Docker Stiching 
                //var parameters = [running_on.replace(/\\/g, "/") + "/projects/"+localStorage.getItem("LoadProject").trim()+"/docker_stitching/project/odm_orthophoto/odm_orthophoto.tif", running_on.replace(/\\/g, "/") +"/projects/"+localStorage.getItem("LoadProject").trim()+"/"+localStorage.getItem("LoadProject").trim()+'/project/',running_on.replace(/\\/g, "/") + "/projects/"+localStorage.getItem("LoadProject").trim()+"/docker_stitching/project/images/"];
                var parameters = [running_on.replace(/\\/g, "/") + "/projects/"+localStorage.getItem("LoadProject").trim()+"/"+localStorage.getItem("LoadProject").trim()+"/project/", running_on.replace(/\\/g, "/") +"/projects/"+localStorage.getItem("LoadProject").trim()+"/docker_stitching/project/img_list.txt"];
                //var parameters = ["./projects/"+localStorage.getItem("LoadProject").trim()+"/map_data.geojson"];
                    console.log(parameters)
                child(executablePath,parameters, function(err, data) {

                    if(err){
                        alert('ERROR ON CALCULATION CENTERS OF PROBLEMATIC AREAS');
                        console.log(err);

                        toast({
                            title: "Error, on centers calculation",
                            message: "Some problem appeared when calculation centers of problematics areas.",
                            type: "error",
                            duration: 5000
                          });


                        return;
                    }
                    console.log(data.toString());
                    jQuery('div#pop_up_container').fadeOut();
                    // Change state on file from now on indeces exists 
                    /*
                    fs.mkdir(running_on + '/projects/' + localStorage.getItem("LoadProject").replace(" ",""), function() {
                        fs.writeFileSync(running_on + '/projects/' + localStorage.getItem("LoadProject").replace(" ","") + '/has_indeces.json', '{ "has_indeces": { "value": "1" } }');
                    });
                    */

                    // Read JSON Files 
                    //draw_photo_indices();
                    console.log('COMPLETED SUCCESFULLY CENTERS, NOW CAN READ THEM');
                    toast({
                        title: "Calculation of centers completed",
                        message: "Navigate from menu to Photo Indeces and display them",
                        type: "success",
                        duration: 5000
                      });
                    //alert('Now Draw Photo Indices');
                    Draw_Centers_OnMap();

                });
    }

    // Trigger Mechanism to lock the settings of the project

    jQuery('div#lock_project').click(function(){

        var plan_name = jQuery('input#plan_name').val();
        var altitude = jQuery('input#altitude_show').val().replace('m','');
        var direction_show = jQuery('input#direction_show').val().replace('°','');
        var scanning_distance = jQuery('input#scanning_distance_now').val().replace('m','');
        var gimbal_pitch = jQuery('input#gimbal_pitch').val().replace('°','');
        var drone_speed = jQuery('input#drone_speed').val().replace('m/s','');
        var acres = jQuery('span#acres_num').text();

        var prepare_json_project = '{"CoFly": { "Plan_Name":"' + plan_name + '", "Calculated_Minutes":"' + '--:--' + '","Calculated_Acres":"' + acres + '","Altitude":"' + altitude + '","Rotation":"' + direction_show + '","Lock_Project":"1","Scanning_Distance":"'+scanning_distance+'","Gimbal_Pitch":"'+gimbal_pitch+'","Drone_Speed":"'+drone_speed+'" } }';

        fs.mkdir('./projects/' + plan_name, function() {
            fs.writeFileSync('projects/' + plan_name + '/proj_settings.json', prepare_json_project);
        });

        jQuery(this).fadeOut();
        jQuery('div#start_scanning').fadeIn();
        jQuery('div#calculate_path_planing').fadeOut();
 
        
    });

    // START PATH BUTTON TRIGGER
    jQuery('div#start_scanning').click(function() {

        // Should be fixed ( When read status ongoing from missionstatus drone)
        //can_save_image = true;
        //console.log('Start Excecution of path');
        jQuery('div#cancel_scanning').fadeIn();
        jQuery(this).fadeOut();



        var fs = require('fs');
        const path = require('path');
        var running_on = path.resolve(__dirname);

        // Create subdirectory on images in order to save the incoming images from server
        var date_time = Date.now();
        fs.mkdir(running_on + '/projects/' + localStorage.getItem("LoadProject").replace(" ","")+'/project_images/'+date_time, function() {
            localStorage.setItem('Save_Image_Path',running_on +'/projects/' + localStorage.getItem("LoadProject").replace(" ","")+'/project_images/'+date_time);
        });


        // Read the calclated path and make it ready for excecution
        
        var running_on = path.resolve(__dirname);
        fs.readFileSync(running_on + '/projects/' + project_path.replace(" ", "") + '/paths/calculated_path.json', 'utf8');
        var contents = fs.readFileSync(running_on + '/projects/' + project_path.replace(" ", "") + '/paths/calculated_path.json', 'utf8');
        var map_Data_load = JSON.parse(contents);
            var map_Data = JSON.parse(map_Data_load);
            var size_of_path = map_Data.DataObject.generated_path.waypoints.length;
            var pointList = [];
            for (var points = 0; points < size_of_path; points++) {
                var tmp_point = new L.LatLng(map_Data.DataObject.generated_path.waypoints[points].lat,map_Data.DataObject.generated_path.waypoints[points].lng);
                //console.log(tmp_point);
                tmp_point.altitude = parseFloat(jQuery('#altitude_show').val().split("m", 2));
                pointList.push(tmp_point);
            }
        //console.log(JSON.parse(contents));
        function renameKey ( obj, oldKey, newKey ) {
            obj[newKey] = obj[oldKey];
            delete obj[oldKey];
          }

          
          pointList.forEach( obj => renameKey( obj, 'lat', 'latitude' ) );
          pointList.forEach( obj => renameKey( obj, 'lng', 'longitude' ) );
          //pointList.altitude = 35.0;
        //console.log(JSON.stringify(pointList));
 

        // Waiting from mqtt server send us mission status ONGOING
        client.publish('missionStart/dji.phantom.4.pro.hawk.1', JSON.stringify({
            "timestamp":1591881061228,
            "missionId":"ee31b81e-ceaf-4539-8f97-a225f258ff31",
            "destinationSystem":"dji.phantom.4.pro.hawk.1",
            "sourceSystem":"choosepath-backend",
            "speed":10.0,
            "timeout":1800.0,
            "cornerRadius":2.0,
            "gimbalPitch":-87.0,
            "waypoints":pointList
         }))
    
    });

    // ABORT scanning 
    jQuery('div#cancel_scanning').click(function(){

        can_save_image = false;
        client.publish('missionAbort/dji.phantom.4.pro.hawk.1', JSON.stringify({
            "timestamp":1591881233874,
            "missionId":"4027d485-760d-4c54-b951-7a11ca7a6a8d",
            "timeout":2.0
         }))

         console.log('Trigger Abort');

         jQuery(this).fadeOut();
         jQuery('#start_scanning').fadeIn();


    });

    function scan_complete(){
        jQuery('div#cancel_scanning').fadeOut();
        jQuery('div#start_scanning').fadeIn();
    }


    // function in order to call loaded project settings

    function load_project_settings() {
        var fs = require('fs');
        const path = require('path');
        var running_on = path.resolve(__dirname);
        var contents = fs.readFileSync(running_on + '/projects/' + project_path.replace(" ", "") + '/proj_settings.json', 'utf8');
        return contents;
    }

       // function in order to call loaded project settings

    function load_project_calulated_path() {

        var fs = require('fs');
        try{
            const path = require('path');
            var running_on = path.resolve(__dirname);
            fs.readFileSync(running_on + '/projects/' + project_path.replace(" ", "") + '/paths/calculated_path.json', 'utf8');
            var contents = fs.readFileSync(running_on + '/projects/' + project_path.replace(" ", "") + '/paths/calculated_path.json', 'utf8');
            //jQuery('div#calculate_path_planing').fadeOut();
            jQuery('div#start_scanning').fadeIn();

        }catch(err){
            return false;
        }
        
        
        //return contents;
        try {
      
            setTimeout(function(){ 
            var map_Data_load = JSON.parse(contents);
            var map_Data = JSON.parse(map_Data_load);
            var size_of_path = map_Data.DataObject.generated_path.waypoints.length;
            var pointList = [];
            for (var points = 0; points < size_of_path; points++) {
                var tmp_point = new L.LatLng(map_Data.DataObject.generated_path.waypoints[points].lat,map_Data.DataObject.generated_path.waypoints[points].lng);
                pointList.push(tmp_point);
            }
            var firstpolyline = new L.Polyline(pointList, {
                color: 'white',
                weight: 3,
                opacity: 0.8,
                smoothFactor: 1,
                className : 'CalculatedPathRender'
            });
            // This is an amazing polyline in order to communicate 
            firstpolyline.addTo(map);
            jQuery('path.leaflet-clickable').first().attr('style','fill:transparent;');
        }, 1500);
          }
          catch(err) {
            console.log(err);
            //console.log('There is not calculated path on the project');
            //return false;
          }

    }



    //initialize project map and render it into map
    load_map_project();
    // initialize project timeline
    jQuery("div#timeline_div").load("scan_timeline.html");
    // render again input slider 
    function load_map_project() {
        var fs = require('fs');

        const path = require('path');
        var running_on = path.resolve(__dirname);

        var contents = fs.readFileSync(running_on +'/projects/' + project_path.replace(" ", "") + '/map_data.geojson', 'utf8');
        //L.geoJson(JSON.parse(contents)).addTo(map);


        L.geoJson(JSON.parse(contents), {
            invert: true,
            worldLatLngs: [
                L.latLng([90, 360]),
                L.latLng([90, -180]),
                L.latLng([-90, -180]),
                L.latLng([-90, 360])
            ]
        }).setStyle({'className': 'outline_boundaries_worldmap'}).addTo(map);



        return contents;
    }

        //initialize project map and render it into map
        //disabled_paths();
        // render disabled paths
        function disabled_paths() {
            var fs = require('fs');
            const path = require('path');
            var running_on = path.resolve(__dirname);
            var contents = fs.readFileSync(running_on + '/projects/' + project_path.replace(" ", "") + '/disabled_paths.geojson', 'utf8');
            try{
                var disabledStyle = {
                    "color": "red",
                    "weight": 5,
                    "fillColor": "red",
                    "opacity": 0.65,
                    "className" : "DisabledPathDraw"
                };
                L.geoJson(JSON.parse(contents), {
                    style: disabledStyle
                }).addTo(map);
               
            }catch(err){
                console.log(err);
            }
            return contents;
        }

        // function gia na mou epistefei se json to arxeio twn disabled paths kai na mporw na to epexergastw
        function disabled_paths_read() {
            var fs = require('fs');
            const path = require('path');
            var running_on = path.resolve(__dirname);
            var contents = fs.readFileSync(running_on + '/projects/' + project_path.replace(" ", "") + '/disabled_paths.geojson', 'utf8');
            return contents;
        }


        jQuery('svg.leaflet-zoom-animated g:nth-child(n+2) path').click(function(){

            console.log('Must delete svg and regerate layers delete');
            var index = jQuery("svg.leaflet-zoom-animated g:nth-child(n+2) path").index(this);
            console.log(index);
            var get_file = JSON.parse(disabled_paths_read());
            
            if(get_file["features"].length-1 == 0){
                //alert('prepei na kanw xars');
                fs.writeFileSync('./projects/' + project_path.replace(" ", "") + '/disabled_paths.geojson', ' ');
            }else{             
                get_file["features"].splice(index, 1);
                console.log(JSON.stringify(get_file));
                fs.writeFileSync('./projects/' + project_path.replace(" ", "") + '/disabled_paths.geojson', JSON.stringify(get_file));
            }

            jQuery(this).remove();

            
        });



    // return polygon map with out render it on map 
    function load_map_project_w_o_render() {
        var fs = require('fs');
        const path = require('path');
        var running_on = path.resolve(__dirname);
        var contents = fs.readFileSync(running_on + '/projects/' + project_path.replace(" ", "") + '/map_data.geojson', 'utf8');
        return contents;
    }


    // Load Project // Fill Elements
    var loaded_project = JSON.parse(load_project_settings());
    jQuery('input#plan_name').val(loaded_project.CoFly.Plan_Name);
    jQuery('span#acres_num').text(loaded_project.CoFly.Calculated_Acres);
    jQuery('span#minutes_calc').text(loaded_project.CoFly.Calculated_Minutes);
    jQuery('input.input-range--custom.altitude').val(parseInt(loaded_project.CoFly.Altitude));
    jQuery('input#altitude_show').val(parseInt(loaded_project.CoFly.Altitude) + 'm');
    jQuery('input#direction_show').val(parseInt(loaded_project.CoFly.Rotation) + '°');
    jQuery('input.input-range--custom.direction').val(parseInt(loaded_project.CoFly.Rotation));
    jQuery('input#scanning_distance_now').val(parseInt(loaded_project.CoFly.Scanning_Distance) + 'm');
    jQuery('input#gimbal_pitch').val(parseInt(loaded_project.CoFly.Gimbal_Pitch) + '°');
    jQuery('input#drone_speed').val(parseInt(loaded_project.CoFly.Drone_Speed) + 'm/s');

    /* Recomended */
    jQuery('input#altitude_show').val('10 m');
    jQuery('input#direction_show').val('0°');
    jQuery('input#scanning_distance_now').val('20 m');
    jQuery('input#drone_speed').val('5 m/s');
    var is_project_locked = parseInt(loaded_project.CoFly.Lock_Project);
    if(is_project_locked == 1){
        jQuery('div#calculate_path_planing').fadeOut();
        jQuery('div#lock_project').fadeOut();
        jQuery('div#start_scanning').fadeIn();
    }
    console.log('Project Condition:' + is_project_locked);
    
    update_viewer_slider_altitude();
    update_viewer_slider_rotation();



    function update_viewer_slider_altitude() {

        var fillColor = "rgba(254,200,64,1)",
            emptyColor = "rgba(238,238,238, 1)";

        var percent = 100 * (document.querySelector('input.altitude').value - document.querySelector('input.altitude').min) / (document.querySelector('input.altitude').max - document.querySelector('input.altitude').min) + '%';
        document.querySelector('input.altitude').style.backgroundImage = `linear-gradient( to right, ${fillColor}, ${fillColor} ${percent}, ${emptyColor} ${percent})`;

    }

    function update_viewer_slider_rotation() {

        var fillColor = "rgba(254,200,64,1)",
            emptyColor = "rgba(238,238,238, 1)";

        var percent = 100 * (document.querySelector('input.direction').value - document.querySelector('input.direction').min) / (document.querySelector('input.direction').max - document.querySelector('input.direction').min) + '%';
        document.querySelector('input.direction').style.backgroundImage = `linear-gradient( to right, ${fillColor}, ${fillColor} ${percent}, ${emptyColor} ${percent})`;

    }

    jQuery('div#exit_button').click(function() {
        window.location = "./index.html";
    });

    jQuery('.button_all_ok').click(function() {

        jQuery('div#pop_up_container').fadeOut();

    });



    // Gallery Image click listener
    /*
    jQuery(document).on("click", '.nav-item div', function() {

        var get_image_path = jQuery(this).closest('li').find('img').attr('src');
        //console.log(get_image_path);
        if (jQuery('#div#lightbox').css('display') == 'none') {
            jQuery('div#lightbox').attr('style', 'background-image:url("' + get_image_path + '"); display:block;');

        } else {
            jQuery('div#lightbox').css('display', 'block');
            jQuery('div#lightbox').attr('style', 'background-image:url("' + get_image_path + '"); display:block;');

        }


    });
    */

    // Close Image Shower Action

    jQuery('.close_image_shower').click(function() {

        jQuery('div#lightbox').fadeOut();

    });

    // Close Top Bar with images from drone receiver
    jQuery('div#close_map_photo_picker i').click(function() {

        if(jQuery('div#open_image_settings_map i').hasClass('open_it')){}else{jQuery('div#photo_picker_receiver_start').slideUp();}

    });

    // Variable in order to trigger selection mode of printed images on map
    var selection_mode = false;
    // Toogle to open menu bar for images
    jQuery('div#open_image_settings_map i').click(function() {


        if (jQuery('div#open_image_settings_map i').hasClass('open_it')) {
            jQuery(this).removeClass('open_it');
            jQuery('#photo_wizard_start').slideUp();

        } else {
            jQuery(this).addClass('open_it');
            jQuery('#photo_wizard_start').slideDown();
            // Set selectrion mode on true
            selection_mode = true;
            // Grayscale all the images in order to select which one will we move.
            jQuery('.leaflet-popup-content img').css('filter', 'grayscale(1)');

        }


    });

    // Variable gia na exw to id thw eikonas pou tha xeirizete o controller
    var selected_image_for_control = '';
    // Function pou kanw trigger to click se eikona poy exei postaristei otan to selection mode einai true
    jQuery(document).on('click', '.leaflet-popup-content img', function() {

        if (selection_mode) {
            selection_mode = false;
            selected_image_for_control = jQuery(this).attr('give_id');
            jQuery('img[give_id="' + jQuery(this).attr('give_id') + '"]').addClass('selected_edit_image');
            console.log('Selected image is: ' + selected_image_for_control);
            check_for_existing_values();
        }

    });

    /* Basic Image Controller Listeners */
    var i_top = 0;
    var i_left = -55;
    var angle = 0;
    var opacity = 0;

    function check_for_existing_values(){

        var demo = JSON.parse(load_image_settings());

        for (k in demo['ImageSettings']) {

            var image_title = jQuery('.selected_edit_image').attr('src');
            if (demo['ImageSettings'][k]['title'] == image_title) {
                //alert('Brethike Eikona');
                i_top = parseInt(demo['ImageSettings'][k]['Top'].replace("px",""));
                i_left = parseInt(demo['ImageSettings'][k]['Left'].replace("px",""));
                angle = i_top = parseInt(demo['ImageSettings'][k]['Rotate']);
                console.log('Found Values Already',i_top,i_left,angle);
            }

        }
        
    }

    jQuery(document).on('click', '.image_toggle_button', function() {

        var read_id = jQuery(this).attr('marker_id');


        if (jQuery(this).hasClass('inactive')) {
            jQuery(this).removeClass('inactive');
            jQuery('img[give_id="' + read_id + '"]').fadeIn();
        } else {
            jQuery(this).addClass('inactive');
            jQuery('img[give_id="' + read_id + '"]').fadeOut();
        }


    });


    var timer = 0;

    $('.dirs .rotate_neg').on('mousedown', function() {
        timer = setInterval(rotatePositive, "50");
        //console.log('MouseDown on div');
    }).on('mouseup mouseleave', function() {
        //console.log('MouseUp on div');
        clearInterval(timer);
    });


    $('.dirs .rotate').on('mousedown', function() {
        timer = setInterval(rotateNegative, "50");
        //console.log('MouseDown on div');
    }).on('mouseup mouseleave', function() {
        //console.log('MouseUp on div');
        clearInterval(timer);
    });

    $('.dirs .right').on('mousedown', function() {
        timer = setInterval(move_right, "50");
        //console.log('MouseDown on div');
    }).on('mouseup mouseleave', function() {
        //console.log('MouseUp on div');
        clearInterval(timer);
    });

    $('.dirs .left').on('mousedown', function() {
        timer = setInterval(move_left, "50");
        //console.log('MouseDown on div');
    }).on('mouseup mouseleave', function() {
        //console.log('MouseUp on div');
        clearInterval(timer);
    });

    $('.dirs .up').on('mousedown', function() {
        timer = setInterval(move_up, "50");
        //console.log('MouseDown on div');
    }).on('mouseup mouseleave', function() {
        //console.log('MouseUp on div');
        clearInterval(timer);
    });

    $('.dirs .down').on('mousedown', function() {
        timer = setInterval(move_down, "50");
        //console.log('MouseDown on div');
    }).on('mouseup mouseleave', function() {
        //console.log('MouseUp on div');
        clearInterval(timer);
    });



    function rotatePositive() {
        jQuery('img[give_id="' + selected_image_for_control + '"]').attr('style', 'transform:rotate(' + angle++ + 'deg); margin-top: ' + i_top + 'px; margin-left:' + i_left + 'px');
        //console.log('Rotate: ' + jQuery('img[give_id="' + selected_image_for_control + '"]').css('transform'));
    }

    function rotateNegative() {
        jQuery('img[give_id="' + selected_image_for_control + '"]').attr('style', 'transform:rotate(' + angle-- + 'deg); margin-top: ' + i_top + 'px; margin-left:' + i_left + 'px');
        //console.log('Rotate: ' + jQuery('img[give_id="' + selected_image_for_control + '"]').css('transform'));
    }

    function move_right() {
        jQuery('img[give_id="' + selected_image_for_control + '"]').attr('style', 'transform:rotate(' + angle + 'deg); margin-top: ' + i_top + 'px; margin-left:' + i_left++ + 'px');
        //console.log('Left: ' + jQuery('img[give_id="' + selected_image_for_control + '"]').css('left'));
    }

    function move_left() {
        jQuery('img[give_id="' + selected_image_for_control + '"]').attr('style', 'transform:rotate(' + angle + 'deg); margin-top: ' + i_top + 'px; margin-left:' + i_left-- + 'px');
        //console.log('Left: ' + jQuery('img[give_id="' + selected_image_for_control + '"]').css('left'));
    }

    function move_up() {
        jQuery('img[give_id="' + selected_image_for_control + '"]').attr('style', 'transform:rotate(' + angle + 'deg); margin-top: ' + i_top-- + 'px; margin-left:' + i_left + 'px');
        //console.log('Top: ' + jQuery('img[give_id="' + selected_image_for_control + '"]').css('top'));
    }

    function move_down() {
        opacity_down();
        jQuery('img[give_id="' + selected_image_for_control + '"]').attr('style', 'transform:rotate(' + angle + 'deg); margin-top: ' + i_top++ + 'px; margin-left:' + i_left + 'px');
        //console.log('Top: ' + jQuery('img[give_id="' + selected_image_for_control + '"]').css('top'));
    }

    function opacity_up(){
        jQuery('img[give_id="' + selected_image_for_control + '"]').attr('style', 'transform:rotate(' + angle + 'deg); margin-top: ' + i_top + 'px; margin-left:' + i_left + 'px; opacity:'+opacity++);
        
    }

    
    function opacity_down(){
        jQuery('img[give_id="' + selected_image_for_control + '"]').attr('style', 'transform:rotate(' + angle + 'deg); margin-top: ' + i_top + 'px; margin-left:' + i_left + 'px; opacity:'+opacity--);
        
    }


    // Save Button for printed images on map clicked
    jQuery('#save_settings_img i').click(function() {
        console.log('Debug edw: ' + jQuery('.selected_edit_image').attr('src'));
        i_top = 0;
        i_left = -55;
        angle = 0;

        // TODO CREATE JSON FILE AND SAVE IMAGE SETTINGS
        // ean den exei idio onoma me rythmiseis sto json image settings
        if (!check_if_image_settings_already_exists()) {

            var demo = JSON.parse(load_image_settings());

            var read_left = jQuery('.selected_edit_image').css('margin-left');
            var read_top = jQuery('.selected_edit_image').css('margin-top');
            var read_rotate = jQuery('.selected_edit_image').attr('style');
            var keep_deg = read_rotate.split("rotate(", 3);
            keep_deg = keep_deg[1].split("deg);", 3);

            demo['ImageSettings'].push({
                "title": jQuery('.selected_edit_image').attr('src'),
                "Rotate": keep_deg[0],
                "Top": read_top,
                "Left": read_left
            });
            console.log('Add new Item', demo);
            json_data = JSON.stringify(demo);
            // SAVE JSON FILE
            var fs = require('fs');
            //alert(plan_name);
            
            fs.mkdir('./projects/' + localStorage.getItem("LoadProject").replace(" ",""), function() {
                fs.writeFileSync('projects/' + localStorage.getItem("LoadProject").replace(" ","") + '/image_settings.json', JSON.stringify(demo));
            });




        }

        jQuery('.selected_edit_image').removeClass('selected_edit_image');
        jQuery('#photo_wizard_start').slideUp();
        jQuery('#open_image_settings_map i').removeClass('open_it');
        jQuery('.leaflet-popup-pane img').css('filter', 'grayscale(0)');




    });



    function check_if_image_settings_already_exists() {

        var demo = JSON.parse(load_image_settings());

        for (k in demo['ImageSettings']) {

            //console.log(demo['ImageSettings'][k]['title']);
            var image_title = jQuery('.selected_edit_image').attr('src');
            if (demo['ImageSettings'][k]['title'] == image_title) {
                //alert('Brethike Eikona');

                var read_left = jQuery('.selected_edit_image').css('margin-left');
                var read_top = jQuery('.selected_edit_image').css('margin-top');
                var read_rotate = jQuery('.selected_edit_image').attr('style');
                var keep_deg = read_rotate.split("rotate(", 3);
                keep_deg = keep_deg[1].split("deg);", 3);

                demo['ImageSettings'][k]['Rotate'] = keep_deg[0];
                demo['ImageSettings'][k]['Top'] = read_top;
                demo['ImageSettings'][k]['Left'] = read_left;
                // SAVE JSON FILE
                var fs = require('fs');
                fs.mkdir('./projects/' + localStorage.getItem("LoadProject").replace(" ",""), function() {
                    fs.writeFileSync('projects/' + localStorage.getItem("LoadProject").replace(" ","") + '/image_settings.json', JSON.stringify(demo));
                });
    
                console.log('Change Existing Item', demo);
                return true;
            }

        }

        return false;


    }




    function load_image_settings() {
        var fs = require('fs');
        const path = require('path');
        var running_on = path.resolve(__dirname);
        var contents = fs.readFileSync(running_on + '/projects/' + project_path.replace(" ", "") + '/image_settings.json', 'utf8');
        return contents;
    }

    
    
    function load_project_indeces_file() {
        var fs = require('fs');
        const path = require('path');
        var running_on = path.resolve(__dirname);
        var contents = fs.readFileSync(running_on + '/projects/' + project_path.replace(" ", "") + '/has_indeces.json', 'utf8');
        var has_indeces = JSON.parse(contents);
        if(parseInt(has_indeces["has_indeces"]["value"]) == 0){
            //alert('There is no photo indeces');

        }else{
            jQuery('h6.navbar-heading.project_gallery').fadeIn();
        }

        return parseInt(has_indeces["has_indeces"]["value"]);

        //return contents;
    }


    jQuery('div#export_project').click(function(){


        jQuery('input[type="file"]').click();
        
    });

    jQuery('input[type="file"]').change(function(){
        export_project(this.files[0].path);
    });



    /* TEST DOCKER INTEGRATION */
    jQuery('i.fas.fa-clock').click(function(){

        var intervalHandle = null;
        const path = require('path');
        var running_on = path.resolve(__dirname);
        console.log(running_on+"/third_party_plugins/ODM_Docker/docker_run.bat "+running_on + "/projects/"+ project_path.replace(" ", "")+'/docker_stitching/');
        require('child_process').exec(running_on+"/third_party_plugins/ODM_Docker/docker_run.bat "+running_on + "/projects/"+ project_path.replace(" ", "")+'/docker_stitching/',{maxBuffer: 1024 * 50000}, function (err, stdout, stderr) {
            if (err) {
                // Ooops.
                // console.log(stderr);

                // Go and copy all images to the folder
                var ncp = require('ncp').ncp;
 
                //ncp.limit = 16;

                // images source
                //var source = "C:/Users/ENGLEZOS/Desktop/images";
                var source = localStorage.getItem("Save_Image_Path");

                const path = require('path');
                var running_on = path.resolve(__dirname);

                var destination = running_on + '/projects/' +project_path.replace(" ", "")+'/docker_stitching/project/images';
                //alert(destination);
                ncp(source, destination, function (err) {
                if (err) {
                    alert('Docker dashboard must be running');
                return console.error(err);
                }
                console.log('done! copy all photos from source to destination for stiching');
                jQuery('i.fas.fa-clock').click();
                jQuery('#stiching_progress').slideDown();
                // in the head
                

                // in the onclick to set
                intervalHandle = setInterval(function(){ 
                    

                    var fs = require('fs');
                        const path = require('path');
                        var running_on = path.resolve(__dirname);
                        var contents = fs.readFileSync(running_on + "/projects/" +project_path.replace(" ", "") +'/docker_stitching/project/benchmark.txt', 'utf8');
                        console.log(contents.split('\n'));
                        jQuery('span#stich_step').text(contents.split('\n').length - 1);
                    

                }, 5000);

// in the onclick to clear
//clearInterval(intervalHandle);
                });

                return console.log(err);
            }
        
            // Done.
            console.log(stdout);
            jQuery('#stiching_progress').slideUp();
            clearInterval(intervalHandle);

            // Calculate bounds of photo
            toast({
                title: "Starting...",
                message: "Calculation of bound boxes from stiched image",
                type: "success",
                duration: 5000
              });
            
            console.log('Calculate Path Triggered');
    
            const path_new = require('path');
                        var running_on = path_new.resolve(__dirname);
              
        var child = require('child_process').execFile;
        var final_path = path_new.resolve(__dirname+'/third_party_plugins/GPS_BOUND_BOX', 'fing_gps_pixel_level_v2.exe');
        console.log(final_path);
        var executablePath = final_path;
        var running_on = path_new.resolve(__dirname);
        // Path of stiched image & path of project 
        var parameters = [running_on.replace(/\\/g, "/") + "/projects/"+localStorage.getItem("LoadProject").trim()+"/docker_stitching/project/odm_orthophoto/odm_orthophoto.tif", running_on.replace(/\\/g, "/") +"/projects/"+localStorage.getItem("LoadProject").trim()+"/stiched_images"];
        //var parameters = ["./projects/"+localStorage.getItem("LoadProject").trim()+"/map_data.geojson"];
            console.log(parameters)
        child(executablePath,parameters, function(err, data) {
            if(err){
                alert('Error occured on calculation bound boxes');
                return;
            }
            console.log(data.toString());
            // Change state on file from now on indeces exists 
    
    
        });


            // CONVERT STICHED IMAGE FROM TIFF TO PNG

            const path = require('path');
            var running_on = path.resolve(__dirname);
            //alert( running_on +'/'+ project_path.replace(" ", ""));
            
            const sharp = require('sharp');
            
            const main = async () => {
                if (process.argv.length < 4) {
                    console.log('arguments: srcFile dstFile');
                    console.log('supports reading JPEG, PNG, WebP, TIFF, GIF and SVG images.');
                    console.log('output images can be in JPEG, PNG, WebP and TIFF formats.');
                    return;
                }

                const path = require('path');
                var running_on = path.resolve(__dirname);
                const srcFile = running_on+'/projects/'+project_path.replace(" ", "")+'/docker_stitching/project/odm_orthophoto/odm_orthophoto.tif';
                const dstFile = running_on+'/projects/'+project_path.replace(" ", "")+'/stiched_images/stiched.png';

                try {

                    toast({
                        title: "Converting...",
                        message: "Convert Stiched image in order to show it on map",
                        type: "success",
                        duration: 5000
                      });


                    const info = await sharp(srcFile).toFile(dstFile);
                    console.log(info);

                    // TODO MKLAB SEND US CALCULATION SCRIPTS OF BOUNDS
                    // DRAW STICHED IMAGE
                    draw_stiched_image();

                    //CALL PHOTO INDICES CALCULATION
                    calculate_photo_indeces();



                } catch (err) {
                    

                    console.error(err);
                }
            };
            main();
            






        });



    });

    // Function that calculate the photo indeces of stiched image
    
    function calculate_photo_indeces(){

        toast({
            title: "Starting...",
            message: "Calculation of photo indeces has started",
            type: "success",
            duration: 5000
          });
        
        console.log('Calculate Path Triggered');
        const fixPath = require('fix-path');
//=> '/usr/local/bin:/usr/bin'
        // RUN EXCECUTABLE HERE

    var child = require('child_process').execFile;
    var final_path = path.resolve(__dirname+'/third_party_plugins/RGB_VLS', 'idx_calculation.exe');
    console.log(final_path);
    var executablePath = final_path;
    var running_on = path.resolve(__dirname);
    // Path of stiched image & path of project 
    var parameters = [running_on.replace(/\\/g, "/") + "/projects/"+localStorage.getItem("LoadProject").trim()+"/docker_stitching/project/odm_orthophoto/odm_orthophoto.tif", running_on.replace(/\\/g, "/") +"/projects/"+localStorage.getItem("LoadProject").trim()+"/"+localStorage.getItem("LoadProject").trim()];
    //var parameters = ["./projects/"+localStorage.getItem("LoadProject").trim()+"/map_data.geojson"];
        console.log(parameters)
    child(executablePath,parameters, function(err, data) {
        if(err){
            alert('Error occured on calculation vls');
            return;
        }
        console.log(data.toString());
        jQuery('div#pop_up_container').fadeOut();
        // Change state on file from now on indeces exists 
        fs.mkdir(running_on + '/projects/' + localStorage.getItem("LoadProject").replace(" ",""), function() {
            fs.writeFileSync(running_on + '/projects/' + localStorage.getItem("LoadProject").replace(" ","") + '/has_indeces.json', '{ "has_indeces": { "value": "1" } }');
        });

        // Read JSON Files 
        convert_indeces_to_png();
        rgb_centers_area();
        //alert('Now Draw Photo Indices');

    });

    }
    
    function convert_indeces_to_png(){
        // CONVERT STICHED IMAGE FROM TIFF TO PNG

        const path = require('path');
        var running_on = path.resolve(__dirname);
        //alert( running_on +'/'+ project_path.replace(" ", ""));
        
        const sharp = require('sharp');
        
        const main = async () => {
            if (process.argv.length < 4) {
                console.log('arguments: srcFile dstFile');
                console.log('supports reading JPEG, PNG, WebP, TIFF, GIF and SVG images.');
                console.log('output images can be in JPEG, PNG, WebP and TIFF formats.');
                return;
            }

            const path = require('path');
            var running_on = path.resolve(__dirname);

            const srcFileGLI = running_on + '/projects/' +project_path.replace(" ", "") + '/'+project_path.replace(" ", "")+'/project/GLI.tif';
            const dstFileGLI = running_on + '/projects/' +project_path.replace(" ", "") + '/'+project_path.replace(" ", "")+'/project/GLI.png';

            const srcFileNGBDI = running_on + '/projects/' +project_path.replace(" ", "") + '/'+project_path.replace(" ", "")+'/project/NGBDI.tif';
            const dstFileNGBDI = running_on + '/projects/' +project_path.replace(" ", "") + '/'+project_path.replace(" ", "")+'/project/NGBDI.png';

            const srcFileNGRDI = running_on + '/projects/' +project_path.replace(" ", "") + '/'+project_path.replace(" ", "")+'/project/NGRDI.tif';
            const dstFileNGRDI = running_on + '/projects/' +project_path.replace(" ", "") + '/'+project_path.replace(" ", "")+'/project/NGRDI.png';

            const srcFileVARI = running_on + '/projects/' +project_path.replace(" ", "") + '/'+project_path.replace(" ", "")+'/project/VARI.tif';
            const dstFileVARI = running_on + '/projects/' +project_path.replace(" ", "") + '/'+project_path.replace(" ", "")+'/project/VARI.png';
            try {

                toast({
                    title: "Converting...",
                    message: "Convert Indeces TIFS to PNG",
                    type: "success",
                    duration: 5000
                  });


                const info_GLI = await sharp(srcFileGLI).toFile(dstFileGLI);
                const info_NGBDI = await sharp(srcFileNGBDI).toFile(dstFileNGBDI);
                const info_NGRDI = await sharp(srcFileNGRDI).toFile(dstFileNGRDI);
                const info_VARI = await sharp(srcFileVARI).toFile(dstFileVARI);
                //console.log(info);

                draw_photo_indices();

            } catch (err) {
                

                console.error(err);
            }
        };
        main();
    }

    // Demo prosposes json files reading TO BE REMOVED
    Draw_Centers_OnMap();
    function Draw_Centers_OnMap(){

        try {

        const pathsb = require('path');
        var running_on = pathsb.resolve(__dirname);
        var path_of_json = running_on+'/projects/'+project_path.replace(" ", "")+'/'+project_path.replace(" ", "")+'/project/';
        
        // check if files are created and draw them otherwise return and do nothing
        if(!fs.existsSync(path_of_json + '/GLI.json')) {
            console.log("Centers has not excecuted so far");
            return
          }
            
        
        //console.log(path_of_json);
        //var exg_centers = fs.readFileSync(path_of_json + '/ExG_centers.json', 'utf8');
        //var exg_exr_centers = fs.readFileSync(path_of_json + '/ExG-ExR_centers.json', 'utf8');
        var gli_centers = fs.readFileSync(path_of_json + '/GLI.json', 'utf8');
        var ngbdi_centers = fs.readFileSync(path_of_json + '/NGBDI.json', 'utf8');
        var ngrdi_centers = fs.readFileSync(path_of_json + '/NGRDI.json', 'utf8');
        //var savi_green_centers = fs.readFileSync(path_of_json + '/SAVI-GREEN_centers.json', 'utf8');
        var vari_centers = fs.readFileSync(path_of_json + '/VARI.json', 'utf8');

        //var exg_centers_json = JSON.parse(exg_centers);
        //var exg_exr_centers_json = JSON.parse(exg_exr_centers);
        var gli_centers_json = JSON.parse(gli_centers);
        var ngbdi_centers_json = JSON.parse(ngbdi_centers);
        var ngrdi_centers_json = JSON.parse(ngrdi_centers);
        //var savi_green_centers_json = JSON.parse(savi_green_centers);
        var vari_centers_json = JSON.parse(vari_centers);

        console.log(gli_centers_json);

        /* CREATING MARKERS FOR GLI CENTERS */

        for(var item in gli_centers_json) {
            var lat = gli_centers_json[item]["Lon"];
            var lon = gli_centers_json[item]["Lat"];
            var img_near = gli_centers_json[item]["Nearest_image"];
            
            marker = new L.marker([lon,lat],{
                title: 'Problem Area',
                icon: alert_indeces
            })
				.bindPopup('<img src="'+running_on+'/projects/'+project_path.replace(" ", "")+"/docker_stitching/project/images/"+img_near+'"><div class="remove_this">Remove</div>')
				.addTo(map);

          }

        /* CREATING MARKERS FOR NGBDI CENTERS */
        for(var item in ngbdi_centers_json) {
            var lat = ngbdi_centers_json[item]["Lat"];
            var lon = ngbdi_centers_json[item]["Lon"];
            var img_near = ngbdi_centers_json[item]["Nearest_image"];
            
            marker = new L.marker([lon,lat],{
                title: 'Problem Area',
                icon: alert_indeces
            })
				.bindPopup('<img src="'+running_on+'/projects/'+project_path.replace(" ", "")+"/docker_stitching/project/images/"+img_near+'"><div class="remove_this">Remove</div>')
				.addTo(map);

          }

         /* CREATING MARKERS FOR ngrdi_centers_json CENTERS */
         for(var item in ngrdi_centers_json) {
            var lat = ngrdi_centers_json[item]["Lat"];
            var lon = ngrdi_centers_json[item]["Lon"];
            var img_near = ngrdi_centers_json[item]["Nearest_image"];
            
            marker = new L.marker([lon,lat],{
                title: 'Problem Area',
                icon: alert_indeces
            })
				.bindPopup('<img src="'+running_on+'/projects/'+project_path.replace(" ", "")+"/docker_stitching/project/images/"+img_near+'"><div class="remove_this">Remove</div>')
				.addTo(map);

          }   
          
          /* CREATING MARKERS FOR vari CENTERS */
          for(var item in vari_centers_json) {
              var lat = vari_centers_json[item]["Lat"];
              var lon = vari_centers_json[item]["Lon"];
              var img_near = vari_centers_json[item]["Nearest_image"];
              
              marker = new L.marker([lon,lat],{
                  title: 'Problem Area',
                  icon: alert_indeces
              })
                  .bindPopup('<img src="'+running_on+'/projects/'+project_path.replace(" ", "")+"/docker_stitching/project/images/"+img_near+'"><div class="remove_this">Remove</div>')
                  .addTo(map);
  
            }


           
          } catch (error) {
            console.error(error);
            
            console.log('There is no calculated problemati area centers on map');
          }


    }

    jQuery('.leaflet-marker-pane img').click(function(){
        jQuery('.leaflet-marker-pane img').removeClass('selected_mark');
        jQuery(this).addClass('selected_mark'); 
    });

    jQuery(document).on('click','.remove_this',function(){
        
        //alert('AA');
        jQuery('.leaflet-popup-pane div').remove();
        jQuery('.selected_mark').remove();
        jQuery('a.leaflet-popup-close-button').click();

    });
    // Function that checks if stiched image exists and than draw it on map
    function draw_stiched_image(){
        const fs = require('fs');
        const paths = require('path');
        var running_on = paths.resolve(__dirname);

        const path =  running_on+'/projects/'+project_path.replace(" ", "")+'/stiched_images/stiched.png';

        fs.access(path, fs.F_OK, (err) => {
        if (err) {
            //console.error(err)
            console.log('THERE IS NO STICHED IMAGE YET');
            return
        }


        //file exists can draw
        var imageUrl = running_on+'/projects/'+project_path.replace(" ", "")+'/stiched_images/stiched.png';

        /* 
        
        Upper left corner: 40.57398606450203, 22.997528424163438
Lower right corner: 40.57197854729044, 22.99985538092048
        
        */
        var bound_boxes = fs.readFileSync(running_on+'/projects/'+project_path.replace(" ", "")+'/stiched_images/edges.json', 'utf8');
        var json_bounds = JSON.parse(bound_boxes);
        cimageBounds = L.bounds([json_bounds["Lower_right_corner"],json_bounds["Upper_left_corner"]]);
        //console.log(cimageBounds.getCenter());
        imageBounds = [cimageBounds.getCenter(), json_bounds["Lower_right_corner"],json_bounds["Upper_left_corner"]];
        L.imageOverlay(imageUrl, imageBounds).addTo(map);



        })
    }

    draw_photo_indices();
    // Function That Draws Photo Indices 
    function draw_photo_indices(){

        // Delete Old
        jQuery('ul.navbar-nav.mb-md-3.collapsed.project_gallery_render div').remove();
        
        // prepare today date in order to find the folder
        var date = new Date();
        var correct_date = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();

        //console.log(correct_date);

        const fs = require('fs');
        const path = require('path');
        var running_on = path.resolve(__dirname);
        if(load_project_indeces_file() != 0){

            //console.log(running_on + '/projects/' +project_path.replace(" ", "") + '/rgb_vls_results/Resulted_Vis_image_representations/');
        fs.readdir(running_on + '/projects/' +project_path.replace(" ", "") + '/'+project_path.replace(" ", "")+'/project/', (err, files) => {

            

            files.forEach(file => {
            
                console.log(file);    
                if(file == "GLI.png"){
                    jQuery('ul.navbar-nav.mb-md-3.collapsed.project_gallery_render').append('<div id="" class="button_full date_indeces">Open Indeces Bar</div>');
                    jQuery('ul.navbar-nav.mb-md-3.collapsed.project_gallery_render').append('<div id="remove_vls_from_map" class="button_full ">Hide from map</div>');
                    
                }
                //jQuery('ul.navbar-nav.mb-md-3.collapsed.project_gallery_render').append('<div id="" class="button_full date_indeces">'+file+'</div>');
                localStorage.setItem("last_scan_indeces",running_on + '/projects/' +project_path.replace(" ", "") + '/'+project_path.replace(" ", "")+'/');
            
    
            });
    
        });

        }else{
            console.log('There is no photo indeces ');
        }
        
    }

    /* Listener for remove rgb vls indeces from map */
    jQuery(document).on("click","#remove_vls_from_map",function() {jQuery('img.calculated_rgb_vls_index').fadeOut();});
    


    // Event Handlet in order to click on date on indeces and draw the selected images
    jQuery(document).on('click','.button_full.date_indeces',function(){
        //  $(this) = your current element that clicked.
        // Storing date indeces on local storage
        localStorage.setItem('date_indeces',jQuery(this).text());
        jQuery('div#photo_picker_receiver_start').slideDown();
        
    });
    
    // Draw on click the correct Index Image
    jQuery('.button_full_rgb_vls').click(function(){

        if(jQuery('.calculated_rgb_vls_index').length > 0 ){
            jQuery('.calculated_rgb_vls_index').remove();
        }

        const fs = require('fs');
        const path = require('path');
        var running_on = path.resolve(__dirname);
        
        var img_name = jQuery(this).attr('index');
        var imageUrl = running_on + '/projects/' + project_path.replace(" ", "") + '/'+project_path.replace(" ", "")+'/project/'+img_name;


        // MUST READ FROM FILE BOUND BOX
        cimageBounds = L.bounds([[40.573994502284826, 22.997514351202266],[40.57201471549072, 23.00005946100994]]);
        //console.log(cimageBounds.getCenter());
        imageBounds = [cimageBounds.getCenter(), [40.573994502284826, 22.997514351202266],[40.57201471549072, 23.00005946100994]];

        L.imageOverlay(imageUrl, imageBounds,{className:'calculated_rgb_vls_index'}).addTo(map);
    
    });


    // initialise function Export Project 
    function export_project(out_dir){


        jQuery('#pop_up_container').fadeIn();
        jQuery('.pop_up_content').prepend('<div class="loader loader--style5" title="4"> <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="24px" height="30px" viewBox="0 0 24 30" style="enable-background:new 0 0 50 50;" xml:space="preserve"> <rect x="0" y="0" width="4" height="10" fill="#333"> <animateTransform attributeType="xml" attributeName="transform" type="translate" values="0 0; 0 20; 0 0" begin="0" dur="0.6s" repeatCount="indefinite" /> </rect> <rect x="10" y="0" width="4" height="10" fill="#333"> <animateTransform attributeType="xml" attributeName="transform" type="translate" values="0 0; 0 20; 0 0" begin="0.2s" dur="0.6s" repeatCount="indefinite" /> </rect> <rect x="20" y="0" width="4" height="10" fill="#333"> <animateTransform attributeType="xml" attributeName="transform" type="translate" values="0 0; 0 20; 0 0" begin="0.4s" dur="0.6s" repeatCount="indefinite" /> </rect> </svg> </div>');
        jQuery('.pop_up_content p').text('Exporting...');
        jQuery('.button_all_ok').attr('style', 'display:none;');
       
        const zl = require("zip-lib");
    
        zl.archiveFolder('./projects/' + localStorage.getItem("LoadProject").replace(" ", "")+'/', out_dir+"/"+localStorage.getItem("LoadProject").replace(" ","")+".zip").then(function () {
            console.log("Export done");
            jQuery('#pop_up_container').fadeOut();
            jQuery('.button_all_ok').attr('style', 'display:block;');
        }, function (err) {
            console.log(err);
        });


    }

    // Draw Map Click Handler
    jQuery('div#DrawOnMapGallery').click(function(){
        DrawImagesOnMap();
    });

    // Initialise function draw images on map
    function DrawImagesOnMap(){
        // Dropdown menu 
        jQuery('div#photo_picker_receiver_start').slideDown();
        // Clear all markers from the images toolbox
        console.log('working');
    }


    jQuery('#server_connection').click(function(){

        console.log('trgg');
        localStorage.setItem("MQTT_HOST",jQuery('#mqtt_host').val());
        localStorage.setItem("MQTT_PORT",jQuery('#mqtt_port').val());
        location.reload();

    });

    //scan_completed(); // Enabled for debugging purposes
    function scan_completed(){


        can_save_image = false;
        show_slide = true;
        //res.status(200).send('ok');

        jQuery('#scan_completed').fadeIn();
        jQuery('div#start_scanning').fadeIn();
        jQuery('div#cancel_scanning').fadeOut();

        var get_center = localStorage.getItem('LoadedProjectCenter').split(",");
        // create link depending the center of project and call the weather api 
        jQuery.get( 'http://api.openweathermap.org/data/2.5/weather?lat='+get_center[1]+'&lon='+get_center[0]+'&APPID=f6f1b45b882965c039fae9390a8250e4', function( data ) {
            console.log(data);

            var wind_speed = data.wind["speed"];
            var max_temp = Math.abs(data.main["temp_max"]-272.15);
            var min_temp = Math.abs(data.main["temp_min"]-272.15);
            var humidity = data.main["humidity"];
            var weather_description = data.weather[0]["description"];

            let unix_timestamp = data.sys["sunset"];
            var date = new Date(unix_timestamp * 1000);
            var hours = date.getHours();
            var minutes = "0" + date.getMinutes();
            var seconds = "0" + date.getSeconds();
            var sunset = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
            
            //console.log(parseInt(max_temp),parseInt(min_temp),humidity,wind_speed,sunset,weather_description);
            // Set Content 
            jQuery('span#weather_desc').text(weather_description);
            jQuery('.weather_stats ul li:nth-child(1) p').text(parseInt(min_temp) + ' - ' + parseInt(max_temp) + ' °C');
            jQuery('.weather_stats ul li:nth-child(2) p').text(humidity + ' %');
            jQuery('.weather_stats ul li:nth-child(3) p').text(wind_speed + ' km/h');
            jQuery('.weather_stats ul li:nth-child(4) p').text(sunset);

          });



    }

//test_stiched_image();
//calculate_photo_indeces();
    function test_stiched_image(){
        const path = require('path');
            var running_on = path.resolve(__dirname);
            //alert( running_on +'/'+ project_path.replace(" ", ""));
            
            const sharp = require('sharp');

            const main = async () => {
                if (process.argv.length < 4) {
                    console.log('arguments: srcFile dstFile');
                    console.log('supports reading JPEG, PNG, WebP, TIFF, GIF and SVG images.');
                    console.log('output images can be in JPEG, PNG, WebP and TIFF formats.');
                    return;
                }

                const path = require('path');
                var running_on = path.resolve(__dirname);
                const srcFile = running_on+'/projects/'+project_path.replace(" ", "")+'/docker_stitching/project/odm_orthophoto/odm_orthophoto.tif';
                const dstFile = running_on+'/projects/'+project_path.replace(" ", "")+'/stiched_images/stiched.png';

                try {
                    const info = await sharp(srcFile).toFile(dstFile);
                    console.log(info);

                    // TODO MKLAB SEND US CALCULATION SCRIPTS OF BOUNDS
                    // DRAW STICHED IMAGE
                    draw_stiched_image();

                    //CALL PHOTO INDICES CALCULATION
                    calculate_photo_indeces();



                } catch (err) {
                    console.error(err);
                }
            };
            main();
    }

    /* Toast messages mechanism */
    function toast({ title = "", message = "", type = "info", duration = 3000 }) {
        const main = document.getElementById("toast");
        if (main) {
          const toast = document.createElement("div");
      
          // Auto remove toast
          const autoRemoveId = setTimeout(function () {
            main.removeChild(toast);
          }, duration + 1000);
      
          // Remove toast when clicked
          toast.onclick = function (e) {
            if (e.target.closest(".toast__close")) {
              main.removeChild(toast);
              clearTimeout(autoRemoveId);
            }
          };
      
          const icons = {
            success: "fas fa-check-circle",
            info: "fas fa-info-circle",
            warning: "fas fa-exclamation-circle",
            error: "fas fa-exclamation-circle"
          };
          const icon = icons[type];
          const delay = (duration / 1000).toFixed(2);
      
          toast.classList.add("toast", `toast--${type}`);
          toast.style.animation = `slideInLeft ease .3s, fadeOut linear 1s ${delay}s forwards`;
      
          toast.innerHTML = `
                          <div class="toast__icon">
                              <i class="${icon}"></i>
                          </div>
                          <div class="toast__body">
                              <h3 class="toast__title">${title}</h3>
                              <p class="toast__msg">${message}</p>
                          </div>
                          <div class="toast__close">
                              <i class="fas fa-times"></i>
                          </div>
                      `;
          main.appendChild(toast);
        }
      }

      /* 
       EXAMPLES OF TOASTING MESSAGES 
      */

       /*

    toast({
      title: "Thành công!",
      message: "Bạn đã đăng ký thành công tài khoản tại F8.",
      type: "success",
      duration: 5000
    });
	
	
	toast({
      title: "Thất bại!",
      message: "Có lỗi xảy ra, vui lòng liên hệ quản trị viên.",
      type: "error",
      duration: 5000
    });

    */

});