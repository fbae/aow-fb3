// View für eine Frage, die sich aus mehreren Buttons zusammensetzen kann
// =========================================================================

define(function(require) {
	var $ = require('jquery');
	var _ = require('underscore');
	var Backbone = require('backbone');
	var liTemplate = require('text!../../templates/mtLi.html');

	var MtView = Backbone.View.extend( {
		el: '#f', 

		initialize: function() {
			this.$el.off('click','a.mtAntwort');
			var f = this.collection; // Fragen
			// aktuelle Frage ermitteln
			var ablauf = f.ablauf[f.typ][f.akt];
			this.frage = f.get(ablauf['f'][0]);

			// Objekt fertigmachen, das die Daten für das Template hält
			this.fO = JSON.parse(this.frage.attributes.toJSON());
			// vorherige und nachfolgende Frage für Verlinkung bestimmen
			this.fO.next = f.nachher();
			this.fO.prev = f.vorher();
			this.fO.heading = (ablauf.hasOwnProperty('heading')) ? ablauf.heading : null;
			this.fO.kodierung = f.zeitpunkt() + this.frage.id;
		},
		events: {
			'click a.mtAntwort':'antwort',
		},

		antwort: function(evt) {
			fb2.setzeAntwort({
				'kodierung': this.fO.kodierung, 
				'zeit': new Date(),	
				'antw': evt.target.attributes['data-value'].value
			});
		},

		render: function() {
			// Template rendern
			this.template = _.template(this.frage.attributes.template)(this.fO);
			// HTML in DOM einhängen und mit page() jqm die Seite verbessert
			this.$el.html(this.template);
			this.$el.find( ":jqmData(role=listview)" ).listview(); // jqm verbessern 
			this.$el.page();
			// verbessern: http://jquerymobile.com/demos/1.2.0/docs/pages/page-dynamic.html

			// Maintains chainability
			return this;
		}
	} );
	// Returns the View class
	return MtView;
} );

