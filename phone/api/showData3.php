<?php
	define('ANZAHL_DATENSATZE',100);

	ini_set('display_errors', 'On');
	ini_set('display_startup_errors', 'On');
	error_reporting(E_ALL);

	// Datenbankverbindung aufnehmen
	require_once('./dbData.php');
	$mysqli = new mysqli($dbN, $dbU, $dbP, $dbD);
	if ($mysqli->connect_errno) {
		$req = array(
			'status' => 'fehler', 
			'msg' => 'Verbindung zu psyc_mutask gescheitert' . $mysqli->connect_error
		);
		die(json_encode($req));
	} 

	// Eine Tabelle als HMTL aufbereiten (mit Überschrift)
	function gibAlsHTML($tabName) {
		global $mysqli;
		// Tabelle abfragen und ausgeben
		$ergebnis = '';
		switch ($tabName) {
		case 'W': 
			$tabBez = 'während der Arbeit - work - (Tabelle W3)';
			$query = <<<QUERYW
SELECT `W3`.`id`,
	`W3`.`device`,
	`W3`.`person`,
	CONVERT_TZ(`W3`.`start`,'+0:00','SYSTEM') AS 'start',
	CONVERT_TZ(`W3`.`end`,'+0:00','SYSTEM') AS 'ende',
	`W3`.`art`,
	CONVERT_TZ(`Q3`.`tag`,'+0:00','SYSTEM') AS 'tag',
	`Q3`.`heuteId`,
	CONVERT_TZ(`Q3`.`erstellt`,'+0:00','SYSTEM') AS 'erstellt',
	CONVERT_TZ(`Q3`.`fragenErstellt`,'+0:00','SYSTEM') AS 'fragenErstellt',
	`Q3`.`W_COMPI`,
	`Q3`.`W_COMPP`,
	`Q3`.`W_SITMOOD`,
	`Q3`.`W_SOU`,
	`Q3`.`W_MED`,
	CONVERT_TZ(`Q3`.`W_COMPID`,'+0:00','SYSTEM') AS 'W_COMPID',
	CONVERT_TZ(`Q3`.`W_COMPPD`,'+0:00','SYSTEM') AS 'W_COMPPD',
	CONVERT_TZ(`Q3`.`W_SITMOODD`,'+0:00','SYSTEM') AS 'W_SITMOODD',
	CONVERT_TZ(`Q3`.`W_SOUD`,'+0:00','SYSTEM') AS 'W_SOUD',
	CONVERT_TZ(`Q3`.`W_MEDD`,'+0:00','SYSTEM') AS 'W_MEDD'
FROM `psyc_mutask`.`W3` left outer join `psyc_mutask`.`Q3` using(`id`)
order by `device`, `person`, `start`;
QUERYW;
break;
			case 'M': $tabBez = 'morgens - morning - (Tabelle M3)';
$query = <<<QUERYQ
SELECT `M3`.`id`,
    `M3`.`device`,
    `M3`.`person`,
CONVERT_TZ(`M3`.`tag`,'+0:00','SYSTEM') 'tag',
    `M3`.`typ`,
    `M3`.`heuteId`,
CONVERT_TZ(`M3`.`erstellt`,'+0:00','SYSTEM') 'erstellt',
CONVERT_TZ(`M3`.`fragenErstellt`,'+0:00','SYSTEM') 'fragenErstellt',
    `M3`.`M_ISI`,
    `M3`.`M_NA1`,
    `M3`.`M_NA2`,
    `M3`.`M_NA3`,
    `M3`.`M_NA4`,
    `M3`.`M_NA5`,
    `M3`.`M_NA6`,
    `M3`.`M_PA2`,
    `M3`.`M_PA3`,
    `M3`.`M_PA4`,
    `M3`.`M_PA5`,
    `M3`.`M_PA6`,
    `M3`.`M_PAVI1`,
    `M3`.`M_PSQI4`,
    `M3`.`M_PSQI7`,
    `M3`.`M_PSQI11`,
    `M3`.`M_SE1`,
    `M3`.`M_SE2`,
    `M3`.`M_SE3`,
    `M3`.`M_STATREC1`,
    `M3`.`M_STATREC2`,
    `M3`.`M_STATREC3`,
    `M3`.`M_STATREC4`,
    `M3`.`M_TI1`,
    `M3`.`M_TI2`,
    `M3`.`M_TI3`,
    `M3`.`M_VI2`,
    `M3`.`M_VI3`,
    `M3`.`M_VI4`,
CONVERT_TZ(`M3`.`M_ISID`,'+0:00','SYSTEM') 'M_ISID',
CONVERT_TZ(`M3`.`M_NA1D`,'+0:00','SYSTEM') 'M_NA1D',
CONVERT_TZ(`M3`.`M_NA2D`,'+0:00','SYSTEM') 'M_NA2D',
CONVERT_TZ(`M3`.`M_NA3D`,'+0:00','SYSTEM') 'M_NA3D',
CONVERT_TZ(`M3`.`M_NA4D`,'+0:00','SYSTEM') 'M_NA4D',
CONVERT_TZ(`M3`.`M_NA5D`,'+0:00','SYSTEM') 'M_NA5D',
CONVERT_TZ(`M3`.`M_NA6D`,'+0:00','SYSTEM') 'M_NA6D',
CONVERT_TZ(`M3`.`M_PA2D`,'+0:00','SYSTEM') 'M_PA2D',
CONVERT_TZ(`M3`.`M_PA3D`,'+0:00','SYSTEM') 'M_PA3D',
CONVERT_TZ(`M3`.`M_PA4D`,'+0:00','SYSTEM') 'M_PA4D',
CONVERT_TZ(`M3`.`M_PA5D`,'+0:00','SYSTEM') 'M_PA5D',
CONVERT_TZ(`M3`.`M_PA6D`,'+0:00','SYSTEM') 'M_PA6D',
CONVERT_TZ(`M3`.`M_PAVI1D`,'+0:00','SYSTEM') 'M_PAVI1D',
CONVERT_TZ(`M3`.`M_PSQI4D`,'+0:00','SYSTEM') 'M_PSQI4D',
CONVERT_TZ(`M3`.`M_PSQI7D`,'+0:00','SYSTEM') 'M_PSQI7D',
CONVERT_TZ(`M3`.`M_PSQI11D`,'+0:00','SYSTEM') 'M_PSQI11D',
CONVERT_TZ(`M3`.`M_SE1D`,'+0:00','SYSTEM') 'M_SE1D',
CONVERT_TZ(`M3`.`M_SE2D`,'+0:00','SYSTEM') 'M_SE2D',
CONVERT_TZ(`M3`.`M_SE3D`,'+0:00','SYSTEM') 'M_SE3D',
CONVERT_TZ(`M3`.`M_STATREC1D`,'+0:00','SYSTEM') 'M_STATREC1D',
CONVERT_TZ(`M3`.`M_STATREC2D`,'+0:00','SYSTEM') 'M_STATREC2D',
CONVERT_TZ(`M3`.`M_STATREC3D`,'+0:00','SYSTEM') 'M_STATREC3D',
CONVERT_TZ(`M3`.`M_STATREC4D`,'+0:00','SYSTEM') 'M_STATREC4D',
CONVERT_TZ(`M3`.`M_TI1D`,'+0:00','SYSTEM') 'M_TI1D',
CONVERT_TZ(`M3`.`M_TI2D`,'+0:00','SYSTEM') 'M_TI2D',
CONVERT_TZ(`M3`.`M_TI3D`,'+0:00','SYSTEM') 'M_TI3D',
CONVERT_TZ(`M3`.`M_VI2D`,'+0:00','SYSTEM') 'M_VI2D',
CONVERT_TZ(`M3`.`M_VI3D`,'+0:00','SYSTEM') 'M_VI3D',
CONVERT_TZ(`M3`.`M_VI4D`,'+0:00','SYSTEM') 'M_VI4D'
FROM `psyc_mutask`.`M3`
order by `device`, `person`, `erstellt` desc;
QUERYQ;
break;
			case 'E': $tabBez = 'abends - evening - (Tabelle E3)';
$query = <<<QUERYE
SELECT
	`E3`.`id`,
	`E3`.`device`,
	`E3`.`person`,
CONVERT_TZ(`E3`.`tag`,'+0:00','SYSTEM') AS 'tag',
	`E3`.`typ`,
	`E3`.`heuteId`,
CONVERT_TZ(`E3`.`erstellt`,'+0:00','SYSTEM') AS 'erstellt',
CONVERT_TZ(`E3`.`fragenErstellt`,'+0:00','SYSTEM') AS 'fragenErstellt',
	`E3`.`E_NA1`,
	`E3`.`E_SE1`,
	`E3`.`E_PAVI1`,
	`E3`.`E_NA2`,
	`E3`.`E_SE2`,
	`E3`.`E_PA2`,
	`E3`.`E_TI1`,
	`E3`.`E_VI2`,
	`E3`.`E_NA3`,
	`E3`.`E_SE3`,
	`E3`.`E_PA3`,
	`E3`.`E_TI2`,
	`E3`.`E_NA5`,
	`E3`.`E_VI3`,
	`E3`.`E_NA4`,
	`E3`.`E_PA4`,
	`E3`.`E_VI4`,
	`E3`.`E_PA5`,
	`E3`.`E_NA6`,
	`E3`.`E_PA6`,
	`E3`.`E_TI3`,
	`E3`.`E_ALC`,
	`E3`.`E_DANGER_QUAL1`,
	`E3`.`E_DANGER_QUAL2`,
	`E3`.`E_DANGER_QUANT1`,
	`E3`.`E_DANGER_QUANT2`,
	`E3`.`E_DRUG_RELAX1`,
	`E3`.`E_DRUG_RELAX2`,
	`E3`.`E_DRUG_STIMU1`,
	`E3`.`E_DRUG_STIMU2`,
	`E3`.`E_ERR`,
	`E3`.`E_FORGET`,
	`E3`.`E_HO`,
	`E3`.`E_IRR_E1`,
	`E3`.`E_IRR_E2`,
	`E3`.`E_IRR_E3`,
	`E3`.`E_IRR_E4`,
	`E3`.`E_IRR_E5`,
	`E3`.`E_IRR_K1`,
	`E3`.`E_IRR_K2`,
	`E3`.`E_IRR_K3`,
	concat(`E3`.`E_OVERTI`*15 div 60,':',`E3`.`E_OVERTI`*15 mod 60) AS 'E_OVERTI',
	`E3`.`E_REC_E1`,
	`E3`.`E_REC_E2`,
	`E3`.`E_REC_E3`,
	`E3`.`E_REC_E4`,
	`E3`.`E_REC_M1`,
	`E3`.`E_REC_M2`,
	`E3`.`E_REC_M3`,
	`E3`.`E_REC_M4`,
	`E3`.`E_SMOK`,
	`E3`.`E_WORR1E`,
	`E3`.`E_WORR2E`,
CONVERT_TZ(`E3`.`E_NA1D`,'+0:00','SYSTEM') AS 'NA1D',
CONVERT_TZ(`E3`.`E_SE1D`,'+0:00','SYSTEM') AS 'SE1D',
CONVERT_TZ(`E3`.`E_PAVI1D`,'+0:00','SYSTEM') AS 'PAVI1D',
CONVERT_TZ(`E3`.`E_NA2D`,'+0:00','SYSTEM') AS 'NA2D',
CONVERT_TZ(`E3`.`E_SE2D`,'+0:00','SYSTEM') AS 'SE2D',
CONVERT_TZ(`E3`.`E_PA2D`,'+0:00','SYSTEM') AS 'PA2D',
CONVERT_TZ(`E3`.`E_TI1D`,'+0:00','SYSTEM') AS 'TI1D',
CONVERT_TZ(`E3`.`E_VI2D`,'+0:00','SYSTEM') AS 'VI2D',
CONVERT_TZ(`E3`.`E_NA3D`,'+0:00','SYSTEM') AS 'NA3D',
CONVERT_TZ(`E3`.`E_SE3D`,'+0:00','SYSTEM') AS 'SE3D',
CONVERT_TZ(`E3`.`E_PA3D`,'+0:00','SYSTEM') AS 'PA3D',
CONVERT_TZ(`E3`.`E_TI2D`,'+0:00','SYSTEM') AS 'TI2D',
CONVERT_TZ(`E3`.`E_NA5D`,'+0:00','SYSTEM') AS 'NA5D',
CONVERT_TZ(`E3`.`E_VI3D`,'+0:00','SYSTEM') AS 'VI3D',
CONVERT_TZ(`E3`.`E_NA4D`,'+0:00','SYSTEM') AS 'NA4D',
CONVERT_TZ(`E3`.`E_PA4D`,'+0:00','SYSTEM') AS 'PA4D',
CONVERT_TZ(`E3`.`E_VI4D`,'+0:00','SYSTEM') AS 'VI4D',
CONVERT_TZ(`E3`.`E_PA5D`,'+0:00','SYSTEM') AS 'PA5D',
CONVERT_TZ(`E3`.`E_NA6D`,'+0:00','SYSTEM') AS 'NA6D',
CONVERT_TZ(`E3`.`E_PA6D`,'+0:00','SYSTEM') AS 'PA6D',
CONVERT_TZ(`E3`.`E_TI3D`,'+0:00','SYSTEM') AS 'TI3D',
CONVERT_TZ(`E3`.`E_ALCD`,'+0:00','SYSTEM') AS 'E_ALCD',
CONVERT_TZ(`E3`.`E_DANGER_QUAL1D`,'+0:00','SYSTEM') AS 'E_DANGER_QUAL1D',
CONVERT_TZ(`E3`.`E_DANGER_QUAL2D`,'+0:00','SYSTEM') AS 'E_DANGER_QUAL2D',
CONVERT_TZ(`E3`.`E_DANGER_QUANT1D`,'+0:00','SYSTEM') AS 'E_DANGER_QUANT1D',
CONVERT_TZ(`E3`.`E_DANGER_QUANT2D`,'+0:00','SYSTEM') AS 'E_DANGER_QUANT2D',
CONVERT_TZ(`E3`.`E_DRUG_RELAX1D`,'+0:00','SYSTEM') AS 'E_DRUG_RELAX1D',
CONVERT_TZ(`E3`.`E_DRUG_RELAX2D`,'+0:00','SYSTEM') AS 'E_DRUG_RELAX2D',
CONVERT_TZ(`E3`.`E_DRUG_STIMU1D`,'+0:00','SYSTEM') AS 'E_DRUG_STIMU1D',
CONVERT_TZ(`E3`.`E_DRUG_STIMU2D`,'+0:00','SYSTEM') AS 'E_DRUG_STIMU2D',
CONVERT_TZ(`E3`.`E_ERRD`,'+0:00','SYSTEM') AS 'E_ERRD',
CONVERT_TZ(`E3`.`E_FORGETD`,'+0:00','SYSTEM') AS 'E_FORGETD',
CONVERT_TZ(`E3`.`E_IRR_E1D`,'+0:00','SYSTEM') AS 'E_IRR_E1D',
CONVERT_TZ(`E3`.`E_IRR_E2D`,'+0:00','SYSTEM') AS 'E_IRR_E2D',
CONVERT_TZ(`E3`.`E_IRR_E3D`,'+0:00','SYSTEM') AS 'E_IRR_E3D',
CONVERT_TZ(`E3`.`E_IRR_E4D`,'+0:00','SYSTEM') AS 'E_IRR_E4D',
CONVERT_TZ(`E3`.`E_IRR_E5D`,'+0:00','SYSTEM') AS 'E_IRR_E5D',
CONVERT_TZ(`E3`.`E_IRR_K1D`,'+0:00','SYSTEM') AS 'E_IRR_K1D',
CONVERT_TZ(`E3`.`E_IRR_K2D`,'+0:00','SYSTEM') AS 'E_IRR_K2D',
CONVERT_TZ(`E3`.`E_IRR_K3D`,'+0:00','SYSTEM') AS 'E_IRR_K3D',
CONVERT_TZ(`E3`.`E_OVERTID`,'+0:00','SYSTEM') AS 'E_OVERTID',
CONVERT_TZ(`E3`.`E_REC_E1D`,'+0:00','SYSTEM') AS 'E_REC_E1D',
CONVERT_TZ(`E3`.`E_REC_E2D`,'+0:00','SYSTEM') AS 'E_REC_E2D',
CONVERT_TZ(`E3`.`E_REC_E3D`,'+0:00','SYSTEM') AS 'E_REC_E3D',
CONVERT_TZ(`E3`.`E_REC_E4D`,'+0:00','SYSTEM') AS 'E_REC_E4D',
CONVERT_TZ(`E3`.`E_REC_M1D`,'+0:00','SYSTEM') AS 'E_REC_M1D',
CONVERT_TZ(`E3`.`E_REC_M2D`,'+0:00','SYSTEM') AS 'E_REC_M2D',
CONVERT_TZ(`E3`.`E_REC_M3D`,'+0:00','SYSTEM') AS 'E_REC_M3D',
CONVERT_TZ(`E3`.`E_REC_M4D`,'+0:00','SYSTEM') AS 'E_REC_M4D',
CONVERT_TZ(`E3`.`E_SMOKD`,'+0:00','SYSTEM') AS 'E_SMOKD',
CONVERT_TZ(`E3`.`E_WORR1ED`,'+0:00','SYSTEM') AS 'E_WORR1ED',
CONVERT_TZ(`E3`.`E_WORR2ED`,'+0:00','SYSTEM') AS 'E_WORR2ED'
FROM `psyc_mutask`.`E3`
order by `device`, `person`, `erstellt` desc;
QUERYE;
break;
			case 'A': $tabBez = 'nach der Arbeit - after work - (Tabelle A3)';
$query = <<<QUERYA
SELECT 
	`A3`.`id`,
	`A3`.`device`,
	`A3`.`person`,
	CONVERT_TZ(`A3`.`tag`,'+0:00','SYSTEM') AS 'tag',
	`A3`.`typ`,
	`A3`.`heuteId`,
	CONVERT_TZ(`A3`.`erstellt`,'+0:00','SYSTEM') AS 'erstellt',
	CONVERT_TZ(`A3`.`fragenErstellt`,'+0:00','SYSTEM') AS 'fragenErstellt',
	`A3`.`A_CONT1`,
	`A3`.`A_CONT2`,
	`A3`.`A_CONT3`,
	`A3`.`A_FULLFI`,
	`A3`.`A_JOBSAT`,
	`A3`.`A_NA1`,
	`A3`.`A_NA2`,
	`A3`.`A_NA3`,
	`A3`.`A_NA4`,
	`A3`.`A_NA5`,
	`A3`.`A_NA6`,
	`A3`.`A_PA2`,
	`A3`.`A_PA3`,
	`A3`.`A_PA4`,
	`A3`.`A_PA5`,
	`A3`.`A_PA6`,
	`A3`.`A_PAVI1`,
	`A3`.`A_QUAL`,
	`A3`.`A_SE1`,
	`A3`.`A_SE2`,
	`A3`.`A_SE3`,
	`A3`.`A_SITCON1`,
	`A3`.`A_SITCON2`,
	`A3`.`A_SITCON3`,
	`A3`.`A_STRAT_INT1`,
	`A3`.`A_STRAT_INT2`,
	`A3`.`A_STRAT_INT3`,
	`A3`.`A_STRAT_INT4`,
	`A3`.`A_SUPPO1`,
	`A3`.`A_SUPPO2`,
	`A3`.`A_TI1`,
	`A3`.`A_TI2`,
	`A3`.`A_TI3`,
	`A3`.`A_TLX1`,
	`A3`.`A_TLX2`,
	`A3`.`A_TLX3`,
	`A3`.`A_TLX4`,
	`A3`.`A_TLX5`,
	`A3`.`A_TLX6`,
	`A3`.`A_TLX7`,
	`A3`.`A_TLX8`,
	`A3`.`A_TPRESS1`,
	`A3`.`A_TPRESS2`,
	`A3`.`A_TPRESS3`,
	`A3`.`A_VI2`,
	`A3`.`A_VI3`,
	`A3`.`A_VI4`,
	`A3`.`A_WD1`,
	`A3`.`A_WD2`,
	`A3`.`A_WD3`,
	`A3`.`A_WD4`,
	`A3`.`A_WD5`,
	`A3`.`A_WEAB1`,
	`A3`.`A_WEAB2`,
	`A3`.`A_WEAB3`,
	`A3`.`A_WEDE1`,
	`A3`.`A_WEDE2`,
	`A3`.`A_WEDE3`,
	`A3`.`A_WEVI1`,
	`A3`.`A_WEVI2`,
	`A3`.`A_WEVI3`,
	`A3`.`A_WORR1`,
	`A3`.`A_WORR2`,
	CONVERT_TZ(`A3`.`A_CONT1D`,'+0:00','SYSTEM') AS 'A_CONT1D',
	CONVERT_TZ(`A3`.`A_CONT2D`,'+0:00','SYSTEM') AS 'A_CONT2D',
	CONVERT_TZ(`A3`.`A_CONT3D`,'+0:00','SYSTEM') AS 'A_CONT3D',
	CONVERT_TZ(`A3`.`A_FULLFID`,'+0:00','SYSTEM') AS 'A_FULLFID',
	CONVERT_TZ(`A3`.`A_JOBSATD`,'+0:00','SYSTEM') AS 'A_JOBSATD',
	CONVERT_TZ(`A3`.`A_NA1D`,'+0:00','SYSTEM') AS 'A_NA1D',
	CONVERT_TZ(`A3`.`A_NA2D`,'+0:00','SYSTEM') AS 'A_NA2D',
	CONVERT_TZ(`A3`.`A_NA3D`,'+0:00','SYSTEM') AS 'A_NA3D',
	CONVERT_TZ(`A3`.`A_NA4D`,'+0:00','SYSTEM') AS 'A_NA4D',
	CONVERT_TZ(`A3`.`A_NA5D`,'+0:00','SYSTEM') AS 'A_NA5D',
	CONVERT_TZ(`A3`.`A_NA6D`,'+0:00','SYSTEM') AS 'A_NA6D',
	CONVERT_TZ(`A3`.`A_PA2D`,'+0:00','SYSTEM') AS 'A_PA2D',
	CONVERT_TZ(`A3`.`A_PA3D`,'+0:00','SYSTEM') AS 'A_PA3D',
	CONVERT_TZ(`A3`.`A_PA4D`,'+0:00','SYSTEM') AS 'A_PA4D',
	CONVERT_TZ(`A3`.`A_PA5D`,'+0:00','SYSTEM') AS 'A_PA5D',
	CONVERT_TZ(`A3`.`A_PA6D`,'+0:00','SYSTEM') AS 'A_PA6D',
	CONVERT_TZ(`A3`.`A_PAVI1D`,'+0:00','SYSTEM') AS 'A_PAVI1D',
	CONVERT_TZ(`A3`.`A_QUALD`,'+0:00','SYSTEM') AS 'A_QUALD',
	CONVERT_TZ(`A3`.`A_SE1D`,'+0:00','SYSTEM') AS 'A_SE1D',
	CONVERT_TZ(`A3`.`A_SE2D`,'+0:00','SYSTEM') AS 'A_SE2D',
	CONVERT_TZ(`A3`.`A_SE3D`,'+0:00','SYSTEM') AS 'A_SE3D',
	CONVERT_TZ(`A3`.`A_SITCON1D`,'+0:00','SYSTEM') AS 'A_SITCON1D',
	CONVERT_TZ(`A3`.`A_SITCON2D`,'+0:00','SYSTEM') AS 'A_SITCON2D',
	CONVERT_TZ(`A3`.`A_SITCON3D`,'+0:00','SYSTEM') AS 'A_SITCON3D',
	CONVERT_TZ(`A3`.`A_STRAT_INT1D`,'+0:00','SYSTEM') AS 'A_STRAT_INT1D',
	CONVERT_TZ(`A3`.`A_STRAT_INT2D`,'+0:00','SYSTEM') AS 'A_STRAT_INT2D',
	CONVERT_TZ(`A3`.`A_STRAT_INT3D`,'+0:00','SYSTEM') AS 'A_STRAT_INT3D',
	CONVERT_TZ(`A3`.`A_STRAT_INT4D`,'+0:00','SYSTEM') AS 'A_STRAT_INT4D',
	CONVERT_TZ(`A3`.`A_SUPPO1D`,'+0:00','SYSTEM') AS 'A_SUPPO1D',
	CONVERT_TZ(`A3`.`A_SUPPO2D`,'+0:00','SYSTEM') AS 'A_SUPPO2D',
	CONVERT_TZ(`A3`.`A_TI1D`,'+0:00','SYSTEM') AS 'A_TI1D',
	CONVERT_TZ(`A3`.`A_TI2D`,'+0:00','SYSTEM') AS 'A_TI2D',
	CONVERT_TZ(`A3`.`A_TI3D`,'+0:00','SYSTEM') AS 'A_TI3D',
	CONVERT_TZ(`A3`.`A_TLX1D`,'+0:00','SYSTEM') AS 'A_TLX1D',
	CONVERT_TZ(`A3`.`A_TLX2D`,'+0:00','SYSTEM') AS 'A_TLX2D',
	CONVERT_TZ(`A3`.`A_TLX3D`,'+0:00','SYSTEM') AS 'A_TLX3D',
	CONVERT_TZ(`A3`.`A_TLX4D`,'+0:00','SYSTEM') AS 'A_TLX4D',
	CONVERT_TZ(`A3`.`A_TLX5D`,'+0:00','SYSTEM') AS 'A_TLX5D',
	CONVERT_TZ(`A3`.`A_TLX6D`,'+0:00','SYSTEM') AS 'A_TLX6D',
	CONVERT_TZ(`A3`.`A_TLX7D`,'+0:00','SYSTEM') AS 'A_TLX7D',
	CONVERT_TZ(`A3`.`A_TLX8D`,'+0:00','SYSTEM') AS 'A_TLX8D',
	CONVERT_TZ(`A3`.`A_TPRESS1D`,'+0:00','SYSTEM') AS 'A_TPRESS1D',
	CONVERT_TZ(`A3`.`A_TPRESS2D`,'+0:00','SYSTEM') AS 'A_TPRESS2D',
	CONVERT_TZ(`A3`.`A_TPRESS3D`,'+0:00','SYSTEM') AS 'A_TPRESS3D',
	CONVERT_TZ(`A3`.`A_VI2D`,'+0:00','SYSTEM') AS 'A_VI2D',
	CONVERT_TZ(`A3`.`A_VI3D`,'+0:00','SYSTEM') AS 'A_VI3D',
	CONVERT_TZ(`A3`.`A_VI4D`,'+0:00','SYSTEM') AS 'A_VI4D',
	CONVERT_TZ(`A3`.`A_WD1D`,'+0:00','SYSTEM') AS 'A_WD1D',
	CONVERT_TZ(`A3`.`A_WD2D`,'+0:00','SYSTEM') AS 'A_WD2D',
	CONVERT_TZ(`A3`.`A_WD3D`,'+0:00','SYSTEM') AS 'A_WD3D',
	CONVERT_TZ(`A3`.`A_WD4D`,'+0:00','SYSTEM') AS 'A_WD4D',
	CONVERT_TZ(`A3`.`A_WD5D`,'+0:00','SYSTEM') AS 'A_WD5D',
	CONVERT_TZ(`A3`.`A_WEAB1D`,'+0:00','SYSTEM') AS 'A_WEAB1D',
	CONVERT_TZ(`A3`.`A_WEAB2D`,'+0:00','SYSTEM') AS 'A_WEAB2D',
	CONVERT_TZ(`A3`.`A_WEAB3D`,'+0:00','SYSTEM') AS 'A_WEAB3D',
	CONVERT_TZ(`A3`.`A_WEDE1D`,'+0:00','SYSTEM') AS 'A_WEDE1D',
	CONVERT_TZ(`A3`.`A_WEDE2D`,'+0:00','SYSTEM') AS 'A_WEDE2D',
	CONVERT_TZ(`A3`.`A_WEDE3D`,'+0:00','SYSTEM') AS 'A_WEDE3D',
	CONVERT_TZ(`A3`.`A_WEVI1D`,'+0:00','SYSTEM') AS 'A_WEVI1D',
	CONVERT_TZ(`A3`.`A_WEVI2D`,'+0:00','SYSTEM') AS 'A_WEVI2D',
	CONVERT_TZ(`A3`.`A_WEVI3D`,'+0:00','SYSTEM') AS 'A_WEVI3D',
	CONVERT_TZ(`A3`.`A_WORR1D`,'+0:00','SYSTEM') AS 'A_WORR1D',
	CONVERT_TZ(`A3`.`A_WORR2D`,'+0:00','SYSTEM') AS 'A_WORR2D'
FROM `psyc_mutask`.`A3`
order by `device`, `person`, `erstellt` desc;
QUERYA;
break;
			default : return "Die Tabelle $tabName ist nicht bekannt.";
		}
		$ergebnis .= "<h1 name='$tabName'>$tabBez</h1>";
		if ($stmt = $mysqli->prepare($query)) {
			$stmt->execute();

			//Überschriften generieren
			$feldNamen = $stmt->result_metadata()->fetch_fields();
			$ergebnis .= '<table border="1"><thead><tr>';
			foreach($feldNamen as $name) {
				$ergebnis .= "<th>{$name->name}</th>";
			}
			$ergebnis .= '</tr></thead><tbody>';
			$stmt->free_result();

			// alle Einträge anzeigen
			$result = $mysqli->query($query);
			while ($row = $result->fetch_row()) {
				$ergebnis .= '<tr>';
				foreach($row as $td) {
					$ergebnis .= "<td>".(($td != '')?$td:'&nbsp;')."</td>";
				}
				$ergebnis .= '</tr>';
			}
			$ergebnis .= '</tbody></table>';
		};
		return $ergebnis;
	}; // gibAlsHTML
	echo <<<HTML1
