// View, abgeleitet von mt - ausschließlich für die kurze Strecke während der Arbeit
// Besonderheit: das Speichern ist an die letzte Frage (SITMOOD) gebunden
// ================================================

define(function(require) {
	var $ = require('jquery');
	var _ = require('underscore');
	var Backbone = require('backbone');

	var WView = Backbone.View.extend( {
		el: '#f',

		initialize: function() {
			this.$el.off('click','a.mtAntwort').off('pageshow');
			var f = this.collection; // Fragen
			// aktuelle Frage ermitteln
			var ablauf = f.ablauf[f.typ][f.akt];
			this.frage = f.get(ablauf['f'][0]);

			// Objekt fertigmachen, das die Daten für das Template hält
			this.fO = JSON.parse(this.frage.attributes.toJSON());
			// vorherige und nachfolgende Frage für Verlinkung bestimmen
			this.fO.next = f.nachher();
			// this.fO.prev = f.vorher(); wird nicht benötigt
			this.fO.heading = (ablauf.hasOwnProperty('heading')) ? ablauf.heading : null;
			this.fO.kodierung = f.zeitpunkt() + this.frage.id;
		},
		events: {
			'click a.mtAntwort':'antwort',
			'click a.wtSpeichern':'speichern',
		},

		antwort: function(evt) {
			fb3.setzeAntwort({
				'kodierung': this.fO.kodierung,
				'zeit': new Date(),
				'antw': evt.target.attributes['data-value'].value
			});
		},
		speichern: function(evt) {
			console.debug('w speichern', fb3.get('antworten'));
			fb3.speichereAntworten();
		},

		render: function() {
			// Template rendern
			this.template = _.template(this.frage.attributes.template)(this.fO);
			// HTML in DOM einhängen und mit page() jqm die Seite verbessert
			this.$el.html(this.template);
			this.$el.find( ":jqmData(role=listview)" ).listview(); // jqm verbessern
			this.$el.page();
			// verbessern: http://jquerymobile.com/demos/1.2.0/docs/pages/page-dynamic.html

			// in 'SOU' muss die Reihenfolge geändert werden 
			// (die folgende Frage 'MED' nicht aufgerufen, falls ein Arbeitsmittel gestört hat)
			// dann wird die übernächste Frage angezeigt.
			if (this.fO.kodierung == 'SOU') {
				var ele = this.$el.find('#SOU5');
				console.debug('SOU 5 ändern',ele,this.fO);
			}

			// Maintains chainability
			return this;
		}
	} );
	// Returns the View class
	return WView;
} );
