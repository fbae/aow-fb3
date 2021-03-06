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
			this.dbVersion = '2';

			var self= this;
			var openRequest = indexedDB.open(this.dbName,this.dbVersion);

			openRequest.onsuccess = function(e) {
				self.db = e.target.result;
				self.db.onerror = function(e) {
					// Fehler steigen auf - wird aus allen requests für alle auftauchenden Fehler abgerufen
					console.error('Fehler - indexedDB: ', e, 'Message:', e.target.error.message);
				};
				// laden der Informationen aus der Datenbank und Abspeichern im Fb3Model
				var req = self.db.transaction('einstellungen').objectStore('einstellungen').openCursor();
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
					if (db.objectStoreNames.contains('antwortenA')) db.deleteObjectStore('antwortenA');
					if (db.objectStoreNames.contains('antwortenE')) db.deleteObjectStore('antwortenE');
					if (db.objectStoreNames.contains('einstellungen')) db.deleteObjectStore('einstellungen');
				}

				// ObjectStore neu anlegen
				var objectStoreLog = db.createObjectStore('log', { keyPath: 'dt' });
				objectStoreLog.add( { dt:new Date(), msg:'log neu angelegt' } );
				var objectStoreAntwortenM = db.createObjectStore('antwortenM', { keyPath: 'id', autoIncrement: true });
				var objectStoreAntwortenW = db.createObjectStore('antwortenW', { keyPath: 'id', autoIncrement: true });
				var objectStoreAntwortenA = db.createObjectStore('antwortenA', { keyPath: 'id', autoIncrement: true });
				var objectStoreAntwortenN = db.createObjectStore('antwortenE', { keyPath: 'id', autoIncrement: true });
				var objectStoreEinstellungen = db.createObjectStore('einstellungen', { keyPath: 'key' });

			};  // Ende onUpgradeNeeded

			// initialisiere die Programm-Variablen ==================================
			var self = this;
			require( ['text!../fb3.appcache'],
				function(appcache){
					var foundArr;
					if ((foundArr = /# v[0-9]+\.[0-9]+.*/g.exec(appcache)) !== null) {
						var lineArr = foundArr[0].split('\t');
						try	{self.set('status',lineArr[2]);}
						catch(e) {self.set('status','debug');}
						try	{
							var verStr = lineArr[0].split(' ')[1];
							if (self.get('version') !== verStr) self.set('version',verStr);
						}
						catch(e) {self.set('version','0.4.1');}
						try	{
							if (lineArr[1] !== self.get('appCacheDate')) self.set('appCacheDate', lineArr[1]);
						}
						catch(e) {};
					} else {
						self.set('status','debug');
						self.set('version','0.4.3');
					}
				});
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
//console.debug('setzeAntwort', antwortO);

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
				return undefined;
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

			if (this.get('status') == 'debug') console.debug('log: ' + logO.msg,(_.has(logO,'data')?logO.msg.data:''));

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

		// für besondere Abläufe können hier die Typen auf TabellenNamen gemappt werden
		// hier zum Beispiel Ablauf Q wird in Tabelle antwortenW gespeichert
		antwortenTabelle: function() {
			if (this.fragen.typ) {
				var t;
				switch (this.fragen.typ) {
					case 'Q': t = 'W';
										break;
					default: t = this.fragen.typ;
				}
				return 'antworten'+t
			} else return undefined;
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

			var antwTab = this.antwortenTabelle();
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
/*
 * } if (/[34]UE[123]/.test(k) && _.isNumber(v)) {
							// Zeit formatieren (UE1,2,3)
							var std = Math.floor(v);
							var min = Math.floor((v - G) * 60);
							l[k] = std + ':' + min + ':00';
*/
						} else if (/OVERTI/.test(k)) {
							// OVERTI kodiert die Zeit in Viertelstunden -> 2.75 ist dann also 11
							l[k + 'D'] = v.zeit.toMysqlFormat();
							l[k] = v.wert * 4;
						}	else if (_.isString(v) && (/true/.test(v) || /false/.test(v))) {
							l[k] = /true/.test(v);
						} else {
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
						url: 'api/putData3.php',
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
			self.antwortenWZusammenfassen(errA);
			self.saveTab('antwortenA', errA);
			self.saveTab('antwortenE', errA);

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
						url: 'api/putData3.php',
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
			this.countDS();
		},

		antwortenWZusammenfassen: function(errA) {
			/**
			 * überarbeite antwortenW, indem passende Einträge zusammengefasst werden,
			 * dort neu im Datenbankformat gespeichert werden und die passenden Einträge anschließend
			 * gelöscht werden
			 *
			 * @param errA - alle Fehlermeldungen im Array
			 * überholt:			 * cb - wird ohne Parameter aufgerufen, nachdem zusammengefasst wurde (callback)
			 */
			var tabName = 'antwortenW';
			var self = this;
			// Tabelle W in Array übertragen
			var wArr = new Array(); // hält Arbeitskopie der Tabelle W
			var oStore = self.db.transaction(tabName,'readwrite').objectStore(tabName);
			var req = oStore.openCursor();
			req.onerror = function(e) {
				console.warn('Fehler - '+tabName+' konnte nicht ausgelesen werden. ',e);
			}
			req.onsuccess = function(e) {
				var cursor = e.target.result;
				if (cursor) {
					wArr.push(cursor.value);
					cursor.continue();
				} else {
					// alle Daten sind übertragen

					// funktion deklarieren
					/**
					 * Zusammenfassung bestimmter Gruppen
					 * Gruppen bestehen aus startStr und endStr
					 * im Falle von art=inter müssen noch die nachfolgenden Antworten aus dem Fragebogen zusammengefasst
					 * vereint werden
					 */
					var fasseZusammen = function(startStr, endStr, artStr) {
						/**
						 * @param wArr - wird implizit übergeben und enthält die gesamten Zeilen aus antwortenW
						 *
						 * @var w2Arr - wird gefüllt, enthält die wieder in antwortenW zu speichernden Datensätze
						 * @var weArr - Ausschnitt aus wArr - nur start- und ende-Zeilen
						 * @var weObj - die Zusammenstellung eines Datensatzes zusammengehöriger Daten, 
						 *              wird in w2Arr abgespeichert
						 */
						var w2Arr = new Array();
						var weArr = _.filter(wArr,function(eintrag){
							return _.has(eintrag, startStr) ||  _.has(eintrag, endStr);
						});
						var weObj = new Object();
						_.each(weArr,function(val,key,list){
							if (_.has(val, endStr)) {
								if ( _.has(weObj, 'start')) {
									// vervollständigen und abspeichern
									weObj.end = val[endStr];
									weObj.eId = val.id;
									// falls ein Iterrupt gesucht wird, alle nachfolgenden Datensätze hinzufügen
									if (artStr === 'inter') {
										var wId = val.id + 1; // id in antwortenW
										var nachfolgendeFragenObj = new Object();
//console.debug('zusammef 1',wId,weObj);
										while (nachfolgendeFragenObj = _.find(wArr,function(eintrag)
													{ return ((eintrag.id == wId) && _.has(eintrag,'tag')); })) {
											_.extend(weObj, nachfolgendeFragenObj);
//console.debug('zusammef 2',wId,weObj);
											weObj.nId = weObj.id;
											delete weObj.id;
											wId++;
										}
									}
									w2Arr.push(weObj);
									weObj = new Object();
								} 
								/* workend kommt vor dem workstart -> das kann nicht sein und wird ignoriert
									ABER nach Verlust der Startzeiten 15-06-15 abgeändert in -> 
									start wird dann automatisch ergänzt und mit Endzeit belegt
									d.h. hier wird alles auf einmal gemacht
								*/
								else {
									_.extend(weObj, {
										'start': val[endStr],
										'end':   val[endStr],
										'device': val.device,
										'person': val.person,
										'art': artStr,
										'sId': val.id,
										'eId': val.id
									});
									// falls ein Iterrupt gesucht wird, den nachfolgenden Datensatz hinzufügen
									if (artStr === 'inter') {
										var nachfolgendeFragenObj = _.find(wArr,function(eintrag){ return eintrag.id == val.id+1; });
										if (_.has(nachfolgendeFragenObj,'tag')) {
											_.extend(weObj, nachfolgendeFragenObj);
											weObj.nId = weObj.id;
											delete weObj.id;
										}
									}
									w2Arr.push(weObj);
									weObj = new Object();
								}
							} else {
								if (!_.isEmpty(weObj)) {
									// weiteres workstart ohne workend trotzdem speichern
									w2Arr.push(weObj);
									weObj = new Object();
								}
								_.extend(weObj, {
									'start': val[startStr],
									'device': val.device,
									'person': val.person,
									'art': artStr,
									'sId': val.id
								});
							}
						});
						if (!_.isEmpty(weObj)) {
							// ohne workend trotzdem speichern
							w2Arr.push(weObj);
							weObj = new Object();
						}
						// Zusammenfassung speichern und bei Erfolg id's löschen
						_.each(w2Arr, function(val, key, list){
							var req = oStore.put(val);
							req.onerror = function(e) {
								console.warn('Fehler - Zusammenfassung von '+tabName+' - es konnte '+artStr+'nicht abgespeichert werden. ',e);
							}
							req.onsuccess = function(e) {
								oStore.delete(val.sId);
								if (_.has(val,'eId')) oStore.delete(val.eId);
								if (_.has(val,'nId')) oStore.delete(val.nId);
							}
						});
					} // ende fasseZusammen()

					// suche intend und vorheriges intstart und nachfolgende Fragen
					fasseZusammen('intstart','intend','inter');
					// suche workend und vorheriges workstart
					fasseZusammen('workstart','workend','work');
					// suche breakend und vorheriges break
					fasseZusammen('break','breakend','break');

					setTimeout(self.saveTab('antwortenW', errA),1500);
				} // ende - Tabelle W überarbeiten
			}
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
			var tran = self.db.transaction(['antwortenM','antwortenW','antwortenE','antwortenA']);
			tran.objectStore('antwortenM').count().onsuccess = function(e) {
				self.set('count', self.get('count') + e.target.result);
			};
			tran.objectStore('antwortenW').count().onsuccess = function(e) {
				self.set('count', self.get('count') + e.target.result);
			};
			tran.objectStore('antwortenE').count().onsuccess = function(e) {
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
				o.appCacheDate = this.get('appCacheDate');
				o.device = this.get('device');
				o.tag = this.get('tag');
				o.person = this.get('person');
				o.schichtbeginn = this.get('schichtbeginn');
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

	// während der Arbeit - Fenster von Hand programmiert W0, W, W1, W2
	// WorkStart in die Datenbank Tabelle W eintragen
	$('#W').on('click',function(evt){
		fb3.db.transaction('antwortenW','readwrite').objectStore('antwortenW')
			.put({'workstart':new Date(), 'device':fb3.get('device'), 'person':fb3.get('person')})
			.onerror = function(e) { console.warn('Fehler: #W click (workstart) hat keinen IDB Eintrag hinterlassen ',e);};
	});
	// intStart in die Datenbank Tabelle W eintragen
	$('#w0w1').on('click',function(evt){
		fb3.db.transaction('antwortenW','readwrite').objectStore('antwortenW')
			.put({'intstart':new Date(), 'device':fb3.get('device'), 'person':fb3.get('person')})
			.onsuccess = function(e) {
				// Eintrag wieder löschen, wenn auf zurück gegangen wird - e.target.result speichert die neu erstellte id
				$('#w1w0').on('click',null,e.target.result,function(evt) {
					fb3.db.transaction('antwortenW','readwrite').objectStore('antwortenW').delete(evt.data);
				});
			};
	});
	// intEnd in die Datenbank Tabelle W eintragen
	$('#w1q').on('click',function(evt){
		fb3.db.transaction('antwortenW','readwrite').objectStore('antwortenW')
			.put({'intend':new Date(), 'device':fb3.get('device'), 'person':fb3.get('person')})
			.onsuccess = function(){
				$('#w1w0').off('click');
			}
	});
	// brStart in die Datenbank Tabelle W eintragen
	$('#w0w2').on('click',function(evt){
		fb3.db.transaction('antwortenW','readwrite').objectStore('antwortenW')
			.put({'break':new Date(), 'device':fb3.get('device'), 'person':fb3.get('person')})
			.onsuccess = function(e) {
				// wie oben - zurück-Button löscht den letzten Eintrag
				$('#w2w0').on('click',null,e.target.result,function(evt) {
					fb3.db.transaction('antwortenW','readwrite').objectStore('antwortenW').delete(evt.data);
				});
			};
	});
	// brEnd eintragen
	$('#w2e').on('click',function(evt){
		fb3.db.transaction('antwortenW','readwrite').objectStore('antwortenW')
			.put({'breakend':new Date(), 'device':fb3.get('device'), 'person':fb3.get('person')})
			.onsuccess = function(){
				$('#w2w0').off('click');
			}
	});
	// WorkEnd in die Datenbank Tabelle W eintragen
	$('#w0N').on('click',function(evt){
		fb3.db.transaction('antwortenW','readwrite').objectStore('antwortenW')
			.put({'workend':new Date(), 'device':fb3.get('device'), 'person':fb3.get('person')})
	});

	return Fb3Model;
} );

