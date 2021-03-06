import React, { Component } from 'react';
import { View, Text, SafeAreaView, Dimensions, StyleSheet, ActivityIndicator, StatusBar, AsyncStorage} from 'react-native';
import settings from '../AppSettings';
import { connect, connectAdvanced } from 'react-redux';
import { selectTheme ,selectUser,setNoticationRecieved} from '../actions';
const { height, width } = Dimensions.get("window");
import { NavigationContainer, CommonActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import HttpsClient from '../api/HttpsClient';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import notRef from '../notificationRef';
const fontFamily = settings.fontFamily;
const themeColor = settings.themeColor;
const url = settings.url;

import NetInfo from '@react-native-community/netinfo';
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";


 class DefaultScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
        token:null,
        internet:true
    };
  
  }
    getClinics = async()=>{
        const api = `${url}/api/prescription/getDoctorClinics/?doctor=${this.props.user.id}`
        const data = await HttpsClient.get(api)
        console.log(api,"ggghdf")
       console.log(data)
        if(data.type=="success"){
            this.setState({ clinics: data.data.workingclinics})
            let activeClinic = data.data.workingclinics.filter((i)=>{
                return i.active
            })
         console.log(activeClinic[0])
            this.props.selectClinic(activeClinic[0]||data.data.workingclinics[0])
      
        }
    }
     getUserDetails = async () => {
         const login = await AsyncStorage.getItem("login")
         if (login) {
          
              const data = await HttpsClient.get(`${url}/api/HR/users/?mode=mySelf&format=json`)
              console.log(data)
          
              if(data.type =="success"){
                 
                this.props.selectUser(data.data[0]);
                if(data.data[0].profile.childUsers.length>0){
                    let users = JSON.stringify(data.data[0])
                    await AsyncStorage.setItem("users",users)
                }
                if (data.data[0].is_superuser) {
                  return this.props.navigation.dispatch(
                    CommonActions.reset({
                      index: 0,
                      routes: [
                        {
                          name: 'AdminTab',

                        },

                      ],
                    })
                  )
                }
                if (data.data[0].profile.occupation == "Pet"){
                  return this.props.navigation.dispatch(
                    CommonActions.reset({
                      index: 0,
                      routes: [
                        {
                          name: 'PetTab',

                        },

                      ],
                    })
                  )
                }
                 if (data.data[0].profile.occupation == "LabAssistant"){
                  return this.props.navigation.dispatch(
                    CommonActions.reset({
                      index: 0,
                      routes: [
                        {
                          name: 'DiagnosisTab',

                        },

                      ],
                    })
                  )
                }
                if (data.data[0].profile.occupation == "MediacalRep" || data.data[0].profile.occupation == "MedicalRecoptionist"){
                  return this.props.navigation.dispatch(
                    CommonActions.reset({
                      index: 0,
                      routes: [
                        {
                          name: 'MedicalTab',

                        },

                      ],
                    })
                  )
                }
                if (data.data[0].profile.occupation == "Doctor" || data.data[0].profile.occupation == "ClinicRecoptionist" || data.data[0].profile.occupation == "Customer") {
              
                  if (this.props.notification) {
                 
                    if (this.props.notification.notification.request.content.categoryIdentifier == "prescription"){
                      return this.props.navigation.navigate('PrescriptionViewOuter', { pk: this.props.notification.notification?.request?.content?.data?.id })
                    }
              
                  }
                  return this.props.navigation.dispatch(
                    CommonActions.reset({
                      index: 0,
                      routes: [
                        {
                          name: 'MainTab',

                        },

                      ],
                    })
                  )
                }

              }
              else {
                return this.props.navigation.navigate('Login')
              }
              
         }else{
           return this.props.navigation.navigate('Login')
         }
     }
         showSimpleMessage(content,color, type = "info", props = {}) {
        const message = {
            message: content,
            backgroundColor:color,
            icon: { icon: "auto", position: "left" },
            type,
            ...props,
        };

        showMessage(message);
    }
  componentDidMount(){
      this.getUserDetails()
    const subscriptionn = Notifications.addNotificationReceivedListener(notification => {
      console.log(notification,"ppppp");
    });
   this.unsubscribe = NetInfo.addEventListener(state => {
        if(!state.isConnected){
           this.showSimpleMessage("No internet connection","orange","info")
           return this.setState({internet:false})
        }
        if(state.isConnected){
             if(!this.state.internet){
                  this.getUserDetails()
                  this.showSimpleMessage("Back to online","orange","info")
                  this.setState({internet:true})
             }
           
        }
    });
    Notifications.addNotificationResponseReceivedListener(response => {
        
      if (response.notification.request.content.categoryIdentifier =="prescription"){
         this.props.navigation.navigate('PrescriptionViewOuter', { pk: response?.notification?.request?.content?.data?.id })
      }
      

    });
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
    
      this.getUserDetails()
    });

  }
  componentWillUnmount(){
    
  }
  render() {
    return (
          <>
            <SafeAreaView style={styles.topSafeArea} />
            <SafeAreaView style={styles.bottomSafeArea}>
                <StatusBar backgroundColor={themeColor} />
                <View style={{flex:1,alignItems:"center",justifyContent:'center',backgroundColor:themeColor}}>
                     <ActivityIndicator color={"#fff"} size="large"/>
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
        user: state.selectedUser,
        notification:state.notification
    }
}
export default connect(mapStateToProps, { selectTheme, selectUser, setNoticationRecieved})(DefaultScreen);