import React, { Component } from 'react'
import { Dimensions, FlatList, Text, TouchableOpacity, View ,StyleSheet,Linking, TextInput ,Keyboard} from 'react-native';
import settings from '../AppSettings';
import Modal from "react-native-modal";
const url = settings.url
const fontFamily = settings.fontFamily;
const themeColor = settings.themeColor;
const {height,width} =Dimensions.get('window')
const screenHeight = Dimensions.get("screen").height
import { connect } from 'react-redux';
import { selectTheme } from '../actions';
import { Feather ,FontAwesome,FontAwesome5} from '@expo/vector-icons';
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";
import CheckBox from '@react-native-community/checkbox';
import HttpsClient from '../api/HttpsClient';
import moment from 'moment';

 class History extends Component {
   constructor(props) {
        super(props);
       this.state = {
           orders:[],
           refreshing:false
        };
    }
getOrders = async()=>{
  
 let api =`${url}/api/prescription/medicalaccepted/?accepted=true&medical_store=${this.props.medical.clinicpk}&orderStatus=Paid`
 console.log(api)
 const data =await HttpsClient.get(api)
   if(data.type=="success"){
      this.setState({orders:data.data})
   }
}
  componentDidMount(){
      this.getOrders()
    }
  render() {
    return (
      <View style={{flex:1}}>
          <FlatList 
             refreshing={this.state.refreshing}
             onRefresh={()=>{this.getOrders()}}
             data={this.state.orders}
             keyExtractor={(item,index)=>index.toString()}
             renderItem={({item,index})=>{
               return(
                  <TouchableOpacity style={{height:height*0.1,backgroundColor:"#fafafa",flexDirection:"row",marginVertical:10}}
                       onPress={()=>{
                         const itemm = {
                           prescription:item.for_order.prescription,
                           medicineDetails:item.for_order.medicineDetails
                         }
                    
                         this.props.navigation.navigate("RequestView",{item:itemm})
                        }}
                     >
                          <View style={{flex:0.6,}}>
                            <View style={{flexDirection:"row",marginHorizontal:15,marginTop:10}}>
                              <View style={{height: 30, alignItems:"center",justifyContent:"center"}}>
                                   <Text style={[styles.text,{color:"#000"}]}>{index+1} .</Text>
                              </View>
                                <View style={{marginLeft:10,height:30,alignItems:"center",justifyContent:"center"}}>
                                    <Text style={[styles.text,{color:"#000",fontWeight:"bold"}]}>{item.for_order.otherDetails.username}</Text>
                                </View>
                                <View style={{marginLeft:10,height:30,alignItems:"center",justifyContent:"center"}}>
                                    <Text style={[styles.text]}>({item.for_order.otherDetails.age}-{item.for_order.otherDetails.sex})</Text>
                                </View>
                                <TouchableOpacity style={[styles.boxWithShadow, { backgroundColor: "#fff", height: 30, width: 30, borderRadius: 15, alignItems: "center", justifyContent: 'center', marginLeft: 10 }]}
                                        onPress={() => {
                                            if (Platform.OS == "android") {
                                                Linking.openURL(`tel:${item.for_order.otherDetails?.mobile}`)
                                            } else {

                                                Linking.canOpenURL(`telprompt:${item.for_order.otherDetails?.mobile}`)
                                            }
                                          }}
                                    >
                                        <FontAwesome name="phone" size={20} color="#63BCD2" />
                             </TouchableOpacity>
                                {/* <View>
                                      <Text style={[styles.text,{color:"#000"}]}>{item.medicineName} :{item.requiredQuantity}</Text>
                                </View> */}
                            </View>
                              <View style={{marginLeft:30,marginTop:10}}>
                                    <Text style={[styles.text,{color:"#000"}]}>Reason : {item.for_order.otherDetails.reason}</Text>
                              </View>
                               
                          </View>

                          <View style={{flex:0.4,alignItems:"center",justifyContent:"center",flexDirection:"row"}}>
                                 <Text style={[styles.text,{color:"#000"}]}>Status:</Text> 
                                 <Text style={[styles.text,{color:"#000"}]}>{item.for_order.status}</Text> 
                          </View>
                     </TouchableOpacity>
               )
                
             }}
          />
      </View>
    )
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
    card: {

        backgroundColor: "#eeee",
        height: height * 0.1,
        marginHorizontal: 10,
        marginVertical: 3

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
        medical:state.selectedMedical
    }
}
export default connect(mapStateToProps, { selectTheme })(History);