import React, { Component } from "react";
import {
  Dimensions,
  View,
  TextInput,
  TouchableOpacity,
  PermissionsAndroid,
  TouchableWithoutFeedback,
  Keyboard,
  Text,
  Slider,
  Vibration,
  Image,
  ActivityIndicator
} from "react-native";
import RNGooglePlaces from "react-native-google-places";
import Geolocation from "react-native-geolocation-service";
import Toast from "react-native-easy-toast";
import SystemSetting from "react-native-system-setting";
import Icon from "react-native-vector-icons/FontAwesome";
import MapView, {
  Circle,
  PROVIDER_GOOGLE,
  Marker,
  Overlay,
  AnimatedRegion
} from "react-native-maps";
import styles from "../style/HomeScreenStyle";
import moment from "moment";
import { handleError } from "./Log";
import Database from "./Database";
import RNAndroidLocationEnabler from "react-native-android-location-enabler";

//Constant Variable Declaration Section
const db = new Database();
const LATITUDE = 0;
const LONGITUDE = 0;
const LATITUDE_DELTA = 0.00922;
const LONGITUDE_DELTA = 0.0043;
const DURATION = 10000;
const PATTERN = [1000, 2000, 3000, 4000];
const geolib = require("geolib");
//END

var now = moment().format();

console.disableYellowBox = true; // avoid warning

