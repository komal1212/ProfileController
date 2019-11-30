import Icon from "react-native-vector-icons/FontAwesome";

import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  Alert,
  View,
  KeyboardAvoidingView,
  Button,
  FlatList,
  Platform,
  TouchableHighlight,
  TouchableOpacity
} from "react-native";
import Modal from "react-native-modal";
import Database from "./Database";

const db = new Database();

const ProfileList = props => {
  const [profilelist, setprofilelist] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [textValue, setTextValue] = useState("");
  const [ErrorStatus, setErrorStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const flatlist = props.navigation.addListener("didFocus", () => {
      updateProfileList();
    });
    return ()=>
    flatlist.remove();
    //updateProfileList();
  }, [profilelist]);

  const updateProfileList = () => {
    var profilelist = [];
    db.getProfileList()
      .then(list => {
        setIsLoading(true);
        (profilelist = list), setprofilelist(profilelist);
        setIsLoading(false);
      })
      .catch(err => {
        console.log(err);
      });
  };
  ListViewItemSeparator = () => {
    return (
      <View
        style={{
          flex: 0.6,
          height: 2,
          width: "100%",
          backgroundColor: "white"
        }}
      ></View>
    );
  };
  setModalVisible = () => {
    setShowModal(true);
  };
  setModalClose = () => {
    setShowModal(false);
    setTextValue("");
    setErrorStatus(false);
  };
  onNavigate = () => {
    if (textValue == "") {
      setErrorStatus(true);
    } else {
      props.navigation.navigate("MapScreen", {
        txtProfilename: textValue
      }),
        setShowModal(false);
      setTextValue("");
    }
  };

  handleChange = textValue => {
    setErrorStatus(false);
    setTextValue(textValue);
  };
  ListEmptyComponent = () => {
    return (
      <View>
        <Text
          style={{
            justifyContent: "center",
            alignSelf: "center",
            top: Platform.OS === "ios" ? 50 : 0,
            fontSize: 22,
            color: "grey"
          }}
        >
          No profiles found
        </Text>
      </View>
    );
  };

  //For : Delete Profile
  const deleteList = inGEOFENCE_ID => {
    Alert.alert(
      "Alert",
      "Are you sure you want to delete?",
      [
        {
          text: "No",
          onPress: () => console.log("Ask me later pressed"),
          style: "cancel"
        },

        {
          text: "Yes",
          onPress: () =>
            db.deleteProfile(inGEOFENCE_ID).then(result => {
              const data = profilelist.filter(
                item => item.inGEOFENCE_ID !== item.inGEOFENCE_ID
              );

              setprofilelist(data);
              updateProfileList();
              // alert("deleted record");
            })
        }
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        extraData={profilelist}
        style={styles.flatlist}
        data={profilelist}
        ListEmptyComponent={this.ListEmptyComponent}
        keyExtractor={item => item.inGEOFENCE_ID}
        renderItem={({ item }) => (
          <TouchableHighlight
            underlayColor="#ECEFF1"
            onPress={() =>
              props.navigation.navigate("MapScreen", {
                profileListItem: item,
                profileId: item.inGEOFENCE_ID,
                profilename: item.stPROFILENAME,
                placename: item.stGEOFENCE_NAME
              })
            }
          >
            <View style={styles.contentContainer}>
              <View>
                <Text
                  style={{ left: 20, top: 5, fontSize: 25, color: "#0D47A1" }}
                >
                  {item.stPROFILENAME}
                </Text>
                <Text
                  style={{ left: 22, top: 10, fontSize: 18, color: "black" }}
                >
                  {item.stGEOFENCE_NAME}
                </Text>
                <Text
                  style={{ left: 22, top: 15, fontSize: 16, color: "black" }}
                >
                  {item.stPROFILE_TYPE}
                </Text>
              </View>

              <Icon
                style={{
                  top: 5,
                  position: "absolute",
                  marginLeft: "90%",
                  justifyContent: "center",
                  color: "red"
                }}
                size={30}
                name="trash"
                onPress={() => deleteList(item.inGEOFENCE_ID)}
              ></Icon>

              {/* <Icon style ={{ color:'white'}} size={30} name ='edit'
             onPress={() => props.navigation.navigate('MapScreen',{
               placeID:item.GEOFENCE_ID
             })}></Icon>  */}
            </View>
          </TouchableHighlight>
        )}
      />

      <Modal isVisible={showModal} avoidKeyboard={true}>
        <View style={styles.modal}>
          <View style={styles.txtmodal}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold"
              }}
            >
              Add Profile Name
            </Text>
          </View>

          <TextInput
            placeholder="E.g.(Office,Home)"
            style={styles.txtAreaModal}
            value={textValue}
            onChangeText={text => handleChange(text)}
          ></TextInput>
          {ErrorStatus && (
            <Text style={styles.errorMessage}>Please enter profile name.</Text>
          )}
          <View style={styles.btnModal}>
            <TouchableOpacity
              style={styles.btnSave}
              onPress={() => onNavigate()}
            >
              <Text style={styles.textmodalStyle}>Save</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.btnSave}
              onPress={() => setModalClose()}
            >
              <Text style={styles.textmodalStyle}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

ProfileList.navigationOptions = navdata => ({
  headerTitle: (
    <View style={{ flex: 1, justifyContent: "center", alignSelf: "center" }}>
      <Text
        style={{
          textAlign: "center",
          fontSize: 25,
          color: Platform.OS === "android" ? "white" : "white",
          left: Platform.OS === "ios" ? 0 : 30
        }}
      >
        Profile List
      </Text>
    </View>
  ),
  headerStyle: {
    backgroundColor: Platform.OS === "android" ? "#1565C0" : "#1566C0"
  },
  headerTintColor: Platform.OS === "android" ? "white" : "white",
  headerLeft: null,
  headerRight: (
    <Icon
      style={{ right: 10, color: "white" }}
      size={30}
      name="plus"
      onPress={() => setModalVisible()}
    ></Icon>
  )
});

const styles = StyleSheet.create({
  container: {
    flex: 1,

    flexDirection: "column",
    justifyContent: "center",

    backgroundColor: "#ECEFF1"
  },
  flatlist: {
    flex: 1,
    padding: 8,
    flexDirection: "column" // main axis
  },
  contentContainer: {
    height: 100,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: "white",
    borderColor: "white",
    borderWidth: 3,
    borderRadius: 5,
    margin: 5,
    alignItems: "flex-start"
  },
  listcontainer: {
    width: "80%",
    height: "40%",
    left: 20,
    alignItems: "flex-start"
  },

  btnCancel: {
    justifyContent: "space-between",
    // borderRadius: 5,
    // borderWidth: 1,
    borderColor: "#3399ff",
    backgroundColor: "black"
  },
  btnSave: {
    justifyContent: "space-evenly",

    borderColor: "#3399ff"
  },
  btnModal: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignContent: "center",
    paddingBottom: 0
  },
  txtAreaModal: {
    borderBottomWidth: 2,
    borderColor: "black",
    fontSize: 20,
    marginBottom: 5,
    padding: 10
  },
  modal: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "75%",

    alignSelf: "center",
    justifyContent: "center",
    borderColor: "rgba(0, 0, 0, 0.1)"
  },

  activity: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center"
  },
  textmodalStyle: {
    color: "#3399ff",
    alignSelf: "center",

    fontSize: 20,
    fontWeight: "600",
    paddingTop: 10,
    paddingBottom: 10
  },
  errorMessage: {
    fontSize: 15,
    color: "red"
  }
});

export default ProfileList;
