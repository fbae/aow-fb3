// Fb3 Router
// =============

// Includes file dependencies
define( function( require) {
	var $ = require('jquery');
	var Backbone = require('backbone');
	var	Model = require('model');
	var Fragen = require('fragen');
	var SettingsView = require('view/settings');

	// Extends Backbone.Router
	var Fb3Router = Backbone.Router.extend( {
		initialize: function() {
			this.fragen = new Fragen();
			Backbone.history.start();
		},

		routes: {
			// When there is no hash bang on the url, the home method is called
			'home': 'home',
//			'nichts': function(){},
			'S': 'speichern',
			'settings': 'settings',

			'M': 'ablaufM',
			'W':  function() {
				$(':mobile-pagecontainer').pagecontainer('change', '#W', {reverse: false, changeHash: true});
			},
			'W1': function() {
				$(':mobile-pagecontainer').pagecontainer('change', '#W1', {reverse: false, changeHash: true});
			},
			'W2': function() {
				$(':mobile-pagecontainer').pagecontainer('change', '#W2', {reverse: false, changeHash: true});
			},
			'Q': 'ablaufQ',
			'A': 'ablaufA',
			'E': 'ablaufE',

			'awz': function() {fb3.antwortenWZusammenfassen();},
			// When #f? is on the url, the  method is called
			'f?:nr': 'frage'
		},

		home: function() {
			$.mobile.changePage( '#home' , { reverse: false, changeHash: false } );
		},

		speichern: function() {
			var antw = fb3.get('antworten');
			fb3.log({
				msg:'speichern nach Durchlauf ' + this.fragen.art,
				data: antw
			});
			fb3.speichereAntworten(); // solange change:antworten nicht richtig funktioniert - mit callback?

			this.fragen.typ = 'O';
			this.home();
			var danke = $('#danke').popup('open');
			setTimeout(function(){danke.popup('close');},3500);
		},

		settings: function() {
			if (!this.settingsView) this.settingsView = new SettingsView();
			this.settingsView.render();
			this.settingsView.$el.trigger('create');
			$.mobile.changePage( '#settings', { reverse: false, changeHash: true } );
		},

		ablaufX: function(typC) {
	 		fb3.log({msg:'ablaufX Typ:' + typC});
			this.fragen.typ = typC;
			this.fragen.akt = 0;
			this.fragen.zeit = new Date();
			fb3.neueAntworten();
			var frageView = this.fragen.view();
			var view = new frageView( {collection: this.fragen} );
			view.render();
			view.$el.trigger('create');
			$.mobile.changePage('#f?0', {reverse: false, changeHash: true} );
		},
		ablaufM: function() {	this.ablaufX('M'); },
		ablaufA: function() { this.ablaufX('A'); },
		ablaufE: function() { this.ablaufX('E'); },
		ablaufQ: function() { this.ablaufX('Q'); },

		frage: function(nr) {
			if (this.fragen.typ == 'O') {
				console.warn( 'Fehler: es wurde kein Ablauf ausgewählt.' );
				return undefined;
			}
			nr = parseInt(nr);
			if ((nr !== 'NaN') && (0 <= nr) && (nr < this.fragen.anzahl())) {
				this.fragen.akt = nr;
			} else {
				if (this.fragen.akt + 1 < this.fragen.anzahl()) this.fragen.akt++;
				console.info( 'Fehler: der übergebene Parameter Nummer: ' + nr +
						' passt nicht. Es wird versucht die nächste Frage zu wählen');
			}
//			console.info( 'frage fragen:',this.fragen);
			var frageView = this.fragen.view();
			var view = new frageView( {collection: this.fragen} );
			view.render();
			view.$el.trigger('create');
			$.mobile.changePage('#f?' + this.fragen.akt, {reverse: false, changeHash: true,
				allowSamePageTransition: true, reloadPage:false} );


/*
			// Stores the current fb3 View inside of the currentView variable
			var currentView = this[ type + 'View' ];
			// If there are no collections in the current fb3 View
			if(!currentView.collection.length) {
				// Show's the jQuery fb3 loading icon
				$.mobile.loading( 'show' );
				// Fetches the Collection of fb3 Models for the current fb3 View
				currentView.collection.fetch().done( function() {
					// Programatically changes to the current categories page
					$.mobile.changePage( '#' + type, { reverse: false, changeHash: false } );
				} );
			}
			// If there already collections in the current fb3 View
			else {
				// Programatically changes to the current categories page
				$.mobile.changePage( '#' + type, { reverse: false, changeHash: false } );
			}
*/
		}
	} );
	// Returns the Router class
	return Fb3Router;
} );
