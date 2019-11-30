import { StyleSheet, Platform } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";

//
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#F5FCFF",
    ...StyleSheet.absoluteFillObject
  },
  map: {
    flex: 1,
    ...StyleSheet.absoluteFillObject
  },
  iconStyle: {
    position: "relative",
    top: -30,
    left: "90%",
    right: 0
  },
  ProfileControllerImageStyle: {
    height: Platform.OS === "ios" ? hp("8%") : hp("9.5%"),
    width: wp("13.5%"),
    justifyContent: "center",
    //marginTop:-50,
    alignSelf: "center"
  },
  textStyle: {
    alignSelf: "center",
    color: "#000000",
    fontSize: 16,
    fontWeight: "600",
    marginTop: Platform.OS === "ios" ? 2 : -1,
    paddingBottom: Platform.OS === "ios" ? 15 : 4
  },

  btnParentView: {
    backgroundColor: "white",
    borderColor: "black",
    borderRadius: 10,
    marginLeft: 0,
    marginRight: 0,
    height: Platform.OS === "ios" ? hp("6%") : hp("6%"),
    shadowRadius: 6,
    position: "relative"
  },

  btnChildView: {
    flexDirection: "row",
    justifyContent: "space-between"
  },

  btnView: {
    flexDirection: "row",

    justifyContent: "space-evenly"
  },

  buttonStyle: {
    flex: 1,

    width: 20,
    padding: 5,
    backgroundColor: "#3399ff",
    borderRadius: 5,
    flexDirection: "row"
  },

  bottomView: {
    width: wp("95%"),
    height: Platform.OS === "ios" ? hp("15%") : hp("17%"),
    borderWidth: 1,
    borderRadius: 10,
    margin: 8,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: "white",
    borderColor: "white",
    bottom: Platform.OS === "ios" ? 0 : 0
  },
  txtbottomView: {
    width: wp("95%"),
    height: hp("5%"),
    marginLeft: 10,
    marginRight: 10,

    position: "absolute",

    bottom: Platform.OS === "ios" ? 25 : 0
  },
  slider: {
    flex: 1,
    position: "relative",
    marginTop: Platform.OS === "ios" ? 4 : 25
  },

  sliderView: {
    backgroundColor: "white",
    borderColor: "black",
    marginLeft: 0,
    marginRight: 0,

    // marginRight: Platform.OS ==="ios" ? 52 : 42,
    height: hp("6%")
  },

  sliderbtnView: {
    flexDirection: "column",
    flex: 1,
    justifyContent: "space-between",
    padding: 10
  },
  txtMeter: {
    flexDirection: "column",
    flex: 0.8,
    color: "#0D47A1",
    fontWeight: "bold",
    fontFamily: "arial",
    flexWrap: "wrap",
    position: "absolute",
    justifyContent: "space-between",
    top: 2,

    right: 2,
    //right: Platform.OS === "ios" ? -60 : -50,
    paddingHorizontal: 8
  },
  txtArea: {
    color: "#0D47A1",
    fontWeight: "bold",
    fontSize: 15,
    fontFamily: "arial"
  },

  btnContainer: {
    //paddingTop: 10,
    marginBottom: Platform.OS === "ios" ? 15 : 10,
    marginTop: Platform.OS === "ios" ? 5 : 0,
    padding: Platform.OS === "ios" ? 8 : 4,
    justifyContent: "space-between",
    borderRadius: 5,
    paddingTop: Platform.OS === "ios" ? 10 : 10,
    paddingBottom: Platform.OS === "ios" ? 12 : 2,
    borderWidth: 1.3,
    borderColor: "#3399ff",
    backgroundColor: "white",
    width: wp("28%")
  },

  inputView: {
    backgroundColor: "rgba(0,0,0,0)",
    position: "absolute",
    top: Platform.OS === "ios" ? 5 : 5,
    left: 10,
    right: 10
  },

  inputView1: {
    backgroundColor: "rgba(0,0,0,0)",
    position: "absolute",
    top: Platform.OS === "ios" ? 0 : 0,
    left: 10,
    right: 10
  },
  txtEditInput: {
    height: 30,
    left: Platform.OS === "android" ? 33 : 0,
    marginBottom:8,
    paddingBottom: Platform.OS === "android"?-10:2,
    color: "white",
    marginLeft: Platform.OS === "ios" ? 10 : 20,
    marginRight: 10,
    fontSize: Platform.OS === "ios" ?22:20,
    textAlign:'center',
    alignSelf:'center',
    justifyContent: "center",
    // borderBottomColor: "white",
    backgroundColor: "#1566C0"
  },
  input: {
    height: 38,
    padding: 10,
    paddingBottom: 5,
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    fontSize: 20,
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: "space-evenly",
    borderColor: "white",
    backgroundColor: "white"
  }
});

export default styles;
