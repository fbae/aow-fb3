<?php
	if (!isset($_POST) || !(isset($_POST['log']) || isset($_POST['tabellenName']))) {
		// sterben, falls keine auswertbaren Angaben gepostet werden
		$req = array(
			'status' => 'fehler', 
			'msg' => "tabellenName -{$_POST['tabellenName']}-) oder log -{$_POST['log']}- nicht gefunden", 
			'post' => $_POST
		);
 		die(json_encode($req));
	}
	
	// Datenbankverbindung aufnehmen
//	$mysqli = new mysqli('mysql-vh.zdv.Uni-Mainz.DE', 'psyc_mutask_web', 'nohphah1eSoo', 'psyc_mutask');
	require_once('./dbData.php');
	$mysqli = new mysqli($dbN, $dbU, $dbP, $dbD);
	if ($mysqli->connect_errno) {
		$req = array(
			'server' => $_SERVER['SERVER_NAME'],
			'status' => 'fehler', 
			'msg' => "Verbindung zu $dbU gescheitert" . $mysqli->connect_error
		);
		die(json_encode($req));
	} 
	
	// Ergebnis als Rückgabewert bereitstellen
	$ergebnis = array(
		'status' => 'unentschieden',
		'msg' => '',
		'id' => $_POST['id'],
		'tabellenName' => $_POST['tabellenName'],
//		'post' => $_POST,
	);
	// POST in das Log speichern
	$postS = serialize($_POST);
	$ergebnis['log'] = ($mysqli->query("insert into log3(obj) values ('$postS')")) ? 'gespeichert' : 'nicht gespeichert';

	// entsprechende Tabelle füllen
	// $data trägt die POSTs, die für die Datenbank bedeutsam sind
	switch ($_POST['tabellenName']) {
		case 'antwortenW':
			$tab = 'W3';
			$dataW = array_flip(array(
'device', 'person', 'start', 'end', 'art'				
			));
			$dataQ = array_flip(array(
'tag', 'heuteId', 'erstellt', 'fragenErstellt',  'W_COMPI', 'W_COMPP', 'W_SITMOOD', 'W_SOU', 'W_MED', 'W_COMPID', 'W_COMPPD', 'W_SITMOODD', 'W_SOUD', 'W_MEDD'
			));
			$data = array_merge($dataW,$dataQ);
			break;
		case 'antwortenM':
			$tab = 'M3';
			$data = array_flip( array(
'device','person','tag','typ','heuteId','erstellt','fragenErstellt','M_ISI','M_NA1','M_NA2','M_NA3','M_NA4','M_NA5','M_NA6','M_PA2','M_PA3','M_PA4','M_PA5','M_PA6','M_PAVI1','M_PSQI4','M_PSQI7','M_PSQI11','M_SE1','M_SE2','M_SE3','M_STATREC1','M_STATREC2','M_STATREC3','M_STATREC4','M_TI1','M_TI2','M_TI3','M_VI2','M_VI3','M_VI4','M_ISID','M_NA1D','M_NA2D','M_NA3D','M_NA4D','M_NA5D','M_NA6D','M_PA2D','M_PA3D','M_PA4D','M_PA5D','M_PA6D','M_PAVI1D','M_PSQI4D','M_PSQI7D','M_PSQI11D','M_SE1D','M_SE2D','M_SE3D','M_STATREC1D','M_STATREC2D','M_STATREC3D','M_STATREC4D','M_TI1D','M_TI2D','M_TI3D','M_VI2D','M_VI3D','M_VI4D'
			));
			break;
		case 'antwortenE':
			$tab = 'E3';
			$data = array_flip( array(
'device','person','tag','typ','heuteId','erstellt','fragenErstellt','E_NA1','E_SE1','E_PAVI1','E_NA2','E_SE2','E_PA2','E_TI1','E_VI2','E_NA3','E_SE3','E_PA3','E_TI2','E_NA5','E_VI3','E_NA4','E_PA4','E_VI4','E_PA5','E_NA6','E_PA6','E_TI3','E_ALC','E_DANGER_QUAL1','E_DANGER_QUAL2','E_DANGER_QUANT1','E_DANGER_QUANT2','E_DRUG_RELAX1','E_DRUG_RELAX2','E_DRUG_STIMU1','E_DRUG_STIMU2','E_ERR','E_FORGET','E_HO','E_IRR_E1','E_IRR_E2','E_IRR_E3','E_IRR_E4','E_IRR_E5','E_IRR_K1','E_IRR_K2','E_IRR_K3','E_OVERTI','E_REC_E1','E_REC_E2','E_REC_E3','E_REC_E4','E_REC_M1','E_REC_M2','E_REC_M3','E_REC_M4','E_SMOK','E_WORR1E','E_WORR2E','E_ALCD','E_DANGER_QUAL1D','E_DANGER_QUAL2D','E_DANGER_QUANT1D','E_DANGER_QUANT2D','E_DRUG_RELAX1D','E_DRUG_RELAX2D','E_DRUG_STIMU1D','E_DRUG_STIMU2D','E_ERRD','E_FORGETD','E_IRR_E1D','E_IRR_E2D','E_IRR_E3D','E_IRR_E4D','E_IRR_E5D','E_IRR_K1D','E_IRR_K2D','E_IRR_K3D','E_OVERTID','E_REC_E1D','E_REC_E2D','E_REC_E3D','E_REC_E4D','E_REC_M1D','E_REC_M2D','E_REC_M3D','E_REC_M4D','E_SMOKD','E_WORR1ED','E_WORR2ED','E_NA1D','E_SE1D','E_PAVI1D','E_NA2D','E_SE2D','E_PA2D','E_TI1D','E_VI2D','E_NA3D','E_SE3D','E_PA3D','E_TI2D','E_NA5D','E_VI3D','E_NA4D','E_PA4D','E_VI4D','E_PA5D','E_NA6D','E_PA6D','E_TI3D'
			));
			break;
		case 'antwortenA':
			$tab = 'A3';
			$data = array_flip( array(
'device','person','tag','typ','heuteId','erstellt','fragenErstellt','A_CONT1','A_CONT2','A_CONT3','A_FULLFI','A_JOBSAT','A_NA1','A_NA2','A_NA3','A_NA4','A_NA5','A_NA6','A_PA2','A_PA3','A_PA4','A_PA5','A_PA6','A_PAVI1','A_QUAL','A_SE1','A_SE2','A_SE3','A_SITCON1','A_SITCON2','A_SITCON3','A_STRAT_INT1','A_STRAT_INT2','A_STRAT_INT3','A_STRAT_INT4','A_SUPPO1','A_SUPPO2','A_TI1','A_TI2','A_TI3','A_TLX1','A_TLX2','A_TLX3','A_TLX4','A_TLX5','A_TLX6','A_TLX7','A_TLX8','A_TPRESS1','A_TPRESS2','A_TPRESS3','A_VI2','A_VI3','A_VI4','A_WD1','A_WD2','A_WD3','A_WD4','A_WD5','A_WEAB1','A_WEAB2','A_WEAB3','A_WEDE1','A_WEDE2','A_WEDE3','A_WEVI1','A_WEVI2','A_WEVI3','A_WORR1','A_WORR2','A_CONT1D','A_CONT2D','A_CONT3D','A_FULLFID','A_JOBSATD','A_NA1D','A_NA2D','A_NA3D','A_NA4D','A_NA5D','A_NA6D','A_PA2D','A_PA3D','A_PA4D','A_PA5D','A_PA6D','A_PAVI1D','A_QUALD','A_SE1D','A_SE2D','A_SE3D','A_SITCON1D','A_SITCON2D','A_SITCON3D','A_STRAT_INT1D','A_STRAT_INT2D','A_STRAT_INT3D','A_STRAT_INT4D','A_SUPPO1D','A_SUPPO2D','A_TI1D','A_TI2D',
'A_TI3D','A_TLX1D','A_TLX2D','A_TLX3D','A_TLX4D','A_TLX5D','A_TLX6D','A_TLX7D','A_TLX8D','A_TPRESS1D','A_TPRESS2D','A_TPRESS3D','A_VI2D','A_VI3D','A_VI4D','A_WD1D','A_WD2D','A_WD3D','A_WD4D','A_WD5D','A_WEAB1D','A_WEAB2D','A_WEAB3D','A_WEDE1D','A_WEDE2D','A_WEDE3D','A_WEVI1D','A_WEVI2D','A_WEVI3D','A_WORR1D','A_WORR2D'
			) );
			break;
		default: // das Log wurde übergeben, oder ich kann mit den Daten nichts anfangen
			if (isset($_POST['log'])) {
				$ergebnis['status'] = ($mysqli->query("insert into log3(obj) values ('".serialize($_POST['log'])."')")) ? 'erfolg' : 'fehler';
			} else $ergebnis['status'] = 'fehler';
			die(json_encode($ergebnis));
	}
	// POST auslesen
	foreach ($data as $key => &$val) {
		$val = (isset($_POST[$key])) ? "'{$_POST[$key]}'" : "'NULL'";
	}
	unset($val);
	// in data alle leeren Einträge löschen
	foreach ($data as $key => $val) {
		if ($val === "'NULL'") {
			unset($data[$key]);
		} else if ($val === "'true'") {
			$data[$key] = "true";
		} else if ($val === "'false'") {
			$data[$key] = "false";
		}
	}
	$ergebnis['data'] = $data;
	if (count($data) == 0) {
		// keine Werte, die einzutragen wären
		$ergebnis['status'] = 'fehler';
		$ergebnis['msg'] = 'Es wurden keine Werte übertragen';
		die(json_encode($ergebnis));
	}

	// Fertigstellen der Query
	if ($tab === 'W3') {
		$data4W3 = array_intersect_key($data,$dataW);
		$ergebnis['query'] = "insert into $tab (".implode(",",array_keys($data4W3)).") values (".implode(",",$data4W3).")";
		if ($mysqli->query($ergebnis['query'])) {
			$ergebnis['status'] = 'erfolg';
		} else {
			$ergebnis['status'] = 'fehler';
			$ergebnis['msg'] = 'Speichern der Daten mit query ist gescheitert.';
		}
		if (isset($data4W3['art']) && ($data4W3['art'] == "'inter'")) {
			$data4Q3 = array_intersect_key($data,$dataQ);
			$data4Q3['id'] = $mysqli->insert_id;
			$ergebnis['query2'] = "insert into Q3 (".implode(",",array_keys($data4Q3)).") values (".implode(",",$data4Q3).")";
			if ($mysqli->query($ergebnis['query2'])) {
				$ergebnis['status'] = 'erfolg';
			} else {
				$ergebnis['status'] = 'fehler';
				$ergebnis['msg'] = 'Speichern der Daten mit query ist gescheitert.';
			}
		} 
	} else {
		$ergebnis['query'] = "insert into $tab (".implode(",",array_keys($data)).") values (".implode(",",$data).")";
		if ($mysqli->query($ergebnis['query'])) {
			$ergebnis['status'] = 'erfolg';
		} else {
			$ergebnis['status'] = 'fehler';
			$ergebnis['msg'] = 'Speichern der Daten mit query ist gescheitert.';
		}
	}
	echo json_encode($ergebnis);
// error_log('Query :'.print_r($ergebnis['query'],true));
?>
