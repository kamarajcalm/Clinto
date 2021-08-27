import React, { Component } from 'react';
import { View, Text, StatusBar, Dimensions, Image, StyleSheet, TouchableOpacity, AsyncStorage, SafeAreaView, ScrollView, Linking,ActivityIndicator, TextInput, KeyboardAvoidingView, Platform ,Keyboard,KeyboardEvent, Alert} from 'react-native';
import settings from '../AppSettings';
import axios from 'axios';
import Modal from 'react-native-modal';
import { Ionicons, Entypo, AntDesign, FontAwesome, MaterialCommunityIcons, MaterialIcons, FontAwesome5} from '@expo/vector-icons';
const { height } = Dimensions.get("window");
const { width } = Dimensions.get("window");
const url =settings.url
const themeColor = settings.themeColor;
const fontFamily = settings.fontFamily;
import { connect } from 'react-redux';
import { selectTheme ,selectUser} from '../actions';
import { NavigationContainer, CommonActions } from '@react-navigation/native';
import * as Location from 'expo-location';
import GetLocation from 'react-native-get-location';
import MapView,{ Marker, PROVIDER_GOOGLE, Callout } from 'react-native-maps';
import HttpsClient from '../api/HttpsClient';
import mapstyle from '../map.json';
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";
const screenHeight = Dimensions.get("screen").height
import Shimmer from '../components/Shimmer';
class SelectAddress extends Component {
    constructor(props) {
     
        super(props);
        this.state = {
                location:null,
                address:"",
                latitude:null,
                longitude:null,
                completeAddress:"",
                keyBoardHeight:0,
                Floor:""
        };
    }

