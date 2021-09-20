import React, { Component } from 'react';
import { View, Text, StatusBar, Dimensions, Image, StyleSheet, TouchableOpacity, AsyncStorage, SafeAreaView, ScrollView, FlatList,Linking ,RefreshControl} from 'react-native';
import settings from '../AppSettings';
import axios from 'axios';
import Modal from 'react-native-modal';
const { height } = Dimensions.get("window");
const { width } = Dimensions.get("window");
import { Ionicons, Entypo, AntDesign, Feather, MaterialCommunityIcons ,FontAwesome} from '@expo/vector-icons';
const themeColor = settings.themeColor;
const fontFamily = settings.fontFamily;
const {dunzourl} = settings
import { connect } from 'react-redux';
import MapView,{Marker,PROVIDER_GOOGLE,Callout} from 'react-native-maps';
import { selectTheme, selectClinic } from '../actions';
import { NavigationContainer, CommonActions } from '@react-navigation/native';
import mapstyle from '../map.json';
import moment from 'moment';
import {token} from '../dunzo/dunzo';
import MapViewDirections from 'react-native-maps-directions';
class ViewCustomerOrders extends Component {
    constructor(props) {
        let item = props.route.params.item
        super(props);
        this.state = {
            item,
            orderSummary:null,
            refreshing:false
        };
    }
getOrderSummary = async()=>{
    this.setState({refreshing:true})
        const headers = {
            'client-id': 'a61aec7d-50af-4dc0-b933-d09d9d82e320',
            'Authorization': token,
            'Accept-Language': 'en_US',
            'Content-Type':'application/json'
        }
        const api =`${dunzourl}/api/v1/tasks/${this.state.item.task_id}/status`
        console.log(api)
        try{
            const {data} = await axios.get(api,{
                 headers:headers
              })
             this.setState({orderSummary:data,refreshing:false})
              console.log(data)
        }catch(error){
                         this.setState({refreshing:false})
            console.log(error.response.data,"kkkk")
      
        }
}
    componentDidMount() {
       if(this.state.item){
           this.getOrderSummary()
       }
    }
    getInternetCharge =(total)=>{
      return Math.ceil(total*2/100) 
    }
    getDeliveryPrice =(total)=>{
        const del= (this.state.item.user_order.total_price)+(Math.ceil(total*2/100))
        return total-del

    }
    onRefresh = ()=>{
      this.getOrderSummary()
    }
footer=()=>{
  return(
    <View>


       <View style={{paddingHorizontal:10,borderColor:"gray",borderTopWidth:0.5,borderBottomWidth:0.5,paddingVertical:10}}>
          <View style={{flexDirection:"row",}}>
                <View style={{flex:0.8}}>
                      <Text style={[styles.text,{color:"gray"}]}>Item Total</Text>
                </View>
                <View style={{flex:0.2,alignItems:"center",justifyContent:"center"}}>
                     <Text style={[styles.text,{color:"gray"}]}>₹ {this.state.item.user_order.total_price}</Text>
                </View>
          </View>
           <View style={{flexDirection:"row",marginTop:5}}>
                <View style={{flex:0.8}}>
                      <Text style={[styles.text,{color:"gray"}]}>Internet Charge</Text>
                </View>
                <View style={{flex:0.2,alignItems:"center",justifyContent:"center"}}>
                     <Text style={[styles.text,{color:"gray"}]}>₹ {this.getInternetCharge(this.state.item.razor_price/100)}</Text>
                </View>
          </View>
            <View style={{flexDirection:"row",marginTop:5}}>
                <View style={{flex:0.8}}>
                      <Text style={[styles.text,{color:"gray"}]}>Delivery Charge</Text>
                </View>
                <View style={{flex:0.2,alignItems:"center",justifyContent:"center"}}>
                     <Text style={[styles.text,{color:"gray"}]}>₹{this.state.item.estimated_price}</Text>
                </View>
          </View>
       </View>
       <View style={{paddingHorizontal:10,paddingVertical:10}}>
                <View style={{flexDirection:"row",marginTop:5}}>
                <View style={{flex:0.8}}>
                      <Text style={[styles.text,{color:"gray"}]}>Grand Total</Text>
                </View>
                <View style={{flex:0.2,alignItems:"center",justifyContent:"center"}}>
                     <Text style={[styles.text,{color:"gray"}]}>₹ {this.state.item.razor_price/100}</Text>
                </View>
          </View>
       </View>
           </View>
  )
}
call =(mobile)=>{
   if (Platform.OS == "android") {
        Linking.openURL(`tel:${mobile}`)
   } else {

        Linking.canOpenURL(`telprompt:${mobile}`)
     }
}
    render() {
        return (
          <>
           <SafeAreaView style={styles.topSafeArea} />
            <SafeAreaView style={styles.bottomSafeArea}>
                  <View style={[styles.boxWithShadow,{height:height*0.1,backgroundColor:themeColor,flexDirection:"row"}]}>

                      <TouchableOpacity style={{flex:0.2,alignItems:"center",justifyContent:"center"}}
                          onPress={() => { this.props.navigation.goBack() }}
                      >
                          <Ionicons name="chevron-back-circle" size={30} color={"#fff"} />
                      </TouchableOpacity>
                       <View style={{flex:0.6,alignItems:"center",justifyContent:"center"}}>
                            <Text style={[styles.text,{color:"#fff",fontSize:height*0.02}]}>Order Details</Text>
                       </View>
                       <View style={{flex:0.2}}>

                       </View>
                 </View>
                <ScrollView 
                //    refreshControl={
                //         <RefreshControl
                //             refreshing={this.state.refreshing}
                //             onRefresh={()=>{this.onRefresh()}}
                //         />
                //     }
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{paddingBottom:50}}
                style={{}}>
                   {this.state.orderSummary?.runner&&<View style={{height:height*0.5}}>
                            <MapView 
                              customMapStyle={mapstyle}
                              provider ={PROVIDER_GOOGLE}
                              style={{flex:1,height:"100%",width:"100%"}}
                                initialRegion={{
                                    latitude: Number(this.state?.item?.user_order?.lat),
                                    longitude:Number(this.state?.item?.user_order?.lang),
                                    latitudeDelta: 0.0012,
                                    longitudeDelta: 0.0012,
                                }} 
                                    
                              >
                                <MapViewDirections
                                    origin={{latitude:Number(this.state?.item?.user_order?.medical_lat),longitude:Number(this.state?.item?.user_order?.medical_lang)}}
                                    destination={{latitude:Number(this.state?.item?.user_order?.lat),longitude:Number(this.state?.item?.user_order?.lang)}}
                                    apikey={"AIzaSyCOSH383cU0Ywb6J1JZA_vlRq6Y6I6DgtE"} // insert your API Key here
                                    strokeWidth={4}
                                    strokeColor={themeColor}
                                />
                                {/* Home */}
                                 <Marker 
                                  
                                    image={require('../assets/marker/homeicon.png')}
                                    coordinate={{latitude:Number(this.state?.item?.user_order?.lat),longitude:Number(this.state?.item?.user_order?.lang)}}
                                   
                                   />
                                 {/* Pharmacy */}
                                 <Marker
                                 
                                    image={require('../assets/marker/clinic.png')}
                                 coordinate={{latitude:Number(this.state?.item?.user_order?.medical_lat),longitude:Number(this.state?.item?.user_order?.medical_lang)}} />
                                 {/* runner */}
                                 <Marker 
                                  image={require('../assets/marker/delivery-boy.png')}
                                 coordinate={{latitude:Number(this.state.orderSummary.runner.location.lat),longitude:Number(this.state.orderSummary.runner.location.lng)}} />
                            </MapView>
                      </View>}
                      <View style={{margin:10,borderBottomWidth:0.5,borderColor:"gray",paddingVertical:10}}>
                          <View>
                                       <Text style={[styles.text,{color:"#000",fontSize:height*0.024}]}>Order Summary :</Text>
                          </View>
                    
                           <View style={{marginTop:10}}>
                                <Text style={[styles.text,{color:"#000",fontSize:height*0.02}]}>Status : {this.state?.orderSummary?.state}</Text>
                           </View>
                        {this.state.orderSummary?.eta?.pickup&&   <View style={{marginTop:10}}>
                               <Text style={[styles.text,{color:"#000",fontSize:height*0.02}]}>Estimated PickUp Time : {this.state.orderSummary?.eta?.pickup} min</Text>
                           </View>}
                         {this.state.orderSummary?.eta?.dropoff&&   <View style={{marginTop:10}}>
                               <Text style={[styles.text,{color:"#000",fontSize:height*0.02}]}>Estimated drop Time : {this.state.orderSummary?.eta?.dropoff} min</Text>
                           </View>}
                           {
                               this.state.orderSummary?.locations_order.map((item,index)=>{
                                        return(
                                            <View key={index} style={{flexDirection:"row",marginTop:10,}}>
                                                <View>
                                                             <Text style={[styles.text,{color:"#000",fontSize:height*0.02}]}>{item.type} : {item.state.toLowerCase()}</Text>  
                                                </View>
                                              
                                            </View>
                                        )
                               })
                           }
                           {this.state?.orderSummary?.total_time&&
                               <View style={{marginTop:10}}>
                                         <Text style={[styles.text,{color:"#000",fontSize:height*0.02}]}>Total Time: {this.state?.orderSummary?.total_time} min</Text>
                               </View>
                           }
                           {
                               this.state.orderSummary?.runner&&
                               <View style={{}}>
                                   <View style={{marginTop:5}}>
                                       <Text style={[styles.text,{color:"#000",fontSize:height*0.02}]}>Runner Name: {this.state.orderSummary.runner.name}</Text>
                                   </View>
                                      <View style={{marginTop:5,flexDirection:"row"}}>
                                          <View>
                                             <Text style={[styles.text,{color:"#000",fontSize:height*0.02}]}>Runner Number: {this.state.orderSummary.runner.phone_number}</Text>
                                          </View>
                                         <TouchableOpacity style={[styles.boxWithShadow, { backgroundColor: "#fff", height: 30, width: 30, borderRadius: 15, alignItems: "center", justifyContent: 'center', marginLeft: 10,marginTop:-5 }]}
                                           onPress={() => {
                                        if (Platform.OS == "android") {
                                            Linking.openURL(`tel:${this.state?.orderSummary.runner.phone_number}`)
                                        } else {

                                            Linking.canOpenURL(`telprompt:${this.state?.orderSummary.runner.phone_number}`)
                                        }
                                    }}
                                >
                                    <Feather name="phone" size={20} color="#63BCD2" />
                                </TouchableOpacity>
                                   </View>
                               </View>
                           }
                      </View>
                      <View style={{marginHorizontal:10}}>
                          <Text style={[styles.text,{color:"#000",fontSize:height*0.025,fontWeight:"bold"}]}>{this.state.item.user_order.clinicDetails.name}</Text>
                          <Text style={[styles.text,{color:"gray",fontSize:height*0.02}]}>{this.state.item.user_order.clinicDetails.addres}</Text>
                      </View>
                      <View style={{marginHorizontal:10,paddingVertical:10,borderBottomWidth:0.5,borderColor:"gray"}}>
                          <Text style={[styles.text,{color:"#000"}]}>Your Order</Text>
                      </View>
                      <FlatList 
                        ListFooterComponent={this.footer()}
                        data={this.state.item.user_order.medicineDetails}
                        keyExtractor={(item,index)=>index.toString()}
                        renderItem={({item,index})=>{
                              return(
                                <View style={{marginHorizontal:10,paddingVertical:10,}}>
                                  <View style={{flexDirection:"row"}}>
                                         <View style={{alignItems:"center",justifyContent:"center"}}>
                                                               <FontAwesome name="dot-circle-o" size={15} color={themeColor}/> 
                                         </View>
                                          <View style={{marginLeft:5,alignItems:"center",justifyContent:"center"}}>
                                               <Text style={[styles.text,{color:"#000"}]}>{item.medicinetitle}</Text>
                                          </View>
                                  </View>
                                  <View style={{flexDirection:"row"}}>
                                    <View style={{flex:0.8,flexDirection:"row"}}>
                                            <View>
                                              <Text style={[styles.text,{color:"gray"}]}>{item.quantity}</Text>
                                          </View>
                                          <View style={{marginLeft:5}}>
                                                  <Text style={[styles.text,{color:"gray"}]}>x</Text>   
                                          </View>
                                          <View style={{marginLeft:5}}>
                                                  <Text style={[styles.text,{color:"gray"}]}>{item.price/item.quantity}</Text>   
                                          </View>
                                    </View>
                                     <View style={{flex:0.2,alignItems:"center",justifyContent:"center"}}>
                                         <Text style={[styles.text,{color:"gray"}]}>₹ {item.price}</Text>
                                     </View>
                                  </View> 
                                </View>
                              )
                        }}
                      />
                      <View style={{marginHorizontal:10,paddingVertical:10,borderBottomWidth:0.5,borderColor:"gray"}}>
                          <Text style={[styles.text,{color:"#000"}]}>Order Details</Text>
                      </View>
                      <View>
                          <View style={{marginHorizontal:10,}}>
                              <Text style={[styles.text,{color:"gray",fontSize:height*0.02}]}>Order Id</Text>
                              <Text style={[styles.text,{color:"#000",fontSize:height*0.016}]}>{this.state.item.order_id}</Text>
                          </View>
                           <View style={{marginHorizontal:10,}}>
                              <Text style={[styles.text,{color:"gray",fontSize:height*0.02}]}>payment Id</Text>
                              <Text style={[styles.text,{color:"#000",fontSize:height*0.016}]}>{this.state.item.order_id}</Text>
                          </View>
                          <View style={{marginHorizontal:10,marginTop:10}}>
                              <Text style={[styles.text,{color:"gray",fontSize:height*0.02}]}>Date</Text>
                              <Text style={[styles.text,{color:"#000",fontSize:height*0.016}]}>{moment(this.state.item.created).format('ll')} at {moment(this.state.item.created).format('hh:mm a')}</Text>
                          </View>
                               <View style={{marginHorizontal:10,marginTop:10}}>
                              <Text style={[styles.text,{color:"gray",fontSize:height*0.02}]}>Phone Number</Text>
                              <Text style={[styles.text,{color:"#000",fontSize:height*0.016}]}>{this.props.user.profile.mobile}</Text>
                          </View>
                                <View style={{marginHorizontal:10,marginTop:10}}>
                              <Text style={[styles.text,{color:"gray",fontSize:height*0.02}]}>Deliver to</Text>
                              <Text style={[styles.text,{color:"#000",fontSize:height*0.016}]}>{this.props.user.profile.location}</Text>
                          </View>
                      </View>
                             {/* Call */}
                      <TouchableOpacity style={{borderColor:"gray",borderBottomWidth:0.5,paddingVertical:10,borderTopWidth:0.5,alignItems:"center",justifyContent:"center",marginTop:10}}
                       onPress={()=>{this.call(this.state.item.user_order.clinicDetails.mobile)}}
                      >
                            <View
                             style={{}}
                            >
                                <Text style={[styles.text,{color:themeColor,fontSize:height*0.02}]}> call  {this.state.item.user_order.clinicDetails.name} {this.state.item.user_order.clinicDetails.mobile}</Text>
                            </View>
                          
                      </TouchableOpacity>
                      <View style={{paddingHorizontal:10}}>
                          <View style={{marginTop:5}}>
                                     <Text style={[styles.text,{color:"gray",fontSize:height*0.02}]}>{this.state.item.name}</Text>
                          </View>
                          <View style={{marginTop:5}}>
                                        <Text style={[styles.text,{color:"gray",fontSize:height*0.015}]}>LIC NO: 6758FGRSC</Text>
                              </View>
                        
                          </View>
                </ScrollView>
                
             </SafeAreaView>    
             </>
        );
    }
}

const styles = StyleSheet.create({
    text: {
        fontFamily,
        fontSize: 18
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
})
const mapStateToProps = (state) => {
    return {
        theme: state.selectedTheme,
        user: state.selectedUser,
        clinic: state.selectedClinic
    }
}
export default connect(mapStateToProps, { selectTheme, selectClinic })(ViewCustomerOrders)