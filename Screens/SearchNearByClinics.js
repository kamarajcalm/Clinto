import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, StatusBar, TouchableOpacity, SafeAreaView, Image, ActivityIndicator, Alert,PermissionsAndroid, Platform,ScrollView,FlatList} from 'react-native';
import MapView,{Marker,PROVIDER_GOOGLE,Callout} from 'react-native-maps';
import settings from '../AppSettings';
import { connect } from 'react-redux';
import { selectTheme } from '../actions';
import { AntDesign ,Ionicons,FontAwesome5} from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import png from '../assets/marker/stethoscope.png'
import { WebView } from 'react-native-webview';
import HttpsClient from '../api/HttpsClient';
import mapstyle from '../map.json';
import GetLocation from 'react-native-get-location';
import ShimmerLoader from '../components/ShimmerLoader';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

import SearchClinicView from '../components/SearchClinicView';
import SearchPharmacyView from '../components/SearchPharmacyView';
import SearchDiagnosisCenterView from '../components/SearchDiagnosisCenterView';

const { height, width } = Dimensions.get("window");
const themeColor = settings.themeColor;
const fontFamily =settings.fontFamily;
const url =settings.url
 class SearchNearByClinics extends Component {
  constructor(props) {
    super(props);
  const routes = [
            { key: 'Clinics', title: 'Clinics' },
            { key: 'Pharmacy', title:'Pharmacy'},
            { key: 'DiagnosisCenter', title:'DiagnosisCenter'},
        ];
    this.state = {
       load:true,
       clinics:[],
       index: 0,
       routes,
       labCenters:[],
       clinics:[],
       Pharmacy:[],
       location:null
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
         console.log(data)
        if(data.type=="success"){
          
          this.setState({ clinics: data.data.clinics,labCenters:data.data.cente,load:false})
        }else{
           this.setState({load:false})
        }
   }
//    getLocation =async()=>{
 
//      let { status } = await Location.requestForegroundPermissionsAsync()
//      if (status !== 'granted') {
//         Alert.alert(
//         "User location not detected",
//         "You haven't granted permission to detect your location.",
//         [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
//       );
//        return;
//      }
//    Location.getCurrentPositionAsync();

//        Location.installWebGeolocationPolyfill();

//     GetLocation.getCurrentPosition({
//     enableHighAccuracy: true,
//     timeout: 15000,
//     })
//     .then(location => {
//     console.log(location,"kkkkkk");
//            this.getMarkers(location.latitude,location.longitude)
//       this.setState({ location: {
//         latitude: location.latitude,
//         longitude: location.longitude, 
//         latitudeDelta: 0.001, 
//         longitudeDelta: 0.001}})
// })
// .catch(error => {
//     const { code, message } = error;
//     console.warn(code, message);
// })
//       //     let location = await Location.getLastKnownPositionAsync()
//       //     console.log(location,"hjhj")
   
     

//    }
   getAndroidLocation = async()=>{
         Location.installWebGeolocationPolyfill();
     try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        'title': 'Example App',
        'message': 'Example App access to your location '
      }
    )
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
       navigator.geolocation.getCurrentPosition(
          position=>{
            this.setState({location:{lat:position.coords.latitude,lng:position.coords.longitude},load:false})
            
          },
          error=>this.getAndroidLocation(),
          {enableHighAccuracy:true,timeout:20000,maximumAge:1000}
       );
    } else {
      console.log("location permission denied")
      alert("Location permission denied");
    }
  } catch (err) {
    console.warn(err)
  }
   }
 componentDidMount(){
   if(Platform.OS=="android"){
     this.getAndroidLocation()
   }else{
      // this.getLocation()
   }
 
 }
      renderScene = ({ route, }) => {
         switch (route.key) {
             case 'Clinics':
                 return <SearchClinicView navigation={this.props.navigation} location={this.state.location}/>
             case 'Pharmacy':
                 return <SearchPharmacyView navigation={this.props.navigation} location={this.state.location} />
             case 'DiagnosisCenter':
                 return <SearchDiagnosisCenterView navigation={this.props.navigation} location={this.state.location} />
             default:
                 return null;
         }
     };

   changeRegion=(region)=>{
     this.getMarkers(region.latitude, region.longitude)
   }
      setRate =(rating,index) =>{
        let duplicate = this.state.clinics
        duplicate[index].rating= rating
        this.setState({orders:duplicate})
   }
  render() {
    const { index, routes } = this.state
 
    return (
        <>
        
        <SafeAreaView style={styles.bottomSafeArea}>
        <View style={styles.container}>
         <StatusBar backgroundColor={themeColor} />
            <View style={{alignItems:"center",justifyContent:"center"}}>
                           <TouchableOpacity style={[styles.boxWithShadow,{width:width*0.9,height:height*0.05,borderRadius:20,backgroundColor:"#fff",justifyContent:"space-around",paddingHorizontal:20,flexDirection:"row",alignItems:"center",marginVertical:20}]}
                      onPress={() => this.props.navigation.navigate('SearchDoctors')}
                        >
                            <View style={{flex:0.1}}>
                                  <AntDesign name="search1" size={24} color={themeColor} />
                            </View>
                
                            <View style={{alignItems:"center",justifyContent:"center",flex:0.9}}>
                                <Text style={[styles.text,{fontSize:12}]} numberOfLines={1}>doctor, clinic, specialization or health issues</Text>
                            </View>
                            
                        </TouchableOpacity>
            </View>
    
           {
             this.state.load?
                <ScrollView>
                          <ShimmerLoader />
                          <ShimmerLoader />
                          <ShimmerLoader />
                </ScrollView>:
                       <TabView
                        style={{ backgroundColor: "#ffffff", }}
                        navigationState={{ index, routes }}
                        renderScene={this.renderScene}
                        onIndexChange={(index) => { this.setState({ index }) }}
                        initialLayout={{ width }}
                        renderTabBar={(props) =>
                            <TabBar
                                {...props}
                                renderLabel={({ route, focused, color }) => (
                                    <Text style={[styles.text,{ color: focused ? themeColor : 'gray' }]}>
                                        {route.title}
                                    </Text>
                                )}
                                style={{ backgroundColor: "#fff", height: 50, fontWeight: "bold", color: "red" }}
                                labelStyle={{ fontWeight: "bold", color: "red" }}
                                indicatorStyle={{ backgroundColor: themeColor, height: 2 }}
                            />
                        }

                />
           
                
    
              
           }
      
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
      boxWithShadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5
    }
});
const mapStateToProps = (state) => {

  return {
    theme: state.selectedTheme,

  }
}
export default connect(mapStateToProps, { selectTheme })(SearchNearByClinics);