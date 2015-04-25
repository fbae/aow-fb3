// View für Ende Abend-Durchlauf -> nächster Schichtbeginn 
// =======================================================

define( function( require ) {
	var $ = require('jquery');
	var _ = require('underscore');
	var Backbone = require('backbone');
	var seViewTemplate = require('text!../templates/seView.html');

	var SeView = Backbone.View.extend( {
		el: '#f',
		initialize: function() {
			this.template = seViewTemplate; // hat nur dynamische Ergänzungen
			this.se = new Date();
			this.se.setSeconds(0);
			this.se.setMinutes( Math.floor(this.se.getMinutes() / 15) * 15 );
			return this;
		},

		render: function() {
			this.$el.html(this.template).page();

			// Werte für Schichtende vorbesetzen
			var self = this;
			this.$el.find('#se-hour')
				.change(function(evt) { self.se.setHours(evt.target.value)})
				.find('option[value="'+self.se.getHours()+'"]').attr('selected','selected');
			this.$el.find('#se-quarter')
				.change(function(evt) { self.se.setMinutes(evt.target.value)})
				.find('option[value="'+self.se.getMinutes()+'"]').attr('selected','selected');

			this.$el.find('#seZeitEintragen').click(function(evt) {
				if (fb3.has('antworten')) {
					var data = fb3.get('antworten');
					data['schichtende'] = { 'zeit': new Date(event.timeStamp), 'antw': self.se.toMysqlFormat() }; 
					fb3.set( {'antworten': data} );
					fb3.trigger('change:antworten',fb3,data);
				};
			});

			this.$el.page().find('select').selectmenu();
				
			return this;
		}
	} );
	// Returns the View class
	return SeView;
} );

