import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, StatusBar, TouchableOpacity, SafeAreaView, Image, ActivityIndicator} from 'react-native';
import MapView,{Marker,PROVIDER_GOOGLE,Callout} from 'react-native-maps';
import settings from '../AppSettings';
import { connect } from 'react-redux';
import { selectTheme } from '../actions';
import { AntDesign } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import png from '../assets/marker/stethoscope.png'
import { WebView } from 'react-native-webview';
import HttpsClient from '../api/HttpsClient';
import mapstyle from '../map.json';
const { height, width } = Dimensions.get("window");
const themeColor = settings.themeColor;
const fontFamily =settings.fontFamily;
const url =settings.url
 class Doctors extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location:null,
      markers:[],
      load:false
    };
  }
   getMarkers =async(lat,long)=>{
         const api =`${url}/api/prescription/nearestClinic/`
          let sendData ={
            lat:lat.toString(),
            long: long.toString(),
            all:"true"
          }
         const data =await HttpsClient.post(api,sendData)
     console.log(api,"uuuoiuio")
        if(data.type=="success"){
          
          this.setState({ markers: data.data.clinics,load:false})
        }
   }
   getLocation =async()=>{
     let { status } = await Location.requestForegroundPermissionsAsync()
     if (status !== 'granted') {
       console.warn('Permission to access location was denied');
       return;
     }
     let location = await Location.getCurrentPositionAsync({});
     console.log(location,"hjhj")
     this.getMarkers(location.coords.latitude,location.coords.longitude)
     this.setState({ location: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude, 
        latitudeDelta: 0.0922, 
        longitudeDelta: 0.0421}})
   }
 componentDidMount(){
   this.getLocation()
 }
 navigate =(item)=>{
   if (item.type =="MedicalStore"){
     return this.props.navigation.navigate('ViewMedicals',{ item })
   }
    return  this.props.navigation.navigate('ViewClinic', { item })
 }
   changeRegion=(region)=>{
     this.getMarkers(region.latitude, region.longitude)
   }
  render() {
    const {location} =this.state
   console.log(this.state.ma)
    return (
        <>
        
        <SafeAreaView style={styles.bottomSafeArea}>
        <View style={styles.container}>
            <StatusBar backgroundColor={themeColor} />
         {location?<MapView 
              customMapStyle={mapstyle}
               provider ={PROVIDER_GOOGLE}
               style={styles.map} 
               region={this.state?.location}
       
              // onRegionChange={(region)=>{console.log(region)}}
              // onRegionChangeComplete={(region) => { this.changeRegion(region)}}
            >
              <Marker 
                coordinate={{ latitude: this.state.location.latitude, longitude:this.state.location.longitude }}
              
              />
              {this.state.markers.length>0&&
                this.state.markers.map((item,index)=>{
                     let dp =null
                  if (item.displayPicture){
                    dp = `${url}${item.displayPicture}`
             
                  }
                    return(
                      <Marker
                         style={{height:100}}
                         key={index}
                        coordinate={{ latitude: Number(item?.lat), longitude: Number(item?.long,)  }}
                        image={require('../assets/marker/custommarker.png')}
                      >
                        <MapView.Callout
                          tooltip={true}
                          onPress={() => { this.navigate(item) }}
                        >
                          <View style={{ height: height * 0.2, backgroundColor: "#fff", width: width * 0.4, alignItems: "center", borderRadius:5 }}>
                            <Text style={{ height: 80 }}>
                              <Image
                                source={{
                                  uri: dp
                                }}
                                style={{ width: 60, height: 60, resizeMode: "cover" }}
                              />
                            </Text>
                             <View style={{alignItems:'center',justifyContent:'center',flexDirection:"row"}}>
                              <Text style={[styles.text]}>{item.title}</Text>
                              <View style={{marginLeft:5,backgroundColor:'green',height:10,width:10,borderRadius:5}}>
                                  
                              </View>
                             </View>
                            <View style={{alignItems:'center',justifyContent:"center"}}>
                              <Text style={[styles.text, { color: "gray" }]}>{item.type}</Text>
                            </View>
                          





                          </View>
                          <View style={styles.triangle}>

                          </View>
                        </MapView.Callout>
                     
                      </Marker>
                    )
                })
            }
             
                
            </MapView>:<View>
                 <ActivityIndicator size ="large" color ={themeColor} />
              </View>}
            
           
         
            <TouchableOpacity style={{position:"absolute",top:15,width:width*0.9,height:height*0.05,borderRadius:20,backgroundColor:"#fff",justifyContent:"space-around",paddingHorizontal:20,flexDirection:"row",alignItems:"center"}}
          onPress={() => this.props.navigation.navigate('SearchDoctors')}
            >
                 <AntDesign name="search1" size={24} color={themeColor} />
                 <View style={{alignItems:"center",justifyContent:"center"}}>
                    <Text style={[styles.text,{fontSize:12}]}>doctor, clinic, specialization or health issues</Text>
                 </View>
                 
            </TouchableOpacity>
            <View 
              style={{ position: "absolute", bottom: 150, right: 30 }}
            >
              {!this.state.load?<TouchableOpacity 
                onPress={() => {
                  this.setState({ load: true })
                  this.getLocation()
                }}
              >
                <MaterialIcons name="my-location" size={30} color="black" />
              </TouchableOpacity>:<ActivityIndicator color={themeColor} size="large"/>}
            </View>
           
        </View>
        </SafeAreaView>
      </>
    );
  }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    map: {
        flex:1,
        width: Dimensions.get("screen").width,
        height: Dimensions.get( "screen").height,
    },
    text:{
      fontFamily,
    },
  topSafeArea: {
    flex: 0,
    backgroundColor: themeColor
  },
  bottomSafeArea: {
    flex: 1,
    backgroundColor: "#fff"
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 10,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#fff",
    transform: [{ rotate: "180deg" }],
    alignSelf:'center'
  },
});
const mapStateToProps = (state) => {

  return {
    theme: state.selectedTheme,

  }
}
export default connect(mapStateToProps, { selectTheme })(Doctors);