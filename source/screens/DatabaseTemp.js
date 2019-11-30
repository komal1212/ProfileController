const geolib = require("geolib");

import { openDatabase } from "react-native-sqlite-storage";
var db = openDatabase({ name: "ProfileController.db" });

export const init = () => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((txn)=> {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='tblGeoFences'",
        [],
        (tx, res)=> {
          "item:", res.rows.length;
          if (res.rows.length == 0) {
            txn.executeSql("DROP TABLE IF EXISTS tblGeoFences", []);
            txn.executeSql(
              "CREATE TABLE IF NOT EXISTS tblGeoFences(inGEOFENCE_ID INTEGER PRIMARY KEY,stPROFILENAME TEXT,stGEOFENCE_NAME TEXT,stLATITUDE TEXT,stLONGITUDE TEXT, stPROFILE_TYPE TEXT,inRADIUS INT(5),stMAPZOOMLEVEL TEXT,inSLIDERVALUE INT, stDISTANCE TEXT)",
              [],
              () => {
                resolve();
              },
              (tx, err) => {
                reject(err);
              }
            );
          }
        }
      );
    });
  });
  return promise;
};

export const insertLocation = data => {
  var IsNearest = true;
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx)=> {
      tx.executeSql("SELECT  *  from  tblGeoFences ", [], (tx, Result) => {
        var len = Result.rows.length;
        "id", len;
        if (len > 0) {
          for (let i = 0; i < len; i++) {
            let nearestplace = geolib.findNearest(
              { latitude: data.Latitude, longitude: data.Longitude },
              [
                {
                  latitude: Result.rows.item(i).stLATITUDE,
                  longitude: Result.rows.item(i).stLONGITUDE
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
                { latitude: data.Latitude, longitude: data.Longitude },
                {
                  latitude: nearestplace.latitude,
                  longitude: nearestplace.longitude
                }
              );
              //(c);
              let calcultedistance = parseFloat(
                totaldistance - (Result.rows.item(i).inRADIUS + data.Radius)
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
                data.ProfileName,
                data.Geofence_Name,
                data.Latitude,
                data.Longitude,
                data.Profile_Type,
                data.Radius,
                data.MapZoomlevel,
                data.SliderValue,
                data.Distance
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
              data.ProfileName,
              data.Geofence_Name,
              data.Latitude,
              data.Longitude,
              data.Profile_Type,
              data.Radius,
              data.MapZoomlevel,
              data.SliderValue,
              data.Distance
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
      });
    });
  });

    return promise;
  
};



export const getData = () => {
  const products = [];
  const promise = new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        "SELECT * FROM tblGeoFences",
        [],
        (tx, Result) => {
          var len = Result.rows.length;
          for (let i = 0; i < len; i++) {
            products.push(Result.rows.item(i));
           
          }
           resolve(products);
             

        },
        (_, err) => {
          reject(err);
        }
      );
    });
    
  });
  return promise;

};

export const updateProfile = (id, data) => {
const promise = new Promise((resolve, reject) => {
   db.transaction(tx => {
          tx.executeSql(
            "UPDATE tblGeoFences SET stPROFILENAME =?, stPROFILE_TYPE = ? ,inRADIUS=?, stMAPZOOMLEVEL=?,inSLIDERVALUE=?,stDISTANCE =? WHERE inGEOFENCE_ID =?",
            [
              data.ProfileName,
             // data.Geofence_Name,
             // data.Latitude,
             // data.Longitude,
              data.Profile_Type,
              data.Radius,
              data.MapZoomlevel,
              data.SliderValue,
              data.Distance,
              id
            ],
            (tx, results) => {
              if (results.rowsAffected > 0) {
               resolve(results);
              } else {
                (tx, err) => {
                  reject(err);
                };
              }
            }
          );
        });
  });
  return promise;
};









export const deleteProfile = id => {
  const promise = new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        "DELETE  FROM tblGeoFences WHERE inGEOFENCE_ID =?",
        [id],
        (tx, Result) => {
     
          resolve(Result);
        },

        (_, err) => {
          reject(err);
        }
      );
    });
  });
  return promise;
};

export const getPlacebyID = id => {
  const promise = new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        "SELECT * FROM tblGeoFences WHERE inGEOFENCE_ID =?",
        [id],
        (tx, Result) => {
          if (Result.rows.length > 0) {
            let row = Result.rows.item(0);
            resolve(row);
          }
        },

        (_, err) => {
          reject(err);
        }
      );
    });
  });
  return promise;
};

