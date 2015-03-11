// Fragen als Collection
// ===================

define(function( require ) {
	var $ = require('jquery');
	var Backbone = require('backbone');
	var Frage = require('frage');
	var MtView = require('view/mt');
	var FView = require('view/f');

//console.debug('fragen.js: MtView', MtView);
//TODO	var fehlerView = require('fehlerView');
//TODO	var SbView = require('sbView');
//TODO	var SeView = require('seView');
//TODO	var MsgView = require('msgView');

	var Fragen = Backbone.Collection.extend( {


		initialize: function( models, options ) {

			/* Definition einer Liste aller Fragen
			 *	@param	models:Array of Objects	- im Normalfall Array of Fragen, sollte [] sein
			 *	@param	options:Object	- Übergabe des Typs (damit die nächsten Fragen bestimmt werden können)
			 * Aufruf mit initialize([])
			 *
			 * ablauf ist ein Objekt dass den Ablaufplan für jeden Durchgang abspeichert,
			 * da auf einer Seite mehrere Fragen angezeigt werden können, ist es ein Array of Array
			 * ablauf.M -> morgens
			 * ablauf.W -> während der Arbeit
			 * ablauf.N -> nach der Arbeit
			 * ablauf.A -> abends
			 *
			 */

			// Voreinstellungen
			if (!this.typ) this.typ = 'O';
			this.akt = 0;
			this.zeit = new Date();

			// Fragen
			this.add(new Frage({
				id:'PSQI4',
				art:1,
				txt:'Wie viele Stunden haben Sie tatsächlich geschlafen?<br/>(Dies kann von der Zeit, die Sie im Bett verbracht haben abweichen.)',
				bes:[
					['> 7 Stunden',4],
					['6-7 Stunden',3],
					['5-6 Stunden',2],
					['< 5 Stunden',1]
				]
			}));
			this.add(new Frage({
				id:'PSQI7',
				art:1,
				txt:'Wie würden Sie Ihren Schlaf in der letzten Nacht bewerten?',
				bes:[
					['sehr schlecht',1],
					['eher schlecht',2],
					['eher gut',3],
					['gut',4]
				]
			}));

			this.add(new Frage({ id:'NA1',	art:5, txt:'Bekümmert' }));
			this.add(new Frage({ id:'SE1',	art:5, txt:'Entspannt' }));
			this.add(new Frage({ id:'PAVI1',art:5, txt:'Aktiv' }));
			this.add(new Frage({ id:'NA2',	art:5, txt:'Verärgert' }));
			
			this.add(new Frage({ id:'SUPPO', art:5, txt:'Verärgert', lTxt:'Sehr wenig', rTxt:'Sehr stark' }));
			this.add(new Frage({ 
				id:'SITCON1', 
				art:5, 
				txt:'Ich musste heute mit Unterlagen und Informationen arbeiten, die unvollständig und veraltet waren.', 
				lTxt:'trifft gar nicht zu', 
				rTxt:'trifft völlig zu' 
			}));

			this.add(new Frage({
				id:'CONT',
				art:1,
				txt:'Wenn Sie Ihre Tätigkeit heute betrachten, inwieweit konnten Sie die Reihenfolge der Arbeitsschritte selbst festlegen?',
				bes:[
					['sehr wenig',1],
					['ziemlich wenig',2],
					['etwas',3],
					['ziemlich viel',4],
					['sehr viel',5]
				]
			}));

/*
			this.add(new Frage({
				id:'',
				art:,
				txt:'',
		}));
 */
/*
*/

			this.ablauf = {
				morgens:[
				{v:MtView, f:['PSQI7']},
				{v:MtView, f:['PSQI4']}
				],
				STI:[
				{v:FView,  f:['NA1','SE1','PAVI1','NA2'], heading:'Wie fühlen Sie sich gerade?<br/><div class="erkl"><span>gar nicht</span> <span>schwach</span> <span>etwas</span> <span>ziemlich</span> <span>Sehr stark</span></div>'},

				]
			};

			Object.defineProperty(this.ablauf, 'O', { // keine Ablauf
				__proto__: null,
				enumerable: true,
				writeable: false,
				get: function(){ return [] },
			});
			Object.defineProperty(this.ablauf, 'A', { // abends
				__proto__: null,
				enumerable: true,
				writeable: false,
				get: function(){ return [] /*this.STI.concat(this.MF,this.A1)*/ },
			});
			Object.defineProperty(this.ablauf, 'M', { // morgens
				__proto__: null,
				enumerable: true,
				writeable: false,
				get: function(){ return this.STI.concat(this.morgens); },
			});
			Object.defineProperty(this.ablauf, 'N', { // nach der Arbeit
				__proto__: null,
				enumerable: true,
				writeable: false,
				get: function(){ return [] },
			});
		}, // Ende initialize

		// Sets the Collection model property to be a Fragebogen2 Model
		//model: ,

		// Overriding the Backbone.sync method (the Backbone.fetch method calls the sync method when trying to fetch data)
/*
 * sync: function( method, model, options ) {

			/* TODO: das muss noch überarbeitet werden */
/*

			// Local Variables
			// ===============

			// Instantiates an empty array
			var categories = [],

			// Local Variables
			// ===============

			// Instantiates an empty array
			var categories = [],

			// Stores the this context in the self variable
			self = this,

			// Creates a jQuery Deferred Object
			deferred = $.Deferred();

			// Uses a setTimeout to mimic a real world application that retrieves data asynchronously
			setTimeout( function() {

				// Filters the above sample JSON data to return an array of only the correct category type
				categories = _.filter( self.jsonArray, function( row ) {

				return row.category === self.type;

			} );

			// Calls the options.success method and passes an array of objects (Internally saves these objects as models to the current collection)
			options.success( categories );

			// Triggers the custom `added` method (which the Category View listens for)
			self.trigger( "added" );

			// Resolves the deferred object (this triggers the changePage method inside of the Category Router)
			deferred.resolve();

			}, 1000);

			// Returns the deferred object
			return deferred;

		},
*/
		vorher: function() {
		 	return (this.akt == 0) ? null : this.akt - 1;
		},
		nachher: function() {
			if (!this.ablauf || (this.typ === 'O')) return undefined;
			var n = this.akt + 1;
			return (n < this.ablauf[this.typ].length) ? n : null;
		},
		// Anzahl der Fagen im aktuellen Ablauf
		anzahl: function() {
			if (this.ablauf && this.typ && (this.typ !== 'O'))
				return this.ablauf[this.typ].length;

			return -1;
		},
		zeitpunkt: function() {
			switch (this.typ) {
				case 'M': return 'M_'; break;
				case 'W': return 'W_'; break;
				case 'N': return 'N_'; break;
				case 'A': return 'A_'; break;
				default: return '0';
			}
			return undefined;
		},

		setzeAntwort: function(antwortO) {
			if (antwortO.kodierung && antwortO.antw) {
				var kod = antwortO.kodierung.substr(2,antwortO.kodierung.length-2);
				this.get(kod).attributes.ant = antwortO.antw;
			}
		},
		view: function() {
			if ((this.typ != 'O') && (this.akt <= this.anzahl()))	{
				return this.ablauf[this.typ][this.akt].v;
			}

			// Fehler behandeln
			console.warn( 'Fehler: Fragen.view konnte nicht ermittelt werden', this.typ, this.akt, this.anzahl());
			fb3.log({ msg:'Fehler: Es wurde eine View abgerufen, die nicht ausgeliefert werden konnte'});
			return fehlerView;
		},
		entferneAntworten: function() {
			this.each(function(frage) {
				frage.set( {'ant': null });
			});
		}
	}); // Ende Backbone.model.extend

	return Fragen;
}); // Ende define
