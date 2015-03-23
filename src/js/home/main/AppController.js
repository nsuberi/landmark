define(['main/config'], function(homeConfig) {
    'use strict';

    var AppController = {

        /**
         * Init the App Controller, calling necessary overrides and attaching events as needed
         */
        init: function() {
            brApp.debug('AppController >>> init');
            this.overrideEvents();
            this.bindEvents();
            this.renderComponents();
            var self = this;
            // If we are loading on a mobile device, move the content into the correct panel
            // if (Helper.isMobile()) {
            //     this.layoutChangedToMobile();
            // }

            $("#britishFlag").click(function() {
                self.displayEnglish();
            });





        },

        /**
         * Override default events here, such as routing to the home or map page when were in the map
         */
        overrideEvents: function() {
            brApp.debug('AppController >>> overrideEvents');
            //on(document.getElementById('home-page-link'), 'click', this.overrideNav); //TODO: No 'om so use jquery for these events'
            //on(document.getElementById('map-page-link'), 'click', this.overrideNav);
        },

        /**
         * Connect to other important events here related to the whole behaviour of the app
         */
        bindEvents: function() {
            brApp.debug('AppController >>> bindEvents');

            // $(".right > li").on("click", function() {
            //     $(".right > li").removeClass("active-page");
            //     $(this).addClass("active-page");
            //     debugger;
            // });

        },

        /**
         * Prevent routing to new page and handle special behaviors here as well
         */
        overrideNav: function(evt) {
            brApp.debug('AppController >>> overrideNav');
            // Hack Fix for top-bar shifting
            $('.toggle-topbar').click();
            $('.top-bar').css('height', 'auto');
            evt.preventDefault();
            // Get a reference to the clicked element
            var target = evt.target ? evt.target : evt.srcElement;
            // If they clicked home, show launch dialog

        },

        renderComponents: function() {
            brApp.debug('AppController >>> renderComponents');

            $("#slides").slick({
                dots: true,
                //autoplay: true,
                speed: 2000
            });
            $(".slick-prev").html("");
            $(".slick-next").html("");

            $("#slides > ul > li > button").html("");

            $(".slick-prev").css("background", "url(css/images/arrow_prev_pop.png) no-repeat center");
            $(".slick-next").css("background", "url(css/images/arrow_next_pop.png) no-repeat center");
            $(".slick-next").css("background-color", "black");
            $(".slick-prev").css("background-color", "black");

            //$(".slick-prev").html("<");
            //$(".slick-next").html(">");

        },

        displayEnglish: function() {
            brApp.debug('AppController >>> displayEnglish');
            console.log("needs languages");
        }


    };

    return AppController;

});