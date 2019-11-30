import SQLite from "react-native-sqlite-storage";
const geolib = require("geolib");

SQLite.enablePromise(true);

const database_name = "ProfileController.db";
const database_version = "1.0";
const database_displayname = "SQLite React Offline Database";
const database_size = 200000;

export default class Database {
                 initDB() {
                   let db;
                   return new Promise(resolve => {
                 
                     SQLite.openDatabase({ name: "ProfileController.db" })
                       .then(DB => {
                         db = DB;
                       
                         db.transaction(tx => {
                           tx.executeSql(
                             "CREATE TABLE IF NOT EXISTS tblGeoFences(inGEOFENCE_ID INTEGER PRIMARY KEY,stPROFILENAME TEXT,stGEOFENCE_NAME TEXT,stLATITUDE TEXT,stLONGITUDE TEXT, stPROFILE_TYPE TEXT,inRADIUS INT(5),stMAPZOOMLEVEL TEXT,inSLIDERVALUE INT, stDISTANCE TEXT)"
                           );
                         })
                           .then(() => {
                            
                           })
                           .catch(error => {
                            
                           });

                         resolve(db);
                       })
                       .catch(error => {
                         //  console.log(error);
                       });
                   });
                 }

                 closeDatabase(db) {
                   if (db) {
                     // console.log("Closing DB");
                     db.close()
                       .then(result => {
                         console.log("Database CLOSED");
                       })
                       .catch(error => {
                         // console.log(error);
                       });
                   } else {
                   }
                 }

                 getProfileList() {
                   return new Promise(resolve => {
                     const profilelist = [];
                     this.initDB()
                       .then(db => {
                         db.transaction(tx => {
                           tx.executeSql("SELECT * FROM tblGeoFences", []).then(
                             ([tx, results]) => {
                               // console.log("Query completed");
                               var len = results.rows.length;
                               for (let i = 0; i < len; i++) {
                                 profilelist.push(results.rows.item(i));
                               }

                               resolve(profilelist);
                             }
                           );
                         })
                           .then(result => {
                             this.closeDatabase(db);
                           })
                           .catch(err => {
                             //console.log(err);
                           });
                       })
                       .catch(err => {
                         // console.log(err);
                       });
                   });
                 }

                 getPlacebyID(id) {
                   //console.log(id);
                   return new Promise(resolve => {
                     this.initDB()
                       .then(db => {
                         db.transaction(tx => {
                           tx.executeSql(
                             "SELECT * FROM tblGeoFences WHERE inGEOFENCE_ID =?",
                             [id]
                           ).then(([tx, results]) => {
                             // console.log(results);
                             if (results.rows.length > 0) {
                               let row = results.rows.item(0);
                               resolve(row);
                             }
                           });
                         })
                           .then(result => {
                             this.closeDatabase(db);
                           })
                           .catch(err => {
                             //  console.log(err);
                           });
                       })
                       .catch(err => {
                         // console.log(err);
                       });
                   });
                 }

