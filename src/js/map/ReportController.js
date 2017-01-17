define([
    'map/ReportConfig',
    'map/WidgetsController',
    'esri/map',
    'dojo/on',
    'dojo/dom',
    'dojo/dom-class',
    'esri/geometry/Extent',
    'esri/layers/ImageParameters',
    'esri/layers/ArcGISDynamicMapServiceLayer',
    'esri/tasks/query',
    'esri/tasks/QueryTask',

], function(ReportConfig, WidgetsController, Map, on, dom, domClass, Extent, ImageParameters, ArcGISDynamicMapServiceLayer, Query, QueryTask) {
    'use strict';

    var ReportController = {

        init: function(country) {
            esri.config.defaults.io.corsEnabledServers.push("http://gis.wri.org");

            var self = this;

            on(document.getElementById('share-button'), 'click', self.toggleShareContainer);
            on(document.getElementById('embedShare'), 'click', WidgetsController.showEmbedCode);
            on(document.getElementById('csvShare'), 'click', self.downloadCSV);

            var bounds = new Extent({
              "xmin":-16045622,
              "ymin":-811556,
              "xmax":7297718,
              "ymax":11142818,
              "spatialReference":{"wkid":102100}
            });

            var map = new Map('reportMap', {
              // basemap: 'none',
              extent: bounds,
              zoom: 4,
              isDoubleClickZoom: false,
              isRubberBandZoom: false,
              isScrollWheelZoom: false,
              isShiftDoubleClickZoom: false,
              isZoomSlider: false,
              isPan: false,
              slider: false

            });

            var countries = new ArcGISDynamicMapServiceLayer(ReportConfig.countrySnapUrl, {
              visible: true,
              outFields: ['*']
            });

            var layerDefinitions = [];
            layerDefinitions[0] = "Country = '" + country + "'";
            countries.setLayerDefinitions(layerDefinitions);
            this.map = map;
            this.country = country;
            var self = this;

            map.on('click', function (evt) {
              window.open('map.html#country=' + self.country);
            });

            var countryQT = new QueryTask(ReportConfig.countrySnapUrl + '/' + ReportConfig.countrySnapIndex)
            var countryQuery = new Query();
            countryQuery.where = "Country = '" + country + "'";
            countryQuery.returnGeometry = true;
            countryQuery.outFields = ['*'];

            countryQT.execute(countryQuery, function (result) {
              if (result.features && result.features[0]) {
                self.map.setExtent(result.features[0].geometry.getExtent());
                console.log(result.features[0]);

                ReportConfig.reportAttributes.forEach(function(attribute){
                  switch (result.features[0].attributes[attribute.attr]) {
                    case '1':
                      dom.byId(attribute.domId).innerHTML = '<div class="low">1</div>'
                      break;
                    case '2':
                      dom.byId(attribute.domId).innerHTML = '<div class="medium">2</div>'
                      break;
                    case '3':
                      dom.byId(attribute.domId).innerHTML = '<div class="high">3</div>'
                      break;
                    case '4':
                      dom.byId(attribute.domId).innerHTML = '<div class="highest">4</div>'
                      break;
                    case 'N/A':
                      dom.byId(attribute.domId).innerHTML = '<div class="unavailable">No Data</div>'
                      break;
                    case '':
                      dom.byId(attribute.domId).innerHTML = '<div class="unavailable">No Data</div>'
                      break;
                    case null:
                      dom.byId(attribute.domId).innerHTML = '<div class="unavailable">No Data</div>'
                      break;
                    default:

                  }
                });

                var countryLand = result.features[0].attributes.Ctry_Land ? result.features[0].attributes.Ctry_Land : 0;
                // var iso2Value = ReportConfig.countryCodeExceptions.includes(result.features[0].attributes.ISO_ALPHA) ?
                var iso2Value;
                var countryCodeExceptions = ReportConfig.countryCodeExceptions
                for (var i = 0; i < countryCodeExceptions.length; i++) {
                  if (result.features[0].attributes.ISO_Code === countryCodeExceptions[i].ISO) {
                    dom.byId('flag-icon').classList = 'flag-icon flag-icon-'+countryCodeExceptions[i].ISO2.toLowerCase();
                  } else {
                    dom.byId('flag-icon').classList = 'flag-icon flag-icon-'+result.features[0].attributes.ISO_ALPHA2.toLowerCase();
                  }
                }

                dom.byId('land-count').innerHTML = 'Number of Indigenous and Community Lands Mapped: ' + result.features[0].attributes.NB_Maps;
                dom.byId('country-name').innerHTML = result.features[0].attributes.Country;
                dom.byId('country-land-area').innerHTML = 'COUNTRY LAND AREA:'
                dom.byId('country-hectares').innerHTML = Math.round(countryLand) + ' Hectares';
                dom.byId('average-score-comm').innerHTML = result.features[0].attributes.ind_C_A;
                dom.byId('average-score-indig').innerHTML = result.features[0].attributes.ind_IP_A;
                // dom.byId('pct-ack-gov').innerHTML = 'Acknowledged: ' + result.features[0].attributes.Pct_F;
                // dom.byId('pct-no-ack-gov').innerHTML = 'Not acknowledged: ' + result.features[0].attributes.Pct_NF;
                // dom.byId('pct-total-ack').innerHTML = 'total: ' + result.features[0].attributes.Pct_tot;
                // dom.byId('comm-ack-gov').innerHTML = result.features[0].attributes.Map_C_F;
                // dom.byId('comm-no-ack-gov').innerHTML = result.features[0].attributes.Map_C_NF;
                // dom.byId('comm-total-ack').innerHTML = result.features[0].attributes.Map_C_T;
                // dom.byId('indig-ack-gov').innerHTML = result.features[0].attributes.Map_IP_F;
                // dom.byId('indig-no-ack-gov').innerHTML = result.features[0].attributes.Map_IP_NF;
                // dom.byId('indig-total-ack').innerHTML = result.features[0].attributes.Map_IP_T;

                self.map.setExtent(result.features[0].geometry.getExtent());
                self.map.disablePan();
                self.map.disableDoubleClickZoom();
                self.map.disableScrollWheelZoom();
                self.map.disableKeyboardNavigation();
                self.map.disableMapNavigation();

                self.addCharts(result.features[0]);
              }
            });

            map.addLayer(countries);
            this.addLayers(country);
        },

        toggleShareContainer: function() {
          console.log('toggleShareContainer');
            var connector = document.querySelector('.share-container'),
                container = document.querySelector('.share-connector');

            if (connector && container) {
                domClass.toggle(connector, 'hidden');
                domClass.toggle(container, 'hidden');
            }

        },

        downloadCSV: function() {
          console.log('downloadCSV');
          //TODO: Create a global CSV out of our queried data and process it, then access it here!

          // var blob = new Blob([window.payload.csv], {
          //     type: "text/csv;charset=utf-8;"
          // });
          //
          // saveAs(blob, "LandMarkCountryResults.csv");

        },

        addLayers: function (country) {
          var self = this;

          ReportConfig.mapLayers.forEach(function(layerConfig) {
            var params = new ImageParameters();
            params.layerOption = ImageParameters.LAYER_OPTION_SHOW;
            params.layerIds = layerConfig.layerIds;
            params.format = 'png32';

            var layer = new ArcGISDynamicMapServiceLayer(layerConfig.url, {
                visible: true,
                imageParameters: params
            });

            var layerDefinitions = [];
            layerDefinitions[layerConfig.layerIds[0]] = "Country = '" + country + "'";
            if (layerConfig.layerIds.length > 1) {
              layerDefinitions[layerConfig.layerIds[1]] = "Country = '" + country + "'";
            }
            layer.setLayerDefinitions(layerDefinitions);

            self.map.addLayer(layer);

          });
          // var params = new ImageParameters();
          //
          // params.layerOption = ImageParameters.LAYER_OPTION_SHOW;
          // params.layerIds = [1];
          // params.format = 'png32';
          //
          // var layer = new ArcGISDynamicMapServiceLayer(, {
          //     visible: true,
          //     imageParameters: params
          // });
          //
          // var layer = new ArcGISDynamicMapServiceLayer(, {
          //     visible: true,
          //     imageParameters: params
          // });
          //
          // var layerDefinitions = [];
          // layerDefinitions[1] = "Country = '" + country + "'";
          // layer.setLayerDefinitions(layerDefinitions);
          //
          // this.map.addLayer(layer);
        },

        addCharts: function(data) {
          console.log('data!!', data);
          var fixedTotal = data.attributes.Pct_tot;
          if (fixedTotal) {
            fixedTotal = fixedTotal.toFixed(2);
          } else {
            fixedTotal = data.attributes.Pct_F + data.attributes.Pct_NF;
          }

          var angle = (fixedTotal / 100) * 180;
          console.log(angle);

          if (angle === 0) {
            angle = 180
          }

          Highcharts.chart('estimated-chart', {
            chart: {
              plotBackgroundColor: null,
              backgroundColor: 'gray',
              plotBorderWidth: 0,
              plotShadow: false
            },
            colors: ['#f4e0d7', '#e5aa92'],
            title: {
              useHTML: true,
              shape: 'circle',
              style: { "height": "100px", "color": "white", "background-color": "#152f3e", "padding": "25px", "padding-left": "30px", "padding-right": "30px", "border-radius": "50%", "fontSize": "18px" },
              text: '<p class="chart-center chart-percent"> ' + fixedTotal + '%</p><p class="chart-center">Total</p> ',
              align: 'center',
              verticalAlign: 'middle',
              y: 20
            },
            tooltip: {
              pointFormat: '<b>{point.y}%</b>'
            },
            plotOptions: {
              pie: {
                dataLabels: {
                  enabled: true,
                  distance: -50,
                  style: {
                    fontWeight: 'bold',
                    color: 'white'
                  }
                },
                startAngle: -(angle),
                endAngle: angle,
                center: ['50%', '75%']
              }
            },
            series: [{
              type: 'pie',
              // name: 'Browser share',
              innerSize: '60%',
              data: [
                [data.attributes.Pct_F + '% Acknowledged by gov',   data.attributes.Pct_F],
                [data.attributes.Pct_NF + '% Not acknowledged',       data.attributes.Pct_NF],
                {
                  name: 'Proprietary or Undetectable',
                  y: 0.2,
                  dataLabels: {
                    enabled: false
                  }
                }
              ]
            }]
          });


          if (!data.attributes.Map_C_F && !data.attributes.Map_C_NF) {
            dom.byId('community-lands-chart').innerHTML = '<h2>No Data!</h2>';
          } else {
            Highcharts.chart('community-lands-chart', {
              chart: {
                height: 250,
                width: 250,
                plotBackgroundColor: null,
                backgroundColor: 'gray',
                plotBorderWidth: 0,
                plotShadow: false
              },
              title: {
                useHTML: true,
                shape: 'circle',
                // style: { "height": "100px", "color": "white", "background-color": "#055d7d", "padding": "20px", "border-radius": "50%", "fontSize": "18px" },
                // text: '<p class="chart-center">Lands held:</p> <p class="chart-center chart-percent"> ' + data.attributes.Map_C_T.toFixed(2) + '%</p>',
                align: 'center',
                verticalAlign: 'middle',
                y: 40
              },
              tooltip: {
                pointFormat: '<b>{point.y}%</b>'
              },
              plotOptions: {
                pie: {
                  dataLabels: {
                    enabled: true,
                    distance: -50,
                    style: {
                      fontWeight: 'bold',
                      color: 'white'
                    }
                  },
                  startAngle: -(data.attributes.Map_C_T / 100) * 180,
                  endAngle: (data.attributes.Map_C_T / 100) * 180,
                  center: ['50%', '75%']
                }
              },
              series: [{
                type: 'pie',
                // name: 'Browser share',
                innerSize: '60%',
                data: [
                  [data.attributes.Map_C_F + '% Acknowledged by gov',   data.attributes.Map_C_F],
                  [data.attributes.Map_C_NF + '% Not acknowledged',       data.attributes.Map_C_NF],
                  {
                    name: 'Proprietary or Undetectable',
                    y: 0.2,
                    dataLabels: {
                      enabled: false
                    }
                  }
                ]
              }]
            });
          }


          if (!data.attributes.Map_IP_F && !data.attributes.Map_IP_NF) {
            dom.byId('indigenous-lands-chart').innerHTML = '<h2>No Data!</h2>';
          } else {
            Highcharts.chart('indigenous-lands-chart', {
              chart: {
                height: 250,
                width: 250,
                plotBackgroundColor: null,
                backgroundColor: 'gray',
                plotBorderWidth: 0,
                plotShadow: false
              },
              title: {
                useHTML: true,
                shape: 'circle',
                // style: { "height": "100px", "color": "white", "background-color": "#055d7d", "padding": "20px", "border-radius": "50%", "fontSize": "18px" },
                // text: '<p class="chart-center">Lands held:</p> <p class="chart-center chart-percent"> ' + data.attributes.Map_IP_T.toFixed(2) + '%</p>',
                align: 'center',
                verticalAlign: 'middle',
                y: 40
              },
              tooltip: {
                pointFormat: '<b>{point.y}%</b>'
              },
              plotOptions: {
                pie: {
                  dataLabels: {
                    enabled: true,
                    distance: -50,
                    style: {
                      fontWeight: 'bold',
                      color: 'white'
                    }
                  },
                  startAngle: -(data.attributes.Map_IP_T / 100) * 180,
                  endAngle: (data.attributes.Map_IP_T / 100) * 180,
                  center: ['50%', '75%']
                }
              },
              series: [{
                type: 'pie',
                // name: 'Browser share',
                innerSize: '60%',
                data: [
                  [data.attributes.Map_IP_F.toFixed(2) + '% Acknowledged by gov',   data.attributes.Map_IP_F],
                  [data.attributes.Map_IP_NF.toFixed(2) + '% Not acknowledged',       data.attributes.Map_IP_NF],
                  {
                    name: 'Proprietary or Undetectable',
                    y: 0.2,
                    dataLabels: {
                      enabled: false
                    }
                  }
                ]
              }]
            });
          }

        },

        exportAnalysisResult: function(text) {

            var blob = new Blob([text], {
                type: "text/csv;charset=utf-8;"
            });

            saveAs(blob, "LandMarkAnalysisResults.csv");

        },

        numberWithCommas: function(x) {
            var parts = x.toString().split(".");
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            //return parts.join(".");
            return parts[0];
        },

        printAnalysis: function(config) {
            window.print();

        },


    };

    return ReportController;

});
