import React, { Component } from 'react';
import { View, Text, Dimensions, TouchableOpacity, StyleSheet, SafeAreaView, Image, ScrollView, FlatList} from 'react-native';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import { Ionicons, Entypo, AntDesign } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import settings from '../AppSettings';
const fontFamily =settings.fontFamily;
const themeColor =settings.themeColor;
const height = Dimensions.get("window").height
const width = Dimensions.get("window").width
const url = settings.url
import { connect } from 'react-redux';
import { selectTheme } from '../actions';
import HttpsClient from '../api/HttpsClient';
import { NavigationContainer, CommonActions } from '@react-navigation/native';
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";
 class ShowCard2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
        item:this.props.route.params.item,
        valid:this.props.route.params.item.active,
    };
    } 
     IssuePriscription = async() => {
         let api = `${url}/api/prescription/issuedPrescription/`
         let sendData ={
             prescription:this.state.item.id,
             clinic: this.props.medical.id,

         }
         
         let post = await HttpsClient.post(api,sendData)
         console.log(post,"dd")
         if(post.type =="success"){
             this.showSimpleMessage("issued SuccessFully", "#00A300", "success")
             return this.props.navigation.dispatch(
                 CommonActions.reset({
                     index: 0,
                     routes: [
                         {
                             name: 'ClincicPriscriptionStack',

                         },

                     ],
                 })
             )
         
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
     header = () => {
         return (
             <View style={{ flexDirection: "row", marginTop: 20,alignItems:"center",justifyContent:"space-between" }}>
            
                 <View style={{ alignItems: 'center', justifyContent: "center" }}>
                     <Text style={[styles.text, { fontWeight: "bold", fontSize: 12 }]}>AF</Text>
                 </View>
                 <View style={{ alignItems: 'center', justifyContent: "center" }}>
                     <Text style={[styles.text, { fontWeight: "bold", fontSize: 12 }]}>morning</Text>
                 </View>
                 <View style={{ alignItems: 'center', justifyContent: "center" }}>
                     <Text style={[styles.text, { fontWeight: "bold", fontSize: 12 }]}>ANoon</Text>
                 </View>
                 <View style={{  alignItems: 'center', justifyContent: "center" }}>
                     <Text style={[styles.text, { fontWeight: "bold", fontSize: 12 }]}>Night</Text>
                 </View>
                 <View style={{  alignItems: 'center', justifyContent: "center" }}>
                     <Text style={[styles.text, { fontWeight: "bold", fontSize: 12 }]}>Qty</Text>
                 </View>
                 <View style={{ alignItems: 'center', justifyContent: "center" }}>
                     <Text style={[styles.text, { fontWeight: "bold", fontSize: 12 }]}>days</Text>
                 </View>
             </View>
         )
     }
    
     renderItem = (item) => {
         console.log(item, "kkk")

         if (item.medicinename.type == "Tablet" || item.medicinename.type == "Capsules") {
             return (

                 <View style={{ marginTop: 10, flexDirection: "row" }}>


                     <View style={{ flex: 0.8, paddingLeft: 20 }}>
                         {item.morning_count != 0 && <View style={{}}>
                             <View style={{ flexDirection: "row" }}>
                                 <Text style={{ borderColor: "#000", borderRightWidth: 1, width: width * 0.2 }}>Morning </Text>
                                 <Text style={[styles.text, { fontSize: 12, marginLeft: 10 }]}>{item.morning_count} tablet {item.after_food ? "afterFood" : "before Food"}</Text>


                             </View>

                         </View>}
                         {item.afternoon_count != 0 && <View style={{}}>
                             <View style={{ flexDirection: "row" }}>
                                 <Text style={{ borderColor: "#000", borderRightWidth: 1, width: width * 0.2 }}>Afternoon </Text>
                                 <Text style={[styles.text, { fontSize: 12, marginLeft: 10 }]}>{item.afternoon_count} tablet {item.after_food ? "afterFood" : "before Food"}</Text>



                             </View>

                         </View>}
                         {item.night_count != 0 && <View style={{}}>
                             <View style={{ flexDirection: "row" }}>
                                 <Text style={{ borderColor: "#000", borderRightWidth: 1, width: width * 0.2 }}>Night </Text>

                                 <Text style={[styles.text, { fontSize: 12, marginLeft: 10 }]}>{item.night_count} tablet {item.after_food ? "afterFood" : "before Food"}</Text>


                             </View>
                         </View>}
                         <View style={{ marginTop: 10 }}>
                             <Text style={[styles.text, { fontWeight: "bold" }]}>Comments:</Text>
                             <View>
                                 <Text style={[styles.text, { marginLeft: 10 }]}>{item.command}</Text>
                             </View>
                         </View>
                         <View style={{ alignSelf: "flex-end" }}>
                             <Text>Qty: {item.total_qty}</Text>
                         </View>
                     </View>


                 </View>
             )
         }
         if (item.medicinename.type == "Drops") {
             return (

                 <View style={{ marginTop: 10, flexDirection: "row" }}>


                     <View style={{ flex: 0.8, paddingLeft: 20 }}>
                         {item.morning_count != 0 && <View style={{}}>
                             <View style={{ flexDirection: "row" }}>
                                 <Text style={{ borderColor: "#000", borderRightWidth: 1, width: width * 0.2 }}>Morning </Text>
                                 <Text style={[styles.text, { fontSize: 12, marginLeft: 10 }]}>{item.morning_count} drops </Text>


                             </View>

                         </View>}
                         {item.afternoon_count != 0 && <View style={{}}>
                             <View style={{ flexDirection: "row" }}>
                                 <Text style={{ borderColor: "#000", borderRightWidth: 1, width: width * 0.2 }}>Afternoon </Text>
                                 <Text style={[styles.text, { fontSize: 12, marginLeft: 10 }]}>{item.afternoon_count} drops </Text>



                             </View>

                         </View>}
                         {item.night_count != 0 && <View style={{}}>
                             <View style={{ flexDirection: "row" }}>
                                 <Text style={{ borderColor: "#000", borderRightWidth: 1, width: width * 0.2 }}>Night </Text>

                                 <Text style={[styles.text, { fontSize: 12, marginLeft: 10 }]}>{item.night_count} drops </Text>


                             </View>
                         </View>}
                         <View style={{ marginTop: 10 }}>
                             <Text style={[styles.text, { fontWeight: "bold" }]}>Comments:</Text>
                             <View>
                                 <Text style={[styles.text, { marginLeft: 10 }]}>{item.command}</Text>
                             </View>
                         </View>
                         <View style={{ alignSelf: "flex-end" }}>
                             <Text>Qty: {item.total_qty}</Text>
                         </View>
                     </View>


                 </View>
             )
         }
         if (item.medicinename.type == "Liquid") {
             return (

                 <View style={{ marginTop: 10, flexDirection: "row" }}>


                     <View style={{ flex: 0.8, paddingLeft: 20 }}>
                         {item.morning_count != 0 && <View style={{}}>
                             <View style={{ flexDirection: "row" }}>
                                 <Text style={{ borderColor: "#000", borderRightWidth: 1, width: width * 0.2 }}>Morning </Text>
                                 <Text style={[styles.text, { fontSize: 12, marginLeft: 10 }]}>{item.morning_count} ml {item.after_food ? "afterFood" : "before Food"}</Text>


                             </View>

                         </View>}
                         {item.afternoon_count != 0 && <View style={{}}>
                             <View style={{ flexDirection: "row" }}>
                                 <Text style={{ borderColor: "#000", borderRightWidth: 1, width: width * 0.2 }}>Afternoon </Text>
                                 <Text style={[styles.text, { fontSize: 12, marginLeft: 10 }]}>{item.afternoon_count} ml {item.after_food ? "afterFood" : "before Food"}</Text>



                             </View>

                         </View>}
                         {item.night_count != 0 && <View style={{}}>
                             <View style={{ flexDirection: "row" }}>
                                 <Text style={{ borderColor: "#000", borderRightWidth: 1, width: width * 0.2 }}>Night </Text>

                                 <Text style={[styles.text, { fontSize: 12, marginLeft: 10 }]}>{item.night_count} ml {item.after_food ? "afterFood" : "before Food"}</Text>


                             </View>
                         </View>}
                         <View style={{ marginTop: 10 }}>
                             <Text style={[styles.text, { fontWeight: "bold" }]}>Comments:</Text>
                             <View>
                                 <Text style={[styles.text, { marginLeft: 10 }]}>{item.command}</Text>
                             </View>
                         </View>
                         <View style={{ alignSelf: "flex-end" }}>
                             <Text>Qty: {item.total_qty}</Text>
                         </View>
                     </View>


                 </View>
             )
         }
         if (item.medicinename.type == "Cream") {
             return (

                 <View style={{ marginTop: 10, flexDirection: "row" }}>


                     <View style={{ flex: 0.8, paddingLeft: 20 }}>
                         {item.morning_count != 0 && <View style={{}}>
                             <View style={{ flexDirection: "row" }}>
                                 <Text style={{ borderColor: "#000", borderRightWidth: 1, width: width * 0.2 }}>Morning </Text>
                                 <Text style={[styles.text, { fontSize: 12, marginLeft: 10 }]}>{item.morning_count} time</Text>


                             </View>

                         </View>}
                         {item.afternoon_count != 0 && <View style={{}}>
                             <View style={{ flexDirection: "row" }}>
                                 <Text style={{ borderColor: "#000", borderRightWidth: 1, width: width * 0.2 }}>Afternoon </Text>
                                 <Text style={[styles.text, { fontSize: 12, marginLeft: 10 }]}>{item.afternoon_count} time</Text>



                             </View>

                         </View>}
                         {item.night_count != 0 && <View style={{}}>
                             <View style={{ flexDirection: "row" }}>
                                 <Text style={{ borderColor: "#000", borderRightWidth: 1, width: width * 0.2 }}>Night </Text>

                                 <Text style={[styles.text, { fontSize: 12, marginLeft: 10 }]}>{item.night_count} time</Text>
                             </View>
                         </View>}
                         <View style={{ marginTop: 10 }}>
                             <Text style={[styles.text, { fontWeight: "bold" }]}>Comments:</Text>
                             <View>
                                 <Text style={[styles.text, { marginLeft: 10 }]}>{item.command}</Text>
                             </View>
                         </View>
                         <View style={{ alignSelf: "flex-end" }}>
                             <Text>Qty: {item.total_qty}</Text>
                         </View>
                     </View>


                 </View>
             )
         }
         if (item.medicinename.type == "Others") {
             return (

                 <View style={{ marginTop: 10, flexDirection: "row", flex: 1 }}>

                     <View style={{ flex: 0.77, paddingLeft: 20 }}>
                         <View style={{ marginTop: 10 }}>
                             <Text style={[styles.text, { fontWeight: "bold" }]}>Comments:</Text>
                             <View>
                                 <Text style={[styles.text, { marginLeft: 10 }]}>{item.command}</Text>
                             </View>
                         </View>
                     </View>

                     <View style={{}}>
                         <Text>Qty: {item.total_qty}</Text>
                     </View>


                 </View>
             )
         }

     }
     showError =()=>{
         return this.showSimpleMessage("Priscription is not valid", "#dd7030",)
        
     }
     footer =()=>{
         return(
           <View style={{flexDirection:'row',position:"absolute",bottom:30}}>
                 <View style={{ height: height * 0.05, width: width * 0.4, alignItems: 'center', justifyContent: 'center', backgroundColor: this.state.item.active?"green":"red",borderRadius:10,marginLeft:20}}>
                  <Text style={[styles.text,{color:"#fff"}]}>{this.state.item.active?"valid":"Invalid"}</Text>
               </View>
                 {this.state.item.active?<TouchableOpacity style={{ height: height * 0.05, width: width * 0.4, alignItems: 'center', justifyContent: 'center', backgroundColor: themeColor, borderRadius: 10, marginLeft: 20}}
                   onPress ={()=>{this.IssuePriscription()}}
                 >
                     <Text style={[styles.text,{color:"#fff"}]}>Issue</Text>
                 </TouchableOpacity> : <TouchableOpacity style={{ height: height * 0.05, width: width * 0.4, alignItems: 'center', justifyContent: 'center', backgroundColor:"gray", borderRadius: 10, marginLeft: 20 }}
                         onPress={() => { this.showError() }}
                 >
                         <Text style={[styles.text, { color: "#fff" }]}>Issue</Text>
                  
                   </TouchableOpacity>}
           </View>
         )
     }
  render() {
      const { item } = this.state
      let dp = null
      if (this?.state?.item?.doctordetails?.dp) {
          dp = `${url}${this.state.item.doctordetails.dp}`
      }
       

    return (
      <>
            <SafeAreaView style={styles.topSafeArea} />
            <SafeAreaView style={styles.bottomSafeArea}>
                      {/*Headers  */}
                <View style={{ height: height * 0.2, justifyContent: "center", }}>


                    <View style={{ flexDirection: "row" }}>

                        <TouchableOpacity style={{ flex: 0.2, marginLeft: 20, alignItems: "center", justifyContent: 'center' }}
                            onPress={() => { this.props.navigation.goBack() }}
                        >
                            <Ionicons name="chevron-back-circle" size={30} color="#007A7A" />
                        </TouchableOpacity>

                        <Image
                            style={{ height: 50, width: 50, resizeMode: "contain", marginLeft: 10 }}
                            source={require('../assets/icons/34.png')}
                        />
                        <View style={{ alignItems: "center", justifyContent: 'center' }}>
                            <Text style={[styles.text, { fontSize: 25, fontWeight: "bold", color: "#007A7A", marginLeft: 10 }]}>{item?.clinicname?.name || "Clinic Name"}</Text>

                        </View>
                    </View>

                    <View style={{ alignSelf: "flex-start", height: 30, alignItems: "center", justifyContent: "center" }}>
                        <Text style={[styles.text, { paddingLeft: 20 }]}>{item?.clinicname?.address}</Text>
                    </View>


                    <Image
                        style={{ height: 20, width: width, resizeMode: "stretch", }}
                        source={require('../assets/logooo.png')}
                    />
                    {/*                             
                            <View style={{ alignSelf: "flex-end", flexDirection: "row" }}>
                                <View style={{ alignItems: "center", justifyContent: "center" }}>
                                    <Text style={[styles.text, { color: "gray" }]}>{item.doctordetails.name || "Clinic Name"}</Text>

                                </View>
                                <View style={{ alignItems: "center", justifyContent: "center" }}>
                                    <Image
                                        source={{ uri: dp || "https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg" }}
                                        style={{ height: 30, width: 30, borderRadius: 15 }}
                                    />
                                </View>
                            </View> */}

                </View>







                {/* DETAILS */}
                <View >

                    <FlatList
                        data={item.medicines}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => {
                            return (
                                <View style={{
                                    flex: 1,
                                    // borderWidth: 1,
                                    // borderRadius: 1,
                                    // borderStyle: 'dashed',
                                    borderColor: '#D1D2DE',
                                    backgroundColor: '#FFFFFF',
                                }}>
                                    <View style={{ flexDirection: "row", justifyContent: "space-between", paddingLeft: 15 }}>
                                        <View style={{ flexDirection: "row", flex: 0.7 }}>
                                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>


                                                <Text style={[styles.text, { color: "#000", fontWeight: "bold", fontSize: 18 }]}>{item.medicinename.name}</Text>
                                                <Text style={[styles.text, { color: "gray", fontWeight: "bold" }]}> * {item.days} days</Text>
                                                <Text style={[styles.text, { color: "gray", fontWeight: "bold" }]}> </Text>
                                            </View>

                                        </View>


                                    </View>

                                    {
                                        this.renderItem(item)
                                    }
                                    <View>
                                        <Image
                                            style={{ width, height: 30, resizeMode: "stretch" }}
                                            source={{ uri: "https://uwosh.edu/studenthealth/wp-content/uploads/sites/26/2016/08/dotted-bar.png" }}
                                        />
                                    </View>
                                </View>
                            )
                        }}
                    />
               </View>
               {
                   this.footer()
               }
            </SafeAreaView>
            </>
    );
  
   
  }
}
const styles=StyleSheet.create({
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
    elevation:{
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0,
        shadowRadius: 4.65,
        elevation: 6,
    }
})
const mapStateToProps = (state) => {

    return {
        theme: state.selectedTheme,
        user: state.selectedUser,
        medical: state.selectedMedical
    }
}
export default connect(mapStateToProps, { selectTheme })(ShowCard2)