   getCurrenLocation =async() =>{
     let { status } = await Location.requestForegroundPermissionsAsync()
     if (status !== 'granted') {
        Alert.alert(
        "User location not detected",
        "You haven't granted permission to detect your location.",
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
      );
       return;
     }
     Location.installWebGeolocationPolyfill();
          GetLocation.getCurrentPosition({
    enableHighAccuracy: true,
    timeout: 15000,
})
.then(async(location) => {
   
        let  address = await   Location.reverseGeocodeAsync({
           latitude: location.latitude,
           longitude: location.longitude,
       })
        console.log(address,"kkkkkk");
     this.setState({ address:`${address[0]?.district},${address[0].subregion}-${address[0].postalCode}`})
      this.setState({ location: {
        latitude: location.latitude,
        longitude: location.longitude, 
        latitudeDelta: 0.001, 
        longitudeDelta: 0.001
    },
        latitude: location.latitude,
        longitude: location.longitude, 
    })
})
.catch(error => {
    const { code, message } = error;
    Alert.alert("Please enable Location")
})
   }
       handleChange = async(region)=>{

        
            this.setState({fetching:true})
          
            let address = await Location.reverseGeocodeAsync({
                latitude: region.latitude,
                longitude:region.longitude,
            })
            console.log(address)
            this.setState({ 
                address: `${address[0]?.district},${address[0].subregion}-${address[0].postalCode}`, 
                fetching: false, 
                location:{
                    latitude: region.latitude,
                    longitude: region.longitude,
                    latitudeDelta:0.012,
                    latitudeDelta:0.012
                } ,
               latitude: region.latitude,
                longitude: region.longitude,
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
        console.log(this.props.user)
        Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
      this.getCurrenLocation();
    }
    componentWillUnmount(){
        Keyboard.removeListener('keyboardDidShow', this._keyboardDidShow);
        Keyboard.removeListener('keyboardDidHide', this._keyboardDidHide);
    }
    chatClinic = async(item)=>{
   
    }
        _keyboardDidShow = (e) => {
            console.log()
        this.setState({keyBoardHeight:e.endCoordinates.height})
    };

    _keyboardDidHide = () => {
        this.setState({ keyBoardHeight: 0 })
    };
        getSelfMode = async()=>{
        const data = await HttpsClient.get(`${url}/api/HR/users/?mode=mySelf&format=json`);
        if(data.type =="success"){
            this.props.selectUser(data.data[0]);
        }
  
    
    }
    saveAddress = async() =>{
  
        this.setState({saving:true})
        if(this.state.completeAddress == ""){
              this.setState({saving:false})
            return this.showSimpleMessage("Please enter Complete Address","orange","info")
        }
             let api = `${url}/api/profile/userss/${this.props.user.profile.id}/`
        let sendData ={
            address:this.state.completeAddress,
            lat:this.state.latitude,
            lang:this.state.longitude,
            landmark:this.state.Floor,
            location:this.state.address
        }
        let patch = await HttpsClient.patch(api,sendData)
        if(patch.type =="success"){
             this.setState({saving:false})
            this.getSelfMode()
            const address = {
                    address: this.state.address,
                    latitude: this.state.latitude,
                    longitude: this.state.longitude,
                    completeAddress:this.state.completeAddress,
                    floor:this.state.Floor
                }
                this.props.route.params.backFunction(address)
                this.props.navigation.goBack()
        }else{
            this.showSimpleMessage("Try Again", "red", "danger")
            this.setState({saving:false})
        }

    }
    addressDetails =() =>{
        return(
             <Modal 
            swipeThreshold={100}
            onSwipeComplete={() => { this.setState({ showModal:false})}}
            swipeDirection="down"
            animationOutTiming={50}
            animationOut={"slideOutDown"}
            style={{alignItems:"flex-end",marginHorizontal:0,flexDirection:"row",marginVertical:0,marginBottom:this.state.keyBoardHeight}}
             statusBarTranslucent={true}
             deviceHeight={screenHeight}
             isVisible={this.state.showModal}
           >
                

               
               <ScrollView style={{height:height*0.5,backgroundColor:"#fff",width,elevation:5,borderTopRightRadius:15,borderTopLeftRadius:15}}>
                   <View style={{flexDirection:"row"}}>
                       <View style={{flex:0.3}}>

                       </View>
                       <View style={{flex:0.5,alignItems:"center",justifyContent:"center"}}>
                            <View style={{height:5,width:width*0.1,backgroundColor:"gray",marginVertical:10,borderRadius:5}}>
                             </View>
                       </View>
                        <View style={{flex:0.3,alignItems:"center",justifyContent:"center"}}>
                            
                         </View>
                   </View>
        
                   <View style={{}}>
                       <View style={{alignItems:"center",justifyContent:"center"}}>
                           <Text style={[styles.text,{color:"#000",textDecorationLine:"underline"}]}>Address & Details</Text>
                       </View>
                        <View style={{marginTop:10,paddingHorizontal:10}}>
                           <Text style={[styles.text]}>Your Location</Text>
                       </View>
                       <View style={{paddingLeft:20,borderBottomWidth:1,borderColor:"#eeee",paddingVertical:10}}>
                                  <Text style={[styles.text]}>{this.state.address}</Text>
                       </View>
                       <View style={{marginTop:10,paddingHorizontal:10}}>
                           <Text style={[styles.text]}>Complete Address *</Text>
                       </View>
                       <TextInput 
                          value={this.state.completeAddress}
                          style={{height:35,width:"100%",paddingLeft:20,borderBottomWidth:1,borderColor:"#eeee"}}
                          selectionColor ={themeColor}
                          onChangeText={(completeAddress)=>{this.setState({completeAddress})}}
                       />
                        <View style={{marginTop:10,paddingHorizontal:10}}>
                           <Text style={[styles.text]}>Floor (Optional)</Text>
                       </View>
                       <TextInput 
                          value={this.state.Floor}
                          style={{height:35,width:"100%",paddingLeft:20,borderBottomWidth:1,borderColor:"#eeee"}}
                          selectionColor ={themeColor}
                          onChangeText={(Floor)=>{this.setState({Floor})}}
                       />
                   </View>
                   <View style={{alignItems:"center",justifyContent:"center",marginVertical:20}}
                    
                   >
                         <TouchableOpacity style={{height:height*0.05,width:width*0.3,alignItems:"center",justifyContent:"center",backgroundColor:themeColor,borderRadius:10}}
                           onPress ={()=>{this.saveAddress()}}
                         >
                                <Text style={[styles.text,{color:"#fff"}]}>Save</Text>
                         </TouchableOpacity>
                   </View>
               </ScrollView>
                
           </Modal> 
        )
    }
 render() {
      let marker = <View style={{ position: "absolute", bottom: height * 0.7, alignItems: "center", justifyContent: "center", right: width * 0.48 }}>
          <Marker 
          style={{height:48,width:48,position:"absolute"}}
           coordinate={this.state?.location}
        
          >
              <FontAwesome5 name="map-marker" size={40} color={themeColor} />
          </Marker>
       
      </View>
      if(this.state.location == null){
          return(
              <View style={{flex:1,alignItems:"center",justifyContent:"center"}}>
                  <ActivityIndicator  size={"large"} color={themeColor}/>
              </View>
              
            
          )
      }
    return (
      <View style={{flex:1}}>
          <MapView 
                customMapStyle={mapstyle}
                provider={PROVIDER_GOOGLE}
                style={{flex:0.7}}
                initialRegion={this.state?.location}
                showsMyLocationButton={true}
                showsPointsOfInterest={true}
                showsUserLocation={true}
                followsUserLocation={true}
                onRegionChangeComplete={this.handleChange}
          >
            
          </MapView>
            
          <View style={{flex:0.3}}>
                <View style={{paddingVertical:10,paddingHorizontal:20,borderBottomWidth:0.5,borderColor:"gray"}}>
                    <Text style={[styles.text,{color:"#000",fontSize:20}]}>Select An Delivery Location</Text>
                </View>
                <View style={{ paddingVertical: 10, paddingHorizontal: 20, borderBottomWidth: 0.5, borderColor: "gray"}} >
                    <View>
                        <Text style={[styles.text]}>YOUR LOCATION</Text>
                    </View>
                     <View>
                         {
                            this.state.fetching ? <ActivityIndicator color={themeColor} size={"large"}/> : <Text style={[styles.text, { color: "#000", fontSize: 22 }]}>{this.state.address}</Text>
                         }
                          
                     </View>
                </View>
                <View style={{alignItems:"center",justifyContent:"center",flex:1}}>
                    <TouchableOpacity style={{backgroundColor:themeColor,height:height*0.05,width:width*0.5,alignItems:'center',justifyContent:"center"}}
                        onPress={() => {
                       
                            this.setState({showModal:true})
                        }}
                    >
                         <Text style={[styles.text,{color:"#fff"}]}>CONFIRM LOCATION</Text>
                    </TouchableOpacity>
                </View>
          </View>

                                              {/* ABSOLUTE POSITIONSS */}
            <View style={{
                left: '50%',

                position: 'absolute',
                top: '30%'
            }}
            >
                <FontAwesome5 name="map-marker" size={40} color={themeColor} />
            </View>
            <View style={{ position: "absolute", right: 20, bottom: height * 0.3 }}>
                <TouchableOpacity
                    style={[styles.roundWithShadow]}
                    onPress={() => { this.getCurrenLocation()}}
                >
                    <MaterialIcons name="my-location" size={24} color="black" />
                </TouchableOpacity>
            </View>
            <View style={{ position: "absolute", left: 20, top: 30 }}>
                <TouchableOpacity
                    style={[styles.roundWithShadow]}
                    onPress={() => { 
                        // const address = {
                        //     address:this.state.address,
                        //     latitude:this.state.latitude,
                        //     longitude:this.state.longitude
                        // }
                        // this.props.route.params.backFunction(address)
                        this.props.navigation.goBack() 
                    }}
                >
                    <Ionicons name="arrow-back-outline" size={24} color="black" />
                </TouchableOpacity>

            </View>
            {
                this.addressDetails()
            }
      </View>
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
        user:state.selectedUser
    }
}
export default connect(mapStateToProps, { selectTheme ,selectUser})(SelectAddress)