// View für die Einstellungen 
// ==========================

define(function( require ) {
	var $ = require('jquery');
	var _ = require('underscore');
	var Backbone = require('backbone');
	var Fb3Model = require('model');
	var settingsViewTemplate = require('text!../../templates/settingsView.html');
	var SbView = require('view/sb');

	var SettingsView = Backbone.View.extend( {
		el: '#settings',
		model: fb3,

		initialize: function() {
			this.template = _.template(settingsViewTemplate);
			this.sb = fb3.naechsterWerktag();
		},

		events: {
			// Hängt von den Elementen im Template ab
			'click #save0DataButton': 'saveAll',
			'click #cSbButton':				'cSbVisibility',
			'click #vpnButton':				'vpnVisibility',
			'click #vpnButtonBottom': 'vpnVisibility',

			'change #select-choice-quarter': 'cSQ',
			'change #select-choice-hour': 'cSH',
			'change #select-choice-year': 'cSY',
			'change #select-choice-month': 'cSM',
			'change #select-choice-day': 'cSD',

			'change #vvm': 'cPerson',
			'change #vnm': 'cPerson',
			'change #gm': 'cPerson',

		},

		render: function() {
			fb3.countDS();
			var compiledTemplate = this.template(fb3.settings);
			this.$el.html(compiledTemplate);
			// Werte vorbesetzen
			this.$el.find('#select-choice-day')
				.find('option[value="'+this.sb.getDate()+'"]').attr('selected','selected');
			this.$el.find('#select-choice-month')
				.find('option[value="'+this.sb.getMonth()+'"]').attr('selected','selected');
			this.$el.find('#select-choice-year')
				.find('option[value="'+this.sb.getFullYear()+'"]').attr('selected','selected');
			this.$el.find('#select-choice-hour')
				.find('option[value="'+this.sb.getHours()+'"]').attr('selected','selected');
			var q = Math.round(this.sb.getMinutes()/15);
			q = (q == 4) ? 0 : q*15 ; 
			this.$el.find('#select-choice-quarter')
				.find('option[value="'+q+'"]').attr('selected','selected');
			this.$el.find('select').selectmenu();
			this.$el.find('#settingsSaveAllDataErfolg').popup();
			this.$el.find('#settingsSaveAllDataFehler').popup();
			this.$el.page();
			return this;
		},

		saveAll: function() { if (navigator.onLine) fb3.saveAll(); },
		cSQ: function(evt) { this.sb.setMinutes(evt.target.value); this.cS();	},
		cSH: function(evt) { this.sb.setHours(evt.target.value); this.cS();	},
		cSY: function(evt) { this.sb.setFullYear(evt.target.value); this.cS();	},
		cSM: function(evt) { this.sb.setMonth(evt.target.value); this.cS();	},
		cSD: function(evt) { this.sb.setDate(evt.target.value); this.cS();	},
		cS: function() {
			fb3.set('schichtbeginn',this.sb);
			fb3.trigger('change:schichtbeginn',fb3,this.sb);
		},
		cSbVisibility: function() {
			var cS = $('#changeSchichtbeginn');
			if (cS)
				if (cS.css('display') == 'none')
					cS.css('display','block')
				else
					cS.css('display','none');
		},
		/*
		 * Ein- oder Ausblenden des Formulars
		 * und Eintragen der Werte für den Code der Versuchsperson
		 */
		vpnVisibility: function() {
			var cS = $('#vpnCode');
			if (cS) {
				if (cS.css('display') == 'none') {
					// vpnCode eintragen
					if (fb3.has('person')) {
						var vpnCode = fb3.get('person');
						var re = /(\D{2})(\D*)(\d).*/;
						var vpnCodeA = re.exec(vpnCode);
						if (vpnCodeA != null && typeof vpnCodeA === 'object') {
					    this.$el.find('#vvm').attr('value',vpnCodeA[1]);
							this.$el.find('#vnm').attr('value',vpnCodeA[2]);
							this.$el.find( '#gm').attr('value',vpnCodeA[3]);
						}
					}
					cS.css('display','block');
				} else
					cS.css('display','none');
			}
		},
		/*
		 * bei jeder Änderung im Formular wird auch der Datenbankeintrag geändert
		 */
		cPerson: function() {
			fb3.set('person',
				this.$el.find('#vvm').val() +
				this.$el.find('#vnm').val() +
				this.$el.find('#gm').val()); 
		}
	} );
	return SettingsView;
} );

