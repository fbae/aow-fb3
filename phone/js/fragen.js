// Fragen als Collection
// ===================

define(function( require ) {
	var $ = require('jquery');
	var Backbone = require('backbone');
	var Frage = require('frage');
	var MtView = require('view/mt');
	var FView = require('view/f');
	var MsgView = require('view/msg');

//console.debug('fragen.js: MtView', MtView);
//TODO	var fehlerView = require('fehlerView');
//TODO	var SbView = require('sbView');
//TODO	var SeView = require('seView');

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

			//Heading: 'Wie fühlen Sie sich gerade?'
			this.add(new Frage({id:'NA1', art:5, txt:'Bekümmert'}));
			this.add(new Frage({id:'SE1', art:5, txt:'Entspannt'}));
			this.add(new Frage({id:'PAVI1', art:5, txt:'Aktiv'}));
			this.add(new Frage({id:'NA2', art:5, txt:'Verärgert'}));
			this.add(new Frage({id:'SE2', art:5, txt:'Gelassen'}));
			this.add(new Frage({id:'PA2', art:5, txt:'Interessiert'}));
			this.add(new Frage({id:'TI1', art:5, txt:'Erschöpft'}));
			this.add(new Frage({id:'VI2', art:5, txt:'Energiegeladen'}));
			this.add(new Frage({id:'NA3', art:5, txt:'Gereizt'}));
			this.add(new Frage({id:'SE3', art:5, txt:'Ruhig'}));
			this.add(new Frage({id:'PA2', art:5, txt:'Freudig erregt'}));
			this.add(new Frage({id:'TI2', art:5, txt:'Ermattet'}));
			this.add(new Frage({id:'NA5', art:5, txt:'Durcheinander'}));
			this.add(new Frage({id:'VI3', art:5, txt:'Munter'}));
			this.add(new Frage({id:'NA4', art:5, txt:'Nervös'}));
			this.add(new Frage({id:'PA4', art:5, txt:'Stark'}));
			this.add(new Frage({id:'VI4', art:5, txt:'Tatkräftig'}));
			this.add(new Frage({id:'PA5', art:5, txt:'Angeregt'}));
			this.add(new Frage({id:'NA6', art:5, txt:'Ängstlich'}));
			this.add(new Frage({id:'PA6', art:5, txt:'Wach'}));
			this.add(new Frage({id:'TI3', art:5, txt:'Entkräftet'}));
			
			this.add(new Frage({id:'PSQI4', art:1, 
				txt: 'Wie viele Stunden haben Sie tatsächlich geschlafen?<br/>(Dies kann von der Zeit, die Sie im Bett verbracht haben, abweichen.)',
				bes: [ 
						['> 7 Stunden',4],
						['6-7 Stunden',3],
						['5-6 Stunden',2],
						['< 5 Stunden',1]
				]
			}));
			this.add(new Frage({ id: 'PSQI7', art:1, 
				txt: 'Wie würden Sie Ihren Schlaf in der letzten Nacht bewerten?',
				bes: [ 
						['sehr schlecht',1],
						['eher schlecht',2],
						['eher gut',3],
						['gut',4]
				]
			}));
			this.add(new Frage({ id: 'PSQI2', art:1, 
				txt: 'Wie viele Minuten hat es in etwa gedauert, bis Sie eingeschlafen sind?',
				bes: [ 
						['<= 15 Minuten',4],
						['16-30 Minuten',3],
						['31-60 Minuten',2],
						['> 60 Minuten',1]
				]
			}));
			this.add(new Frage({ id: 'PSQI11', art:1, txt: 'Sind Sie in der Nacht aufgewacht?',
				bes: [ 
						['nein',5],
						['ja, ein Mal',4],
						['ja, zwei Mal',3],
						['ja, drei Mal',2],
						['ja, mehr als drei Mal',1]
				]
			}));
			this.add(new Frage({ id: 'ISI', art:1, txt: 'Bitte bewerten Sie den Schweregrad Ihrer Schlafprobleme während dieser Nacht (Einschlagschwierigkeiten, Durschschlafschwierigkeiten, Probleme wegen zu frühem Aufwachen).',
				bes: [ 
						['keine',1],
						['leicht',2],
						['mittelmäßig',3],
						['schwer',4],
						['sehr schwer',5]
				]
			}));

			this.add(new Frage({id:'STRATREC1', art:5, txt:'Ich fühle mich ausgeschlafen.', lTxt:'trifft gar nicht zu', rTxt:'trifft völlig zu'}));
			this.add(new Frage({id:'STRATREC2', art:5, txt:'Ich fühle mich körperlich erholt.', lTxt:'trifft gar nicht zu', rTxt:'trifft völlig zu'}));
			this.add(new Frage({id:'STRATREC3', art:5, txt:'Ich fühle mich geistig erholt.', lTxt:'trifft gar nicht zu', rTxt:'trifft völlig zu'}));
			this.add(new Frage({id:'STRATREC4', art:5, txt:'Ich bin voll neuer Energie.', lTxt:'trifft gar nicht zu', rTxt:'trifft völlig zu'}));

			this.add(new Frage({id:'COMPI', art:5, txt:'Die Unterbrechungsaufgabe war sehr anspruchsvoll.', lTxt:'trifft gar nicht zu', rTxt:'trifft völlig zu'}));
			this.add(new Frage({id:'COMPP', art:5, txt:'In was für einer Aufgabe wurden Sie unterbrochen?<br/>Bitte wählen Sie aus:', lTxt:'Leichte Aufgabe', rTxt:'Schwierige Aufgabe'}));
			this.add(new Frage({id:'SOU', art:1, txt:'Wer oder was hat Sie unterbrochen?.',
				bes: [ 
						['Kunde',1],
						['Kollege',2],
						['ChefIn',3],
						['Mitarbeiter',4],
						['Arbeitsmittel',5],
						['andere',6]
				]
			}));this.add(new Frage({id:'MED', art:1, txt:'Wodurch wurden Sie unterbrochen?.',
				bes: [ 
						['Telefon',1],
						['Mail',2],
						['persönlicher Kontakt',3],
						['Messenger',4],
						['andere',5]
				]
			}));

			this.add(new Frage({id:'SITMOOD', art:6, txt:'Wie fühlen Sie sich gerade?'}));

			//Nach Arbeitsende

			this.add(new Frage({id:'TLX1', art:20, txt:'Wie hoch waren heute die geistigen Anforderungen?', lTxt:'sehr niedrig', rTxt:'sehr hoch'}));
			this.add(new Frage({id:'TLX2', art:20, txt:'Wie hoch waren heute die körperlichen Anforderungen?', lTxt:'sehr gering', rTxt:'sehr hoch'}));
			this.add(new Frage({id:'TLX3', art:20, txt:'Wie hoch waren heute die geistigen Anforderungen?', lTxt:'sehr niedrig', rTxt:'sehr hoch'}));
			this.add(new Frage({id:'TLX4', art:20, txt:'Wie hoch war das Tempo, mit dem Sie die einzelnen Aufgaben bewältigen mussten?', lTxt:'sehr niedrig', rTxt:'sehr hoch'}));
			this.add(new Frage({id:'TLX5', art:20, txt:'Wie erfolgreich haben Sie Ihre Aufgaben heute Ihrer Meinung nach durchgeführt?', lTxt:'perfekter Erfolg', rTxt:'Misserfolg'}));
			this.add(new Frage({id:'TLX6', art:20, txt:'Wie sehr mussten Sie sich anstrengen, um Ihre Leistung zu erreichen?', lTxt:'sehr wenig', rTxt:'sehr stark'}));
			this.add(new Frage({id:'TLX7', art:20, txt:'Wie verunsichert, entmutigt, gereizt und verärgert waren Sie am heutigen Arbeitstag?', lTxt:'sehr wenig', rTxt:'sehr stark'}));
			this.add(new Frage({id:'TLX8', art:20, txt:'Wie gestresst fühlten Sie sich heute?', lTxt:'sehr wenig', rTxt:'sehr stark'}));

			Heading: 'Inwiefern stimmen Sie den folgenden Aussagen zu?'
			this.add(new Frage({id:'TPRESS1', art:5, txt:'Ich stand heute unter Zeitdruck.', lTxt:'trifft gar nicht zu', rTxt:'trifft völlig zu'}));
			this.add(new Frage({id:'TPRESS2', art:5, txt:'Ich musste heute schneller arbeiten, als ich es normalerweise tue, um meine Arbeit zu schaffen.', lTxt:'trifft gar nicht zu', rTxt:'trifft völlig zu'}));
			this.add(new Frage({id:'TPRESS3', art:5, txt:'Bei meiner Arbeit wurde heute ein hohes Arbeitstempo verlangt.', lTxt:'trifft gar nicht zu', rTxt:'trifft völlig zu'}));

			this.add(new Frage({id:'SITCON1', art:5, txt:'Ich musste heute mit Unterlagen und Informationen arbeiten, die unvollständig und veraltet waren.', lTxt:'trifft gar nicht zu', rTxt:'trifft völlig zu'}));
			this.add(new Frage({id:'SITCON2', art:5, txt:'Ich musste heute viel Zeit damit vertun, mir Informationen, Material oder Werkzeug zu beschaffen.', lTxt:'trifft gar nicht zu', rTxt:'trifft völlig zu'}));
			this.add(new Frage({id:'SITCON3', art:5, txt:'Ich musste heute mit Material, Arbeitsmitteln oder Werkzeug arbeiten, die nicht viel taugten.', lTxt:'trifft gar nicht zu', rTxt:'trifft völlig zu'}));

			this.add(new Frage({ id: 'CONT1', art:1, txt: 'Wenn Sie Ihre Tätigkeit heute betrachten, inwieweit konnten Sie die Reihenfolge der Arbeitsschritte selbst festlegen?',
				bes: [ 
						['sehr wenig',1],
						['ziemlich wenig',2],
						['etwas',3],
						['ziemlich viel',4],
						['sehr viel',5]
				]
			}));
			this.add(new Frage({ id: 'CONT2', art:1, txt: 'Wie viel Einfluss hatten Sie heute darauf, welche Aufgaben Sie heute bearbeitet haben?',
				bes: [ 
						['sehr wenig',1],
						['ziemlich wenig',2],
						['etwas',3],
						['ziemlich viel',4],
						['sehr viel',5]
				]
			}));
			this.add(new Frage({ id: 'CONT3', art:1, txt: 'Wenn man Ihre Arbeit heute betrachtet, wie viel Möglichkeiten zu eigenen Entscheidungen bot Ihnen Ihre Arbeit?',
				bes: [ 
						['sehr wenig',1],
						['ziemlich wenig',2],
						['etwas',3],
						['ziemlich viel',4],
						['sehr viel',5]
				]
			}));

			this.add(new Frage({id:'SUPPO1', art:5, txt:'Haben Sie Ihre Kollegen heute als Unterstüzung erlebt?', lTxt:'sehr wenig', rTxt:'sehr stark'}));
			this.add(new Frage({id:'SUPPO2', art:5, txt:'Haben Sie Ihre Führungskraft heute als Unterstüzung erlebt?', lTxt:'sehr wenig', rTxt:'sehr stark'}));

			this.add(new Frage({id:'FULLFI', art:100, txt:'Bitte geben Sie an, zu wie viel Prozent Sie alles geschafft haben, was Sie sich für heute vorgenommen haben.'}));

			this.add(new Frage({id:'QUAL', art:5, txt:'Heute konnte ich meinen persönlichen Anspruch an die Arbeit zufrieden stellen.', lTxt:'trifft gar nicht zu', rTxt:'trifft völlig zu'}));

			this.add(new Frage({id:'WEDE1', art:5, txt:'Ich war von meiner Arbeit begeistert.', lTxt:'trifft gar nicht zu', rTxt:'trifft völlig zu'}));
			this.add(new Frage({id:'WEDE2', art:5, txt:'Heute hat mich meine Arbeit inspiriert.', lTxt:'trifft gar nicht zu', rTxt:'trifft völlig zu'}));
			this.add(new Frage({id:'WEVI3', art:5, txt:'Als ich heute Morgen aufgestanden bin, habe ich mich auf meine Arbeit gefreut.', lTxt:'trifft gar nicht zu', rTxt:'trifft völlig zu'}));
			this.add(new Frage({id:'WEAB1', art:5, txt:'Heute habe ich mich glücklich gefühlt, wenn ich intensiv gearbeitet habe.', lTxt:'trifft gar nicht zu', rTxt:'trifft völlig zu'}));
			this.add(new Frage({id:'WEDE3', art:5, txt:'Ich war heute stolz auf meine Arbeit.', lTxt:'trifft gar nicht zu', rTxt:'trifft völlig zu'}));
			this.add(new Frage({id:'WEAB2', art:5, txt:'Ich bin heute völlig in meiner Arbeit aufgegangen.', lTxt:'trifft gar nicht zu', rTxt:'trifft völlig zu'}));
			this.add(new Frage({id:'WEAB3', art:5, txt:'Heute hat meine Arbeit mich mitgerissen.', lTxt:'trifft gar nicht zu', rTxt:'trifft völlig zu'}));
			this.add(new Frage({id:'WEVI1', art:5, txt:'Ich war heute voll überschäumender Energie.', lTxt:'trifft gar nicht zu', rTxt:'trifft völlig zu'}));
			this.add(new Frage({id:'WEVI2', art:5, txt:'Ich fühlte mich heute fit und tatkräftig.', lTxt:'trifft gar nicht zu', rTxt:'trifft völlig zu'}));

			this.add(new Frage({id:'WD1', art:5, txt:'Heute habe ich jede Gelegenheit genutzt mich vor der Arbeit zu drücken.', lTxt:'trifft gar nicht zu', rTxt:'trifft völlig zu'}));
			this.add(new Frage({id:'WD2', art:5, txt:'Heute habe ich darüber nachgedacht alles hinzuschmeißen.', lTxt:'trifft gar nicht zu', rTxt:'trifft völlig zu'}));
			this.add(new Frage({id:'WD3', art:5, txt:'Heute habe ich mich weniger angestrengt, als von mir erwartet wurde.', lTxt:'trifft gar nicht zu', rTxt:'trifft völlig zu'}));
			this.add(new Frage({id:'WD4', art:5, txt:'Heute habe ich insgesamt mehr Zeit mit Pausen verbraucht, als mir zusteht.', lTxt:'trifft gar nicht zu', rTxt:'trifft völlig zu'}));
			this.add(new Frage({id:'WD5', art:5, txt:'Heute habe ich bei der Arbeit viel Zeit mit Tagträumen verbracht.', lTxt:'trifft gar nicht zu', rTxt:'trifft völlig zu'}));

			this.add(new Frage({id:'WORR_W1', art:5, txt:'Ich habe mir Sorgen gemacht, dass ich meine Arbeit nicht gut genug gemacht habe.', lTxt:'trifft gar nicht zu', rTxt:'trifft völlig zu'}));
			this.add(new Frage({id:'WORR_W2', art:5, txt:'Ich habe mir Gedanken gemacht, nicht alles zu schaffen, was ich mir vorgenommen hatte.', lTxt:'trifft gar nicht zu', rTxt:'trifft völlig zu'}));


			this.add(new Frage({id:'JOBSAT', art:8, txt:'Wie zufrieden sind sie <b>heute</b> mit Ihrem Job?', lTxt:'außerordentlich unzufrieden', rTxt:'außerordentlich zufrieden'}));

			//Abends

			this.add(new Frage({id:'OVERTI', art:715, txt:'Wie lange haben Sie heute nach der Beantwortung des letzten Fragebogens noch gearbeitet?'}))
			this.add(new Frage({id:'FORGET', art:5, txt:'Ich habe heute vergessen, bereits angefangende oder geplante Aufgaben zu erledigen.', lTxt:'trifft gar nicht zu', rTxt:'trifft völlig zu'}));
			this.add(new Frage({id:'ERR', art:5, txt:'Heute habe ich Fehler während meiner Arbeitszeit gemacht.', lTxt:'trifft gar nicht zu', rTxt:'trifft völlig zu'}));

			this.add(new Frage({id:'WORR_E1', art:5, txt:'Ich habe mir heute noch nach Feierabend Sorgen gemacht, dass ich meine Arbeit nicht gut genug gemacht habe.', lTxt:'trifft gar nicht zu', rTxt:'trifft völlig zu'}));
			this.add(new Frage({id:'WORR_E2', art:5, txt:'Ich habe mir heute noch nach Feierabend Sorgen gemacht, dass ich nicht alles geschafft habe, was ich mir vorgenommen hatte.', lTxt:'trifft gar nicht zu', rTxt:'trifft völlig zu'}));

			this.add(new Frage({id:'IRR_K1', art:7, txt:'Es fiel mir heute schwer, nach der Arbeit abzuschalten.', lTxt:'trifft überhaupt nicht zu', rTxt:'trifft fast völlig zu'}));
			this.add(new Frage({id:'IRR_K2', art:7, txt:'Ich musste auch zu Hause an Schwierigkeiten bei der Arbeit denken.', lTxt:'trifft überhaupt nicht zu', rTxt:'trifft fast völlig zu'}));
			this.add(new Frage({id:'IRR_E1', art:7, txt:'Wenn andere mich ansprachen, kam es vor, dass ich mürrisch reagierte.', lTxt:'trifft überhaupt nicht zu', rTxt:'trifft fast völlig zu'}));
			this.add(new Frage({id:'IRR_K3', art:7, txt:'Selbst im Urlaub müsste ich jetzt manchmal an Probleme bei der Arbeit denken.', lTxt:'trifft überhaupt nicht zu', rTxt:'trifft fast völlig zu'}));
			this.add(new Frage({id:'IRR_E2', art:7, txt:'Ich fühlte mich heute ab und zu wie jemand, den man als Nervenbündel bezeichnet.', lTxt:'trifft überhaupt nicht zu', rTxt:'trifft fast völlig zu'}));
			this.add(new Frage({id:'IRR_E3', art:7, txt:'Ich war schnell verärgert.', lTxt:'trifft überhaupt nicht zu', rTxt:'trifft fast völlig zu'}));
			this.add(new Frage({id:'IRR_E4', art:7, txt:'Ich reagierte heute gereizt, obwohl ich es gar nicht wollte.', lTxt:'trifft überhaupt nicht zu', rTxt:'trifft fast völlig zu'}));
			this.add(new Frage({id:'IRR_E5', art:7, txt:'Als ich müde von der Arbeit nach Hause kam, fand ich durch nichts Erholung.', lTxt:'trifft überhaupt nicht zu', rTxt:'trifft fast völlig zu'}));

			this.add(new Frage({id:'REC_E1', art:5, txt:'Nach der Arbeit habe ich abgeschalten und mich entspannt.', lTxt:'trifft gar nicht zu', rTxt:'trifft völlig zu'}));
			this.add(new Frage({id:'REC_E2', art:5, txt:'Nach der Arbeit habe ich aentspannende Dinge getan.', lTxt:'trifft gar nicht zu', rTxt:'trifft völlig zu'}));
			this.add(new Frage({id:'REC_E3', art:5, txt:'Nach der Arbeit nutzte ich die Zeit zur Entspannung.', lTxt:'trifft gar nicht zu', rTxt:'trifft völlig zu'}));
			this.add(new Frage({id:'REC_E4', art:5, txt:'Nach der Arbeit gönnte ich mir Freizeit/nutze ich die Zeit für Erholung.', lTxt:'trifft gar nicht zu', rTxt:'trifft völlig zu'}));
			this.add(new Frage({id:'REC_M1', art:5, txt:'Nach der Arbeit lernte ich neue Dinge.', lTxt:'trifft gar nicht zu', rTxt:'trifft völlig zu'}));
			this.add(new Frage({id:'REC_M2', art:5, txt:'Nach der Arbeit suchte ich nach intellektuellen Herausforderungen.', lTxt:'trifft gar nicht zu', rTxt:'trifft völlig zu'}));
			this.add(new Frage({id:'REC_M3', art:5, txt:'Nach der Arbeit tat ich Dinge, die mich herausfordern.', lTxt:'trifft gar nicht zu', rTxt:'trifft völlig zu'}));
			this.add(new Frage({id:'REC_M4', art:5, txt:'Nach der Arbeit tat ich etwas um meinen Horizont zu erweitern.', lTxt:'trifft gar nicht zu', rTxt:'trifft völlig zu'}));

			this.add(new Frage({id:'DANGER_QUANT1', art:2, txt:'Haben Sie während Ihrer Arbeitszeit auf Pausen (kurze Pausen oder Mittagspausen) verzichtet?'}));
			this.add(new Frage({id:'DANGER_QUANT2', art:2, txt:'Haben Sie heute länger gearbeitet?'}));
			this.add(new Frage({id:'DANGER_QUAL1', art:2, txt:'Haben Sie heute in einem Arbeitstempo gearbeitet, das Sie langfristig nicht durchhalten können?'}));
			this.add(new Frage({id:'DANGER_QUAL2', art:2, txt:'Haben Sie heute in einem Arbeitstempo gearbeitet, von dem Sie wissen, dass es Ihnen nicht gut tut?'}));
			this.add(new Frage({id:'DRUG_RELAX', art:2, txt:'Haben Sie heute Genussmittel/Substanzen (z.B. Alkohol, Nikotin oder Medikamente) konsumiert, um nach der Arbeit besser abschalten zu können?'}));
			this.add(new Frage({id:'DRUG_RELAX2', art:2, txt:'Haben Sie heute Genussmittel/Substanzen (z.B. Alkohol, Nikotin oder Medikamente) konsumiert, um nach der Arbeit besser einschlafen zu können?'}));
			this.add(new Frage({id:'DRUG_STIMU1', art:2, txt:'Haben Sie heute Genussmittel/Substanzen (z.B. Alkohol, Nikotin oder Medikamente) konsumiert, um Ihre hohe Arbeitsmenge bewältigen zu können?'}));
			this.add(new Frage({id:'DRUG_STIMU2', art:2, txt:'Haben Sie heute Genussmittel/Substanzen (z.B. Alkohol, Nikotin oder Medikamente) konsumiert, um bei der Arbeit leistungsfähiger zu sein?'}));

			this.add(new Frage({id:'SMOK', art:2, txt:'Haben Sie heute geraucht?'}));
			this.add(new Frage({id:'ALC', art:2, txt:'Haben Sie heute Alkohol getrunken?'}));

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
					{v: MsgView, msg:'Wie fühlen Sie sich gerade?<br/><br/>Antwortmöglichkeiten:<br/><div class="erkl"><span>gar nicht</span> <span>schwach</span> <span>etwas</span> <span>ziemlich</span> <span>Sehr stark</span></div>' },
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
