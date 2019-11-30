import React, { Component } from "react";
import moment from "moment";
var now = moment().format();
var RNFS = require("react-native-fs");
import {
  setJSExceptionHandler,
  setNativeExceptionHandler
} from "react-native-exception-handler";

const PATH = RNFS.ExternalDirectoryPath + "/ProfilecontrollerApp";
const file_path = PATH + "/PC_" + moment().format("MMDDYYYY") + ".txt";

export const handleError = (error, isFatal) => {
  // console.log(error, isFatal);
  if (error != "undefined" && error != null) {
    var date = moment().format("DD-MM-YYYY HH:mm:ss");
    var errorString = date;
    errorString += "\n";
    errorString += "------------------------------------";
    errorString += "\n";
    // errorString+=error.message;
    // errorString+="\n";
    errorString +=
      error.stack != undefined
        ? error.stack.replace(/\r?\n\n|\r/g, " ")
        : error.message;
    errorString += "\n";

    RNFS.exists(PATH).then(exists => {
      if (!exists) {
        RNFS.mkdir(PATH);
      }
    });
    RNFS.exists(file_path).then(exists=>{
      if(!exists){
        RNFS.writeFile(file_path,errorString,"utf8");
      }
      else{
        RNFS.appendFile(file_path, errorString, "utf8");
      }
    });
   

    // if ( RNFS.exists(file_path)) {
    //   RNFS.writeFile(file_path, errorString, "utf8");
    // }

    // RNFS.appendFile(file_path, errorString, "utf8");
  }
};

setJSExceptionHandler((error, isFatal) => {
  handleError(error, isFatal);
}, true);

setNativeExceptionHandler(errorString => {
  handleError(error, isFatal);
});

