import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Animated,
    SafeAreaView,
    Dimensions,
    StatusBar,
    TouchableWithoutFeedback,
    FlatList,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    TextInput,
    BackHandler,
    RefreshControl,
    Keyboard,
    Platform,
    Linking,
    AsyncStorage,
    Alert

} from "react-native";
import { Ionicons, Entypo, AntDesign,Fontisto ,FontAwesome} from '@expo/vector-icons';
import { NavigationContainer, CommonActions } from '@react-navigation/native';
import { connect } from 'react-redux';
import { selectTheme } from '../../actions';
import settings from '../../AppSettings';
const { diffClamp } = Animated;
const initialLayout = { width: Dimensions.get('window').width };
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
const { height, width } = Dimensions.get("window");
const fontFamily = settings.fontFamily;
const themeColor = settings.themeColor;

import axios from 'axios';
import moment from 'moment';
import PendingAppoinments from './PendingAppoinments';
import InProgressAppoinment from './InProgressAppoinment';
import AllAppointments from './AllAppointments';
import DateTimePickerModal from "react-native-modal-datetime-picker";

class ProfileScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal:false
        };
    }
    componentDidMount() {

    }
    logOut = async()=>{
        this.setState({showModal:false})
        await  AsyncStorage.clear();
        return this.props.navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    {
                        name: 'Login',

                    },

                ],
            })
        )
    }
          createAlert = () => {
    Alert.alert(
      `Do you want Logout?`,
       ``,
      [
        {
          text: "No",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Yes", onPress: () => { this.logOut() } }
      ]
    );

  }
    render() {
        return (
            <>
                <SafeAreaView style={styles.topSafeArea} />
                <SafeAreaView style={styles.bottomSafeArea}>
                    <View style={{ flex: 1, backgroundColor: "#fff" }}>
                        <StatusBar backgroundColor={themeColor} />
                        {/* HEADERS */}
                        <View style={{ height: height * 0.1, backgroundColor: themeColor, flexDirection: 'row', alignItems: "center" }}>
                            <TouchableOpacity style={{ flex: 0.2, alignItems: "center", justifyContent: 'center' }}

                            >
                               
                            </TouchableOpacity>
                            <View style={{ flex: 0.6, alignItems: "center", justifyContent: "center" }}>
                                <Text style={[styles.text, { color: '#fff', fontWeight: 'bold', fontSize: 18 }]}>Profile</Text>
                            </View>
                     
                        </View>
                        {/* CHATS */}
                        <View style={{flex:1,backgroundColor:"#fff"}}>
                                     <TouchableOpacity style={{ flexDirection: "row", height: height * 0.05, paddingHorizontal: 20, width, marginTop: 20 }}
                        onPress={() => { this.props.navigation.navigate('ViewProfile')}}
                    >
                        <View style={{ flex: 0.8, flexDirection: "row" }}>
                            <View style={{ alignItems: "center", justifyContent: "center" }}>
                               <Ionicons name="person" size={24} color={themeColor} />
                            </View>
                            <View style={{ alignItems: "center", justifyContent: "center", marginLeft: 20 }}>
                                <Text style={[styles.text, { color: themeColor}]}>Your Profile</Text>
                            </View>
                        </View>

                        <View style={{ flex: 0.2, alignItems: "center", justifyContent: 'center' }}>
                            <Entypo name="triangle-right" size={24} color={themeColor} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flexDirection: "row", height: height * 0.05, paddingHorizontal: 20, width, marginTop: 20 }}
                        onPress={() => { this.props.navigation.navigate('ViewFeautures')}}
                    >
                        <View style={{ flex: 0.8, flexDirection: "row" }}>
                            <View style={{ alignItems: "center", justifyContent: "center" }}>
                               <FontAwesome name="money" size={24} color={themeColor}/>
                            </View>
                            <View style={{ alignItems: "center", justifyContent: "center", marginLeft: 20 }}>
                                <Text style={[styles.text, { color: themeColor}]}> Diagnosis Features</Text>
                            </View>
                        </View>

                        <View style={{ flex: 0.2, alignItems: "center", justifyContent: 'center' }}>
                            <Entypo name="triangle-right" size={24} color={themeColor} />
                        </View>
                    </TouchableOpacity>
                              <TouchableOpacity style={{ flexDirection: "row", height: height * 0.05, paddingHorizontal: 20, width, marginTop: 20 }}
                        onPress={() => { this.props.navigation.navigate('ViewLab')}}
                    >
                        <View style={{ flex: 0.8, flexDirection: "row" }}>
                            <View style={{ alignItems: "center", justifyContent: "center" }}>
                               <FontAwesome name="money" size={24} color={themeColor}/>
                            </View>
                            <View style={{ alignItems: "center", justifyContent: "center", marginLeft: 20 }}>
                                <Text style={[styles.text, { color: themeColor}]}>Lab Details</Text>
                            </View>
                        </View>

                        <View style={{ flex: 0.2, alignItems: "center", justifyContent: 'center' }}>
                            <Entypo name="triangle-right" size={24} color={themeColor} />
                        </View>
                    </TouchableOpacity>
                      <TouchableOpacity style={{ flexDirection: "row", height: height * 0.05, paddingHorizontal: 20, width, marginTop: 20 }}
                         onPress={() => { this.createAlert()}}
                      >
                        <View style={{ flex: 0.8, flexDirection: "row" }}>
                            <View style={{ alignItems: "center", justifyContent: "center" }}>
                                <Entypo name="log-out" size={24} color={themeColor} />
                            </View>
                            <View style={{ alignItems: "center", justifyContent: "center", marginLeft: 20 }}>
                                <Text style={[styles.text, { color: {themeColor}}]}>Logout</Text>
                            </View>
                        </View>

                        <View style={{ flex: 0.2, alignItems: "center", justifyContent: 'center' }}>
                            <Entypo name="triangle-right" size={24} color={themeColor} />
                        </View>
                    </TouchableOpacity>
                        </View>
                
                    </View>
                </SafeAreaView>
            </>
        );
    }
}
const styles = StyleSheet.create({
    text: {
        fontFamily
    },
    topSafeArea: {
        flex: 0,
        backgroundColor: themeColor
    },
    bottomSafeArea: {
        flex: 1,
        backgroundColor: "#fff"
    },
})
const mapStateToProps = (state) => {

    return {
        theme: state.selectedTheme,

    }
}
export default connect(mapStateToProps, { selectTheme })(ProfileScreen);