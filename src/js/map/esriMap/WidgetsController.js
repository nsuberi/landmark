define([
    'main/config',
    'dojo/on',
    'dojo/dom',
    'dijit/Dialog',
    'dojo/_base/fx',
    'dojo/dom-class',
    'dijit/registry'
], function(AppConfig, on, dom, Dialog, Fx, domClass, registry) {
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
                active = domClass.contains(legendNode, 'active'),
                height = active ? 0 : node.scrollHeight;

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
         * Show the appropriate data container when radio button is toggled
         */
        toggleDataContainer: function(evt) {
            var target = evt.target ? evt.target : evt.srcElement;
            if (target.id === 'national-level-toggle') {
                domClass.add('community-level-data-container', 'hidden');
                domClass.remove('national-level-data-container', 'hidden');
            } else if (target.id === 'community-level-toggle') {
                domClass.add('national-level-data-container', 'hidden');
                domClass.remove('community-level-data-container', 'hidden');
            }
        },

        /**
         * Toggle the tree widget container open or close
         */
        toggleTreeContainer: function() {
            brApp.debug('WidgetsController >>> toggleTreeContainer');
            var labelNode = document.getElementById('tree-container-toggle'),
                node = document.getElementById('tree-content'),
                active = domClass.contains(node, 'active'),
                height = active ? 0 : node.scrollHeight;

            labelNode.innerHTML = active ? '&plus;' : '&minus;';
            if (!active) {
                // If not active. add class now, else, add when animation done
                domClass.toggle(node, 'active');
            }

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
                    } else {
                        domClass.toggle(node, 'active');
                    }
                }
            }).play();

        },

        /**
         * Toggle the mobile menu open or close
         */
        toggleMobileMenu: function() {
            brApp.debug('WidgetsController >>> toggleMobileMenu');
            var mapNode = document.getElementById('brMap'),
                menuNodeId = 'mobileMenu',
                menuButton = 'mobile-menu-toggle',
                isClosing = domClass.contains(menuNodeId, 'open'),
                left = isClosing ? 0 : 290;

            if (!isClosing) {
                domClass.toggle(menuNodeId, 'open');
                // domClass.toggle(menuButton, 'hidden');
            }

            Fx.animateProperty({
                node: mapNode,
                properties: {
                    left: left
                },
                duration: DURATION,
                onEnd: function() {
                    brApp.map.resize();
                    if (isClosing) {
                        domClass.toggle(menuNodeId, 'open');
                    }
                }
            }).play();

        },

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
            var dialogContent = AppConfig.welcomeDialogContent,
                id = 'launch-dialog',
                launchDialog;

            // Add a Close button to the dialog
            if (!registry.byId(id)) {
                dialogContent += "<button id='launch-map' class='launch-map-button'>Launch Interactive Map</button>";
                launchDialog = new Dialog({
                    id: id,
                    content: dialogContent,
                    style: "width: 90%;max-width: 760px;"
                });

                launchDialog.show();
                on(document.getElementById('launch-map'), 'click', function() {
                    registry.byId(id).hide();
                });

            } else {
                registry.byId(id).show();
            }

        },

        /**
         * Toggle the upload form visible or not
         */
        toggleUploadForm: function() {
            domClass.toggle('upload-form-content', 'hidden');
        },

        /**
         * Show the Analysis Dialog with the draw and upload buttons
         */
        showAnalysisDialog: function() {
            brApp.debug('WidgetsController >>> showAnalysisDialog');
            registry.byId('analysis-dialog').show();
        }

    };

    return Controller;

});