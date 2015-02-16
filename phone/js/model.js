/*
 * settings Model
 * ==============
 * enthält alle Einstellungen und Eintrittspunkte, wie z.B.:
 *	fragen:Collection
 *
 */
define([ 'jquery', 'underscore', 'backbone' ],function( $, _, Backbone ) {
	var Fb3Model = Backbone.Model.extend( {

		initialize: function() {

			// lege die Datenbank an, falls das noch nicht passiert ist, oder sich die Version geändert hat
			this.dbName = 'fb3.multitasking.uni-mainz';
			this.dbVersion = '1';

			var self= this;
			var openRequest = indexedDB.open(this.dbName,this.dbVersion);
			
			openRequest.onsuccess = function(e) {
				self.db = e.target.result;
				self.db.onerror = function(e) {
					// Fehler steigen auf - wird aus allen requests für alle auftauchenden Fehler abgerufen
					console.error('Fehler - indexedDB: ', e, 'Message:', e.target.error.message);
				};
//console.debug( 'open1');				
				// laden der Informationen aus der Datenbank und Abspeichern im Fb3Model
				var req = self.db.transaction('einstellungen').objectStore('einstellungen').openCursor();
//console.debug( 'open2');
				req.onsuccess = function(event) {
					var cursor = event.target.result;
					if (cursor) {
						if (!self.has(cursor.value.key)) {
							// aus der URL ausgelesene Werte nicht überschreiben
							var o = new Object();
							o[cursor.value.key] = cursor.value.value;
							self.set( o, { silent: true } );
						}
						cursor.continue();
					} else {
						// laden der Einstellungen ist jetzt fertig - jetzt nachbearbeiten
						// Gerätenamen setzen, falls nötig
						if ( !self.has('device') ) self.set('device','oN'+(new Date()).getTime());
						// StartTag und StartZeit einlesen
						if ( !self.has('tag') ) {
							var tag = new Date();
							tag.setHours(7);
							tag.setMinutes(30);
							tag.setSeconds(0);
							tag.setMilliseconds(0);
							self.set('tag',tag);
						}
						// Schichtbeginn schon lange (> 1 Tag) vorbei oder nicht vorhanden?
						if ( !self.has('schichtbeginn')) {
							self.set({'schichtbeginn': self.naechsterWerktag()});
							self.log({
								msg: 'schichtbeginn nicht vorhanden - neu bestimmt', 
								schichtbeginn: self.get('schichtbeginn')
							});
						} else {
							var sb = self.get('schichtbeginn');
							var anzTageDiff = Math.floor((Date.now() - sb.getTime()) / 86400000);
							if (anzTageDiff > 1) {
								sb.setDate(sb.getDate()+anzTageDiff);
								self.set('schichtbeginn',sb);
								self.log({
									msg: 'schichtbeginn - neu berechnet', 
									schichtbeginn: self.get('schichtbeginn')
								});
							}
						}
						// Art setzen, falls noch nicht erfolgt ist
						if (!fb3.has('art')) fb3.set('art', Boolean(Math.abs(this.anzHeute % 2)));
//console.debug( 'open3');
						
						// gibt es nicht beendete Antworten, die eventuell passen könnten?
						if ( self.has('antwortenTabelle') && self.has('antwortenId')) {
	/*
	 * 					// Es sind Antworten noch nicht abgeschlossen, 
							// aber die Antworten könnten eventuell auch verfallen sein.
							// Nach 24 Stunden verfallen solche Antworten
							// TODO - das muss noch programmiert werden
							// TODO - laden aus IDB
							// TODO - füllen der Fragen und des Modells
							// TODO - Navigation zur letzten Fragenseite

							// Antworten für laden, falls es welche gibt, die noch nicht beendet wurden
							var req = self.db.transaction('antworten').objectStore('antworten').openCursor(self.heuteId());
							req.onsuccess = function(e) {
								var cursor = e.target.result;
								if (cursor) {
									self.set('antworten', cursor.value);
								} else {
									// es sind noch keine Antworten gespeichert
								} else {
									// es sind noch keine Antworten gespeichert
									self.set('antworten', self.neueAntworten());
								}
							}
							req.onerror = function(e) {
								console.error('Antworten konnten nicht geladen werden',e);
							}
	*/
							console.warn( 'TODO - muss erst noch programmiert werden');
						}

						// zähle Datensätze
						self.countDS();

					} // Ende nachbearbeiten
				} // Ende req.onsuccess
				req.onerror = function(e) {
					console.info( 'Es gibt keine Einstellungen: ', e );
				}


//			this.set('antworten', (localStorage.antworten) ? JSON.parse(localStorage.antworten) : []);
				console.log('IDB-Open erfolgreich aufgerufen',new Date());
			}; // Ende openRequest.onsuccess
			openRequest.onerror = function(e) {
				console.error('IDB(indexedDB) OPEN Fehler: ', e, 'ErrorCode:', e.target.errorCode);
			}
			openRequest.onupgradeneeded = function(e) {	// Update object stores and indices
				var db = e.target.result;

				// alle vorhandenen ObjectStores löschen
				if (db.objectStoreNames.length > 0) { // es sind ObjectStores vorhanden
					if (db.objectStoreNames.contains('log')) db.deleteObjectStore('log');
					if (db.objectStoreNames.contains('antwortenM')) db.deleteObjectStore('antwortenM');
					if (db.objectStoreNames.contains('antwortenW')) db.deleteObjectStore('antwortenW');
					if (db.objectStoreNames.contains('antwortenN')) db.deleteObjectStore('antwortenN');
					if (db.objectStoreNames.contains('antwortenA')) db.deleteObjectStore('antwortenA');
					if (db.objectStoreNames.contains('einstellungen')) db.deleteObjectStore('einstellungen');
				}

				// ObjectStore neu anlegen
				var objectStoreLog = db.createObjectStore('log', { keyPath: 'dt' });
				objectStoreLog.add( { dt:new Date(), msg:'log neu angelegt' } );
				var objectStoreAntwortenM = db.createObjectStore('antwortenM', { keyPath: 'id', autoIncrement: true });
				var objectStoreAntwortenW = db.createObjectStore('antwortenW', { keyPath: 'id', autoIncrement: true });
				var objectStoreAntwortenN = db.createObjectStore('antwortenN', { keyPath: 'id', autoIncrement: true });
				var objectStoreAntwortenA = db.createObjectStore('antwortenA', { keyPath: 'id', autoIncrement: true });
				var objectStoreEinstellungen = db.createObjectStore('einstellungen', { keyPath: 'key' });

			};  // Ende onUpgradeNeeded

			// initialisiere die Programm-Variablen ==================================
			this.set('status','debug');
			this.set('version','0.1');
			if ((this.get('status') == 'debug') && this.db) 
				//TODO tritt nicht ein, weil so früh this.db noch nicht zur Verfügung steht
				this.db.transaction('log','readwrite').objectStore('log').clear();

		},

		setzeAntwort: function(antwortO) {
			if (typeof antwortO !== 'object') {
				console.warn('Fehler: es wird versucht eine Antwort zu speichern, ' +
						'aber die Antwort wird nicht übergeben - antwortO: ', antwortO);
				return undefined;
			}

			this.log({msg:'setzeAntwort', data:antwortO});
console.debug('setzeAntwort', antwortO);

			if (this.has('antworten')) {
				var data = this.get('antworten');
			} else {
				console.warn('setzeAntwort - neueAntworten() aufgerufen, das sollte nicht mehr passieren.');
				var data = this.neueAntworten();
			}

			if (antwortO.kodierung) {
				var kod = new Object();
				kod.zeit = (antwortO.zeit) ? antwortO.zeit : new Date();
				kod.wert = (antwortO.antw) ? antwortO.antw : 'null';
				data[antwortO.kodierung] = kod;
				this.set( {'antworten': data} );
				fb3.trigger('change:antworten',this,data); // Backbone scheint Änderungen in Objekten nicht zu erkennen
			} else {
				this.log({
					msg:'FEHLER: setzeAntwort gescheitert - keine Kodierung in antwortO', data:antwortO});
				return undefined;
			}

			// Eintrag in Collection: fragen
			this.fragen.setzeAntwort(antwortO);
		},	

		log: function(obj) {
			if (!this.db) {
				setTimeout('fb3.log('+JSON.stringify(obj)+');',1000);
			}
			// obj ist entweder ein Objekt, dann sollte es das Attribut dt:Date() besitzen
			// oder obj ist ein string, dann wird das Objekt hergestellt
			if ( typeof obj == 'object' ) {
				var logO = obj;
				if (!logO.dt) logO.dt = new Date();
			} else {
				var logO = new Object();
				logO.msg = obj;
				logO.dt = new Date();
			}
			if (!logO.heuteId) logO.heuteId = this.heuteId();

			this.db.transaction('log', 'readwrite').objectStore('log').add(logO).onerror = function (e) { 
				console.warn('IDB - log -  mit obj: ',obj, ' Fehler: ',e); 
			};

			if (this.get('status') == 'debug') console.debug('log: ' + logO.msg);

		},

		heuteId: function() {
			var heute = new Date();
			var m = heute.getUTCMonth() + 1;
			m = ((m<10) ? '0'+m : m);
			var d = heute.getUTCDay();
			d = ((d<10) ? '0'+d : d);
			var vpn = (this.has('person')) ? this.get('person') : '';
			return this.get('device') + '_' + vpn + '_' + heute.getUTCFullYear() + '-' + m + '-' + d;
		},

		neueAntworten: function() {
			var self = this;
			// alte Antworten löschen
			if (this.has('antworten')) this.unset('antworten', {silent: true});
			if (this.has('antwortenId')) this.unset('antwortenId');
			if (this.fragen) {
				this.fragen.entferneAntworten();
			} else {
				return undefined;
			}

			var antwTab = 'antworten' + this.fragen.typ;
			this.set('antwortenTabelle',antwTab);

			// neue Antworten eintragen
			var aO = new Object();
			aO.device = this.get('device');
			aO.tag = this.get('tag');
			aO.heuteId = this.heuteId();
			aO.fragenErstellt = this.fragen.zeit;
			aO.erstellt = new Date();
			aO.typ = this.fragen.typ;
			aO.person = this.get('person');
			aO.schichtbeginn = this.get('schichtbeginn');

			var req = this.db.transaction(antwTab,'readwrite').objectStore(antwTab).add( aO );
			req.onerror = function(e) {
				console.warn( 'IDB - neueAntworten - konnten nicht gespeichert werden: ', aO);
			}
			req.onsuccess = function(e) {
				aO.id = e.target.result;
				self.set( { 'antworten': aO }, { silent: true } );
				self.set( { 'antwortenId': aO.id, 'antwortenTabelle': antwTab } );
			}
			return aO; // das ist fraglich, weil hier die id nicht enthalten ist
		},

		speichereAntworten: function(cb) {
			var self = this;
			var antwTab = self.get('antwortenTabelle');
			var antw = self.get('antworten');
			var req =	self.db.transaction(antwTab,'readwrite').objectStore(antwTab).put( antw );
			req.onerror = function(e) {
				console.warn( 'IDB - neueAntworten - konnten nicht gespeichert werden: ', antw, antwTab, self.fragen);
			}
			self.unset('antworten', {silent: true});
			self.unset('antwortenId');
			self.unset('antwortenTabelle');

		},

		saveTab: function(tabName, errors) {
			var self = this;
			// Antworten auslesen
			var req = self.db.transaction(tabName).objectStore(tabName).openCursor();
			req.onsuccess = function(e) {
				var cursor = e.target.result;
				if (cursor) {
					var cv = _.clone(cursor.value);
					_.each(cv, function(v,k,l) { 
						if (_.isDate(v)) {
							// Datum formatieren
							l[k] = v.toMysqlFormat();
						} if (/[34]UE[123]/.test(k) && _.isNumber(v)) {
							// Zeit formatieren (UE1,2,3)
							var std = Math.floor(v);
							var min = Math.floor((v - G) * 60);
							l[k] = std + ':' + min + ':00';
						} if (/1SL2/.test(k) && _.isNumber(v)) {
							// SL2 kodiert die Zeit in Viertelstunden -> 2.75 ist dann also 11
							l[k] = v * 4;
						}	else {
							if (_.isObject(v) && _.isDate(v.zeit)) {
								l[k + 'D'] = v.zeit.toMysqlFormat();
								l[k] = v.wert;
							}
						}
					} );
					cv.tabellenName = tabName;
					$.ajax({
						type: "POST",
						dataType: "json",
						data: cv,
						beforeSend: function(x) {
							if(x && x.overrideMimeType) {
								x.overrideMimeType("application/json;charset=UTF-8");
							}
						},
						url: 'api/putData.php',
						success: function(data) {
							if (data.status == 'erfolg') { 
								/* löschen des Eintrages, falls data.status == erfolg
								 * data enthält die id und den tabellenNamen
								 */
								self.db.transaction(tabName,'readwrite').objectStore(tabName).delete(Number(data.id)).onerror = 
									function(e) {
										errors.push({e:tabName, msg:'saveTab - Eintrag id:'+data.id+' konnte nicht gelöscht werden'});
									};
							} else {
								errors.push({e:tabName, msg:'saveTab - nach der Übermittlung wurde ein Fehler gemeldet'});
								console.error('Fehler - saveTab - Nach der Übermittlung wurde ein Fehler gemeldet. data:', data);
							}
						},
						error: function(data) {
							errors.push({e:tabName, msg:'saveTab - ajax ist gescheitert'});
							console.error('Fehler - saveTab - ajax ist gescheitert. data:',data);
						}
					});
					cursor.continue();
				} // else console.debug('Erfolg - saveTab - die Tabelle '+tabName+' müsste jetzt leer sein');
			}
		},
		saveAll: function() {
			var self = this;
			var errA = new Array();
			var timeoutId = setTimeout(function() {
				// Fehlermeldung anzeigen (nach 5sek)
				$('#settingsSaveAllDataFehler').popup('open');
			}, 5000);

			self.saveTab('antwortenM', errA);
			self.saveTab('antwortenW', errA);
			self.saveTab('antwortenN', errA);
			self.saveTab('antwortenA', errA);

			// alle log-Einträge zusammenpacken und verschicken
			var log = new Array();
			var req = self.db.transaction('log').objectStore('log').openCursor();
			req.onerror = function(e) { 
				errA.push({e:'log', msg:'saveAll - log konnte nicht ausgelesen werden'});
				console.warn('Fehler - saveAll - log konnte icht ausgelesen werden. ',e); 
			}
			req.onsuccess = function(e) {
				var cursor = e.target.result;
				if (cursor) {
					log.push(cursor.value);
					cursor.continue();
				} else {
					// dt in MySQL-Format übertragen (dt ist der key, muss deshalb in jedem Feld vorhanden sein)
					_.each(log, function(v,k,l) {
						v.dt = v.dt.toMysqlFormat();
					});
					// ajax-Übertragung und anschließend Leeren des Log
					var data = new Object();
					data.log = log;
					data.settings = self.settings;
					data.tabellenName = 'log';
					data.id = -1;
					$.ajax({
						type: "POST",
						dataType: "json",
						'data': data,
						beforeSend: function(x) {
							if(x && x.overrideMimeType) {
								x.overrideMimeType("application/json;charset=UTF-8");
							}
						},
						url: 'api/putData.php',
						success: function(data) {
							if (data.status == 'erfolg') { 
								/* löschen des Eintrages, falls data.status == erfolg
								 * data enthält die id und den tabellenNamen
								 */
								var req = self.db.transaction('log','readwrite').objectStore('log').clear();
								req.onerror = function(e) {
									errA.push({e:'log', msg:'saveAll - log konnte nicht gelöscht werden'});
								};
								req.onsuccess = function(e) {
									// versuche festzustellen, ob Fehler auftraten
									if (errA.length > 0) {
										fb3.log({'msg': 'beim Übertragen der Daten ins Internet wurden Fehler gemeldet:', 'data':errA});
										console.warn( 'Fehler sind beim Übertragen aufgetreten: ', errA);
									} else {
										clearTimeout(timeoutId);
										$('#settingsSaveAllDataErfolg').popup('open');
									}
								}
							} else {
								errA.push({e:'log', msg:'saveAll - log meldet nach Übermittlung Fehler'});
								console.error('Fehler - saveLog - Nach der Übermittlung wurde ein Fehler gemeldet. data:', data);
							}
						},
						error: function(data) {
							errA.push({e:'log', msg:'saveAll - log ajax ist gescheitert.'});
							console.error('Fehler - saveLog - ajax ist gescheitert. data:',data);
						}
					});
					
				}
			}

			// Wenn alle Daten weg sind den SpeichernAlle-Button ausblenden
			var antA = ['antwortenM','antwortenW','antwortenN','antwortenA','log'];
			var t = self.db.transaction(antA);
			var anz = 0;
			t.objectStore('antwortenM').count().onsuccess = function(e) {
				anz = anz + e.target.result;
				t.objectStore('antwortenW').count().onsuccess = function(e) {
					anz = anz + e.target.result;
					t.objectStore('antwortenN').count().onsuccess = function(e) {
						anz = anz + e.target.result;
						t.objectStore('antwortenA').count().onsuccess = function(e) {
							anz = anz + e.target.result;
							self.showSaveAllButton(Boolean(anz > 0));
							console.info('es wurden '+anz+' Datensätze in M, W, N und A gezählt');
						}
					}
				}
			};
		},

		naechsterWerktag: function() {
			var jetzt = new Date();
			if (this.has('schichtbeginn'))
				var naechsterWochentag = this.get('schichtbeginn');
			else if (this.has('tag'))
				var naechsterWochentag = this.get('tag');
			else 
				var naechsterWochentag = jetzt;
			while (naechsterWochentag <= jetzt || 
						naechsterWochentag.getDay() < 1 || 
						naechsterWochentag.getDay() > 5)
				naechsterWochentag.setDate(naechsterWochentag.getDate()+1);
			return naechsterWochentag;
		},

		showSaveAllButton: function(boo) {
			// SaveAll-Button einblenden oder auch nicht
			if ( this.router.hasOwnProperty('settingsView') && (typeof boo === 'boolean') ) {
				var b = this.router.settingsView.$el.find('save0DataButton');
				if (b && boo) {
					b.button('enable');
					b.parent().css('display','inline-block');
				} else {
					b.button('disable');
					b.parent().css('display','none');
				}
			}
		},

		countDS: function() {
			var self = this;
			self.set({count:0},{silent:true});
			var tran = self.db.transaction(['antwortenM','antwortenW','antwortenN','antwortenA']);
			tran.objectStore('antwortenM').count().onsuccess = function(e) { 
				self.set('count', self.get('count') + e.target.result);
			};
			tran.objectStore('antwortenW').count().onsuccess = function(e) { 
				self.set('count', self.get('count') + e.target.result);
			};
			tran.objectStore('antwortenN').count().onsuccess = function(e) { 
				self.set('count', self.get('count') + e.target.result);
			};
			tran.objectStore('antwortenA').count().onsuccess = function(e) { 
				self.set('count', self.get('count') + e.target.result);
			};
		}
	} );

	window.fb3 = new Fb3Model;

	Object.defineProperties(fb3, {
		anzHeute: {
			writeable: false,
			get: function() {
				return Math.abs(Math.floor(((new Date()).getTime() - (this.get('tag')).getTime())/1000/60/60/24));
			}
		},
		fragen: {
			writeable:false,
			get: function() { return (this.router) ? this.router.fragen : undefined;}
		},
		settings: {
			get: function() {
				var o = new Object();
				o.status = this.get('status');
				o.version = this.get('version');
				o.device = this.get('device');
				o.tag = this.get('tag');
				o.person = this.get('person');
				o.schichtbeginn = this.get('schichtbeginn');
				console.debug( 'schichtbeginn', o.schichtbeginn ,(new Date()).getTime());
				return o;
			}
		},
	});

	// on... scheint nicht ausgelöst zu werden?
	// TODO wird noch nicht in DB eingetragen
	fb3.on('change:device', function(model, device) {
		this.db.transaction('einstellungen','readwrite').objectStore('einstellungen').put({
			'key':'device',
			'value':device
		}).onerror = function(e){
			console.warn('IDB - change:device - Einstellung für Device konnte nicht gespeichert werden.');
		};
		this.log('change:device ' + device);
	});
	fb3.on('change:art', function(model, art) {
		this.db.transaction('einstellungen','readwrite').objectStore('einstellungen').put({
			'key':'art',
			'value':art
		}).onerror = function(e){
			console.warn('IDB - change:art - Einstellung für Art konnte nicht gespeichert werden.');
		};
		this.log('change:art ' + art);
	});
	fb3.on('change:tag', function(model, tag) {
		this.db.transaction('einstellungen','readwrite').objectStore('einstellungen').put({
			'key':'tag',
			'value':tag
		}).onerror = function(e){
			console.warn('IDB - change:tag - Einstellung für Tag konnte nicht gespeichert werden.');
		};
		this.log('change:tag ' + tag);
	});
	fb3.on('change:schichtbeginn', function(model, sb) {
		this.db.transaction('einstellungen','readwrite').objectStore('einstellungen').put( {
			'key': 'schichtbeginn',
			'value': sb
		} ).onsuccess = function() {
			if (fb3 && fb3.router && fb3.router.hasOwnProperty('settingsView')) 
				fb3.router.settingsView.$el.find('#sb').html(sb.toGerman())
			else
				console.warn("Schichtbeginn konnte noch nicht in settingsView eingetragen werden.", fb3);
		};
	});
	fb3.on('change:person', function(model, vpn) {
		this.db.transaction('einstellungen','readwrite').objectStore('einstellungen').put( {
			'key': 'person',
			'value': vpn
		} ).onsuccess = function() { $('#vpn').html(vpn); }
	}),
	fb3.on('change:antwortenId', function(model, aI) {
		if (this.has('antwortenId')) {
			this.db.transaction('einstellungen','readwrite').objectStore('einstellungen').put( { 
				'key': 'antwortenId', 
				'value': aI } ).onerror = function() {
					console.warn( 'IDB - change:antwortenId - Fehler beim Schreiben der Einstellungen');
				}
		} else {
			this.db.transaction('einstellungen','readwrite').objectStore('einstellungen').delete('antwortenId');
		}
	});
	fb3.on('change:antwortenTabelle', function(model, aT) {
		if (this.has('antwortenTabelle')) {
			this.db.transaction('einstellungen','readwrite').objectStore('einstellungen').put( { 
				'key': 'antwortenTabelle', 
				'value': aT } ).onerror = function() {
					console.warn( 'IDB - change:antwortenTabelle - Fehler beim Schreiben der Einstellungen');
				}
		} else {
			this.db.transaction('einstellungen','readwrite').objectStore('einstellungen').delete('antwortenTabelle');
		}
	});

	fb3.on('change:antworten', function(model, antw) {
//		console.info( 'change:antworten antw', antw);
		var antwTab = this.get('antwortenTabelle');
		this.db.transaction(antwTab,'readwrite').objectStore(antwTab).put( antw ).onerror = function(e) {
			console.warn( 'IDB - neueAntworten - konnten nicht gespeichert werden: ', antw, antwTab, this.fragen);
		}
	});

	fb3.on('change:count', function(model,antw) {
		$('#save0DataButton').attr('title',this.get('count')+' Datensätze sind vorhanden.').trigger('mouseover');
	});
	return Fb3Model;
} );

