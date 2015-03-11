// View für mehrere Fragen mit horizontaler Auswahl
// ================================================

define( function( require ) {
	var $ = require('jquery');
	var _ = require('underscore');
	var Backbone = require('backbone');
	var fViewTemplate = require('text!../../templates/fView.html');

	var FView = Backbone.View.extend( {
		el: '#f',
		initialize: function() {
		},

		render: function() {
			var f = this.collection; // Fragen
			// aktuelle Frage ermitteln
			var fArr = f.ablauf[f.typ][f.akt]['f'];

			// für alle Teilfragen die Templates zusammenstellen
			var teilFragenHTMLArr = new Array();
			for (var i=0; i<fArr.length; i++) {
				var frage = f.get(fArr[i]).attributes;
				var tfa = JSON.parse(frage.toJSON());
				tfa.kodierung = f.zeitpunkt() + frage.id;
				if (!tfa.hasOwnProperty('lTxt')) tfa.lTxt = null;
				if (!tfa.hasOwnProperty('rTxt')) tfa.rTxt = null;
				if (!tfa.hasOwnProperty('mTxt')) tfa.mTxt = null;
				teilFragenHTMLArr.push(_.template(frage.template)(tfa));
			}

			// TODO: eventuell noch gleichartige Fragen löschen (siehe Stimmung)

			var fO = {'fragenTemplates': teilFragenHTMLArr};
			// vorherige und nachfolgende Frage für Verlinkung bestimmen
			fO.next = f.nachher();
			fO.prev = f.vorher();
console.debug('f.js: f.ablauf[f.typ][f.akt]', f.ablauf[f.typ][f.akt]);
			fO.heading = (f.ablauf[f.typ][f.akt]['heading']) ? f.ablauf[f.typ][f.akt]['heading'] : null;
console.debug('f.js: fO',fO);

			// Template rendern
			this.template = _.template(fViewTemplate)(fO);
			// HTML in DOM einhängen
			this.$el.html(this.template).page();

			for (var i=0; i<fArr.length; i++) {
				// falls ein Slider benutzt wird: ein onSlidestop setzen, damit die Daten sofort eingetragen werden
				var frage = f.get(fArr[i]).attributes;
				switch (frage.art) {
					case 5:
//					case 20:
//					case 24:
//					case 49:
						var kodierung = f.zeitpunkt() + frage.id;
						this.$el.find( '#' + kodierung ).on( 'slidestop', function( event ) {
							fb3.setzeAntwort({
								'kodierung': event.target.id,
								'zeit': new Date(event.timeStamp),
								'antw': $( this ).slider().val()
							});
						})
						.on('focusout', function( event ) {
							fb3.setzeAntwort({
								'kodierung': event.target.id,
								'zeit': new Date(event.timeStamp),
								'antw': $( this ).slider().val()
							});
						});
						break;
					default: // nichts zu tun
				}
			}
			this.$el.find( ':jqmData(role=controlgroup)' ).controlgroup();
			this.$el.page();

			var self = this;
			setTimeout(function(){
				// Erklärung für die Slider - CSS überarbeiten
				var slider = self.$el.find( 'div.ui-slider div' );
				var erkl	 = self.$el.find( 'div.erkl' );
				if (slider && erkl) {
					var w = slider.width() + 36;
					var erklAnz = erkl.find('span').length;
					erkl.width(w);
					erkl.find( 'span' ).css('width', (w - erklAnz*4)/erklAnz);
					//TODO: könnte auch zu viel Text sein, dann sollte der 3. Eintrag oder gar der 2. und 4. Eintrag entfernt werden
				}
			},500);


			// Maintains chainability
			return this;
		}
	} );
	// Returns the View class
	return FView;
} );

