// View, abgeleitet von mt - ausschließlich für die kurze Strecke während der Arbeit
// Besonderheit: das Speichern ist an die letzte Frage (SITMOOD) gebunden
// ================================================

define(function(require) {
	var $ = require('jquery');
	var _ = require('underscore');
	var Backbone = require('backbone');

	var WtView = Backbone.View.extend( {
		el: '#f',

		initialize: function() {
			this.$el
				.off('click','a.wtSpeichern')
				.off('click','a.mtAntwort')
				.off('pageshow');
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
			/* scheinbar wird beim erneuten rendern auch der alte event noch ausgeführt,
			 * deshalb wird er vor dem Speichern gelöscht -> zur nächsten Seite gegangen und
			 * später beim erneuten Aufruf neu gesetzt.
			 */
			this.$el
				.off('click','a.wtSpeichern')
				.off('click','a.mtAntwort');
			if (fb3.get('antworten'))	fb3.speichereAntworten();
		},

		render: function() {
			// Template rendern
			this.template = _.template(this.frage.attributes.template)(this.fO);
			// HTML in DOM einhängen und mit page() jqm die Seite verbessert
			this.$el.html(this.template);
			this.$el.find( ":jqmData(role=listview)" ).listview(); // jqm verbessern
			this.$el.page();

			// Maintains chainability
			return this;
		}
	} );
	// Returns the View class
	return WtView;
} );
