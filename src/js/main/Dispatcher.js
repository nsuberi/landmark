define([
    'dojo/topic',
    'map/MapController'
], function(topic, MapController) {
    

    var Dispatcher = {

        /**
         * Subscribe to all app wide events here, pass them on to their respective handlers
         */
        listen: function() {
            brApp.debug('Dispatcher >>> listen');
            // Map Controller Functions
        }

    };

    return Dispatcher;

});
