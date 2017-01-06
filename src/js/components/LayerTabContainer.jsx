/** @jsx React.DOM */
define([
  'react',
  'map/MapConfig',
  'components/LayerSelectionDropdown',
	'map/WidgetsController'
], function (React, MapConfig, LayerSelectionDropdown, WidgetsController) {
  'use strict';

  var TabContainer = React.createClass({

    getInitialState: function () {
      return { activeTab: 'community' };
    },

    getTitle: function (value) {
      if (value === 0) {
        return 'Indigenous & Community Land Maps'
      } else if (value === 1) {
        return 'Proportion of Country Held by Indigenous Peoples & Communities'
      } else if (value === 2) {
        return 'Indicators of the Legal Security of Indigenous and Community Lands'
      }
    },

    render: function () {
      console.log(MapConfig.communityLevelLayers);
      return (
        <div className='layer-tab-container'>
          <div className='layer-tab-content'>
            <div className={'community-layers-tab tab-panel' + (this.state.activeTab === 'community' ? '': ' hidden')}>
              <LayerSelectionDropdown layerData={MapConfig.communityLevelLayers} title={this.getTitle(0)} selection={'community-lands'} />
              <LayerSelectionDropdown title={this.getTitle(1)} selection={'percent-indigenous'} />
              <LayerSelectionDropdown title={this.getTitle(2)} selection={'land-tenure'} />
            </div>
          </div>
        </div>
      );
    }

  });

  return function (node) {
    return React.render(<TabContainer />, document.getElementById(node));
  };

});
