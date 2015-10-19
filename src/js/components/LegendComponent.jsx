/** @jsx React.DOM */
define([
  'react',
  'dojo/topic',
  'map/MapConfig'
], function (React, topic, MapConfig) {
  'use strict';

  // CONSTANTS
	var LandTenureInd = 'land-tenure-indigenous';

  var LayerGroup = React.createClass({

    getInitialState: function () {
      var visLayersInfo = this.dataGrabber();

      return {
        layerInfos: brApp.layerInfos,
        visibleLayersInfo: visLayersInfo,
        map: brApp.map,
        active: true
       };

    },
    componentDidMount: function() {
      topic.subscribe('refresh-legend', this.handleMapUpdate);
    },

    componentDidUpdate: function() {
      brApp.previousFamily = '';
    },

    handleMapUpdate: function() {

      var visLayersInfo = this.dataGrabber();

      if (visLayersInfo.length === 0) {
        $(".legend-component-content").addClass('collapsed');
      } else {
        $(".legend-component-content").removeClass('collapsed');
      }

      this.setState({
				'visibleLayersInfo': visLayersInfo
			});

    },

    render: function () {

      return (
				<div className='legend-container'>
          {this.state.visibleLayersInfo.map(this.dataMapper, this)}
				</div>
			);

		},

    dataMapper: function (item, index) {

      //todo: I need a way to sort theese layers by group, so all of the officiallyRecognized
      // layers go together, but do this in a way where sorting by Family takes precedence;
      // so sort by family, and then intra-family by group
      var layersToRender = [];

      for (var k = 0; k < item.layers.length; k++) {
        if (item.visibleLayers.indexOf(item.layers[k].layerId) > -1) {

          var legendItem = {};

          legendItem.group = item.group;
          legendItem.layerName = item.layers[k].layerName;
          legendItem.layerId = item.layers[k].layerId;
          legendItem.legend = item.layers[k].legend;

          if (item.layer.indexOf('indigenous') > -1) {
            legendItem.family = 'Indigenous Lands';
          } else if (item.layer.indexOf('community') > -1) {
            legendItem.family = 'Community Lands';
          } else if (item.layer === 'percentLands') {
            legendItem.family = 'Percent of Indigenous & Community Lands';
          } else if (item.layer === 'landTenure') {
            legendItem.family = 'Indicators of Land Tenure Security';
          }

          if ((legendItem.group === "Formally recognized" || legendItem.group === "Not formally recognized") && legendItem.layerId === 0) {
            //do nothing
          } else {
            layersToRender.push(legendItem);
          }
        }
      }

      for (var m = 0; m < layersToRender.length; m++) {

        if (layersToRender[m].family === brApp.previousFamily && (layersToRender[m].family === 'Indigenous Lands' || layersToRender[m].family === 'Community Lands')) {
          layersToRender[m].family = '';
        } else {
          brApp.previousFamily = layersToRender[m].family;
        }
      }

      // layersToRender.sort(function(a, b) {
      //   return localeCompare(a.group) - localeCompare(b.group);
      // });

			return (
				<div className='layer-group'>
          {layersToRender.map(function(layer) {

            return (
              <div>
                {
                  layer.family ?
                  <div className='legend-item-family'>{layer.family}</div> :
                  null
                }
                <div className='legend-item-group'>{layer.group}</div>
                  {layer.legend.map(function(legendObject, i){

                    return <div className='legend-item-name'><img className='legend-item-img' src={'data:image/png;base64,'+legendObject.imageData}></img>{legendObject.label}</div>
                  })}

              </div>
            )
          })}
				</div>

			);
		},

    dataGrabber: function() {
      var visLayersInfo = [];


      for (var i = 0; i < brApp.layerInfos.length; i++) {
        var mapLayer = brApp.map.getLayer(brApp.layerInfos[i].layerId);

        if (mapLayer.visible === true && mapLayer.visibleLayers.length > 0 && mapLayer.visibleLayers[0] !== -1) {

          var group, layer, visibleLayers;

          if (mapLayer.id.indexOf('indigenous') > -1) {
            if (mapLayer.id.indexOf('Occupied') > -1 || mapLayer.id.indexOf('FormalClaim') > -1) {
              group = 'Not formally recognized';
              layer = mapLayer.id;
              visibleLayers = mapLayer.visibleLayers;
            } else {
              group = 'Formally recognized';
              layer = mapLayer.id;
              visibleLayers = mapLayer.visibleLayers;
            }
          } else if (mapLayer.id.indexOf('community') > -1) {
            if (mapLayer.id.indexOf('Occupied') > -1 || mapLayer.id.indexOf('FormalClaim') > -1) {
              group = 'Not formally recognized';
              layer = mapLayer.id;
              visibleLayers = mapLayer.visibleLayers;
            } else {
              group = 'Formally recognized';
              layer = mapLayer.id;
              visibleLayers = mapLayer.visibleLayers;
            }
          } else if (mapLayer.id === 'percentLands') {

            layer = mapLayer.id;
            visibleLayers = mapLayer.visibleLayers;

            switch (visibleLayers[0]) {
              case 1:
                  group = 'Indigenous and Community Lands - Total';
                  break;
              case 2:
                  group = 'Indigenous and Community Lands - Formally recognized';
                  break;
              case 3:
                  group = 'Indigenous and Community Lands - Not formally recognized';
                  break;
              case 5:
                  group = 'Indigenous Lands (only) - Total';
                  break;
              case 6:
                  group = 'Indigenous Lands (only) - Formally recognized';
                  break;
              case 7:
                  group = 'Indigenous Lands (only) - Not formally recognized';
                  break;
              case 9:
                  group = 'Community Lands (only) - Total';
                  break;
              case 10:
                  group = 'Community Lands (only) - Formally recognized';
                  break;
              case 11:
                  group = 'Community Lands (only) - Not formally recognized';
                  break;
            }
          } else if (mapLayer.id === 'landTenure') {

            layer = mapLayer.id;
            visibleLayers = mapLayer.visibleLayers;
            if (visibleLayers[0] === 0 || visibleLayers[0] === 1) {

              group = 'Indicators of the Legal Security of Lands - Community';
            } else {
              group = 'Indicators of the Legal Security of Lands - Indigenous';
            }

          }
          brApp.layerInfos[i].data.group = group;
          brApp.layerInfos[i].data.layer = layer;
          brApp.layerInfos[i].data.visibleLayers = visibleLayers;

          if (mapLayer.id.indexOf("Tiled") > -1) {
            if (brApp.map.getZoom() > 7) {
              //do nothing
            } else {
              visLayersInfo.push(brApp.layerInfos[i].data);
            }
          } else if (mapLayer.id.indexOf('community') > -1 || mapLayer.id.indexOf('indigenous') > -1) {
            if (brApp.map.getZoom() <= 7) {
              //do nothing
            } else {
              visLayersInfo.push(brApp.layerInfos[i].data);
            }
          } else {
            visLayersInfo.push(brApp.layerInfos[i].data);
          }

        }
      }

      return visLayersInfo;
    },

  });

  var Legend = React.createClass({

    getInitialState: function () {
      return {
        layerInfos: [],
        visibleLayers: [],
        map: brApp.map,
        collapsed: false
       };
    },
    toggleActive: function () {
      var newCollapsed;

      if (this.state.collapsed === true) {
        newCollapsed = false;
        $("#toggleLegend").html('-');
      } else {
        newCollapsed = true;
        $("#toggleLegend").html('+');
      }

      this.setState({
        // collapsed: this.state.collapsed ? false: true
        collapsed: newCollapsed
      });
    },

    toggleLayer: function () {
      this.setState({
        activeTab: (this.state.activeTab === 'community' ? 'national' : 'community')
      });
    },

    render: function () {
      return (

        <div className={'legend-component-container' + (this.state.collapsed ? ' collapsed': '')}>
          <div className='legend-component-controls'>
            <div className='legend-controls'>
              Legend Component
              <span id='toggleLegend' onClick={this.toggleActive}>-</span>
            </div>

          </div>
          <div className={'legend-component-content' + (this.state.collapsed ? ' collapsed': '')}>
              <LayerGroup />
          </div>
        </div>
      );
    }

  });

  return function (node) {
    return React.render(<Legend />, document.getElementById(node));
  };

});
