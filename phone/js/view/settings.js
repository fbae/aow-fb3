// View für die Einstellungen 
// ==========================

define(function( require ) {
	var $ = require('jquery');
	var _ = require('underscore');
	var Backbone = require('backbone');
	var Fb3Model = require('model');
	var settingsViewTemplate = require('text!../../templates/settingsView.html');

	var SettingsView = Backbone.View.extend( {
		el: '#settings',
		model: fb3,

		initialize: function() {
			this.template = _.template(settingsViewTemplate);
		},

		events: {
			// Hängt von den Elementen im Template ab
			'click #save0DataButton': 'saveAll',
			'change #dev': 'cDevice',
			'change #vpn': 'cPerson',
		},

		render: function() {
			fb3.countDS();
			var compiledTemplate = this.template(fb3.settings);
			this.$el.html(compiledTemplate);
			this.$el.find('#settingsSaveAllDataErfolg').popup();
			this.$el.find('#settingsSaveAllDataFehler').popup();
			this.$el.page();
			return this;
		},

		saveAll: function() { if (navigator.onLine) fb3.saveAll(); },

		/*
		 * bei jeder Änderung im Formular wird auch der Datenbankeintrag geändert
		 */
		cDevice: function() { fb3.set('device', $('#dev').val()); },
		cPerson: function() { fb3.set('person', $('#vpn').val()); }
	} );
	return SettingsView;
} );

