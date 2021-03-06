// View für mehrere Fragen mit vertikaler Auswahl
// ================================================

define( function( require ) {
	var $ = require('jquery');
	var _ = require('underscore');
	var Backbone = require('backbone');
	var fViewTemplate = require('text!../../templates/fView.html');

	var FView = Backbone.View.extend( {
		el: '#f',
		initialize: function() {
			var thisEl = this.$el;
			thisEl
				.off('pageshow')
				.on('pageshow',
						function(evt){
							// Formatierung der Sliderbeschriftung anpassen
							var slider = thisEl.find( 'div.ui-slider div' );
							if (slider && (slider.width() > 0)) {
								// bei erstmaligem Auftreten Position links und Breite neu berechnen und abspeichern
								if (!(fb3.has('erklLBML') && fb3.has('erklW'))) {
									var sliderHandle = thisEl.find( '.ui-slider-handle');
									var sliderLinks = sliderHandle.offset().left - sliderHandle.width()/2;
									var sliderBreite = thisEl.width() - sliderLinks - 2;
									fb3.set({'erklW':sliderBreite, 'erklLBML':sliderLinks});
								} else {
									var sliderLinks = fb3.get('erklLBML');
									var sliderBreite = fb3.get('erklW');
								}
								var erkl	 = thisEl.find( 'div.erkl' );
								if (erkl && !erkl.attr('style')) {
									// Erklärung ändern, wenn noch kein style-Attribut vorhanden ist, ansonsten gehe ich davon aus, dass schon angepasst wurde
									erkl.width(sliderBreite);
									var erklSpan = erkl.find('span');
									erklSpan.css('width', Math.max(20,(erkl.width()/erklSpan.length - 4)));
									erkl.find( '.linkeBeschriftung' ).css('margin-left',sliderLinks);
									//TODO: könnte auch zu viel Text sein, dann sollte der 3. Eintrag oder gar der 2. und 4. Eintrag entfernt werden
								}
							}
						});
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
//console.debug('f.js: f.ablauf[f.typ][f.akt]', f.ablauf[f.typ][f.akt]);
			fO.heading = (f.ablauf[f.typ][f.akt]['heading']) ? f.ablauf[f.typ][f.akt]['heading'] : null;
//console.debug('f.js: fO',fO);

			// Template rendern
			this.template = _.template(fViewTemplate)(fO);
			// HTML in DOM einhängen und nachbearbeiten
			this.$el.html(this.template).page();
			this.$el.find( ':jqmData(role=controlgroup)' ).controlgroup();

			// Besonderheiten einarbeiten
			for (var i=0; i<fArr.length; i++) {
				// falls ein Slider benutzt wird: ein onSlidestop setzen, damit die Daten sofort eingetragen werden
				var frage = f.get(fArr[i]).attributes;
				var kodierung = f.zeitpunkt() + frage.id;
				switch (frage.art) {
					case 2: // für flipswitch
						this.$el.find('#_' + kodierung) // im umgebenden div.ui-field-contain -> "schon mal ausgewählt" setzen
							.on( 'change', function( evt, ui ) {
								$(evt.target.parentNode)
									.addClass('flipswitch-selectedOnce');
							});
						// die Antwort setzen
						this.$el.find('#' + kodierung )
							.on( 'change', function( evt ) {
								fb3.setzeAntwort({
									'kodierung': evt.target.id,
									'zeit': new Date(evt.timeStamp),
									'antw': $( this ).flipswitch().val()
								});
							});
						break;
					case 5:
					case 6:
					case 7:
					case 8:
					case 20:
					case 100:
					case 715:
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

			// Maintains chainability
			return this;
		}
	} );
	// Returns the View class
	return FView;
} );

