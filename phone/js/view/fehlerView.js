// View für Fehler
// ===============

define( function( require ) {
	var $ = require('jquery');
	var _ = require('underscore');
	var Backbone = require('backbone');
	var fehlerViewTemplate = require('text!../templates/fehlerView.html');

	var FehlerView = Backbone.View.extend( {
		el: '#f',

		initialize: function() {
		},

		render: function() {
			this.template = _.template(fehlerViewTemplate, {});
			this.$el.html(this.template).page();
			return this;
		}
	} );

	// Returns the View class
	return FehlerView;
} );

