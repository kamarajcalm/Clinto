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
    Alert,
    ImageBackground

} from "react-native";
import { Ionicons, Entypo, AntDesign,Fontisto ,FontAwesome,MaterialCommunityIcons} from '@expo/vector-icons';
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
const url = settings.url
import axios from 'axios';
import moment from 'moment';
import PendingAppoinments from './PendingAppoinments';
import InProgressAppoinment from './InProgressAppoinment';
import AllAppointments from './AllAppointments';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import HttpsClient from '../../api/HttpsClient';

class ProfileScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal:false,
            item:null
        };
    }
    getLabDetails = async()=>{
       let api =`${url}/api/prescription/clinics/${this.props.clinic.clinicpk}/`
       console.log(api)
       const data = await HttpsClient.get(api)
       console.log(data)
       if(data.type=="success"){
            this.setState({item:data.data})
       }
    }
    componentDidMount() {
   
       this.getLabDetails()
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
         

                    <ScrollView
                         contentContainerStyle={{ paddingBottom: 90 }}
                         showsVerticalScrollIndicator={false}
                    >
                        <ImageBackground
                                blurRadius={1}
                                style ={{height:height*0.3,alignItems:"center",}}
                                source={require('../../assets/Doctor.png')}
                                
                        >
                                               {/* headers */}
                                    <View style={{alignSelf:"flex-end",marginRight:10,marginTop:10}}>
                                        <TouchableOpacity style={{  marginLeft: 20, alignItems: "center", justifyContent: 'center', flexDirection: "row" }}
                                        onPress={() => { 
                                         
                                            this.createAlert()
                                            
                                        }}
                                        >
                                    
                                        <MaterialCommunityIcons name="logout" size={30} color="black" />
                                        </TouchableOpacity>
                                    </View>
                                          <View style={{alignItems:"center",justifyContent:"center",flex:1}}>

              <View style={{ alignItems: "center", justifyContent: "center", flexDirection: "row", marginLeft: 20 }}>
                <Image
                  source={{ uri: this.props.user.profile.displayPicture || "https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg" }}
                  style={{ height:height*0.15, width: height*0.15, borderRadius: height*0.07}}
                />
                <TouchableOpacity style={{}}
                  onPress={() => { this.props.navigation.navigate('ProfileEdit') }}
                >
                  <Entypo name="edit" size={20} color={themeColor} />
                </TouchableOpacity>
              </View>
              <View style={{ alignItems: 'center', justifyContent: "center", }}>
                <Text style={[styles.text, { fontWeight: "bold", fontSize: height*0.022, color: "#000" }]}>{this.props.user.first_name}</Text>
              </View>
              <View style={{ alignItems: 'center', justifyContent: "center", }}>
                <Text style={[styles.text, { fontWeight: "bold", fontSize: height*0.022, color: "gray" }]}>{this.props.user.profile.specialization}</Text>
              </View>
           </View> 
                        </ImageBackground>
              <View style={{marginHorizontal:20,elevation:5,backgroundColor:"#fafafa",borderRadius:15,height:height*0.6}}>
                    <View style={{borderWidth:2,alignSelf:'center',borderColor:"gray",width:width*0.3,marginVertical:10,borderRadius:10}}>

                    </View>
                                  <View style={{ margin: 20}}>
                    <View>
                        <Text style={[styles.text,{color:"gray"}]}>Personal Info</Text>
                    </View>
                    <View style={{ flexDirection: "row", marginTop: 15, alignItems: "center", justifyContent: 'space-between' }}>
                        <View style={{ flex: 0.6 }}>
                            <Text style={[styles.text, { color: "gray" }]}>Age</Text>
                            <Text style={[styles.text, { marginTop: 5, color: "#000", }]}>{this.props.user.profile.age}</Text>
                        </View>
                        <View style={{ flex: 0.4 }}>
                            <Text style={[styles.text, { color: "gray" }]}>Blood Group</Text>
                            <Text style={[styles.text, { marginTop: 5, color: "#000", }]}>{this.props.user.profile.blood_group}</Text>
                        </View>
                    </View>

                    {/* <View style={{ flexDirection: "row", marginTop: 15, alignItems: "center", justifyContent: 'space-between' }}>
                        <View style={{ flex: 0.6 }}>
                            <Text style={[styles.text, { color: "gray" }]}>Height</Text>
                            <Text style={[styles.text, { marginTop: 5, color: "#000", }]}>{this.props.user.profile.height}</Text>
                        </View>
                        <View style={{ flex: 0.4 }}>
                            <Text style={[styles.text, { color: "gray" }]}>Weight</Text>
                            <Text style={[styles.text, { marginTop: 5, color: "#000", }]}>{this.props.user.profile.weight}</Text>
                        </View>
                    </View> */}
                    <View style={{ flexDirection: "row", marginTop: 15, }}>
                        <View style={{ flex: 0.6 }}>
                            <Text style={[styles.text, { color: "gray" }]}>Mobile</Text>
                            <Text style={[styles.text, { marginTop: 5, color: "#000", }]}>{this.props.user.profile.mobile}</Text>
                        </View>
                    
                    </View>
                    <View style={{ flexDirection: "row", marginTop: 15,}}>
                        <View >
                            <Text style={[styles.text, { color: "gray" }]}>Address</Text>
                            <Text style={[styles.text, { marginTop: 5,color: "#000",  }]}>{this.props.user.profile.address}</Text>
                            <Text style={[styles.text, { marginTop: 5, color: "#000",  }]}>{this.props.user.profile.city}-{this.props.user.profile.pincode}</Text>
                        </View>
                       
                    </View>
                    <View style={{ flexDirection: "row", marginTop: 15, }}>
                        <View style={{ }}>
                            <Text style={[styles.text, { color: "gray" }]}>Email</Text>
                            <Text style={[styles.text, { marginTop: 5, color: "#000", }]}>{this.props.user.email}</Text>
                        </View>

                    </View>
                </View>
                    <TouchableOpacity style={{ flexDirection: "row",  paddingHorizontal: 20, width, marginTop: 20 }}
                        onPress={() => { this.props.navigation.navigate('ViewFeautures')}}
                    >
                        <View style={{ flex: 0.7, flexDirection: "row" }}>
                            <View style={{ alignItems: "center", justifyContent: "center" }}>
                               <FontAwesome name="money" size={24} color={themeColor}/>
                            </View>
                            <View style={{ alignItems: "center", justifyContent: "center", marginLeft: 20 }}>
                                <Text style={[styles.text, { color: themeColor}]}> Diagnosis Types</Text>
                            </View>
                        </View>

                        <View style={{ flex: 0.3, alignItems: "center", justifyContent: 'center' }}>
                            <AntDesign name="rightcircleo" size={20} color="black" />
                        </View>
                    </TouchableOpacity>
                                 <TouchableOpacity style={{ flexDirection: "row",paddingHorizontal: 20, width, marginTop: 20 }}
                        onPress={() => { this.props.navigation.navigate('ViewDiagnosticCenter',{item:this.state.item,diagnosticCenter:true})}}
                    >
                        <View style={{ flex: 0.7, flexDirection: "row" }}>
                            <View style={{ alignItems: "center", justifyContent: "center" }}>
                               <FontAwesome name="money" size={24} color={themeColor}/>
                            </View>
                            <View style={{ alignItems: "center", justifyContent: "center", marginLeft: 20 }}>
                                <Text style={[styles.text, { color: themeColor}]}>Lab Details</Text>
                            </View>
                        </View>

                        <View style={{ flex: 0.3, alignItems: "center", justifyContent: 'center' }}>
                            <AntDesign name="rightcircleo" size={20} color="black" />
                        </View>
                    </TouchableOpacity>
                </View>
                    </ScrollView>
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
        user:state.selectedUser,
         clinic: state.selectedClinic
    }
}
export default connect(mapStateToProps, { selectTheme })(ProfileScreen);