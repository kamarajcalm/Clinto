import React, { Component } from 'react';
import { View, Text, Dimensions, Image, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, ActivityIndicator, Platform, StatusBar, AsyncStorage } from 'react-native';
import settings from '../AppSettings';
import { connect } from 'react-redux';
import { selectTheme } from '../actions';
import { AntDesign, Entypo } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { NavigationContainer, CommonActions } from '@react-navigation/native';
import axios from 'axios';
import HttpsClient from '../api/HttpsClient';
import SimpleToast from 'react-native-simple-toast';
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
const { height, width } = Dimensions.get("window");
const  screenHeight= Dimensions.get("screen").height;
const themeColor = settings.themeColor;
const fontFamily = settings.fontFamily;
const url = settings.url
class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {

      username:this?.props?.route?.params?.item?.mobile|| "",
      password: '',
      token: null,
      secure:true
    };
  }
  login = async () => {
  
    if (this.state.username == "") {
      return this.showSimpleMessage(`please enter username`, "#dd7030")
    }
    if (this.state.password == "") {
      return this.showSimpleMessage(`please enter password`, "#dd7030")
    }
   
    this.setState({ loading: true })
    var data = new FormData()
    data.append("username", this.state.username)
    data.append("password", this.state.password)
    data.append("notificationId", this.state?.token||null)
    console.log(data)
    fetch(`${url}/api/HR/login/?mode=api`, {
      method: 'POST',
      body: data,
      headers: {

      }
    }).then((response) => {
      if (response.status == 200) {
        var sessionid = response.headers.get('set-cookie').split('sessionid=')[1].split(';')[0]
        AsyncStorage.setItem('sessionid', sessionid)
        console.log(sessionid, "ppp")
        var d = response.json()
        return d
      }
      else {
        return undefined
      }
    })
      
      .then((responseJson) => {
    
        if (responseJson == undefined) {
          this.setState({ loading: false })
          return this.showSimpleMessage(`incorrect username or password`, "#dd7030")
        }
        console.log(responseJson.csrf_token, "ress")
        AsyncStorage.setItem('csrf', responseJson.csrf_token)
        AsyncStorage.setItem('login', "true")
    
        return this.props.navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              {
                name: 'DefaultScreen',

              },

            ],
          })
        )
      })
      .catch((err) => {
        this.setState({ loading: false })
        return this.showSimpleMessage(`${err?.toString()}`, "#dd7030")
      })



  }
  showSimpleMessage(content, color, type = "info", props = {}) {
    const message = {
      message: content,
      backgroundColor: color,
      icon: { icon: "auto", position: "left" },
      type,
      ...props,
    };

    showMessage(message);
  }
  componentDidMount() {
    this.registerForPushNotificationsAsync().then(token => this.setState({ token }));
  }
  registerForPushNotificationsAsync = async function () {
    let token;
    if (Constants.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token,"ttttt");
    } else {
      alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return token;
  }
  render() {
    return (
      <View style={{height:screenHeight,backgroundColor:"#000"}}>
           <StatusBar backgroundColor={"#000"}/>
           <View style={{height:"50%"}}>
                 <View style={{flex:0.5,justifyContent:"center",paddingLeft:20}}>
                          {/* <View style={{alignItems:"center",justifyContent:"center",marginVertical:20}}>
                                <Image 
                                   source={require('../assets/adaptive-icon.png')}
                                   style={{height:70,width:60,}}
                                />
                             </View> */}
                             <View>
                                <Text style={[styles.text,{color:"#fff",fontSize:height*0.04,fontWeight:"bold"}]}>Let`s Sign You in.</Text>
                            </View>
                              <View>
                                <Text style={[styles.text,{color:"#fff",fontSize:height*0.03,}]}>Welcome back.</Text>
                            </View>
                       
                 </View>
                  <View style={{flex:0.5,alignItems:"center",justifyContent:"space-around",}}>
                            <View   style={{height:"30%",borderColor:"gray",borderRadius:10,borderWidth:2,width:width*0.85,alignItems:"center",justifyContent:"center"}}>
                                   <TextInput 
                                     value={this.state.username}
                              selectionColor={"#fff"}
                              style={{height:"100%",width:"90%",color:'#fff'}} 
                              placeholder={"phone or username"}
                              placeholderTextColor={"gray"}
                              onChangeText={(username)=>{this.setState({username})}}
                            />
                            </View>
                       
                    
                        <View 
                          style={{height:"30%",borderColor:"gray",borderRadius:10,borderWidth:2,width:width*0.85,flexDirection:"row",alignItems:"center",justifyContent:"center"}}
                        
                        
                        >
                            <TextInput 
                                secureTextEntry={this.state.secure}
                                value={this.state.password}
                                selectionColor={"#fff"}
                                placeholder={"password"}
                                placeholderTextColor={"gray"}
                                style={{height:"100%",width:"80%",color:"#fff"}} 
                                onChangeText={(password)=>{this.setState({password})}}
                                onSubmitEditing={()=>this.login()}
                            />
                            <TouchableOpacity 
                             onPress={()=>{this.setState({secure:!this.state.secure})}}
                            >
                                    <Entypo name={`${this.state.secure?"eye":"eye-with-line"}`} size={24} color="#fff" />
                            </TouchableOpacity>
                            </View>
                    
                  </View>
           </View>
           <View style={{height:"50%",justifyContent:"flex-end",}}>
                <View style={{flexDirection:"row",alignItems:"center",justifyContent:"center"}}>
                     <View style={{}}>
                              <Text style={[styles.text,{color:'gray'}]}>Don`t have an account?</Text>
                     </View>
                     <TouchableOpacity style={{marginLeft:10}}>
                          <Text style={[styles.text,{color:"#fff"}]}>Register</Text>
                     </TouchableOpacity>
                </View>
                <View style={{marginBottom:Constants.statusBarHeight+60,marginTop:20,alignItems:"center",justifyContent:"center"}}>
                   { !this.state.loading? <TouchableOpacity style={{width:width*0.9,height:height*0.07,alignItems:"center",justifyContent:"center",borderRadius:10,backgroundColor:"#fff"}}
                       onPress={()=>{this.login()}}
                     >
                          <Text style={[styles.text,{color:"#000"}]}>Sign In</Text>
                     </TouchableOpacity> :
                     <View style={{width:width*0.9,height:height*0.07,alignItems:"center",justifyContent:"center",borderRadius:10,backgroundColor:"#fff"}}>
                          <ActivityIndicator  size={"large"} color={"#000"}/>
                     </View>
                     
                     }
                </View>
           </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  text: {
    fontFamily
  },
  container: {
    flex: 1,
    backgroundColor: themeColor
  },
  header: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 50
  },
  footer: {
    flex: 3,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30

  },
  text_header: {
    color: "#fff",
    fontWeight: 'bold',
    fontSize: 30
  },
  text_footer: {
    color: "#05375a",
    fontSize: 18
  },
  action: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
  },
  textInput: {
    flex: 1,
    paddingLeft: 10,
    color: "#05375a"
  }
})
const mapStateToProps = (state) => {

  return {
    theme: state.selectedTheme,

  }
}
export default connect(mapStateToProps, { selectTheme })(LoginScreen);