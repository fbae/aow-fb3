// View für mehrere Fragen mit horizontaler Auswahl
// ================================================

define( function( require ) {
	var $ = require('jquery');
	var _ = require('underscore');
	var Backbone = require('backbone');
	var msgViewTemplate = require('text!../templates/msgView.html');

	var MsgView = Backbone.View.extend( {
		el: '#f',
		initialize: function() {
		},

		render: function() {
			var f = this.collection; // Fragen
			// aktuelle Meldung ermitteln
			var fO = new Object();
			fO.msg = f.ablauf[f.typ][f.akt]['msg'];
			// vorherige und nachfolgende Frage für Verlinkung bestimmen
			fO.next = f.nachher();
			fO.prev = f.vorher();

			// Template rendern
			this.template = _.template(msgViewTemplate,fO);
			// HTML in DOM einhängen
			this.$el.html(this.template).page();

			// Maintains chainability
			return this;
		}
	} );
	// Returns the View class
	return MsgView;
} );

