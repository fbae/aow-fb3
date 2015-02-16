// Frage als Object
// ===================
'use strict';

// Includes file dependencies
define(function(require) {
	var $ = require('jquery');																				// art
	var mtTemplate = require('text!../templates/mt.html');						// 1 - beschriftete Buttons beliebiger Anzahl - zugeordnete Werte
/*
 * var frage4Template = require('text!../templates/frage4.html');
	var frage5Template = require('text!../templates/frage5.html');
	var frage7Template = require('text!../templates/frage7.html');
	var s11Template = require('text!../templates/slider0-10_15.html');
	var s20Template = require('text!../templates/slider1-20.html');
	var s24Template = require('text!../templates/slider0-24_15.html');
	var s49Template = require('text!../templates/slider0-12_15.html');
//TODO	var mt5bTemplate = require('text!../templates/mt5B.html');
*/

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
//TODO					case  3: this.tpl = mt5bTemplate; break;
					case  4: this.tpl = frage4Template; break;
					case  7: this.tpl = frage7Template; break;
					case 11: this.tpl = s11Template; break;
					case 20: this.tpl = s20Template; break;
					case 24: this.tpl = s24Template; break;
					case 49: this.tpl = s49Template; ;break;
					default: this.tpl = frage5Template;  
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
