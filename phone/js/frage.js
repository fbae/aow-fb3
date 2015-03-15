// Frage als Object
// ===================
'use strict';

// Includes file dependencies
define(function(require) {
	var $ = require('jquery');																				// art
	var mtTemplate = require('text!../templates/mtView.html');				// 1 - beschriftete Buttons beliebiger Anzahl - zugeordnete Werte - eine pro Seite
	var s5Template = require('text!../templates/slider1-5.html');			// 5 - Slider von 1-5 - mehrere pro Seite
	var s7Template = require('text!../templates/slider1-7.html');			// 7 - Slider von 1-7 - mehrere pro Seite
	var s20Template = require('text!../templates/slider1-20.html');		// 20 - Slider von 1-20 - mehrere pro Seite
	var s100Template = require('text!../templates/slider1-100.html');	// 100 - Slider von 1-100 - mehrere pro Seite
	var s715Template = require('text!../templates/slider0-7_15.html');// 715 - Slider von 0-7 in 1/4 Schritten
	var b5Template = require('text!../templates/b5.html');						// 6 - Smiley-Buttons von 1-5 - mehrere pro Seite
	var b7Template = require('text!../templates/b7.html');						// 7 - Smiley-Buttons von 1-7 - mehrere pro Seite

	/* Klasse: Frage
	 * @param: obj:Objekt, dass die folgenden Parambeter enthält
	 *	obj.id				:	String[5]	- eindeutiger Bezeichner, Spaltenname in der Datenbank
	 *	obj.art				:	Integer		- wählt das zugehörige Template eindeutig aus
	 *	obj.txt				:	String		- die Fragestellung
	 *	obj.[lrm]Txt	:	String		- zusätzliche Anmerkungen neben der Antwort
	 *	obj.bes				: Array	of Arrays
	 *														- im Falle der Vorlage mt.html, die Beschriftung der Buttons mit den
	 *															zugeordneten Werten [Frage,Wert]
	 */
	function Frage(obj) {
		if (typeof obj !== 'object') return null;

		// Default-Werte vergeben
		// lTxt und rTxt müssen nicht vergeben werden (siehe Multitastking)
		this.id		= (obj.id !== undefined) ? obj.id : '00000';
		this.art	= (obj.art !== undefined) ? obj.art : 1; // Art der Frage - wirkt sich auf das Template aus
		this.txt	= (obj.txt !== undefined) ? obj.txt : 'Wie alt möchten Sie werden?';
		this.ant	= null;
		this.lTxt = (obj.lTxt) ? obj.lTxt : null;
		this.rTxt = (obj.rTxt) ? obj.rTxt : null;
		this.mTxt = (obj.mTxt) ? obj.mTxt : null;
		this.bes	= (obj.bes)  ? obj.bes : null;

		this.__defineGetter__('template',function() {
			if (!this.tpl) {
				switch (this.art) {
					case  1: this.tpl = mtTemplate; break;
					case  5: this.tpl = s5Template; break;
					case  6: this.tpl = b5Template; break;
					case  7: this.tpl = s7Template; break;
					case  8: this.tpl = b7Template; break;
					case 20: this.tpl = s20Template; break;
					case 100: this.tpl = s100Template; break;
					case 715: this.tpl = s715Template; ;break;
					default: this.tpl = s5Template;
				}
			}
			return this.tpl;
		});
		this.template;

//		this.__defineGetter__('antwort',function() { return this.ant; });
//		this.__defineSetter__('antwort',function(a) { this.ant = a; });
	 	// TODO: eventuell Antwort auf Bereich prüfen

	};

	Frage.prototype.toJSON = function() {
		var res = new Object();
		res.id = this.id;
		res.art = this.art;
		res.txt = this.txt;
		res.ant = this.ant;
		if (this.bes)  res.bes  = this.bes;
		if (this.lTxt) res.lTxt = this.lTxt;
		if (this.rTxt) res.rTxt = this.rTxt;
		if (this.mTxt) res.mTxt = this.mTxt;
		return JSON.stringify( res );
	}

	return Frage;
});
