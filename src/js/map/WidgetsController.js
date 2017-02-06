define([
    'main/config',
    'map/Map',
    'dojo/on',
    'dojo/dom',
    'dijit/Dialog',
    'dojo/_base/fx',
    'dojo/dom-class',
    "dojo/cookie",
    'dojo/dom-style',
    'dijit/registry',
    'esri/tasks/PrintTask',
    'esri/tasks/PrintTemplate',
    'esri/tasks/PrintParameters',
    'dojo/dom-geometry',
    'dojo/_base/window'
], function(AppConfig, Map, on, dom, Dialog, Fx, domClass, cookie, domStyle, registry, PrintTask, PrintTemplate, PrintParameters, domGeom, win) {
    'use strict';

    var DURATION = 300;

    var Controller = {
        /**
         * Toggle the legend container open or close
         */
        toggleLegend: function() {
            brApp.debug('WidgetsController >>> toggleLegend');
            var node = document.getElementById('legend-content'),
                legendNode = document.querySelector('.brMap .legend-content'),
                topBar = document.getElementById('legend-container'),
                toggler = document.getElementById('legend-toggle-icon'),
                active = domClass.contains(legendNode, 'active'),
                left = active ? 170 : 210,
                width = active ? 200 : 260,
                height = active ? 0 : node.scrollHeight;

            if (active) {
                $("#legend-toggle-icon").html("+");
                //$("#legend-toggle-icon").css("background", "url('css/images/checkbox_checked.png')");
            } else {
                $("#legend-toggle-icon").html("&ndash;");
                //$("#legend-toggle-icon").css("background", "url('css/images/close_minus_symbol.png')");
            }

            domClass.toggle(legendNode, 'active');

            Fx.animateProperty({
                node: node,
                properties: {
                    height: height
                },
                duration: DURATION,
                onEnd: function() {
                    if (height !== 0) {
                        // Update the size of the legend as it grows so no scrollbars
                        node.style.height = 'auto';
                    }
                }
            }).play();

            Fx.animateProperty({
                node: topBar,
                properties: {
                    width: width
                },
                duration: DURATION //,
                // onEnd: function() {
                //     if (width != 260) {
                //         // Update the size of the legend as it grows so no scrollbars
                //         $("#legend-toggle-icon").css("left", "170px");
                //     } else {
                //         $("#legend-toggle-icon").css("left", "230px");
                //     }
                // }
            }).play();

            Fx.animateProperty({
                node: toggler,
                properties: {
                    left: left
                },
                duration: 300 //,
                // onEnd: function() {
                //     if (width != 260) {
                //         // Update the size of the legend as it grows so no scrollbars
                //         $("#legend-toggle-icon").css("left", "170px");
                //     } else {
                //         $("#legend-toggle-icon").css("left", "230px");
                //     }
                // }
            }).play();
        },

        /**
         * Toggle the basemap gallery container open or close
         */
        toggleBasemapGallery: function() {
            brApp.debug('WidgetsController >>> toggleBasemapGallery');
            var connector = document.querySelector('.brMap .basemap-container'),
                container = document.querySelector('.brMap .basemap-connector');

            if (this.shareContainerVisible()) {
                this.toggleShareContainer();
            }

            if (connector && container) {
                domClass.toggle(connector, 'hidden');
                domClass.toggle(container, 'hidden');
            }

        },

        /**
         * Toggle the basemap gallery container open or close
         */
        toggleShareContainer: function() {
            brApp.debug('WidgetsController >>> toggleShareContainer');
            var connector = document.querySelector('.brMap .share-container'),
                container = document.querySelector('.brMap .share-connector');

            if (this.basemapContainerVisible()) {
                this.toggleBasemapGallery();
            }

            if (connector && container) {
                domClass.toggle(connector, 'hidden');
                domClass.toggle(container, 'hidden');
            }

        },

        /**
         * @return {boolean} boolean representing state of the container, true if it is visible
         */
        shareContainerVisible: function() {
            return !domClass.contains(document.querySelector('.brMap .share-container'), 'hidden');
        },

        /**
         * @return {boolean} boolean representing state of the container, true if it is visible
         */
        basemapContainerVisible: function() {
            return !domClass.contains(document.querySelector('.brMap .basemap-container'), 'hidden');
        },

        /**
         * Toggle the tree widget container open or close
         */
        toggleTreeContainer: function() {
            brApp.debug('WidgetsController >>> toggleTreeContainer');

            var commTab = $('.community-layers-tab');

            var node = document.getElementById('layer-content');
            var active = domClass.contains(node, 'active');
            if (!active) {
              if (commTab.hasClass('hidden')) {
                $(".tree-widget-container").css('height', '200px');
              } else {
                  $(".tree-widget-container").css('height', '500px');
              }
            } else {
              $('.tree-widget-container').css('height', 'auto');
            }

            var topBar = document.getElementById('tree-widget-container'),
              labelNode = document.getElementById('tree-container-toggle'),
              treeTitle = document.getElementById('tree-title'),
              innerNode = document.querySelector('.layer-tab-container'),
              height, width;


            labelNode.innerHTML = active ? '&plus;' : '&minus;';
            domClass.toggle(labelNode, 'padding-right');
            domClass.toggle(innerNode, 'hidden');

            // Set the height
            height = active ? 0 : (topBar.offsetHeight - 34);
            width = active ? 180 : 360;

            domClass.toggle(node, 'active');
            $(node).css('height', height);
            $(node).css('width', width);
            $('#tree-title').css('width', width);
            $(node).css('treeTitle', treeTitle);

            $('#tree-widget-container').css('height', '95%');
            $('#layer-content').css('height', '100%');

        },

        togglePrintModal: function() {
          console.log(document.querySelector('.print-modal-wrapper'));
          var printModal = document.querySelector('.print-modal-wrapper')
          domClass.toggle(printModal, 'hidden');
          //
          // var Map = brApp.map;
          // console.log(Map);
          // var centerPoint = Map.extent.getCenter();
    			// //get map node
    			// var mapNode = document.getElementById("brMap");
    			// //get contaomer node
    			// var previewNode = document.getElementById("print-preview--map_container");
    			// //append map node to preview node
    			// previewNode.appendChild(mapNode);
          //
    			// //center map on update at center point from previous view
    			// on.once(Map, 'update-end', function(){
    			// 	Map.centerAt(centerPoint);
    			// });
          //
    			// //resize map to fit new node
    			// Map.resize();
        },

        toggleMobileTree: function() {
          var layerTree = document.querySelector('.tree-widget-container')
          var searchButton = document.querySelector('.search-button')
          var reportButton = document.querySelector('.report-button')

          registry.byId('analysis-dialog').hide();

          if (!domClass.contains(searchButton, "hidden")) {
            domClass.toggle(searchButton, 'hidden');
          }
          if (!domClass.contains(reportButton, "hidden")) {
            domClass.toggle(reportButton, 'hidden');
          }
          domClass.toggle(layerTree, 'hidden');
        },

        toggleMobileSearch: function() {
          var layerTree = document.querySelector('.tree-widget-container')
          var searchButton = document.querySelector('.search-button')
          var reportButton = document.querySelector('.report-button')

          registry.byId('analysis-dialog').hide();

          if (!domClass.contains(layerTree, "hidden")) {
            domClass.toggle(layerTree, 'hidden');
          }
          if (!domClass.contains(reportButton, "hidden")) {
            domClass.toggle(reportButton, 'hidden');
          }
          domClass.toggle(searchButton, 'hidden');
        },

        toggleMobileCountrySearch: function() {
          var layerTree = document.querySelector('.tree-widget-container')
          var searchButton = document.querySelector('.search-button')
          var reportButton = document.querySelector('.report-button')

          registry.byId('analysis-dialog').hide();

          if (!domClass.contains(layerTree, "hidden")) {
            domClass.toggle(layerTree, 'hidden');
          }
          if (!domClass.contains(searchButton, "hidden")) {
            domClass.toggle(searchButton, 'hidden');
          }
          domClass.toggle(reportButton, 'hidden');
        },

        /**
         * Toggle the mobile menu open or close
         */
        // toggleMobileMenu: function() {
        //     brApp.debug('WidgetsController >>> toggleMobileMenu');
        //     var mapNode = document.getElementById('brMap'),
        //         // accordion = registry.byId('layer-accordion'),
        //
        //         menuNodeId = 'mobileMenu',
        //         menuButton = 'mobile-menu-toggle',
        //         isClosing = domClass.contains(menuNodeId, 'open'),
        //         left = isClosing ? 0 : 290;
        //
        //     if ($('#layer-content').css("height") === "0px") {
        //         $('#layer-content').css("height", "auto");
        //     }
        //
        //
        //     $("#community-level-toggle_button").hide();
        //
        //
        //     if (!isClosing) {
        //         $("#mobile-menu-toggle").css("display", "none");
        //         domClass.toggle(menuNodeId, 'open');
        //         domClass.toggle(menuButton, 'hidden');
        //
        //     } else {
        //         $("#mobile-menu-toggle").css("display", "block");
        //         domClass.remove(menuButton, 'hidden');
        //     }
        //
        //
        //     Fx.animateProperty({
        //         node: mapNode,
        //         properties: {
        //             left: left
        //         },
        //         duration: DURATION,
        //         onEnd: function() {
        //             brApp.map.resize();
        //             if (isClosing) {
        //                 domClass.toggle(menuNodeId, 'open');
        //             }
        //
        //             $("#community-level-toggle_button").show();
        //             // setTimeout(function() {
        //             //     accordion.resize();
        //             // }, 0);
        //
        //         }
        //     }).play();
        //
        // },

        /**
         * notifies of the status of the mobile settings menu
         * @return {boolean}
         */
        mobileMenuIsOpen: function() {
            return domClass.contains('mobileMenu', 'open');
        },

        /**
         * Toggle the appropriate container's visibility based on which button was clicked in the UI
         */
        toggleMobileMenuContainer: function(evt) {
            brApp.debug('WidgetsController >>> toggleMobileMenuContainer');
            var target = evt.target ? evt.target : evt.srcElement,
                menuNode = document.querySelector('.segmented-menu-button.active'),
                containerNode = document.querySelector('.mobile-menu-content.active'),
                id;

            // If section is already active, back out now
            // Else remove active class from target and containerNode
            if (domClass.contains(target, 'active')) {
                return;
            }

            if (menuNode) {
                domClass.remove(menuNode, 'active');
            }

            if (containerNode) {
                domClass.remove(containerNode, 'active');
            }

            // Now add the active class to the target and to the container
            switch (target.id) {
                case "legendMenuButton":
                    id = 'mobile-legend-content';
                    break;
                case "toolsMenuButton":
                    id = 'mobile-tools-content';
                    break;
                case "layersMenuButton":
                    id = 'mobile-layers-content';


                    break;
            }

            domClass.add(target, 'active');
            domClass.add(id, 'active');

            // if (id === "mobile-layers-content") {
            //     registry.byId("layer-accordion").resize();
            // }

        },

        showEmbedCode: function() {
            if (registry.byId("embedCodeShareDialog")) {
                registry.byId("embedCodeShareDialog").destroy();
            }
            var embedCode = "<iframe src='" + window.location + "' height='600' width='900'></iframe>",
                dialog = new Dialog({
                    title: "Embed Code",
                    style: "width: 350px",
                    id: "embedCodeShareDialog",
                    content: "Copy the code below to embed in your site. (Ctrl+C on PC and Cmd+C on Mac)" +
                        "<div class='dijitDialogPaneActionBar'>" +
                        '<input id="embedInput" type="text" value="' + embedCode + '" autofocus /></div>'
                }),
                cleanup;


            cleanup = function() {
                //dialog.destroy(); //TODO- Why destroy on close??
            };

            dialog.show();
            dom.byId("embedInput").select();

            dialog.on('cancel', function() {
                cleanup();
            });
        },

        /**
         * Show the Welcome Dialog/Launch Screen for the Map
         */
        showWelcomeDialog: function() {
            brApp.debug('WidgetsController >>> showWelcomeDialog');
            //Check is the user has specified to hide the dialog
            // if (brApp.hideDialog) {
            //     return;
            // }

            var dialogContent = AppConfig.welcomeDialogContent,
                id = 'launch-dialog',
                currentCookie,
                setCookie,
                cleanup,
                launchDialog;

            cleanup = function(destroyDialog) {
                setCookie();

                launchDialog.hide();
            };

            setCookie = function() {
                if (dom.byId("welcomeDialogMemory")) {
                    if (dom.byId("welcomeDialogMemory").checked) {
                        cookie("launch-dialog", 'dontShow', {
                            expires: 7
                        });
                    }
                }
            };

            // Add a Close button to the dialog
            if (!registry.byId(id)) {
                dialogContent += "<input type='checkbox' id='welcomeDialogMemory'> Don't show this dialog again";
                launchDialog = new Dialog({
                    id: id,
                    content: dialogContent,
                    style: "width: 450px;max-width: 760px;"
                });
            } else {
                launchDialog = registry.byId(id);
            }
            currentCookie = cookie("launch-dialog");
            // if launchDialog.open == true, return

            if (currentCookie === undefined || currentCookie !== "dontShow") {

                launchDialog.show();
                // cbox = new CheckBox({
                //     checked: false,
                // }, "remembershowInstructions");

                launchDialog.on('cancel', function() {
                    cleanup(false);
                });
            } else {
                cleanup(true);
            }


            // if (document.getElementById('welcomeDialogMemory').checked == true) {
            //     brApp.hideDialog = true;
            // }
            //     registry.byId(id).hide();
            // });
            // cleanup(true);




            // } else {
            //     registry.byId(id).show();
            // }

        },

        /**
         * Toggle the upload form visible or not
         */
        toggleUploadForm: function() {
            brApp.debug('WidgetsController >>> toggleUploadForm');
            domClass.toggle('upload-form-content', 'hidden');
        },

        printMap: function(title, dpi, format, layoutType) {
          if (brApp.activeLayer === 'community-lands' || brApp.activeLayer === undefined){
            this.printCommunityMap(title, dpi, format, layoutType);
          } else {
            var self = this;
            // set print dimensions;
            var map = brApp.map;
            var printTitle = title;
        		var printDimensions = {height: map.height, width: map.width},
        			printTask = new PrintTask(AppConfig.printUrl),
        			params = new PrintParameters(),
        			mapScale = map.getScale(),
        			mapHeight = printDimensions.height,
        			mapWidth = printDimensions.width,
        			printTemplate = new PrintTemplate(),
        			// mapMultiplyer = (map.getZoom() > 5) ? 1 : 3;
              mapMultiplyer = 1;

        		params.map = map;


        		printTemplate.exportOptions = {
        		    width: mapWidth * mapMultiplyer, //multiply width
        		    height: mapHeight * mapMultiplyer, //multiply height
        		    dpi: mapMultiplyer * 96 //multiply dpi
        		};
        		printTemplate.format = 'PNG32';
        		printTemplate.layout = 'MAP_ONLY';
        		printTemplate.preserveScale = true;

        		//set scale with multiplyer
        		printTemplate.outScale = mapScale / mapMultiplyer;

        		params.template = printTemplate;


        		printTask.execute(params, function(response){
        			var printedMapImage = new Image(mapWidth * mapMultiplyer, mapHeight * mapMultiplyer);
              var logoImage = new Image(200, 100);
              var legendImage = new Image(400, 200);
              legendImage.src = './css/images/LMacknowledged.png';
              logoImage.src = './css/images/bienLogo.png';
        			//onload needs to go before cors and src
        			printedMapImage.onload = function(){
                //Check for active layer to determine what legend to use

                // if (brApp.activeLayer === 'land-tenure') {
                //   legendImage.src = './css/images/LMlegalSec.png';
                //   self._addCanvasElements(mapHeight, mapWidth, printedMapImage, mapMultiplyer, printTitle, logoImage, legendImage);
                // } else {
                //   switch (brApp.activeKey) {
                //     case 'combinedTotal':
                //       legendImage.src = './css/images/LMtotal.png';
                //       break;
                //     case 'combinedFormal':
                //       console.log('combinedFormal');
                //       legendImage.src = './css/images/LMacknowledged.png';
                //       break;
                //     case 'combinedInformal':
                //       legendImage.src = './css/images/LMnotAcknowledged.png';
                //       break;
                //     default:
                //       legendImage.src = './css/images/LMacknowledged.png';
                //   }
                  self._addCanvasElements(mapHeight, mapWidth, printedMapImage, mapMultiplyer, printTitle, logoImage, legendImage);
                // }

        			};
        			//set crossOrigin to anonymous for cors
        			printedMapImage.setAttribute('crossOrigin', 'anonymous');
        			printedMapImage.src = response.url;

        		}, function(error){
              console.log(error)
            });
          }
        },

        _addCanvasElements: function(mapHeight, mapWidth, printedMapImage, mapMultiplyer, printTitle, logoImage, legendImage){
          console.log('hit canvas');
      		//initiate fabric canvas
      		var mapCanvas = new fabric.Canvas('mapCanvas', {
      			height: (mapHeight * mapMultiplyer) + (mapHeight/1.5),
      			width: (mapWidth * mapMultiplyer) + (mapWidth/2.5),
      			background: '#fff'
      		});

      		var deMulptiplyer = 2,
      			heightAllowance = 40,
      			legendArray = [
      				{color: '#f00', label: 'red color'},
      				{color: '#0f0', label: 'green color'}
      			],
      			rectWidth = (mapWidth * mapMultiplyer) + (mapWidth/2.5),
      			rectHeight = (mapHeight * mapMultiplyer) + (mapHeight/1.5);

      		//add white background
      		mapCanvas.add(new fabric.Rect({width: rectWidth, height: rectHeight, left: 0, top: 0, fill: 'white', angle: 0}));

      		//add text to top
      		mapCanvas.add(new fabric.Text(printTitle, {fontSize: (80/deMulptiplyer), top: 100, left: (rectWidth/2), textAlign: 'center', originX: 'center', fontFamily: 'GillSansRegular'}));

          //add logo to top
          mapCanvas.add(new fabric.Image(logoImage, {top: 100, left: 50}));

          //add legend image
          var legendHeight = (mapHeight * mapMultiplyer) + (mapHeight/3);
          console.log(legendHeight);
          mapCanvas.add(new fabric.Image(legendImage, {top: legendHeight, left: (mapWidth/5)}));

      		//add map image
      		mapCanvas.add(new fabric.Image(printedMapImage, {left: (mapWidth/5), top: (mapHeight/3)}));

      		this._exportCanvasMap(printTitle);


      	},

        _exportCanvasMap: function(printTitle){
          console.log('hit export');
      		var canvas = document.getElementById('mapCanvas');
      		var canvasContext = canvas.getContext('2d');

      		canvasContext.scale(1, 1)

      		// document.getElementById('mapPrintContainerBackground').classList.add('hidden');


      		canvas.toBlob(function(blob) {
              document.querySelector('.canvas-container').classList.add('hidden')
      		   	saveAs(blob, printTitle.split(' ').join('_')+".png");

      			// $('#printLoader').addClass('hidden');
      		});
      	},

        printCommunityMap: function(title, dpi, format, layoutType) {
          brApp.debug('WidgetsController >>> printMap');
          var printTask = new PrintTask(AppConfig.printUrl);
          var printParameters = new PrintParameters();
          var template = new PrintTemplate();
          var question = '';
          var layout = '';

          if (layoutType === 'Portrait') {
            layout = 'landmark_comm_portrait';
          } else if (layoutType === 'Landscape') {
            layout = 'landmark_comm_landscape';
          } else {
            layout = 'MAP_ONLY'
          }

          template.format = format;
          template.layout = layout;
          // template.layout = layoutType;
          template.preserveScale = false;
          //- Custom Text Elements to be used in the layout,
          //- This is the way to add custom labels to the layout
          template.layoutOptions = {
            titleText: title,
            customTextElements: [
              {'question': question }
            ]
          };

          template.exportOptions = {
            dpi: dpi
          };

          printParameters.map = brApp.map;
          printParameters.template = template;
          //- Add a loading class to the print button and remove it when loading is complete
          domClass.add('print-widget', 'loading');

          printTask.execute(printParameters, function (response) {
            console.log('executed');
            domClass.remove('print-widget', 'loading');
            window.open(response.url);
          }, function (failure) {
            console.log(failure);
            domClass.remove('print-widget', 'loading');
          });

        },

        /**
         * Show the Analysis Dialog with the draw and upload buttons
         */
        showAnalysisDialog: function(customGraphics) {
            brApp.debug('WidgetsController >>> showAnalysisDialog');

            var layerTree = document.querySelector('.tree-widget-container')
            var searchButton = document.querySelector('.search-button')
            var reportButton = document.querySelector('.report-button')

            var body = win.body()
            var width = domGeom.position(body).w;

            if (width <= 768) {
              if (!domClass.contains(layerTree, "hidden")) {
                domClass.toggle(layerTree, 'hidden');
              }
              if (!domClass.contains(searchButton, "hidden")) {
                domClass.toggle(searchButton, 'hidden');
              }
              if (!domClass.contains(reportButton, "hidden")) {
                domClass.toggle(reportButton, 'hidden');
              }
            }


            if (customGraphics.graphics.length > 0) {
                $('#remove-graphics').removeClass('hidden');
                $('#draw-shape').addClass('display-three');
                $('#upload-shapefile').addClass('display-three');




            } else {
                $('#remove-graphics').addClass('hidden');
                $('#draw-shape').removeClass('display-three');
                $('#upload-shapefile').removeClass('display-three');
            }

            if (dom.byId('analysis-dialog').style.display != 'none') {
              registry.byId('analysis-dialog').hide();
            } else {
              registry.byId('analysis-dialog').show();
            }
        },

        showHelp: function(click) {
            brApp.debug('WidgetsController >>> showHelp');
            click.stopPropagation();

            var id = click.target.id;
            var dialog;
            var left = click.pageX + "px";
            var top = click.pageY + "px";

            switch (id) {
                case "indigenous-lands-help":

                    dialog = registry.byId('help-dialog-indigenous');
                    dialog.show();
                    $('#help-dialog-indigenous').css("top", top);
                    $('#help-dialog-indigenous').css("left", left);

                    break;
                case "community-lands-help":
                    dialog = registry.byId('help-dialog-community');
                    dialog.show();
                    $('#help-dialog-community').css("top", top);
                    $('#help-dialog-community').css("left", left);

                    break;
                case "analysis-help":
                    var left = (click.pageX - 300) + "px";
                    dialog = registry.byId('help-dialog-completeness');
                    dialog.show();
                    $('#help-dialog-completeness').css("top", top);
                    $('#help-dialog-completeness').css("left", left);
                    break;
            }





        }

    };

    return Controller;

});
