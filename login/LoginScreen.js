import React, { Component } from 'react';
import { View, Text, Dimensions, Image, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, ActivityIndicator, Platform, StatusBar, AsyncStorage} from 'react-native';
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
const themeColor = settings.themeColor;
const fontFamily = settings.fontFamily;
const url = settings.url
 class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username:"",
      password:'',
      token:null,
    };
  }
   login =async()=>{
     if(this.state.username==""){
       return this.showSimpleMessage(`please enter username`, "#dd7030")
     }
     if (this.state.password == "") {
       return this.showSimpleMessage(`please enter password`, "#dd7030")
     }
  this.setState({loading:true})
   let api = `${url}/api/HR/login/?mode=api`
  //  let sendData= new FormData();
  //  sendData.append('username',this.state.username)
  //  sendData.append('password',this.state.password)
  //  console.log(sendData,"jjj")
let sendData ={
  username: this.state.username,
  password: this.state.password,
  notificationId:this.state?.token,
  bodyType:"formData"
}


     let login  =await HttpsClient.post(api,sendData)
     console.log(login)
 
   if(login.type=="success"){
     AsyncStorage.setItem('csrf', login.data.csrf_token)
     AsyncStorage.setItem('sessionid', login.data.csrf_token)
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
            if (login.data.title =="superadmin"){
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
            }
     if (login.data.title == "Doctor") {
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
     }
   }
    else{
     this.setState({ loading: false})
     return this.showSimpleMessage(`${login?.error?.toString()||login.data.message}`, "#dd7030")
    }
 

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
   componentDidMount(){
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
       console.log(token);
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
      <KeyboardAvoidingView
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
        style={styles.container}>
          <StatusBar backgroundColor={themeColor}/>
          <View style={styles.header}>
              <Text style={styles.text_header}>Welcome !</Text>
          </View>
          <View style={styles.footer}>
              <Text style={styles.text_footer}>Mobile or username</Text>
              <View style={styles.action}>
                <View style={{alignItems:"center",justifyContent:"center"}}>
                     <AntDesign name="mobile1" size={20} color="#05375a" />
                </View>
                  
                    <TextInput 
                       value={this.state.username}
                       selectionColor={themeColor}
                       placeholder="your username or mobile"
                       style={styles.textInput}
              onChangeText={(text) => { this.setState({ username:text})}}
                    />
              </View>
          <Text style={[styles.text_footer,{marginTop:35}]}>Password</Text>
          <View style={styles.action}>
            <View style={{alignItems:"center",justifyContent:"center"}}>
              <Entypo name="lock-open" size={24} color="#05375a" />
            </View>
       
         
            <TextInput
              selectionColor={themeColor}
              value={this.state.password}
              placeholder="Your Password"
              style={styles.textInput}
              onChangeText={(password) => { this.setState({ password }) }}
            />
          </View>
          <View style={{marginTop:20,flexDirection:"row",justifyContent:"space-between"}}>
            <TouchableOpacity 
              style={{}}
              onPress={()=>{this.props.navigation.navigate('ForgotPassword')}}
            >
              <Text style={[styles.text,{fontWeight:"bold"}]}>Forgot Password?</Text>
           
            </TouchableOpacity>
            <TouchableOpacity
              style={{}}
              onPress={() => { this.props.navigation.navigate('CreateAccount') }}
            >
              <Text style={[styles.text,{fontWeight:"bold"}]}>Don`t have an account?</Text>

            </TouchableOpacity>
          
          </View>
          <View style={{ alignItems: "center", justifyContent: 'center', marginTop: 30 }}>

            {!this.state.loading ? <TouchableOpacity style={{ backgroundColor: themeColor, width: width * 0.4, height: height * 0.06, alignItems: 'center', justifyContent: "center", borderRadius: 10 }}
              onPress={() => { this.login() }}
            >
              <Text style={{ color: "#fff" }}>Login </Text>
            </TouchableOpacity> :
              <ActivityIndicator size="large" color={themeColor} />
            }
          </View>
          </View>
      {/* <View style={{flex:1,backgroundColor:themeColor}}> 
          <View style={{flex:0.3,alignItems:'center',justifyContent:"center"}}>
                <Animatable.Image
                    animation="fadeIn"
                    source={{ uri:"https://cdn.pixabay.com/photo/2017/08/21/02/24/png-2663876_960_720.png"}}
                    style={{height:"50%",width:"50%",resizeMode:"contain"}}
               />
          </View>
            <Animatable.View style={[{flex:0.7,backgroundColor:"#fff",borderTopLeftRadius:50,paddingLeft:30,paddingTop:30}]}
                animation="slideInUp"
            >
             <View>
                 <Text style={[styles.text,{}]}>Enter Mobile</Text>
                 <View style={{width:width*0.7,height:height*0.07}}>
                      <TextInput 
                        maxLength={10}
                        value={this.state.mobileNO}
                        selectionColor={themeColor}
                        autoFocus={true}
                  onChangeText={(text) => { this.setState({ mobileNO:text})}}
                        keyboardType="numeric"
                        style={{ width: '100%', height: "100%", borderBottomWidth: 1, borderColor: "#000",alignItems:'center',justifyContent:'flex-start',paddingLeft:20}}
                      />
                 </View>
              <Text style={[styles.text, {marginVertical:5}]}>Enter PassWord</Text>
              <View style={{ width: width * 0.7, height: height * 0.07 }}>
                <TextInput
                  secureTextEntry={true}
                  value={this.state.password}
                  selectionColor={themeColor}
                  onChangeText={(text) => { this.setState({ password: text }) }}
                  style={{ width: '100%', height: "100%", borderBottomWidth: 1, borderColor: "#000", alignItems: 'center', justifyContent: 'flex-start', paddingLeft: 20 }}
                />
              </View>
                 <View style={{alignItems:"center",justifyContent:'center',marginTop:40}}>
                   
                    { !this.state.loading? <TouchableOpacity style={{backgroundColor:themeColor,width:width*0.4,height:height*0.06,alignItems:'center',justifyContent:"center",borderRadius:10}}
                            onPress={() => {this.sendOTP()}}
                      >
                          <Text style={{color:"#fff"}}>Login </Text>
                      </TouchableOpacity>:
                        <ActivityIndicator  size="large" color={themeColor}/>
                      }
                 </View>
             </View>
          </Animatable.View>
      </View> */}
      </KeyboardAvoidingView>
    );
  }
}
const styles=StyleSheet.create({
    text:{
        fontFamily
    },
  container: {
    flex: 1,
    backgroundColor:themeColor
  },
  header:{
    flex:1,
    justifyContent:'flex-end',
    paddingHorizontal:20,
    paddingBottom:50
  },
  footer:{
    flex:3,
    backgroundColor:"#fff",
    borderTopLeftRadius:30,
    borderTopRightRadius:30,
    paddingHorizontal:20,
    paddingVertical:30
  
  },
  text_header:{
    color:"#fff",
    fontWeight:'bold',
    fontSize:30
  },
  text_footer:{
    color:"#05375a",
    fontSize:18
  },
  action:{
    flexDirection:"row",
    marginTop:10,
    borderBottomWidth:1,
    borderBottomColor:"#f2f2f2",
  },
  textInput:{
    flex:1,
    paddingLeft:10,
    color:"#05375a"
  }
})
const mapStateToProps = (state) => {

    return {
        theme: state.selectedTheme,

    }
}
export default connect(mapStateToProps, { selectTheme })(LoginScreen);