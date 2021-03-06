/** @jsx React.DOM */
define([
	'react',
	'map/MapConfig',
	'map/LayerController',
  'components/PercentLegend'
], function (React, MapConfig, LayerController, PercentLegend) {


  	// CONSTANTS
  	var LandTenureInd = 'land-tenure-indigenous';
  	var LandTenureCom = 'land-tenure-community';
  	var LandTenure = 'land-tenure';
  	var PercentIndigenous = 'percent-indigenous';

  	// Small Sub Class to render the lists, needs to keep track of active list item
  	// Shows Question onClick
  	/** Requirements:
  		data: array of data
  		each item in the array must have id, label properties, with an optional question property
  	*/
  	var LayerList = React.createClass({

  		getInitialState: function () {

  			if (this.props.class === 'percent-indigenous-tree') {
  				return {
  					active: this.props.data[1].id
  				};
  			} else {
  				return {
  					active: this.props.data[0].id
  				};
  			}

  		},

  		/* jshint ignore:start */
  		render: function () {
  			return (
  				<div className={this.props.class || 'national-level-layer-list'}>
  					{this.props.data.map(this.dataMapper, this)}
  				</div>
  			);
  		},

  		dataMapper: function (item, index) {


  			var active = (this.state.active === item.id);
  			var subTitle = item.subTitle;
  			var subLayer = item.subLayer;
  			var layer = item.layer;
				if (this.props.layerActive !== this.props.activeTab && layer === -1 ) {
					active = true;
				} else if (this.props.layerActive !== this.props.activeTab && active === true) {
					active = false;
				};

  			return (
  				<div className={'national-layer-list-item '} key={item.id} >
  					<div className={'national-layer-list-item-label ' + (active && this.props.layerActive !== 'none' ? 'active' : '') + (subTitle ? 'subTitle' : '') + (subLayer ? 'subLayer' : '') } onClick={layer != undefined ? this.setActiveLayer.bind(this, item.id, item.layer) : null}>{item.label}</div>
  					{
  						item.question && this.props.layerActive === this.props.activeTab ?
  						<div className={'national-layer-list-item-question' + (active && this.props.layerActive !== 'none' ? 'question-visible' : '' )}>{item.question}</div> :
  						null
  					}
  				</div>
  			);
  		},
  		/* jshint ignore:end */
  		setActiveLayer: function (key, layer) {
				if (key === 'none') {
					brApp.activeLayer = 'none';
				}
  			this.setState({
  				'active': key
  			});

  			// Notify Parent and let parent dispatch updates
  			this.props.change(key, layer);

  		}

  	});

		return LayerList;

  });
