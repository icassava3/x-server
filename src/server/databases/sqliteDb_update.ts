import Logger from "../helpers/logger";

export const sqliteDbUpdate = async (sqliteDB) => {
	try {
		Logger.info("sqliteDbUpdate start")
		//execute les maj de la bd antérieures à 1.0.5

		//***Lire les données de la table historique des mise a jour
		const historics: any = await getHistorics(sqliteDB);

		/**
		 * xsrver v1.1.4 spider-data-v2 créer, copie du contenu de la table photo de la base spider-data vers table photo de la base spider-data v2	
		 * @returns 
		 */
		const copy_spider_data_table_photo_to_spider_data_v2_table_photo = () => {
			return new Promise(async (resolve, reject) => {
				try {
					const version = "1.1.4";
					const action = "copy_spider_data_table_photo_to_spider_data_v2_table_photo";
					const description = "copie du contenu de la table photo de la base spider-data vers table photo de la base spider-data v2"

					if (!historics.find((item) => item.action === action)) {
						const fs = require("fs");
						const DBSOURCE = `C:/SPIDER/server-data/spider-data.db`;
						if (!fs.existsSync(DBSOURCE)) return reject(false)
						const sqlite3 = require("@journeyapps/sqlcipher").verbose();
						//const Logger = require("../helpers/logger");
						const { SQLITE_PWD } = require("./../helpers/constants");

						const sqliteV1DB = new sqlite3.Database(DBSOURCE, async (err: any) => {
							if (err) return console.error(err.message);
							sqliteV1DB.serialize(function () {
								// This is the default, but it is good to specify explicitly:
								//  sqliteDB.run("PRAGMA cipher_compatibility = 4");
								sqliteV1DB.run(`PRAGMA key = ${SQLITE_PWD} `);
								// sqliteDbUpdate(sqliteV1DB);
								sqliteV1DB.all(
									`SELECT * FROM photo`,
									[],
									async function (this: any, error: any, result: any) {
										if (error) return reject(error);
										const photos = result.map(item => Object.values(item))
										//inserer les photos dans la table v2
										const fields = "anneeScolaire,codeEtab,idPriseDeVue,studentId,matricule,nomPrenom,classe,datePhoto,photographerId,photographerName,deviceModel"

										let valuesPlaceholders = photos.map(() => "(?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)").join(', ');
										const sql = `INSERT INTO photo(${fields}) VALUES ${valuesPlaceholders} `;
										let values = [];
										photos.forEach((arr) => { arr.forEach((item) => { values.push(item) }) });
										await sqliteDB.run(sql, values);
										await sqliteDB.run(`INSERT INTO historics_update(action, version) VALUES("copy_spider_data_table_photo_to_spider_data_v2_table_photo", "1.1.4")`);
										sqliteV1DB.close()
										resolve(result);
									}
								);
							});
							console.info("Sucessfully connected to the SQlite v1 database!");
						});
					}

					resolve(true)
				} catch (error) {
					console.log("🚀 ~ file: sqliteDb_update.ts ~ line 416 ~ returnnewPromise ~ error", error)
					reject(error);
				}
			});
		}
		await copy_spider_data_table_photo_to_spider_data_v2_table_photo();





		/**
		 * recréer la table pointage pour formater les dates au format js
		 * @returns 
		 */
		const createTablePointage = () => {
			return new Promise(async (resolve, reject) => {
				try {
					const version = "1.1.5";
					const action = "create_table_pointage";
					if (!historics.find((item) => item.action === action)) {
						sqliteDB.serialize(function () {
							sqliteDB.run("DROP TRIGGER IF EXISTS update_pointage_eleve_updatetime;");
							sqliteDB.run("DROP TABLE IF EXISTS pointage_eleve;");
							sqliteDB.run(`CREATE TABLE IF NOT EXISTS  "pointage"(
			"idPointage"	INTEGER NOT NULL,
			"idActivite"	INTEGER NOT NULL,
			"idPersonne"	INTEGER NOT NULL,
			"codeEtab"	TEXT NOT NULL,
			"anneeScolaire"	TEXT NOT NULL,
			"operateur"	TEXT NOT NULL,
			"datePointage"	DATETIME NOT NULL,
			"createdatetime"	TEXT DEFAULT(strftime('%Y-%m-%dT%H:%M:%fZ')),
			FOREIGN KEY("idActivite") REFERENCES "_activite_school_control"("idActivite"),
			PRIMARY KEY("idPointage" AUTOINCREMENT)
		); `);
							sqliteDB.run(`INSERT INTO historics_update(action, version) VALUES("${action}", "${version}")`);
						});
					}
					resolve(true)
				} catch (error) {
					console.log("🚀 ~ file: sqliteDb_update.ts ~ line 433 ~ returnnewPromise ~ error", error)
					reject(error);
				}
			});
		}
		await createTablePointage();

		/**
		 * Ajouter des colonne supplementaire a la table appel
		 * supprimer recreer la table appel pour maj les données des données nouvelle colonne
		 * maj les données de la table assiduite
		 */
		const alterTableAppelAssiduite = () => {
			return new Promise(async (resolve, reject) => {

				try {
					const version = "1.1.5";
					const action = "alter_update_table_appel_assiduite";
					if (!historics.find((item) => item.action === action)) {
						const moment = require("moment");
						const _ = require("lodash");
						const { chunksArray } = require('./../helpers/function');
						sqliteDB.serialize(async function () {
							await addColumn(sqliteDB, "appel", "plageHoraire", "TEXT NULL", version);
							await addColumn(sqliteDB, "appel", "libelleMatiereCourt", "TEXT NULL", version);
							await addColumn(sqliteDB, "appel", "libelleMatiereLong", "TEXT NULL", version);
							await addColumn(sqliteDB, "appel", "dateSaisie", "date NULL", version);
							await addColumn(sqliteDB, "appel", "operateurSaisie", "TEXT NULL", version);
							await addColumn(sqliteDB, "appel", "device", "TEXT NULL", version);
							await addColumn(sqliteDB, "appel", "createdAt", "DATETIME NULL", version);
							await addColumn(sqliteDB, "appel", "updatedAt", "DATETIME NULL", version);

							await addColumn(sqliteDB, "assiduite", "createdAt", "DATETIME NULL", version);
							await addColumn(sqliteDB, "assiduite", "updatedAt", "DATETIME NULL", version);


							await sqliteDB.all("SELECT * FROM appel", [], async (error: any, rows: any) => {
								if (error) return reject(error);

								const appels = rows;
								if (appels.length) { //s'il existe des appel deja effectué en local
									const { appCnx, fetchFromMsAccess } = require('./accessDB');
									const { merge2ArraysOfObjects } = require("../helpers/function");

									//recupperer le planning 
									const sql = `SELECT DISTINCT horaire_plage_modele.RefHoraire AS idHoraire, classe_matieres_prof_eval.refClasse AS idClasse, classe_matieres_prof_eval.refMat AS idMatiere,
			Personnel.RefPersonnel AS idPersonnel, Seances.RefSeance AS idSeance, classe_matieres_prof_eval.ClasseCourt AS libelleClasseCourt, horaire_plage_modele.Horaire AS libelleHoraire,
				classe_matieres_prof_eval.matCourt AS libelleMatiereCourt, classe_matieres_prof_eval.matLong AS libelleMatiereLong,
					Personnel.NomPers AS nomPersonnel, Personnel.PrénomPers AS prenomPersonnel, horaire_plage_modele.PlageHoraire AS plageHoraire,
						Personnel.Sexe AS sexe, Salles.NomSalle AS libelleSalle, Salles.RefSalle AS idSalle
		FROM(((Seances LEFT JOIN Personnel ON Seances.RefPers = Personnel.RefPersonnel) LEFT JOIN Salles ON Seances.RefSalle = Salles.RefSalle)
									INNER JOIN classe_matieres_prof_eval ON(Seances.RefPers = classe_matieres_prof_eval.refPers) AND(Seances.RefClasse = classe_matieres_prof_eval.refClasse)
		AND(Seances.RefMatière = classe_matieres_prof_eval.refMat)) INNER JOIN horaire_plage_modele
		ON(Seances.idModelePlageHoraire = horaire_plage_modele.idModelePlageHoraire) AND(Seances.RefHoraire = horaire_plage_modele.RefHoraire)`;
									const resultPlanning = await fetchFromMsAccess(sql, appCnx);

									const appelPlanningMerged = merge2ArraysOfObjects(appels, resultPlanning, "idSeance");
									const empty = appelPlanningMerged.filter(item => !item.idSeance)

									//supprimer les appels
									await sqliteDB.all("DELETE FROM appel");

									//INSERTION DES APPELS
									const appelsValues = appelPlanningMerged.filter(item => item.plageHoraire && item.idSeance)
										.map(item => ([
											item.anneeScolaire,
											item.codeEtab,
											item.idSeance,
											new Date(item.dateAppel).toISOString().substring(0, 10),
											item.idClasse,
											item.idPersonnel,
											item.plageHoraire,
											item.libelleMatiereCourt,
											item.libelleMatiereLong,
											new Date(item.dateAppel).toISOString().substring(0, 10),
											`${item.nomPersonnel} ${item.prenomPersonnel} `,
											"mobile",
											1,
											item.status,
											`${moment(item.dateAppel).format("YYYY-MM-DD")} ${item.plageHoraire.substring(0, 5)}:00`,
											`${moment(item.dateAppel).format("YYYY-MM-DD")} ${item.plageHoraire.substring(0, 5)}:00`
										]))

									const fieldsAppel = `anneeScolaire, codeEtab, idSeance, dateAppel, idClasse, idPersonnel, plageHoraire, libelleMatiereCourt,
			libelleMatiereLong, dateSaisie, operateurSaisie, device, recup, status, createdAt, updatedAt`;
									const appelValuesChunks = chunksArray(appelsValues, 450);

									appelValuesChunks.map(async chunkItem => {
										const appelsPlaceholders = chunkItem.map(() => "(?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?)").join(', ');
										const sqlAppel = `REPLACE INTO appel(${fieldsAppel}) VALUES ${appelsPlaceholders} `;
										let appelsVals = [];
										chunkItem.forEach((arr) => { arr.forEach((item) => { appelsVals.push(item) }) });
										await sqliteDB.run(sqlAppel, appelsVals);
									})
								}
							});

							await sqliteDB.all("SELECT * FROM assiduite", [], async (error: any, rows: any) => {
								if (error) return reject(error);
								if (rows.length) {

									//supprimer les assisuite
									await sqliteDB.all("DELETE FROM assiduite");

									const assiduites = rows.map(item => ({
										...item,
										dateAppel: new Date(item.dateAppel).toISOString().substring(0, 10),
										dateSaisie: new Date(item.dateSaisie).toISOString().substring(0, 10),
										dateModif: new Date(item.dateModif).toISOString().substring(0, 10),
									}));
									let assiduitesArray = [];
									assiduites.map(item => {
										if (assiduitesArray.findIndex(el => el.idEleve === item.idEleve && el.idSeance === item.idSeance && el.dateAppel === item.dateAppel) < 0) {
											assiduitesArray.push(item)
										}
									})

									const assiduitesValues = assiduitesArray.map(item => [
										item.anneeScolaire,
										item.codeEtab,
										item.idEleve,
										item.idSeance,
										new Date(item.dateAppel).toISOString().substring(0, 10),
										item.plageHoraire,
										item.libelleMatiereCourt,
										item.libelleMatiereLong,
										item.status,
										new Date(item.dateSaisie).toISOString().substring(0, 10),
										item.operateurSaisie,
										new Date(item.dateModif).toISOString().substring(0, 10),
										item.operateurModif,
										item.recup,
										item.device,
										item.idClasse,
										item.idPersonnel,
										item.motif,
										item.justifie,
										item.fcm_messageId,
										item.fcm_send_status,
										item.fcm_date_lecture,
										item.sms_messageId,
										item.sms_send_status,
										`${moment(item.dateAppel).format("YYYY-MM-DD")} ${item.plageHoraire.substring(0, 5)}:00`,
										`${moment(item.dateAppel).format("YYYY-MM-DD")} ${item.plageHoraire.substring(0, 5)}:00`
									]);

									const assiduitesValuesChunks = chunksArray(assiduitesValues, 450);
									const fields = `anneeScolaire, codeEtab, idEleve, idSeance, dateAppel, plageHoraire,
			libelleMatiereCourt, libelleMatiereLong, status, dateSaisie, operateurSaisie, dateModif, operateurModif,
			recup, device, idClasse, idPersonnel, motif, justifie, fcm_messageId, fcm_send_status, fcm_date_lecture, sms_messageId, sms_send_status, createdAt, updatedAt`
									assiduitesValuesChunks.map(async item => {
										let valuesPlaceholders = item.map(() => "(?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?,?,?,?)").join(', ');
										const sqlAssiduite = `INSERT INTO assiduite(${fields}) VALUES ${valuesPlaceholders} `;
										let values = [];
										item.forEach((arr) => { arr.forEach((item2) => { values.push(item2) }) });
										await sqliteDB.run(sqlAssiduite, values);
									})
								}
							});

							sqliteDB.run(`INSERT INTO historics_update(action, version) VALUES("${action}", "${version}")`);

						});
					}
					resolve(true);
				} catch (error) {
					console.log("🚀 ~ file: sqliteDb_update.ts:484 ~ returnnewPromise ~ error", error)
					reject(error);
				}
			});
		}
		await alterTableAppelAssiduite();

		/**
		 * remplacer les appels et assiduités en local par les appels et assiduité en ligne
		 * @returns 
		 */
		const create_table_modele_rapport = () => {
			return new Promise(async (resolve, reject) => {
				try {
					const version = "1.1.6";
					const action = "create_table_modele_rapport";

					if (!historics.find((item) => item.action === action)) {

						sqliteDB.serialize(function () {

							sqliteDB.run(`CREATE TABLE IF NOT EXISTS _modele_rapport(
				idModeleRapport TEXT NULL,
				libelleModeleRapport TEXT NULL,
				planModeleRapport JSON NULL,
				status INTEGER NULL,
				revision INTEGER NULL,
				createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
				updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
				PRIMARY KEY("idModeleRapport"))`);

							sqliteDB.run(`
											CREATE TABLE IF NOT EXISTS rapport(
					"idRapport"	INTEGER NOT NULL,
					"idModeleRapport"	TEXT NOT NULL,
					"rapportData"	JSON NOT NULL DEFAULT '[]',
					"anneeScolaire"	TEXT NOT NULL,
					"codeEtab"	TEXT NOT NULL,
					"libelleRapport"	TEXT NOT NULL,
					"status"	INTEGER NOT NULL DEFAULT 0,
					createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
					updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
					PRIMARY KEY("idRapport"),
					FOREIGN KEY("idModeleRapport") REFERENCES "_modele_rapport"("idModeleRapport"))
								`);

							sqliteDB.run(`INSERT INTO historics_update(action, version) VALUES("${action}", "${version}")`);
						});

					}
					resolve(true)
				} catch (error) {
					console.log("🚀 ~ file: sqliteDb_update.ts ~ line 433 ~ returnnewPromise ~ error", error)
					reject(error);
				}
			});
		}

		await create_table_modele_rapport();

		const create_table_http_fails_logs = () => {
			return new Promise(async (resolve, reject) => {
				try {
					const version = "1.1.6";
					const action = "create_table_http_fails_logs";
					if (!historics.find((item) => item.action === action)) {
						sqliteDB.serialize(function () {
							sqliteDB.run(`
								CREATE TABLE IF NOT EXISTS http_fails_logs(
						"id" INTEGER,
						"anneeScolaire"	TEXT NOT NULL,
						"codeEtab" TEXT NOT NULL,
						"service" TEXT NOT NULL,
						"action" TEXT NOT NULL,
						"payload" JSON,
						"statut" INTEGER NOT NULL DEFAULT 0,
						"created_at" TEXT DEFAULT(strftime('%Y-%m-%dT%H:%M:%fZ')),
						PRIMARY KEY("id"))`);
							sqliteDB.run(`INSERT INTO historics_update(action, version) VALUES("${action}", "${version}")`);
						});
					}
					resolve(true)
				} catch (error) {
					console.log("🚀 ~ file: sqliteDb_update.ts ~ line 433 ~ returnnewPromise ~ error", error)
					reject(error);
				}
			});
		}
		await create_table_http_fails_logs();




		const delete_table_http_fails_logss_create_table_http_fails_logs = () => {
			return new Promise(async (resolve, reject) => {
				try {
					const version = "2.1.1";
					const action = "delete_table_http_fails_logss_create_table_http_fails_logs";
					if (!historics.find((item) => item.action === action)) {
						await sqliteDB.run("DROP TABLE IF EXISTS http_fails_logss;");
						sqliteDB.serialize(function () {
							sqliteDB.run(`
								CREATE TABLE IF NOT EXISTS http_fails_logs(
							"id" INTEGER,
							"anneeScolaire"	TEXT NOT NULL,
							"codeEtab" TEXT NOT NULL,
							"service" TEXT NOT NULL,
							"action" TEXT NOT NULL,
							"payload" JSON,
							"statut" INTEGER NOT NULL DEFAULT 0,
							"created_at" TEXT DEFAULT(strftime('%Y-%m-%dT%H:%M:%fZ')),
							PRIMARY KEY("id"))`);
						});
						sqliteDB.run(`INSERT INTO historics_update(action, version) VALUES("${action}", "${version}")`);
					}
					resolve(true)
				} catch (error) {
					console.log("🚀 ~ file: sqliteDb_update.ts:387 ~ returnnewPromise ~ error:", error)
					reject(error);
				}
			});
		}

		await delete_table_http_fails_logss_create_table_http_fails_logs();

		//Vider les tables profexperlogs, warehouselogs et cinetpaylogs
		const empty_logs_table = () => {
			return new Promise(async (resolve, reject) => {
				try {
					const version = "1.1.4";
					const action = "empty_logs_table";

					if (!historics.find((item) => item.action === action)) {
						await sqliteDB.run('DELETE FROM cinetpay_logs');
						await sqliteDB.run('DELETE FROM prof_expert_logs');
						await sqliteDB.run('DELETE FROM warehouse_logs');
						sqliteDB.run(`INSERT INTO historics_update(action, version) VALUES("${action}", "${version}")`);
					}
					resolve(true)
				} catch (error) {
					console.log("🚀 ~ file: sqliteDb_update.ts ~ line 433 ~ returnnewPromise ~ error", error)
					reject(error);
				}
			});
		}
		await empty_logs_table();

		/**
		 * Supprimer et recréer la table rapport
		 * @returns 
		 */
		const recreateTableRapport = () => {
			return new Promise(async (resolve, reject) => {
				try {
					const version = "1.1.7";
					const action = "create_table_rapport_corrige";

					if (!historics.find((item) => item.action === action)) {
						sqliteDB.serialize(function () {
							sqliteDB.run("DROP TABLE IF EXISTS rapport;");
							sqliteDB.run(`
							CREATE TABLE "rapport"(
								"anneeScolaire"	TEXT NOT NULL,
								"codeEtab"	TEXT NOT NULL,
								"idRapport"	INTEGER NOT NULL,
								"idModeleRapport"	TEXT NOT NULL,
								"rapportData"	JSON NOT NULL DEFAULT '[]',
								"libelleRapport"	TEXT NOT NULL,
								"revisionModeleRapport"	INTEGER NOT NULL DEFAULT 0,
								"status"	INTEGER NOT NULL DEFAULT 0,
								"createdAt"	DATETIME DEFAULT(strftime('%Y-%m-%dT%H:%M:%fZ')),
								"updatedAt"	DATETIME DEFAULT(strftime('%Y-%m-%dT%H:%M:%fZ')),
								FOREIGN KEY("idModeleRapport") REFERENCES "_modele_rapport"("idModeleRapport"),
								PRIMARY KEY("idRapport"));
		`);
							sqliteDB.run(`INSERT INTO historics_update(action, version) VALUES("${action}", "${version}")`);
						});
					}
					resolve(true);
				} catch (error) {
					console.log("🚀 ~ file: sqliteDb_update.ts:522 ~ returnnewPromise ~ error", error)
					reject(error);
				}
			});
		}
		await recreateTableRapport();


		/**
		 * mettre a jour les modeles rapports a partir du fichier json
		 * @returns 
		 */
		// const updateMolelesRapportFromJsonFile = async () => {
		// 	return new Promise(async (resolve, reject) => {
		// 		try {
		// 			try {
		// 				await servicesRapport.upateModeleRapport();
		// 			} catch (error) {
		// 				const fs = require("fs/promises");
		// 				const path2 = require("path");
		// 				const modelesRapportPath = process.env.NODE_ENV === "production"
		// 					//@ts-ignore
		// 					? require("path").resolve(process.resourcesPath, 'templates', 'modeles_rapport.json')
		// 					: process.argv.slice(2)[0] === 'sqlite' //si le projet est lancé avec "yarn start-server"
		// 						? require("path").resolve(__dirname, '..', '..', '..', 'templates', 'modeles_rapport.json')
		// 						: require("path").resolve('./', 'templates', 'modeles_rapport.json')

		// 				const modelesRapport: any = await fs.readFile(modelesRapportPath);
		// 				const parsedModelesRapport = JSON.parse(modelesRapport);
		// 				const localModelesRapport: any = await servicesRapport.listemodeleRapport();

		// 				await Promise.all(parsedModelesRapport.map(async (modeleItem: any) => {
		// 					const values = [modeleItem.idModeleRapport, modeleItem.libelleModeleRapport, modeleItem.planModeleRapport, modeleItem.status, modeleItem.revision]
		// 					const sql = `REPLACE INTO _modele_rapport(idModeleRapport, libelleModeleRapport, planModeleRapport, status, revision) VALUES(?,?,?,?,?)`
		// 					const localModeleItem = localModelesRapport.find((elt: any) => elt.idModeleRapport === modeleItem.idModeleRapport)

		// 					//si le modele _rapport n'existe pas deja en ligne ou sil existe mais la revision est inferieur a son equivalent en ligne
		// 					if (!localModeleItem || (localModeleItem && modeleItem.revision > localModeleItem?.revision)) {
		// 						 sqliteDB.run(sql, [...values])

		// 						// sqliteDB.run(`INSERT INTO historics_update(action, version) VALUES("${action}", "${version}")`);
		// 					}

		// 				}))
		// 			}

		// 			resolve(true)

		// 			//Recupérer les modèles de rapport en ligne
		// 			//Si succès => listeModelesRapport=data
		// 			//Sinon on recupere les données à partir du fichier modeles_rapport.json

		// 			//Recupérer en local la liste des modèles de rapport


		// 			//Parcourir listeModelesRapport et rechercher item.idModeleRapport dans la liste locale
		// 			//Si non trouvé => Insérer
		// 			//Si trouvé => comparer item.revision
		// 			//Si identique ignorer
		// 			//Sinon replace

		// 		} catch (error) {
		// 			console.log("🚀 ~ file: sqliteDb_update.ts:411 ~ returnnewPromise ~ error", error)
		// 			reject(error);
		// 		}
		// 	});
		// };
		// await updateMolelesRapportFromJsonFile()

		/**
		 * creer la table assiduite_tmp
		 * @returns 
		 */
		const createTableAssiduiteTmp = () => {
			return new Promise(async (resolve, reject) => {
				try {
					const version = "1.2.0";
					const action = "create_table_assiduite_tmp";

					if (!historics.find((item) => item.action === action)) {
						sqliteDB.serialize(function () {
							sqliteDB.run(`
								CREATE TABLE IF NOT EXISTS "assiduite_tmp"(
			"sessionID"	TEXT NOT NULL,
			"anneeScolaire"	TEXT NOT NULL,
			"codeEtab"	TEXT NOT NULL,
			"idEleve"	INTEGER NOT NULL,
			"idSeance"	INTEGER NOT NULL,
			"dateAppel"	DATE NOT NULL,
			"plageHoraire"	TEXT,
			"libelleMatiereCourt"	TEXT,
			"libelleMatiereLong"	TEXT,
			"status"	INTEGER,
			"dateSaisie"	DATETIME,
			"operateurSaisie"	INTEGER,
			"dateModif"	DATETIME,
			"operateurModif"	INTEGER,
			"recup"	INTEGER,
			"device"	TEXT,
			"idClasse"	INTEGER,
			"idPersonnel"	INTEGER,
			"motif"	TEXT,
			"justifie"	INTEGER,
			"fcm_messageId"	TEXT,
			"fcm_send_status"	INTEGER,
			"fcm_date_lecture"	DATETIME,
			"sms_messageId"	TEXT,
			"sms_send_status"	INTEGER,
			"createdAt"	DATETIME,
			"updatedAt"	DATETIME,
			UNIQUE("sessionID", "idEleve", "dateAppel", "idSeance", "anneeScolaire", "codeEtab")
		);
		`);
							sqliteDB.run(`INSERT INTO historics_update(action, version) VALUES("${action}", "${version}")`);
						});
					}
					resolve(true);
				} catch (error) {
					console.log("🚀 ~ file: sqliteDb_update.ts:522 ~ returnnewPromise ~ error", error)
					reject(error);
				}
			});
		}
		await createTableAssiduiteTmp();


		//Creer la table messages_apps et messages_sms
		const createTableMessagesAppsMessagesSms = () => {
			return new Promise(async (resolve, reject) => {
				try {
					const version = "1.2.7";
					const action = "create_table_messages_apps_and_messages_sms";

					if (!historics.find((item) => item.action === action)) {
						sqliteDB.serialize(function () {
							sqliteDB.run("DROP TABLE IF EXISTS messages_apps;");
							sqliteDB.run("DROP TABLE IF EXISTS messages_sms;");
							sqliteDB.run(`
							CREATE TABLE "messages_apps"(
							"anneeScolaire"	TEXT NOT NULL,
							"codeEtab"	TEXT NOT NULL,
							"messageId"	INTEGER NOT NULL,
							"sessionId"	TEXT NOT NULL,
							"studentId"	INTEGER NOT NULL,
							"targetAppId"	TEXT NOT NULL,
							"phone"	TEXT NOT NULL,
							"messageTitle"	TEXT NOT NULL,
							"messageContent"	TEXT NOT NULL,
							"alertLevel"	TEXT NOT NULL,
							"messageLocked"	INTEGER NOT NULL DEFAULT 0,
							"messageArchived"	INTEGER NOT NULL DEFAULT 0,
							"messageDeleted"	INTEGER NOT NULL DEFAULT 0,
							"fcmMessageId"	TEXT,
							"sentAt"	DATETIME,
							"createdAt"	DATETIME NOT NULL,
							PRIMARY KEY("messageId" AUTOINCREMENT),
							UNIQUE("anneeScolaire", "codeEtab", "messageId")
						); `);
							sqliteDB.run(`
							CREATE TABLE "messages_sms"(
								"anneeScolaire"	TEXT NOT NULL,
								"codeEtab"	TEXT NOT NULL,
								"smsId"	INTEGER NOT NULL,
								"sessionId"	TEXT NOT NULL,
								"providerId"	INTEGER,
								"transactionId"	TEXT,
								"studentId"	INTEGER NOT NULL,
								"phone"	TEXT NOT NULL,
								"smsContent"	TEXT NOT NULL,
								"smsLocked"	INTEGER NOT NULL DEFAULT 0,
								"smsArchived"	INTEGER NOT NULL DEFAULT 0,
								"smsDeleted"	INTEGER NOT NULL DEFAULT 0,
								"sentAt"	DATETIME,
								"createdAt"	DATETIME NOT NULL,
								UNIQUE("anneeScolaire", "codeEtab", "smsId"),
								PRIMARY KEY("smsId" AUTOINCREMENT)
							); `);
							sqliteDB.run(`INSERT INTO historics_update(action, version) VALUES("${action}", "${version}")`);
						});
					}
					resolve(true);
				} catch (error) {
					console.log("🚀 ~ file: sqliteDb_update.ts:522 ~ returnnewPromise ~ error", error)
					reject(error);
				}
			});
		}
		await createTableMessagesAppsMessagesSms();

		/**
		 * Creer les tables liée a l'application school control (_type_activite_school_control,_activite_school_control,pointage_config,pointage)
		*/
		const createSchoolControlTable = () => {
			return new Promise(async (resolve, reject) => {
				try {
					const version = "2.0.0";
					const action = "recreate_school_control_tables";
					if (historics.find((item) => item.action === action)) return resolve(true)

					sqliteDB.serialize(async function () {


						//supprimmer les tables lié a schooControl
						// suppression des tables0
						sqliteDB.run(`DROP TABLE IF EXISTS pointage_config;`)
						sqliteDB.run(`DROP TABLE IF EXISTS pointage;`)
						sqliteDB.run(`DROP TABLE IF EXISTS schoolcontrol_activities_config;`)
						sqliteDB.run(`DROP TABLE IF EXISTS _activite_school_control;`)
						sqliteDB.run(`DROP TABLE IF EXISTS _type_activite_school_control;`)

						// _type_activite_school_control
						// sqliteDB.run(`ALTER TABLE _type_activite_school_control RENAME TO _type_activite_school_control0;`)

						sqliteDB.run(`CREATE TABLE IF NOT EXISTS _type_activite_school_control (
																			"idTypeActiviteSchoolControl"	TEXT,
																			"libelleTypeActiviteSchoolControl"	TEXT,
																			"descriptionTypeActiviteSchoolControl"	TEXT,
																			PRIMARY KEY("idTypeActiviteSchoolControl")
																		);`);

						//insert type activite_school_control 
						const jsonDataTypeActiviteSchoolControl = [
							{
								"idTypeActiviteSchoolControl": "TASC01",
								"libelleTypeActiviteSchoolControl": "Pointage",
								"descriptionTypeActiviteSchoolControl": "Un pointage marque la présence de l'individu pour l'activité.",
							},
							{
								"idTypeActiviteSchoolControl": "TASC02",
								"libelleTypeActiviteSchoolControl": "Contrôle",
								"descriptionTypeActiviteSchoolControl": "Le contrôle permet de donner ou refuser l'accès à une activité",
							}
						]

						const fieldsTypeActiviteSchoolControl = `idTypeActiviteSchoolControl,libelleTypeActiviteSchoolControl,descriptionTypeActiviteSchoolControl`;

						const dataTypeActiviteSchoolControl = jsonDataTypeActiviteSchoolControl.map(item => [

							item.idTypeActiviteSchoolControl,
							item.libelleTypeActiviteSchoolControl,
							item.descriptionTypeActiviteSchoolControl,
						]);

						let placeholderTypeActiviteSchoolControl = dataTypeActiviteSchoolControl.map(() => "(?, ?, ?)").join(', ');
						const sqlTypeActiviteSchoolControl = `INSERT INTO _type_activite_school_control(${fieldsTypeActiviteSchoolControl}) VALUES ${placeholderTypeActiviteSchoolControl} `;
						let valuesTypeActiviteSchoolControl = [];
						dataTypeActiviteSchoolControl.forEach((arr) => { arr.forEach((item) => { valuesTypeActiviteSchoolControl.push(item) }) });
						sqliteDB.run(sqlTypeActiviteSchoolControl, valuesTypeActiviteSchoolControl);


						// // _activite_school_control
						// sqliteDB.run(`ALTER TABLE _activite_school_control RENAME TO _activite_school_control0;`);

						sqliteDB.run(`
							CREATE TABLE IF NOT EXISTS "_activite_school_control" (
								"idActivite"	TEXT,
								"libelleActivite"	TEXT,
								"descriptionActivite"	TEXT,
								"idTypeActiviteSchoolControl"	TEXT,
								"iconActivite"	TEXT,
								PRIMARY KEY("idActivite")
								FOREIGN KEY("idTypeActiviteSchoolControl") REFERENCES "_type_activite_school_control"("idTypeActiviteSchoolControl")
							);`);


						// //insert activite_school_control 
						const jsonDataActiviteSchoolControl = [
							{
								"descriptionActivite": "Cette activité permet d'enregistrer les entrées et sorties des apprenants à l'établissement.",
								"iconActivite": "compare-arrows",
								"idActivite": "ASC001",
								"idTypeActiviteSchoolControl": "TASC01",
								"libelleActivite": "Pointage des entrées et sorties des apprenants à l'établissement"
							},
							{
								"descriptionActivite": "Cette activité permet d'enregistrer l'accès des apprenants à la cantine scolaire",
								"iconActivite": "fastfood",
								"idActivite": "ASC002",
								"idTypeActiviteSchoolControl": "TASC01",
								"libelleActivite": "Pointage d'accès à la cantine"
							},
							{
								"descriptionActivite": "Cette activité permet d'enregistrer l'accès des apprenants au car scolaire",
								"iconActivite": "directions-bus",
								"idActivite": "ASC003",
								"idTypeActiviteSchoolControl": "TASC01",
								"libelleActivite": "Pointage d'accès au car"
							},
							{
								"descriptionActivite": "Cette activité permet d'enregistrer l'arrivée et le départ du personnel de l'établissement.",
								"iconActivite": "people",
								"idActivite": "ASC004",
								"idTypeActiviteSchoolControl": "TASC01",
								"libelleActivite": "Pointage d'arrivée et départ du personnel"
							},
							{
								"descriptionActivite": "Cette activité permet de verifier l'état du solde des frais scolaires obligatoires.",
								"iconActivite": "school",
								"idActivite": "ASC005",
								"idTypeActiviteSchoolControl": "TASC02",
								"libelleActivite": "Contrôle des frais scolaires"
							},
							{
								"descriptionActivite": "Cette activité permet de verifier l'état du solde des frais de cantine",
								"iconActivite": "fastfood",
								"idActivite": "ASC006",
								"idTypeActiviteSchoolControl": "TASC02",
								"libelleActivite": "Contrôle d'accès à la cantine"
							},
							{
								"descriptionActivite": "Cette activité permet de verifier l'état du solde des frais de transport",
								"iconActivite": "directions-bus",
								"idActivite": "ASC007",
								"idTypeActiviteSchoolControl": "TASC02",
								"libelleActivite": "Contrôle d'accès transport"
							},
						];

						const fieldsActiviteSchoolControl = `idActivite,libelleActivite,descriptionActivite,idTypeActiviteSchoolControl,iconActivite`;

						const dataActiviteSchoolControl = jsonDataActiviteSchoolControl.map(item => [
							item.idActivite,
							item.libelleActivite,
							item.descriptionActivite,
							item.idTypeActiviteSchoolControl,
							item.iconActivite
						]);
						console.log("--------------------")
						let placeholderActiviteSchoolControl = dataActiviteSchoolControl.map(() => "(?, ?, ?, ?, ?)").join(', ');
						const sqlActiviteSchoolControl = `INSERT INTO _activite_school_control(${fieldsActiviteSchoolControl}) VALUES ${placeholderActiviteSchoolControl} `;
						let valuesActiviteSchoolControl = [];
						dataActiviteSchoolControl.forEach((arr) => { arr.forEach((item) => { valuesActiviteSchoolControl.push(item) }) });
						sqliteDB.run(sqlActiviteSchoolControl, valuesActiviteSchoolControl);


						// pointage_config
						// sqliteDB.run(`ALTER TABLE pointage_config RENAME TO pointage_config0;`);

						// sqliteDB.run(`CREATE TABLE IF NOT EXISTS pointage_config(
						// 				"codeEtab"	TEXT,
						// 				"anneeScolaire"	TEXT,
						// 				"idActiviteSchoolControl"	TEXT NOT NULL,
						// 				"config"	JSON,
						// 				FOREIGN KEY("idActiviteSchoolControl") REFERENCES "_activite_school_control"("idActivite")
						// 			); `);


						// pointage
						// sqliteDB.run(`ALTER TABLE pointage RENAME TO pointage0;`);

						sqliteDB.run(`CREATE TABLE IF NOT EXISTS pointage(
											"idPointage"	INTEGER NOT NULL,
											"idActivite"	TEXT NOT NULL,
											"idPersonne"	INTEGER NOT NULL,
											"codeEtab"	TEXT NOT NULL,
											"anneeScolaire"	TEXT NOT NULL,
											"idPlage"	INTEGER,
											"operateur"	TEXT NOT NULL,
											"sensAcces"	INTEGER DEFAULT 1,
											"datePointage"	TEXT NOT NULL,
											"createdatetime"	TEXT DEFAULT(strftime('%Y-%m-%dT%H:%M:%fZ')),
											PRIMARY KEY("idPointage" AUTOINCREMENT),
											FOREIGN KEY("idActivite") REFERENCES "_activite_school_control"("idActivite")
										);`);

						// sqliteDB.run(`INSERT INTO pointage (idActivite, idPersonne, codeEtab, anneeScolaire, operateur, datePointage, createdatetime)
						// 				SELECT "ASC00" || idActivite, idPersonne, codeEtab, anneeScolaire, operateur, datePointage, createdatetime
						// 				FROM pointage0
						// 				ORDER BY idPointage;`);

						// return


						// suppression des tables0
						// sqliteDB.run(`DROP TABLE IF EXISTS pointage_config0;`)
						// sqliteDB.run(`DROP TABLE IF EXISTS pointage0;`)
						// sqliteDB.run(`DROP TABLE IF EXISTS _activite_school_control0;`)
						// sqliteDB.run(`DROP TABLE IF EXISTS _type_activite_school_control0;`)

						//creation de la table controle
						sqliteDB.run(`
									CREATE TABLE IF NOT EXISTS controle("idControle"	INTEGER NOT NULL,
									"idActivite"	TEXT NOT NULL,
									"idPersonne"	INTEGER NOT NULL,
									"codeEtab"	TEXT NOT NULL,
									"anneeScolaire"	TEXT NOT NULL,
									"operateur"	TEXT NOT NULL,
									"aJour" INTEGER NOT NULL,
									"accepte" INTEGER NOT NULL,
									"dateControle" TEXT NOT NULL,
									"createdatetime"	TEXT DEFAULT(strftime('%Y-%m-%dT%H:%M:%fZ')),
									PRIMARY KEY("idControle" AUTOINCREMENT),
									FOREIGN KEY("idActivite") REFERENCES "_activite_school_control"("idActivite"))
							`);

						//ajouter colum activiteStatus dans table schoolcontrol_activities_config
						//	await addColumn(sqliteDB, "schoolcontrol_activities_config", "activiteStatus", "INTEGER DEFAULT 1", version);

						//creer la table schoolcontrol_activities_config
						sqliteDB.run(`CREATE TABLE IF NOT EXISTS "schoolcontrol_activities_config" (
								"codeEtab"	TEXT,
								"anneeScolaire"	TEXT,
								"idActivite"	TEXT NOT NULL,
								"config"	JSON,
								"activiteStatus" INTEGER DEFAULT 1,
								FOREIGN KEY("idActivite") REFERENCES "_activite_school_control"("idActivite")
								)`);

						sqliteDB.run(`INSERT INTO historics_update(action, version) VALUES("${action}", "${version}")`);
					});

					resolve(true);
				} catch (error) {
					console.log("🚀 ~ file: sqliteDb_update.ts:522 ~ returnnewPromise ~ error", error)
					reject(error);
				}
			});
		}

		await createSchoolControlTable();


		//inserer school control comme partenaires et ses services
		const insertSchoolControlPartnerServices = () => {
			return new Promise(async (resolve, reject) => {
				try {
					const version = "1.3.0";
					const action = "insert_school_control_partner_services";

					if (!historics.find((item) => item.action === action)) {
						const idPartenaire = "PART_SCHOOL_CONTROL";
						const idService = "SERV_SCHOOL_CONTROL";
						const libelle = "School Control";
						const description = "Cette application vous permet de faire des contrôles d'accès ou des pointages d'élèves ou du personnel, par Qr-Code (et prochainement par reconnaissance faciale)";
						sqliteDB.run(`INSERT INTO partenaires(idPartenaire, libelle) VALUES("${idPartenaire}", "${libelle}")`);
						sqliteDB.run(`INSERT INTO services(idService, idPartenaire, libelle, description, neededKey, config)
						VALUES("${idService}", "${idPartenaire}", "${libelle}", "${description}", 1, "[]")`);
						sqliteDB.run(`INSERT INTO historics_update(action, version) VALUES("${action}", "${version}")`);
					}
					resolve(true)
				} catch (error) {
					console.log("🚀 ~ file: sqliteDb_update.ts ~ line 433 ~ returnnewPromise ~ error", error)
					reject(error);
				}
			});
		}
		await insertSchoolControlPartnerServices();


		//inserer rh control comme partenaires et ses services
		const insertRhControlPartnerServices = () => {
			return new Promise(async (resolve, reject) => {
				try {
					const version = "2.2.14";
					const action = "insert_rh_control_partner_services";

					if (!historics.find((item) => item.action === action)) {
						const idPartenaire = "PART_RH_CONTROL";
						const idService = "SERV_RH_CONTROL";
						const libelle = "Rh Control";
						const description = "Cette activité permet de controler les membres du personnel.";
						sqliteDB.run(`INSERT INTO partenaires(idPartenaire, libelle) VALUES("${idPartenaire}", "${libelle}")`);
						sqliteDB.run(`INSERT INTO services(idService, idPartenaire, libelle, description, neededKey, config)
						VALUES("${idService}", "${idPartenaire}", "${libelle}", "${description}", 1, "[]")`);
						sqliteDB.run(`INSERT INTO historics_update(action, version) VALUES("${action}", "${version}")`);
					}
					resolve(true)
				} catch (error) {
					console.log("🚀 ~ returnnewPromise ~ error:", error)
					reject(error);
				}
			});
		}
		await insertRhControlPartnerServices();


		//inserer les activités de Rh-Control
		const insertRhControlActivities = () => {
			return new Promise(async (resolve, reject) => {
				try {
					const version = "2.2.14";
					const action = "insert_rh_control_activities";

					if (!historics.find((item) => item.action === action)) {
						const idActivite = "ASC008"
						const libelleActivite = "Pointage d'accès à la cantine du personnel"
						const descriptionActivite = "Cette activité permet d'enregistrer l'accès du personnel à la cantine"
						const idTypeActiviteSchoolControl = "TASC01"
						const iconActivite = "fastfood"
						sqliteDB.run(`INSERT INTO _activite_school_control(idActivite,libelleActivite,descriptionActivite,idTypeActiviteSchoolControl,iconActivite)
						 VALUES("${idActivite}", "${libelleActivite}", "${descriptionActivite}", "${idTypeActiviteSchoolControl}", "${iconActivite}")`);
						sqliteDB.run(`INSERT INTO historics_update(action, version) VALUES("${action}", "${version}")`);
					}

					resolve(true)
				} catch (error) {
					console.log("🚀 ~ returnnewPromise ~ error:", error)
					reject(error);
				}
			});
		}
		await insertRhControlActivities();


		//Ajout de la table sms_accounts
		const createTableSmsAccounts = () => {
			return new Promise(async (resolve, reject) => {
				try {
					const version = "2.0.0";
					const action = "create_table_sms_accounts";
					if (historics.find((item) => item.action === action)) return resolve(true)
					const sql = `CREATE TABLE IF NOT EXISTS "sms_accounts" (
						"codeEtab"	TEXT,
						"providerId"	INTEGER,
						"login"	TEXT,
						"password"	TEXT,
						"sender"	TEXT,
						"price"	INTEGER,
						"sendSmsAppel"	INTEGER,
						"defaultAccount"	INTEGER
					)`
					sqliteDB.run(sql);
					sqliteDB.run(`INSERT INTO historics_update(action, version) VALUES("${action}", "${version}")`);
					resolve(true)
				} catch (error) {
					console.log("🚀 ~ file: sqliteDb_update.ts ~ line 433 ~ returnnewPromise ~ error", error)
					reject(error);
				}
			});
		}
		await createTableSmsAccounts();

		//Ajout de la table système _sms_providers
		const createTableSmsProviders = () => {
			return new Promise(async (resolve, reject) => {
				try {
					const version = "2.0.0";
					const action = "create_table_sms_providers";
					if (historics.find((item) => item.action === action)) return resolve(true)
					const sqlCreate = `CREATE TABLE "_sms_providers" (
						"id"	INTEGER,
						"libelle"	TEXT
					)`
					const sqlInsert = `INSERT INTO _sms_providers (id, libelle) VALUES (1, "Symtel"), (3,"Spider websms"), (5,"Akademia"), (6,"Ediattah")`
					sqliteDB.serialize(function () {
						sqliteDB.run(sqlCreate);
						sqliteDB.run(sqlInsert);
						sqliteDB.run(`INSERT INTO historics_update(action, version) VALUES("${action}", "${version}")`);
					})

					resolve(true)
				} catch (error) {
					console.log("🚀 ~ file: sqliteDb_update.ts ~ line 433 ~ returnnewPromise ~ error", error)
					reject(error);
				}
			});
		}
		await createTableSmsProviders();



		//Ajout de cle vbaCredentials dans la table xserver_config
		const addKeyVbaCredentials = () => {
			return new Promise(async (resolve, reject) => {
				try {

					const version = "2.0.0";
					const action = "add_key_vba_credentials";
					if (historics.find((item) => item.action === action)) return resolve(true)

					sqliteDB.serialize(function () {
						sqliteDB.run(`INSERT INTO xserver_config (key, value) VALUES ("vbaCredentials", "")`);
						sqliteDB.run(`INSERT INTO historics_update(action, version) VALUES("${action}", "${version}")`);
					})

					resolve(true)
				} catch (error) {
					console.log("🚀 ~ file: sqliteDb_update.ts ~ line 433 ~ returnnewPromise ~ error", error)
					reject(error);
				}
			});
		}
		await addKeyVbaCredentials();

		//Ajout de cle focusEcoleConfig dans la table xserver_config
		const addKeyFocusEcoleConfig = () => {
			return new Promise(async (resolve, reject) => {
				try {

					const version = "2.0.7";
					const action = "add_key_focus_ecole_config";
					if (historics.find((item) => item.action === action)) return resolve(true)

					sqliteDB.serialize(function () {
						sqliteDB.run(`INSERT INTO xserver_config (key, value) VALUES ("focusEcoleConfig", '[]')`);
						sqliteDB.run(`INSERT INTO historics_update(action, version) VALUES("${action}", "${version}")`);
					})
					resolve(true)
				} catch (error) {
					console.log("🚀 ~ file: sqliteDb_update.ts:995 ~ returnnewPromise ~ error:", error)
					reject(error);
				}
			});
		}
		await addKeyFocusEcoleConfig();


		//Ajout de la table des fournisseurs
		const createTableFournisseurs = () => {
			return new Promise(async (resolve, reject) => {
				try {
					const version = "2.0.9";
					const action = "create_table_fournisseurs";
					if (historics.find((item) => item.action === action)) return resolve(true)
					const sql = `CREATE TABLE IF NOT EXISTS "fournisseurs" (
						"idFournisseur"	TEXT NOT NULL,
						"nomPrenomFournisseur"	TEXT NOT NULL,
						"fonctionFournisseur"	TEXT NOT NULL,
						"cellulaireFournisseur"	TEXT NOT NULL,
						"codeEtab"	TEXT NOT NULL,
						PRIMARY KEY("idFournisseur")
					)`
					sqliteDB.run(sql);
					sqliteDB.run(`INSERT INTO historics_update(action, version) VALUES("${action}", "${version}")`);
					resolve(true)
				} catch (error) {
					reject(error);
				}
			});
		}
		await createTableFournisseurs();


		const reCreateTableMessagesSms = () => {
			return new Promise(async (resolve, reject) => {
				try {
					const version = "2.0.9";
					const action = "recreate_table_messages_sms";
					if (historics.find((item) => item.action === action)) return resolve(true)

					sqliteDB.serialize(function () {
						sqliteDB.run("DROP TABLE IF EXISTS messages_sms;");
						sqliteDB.run(`
							CREATE TABLE "messages_sms" (
								"anneeScolaire"	TEXT NOT NULL,
								"codeEtab"	TEXT NOT NULL,
								"smsId"	INTEGER NOT NULL,
								"sessionId"	TEXT NOT NULL,
								"providerId"	INTEGER,
								"transactionId"	TEXT,
								"idPersonne"	INTEGER NOT NULL,
								"smsDestinataireKey"	TEXT NOT NULL DEFAULT 'parentsEleves',
								"phone"	TEXT NOT NULL,
								"smsContent"	TEXT NOT NULL,
								"smsLocked"	INTEGER NOT NULL DEFAULT 0,
								"smsArchived"	INTEGER NOT NULL DEFAULT 0,
								"smsDeleted"	INTEGER NOT NULL DEFAULT 0,
								"sentAt"	DATETIME,
								"createdAt"	DATETIME NOT NULL,
								PRIMARY KEY("smsId" AUTOINCREMENT),
								UNIQUE("anneeScolaire","codeEtab","smsId")
							) `);
						sqliteDB.run(`INSERT INTO historics_update(action, version) VALUES("${action}", "${version}")`);
					});
					resolve(true);
				} catch (error) {
					console.log("🚀 ~ file: sqliteDb_update.ts:522 ~ returnnewPromise ~ error", error)
					reject(error);
				}
			});
		}
		await reCreateTableMessagesSms();


		//ajouter la colonne sendSmsAfterControl dans la table sms_accounts
		const smsAccountAddColumnSendSmsAfterControl = () => {
			return new Promise(async (resolve, reject) => {
				try {
					const version = "2.1.4";
					const action = "sms_account_add_column_sendsmsaftercontrol";
					if (historics.find((item) => item.action === action)) return resolve(true)
					await addColumn(sqliteDB, "sms_accounts", "sendSmsAfterControl", "INTEGER DEFAULT 0", version);
					sqliteDB.run(`INSERT INTO historics_update(action, version) VALUES("${action}", "${version}")`);
					resolve(true)
				} catch (error) {
					console.log("🚀 ~ file: sqliteDb_update.ts ~ line 433 ~ returnnewPromise ~ error", error)
					reject(error);
				}
			});
		}
		await smsAccountAddColumnSendSmsAfterControl();

		Logger.info("sqliteDbUpdate end")

	} catch (error) {
		console.log("error...", error)
	}
};


