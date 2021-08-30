import React, { Component } from 'react';
import { View, Text, StatusBar, Dimensions, Image, StyleSheet, TouchableOpacity, AsyncStorage, SafeAreaView, ScrollView, FlatList } from 'react-native';
import settings from '../AppSettings';
import axios from 'axios';
import Modal from 'react-native-modal';
const { height } = Dimensions.get("window");
const { width } = Dimensions.get("window");
import { Ionicons, Entypo, AntDesign, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
const themeColor = settings.themeColor;
const fontFamily = settings.fontFamily;
import { connect } from 'react-redux';
import { selectTheme, selectClinic } from '../actions';
import { NavigationContainer, CommonActions } from '@react-navigation/native';
import StarRating from 'react-native-star-rating-widget';
const orders = [
  {
    name:"Sasi Medicals",
    address:"New BEL Road,Bangalore",
    Price:"325",
    status:"Delivered",
    orderedOn:"26 Aug 2021 at 10:00 pm",
    img:"https://thumbs.dreamstime.com/b/doctor-explain-to-patient-medical-clinic-hospital-healthcare-wellness-living-163682454.jpg",
    rating:4,
    items:[
      {
        name:"Dolo",
        qty:2,
        price:"20"
      },
      {
        name:"Paracetomal",
        qty:2,
        price:"40"  
      },
          {
        name:"Anacin",
        qty:3,
        price:"30"  
      }
    ]
  },
    {
    name:"Mani Medicals",
    address:"New BEL Road,Bangalore",
    Price:"325",
    status:"Delivered",
    orderedOn:"26 Aug 2021 at 10:00 pm",
    img:"https://thumbs.dreamstime.com/b/doctor-explain-to-patient-medical-clinic-hospital-healthcare-wellness-living-163682454.jpg",
    rating:4,
        items:[
      {
        name:"Dolo",
        qty:2,
        price:"20"
      },
      {
        name:"Paracetomal",
        qty:2,
        price:"40"  
      },
          {
        name:"Anacin",
        qty:3,
        price:"30"  
      }
    ]
  },
  {
    name:"Ganesh Medicals",
    address:"New BEL Road,Bangalore",
    Price:"325",
    status:"Delivered",
    orderedOn:"26 Aug 2021 at 10:00 pm",
    img:"https://thumbs.dreamstime.com/b/doctor-explain-to-patient-medical-clinic-hospital-healthcare-wellness-living-163682454.jpg",
     rating:3,
         items:[
      {
        name:"Dolo",
        qty:2,
        price:"20"
      },
      {
        name:"Paracetomal",
        qty:2,
        price:"40"  
      },
          {
        name:"Anacin",
        qty:3,
        price:"30"  
      }
    ]
  },
    {
    name:"New Medicals",
    address:"New BEL Road,Bangalore",
    Price:"325",
    status:"Delivered",
    orderedOn:"26 Aug 2021 at 10:00 pm",
    img:"https://thumbs.dreamstime.com/b/doctor-explain-to-patient-medical-clinic-hospital-healthcare-wellness-living-163682454.jpg",
    rating:2,
        items:[
      {
        name:"Dolo",
        qty:2,
        price:"20"
      },
      {
        name:"Paracetomal",
        qty:2,
        price:"40"  
      },
          {
        name:"Anacin",
        qty:3,
        price:"30"  
      }
    ]
  },
  {
    name:"Old Medicals",
    address:"New BEL Road,Bangalore",
    Price:"325",
    status:"Delivered",
    orderedOn:"26 Aug 2021 at 10:00 pm",
    img:"https://thumbs.dreamstime.com/b/doctor-explain-to-patient-medical-clinic-hospital-healthcare-wellness-living-163682454.jpg",
    rating:1,
        items:[
      {
        name:"Dolo",
        qty:2,
        price:"20"
      },
      {
        name:"Paracetomal",
        qty:2,
        price:"40"  
      },
          {
        name:"Anacin",
        qty:3,
        price:"30"  
      }
    ]
  },
]
    const starStyle = {
      width: 100,
      height: 20,
      marginBottom: 20,
    };
class CustomerOrders extends Component {
    constructor(props) {
        super(props);
        this.state = {
           orders,
        };
    }

    componentDidMount() {
      
    }
   ratingCompleted = (rating) =>{
     console.log("Rating is: " + rating)
   }
   setRate =(rating,index) =>{
        let duplicate = this.state.orders
        duplicate[index].rating= rating
        this.setState({orders:duplicate})
   }
    render() {
        return (
          <>
           <SafeAreaView style={styles.topSafeArea} />
            <SafeAreaView style={styles.bottomSafeArea}>
                  <View style={{}}>

                      <TouchableOpacity style={{padding:15}}
                          onPress={() => { this.props.navigation.goBack() }}
                      >
                          <Ionicons name="chevron-back-circle" size={30} color={themeColor} />
                      </TouchableOpacity>
                 </View>
                 <View style={{marginLeft:15}}>
                      <Text style={[styles.text,{color:"#000"}]}>Your Orders</Text>
                 </View>
                 <FlatList 
                   contentContainerStyle={{paddingBottom:100}}
                   showsVerticalScrollIndicator={false}
                   data={this.state.orders}
                   keyExtractor={(item,index)=>index.toString()}
                   renderItem ={({item,index})=>{
                      return(
                        <TouchableOpacity style={[styles.boxWithShadow,{height:height*0.34,backgroundColor:"#fafafa",marginTop:20,marginHorizontal:15,borderRadius:10,padding:10}]}
                          onPress={()=>{this.props.navigation.navigate("ViewCustomerOrders",{item})}}
                        >
                             <View style={{flex:0.3,flexDirection:"row",borderBottomWidth:0.5,borderColor:"#000",paddingVertical:10}}>
                                 <View style={{flex:0.8,flexDirection:"row"}}>
                                      <Image 
                                        source={{uri:item.img}}
                                        style={{height:"100%",width:width*0.15,borderRadius:5}}
                                      />   
                                      <View style={{marginLeft:10}}>
                                        <View>
                                               <Text style={[styles.text,{color:"#000",fontSize:height*0.02}]}>{item.name}</Text>
                                        </View>
                                        <View>
                                             <Text style={[styles.text,{color:"gray",fontSize:height*0.02}]}>{item.address}</Text>
                                        </View>
                                      </View>
                                 </View>
                                 <View style={{flex:0.2,alignItems:"center",justifyContent:"center"}}>
                                       <Text style={[styles.text,{color:"#000"}]}> ₹ {item.Price}</Text>
                                 </View>
                             </View>
                             <View style={{flex:0.5,borderBottomWidth:0.5,borderColor:"#000",paddingVertical:10}}>
                               <View style={{height:height*0.03,width:width*0.3,alignItems:"center",justifyContent:"center",backgroundColor:"#EAFFEE",borderRadius:5}}>
                                  <Text style={[styles.text,{color:"#71C387"}]}>Delivered</Text>
                               </View>
                                      <View style={{marginTop:5}}>
                                             <Text style={[styles.text,{color:"gray",fontSize:height*0.02}]}>ITEMS : 5</Text>
                                        </View>
                                            <View style={{marginTop:5}}>
                                             <Text style={[styles.text,{color:"gray",fontSize:height*0.02}]}>ORDERED ON</Text>
                                             <Text style={[styles.text,{color:"#000",fontSize:height*0.02}]}>{item.orderedOn}</Text>
                                        </View>
                             </View>
                             <View style={{flex:0.2,}}>
                                <View>
                                     <View>
                                       <Text style={[styles.text,{color:themeColor,fontSize:height*0.02}]}>Rate Order</Text>
                                    </View>
                                </View>
                                <View style={{justifyContent:"center"}}>
                                       <StarRating
                                         starSize={20}
                                        rating={item.rating}
                                        onChange={(rating)=>{this.setRate(rating,index)}}
                                      />
                                </View>
                                  
                             </View>
                        </TouchableOpacity>
                      )
                   }}
                 />
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
export default connect(mapStateToProps, { selectTheme, selectClinic })(CustomerOrders)