                 insertLocation(profilelist) {
                   var IsNearest = true;
                   return new Promise(resolve => {
                     this.initDB()
                       .then(db => {
                         db.transaction(tx => {
                           tx.executeSql(
                             "SELECT  *  from  tblGeoFences ",
                             [],
                             (tx, Result) => {
                               var len = Result.rows.length;
                               "id", len;
                               if (len > 0) {
                                 for (let i = 0; i < len; i++) {
                                   let nearestplace = geolib.findNearest(
                                     {
                                       latitude: profilelist.Latitude,
                                       longitude: profilelist.Longitude
                                     },
                                     [
                                       {
                                         latitude: Result.rows.item(i)
                                           .stLATITUDE,
                                         longitude: Result.rows.item(i)
                                           .stLONGITUDE
                                       }
                                     ]
                                   );

                                   if (
                                     nearestplace != "null" ||
                                     nearestplace != "undefind" ||
                                     nearestplace != {}
                                   ) {
                                     // (a);
                                     let totaldistance = geolib.getDistance(
                                       {
                                         latitude: profilelist.Latitude,
                                         longitude: profilelist.Longitude
                                       },
                                       {
                                         latitude: nearestplace.latitude,
                                         longitude: nearestplace.longitude
                                       }
                                     );
                                     //(c);
                                     let calcultedistance = parseFloat(
                                       totaldistance -
                                         (Result.rows.item(i).inRADIUS +
                                           profilelist.Radius)
                                     );
                                     calcultedistance;
                                     if (calcultedistance >= 200) {
                                     } else {
                                       IsNearest = false;
                                       alert(
                                         "Profile alreday created with same name ,Please select different location"
                                       );
                                       return false;
                                     }
                                   }
                                 }
                                 if (IsNearest == true) {
                                   tx.executeSql(
                                     "INSERT INTO tblGeoFences (stPROFILENAME,stGEOFENCE_NAME,stLATITUDE,stLONGITUDE,stPROFILE_TYPE,inRADIUS,stMAPZOOMLEVEL,inSLIDERVALUE,stDISTANCE) VALUES (?,?,?,?,?,?,?,?,?)",
                                     [
                                       profilelist.ProfileName,
                                       profilelist.Geofence_Name,
                                       profilelist.Latitude,
                                       profilelist.Longitude,
                                       profilelist.Profile_Type,
                                       profilelist.Radius,
                                       profilelist.MapZoomlevel,
                                       profilelist.SliderValue,
                                       profilelist.Distance
                                     ],

                                     (tx, result) => {
                                       if (result.rowsAffected > 0) {
                                         resolve(result);
                                       } else {
                                         (tx, err) => {
                                           reject(err);
                                         };
                                       }
                                     }
                                   );
                                 }
                               } else {
                                 tx.executeSql(
                                   "INSERT INTO tblGeoFences (stPROFILENAME,stGEOFENCE_NAME,stLATITUDE,stLONGITUDE,stPROFILE_TYPE,inRADIUS,stMAPZOOMLEVEL,inSLIDERVALUE,stDISTANCE) VALUES (?,?,?,?,?,?,?,?,?)",
                                   [
                                     profilelist.ProfileName,
                                     profilelist.Geofence_Name,
                                     profilelist.Latitude,
                                     profilelist.Longitude,
                                     profilelist.Profile_Type,
                                     profilelist.Radius,
                                     profilelist.MapZoomlevel,
                                     profilelist.SliderValue,
                                     profilelist.Distance
                                   ],

                                   (tx, result) => {
                                     if (result.rowsAffected > 0) {
                                       resolve(result);
                                     } else {
                                       (tx, err) => {
                                         reject(err);
                                       };
                                     }
                                   }
                                 );
                               }
                             }
                           );
                         })
                           .then(result => {
                             this.closeDatabase(db);
                           })
                           .catch(err => {
                             //  console.log(err);
                           });
                       })
                       .catch(err => {
                         //console.log(err);
                       });
                   });
                 }

                 updateProfile(id, editprofilelist) {
                   return new Promise(resolve => {
                     this.initDB()
                       .then(db => {
                         db.transaction(tx => {
                           tx.executeSql(
                             "UPDATE tblGeoFences SET stPROFILENAME =?, stPROFILE_TYPE = ? ,inRADIUS=?, stMAPZOOMLEVEL=?,inSLIDERVALUE=?,stDISTANCE =? WHERE inGEOFENCE_ID =?",
                             [
                               editprofilelist.ProfileName,
                               // editprofilelist.Geofence_Name,
                               // editprofilelist.Latitude,
                               // editprofilelist.Longitude,
                               editprofilelist.Profile_Type,
                               editprofilelist.Radius,
                               editprofilelist.MapZoomlevel,
                               editprofilelist.SliderValue,
                               editprofilelist.Distance,
                               id
                             ]
                           ).then(([tx, result]) => {
                             resolve(result);
                           });
                         })
                           .then(result => {
                             this.closeDatabase(db);
                           })
                           .catch(err => {
                             //   console.log(err);
                           });
                       })
                       .catch(err => {
                         // console.log(err);
                       });
                   });
                 }

                 deleteProfile(id) {
                   return new Promise(resolve => {
                     this.initDB()
                       .then(db => {
                         db.transaction(tx => {
                           tx.executeSql(
                             "DELETE  FROM tblGeoFences WHERE inGEOFENCE_ID =?",
                             [id]
                           ).then(([tx, results]) => {
                             //console.log(results);
                             resolve(results);
                           });
                         })
                           .then(result => {
                             this.closeDatabase(db);
                           })
                           .catch(err => {
                             // console.log(err);
                           });
                       })
                       .catch(err => {
                         // console.log(err);
                       });
                   });
                 }
               }
