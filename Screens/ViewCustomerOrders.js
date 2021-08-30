import React, { Component } from 'react';
import { View, Text, StatusBar, Dimensions, Image, StyleSheet, TouchableOpacity, AsyncStorage, SafeAreaView, ScrollView, FlatList } from 'react-native';
import settings from '../AppSettings';
import axios from 'axios';
import Modal from 'react-native-modal';
const { height } = Dimensions.get("window");
const { width } = Dimensions.get("window");
import { Ionicons, Entypo, AntDesign, Feather, MaterialCommunityIcons ,FontAwesome} from '@expo/vector-icons';
const themeColor = settings.themeColor;
const fontFamily = settings.fontFamily;
import { connect } from 'react-redux';
import MapView,{Marker,PROVIDER_GOOGLE,Callout} from 'react-native-maps';
import { selectTheme, selectClinic } from '../actions';
import { NavigationContainer, CommonActions } from '@react-navigation/native';
import mapstyle from '../map.json';

class ViewCustomerOrders extends Component {
    constructor(props) {
        let item = props.route.params.item
        super(props);
        this.state = {
            item
        };
    }

    componentDidMount() {
      
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
                     <Text style={[styles.text,{color:"gray"}]}>₹300</Text>
                </View>
          </View>
           <View style={{flexDirection:"row",marginTop:5}}>
                <View style={{flex:0.8}}>
                      <Text style={[styles.text,{color:"gray"}]}>Internet Charge</Text>
                </View>
                <View style={{flex:0.2,alignItems:"center",justifyContent:"center"}}>
                     <Text style={[styles.text,{color:"gray"}]}>₹5</Text>
                </View>
          </View>
            <View style={{flexDirection:"row",marginTop:5}}>
                <View style={{flex:0.8}}>
                      <Text style={[styles.text,{color:"gray"}]}>Delivery Charge</Text>
                </View>
                <View style={{flex:0.2,alignItems:"center",justifyContent:"center"}}>
                     <Text style={[styles.text,{color:"gray"}]}>₹50</Text>
                </View>
          </View>
       </View>
       <View style={{paddingHorizontal:10,paddingVertical:10}}>
                <View style={{flexDirection:"row",marginTop:5}}>
                <View style={{flex:0.8}}>
                      <Text style={[styles.text,{color:"gray"}]}>Grand Total</Text>
                </View>
                <View style={{flex:0.2,alignItems:"center",justifyContent:"center"}}>
                     <Text style={[styles.text,{color:"gray"}]}>₹355</Text>
                </View>
          </View>
       </View>
           </View>
  )
}
    render() {
        return (
          <>
           <SafeAreaView style={styles.topSafeArea} />
            <SafeAreaView style={styles.bottomSafeArea}>
                  <View style={[styles.boxWithShadow,{height:height*0.09,backgroundColor:"#ffff",flexDirection:"row"}]}>

                      <TouchableOpacity style={{flex:0.2,alignItems:"center",justifyContent:"center"}}
                          onPress={() => { this.props.navigation.goBack() }}
                      >
                          <Ionicons name="chevron-back-circle" size={30} color={themeColor} />
                      </TouchableOpacity>
                       <View style={{flex:0.6,alignItems:"center",justifyContent:"center"}}>
                            <Text style={[styles.text,{color:"#000",fontSize:height*0.02}]}>Order Details</Text>
                       </View>
                       <View style={{flex:0.2}}>

                       </View>
                 </View>
                <ScrollView 
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{paddingBottom:50}}
                style={{}}>
                      <View style={{height:height*0.4}}>
                            <MapView 
                              customMapStyle={mapstyle}
                              provider ={PROVIDER_GOOGLE}
                              style={{flex:1,height:"100%",width:"100%"}}       
                              >

                            </MapView>
                      </View>
                      <View style={{margin:10}}>
                           <Text style={[styles.text,{color:"#000",fontSize:height*0.02}]}>Order Summary</Text>
                      </View>
                      <View style={{marginHorizontal:10}}>
                          <Text style={[styles.text,{color:"#000",fontSize:height*0.025,fontWeight:"bold"}]}>{this.state.item.name}</Text>
                          <Text style={[styles.text,{color:"gray",fontSize:height*0.02}]}>{this.state.item.address}</Text>
                      </View>
                      <View style={{marginHorizontal:10,paddingVertical:10,borderBottomWidth:0.5,borderColor:"gray"}}>
                          <Text style={[styles.text,{color:"#000"}]}>Your Order</Text>
                      </View>
                      <FlatList 
                        ListFooterComponent={this.footer()}
                        data={this.state.item.items}
                        keyExtractor={(item,index)=>index.toString()}
                        renderItem={({item,index})=>{
                              return(
                                <View style={{marginHorizontal:10,paddingVertical:10,}}>
                                  <View style={{flexDirection:"row"}}>
                                         <View style={{alignItems:"center",justifyContent:"center"}}>
                                                               <FontAwesome name="dot-circle-o" size={15} color={themeColor}/> 
                                         </View>
                                          <View style={{marginLeft:5,alignItems:"center",justifyContent:"center"}}>
                                               <Text style={[styles.text,{color:"#000"}]}>{item.name}</Text>
                                          </View>
                                  </View>
                                  <View style={{flexDirection:"row"}}>
                                    <View style={{flex:0.8,flexDirection:"row"}}>
                                            <View>
                                              <Text style={[styles.text,{color:"gray"}]}>{item.qty}</Text>
                                          </View>
                                          <View style={{marginLeft:5}}>
                                                  <Text style={[styles.text,{color:"gray"}]}>x</Text>   
                                          </View>
                                          <View style={{marginLeft:5}}>
                                                  <Text style={[styles.text,{color:"gray"}]}>{item.price}</Text>   
                                          </View>
                                    </View>
                                     <View style={{flex:0.2,alignItems:"center",justifyContent:"center"}}>
                                         <Text style={[styles.text,{color:"gray"}]}>₹100</Text>
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
                              <Text style={[styles.text,{color:"gray",fontSize:height*0.02}]}>Order Number</Text>
                              <Text style={[styles.text,{color:"#000",fontSize:height*0.016}]}>123456</Text>
                          </View>
                          <View style={{marginHorizontal:10,marginTop:10}}>
                              <Text style={[styles.text,{color:"gray",fontSize:height*0.02}]}>Date</Text>
                              <Text style={[styles.text,{color:"#000",fontSize:height*0.016}]}>Aug 27 ,2021 at 10:08 PM</Text>
                          </View>
                               <View style={{marginHorizontal:10,marginTop:10}}>
                              <Text style={[styles.text,{color:"gray",fontSize:height*0.02}]}>Phone Number</Text>
                              <Text style={[styles.text,{color:"#000",fontSize:height*0.016}]}>7010117137</Text>
                          </View>
                                <View style={{marginHorizontal:10,marginTop:10}}>
                              <Text style={[styles.text,{color:"gray",fontSize:height*0.02}]}>Deliver to</Text>
                              <Text style={[styles.text,{color:"#000",fontSize:height*0.016}]}>{this.state.item.address}</Text>
                          </View>
                      </View>
                             {/* Call */}
                      <View style={{borderColor:"gray",borderBottomWidth:0.5,paddingVertical:10,borderTopWidth:0.5,alignItems:"center",justifyContent:"center",marginTop:10}}>
                            <TouchableOpacity>
                                <Text style={[styles.text,{color:themeColor,fontSize:height*0.02}]}> call the {this.state.item.name} 9076785544</Text>
                            </TouchableOpacity>
                          
                      </View>
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