import { createStackNavigator, createAppContainer } from "react-navigation";
import SplashScreen from "../source/screens/SplashScreen";
import MapScreen from "../source/screens/MapScreen";
import ProfileList from "../source/screens/ProfileList";

const ScreenNavigator = createStackNavigator(
  {
    SplashScreen: {
      screen: SplashScreen
    },
    ProfileList: {
      screen:ProfileList
    },
    MapScreen: {
      screen: MapScreen
    }
  },
  {
    initialRouteName: "SplashScreen"
  }
);

export default createAppContainer(ScreenNavigator);