export default class MapScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const txtEditfunction = navigation.getParam("handleEdittxtInput");
    return {
      headerStyle: { height: 30,backgroundColor: "#1565C0" },
      headerTintColor: "white",
      headerTitle: navigation.getParam("profilename") ? (
        <TextInput
          style={styles.txtEditInput}
          placeholder="Add Profile Name"
          placeholderTextColor="white"
          inlineImageLeft="edit"
          inlineImagePadding={2}
          selectionColor={"white"}
          onChangeText={text => txtEditfunction(text)}
        >
          {txtEditfunction
            ? txtEditfunction && navigation.state.params.profilename
            : navigation.state.params.profilename}
        </TextInput>
      ) : ( navigation.getParam("txtProfilename")   ),
      headerTitleStyle: {
        justifyContent: "center",
        alignSelf: "center",
        textAlign: "center",
        marginLeft: Platform.OS === "ios" ? "25%" : "40%"
      },

      headerRight: navigation.getParam("profilename") ? (
        <Icon
          style={{
            right: 10,
            color: Platform.OS === "android" ? "white" : "white",
            paddingBottom: Platform.OS === "android" ? 2 : 8
          }}
          size={25}
          name="edit"
        ></Icon>
      ) : null
    };
  };

  constructor(props) {
    super(props);

    this.state = {
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      }, //Region Display By Map With Lat and Long
      editregion: {
        txtProfilename: "" //Edit  Profile Name (Eg.: Office,Home)
      },
      editplace: "", //Edit Geofence Name
      //products: [],
      place: "", //Geofence Name (Search Profile PlaceName)
      address: "", //Geofence PlaceAddress
      //markers: null,
      radius: 120, //Circle Radius
      maxZoomLevel: 18, //Map Maximum Zoom Level
      bgColorbtnGeneral: "white",
      bgColorbtnSilent: "white",
      bgColorbtnVibrate: "white",
      btnSilenttxtColor: "#000000",
      btnGeneraltxtColor: "#000000",
      btnVibratetxtColor: "#000000",
      distance: "", //  Display Distance Cover By Circle
      //text: "",    //
      //profileDetails: [],
      sliderValue: 20,
      txtradius: "120 Mtr",
      disableInputsearch: true //Disable TextBox Search On Edit Profile
    };
  }

  //General Button Background And Text Colour Change
  btnGeneralColourChange = () => {
    this.refs.toast.show("Profile changed to General");
    this.setState({ bgColorbtnGeneral: "#3399ff" });
    this.setState({ btnGeneraltxtColor: "white" });
    this.setState({ bgColorbtnSilent: "white" });
    this.setState({ btnSilenttxtColor: "black" });
    this.setState({ bgColorbtnVibrate: "white" });
    this.setState({ btnVibratetxtColor: "black" });
  };
  //End

  //Silent Button Background And Text Colour Change
  btnSilentColourChange = () => {
    this.refs.toast.show("Profile changed to Silent");
    this.setState({ bgColorbtnSilent: "#3399ff" });
    this.setState({ btnSilenttxtColor: "white" });
    this.setState({ bgColorbtnVibrate: "white" });
    this.setState({ btnVibratetxtColor: "black" });
    this.setState({ bgColorbtnGeneral: "white" });
    this.setState({ btnGeneraltxtColor: "black" });
  };
  //End

  //Vibrate Button Background And Text Colour Change
  btnVibrateColourChange = () => {
    this.refs.toast.show("Profile changed to Vibrate");
    this.setState({ bgColorbtnVibrate: "#3399ff" });
    this.setState({ btnVibratetxtColor: "white" });
    this.setState({ bgColorbtnGeneral: "white" });
    this.setState({ btnGeneraltxtColor: "black" });
    this.setState({ bgColorbtnSilent: "white" });
    this.setState({ btnSilenttxtColor: "black" });
  };
  //End

  //Edit Profile Name In Header
  UpdateTextComponent = text => {
    this.setState({ editregion: { txtProfilename: text } });
  };
  //End

  //Insert And Update  Profile Location With  Details Into Database
  insertGeoFenceLocation = ProfileType => {
    try {
      let profileId;
      let editprofilelist;
      let profilename;
      let profilelist;

      profileId = this.props.navigation.getParam("profileId");
      profilename = this.props.navigation.getParam("txtProfilename");

      if (profileId > 0) {
        editprofilelist = {
          GEOFENCE_ID: profileId,
          ProfileName: this.state.editregion.txtProfilename
            ? this.state.editregion.txtProfilename
            : this.props.navigation.getParam("profilename"),
          Geofence_Name: this.state.editplace,
          Latitude: this.state.region.latitude,
          Longitude: this.state.region.longitude,
          Profile_Type: ProfileType,
          Radius: this.state.radius,
          SliderValue: this.state.sliderValue,
          Distance: this.state.distance,
          MapZoomlevel: this.state.maxZoomLevel
        };

        //Edit Profile Details In Database
        db.updateProfile(editprofilelist.GEOFENCE_ID, editprofilelist).then(
          result => {
            this.props.navigation.goBack();
          }
        );
        //End
      } else {
        profilelist = {
          ProfileName: profilename,
          Geofence_Name: this.state.place.name,
          Latitude: this.state.region.latitude,
          Longitude: this.state.region.longitude,
          Profile_Type: ProfileType,
          Radius: this.state.radius,
          Distance: this.state.distance
            ? this.state.distance
            : this.state.radius,
          MapZoomlevel: this.state.maxZoomLevel,
          SliderValue: this.state.sliderValue
        };

        //Insert Profile Details In Database
        db.insertLocation(profilelist).then(result => {
          this.props.navigation.goBack();
        });
        //End
      }
    } catch (error) {
      this.handleError(error, false); // Create Log File And Store Into LocalStorage If Error Occurs.
    }
  };
  //End

  //Slider Value Change For  Set Mapzoomlevel And Cirlce Radius Increase And Decrease
  onProgressChanged = fiProgress => {
    let radi;
    let scale;
    let zoomLevel;

    this.setState({ sliderValue: fiProgress });
    if (fiProgress > 0) {
      if (fiProgress > 1 && fiProgress <= 25) {
        miradius = fiProgress * 10;
        this.getZoomlevel(miradius);
      }
      if (fiProgress > 25 && fiProgress <= 50) {
        miradius = fiProgress * 20;
        this.getZoomlevel(miradius);
      } else if (fiProgress > 50 && fiProgress <= 70) {
        miradius = fiProgress * 30;
        this.getZoomlevel(miradius);
      } else if (fiProgress > 70 && fiProgress <= 80) {
        miradius = fiProgress * 40;
        radi = miradius + miradius / 8;
        this.setState({ radius: radi });
        scale = radi / 600;
        zoomLevel = 15 - Math.log(scale) / Math.log(2);
        this.setState({ maxZoomLevel: zoomLevel });
      } else if (fiProgress > 80 && fiProgress <= 100) {
        miradius = fiProgress * 50;
        radi = miradius + miradius / 12;

        this.setState({ radius: radi });

        scale = radi / 700;
        zoomLevel = 15 - Math.log(scale) / Math.log(2);

        this.setState({ maxZoomLevel: zoomLevel });
      }
    } else {
      miradius = 2000;
      this.setState({ radius: miradius });
      this.setState({ maxZoomLevel: maxZoomLevel });
    }
    if (miradius > 1000) {
      this.setState({ distance: miradius / 1000 + " " + "Km" });
    } else {
      this.setState({ distance: miradius + " " + "Mtr" });
    }
  };
  //End

  //Common Function For Set  MapZoomlevel
  getZoomlevel = radius => {
    let radi;
    let scale;
    let zoomLevel;

    radi = radius + radius / 2;
    this.setState({ radius: radi });

    scale = radi / 500;
    zoomLevel = 15 - Math.log(scale) / Math.log(2);

    this.setState({ maxZoomLevel: zoomLevel });
  };
  //End

  //Set Profile As Silent
  SilentStart = async () => {
    if ((await SystemSetting.getVolume("ring")) >= 0) {
      SystemSetting.setVolume(0, {
        type: "ring",
        showUI: true
      });
    }
    if ((await SystemSetting.getVolume("music")) >= 0) {
      SystemSetting.setVolume(0, {
        type: "music",
        showUI: true
      });
    }
  };
  //End

  //Set Profile As General
  GeneralStart = async () => {
    if ((await SystemSetting.getVolume("ring")) == 0) {
      SystemSetting.setVolume(1, {
        type: "ring",
        showUI: true
      });
    } else {
      SystemSetting.setVolume(1, {
        type: "ring",
        showUI: true
      });
    }

    if ((await SystemSetting.getVolume("music")) == 0) {
      SystemSetting.setVolume(1, {
        type: "music",
        showUI: true
      });
    } else {
      SystemSetting.setVolume(1, {
        type: "music",
        showUI: true
      });
    }
  };
  //End

  //Set Profile As Vibrate
  VibrationStart = () => {
    Vibration.vibrate(DURATION);
    Vibration.vibrate(PATTERN);
    Vibration.vibrate();
    Vibration.cancel();
  };
  //End

  //Enable Location Service If Disable For Android
  onLocationPressed = () => {
    RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
      interval: 10000,
      fastInterval: 5000
    })
      .then(data => {})
      .catch(error => {
        handleError(error, false);
      });
  };
  //End


  componentDidMount = () => {
    const { navigation } = this.props;
    let profileListItem;
    let profileId;
    let dbprofiletype;

    this.props.navigation.setParams({
      handleEdittxtInput: this.UpdateTextComponent
    }); //Edit ProfileName In Header TextBox
    this.getCurrentloactionData(); //Compare With Current And Database Stored Location

    profileListItem = navigation.getParam("profileListItem");
    profileId = navigation.getParam("profileId");

    if (profileId > 0) {
      this.setState({ disableInputsearch: false });
      this.editProfile = navigation.addListener("didFocus", () => {
        this.setState({ editplace: profileListItem.stGEOFENCE_NAME });
        this.setState({ sliderValue: profileListItem.inSLIDERVALUE });
        this.setState({
          distance: parseFloat(profileListItem.stDISTANCE) + " " + "Mtr"
        });
        this.setState({
          region: {
            latitude: parseFloat(profileListItem.stLATITUDE),
            longitude: parseFloat(profileListItem.stLONGITUDE),
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
          }
        });
        this.setState({
          maxZoomLevel: parseFloat(profileListItem.stMAPZOOMLEVEL)
        });
        this.setState({ radius: profileListItem.inRADIUS });

        dbprofiletype = profileListItem.stPROFILE_TYPE;

        switch (dbprofiletype) {
          case "Silent":
            this.btnSilentColourChange();
            break;
          case "General":
            this.btnGeneralColourChange();
            break;
          case "Vibrate":
            this.btnVibrateColourChange();
            break;
        }
      });
    } else {
      Geolocation.getCurrentPosition(
        position => {
          this.setState({
            region: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA
            }
          });
        },
        error => {
          handleError(error, false);
          if (error.code === 2) {
            if (Platform.OS === "ios") {
              Linking.openSettings();
            } else {
              this.onLocationPressed();
            }
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 1000
        }
      );
      this.watchID = Geolocation.watchPosition(position => {
        this.setState({
          region: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
          }
        });
      });
    }
  };
  componentWillUnmount() {
    Geolocation.clearWatch(this.watchID);
  }

  //Get Current Location And Compare With Location  Stored In Database
  getCurrentloactionData = async () => {
    let dbprofiletype;
    let dbmarkerlat;
    let dbmarkerlong;
    let dbcircleradius;

    await Geolocation.getCurrentPosition(
      position => {
        db.getProfileList().then(results => {
          var len = results.length;
          for (let i = 0; i < len; ++i) {
            dbprofiletype = results[i].stPROFILE_TYPE;
            dbmarkerlat = results[i].stLATITUDE;
            dbmarkerlong = results[i].stLONGITUDE;
            dbcircleradius = results[i].inRADIUS;

            if (
              geolib.isPointWithinRadius(
                {
                  latitude: position.coords.latitude, //current latitude
                  longitude: position.coords.longitude //current longitude
                },
                { latitude: dbmarkerlat, longitude: dbmarkerlong },
                dbcircleradius
              )
            ) {
              switch (dbprofiletype) {
                case "Silent":
                  this.SilentStart();
                  // that.btnSilentColourChange();
                  break;
                case "General":
                  this.GeneralStart();
                  //that.btnGeneralColourChange();
                  break;
                case "Vibrate":
                  this.VibrationStart();
                  // that.btnVibrateColourChange();
                  break;
              }
            }
          }
        });
      },
      error => {
        handleError(error, false);
        if (error.code === 2) {
          if (Platform.OS === "ios") {
            Linking.openSettings(); //Turn Location On If Location Is Off Use In IOS
          } else {
            this.onLocationPressed();
          }
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000
      }
    );
  };
  //End

  openSearchModal() {
    RNGooglePlaces.openAutocompleteModal()
      .then(place => {
        this.setState({
          region: {
            latitude: place.location.latitude,
            longitude: place.location.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
          }
        });
        const address = {
          address: place.address
        };
        this.setState({ place: place, address });
      })
      .catch(error => handleError(error, false));
    // Keyboard.dismiss()
  }

  render() {
    const { region } = this.state;
    const { editplace } = this.state;
    const { place } = this.state;

    return (
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}
      >
        <View style={styles.container}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            maxZoomLevel={this.state.maxZoomLevel}
            //showsUserLocation={true}
            region={this.state.region}
            showCompass={false}
            showScale={false}
            // onRegionChange = { region => this.setState({ region }) }
            // onRegionChangeComplete = { region => this.setState({ region }) }
          >
            {/* {this.state.products.map(place => (


                <MapView.Marker
                coordinate={{ latitude: place.lat, longitude: place.long }}>
                <Image
                style={styles.ProfileControllerImageStyle}
                source={require("../images/location.png")}
                />

                </MapView.Marker>
                ))} */}

            {/* {this.state.products.map(place =>(
                <MapView.Circle
                center={{latitude:place.lat,longitude:place.long}}
                radius={place.radi}
                strokeWidth={3}
                strokeColor="red"
                fillColor="#F5FCFF"
                />
                ))} */}
            <Marker coordinate={this.state.region}>
              <Image
                style={styles.ProfileControllerImageStyle}
                source={require("../images/location.png")}
              />
            </Marker>
            <MapView.Circle
              center={this.state.region}
              radius={this.state.radius}
              strokeWidth={3}
              strokeColor="#3399ff"
              fillColor="#F5FCFF"
            ></MapView.Circle>
          </MapView>
          {/* <Circle
              center={this.state.region}
              radius={this.state.editregion.radius}
              strokeWidth={3}
              strokeColor="#3399ff"
              fillColor="#F5FCFF"
              ></Circle> */}

          <View style={styles.inputView}>
            <TextInput
              style={styles.input}
              placeholder="Search"
              placeholderTextColor="black"
              inlineImageLeft="search"
              inlineImagePadding={2}
              editable={this.state.disableInputsearch}
              onFocus={() => this.openSearchModal()}
            >
              {place ? place.name : editplace}
            </TextInput>

            <View style={styles.iconStyle}>
              <Icon
                name="search"
                style={{
                  color: "#1565C0",
                  justifyContent: "center"
                }}
                size={20}
                disabled={!this.state.disableInputsearch}
                onPress={() => this.openSearchModal()}
              ></Icon>
            </View>
          </View>

          <View
            style={{
              position: "absolute",
              bottom: Platform.OS === "ios" ? 10 : 0
            }}
          >
            <View style={styles.bottomView}>
              <View style={styles.sliderbtnView}>
                <View style={styles.sliderView}>
                  <View style={{ flex: 0.7, position: "relative" }}>
                    <Text style={styles.txtArea}>
                      Drag to increase and decrease area
                    </Text>
                  </View>
                  <Slider
                    style={styles.slider}
                    thumbTintColor="#3399ff"
                    maximumValue={100}
                    minimumValue={10}
                    step={10}
                    value={this.state.sliderValue}
                    minimumTrackTintColor="#3399ff"
                    maximumTrackTintColor="#000000"
                    onValueChange={radi => {
                      this.onProgressChanged(radi);
                    }}
                  />

                  <Text style={styles.txtMeter}>
                    {this.state.distance
                      ? this.state.distance
                      : this.state.txtradius}
                  </Text>
                </View>

                {/* {/ Add Space between sliderView and buttonView /} */}

                <View style={styles.btnParentView}>
                  <View style={styles.btnChildView}>
                    <View style={styles.btnView}>
                      <TouchableOpacity
                        style={[
                          styles.btnContainer,
                          {
                            backgroundColor: this.state.bgColorbtnSilent
                          }
                        ]}
                        value={"Silent"}
                        onPress={() => {
                          this.insertGeoFenceLocation("Silent");
                          // this.SilentStart();
                          this.btnSilentColourChange();

                          // this.saveModal();
                        }}
                      >
                        <Text
                          style={[
                            styles.textStyle,
                            {
                              color: this.state.btnSilenttxtColor
                            }
                          ]}
                        >
                          Silent
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.btnView}>
                      <TouchableOpacity
                        style={[
                          styles.btnContainer,
                          {
                            backgroundColor: this.state.bgColorbtnGeneral
                          }
                        ]}
                        onPress={() => {
                          this.insertGeoFenceLocation("General");
                          this.btnGeneralColourChange();
                          // this.saveModal();
                        }}
                      >
                        <Text
                          style={[
                            styles.textStyle,
                            {
                              color: this.state.btnGeneraltxtColor
                            }
                          ]}
                        >
                          General
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.btnView}>
                      <TouchableOpacity
                        style={[
                          styles.btnContainer,
                          {
                            backgroundColor: this.state.bgColorbtnVibrate
                          }
                        ]}
                        onPress={() => {
                          this.insertGeoFenceLocation("Vibrate");
                          this.btnVibrateColourChange();
                          // this.saveModal();
                        }}
                      >
                        <Text
                          style={[
                            styles.textStyle,
                            {
                              color: this.state.btnVibratetxtColor
                            }
                          ]}
                        >
                          Vibrate
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <Toast
                      ref="toast"
                      style={{ backgroundColor: "#212121" }}
                      position="top"
                      positionValue={-40}
                      fadeInDuration={1000}
                      fadeOutDuration={500}
                      defaultCloseDelay={10}
                      opacity={1}
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
