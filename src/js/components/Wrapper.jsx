/** @jsx React.DOM */
define([
  'react',
  'dojo/topic',
  'map/MapConfig'
], function (React, topic, MapConfig) {
  'use strict';

  var stylesheet = {
  modalContainer: {
    position: 'fixed',
    height: '100%',
    width: '100%',
    zIndex: 1000,
    left: 0,
    top: 0
  },
  modalBackground: {
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    height: '100%',
    width: '100%'
  },
  modal: {
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white',
    position: 'absolute',
    padding: '30px',
    height: 'auto',
    left: '50%',
    top: '50%'
  },
  close: {
    position: 'absolute',
    cursor: 'pointer',
    display: 'flex',
    height: '30px',
    width: '30px',
    right: 0,
    top: 0
  },
  closeSvg: {
    fill: '#555555',
    margin: 'auto',
    height: '26px',
    width: '26px'
  },
  content: {
    maxHeight: '450px',
    overflowX: 'hidden',
    overflowY: 'auto',
    padding: '5px'
  }
};

  var Wrapper = React.createClass({

    render: function () {

      // var visible = this.props.visible;
      var close = this.props.close;
      var theme = this.props.theme;
      var containerStyle = Object.assign({}, stylesheet.modalContainer);
      //- Build up the attributes
      var modalAttrs = {
        style: stylesheet.modal
      };

      //- show or hide the container
      // containerStyle.display = visible ? '' : 'hidden';

      return (
        <div className={'print-modal-wrapper hidden'} style={containerStyle}>
          <div style={stylesheet.modalBackground} onClick={close} />
          <article {...modalAttrs}>
            <div id='close-print-modal' title='close' style={stylesheet.close} onClick={close}>
              <svg style={stylesheet.closeSvg} viewBox='0 0 25 25'>
                <title>Close</title>
                <path d="M 5 19 L 19 5 L 21 7 L 7 21 L 5 19 ZM 7 5 L 21 19 L 19 21 L 5 7 L 7 5 Z"></path>
              </svg>
            </div>
              <div style={stylesheet.content}>
                {this.props.children}
              </div>
          </article>
        </div>
      );
    }

  });

  return Wrapper;

});
