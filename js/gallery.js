jQuery(document).ready(function(){

    // Author: Konstantinos Englezos
    // EXPERIMENTAL
  
    const index = el => [...el.parentElement.children].indexOf(el);
    const clamp = (a, min = 0, max = 1) => Math.min(max, Math.max(min, a));
    const keyboard = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter"];
    function init() {
      const stateTransition = {
        state: false,
        transitionrun: function () {
          this.state = true;
        },
        transitionstart: function () {
          this.state = true;
        },
        transitionend: function () {
          this.state = false;
        } };
        const assets = [];
/*
      const assets = [
      "https://images.unsplash.com/photo-1625041083884-c4293dc93fbb?ixid=MnwxMjA3fDB8MHxwcm9maWxlLXBhZ2V8NXx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1280&h=800&q=60",
      "https://images.unsplash.com/photo-1625041083904-7a27ded23406?ixid=MnwxMjA3fDB8MHxwcm9maWxlLXBhZ2V8N3x8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1280&h=800&q=60",
      "https://images.unsplash.com/photo-1614247262098-76459e80e152?ixid=MnwxMjA3fDB8MHxwcm9maWxlLXBhZ2V8MTh8fHxlbnwwfHx8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1280&h=800&q=60",
      "https://images.unsplash.com/photo-1588260693059-2631306cc8b4?ixid=MnwxMjA3fDB8MHxwcm9maWxlLXBhZ2V8Mjh8fHxlbnwwfHx8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1280&h=800&q=60",
      "https://images.unsplash.com/photo-1588260540782-445cfdd2dad7?ixid=MnwxMjA3fDB8MHxwcm9maWxlLXBhZ2V8MzF8fHxlbnwwfHx8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1280&h=800&q=60"];
*/
        // File Manager read from received images 
        const fs = require('fs')
        const pathsb = require('path');
        var running_on = pathsb.resolve(__dirname); 
        var project_path = localStorage.getItem("LoadProject");
        var path_of_json = running_on+'/projects/'+project_path.replace(" ", "")+'/'+project_path.replace(" ", "")+'/project/';
        var custom_path = 'C:/Users/ENGLEZOS/Desktop/images/'; // for debuggind porpose
        //fs.readdir(running_on + '/projects/' +project_path.replace(" ", "") + '/'+project_path.replace(" ", "")+'/project/', (err, files) => {
        fs.readdir(custom_path, (err, files) => {
                
            var files_size = 0;
            files.forEach(file => {
                
                //console.log('The Ext name is: ',pathsb.extname(file));
                // File Handler add only images
                if(pathsb.extname(file) == ".jpeg"){
                    assets.push('C:/Users/ENGLEZOS/Desktop/images/'+file);
                    files_size++;
                    if(files_size == 1){
                        jQuery('.viewport .canvas').append('<div class="selected"></div>');
                        jQuery('.map-container .map').append('<div></div>');
                    }else{
                        console.log('found image');
                    jQuery('.viewport .canvas').append('<div></div>');
                    jQuery('.map-container .map').append('<div></div>');
                    }
                    
                    
                }
                //console.log('File Found From Gallery JS:',file);    
            });

        });
  
      const root = document.documentElement;
      const body = document.body;
      const viewport = document.querySelector(".viewport");
      const canvas = document.querySelector(".canvas");
      const map = document.querySelector(".map");
      const focus = document.querySelector(".focus");
      const back = document.querySelector("#back");
      const zoom = document.querySelector("#zoom");
      let item = canvas.querySelector(".selected");
      let id = index(item);
      let transition = false;
      let coords = {
        x: 0,
        y: 0 };
  
      const min = parseFloat(zoom.min);
      const max = parseFloat(zoom.max);
      let scale = min;
  
      const gridSize = getComputedStyle(root).getPropertyValue("--gridSize");
  
      const translateCanvas = () => {
        canvas.style.setProperty("--x", coords.x);
        canvas.style.setProperty("--y", coords.y);
      };
  
      const panningTo = i => {
        coords.x = i % gridSize;
        coords.y = Math.floor(i / gridSize);
        translateCanvas();
      };
  
      const makeSelection = sel => {
        item.classList.remove("selected");
        map.children[index(item)].classList.remove("selected");
  
        item = canvas.children[sel];
  
        item.classList.add("selected");
        map.children[sel].classList.add("selected");
  
        id = index(item);
        panningTo(id);
      };
  
      const handleSelection = ev => {
        if (stateTransition.state) return false;
        if (ev.target === item) return false;
        if (ev.target === ev.currentTarget || ev.target.nodeName === "IMG")
        return false;
        makeSelection(index(ev.target));
        ev.preventDefault();
      };
  
      const handleOpenImage = ev => {
        if (stateTransition.state) return false;
  
        ev.preventDefault();
        root.classList.toggle("open");
      };
  
      const handleZoom = ev => {
        if (stateTransition.state) return false;
  
        ev.preventDefault();
        let zoomValue = ev.target.value;
        viewport.style.setProperty("--zoom", zoomValue);
      };
  
      const handleZoomFromWheel = function (ev) {
        if (stateTransition.state) return false;
        // ev.preventDefault();
  
        scale += ev.deltaY * -0.1;
        scale = clamp(scale, min, max);
        viewport.style.setProperty("--zoom", scale);
        zoom.value = scale;
      };
  
      document.addEventListener("wheel", handleZoomFromWheel);
  
      const handleKeyboard = ev => {
        if (stateTransition.state) return false;
        ev.preventDefault();
  
        let tempX = coords.x,
        tempY = coords.y,
        tempIndex = id,
        max = gridSize - 1;
        /*
        switch (ev.keyCode) {
          case 37: // left
            tempX--;
            break;
          case 39: // right
            tempX++;
            break;
          case 38: // up
            tempY--;
            break;
          case 40: // down
            tempY++;
            break;
          case 13: // enter
            handleOpenImage(ev);
            return true;
          default:
            return false;}
  */
        coords.x = clamp(tempX, 0, max);
        coords.y = clamp(tempY, 0, max);
  
        tempIndex = coords.y * gridSize + coords.x; // get index position from x,y
  
        makeSelection(tempIndex);
      };
  
      const handleLoad = () => {
        let assetsCount = 0;
        // selection
        panningTo(id);
        map.children[id].classList.add("selected");
  
        // Append images may fail!
        [...canvas.querySelectorAll("div")].forEach((v, i) => {
          let img = new Image();
          v.innerHTML = "";
          img.src = assets[i];
          img.crossOrigin = "";
          img.onload = () => {
            img.alt = "";
            img.width = img.naturalWidth;
            img.height = img.naturalHeight;
            assetsCount++;
            v.appendChild(img);
  
            if (assetsCount === assets.length) {
              setTimeout(() => {
                root.className = "loaded";
              }, 1000);
            }
          };
  
          v.classList.add("item");
        });
      };
  
      canvas.addEventListener("transitionrun", event => {
        stateTransition[event.type]();
      });
      canvas.addEventListener("transitionstart", event => {
        stateTransition[event.type]();
        body.classList.add("pen");
      });
      canvas.addEventListener("transitionend", event => {
        stateTransition[event.type]();
        body.classList.remove("pen");
      });
  
      viewport.addEventListener("transitionrun", event => {
        stateTransition[event.type]();
      });
      viewport.addEventListener("transitionstart", event => {
        stateTransition[event.type]();
        body.classList.add("pen");
      });
      viewport.addEventListener("transitionend", event => {
        stateTransition[event.type]();
        body.classList.remove("pen");
      });
  
      //document.addEventListener("keydown", handleKeyboard);
      canvas.addEventListener("click", handleSelection, false);
      map.addEventListener("click", handleSelection, false);
      focus.addEventListener("click", handleOpenImage, false);
      back.addEventListener("click", handleOpenImage, false);
      zoom.addEventListener("change", handleZoom);
  
      window.addEventListener("load", handleLoad);
    }
  
    init();
  



});

    