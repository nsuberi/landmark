/** @jsx React.DOM */
define([
	'react'
], function (React) {
	'use strict';

	var TreeNode = React.createClass({
		/* jshint ignore:start */
		getInitialState: function () {
	    return {
	      collapsed: this.props.node.collapsed || false
	    };
	  },

	  /**
	  * Update the state of the component to hide or show the children
	  */
	  handleClick: function (evt) {
	  	
	  	if (this.props.node.disabled) {
	  		return;
	  	}

	    this.setState({
	      collapsed: !this.state.collapsed
	    });
	  },

	  render: function() {
	    var containerClass = this.state.collapsed ? 'collapsed' : '';
	    var node = this.props.node;
	    var disabled = node.disabled || false;
	    var childNodes;

	    containerClass += (disabled ? ' disabled' : '');
	    
	    if (node.children) {
	      childNodes = node.children.map(function (child, index) {
	      	child.disabled = child.disabled || disabled;
	        return (
	          <ul key={[node.id, index].join('/')}>
	            <TreeNode
	              key={node.id}
	              node={child}
	              handleChange={this.props.handleChange}
	            />
	          </ul>
	        );       
	      }, this);
	    }

	    return (
	      <li className={containerClass}>
	      	<section className='tree-row-content'>
		        <span className='tree-toggle-symbol' onClick={this.handleClick} >
		          { node.children === undefined ? 
		            '' :
		            (this.state.collapsed ? String.fromCharCode(43) : String.fromCharCode(8722))
		          }
		        </span>
		        <input 
		          type='checkbox' 
		          checked={node.checked || false}
		          onChange={this.props.handleChange}
		          data-key={node.id}
		          disabled={disabled}
		         />
		        <span className='tree-node-label' onClick={this.handleClick}>{node.label}</span>
		      </section>
	        {childNodes}
	      </li>
	    );
	  }
		/* jshint ignore:end */
	});

	return TreeNode;

});