/**
 * Récupère la liste des maj déjà effectuées
 * @param sqliteDB 
 * @returns 
 */
const getHistorics = (sqliteDB: any) => {
	return new Promise(async (resolve, reject) => {
		try {
			const sql = `SELECT * FROM historics_update`;
			await sqliteDB.all(sql, [], async (error: any, rows: any) => {
				if (error) reject(error);
				//  console.log("rows....", rows);
				resolve(rows);
			});
		} catch (error) {
			console.log("error....", error);
			reject(error);
		}
	});
};

/***
 * Fonction générique pour vérifier l'existance d'une table.
 */
const checkTableExist = (sqliteDB: any, table: any) => {
	return new Promise(async (resolve, reject) => {
		try {
			const sqlCheck = `SELECT name FROM sqlite_master WHERE type = 'table' AND name = '${table}'; `;

			await sqliteDB.all(sqlCheck, [], (error: any, rows: any) => {
				if (error) reject(error);

				if (rows && rows.length !== 0) {
					resolve(true);
				} else {
					resolve(false);
				}
			});
		} catch (error) {
			console.log("error....", error);
			reject(error);
		}
	});
};

/**
 * Ajoute une colonne à la table passée en paramètre
 * @param sqliteDB 
 * @param table 
 * @param columnName 
 * @param defaultValue 
 * @param version 
 * @returns 
 */
const addColumn = (sqliteDB: any, table: any, columnName: any, defaultValue: any, version: any) => {
	return new Promise(async (resolve, reject) => {
		try {
			const sqlCheck = `SELECT * FROM sqlite_master WHERE type = 'table' and tbl_name = '${table}' and sql like '%${columnName}%'`;
			await sqliteDB.all(sqlCheck, [], async (error: any, rows: any) => {
				if (error) reject(error);
				if (rows && rows.length === 0) {
					await sqliteDB.run(`ALTER TABLE '${table}' ADD COLUMN ${columnName} ${defaultValue}`);
					// await sqliteDB.run(`INSERT INTO historics_update(action, version) VALUES("add_${table}_${columnName}", "${version}")`);
					resolve(true);
				} else {
					resolve(false);
				}
			});
		} catch (error) {
			console.log("error....", error);
			reject(error);
		}
	});
};

/**
 * Enregistre une action de maj et sa version
 * @param sqliteDB 
 * @param action 
 * @param version 
 * @param tag 
 */
const saveHistoUpdate = async (sqliteDB, action, version, tag = "") => {
	await sqliteDB.run(`INSERT INTO historics_update(action, version) VALUES("${action}", "${version}")`);
}

