import React, { Component } from 'react';
import { View, Text, Dimensions, Image, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, ActivityIndicator, Platform, StatusBar, AsyncStorage, TouchableWithoutFeedback ,Keyboard} from 'react-native';
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
import Modal from 'react-native-modal';
const clinicPng = "https://down-yuantu.pngtree.com/original_origin_pic/19/02/28/578033d86c05cf30ad84ef1f805beff5.png?e=1632225256&st=Njk5MmIwMTVjZTNkZTJkNjc5MGMzMmFiZWE3ZGFmOGI&n=%E2%80%94Pngtree%E2%80%94medical+clinic+building+illustration_4584268.png"
const pharmacyPng=  "https://download.flaticon.com/download/icon/3140343?icon_id=3140343&author=352&team=352&keyword=Pharmacy&pack=3140269&style=Flat&style_id=919&format=png&color=%23000000&colored=2&size=512&selection=1&premium=0&type=standard&token=03AGdBq26sKVbmgqawJP0C3Y9No0VHvvy3KdZ8IQ2gKXr9NpyA52FphGwMuZHuQqzozJs3_f8WDfbThswVUuo2ThkxtYQB0yYy6359IugnkERBFlQ7wPeJu9ZwGo8Z9XfBE4AfU0ggBPxdlUtsm6WvgWTpNji4WzqZdEaMLt2lkvGcvTv4ELDwJ-Maq9it-XFkta6n06KXJNcx9TQTE_lD9gaIhBM0VAb9VKmPTBP6h6DDaUPqXdk4W0BfDMB2DTJruTdsl1N0muTTScAZDf2niCgoi6dSy3bg0oOgo3TPGd8w06-c6NO5uH2G_aS37eoujppcDcFESDOUXfpjsa_fM0t7bLR3eoVctCqgCZi8xNVok95LmMXNkwp7Xrs3NTl5192Y9YnnGZaYqBf5xHRRS_q7n7oeU3AnLVZGM1WOB_mqNrgsUmTcweZ9T868AXNv0RgBW7crwK3sReVCWqv9mtwoK7ERv0WPlTh6oWdiyqwZebtSLI4j036Gyj2vLErMyos9SgiIwXdpdIyczFRtfKZXhRMh3vpa1VA9RmNvp4nMaPLvWlsAva00_vS5whVDuWo_2llTeZsplUt1G7ctN7mi31kN9_4SjMo-QYTltKDt1XfTVL7EacCkoaYD163R9TtkExezp3P151lbYln-70ulf4WOMzuGkRIOAG1pzWRKOKsS4-j71xmJTpxsj8ntnvJ095wAmKIYPkClU6o7xm1p3silXcp7AV1cpQ_k58psrEZlCbyvFWIlg9oXS6qMpkN32AgCb7Xb5h5syaUhLILkECLjcgXvrTq1uS_n0deox19FesEQmfUFZtjrXwLuCOAoPr1hFQFZ3i2I1Vqy4ek2HuWjuHBH9uA4wYyb0AJiFNKJ1HvKbVcpQ4LcYY_POppDRonQ41lf3jfDmX3r0Zeunx4r91FcHdxck1onLWgOBONAg6d7wXeihEzuJX3KN0Arq6OHKp-DJy5Oi29CUzditq7_sXJkpovHQOFr9_5G6cjcDvE8vQrwtzZWbPD2QMuGZGCMXUG2UwXBYN7b5fUMJYuf57rSYtpAhXjxJ6_iJQIYTX68NhaLRstuPIsbL8tgZtc07dlVTuDrEJRE0FTmgDxd3nECYDRyZmiY3sn1eKSjseGRusrRnTKXVItOqYb9dFsXIEBiMc2gXsMYyD-y-FXyUN7FDaKuBfvhvvXEzLbTZ3sKMwDwXBl5qFxcVruAthPP24Llh9ZUojq2oge7y-cXL5hyMg&search=pharmacy&_gl=1*1gsh5a3*_ga*MTIyNzIzMzQ5OS4xNjMwNTY1MjY5*_ga_3Q8LH3P0VP*MTYzMjIyMjExNC40LjEuMTYzMjIyMjEyNC4w"
const diagnosticCenter = "https://download.flaticon.com/download/icon/3470182?icon_id=3470182&author=219&team=219&keyword=Diagnostic+tool&pack=3470119&style=Flat&style_id=911&format=png&color=%23000000&colored=2&size=512&selection=1&premium=0&type=standard&search=diagnostic&_gl=1*paazi3*_ga*MTIyNzIzMzQ5OS4xNjMwNTY1MjY5*_ga_3Q8LH3P0VP*MTYzMjIyMjExNC40LjEuMTYzMjIyMjUxMy4w"
const Patient = "https://download.flaticon.com/download/icon/3159817?icon_id=3159817&author=409&team=409&keyword=Medical+mask&pack=packs%2Fcovid-protection-measures&style=8&format=png&color=%23000000&colored=2&size=512&selection=1&premium=0&type=standard&search=patient&_gl=1*1b3cbi0*_ga*MTIyNzIzMzQ5OS4xNjMwNTY1MjY5*_ga_3Q8LH3P0VP*MTYzMjIyMjExNC40LjEuMTYzMjIyMzc0MS4w"
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
      secure:true,
      registerModal:false
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
  registerModal = ()=>{
    return(
      <Modal 
        onBackdropPress ={()=>{this.setState({registerModal:false})}}
        isVisible={this.state.registerModal}
        deviceHeight={screenHeight}
        statusBarTranslucent={true}
      >
        <View style={{flex:1,alignItems:"center",justifyContent:"center"}}>
           <View style={{height:height*0.6,backgroundColor:"gray",borderRadius:10,width:width*0.9}}>
               <View style={{marginVertical:20,alignItems:"center",justifyContent:"center"}}>
                   <Text style={[styles.text,{color:"#000",fontSize:height*0.04}]}>Select </Text>
               </View>
                         <View style={{flex:1,alignItems:"center",justifyContent:"space-around"}}>
                <TouchableOpacity style={{flexDirection:"row",alignItems:"center",justifyContent:"space-around"}}
                 onPress={()=>{
                    this.setState({registerModal:false})
                   this.props.navigation.navigate("CreateAccount")
                  }}
                >
                       <View style={{flex:0.4,alignItems:"center",justifyContent:"center"}}>
                          <Image 
                            source={{uri:Patient}}
                            style={{height:50,width:50,alignSelf:"flex-end"}}
                          />
                     </View>
                <View style={{flex:0.1,alignItems:"center",justifyContent:"center"}}>
                              <Text style={[styles.text,{color:"#000",height:height*0.02}]}> - </Text>
                       </View>
                      <View style={{flex:0.5}}>
                          <Text style={[styles.text,{color:"#000"}]}>User (Patient)</Text>
                      </View>
                </TouchableOpacity>
                <TouchableOpacity style={{flexDirection:"row"}}>
                     <View style={{flex:0.4,alignItems:"center",justifyContent:"center"}}>
                          <Image 
                            source={{uri:clinicPng}}
                            style={{height:50,width:50,alignSelf:"flex-end"}}
                          />
                     </View>
                       <View style={{flex:0.1,alignItems:"center",justifyContent:"center"}}>
                              <Text style={[styles.text,{color:"#000"}]}> - </Text>
                       </View>
                      <View style={{flex:0.5,justifyContent:"center"}}>
                          <Text style={[styles.text,{color:"#000",fontSize:height*0.02}]}>Clinic </Text>
                      </View>
                </TouchableOpacity>
                  <TouchableOpacity style={{flexDirection:"row",alignItems:"center",justifyContent:"space-around"}}>

                       <View style={{flex:0.4,alignItems:"center",justifyContent:"center"}}>
                          <Image 
                            source={{uri:pharmacyPng}}
                            style={{height:50,width:50,alignSelf:"flex-end"}}
                          />
                     </View>
                      <View style={{flex:0.1,alignItems:"center",justifyContent:"center"}}>
                              <Text style={[styles.text,{color:"#000",height:height*0.02}]}> - </Text>
                       </View>
                      <View style={{flex:0.5}}>
                          <Text style={[styles.text,{color:"#000"}]}>Pharmacy </Text>
                      </View>
                </TouchableOpacity>
                  <TouchableOpacity style={{flexDirection:"row",alignItems:"center",justifyContent:"space-around"}}>
                       <View style={{flex:0.4,alignItems:"center",justifyContent:"center"}}>
                          <Image 
                            source={{uri:diagnosticCenter}}
                            style={{height:50,width:50,alignSelf:"flex-end"}}
                          />
                     </View>
                <View style={{flex:0.1,alignItems:"center",justifyContent:"center"}}>
                              <Text style={[styles.text,{color:"#000",height:height*0.02}]}> - </Text>
                       </View>
                      <View style={{flex:0.5}}>
                          <Text style={[styles.text,{color:"#000"}]}>Diagnostic Center </Text>
                      </View>
                </TouchableOpacity>
        
           </View>
           </View>
 
        </View>
      </Modal>
    )

  }
  render() {
    return (
      <TouchableWithoutFeedback 
      
       onPress={()=>{
           Keyboard.dismiss()
       }}
      >

   
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
                           <TouchableOpacity 
                             onPress={()=>{this.props.navigation.navigate("ForgotPassword")}}
                           >
                               <Text style={[styles.text,{color:"gray"}]}>Forgot Password?</Text>
                           </TouchableOpacity>
                  </View>
           </View>
           <View style={{height:"50%",justifyContent:"flex-end",}}>
                <View style={{flexDirection:"row",alignItems:"center",justifyContent:"center"}}>
                     <View style={{}}>
                              <Text style={[styles.text,{color:'gray'}]}>Don`t have an account?</Text>
                     </View>
                     <TouchableOpacity style={{marginLeft:10}}
                      onPress={()=>{this.setState({registerModal:true})}}
                     >
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
                {
           this.registerModal()
         }
      </View>
    
         </TouchableWithoutFeedback>
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