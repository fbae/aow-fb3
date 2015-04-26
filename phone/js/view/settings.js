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

