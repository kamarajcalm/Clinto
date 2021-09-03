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




 class DefaultScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
        token:null
    };
  }
     getUserDetails = async () => {
         const login = await AsyncStorage.getItem("login")
         if (login) {
          
              const data = await HttpsClient.get(`${url}/api/HR/users/?mode=mySelf&format=json`);
      
              if(data.type =="success"){
                 
                this.props.selectUser(data.data[0]);
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
  componentDidMount(){
      this.getUserDetails()
    // const subscriptionn = Notifications.addNotificationReceivedListener(notification => {
    //   console.log(notification,"ppppp");
    // });
    Notifications.addNotificationResponseReceivedListener(response => {
        
      if (response.notification.request.content.categoryIdentifier =="prescription"){
         this.props.navigation.navigate('PrescriptionViewOuter', { pk: response?.notification?.request?.content?.data?.id })
      }
      

    });
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
    
      this.getUserDetails()
    });

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