<html><head><meta http-equiv="content-type" content="text/html; charset=UTF-8" /></head><body>
<div>Die angezeigten Daten sind hauptsächlich zu Kontrolle gedacht. Die Datenübernahme erfolgt auf anderem Wege besser.</div>
HTML1;


  echo(gibAlsHTML('M'));
	echo(gibAlsHTML('W'));
	echo(gibAlsHTML('A'));
	echo(gibAlsHTML('E'));

	// Log ausgeben
	echo("<h1 name='Log'>Log</h1>");
	$query = "select * from log3 order by dt desc limit ".ANZAHL_DATENSATZE;
	// alle Einträge anzeigen
	$result = $mysqli->query($query);
	while ($row = $result->fetch_row()) {
		echo("<div><strong>{$row[2]}</strong><br/>");
		$o = unserialize($row[1]);
		if (isset($o['log'])) {
			foreach($o['log'] as $eintrag) {
				if (isset($eintrag['msg'])) {
					print("<div><span style='display:inline-block;min-width:10em;'>{$eintrag['dt']}</span> {$eintrag['msg']}");
					if ($eintrag['msg'] == 'setzeAntwort') {
						print($eintrag['data']['kodierung'].' = '.$eintrag['data']['antw'].' &rarr; '.$eintrag['data']['zeit']);
					}
					print("</div>");
				} else {
					print("<div>");
					print_r($eintrag);
					print("</div>");
				}
			}
		} else print_r($o);
	}
	echo('</div>');

	$mysqli->close();
	echo('</body></html>');
?>
