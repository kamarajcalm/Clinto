import { LinearGradient } from 'expo-linear-gradient'
import React, { Component } from 'react'
import { Text, TouchableOpacity, View ,StyleSheet, Dimensions,Linking,FlatList,Image, ScrollView} from 'react-native'
const {height,width} = Dimensions.get("window")
import settings from '../AppSettings'
const{ themeColor,fontFamily} = settings
import {Swipeable}from 'react-native-gesture-handler'
import { Ionicons, Entypo, Feather, MaterialCommunityIcons, FontAwesome, FontAwesome5, EvilIcons,Fontisto,AntDesign,} from '@expo/vector-icons';
import { connect } from 'react-redux';
import { selectTheme,selectClinic } from '../actions'
import HttpsClient from '../api/HttpsClient'
import moment  from 'moment'
const imageUrl = "data:image/jpeg;base64,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"
import StarRating from 'react-native-star-rating-widget';
import ShimmerLoader from './ShimmerLoader'
const {url} =settings
 class SearchClinicView extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
       load:true,
       data:[],
       offset:0
    }
  }

   navigate =(item)=>{
//    if (item.type =="MedicalStore"){
//      return this.props.navigation.navigate('ViewMedicals',{ item })
//    }
    return  this.props.navigation.navigate('ViewClinic', { item })
 }   
 getClinics =async()=>{
     let { location} = this.props

     let api =`${url}/api/prescription/nearestClinic/?limit=10&offset=${this.state.offset}&lat=${location.lat}&long=${location.lng}&nearestClinic=jjj`
    
     let data =await HttpsClient.get(api)
     if(data.type=="success"){
         this.setState({data:data.data.clinics,load:false})
     }
     console.log(data.data.clinics)
 }
 componentDidMount() {
     this.getClinics()
 }
  render() {
     if(this.state.load){
         return(
        <ScrollView>
                          <ShimmerLoader />
                          <ShimmerLoader />
                          <ShimmerLoader />
         </ScrollView>
         )

     }
     return (
      <FlatList 
          
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{paddingBottom:100}}
                  data={this.state.data}
                  keyExtractor={(item,index)=>index.toString()}
                  renderItem ={({item,index})=>{
                     return(
                                   <TouchableOpacity style={[styles.boxWithShadow,{height:height*0.2,backgroundColor:"#fafafa",marginTop:20,marginHorizontal:15,borderRadius:10,padding:10}]}
                          onPress={()=>{this.navigate(item)}}
                        >
                             <View style={{flex:0.5,flexDirection:"row",borderBottomWidth:0.5,borderColor:"#000",paddingVertical:10}}>
                                 <View style={{flex:0.8,flexDirection:"row"}}>
                                      <Image 
                                        source={{uri:imageUrl}}
                                        style={{height:"100%",width:width*0.15,borderRadius:5}}
                                      />   
                                      <View style={{marginLeft:10,justifyContent:"center"}}>
                                        <View >
                                               <Text style={[styles.text,{color:"#000",fontSize:height*0.02}]}>{item.title}</Text>
                                        </View>
                                      </View>
                                 </View>
                                 <View style={{flex:0.2,alignItems:"center",justifyContent:"center"}}>
                                       <Text style={[styles.text,{color:"#000"}]}>{Math.round(item.km)} km</Text>
                                 </View>
                             </View>
                      
                             <View style={{flex:0.5,flexDirection:"row"}}>
                                <View style={{flex:0.7}}>
                                     <View style={{marginTop:5}}>
                                       <Text style={[styles.text,{color:"gray",fontSize:height*0.02}]}>Ratings : {item.rating}/5  (5) </Text>
                                    </View>
                                    <View style={{marginTop:5}}>
                                          <StarRating
                                         starSize={20}
                                         rating={item.rating}
                                         onChange={()=>{}}
                                      />
                                    </View>
                                
                                </View>
                                    <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between",flex:0.3}}>
                                 
                              
                                      <TouchableOpacity style={[styles.boxWithShadow, { backgroundColor: "#fff", height: height*0.04, width: height*0.04, borderRadius: height*0.02, alignItems: "center", justifyContent: 'center', }]}
                                      onPress={() => { this.chatClinic(item) }}
                                          >
                                              <Ionicons name="chatbox" size={height*0.02} color="#63BCD2" />

                                          </TouchableOpacity>
                                                 <TouchableOpacity style={[styles.boxWithShadow, { backgroundColor: "#fff", height: height*0.04, width: height*0.04, borderRadius: height*0.02, alignItems: "center", justifyContent: 'center', marginLeft: 10 }]}
                            onPress={() => {
                       
                                      if (Platform.OS == "android") {
                                        Linking.openURL(`tel:${item?.diagonistic_clinic.mobile}`)
                                    } else {

                                        Linking.canOpenURL(`telprompt:${item?.diagonistic_clinic.mobile}`)
                                    }}}
    
    
                        >
                           <Ionicons name="call" size={height*0.02} color="#63BCD2" />
                        </TouchableOpacity>
                                          <TouchableOpacity style={[styles.boxWithShadow, { backgroundColor: "#fff", height: height*0.04, width: height*0.04, borderRadius:height*0.02, alignItems: "center", justifyContent: 'center', marginLeft: 10 }]}
                                              onPress={() => {
                                                  Linking.openURL(
                                                      `https://www.google.com/maps/dir/?api=1&destination=` +
                                                      item.clinicname.lat +
                                                      `,` +
                                                      item.clinicname.long +
                                                      `&travelmode=driving`
                                                  );
                                              }}
                                          >
                                              <FontAwesome5 name="directions" size={height*0.02} color="#63BCD2" />
                                          </TouchableOpacity>
                                   
                                </View>
                                            
                              </View>
                                  </TouchableOpacity>
                     )
                  }}
                />
    )
  }
}
const styles = StyleSheet.create({
    header: {
        position: 'absolute',
        left: 0,
        right: 0,
        width: '100%',
        zIndex: 1,
        backgroundColor: themeColor,
        elevation: 6
    },
    subHeader: {
     
        width: '100%',
        paddingHorizontal: 10,
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    text: {
        fontFamily,
         fontSize:height*0.02
    },
    root: {
        flex: 1, 
        marginHorizontal: 20
    },
    container: {
        flex: 1
    },
    card: {
        backgroundColor: "#fff",
    
        borderColor:"gray",
        borderBottomWidth:0.5
       

    },
    card2:{
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0,
        shadowRadius: 4.65,
        elevation: 5,
        borderRadius: 10,
        backgroundColor: "#fff",
     
        marginHorizontal: 10,
        marginVertical: 3
    },
    topSafeArea: {
        flex: 0,
        backgroundColor: themeColor
    },
    bottomSafeArea: {
        flex: 1,
        backgroundColor: "#fff"
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
        user:state.selectedUser,
        clinic:state.selectedClinic

    }
}
export default connect(mapStateToProps, { selectTheme, selectClinic })(SearchClinicView)