jQuery(document).ready(function() {


    /* Menu Collapse Mechanism */
    jQuery('.collapsed_menu h6').click(function() {

        if (jQuery(this).closest(".collapsed_menu").find("ul.navbar-nav.mb-md-3.collapsed").css('display') == 'block') {
            jQuery('i', this).removeClass('fa-caret-up');
            jQuery('i', this).addClass('fa-caret-down');
            jQuery(this).closest(".collapsed_menu").find("ul.navbar-nav.mb-md-3.collapsed").slideUp();
        } else {

            jQuery('i', this).removeClass('fa-caret-down');
            jQuery('i', this).addClass('fa-caret-up');
            jQuery(this).closest(".collapsed_menu").find("ul.navbar-nav.mb-md-3.collapsed").slideDown();
        }

    });


    /* Slider Custom Color + Value */

    var fillColor = "rgba(254,200,64,1)",
        emptyColor = "rgba(238,238,238, 1)";

    document.querySelector('input.altitude').addEventListener('input', function() {
        var percent = 100 * (this.value - this.min) / (this.max - this.min) + '%';
        jQuery('#altitude_show').val(this.value + 'm');
        //  this.setAttribute('value', this.value);
        //  this.setAttribute('title', this.value);
        this.style.backgroundImage = `linear-gradient( to right, ${fillColor}, ${fillColor} ${percent}, ${emptyColor} ${percent})`;
    });

    document.querySelector('input.direction').addEventListener('input', function() {
        var percent = 100 * (this.value - this.min) / (this.max - this.min) + '%';
        jQuery('#direction_show').val(this.value + '°');
        //  this.setAttribute('value', this.value);
        //  this.setAttribute('title', this.value);
        this.style.backgroundImage = `linear-gradient( to right, ${fillColor}, ${fillColor} ${percent}, ${emptyColor} ${percent})`;
    });

    if(jQuery('input.gimbal_pitch').length > 0){

        document.querySelector('input.gimbal_pitch').addEventListener('input', function() {
            var percent = 100 * (this.value - this.min) / (this.max - this.min) + '%';
            jQuery('#gimbal_pitch').val(this.value + '°');
            //  this.setAttribute('value', this.value);
            //  this.setAttribute('title', this.value);
            this.style.backgroundImage = `linear-gradient( to right, ${fillColor}, ${fillColor} ${percent}, ${emptyColor} ${percent})`;
        });


    }


    if(jQuery('input.drone_speed_slider').length > 0){

        
        document.querySelector('input.drone_speed_slider').addEventListener('input', function() {
            var percent = 100 * (this.value - this.min) / (this.max - this.min) + '%';
            jQuery('#drone_speed').val(this.value + 'm/s');
            //  this.setAttribute('value', this.value);
            //  this.setAttribute('title', this.value);
            this.style.backgroundImage = `linear-gradient( to right, ${fillColor}, ${fillColor} ${percent}, ${emptyColor} ${percent})`;
        });

    }
    if(jQuery('input.scanning_distance').length > 0){
        document.querySelector('input.scanning_distance').addEventListener('input', function() {
            var percent = 100 * (this.value - this.min) / (this.max - this.min) + '%';
            jQuery('#scanning_distance_now').val(this.value + 'm');
            //  this.setAttribute('value', this.value);
            //  this.setAttribute('title', this.value);
            this.style.backgroundImage = `linear-gradient( to right, ${fillColor}, ${fillColor} ${percent}, ${emptyColor} ${percent})`;
        });
    }


//




    /* Map Tools Menu Toogle Mechanism */
    jQuery('div#close_tool_menu').click(function() {

        jQuery(".map_tools").animate({
            width: 'toggle'
        }, 350);

    });

    jQuery('img#button_trig_menu').click(function() {

        jQuery(".map_tools").animate({
            width: 'toggle'
        }, 350);
    });

    // CLOSE DOCUMENT READY


});