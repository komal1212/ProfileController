import React from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  Image,
  PermissionsAndroid,
  ActivityIndicator,
  StatusBar
} from "react-native";
import { StackActions, NavigationActions } from "react-navigation";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";

const { width, height } = require("Dimensions").get("window");
export async function request_location_runtime_permission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "ProfileController App Location Permission",
        message: "ProfileController App needs access to your location "
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    }
  } catch (error) {
    handleError(error, false);
  }
}
export default class SplashScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  async componentDidMount() {
    await request_location_runtime_permission();
    setTimeout(() => {
      this.props.navigation.navigate("ProfileList");
    }, 2 * 1000);
  }
  render() {
    return (
      <View style={styles.container}>
        <Image style={styles.image} source={require("../images/splash.png")} />
        <StatusBar backgroundColor="#1565C0"></StatusBar>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",

    // margin: 50,
    alignItems: "center",
    flex: 1
    // flexDirection: "column"
  },

  image: {
    height: hp("100%"),
    width: wp("100%")
  }
});
