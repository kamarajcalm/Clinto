import React, { Component } from 'react';
import { 
      View,
      Text,
      ImageBackground,
      StyleSheet, 
      Dimensions,
      Image, 
      Settings,
      SafeAreaView,
      TouchableOpacity,
      Linking,
     Platform,
     StatusBar,
     ActivityIndicator,
     AsyncStorage
} from 'react-native';
import { Feather ,FontAwesome,FontAwesome5,AntDesign,Entypo,Ionicons,MaterialCommunityIcons} from '@expo/vector-icons';
const width = Dimensions.get("screen").width
const height = Dimensions.get("screen").height
const deviceHeight = Dimensions.get("screen").height
import { connect } from 'react-redux';
import { selectTheme, selectClinic, selectWorkingClinics, selectOwnedClinics ,setNoticationRecieved} from '../actions';
import settings from '../AppSettings'
import moment from 'moment';
const url = settings.url
const {dunzourl} = settings
const themeColor =settings.themeColor
const fontFamily =settings.fontFamily
const screenHeight = Dimensions.get("screen").height
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";
import HttpsClient from '../api/HttpsClient';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import Modal from 'react-native-modal';
import {FlatList}  from 'react-native-gesture-handler';
import LottieView from 'lottie-react-native';
import * as Progress from 'react-native-progress';
import axios from 'axios';
import {token} from '../dunzo/dunzo';
import RazorpayCheckout from 'react-native-razorpay';
// import Image from 'react-native-scalable-image';
 class PrescriptionView extends Component {
  constructor(props) {
    super(props);
    let item =  this.props?.route?.params?.item||null

    this.state = {
         item,
         valid: this.props.route?.params?.item?.active,
         load:false,
         pk: this.props?.route?.params?.pk ||null,
         showModal2:false,
         selected:"Prescribed",
         prescribed:[],
         medicinesGiven:[],
         counter:0,
         progress:0,
         clinics:[
             {
                 name:"Muthu Clinic"
             },
               {
                 name:"Sai Clinic"
             },
                {
                 name:"dev Clinic"
             },
         ],
         buy:false,
         selectedItems:[],
         checkoutModal:false,
         address:null,
         showModal:false,
         orderPk:null,
         acceptedClinics:[],
         shownoresult:false,
         selectedClinicIndex:null,
         deliveryDetailsLoading:false,
         priceDetails:null,
         errorDetails:null,
         paymentLoading:false
    };
    }
    renderContent = () => (
    <View
      style={{
        backgroundColor: '#fafafa',
        padding: 16,
        height: 450,
      }}
    >
      <Text style={[styles.text]}>Swipe down to close</Text>
    </View>
  ); 
     getDetails = async () => {
         let api = `${url}/api/prescription/prescriptions/${this.state.pk}/`
         const data = await HttpsClient.get(api)
         console.log(api)
         if (data.type == "success") {
             this.setState({ item: data.data },()=>{
                 this.filterMedicines()
             })
         }
     }
     validateAnimations = async () => {
         let swipeTut = await AsyncStorage.getItem("swipeTut")
         if (swipeTut == null) {
             AsyncStorage.setItem("swipeTut", "true")
             this.setState({ lottieModal: true }, () => {
                 this.animation.play()
             })
         }
     }
     filterMedicines = () => {
         let prescribed = this.state.item.medicines.filter((item) => !item.is_given)
         const medicinesGiven = this.state.item.medicines.filter((item) => item.is_given)
         prescribed.forEach((item)=>{
            item.isAdded = true,
            item.addedQuantity = item.total_qty
         })
         this.setState({medicinesGiven,prescribed})
     }
setLocations =()=>{
    let address ={
        address:this.props.user.profile.location,
        latitude:this.props.user.profile.lat,
        longitude:this.props.user.profile.lang
    }
    this.setState({address})
}
    componentDidMount(){
        this.setLocations()
        this.validateAnimations();
        // this.getAvailableClinics()
        if(this.state.pk ==null){
            this.filterMedicines()
        }
        if(this.state.pk){
            this.getDetails()
        }
  
    }
    componentWillUnmount(){

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
    validate = async () => {
        this.setState({showModal2:false})
        
        let api = `${url}/api/prescription/prescriptions/${this.state.item.id}/`
        console.log(api)
        let sendData = {
            active: !this.state.valid
        }
        let post = await HttpsClient.patch(api, sendData)
        if (post.type == "success") {
            this.setState({ load: false })
            this.showSimpleMessage("changed successfully", "#00A300", "success")
            this.setState({ valid: !this.state.valid })
        } else {
            this.setState({ load: false })
            this.showSimpleMessage("Try again", "#B22222", "danger")
        }

    }
    getAvailableClinics = async() =>{
       let api =`${url}/api/prescription/medicalaccepted/?for_order=${this.state.orderPk}&status=accepted`
       let data = await HttpsClient.get(api)
       console.log(api,data)
       if(data.type=="success"){
            this.setState({acceptedClinics:data.data})
       }
    }
     lottieModal = () => {
         const config = {
             velocityThreshold: 0.3,
             directionalOffsetThreshold: 80
         };
         return (
             <Modal
                 statusBarTranslucent={true}
                 deviceHeight={screenHeight}
                 isVisible={this.state.lottieModal}
             >

                 <View style={{ height: height * 0.7, alignItems: "center", justifyContent: "center" }}>

                     <LottieView
                         ref={animation => {
                             this.animation = animation;
                         }}
                         style={{


                             width: width,
                             height: height * 0.4,

                         }}
                         source={require('../assets/lottie/swipe-gesture-right.json')}
                     // OR find more Lottie files @ https://lottiefiles.com/featured
                     // Just click the one you like, place that file in the 'assets' folder to the left, and replace the above 'require' statement
                     />
                     <View style={{ position: "relative", top: -100, }}>
                         <View>
                             <Text style={[styles.text, { color: "#fff", marginTop: -40 }]}>swipe to go back</Text>
                         </View>
                         <TouchableOpacity style={{ height: height * 0.05, width: width * 0.2, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", borderRadius: 5, marginLeft: 20 }}
                             onPress={() => {
                                 this.animation.pause();
                                 this.setState({ lottieModal: false })

                             }}
                         >
                             <Text style={[styles.text, { color: "#000" }]}>ok</Text>
                         </TouchableOpacity>
                     </View>

                 </View>

             </Modal>

         )
     }
     sepeartor =()=>{
    return(
        <View>
            <Text style={[styles.text,{color:"#000"}]}> , </Text>
        </View>
    )
}
     renderHeader = () => {
         return (
             <View style={{flex:1}}>
                     <View style={{flex:0.5,flexDirection:"row",alignItems:"center",justifyContent:"space-around"}}>
                            <View style={{flexDirection:"row"}}>
                                  <View>
                                             <Text style={[styles.text, { color: "#000",fontSize:height*0.02 }]}>Reason : </Text>
                                  </View>
                                  <View>
                                             <Text style={[styles.text, {fontSize:height*0.02}]}>{this.state?.item?.ongoing_treatment}</Text>
                                  </View>
                            </View>
                            <View style={{flexDirection:"row"}}>
                                           <Text style={[styles.text, { color: "#000",fontSize:height*0.02 }]}>Diagnosis : </Text>
                                           <View>
                                                   <FlatList 
                                        horizontal={true}
                                        data={this.state.item.diseaseTitle}
                                        keyExtractor={(item,index)=>index.toString()}
                                        ItemSeparatorComponent={this.sepeartor}
                                        renderItem ={({item,index})=>{
                                                return(
                                                <View style={{ alignItems: "center", justifyContent: "center" ,flexDirection:"row"}}>
                                                    <Text style={[styles.text, {color:"#000",fontSize:height*0.02}]}>{item}</Text>
                                                </View>
                                                )
                                        }}
                    
                                    />
                                           </View>
                                 
                    </View>
                     </View>
                     <View style={{flex:0.5,flexDirection:"row",alignItems:"center",justifyContent:"space-around"}}>
                                <TouchableOpacity
                         onPress={() => { this.setState({ selected: "Prescribed" }) }}
                         style={{ height: height * 0.04, width: width * 0.4, backgroundColor: this.state.selected == "Prescribed" ? themeColor : "gray", alignItems: "center", justifyContent: "center", borderRadius: 5 }}
                     >
                         <Text style={[styles.text, { color: "#fff",fontSize:height*0.02 }]}>Prescribed</Text>
                     </TouchableOpacity>
                     <TouchableOpacity
                         onPress={() => { this.setState({ selected: "Medicines Given" }) }}
                         style={{ height: height * 0.04, width: width * 0.4, backgroundColor: this.state.selected == "Medicines Given" ? themeColor : "gray", alignItems: "center", justifyContent: "center", borderRadius: 5 }}
                     >
                         <Text style={[styles.text, { color: "#fff",fontSize:height*0.02 }]}>Medicines Given</Text>
                     </TouchableOpacity>
                     </View>
             </View>
            //  <View>
            //      <View style={{ marginHorizontal: 20, flexDirection: "row", marginTop: 10 }}>
            //          <View style={{ alignItems: "center", justifyContent: "center" }}>
            //              <Text style={[styles.text, { color: "#000", }]}>Reason : </Text>
            //          </View>
            //          <View style={{ alignItems: "center", justifyContent: "center" }}>
            //              <Text style={[styles.text, {}]}>{this.state?.item?.ongoing_treatment}</Text>
            //          </View>
            //      </View>
            //      <View style={{ marginHorizontal: 20, flexDirection: "row", marginTop: 10 }}>
            //          <View style={{ alignItems: "center", justifyContent: "center" }}>
            //              <Text style={[styles.text, { color: "#000", }]}>Diagnosis : </Text>
            //          </View>
               
                //  </View>

            //      <View style={{ marginHorizontal: 20, flexDirection: "row", marginTop: 10, alignItems: "center", justifyContent: "space-around" }}>
              
            //      </View>
            //  </View>
         )
     }
     addMedicine =(item,index) =>{
         let duplicate = this.state.prescribed
         duplicate[index].isAdded = true
         duplicate[index].addedQuantity = item.total_qty
         this.setState({prescribed:duplicate})
     }
     decreaseQuantity = (item,index)=>{
        let duplicate = this.state.prescribed
         duplicate[index].addedQuantity -= 1
         if(duplicate[index].addedQuantity==0){
            duplicate[index].isAdded = false
         }
         this.setState({prescribed:duplicate})
     }
     addQuantity =(item,index) =>{
        
        let duplicate = this.state.prescribed
        if(item.is_drug){
            if(duplicate[index].addedQuantity==duplicate[index].total_qty){
             return this.showSimpleMessage("Max Qty Reached","orange","info")
            }
        }
     
         duplicate[index].addedQuantity += 1
     
         this.setState({prescribed:duplicate})
     }
validateButton = (item,index) =>{
    if(this.state.buy){

           return(
    
            <>
                  {! item.isAdded&&<TouchableOpacity 
                             style={{height:height*0.04,width:"80%",backgroundColor:themeColor,alignItems:"center",justifyContent:"center",borderRadius:5}}
                             onPress={()=>{
                               this.addMedicine(item,index)
                                
                           }}
                          >
                                <Text style={[styles.text,{color:"#fff"}]}>Add</Text>
              </TouchableOpacity>}
               {
                   item.isAdded &&<View
                     style={{height:height*0.04,width:"90%",backgroundColor:themeColor,alignItems:"center",justifyContent:"space-around",borderRadius:5,flexDirection:"row"}}
                   >
                         <TouchableOpacity 
                           onPress={()=>{
                               this.decreaseQuantity(item,index)
                           }}
                         >
                             <AntDesign name={"minus"} size={14} color="#fff" />
                         </TouchableOpacity>
                         <Text style={[styles.text,{color:"#fff"}]}>{item.addedQuantity}</Text>
                           <TouchableOpacity 
                             onPress={()=>{
                               this.addQuantity(item,index)
                           }}
                           >
                                 <AntDesign name="plus" size={14} color="#fff" />
                         </TouchableOpacity>
                   </View>
               }
            </>
            
    )
    }else{
        return null
    }

        
}
    renderItem = (item,index) => {
      

        if (item.medicinename.type == "Tablet" || item.medicinename.type == "Capsules") {
            return (

                <View style={{ marginTop: 10, flexDirection: "row" }}>


                    <View style={{ flex: 0.8, paddingLeft: 20, }}>
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
                            {item.command&&<View>
                                       <Text style={[styles.text, { fontWeight: "bold" }]}>Comments:</Text>
                            <View>
                                <Text style={[styles.text, { marginLeft: 10 }]}>{item.command}</Text>
                            </View>
                            </View>
                     }
                        </View>
                        <View style={{ alignSelf: "flex-end" }}>
                            <Text style={[styles.text]}>Qty: {item.total_qty}</Text>
                        </View>
                    </View>
                     <View style={{flex:0.2,}}>
                         {
                             this.validateButton(item,index)
                         }
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
                            <Text style={[styles.text]}>Qty: {item.total_qty}</Text>
                        </View>
                    </View>
                    <View style={{flex:0.2,}}>
                          {
                             this.validateButton(item,index)
                         }
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
                                <Text style={[styles.text, { fontSize: 12, marginLeft: 10 }]}>{item.total_qty} ml {item.after_food ? "afterFood" : "before Food"}</Text>


                            </View>

                        </View>}
                        {item.afternoon_count != 0 && <View style={{}}>
                            <View style={{ flexDirection: "row" }}>
                                <Text style={{ borderColor: "#000", borderRightWidth: 1, width: width * 0.2 }}>Afternoon </Text>
                                <Text style={[styles.text, { fontSize: 12, marginLeft: 10 }]}>{item.total_qty} ml {item.after_food ? "afterFood" : "before Food"}</Text>



                            </View>

                        </View>}
                        {item.night_count != 0 && <View style={{}}>
                            <View style={{ flexDirection: "row" }}>
                                <Text style={{ borderColor: "#000", borderRightWidth: 1, width: width * 0.2 }}>Night </Text>

                                <Text style={[styles.text, { fontSize: 12, marginLeft: 10 }]}>{item.total_qty} ml {item.after_food ? "afterFood" : "before Food"}</Text>


                            </View>
                        </View>}
                        <View style={{ marginTop: 10 }}>
                            <Text style={[styles.text, { fontWeight: "bold" }]}>Comments:</Text>
                            <View>
                                <Text style={[styles.text, { marginLeft: 10 }]}>{item.command}</Text>
                            </View>
                        </View>
                        <View style={{ alignSelf: "flex-end" }}>
                            <Text style={[styles.text]}>Qty: {1}</Text>
                        </View>
                    </View>
                        <View style={{flex:0.2,}}>
                          {
                             this.validateButton(item,index)
                         }
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
                            <Text style={[styles.text]}>Qty: {item.total_qty}</Text>
                        </View>
                    </View>
                        <View style={{flex:0.2,}}>
                         {
                             this.validateButton(item,index)
                         }
                     </View>

                </View>
            )
        }
        if (item.medicinename.type == "Others") {
            return (

                <View style={{ marginTop: 10, flexDirection: "row", flex: 1 }}>

                    <View style={{ flex: 0.8, paddingLeft: 20 }}>
                        <View style={{ marginTop: 10 }}>
                            <Text style={[styles.text, { fontWeight: "bold" }]}>Comments:</Text>
                            <View>
                                <Text style={[styles.text, { marginLeft: 10 }]}>{item.command}</Text>
                            </View>
                        </View>
                          <View style={{ alignSelf: "flex-end" }}>
                            <Text style={[styles.text]}>Qty: {item.total_qty}</Text>
                        </View>
                    </View>
                <View style={{flex:0.2,}}>
                        {
                             this.validateButton(item,index)
                         }
                     </View>
                
                     
                     
                </View>
            )
        }

    }
  


     onSwipe(gestureName, gestureState) {
         const { SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT } = swipeDirections;
         this.setState({ gestureName: gestureName });
         switch (gestureName) {
            //  case SWIPE_UP:
            //      this.props.navigation.goBack()
            //      break;
            //  case SWIPE_DOWN:
            //      this.props.navigation.goBack()
            //      break;
             case SWIPE_LEFT:
                 this.props.setNoticationRecieved(null)
                 this.props.navigation.goBack()
                 break;
             case SWIPE_RIGHT:
                 this.props.setNoticationRecieved(null)
                 this.props.navigation.goBack()
                 break;
         }
     }
     placeOrder =() =>{
         let selectedItems = []
         let medicines =  this.state.prescribed.filter((item)=>{
             return item.isAdded === true
         })
         if(medicines.length == 0){
             return this.showSimpleMessage("Please Add Medicines to Place Order","orange","info")
         }
        medicines.forEach((item)=>{
              let pushObj = {
                  isAdded :true,
                  quantity:item.addedQuantity,
                  medicine:item.id,
                  name:item.medicinename.name,
                  is_drug:item.is_drug,
                  total_qty:item.total_qty
              }
             selectedItems.push(pushObj) 
        })
        this.setState({selectedItems,checkoutModal:true})
        
     }
     footer =()=>{
         return(
             <View style={{alignItems:"center",justifyContent:"space-around",marginVertical:20,flexDirection:"row"}}>
                 {!this.state.buy&& <TouchableOpacity style={{height:height*0.04,width:width*0.3,alignItems:"center",justifyContent:"center",backgroundColor:themeColor,borderRadius:5}}
                   onPress={()=>{
                         this.setState({buy:true})
                   }}
                  >
                         <Text style={[styles.text,{color:"#fff",fontSize:height*0.02}]}>Buy</Text>
                  </TouchableOpacity>}
                  {
                        this.state.buy&&<>
                           <TouchableOpacity style={{height:height*0.04,width:width*0.3,alignItems:"center",justifyContent:"center",backgroundColor:themeColor,borderRadius:5}}
                   onPress={()=>{
                       this.placeOrder()
                    }}
                  >
                         <Text style={[styles.text,{color:"#fff",fontSize:height*0.02}]}>Place Order</Text>
                  </TouchableOpacity>
                       <TouchableOpacity style={{height:height*0.04,width:width*0.3,alignItems:"center",justifyContent:"center",backgroundColor:themeColor,borderRadius:5}}
                   onPress={()=>{
                         this.setState({buy:false})
                    }}
                  >
                         <Text style={[styles.text,{color:"#fff",fontSize:height*0.02}]}>Cancel</Text>
                  </TouchableOpacity>
                        </>
                  }
             </View>
         )
     }
    milliconverter = (millis)=>{
        if (millis){
            var minutes = Math.floor(millis / 60000);
            var seconds = ((millis % 60000) / 1000).toFixed(0);
            return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
        }
      
    }
    headers =()=>{
        return(
            <View style={{alignItems:"center",justifyContent:"center",marginTop:10}}>
                <Text style={[styles.text,{color:"#000",textDecorationLine:"underline",fontSize:20}]}>Available Clinics :</Text>
            </View>
        )
    }
    seperator =() =>{
        return(
            <View style={{height:0.3,backgroundColor:"gray"}}>

            </View>
        )
    }
    backFunction =(address)=>{
        this.setState({address,checkoutModal:true})
    }
    confirmOrder = async() =>{
        this.setState({confirming:true})
        if(this.state.address==null){
            this.setState({confirming:false})
            return this.showSimpleMessage("Please Select Address","orange","info")
        }
        if(this.state.selectedItems.length==0){
            this.setState({confirming:false})
            return this.showSimpleMessage("Please Select Medicines","orange","info")
        }
        let api = `${url}/api/prescription/placeOrder/`
         let sendData = {
             prescription:this.state.item.id,
             order_mode:"Dunzo",
             lat:this.state.address.latitude,
             lang:this.state.address.longitude,
             medicines:this.state.selectedItems
         }
         let post  =await HttpsClient.post(api,sendData)
         
         if(post.type =="success"){
             this.setState({checkoutModal:false,confirming:false,orderPk:post.data.pk},()=>{
                        this.setState({showModal:true},()=>{
                                     this.interval = setInterval(() =>{
                                           this.setState({ counter:this.state.counter+1000},()=>{
                                           this.setState({progress:(this.state.counter*100/60000)/100})
                            
                                       })
                                     }  ,1000);
                                     this.requestInterVal = setInterval(()=>{
                                         this.getAvailableClinics()
                                     },20000)
                                     this.searchanimation.play()
                        });
             })
         }else{
              this.showSimpleMessage("Something Went Wrong","red","danger")
              this.setState({confirming:false})
         }
    }
    decreaseQuantity2 =(item,index)=>{
        let duplicate = this.state.selectedItems
        duplicate[index].quantity -=1
        if(  duplicate[index].quantity==0){
            duplicate.splice(index,1)
              this.setState({selectedItems:duplicate})
        }else{
          this.setState({selectedItems:duplicate})
        }
      
    }
    addQuantity2 =(item,index) =>{
       let duplicate = this.state.selectedItems
       if(item.is_drug){
              if(duplicate[index].quantity==duplicate[index].total_qty){
             return this.showSimpleMessage("Max Qty Reached","orange","info")
            }
       }
        duplicate[index].quantity +=1
        this.setState({selectedItems:duplicate})
    }
        validatePayment =async(data)=>{
     let api = `${url}/api/profile/createDunzoTask/`
     let sendData ={
         razorpay_order_id: data.razorpay_order_id,
         razorpay_payment_id: data.razorpay_payment_id,
         razorpay_signature: data.razorpay_signature
     }
     console.log(sendData,"errrrt")
     let post =await HttpsClient.post(api,sendData)
     console.log(post,"task Create")
     if(post.type =="success"){
        this.setState({paymentLoading:false})
        this.showSimpleMessage("Order Placed SuccessFully","green","success")
     }else{
        this.setState({paymentLoading:false})
        this.showSimpleMessage(`${post?.data?.dunzoerror}`,"orange","info")
     }
    }
    confirmPharmacy = async(item,price)=>{
        // let api = `${url}/api/prescription/medicalAccept/`
        // let sendData ={
        //     order:this.state.orderPk,
        //     medicalorder:item.id
        // }
        // let post = await HttpsClient.post(api,sendData)
        // console.log(post)
        this.setState({loading:true,})
        let api = `${url}/api/profile/createDunzo/`
        let sendData ={
            order:item.for_order.id,
            amount:price,
            medicalorder:item.id
        }
        let post = await HttpsClient.post(api,sendData)
        console.log(post)
        if(post.type=="success"){
                clearInterval(this.interval);
                clearInterval(this.requestInterVal);
                this.setState({showModal:false,paymentLoading:true})
                var options = {
                description: `Medicines Purchase`,
                image: 'https://i.imgur.com/3g7nmJC.png',
                currency: 'INR',
                key: 'rzp_test_qlBHML4RDDiVon',
                name: 'Clinto',
                order_id: `${post.data.order_id}`,
                prefill: {
                    email: `${this.props?.user?.email}`,
                    contact: `${this?.props?.user?.profile?.mobile}`,
                    name:`${this?.props?.user?.first_name}`
                },
                theme: { color: '#1f1f1f' }
            }
    RazorpayCheckout.open(options).then((data) => {
  
        // handle success
        this.validatePayment(data)
        this.setState({loading:false})
      
   
    }).catch((error) => {
        // handle failure
   
        this.setState({ paymentLoading: false })

        return this.showSimpleMessage(`${error.error.description}`, "#dd7030")
      
    });
        }else{
            this.setState({ paymentLoading: false })
            this.showSimpleMessage("Something Went Wrong","orange","info")
        }
    }
    checkoutModal =() =>{
      return(
           <Modal 
            swipeThreshold={100}
            onSwipeComplete={() => { this.setState({checkoutModal:false})}}
            swipeDirection="down"
            animationOutTiming={50}
            animationOut={"slideOutDown"}
            onBackdropPress={() => { this.setState({ showModal:false})}}
            style={{alignItems:"flex-end",marginHorizontal:0,flexDirection:"row",marginVertical:0}}
            statusBarTranslucent={true}
            deviceHeight={screenHeight}
            isVisible={this.state.checkoutModal}
           >
            <View style={{height:height*0.8,backgroundColor:"#fff",width,elevation:5,borderTopRightRadius:15,borderTopLeftRadius:15}}>
                    <View style={{flexDirection:"row"}}>
                       <View style={{flex:0.3}}>

                       </View>
                       <View style={{flex:0.4,alignItems:"center",justifyContent:"center"}}>
                            <View style={{height:5,width:width*0.1,backgroundColor:"gray",marginVertical:10,borderRadius:5}}>
                             </View>
                       </View>
                        <View style={{flex:0.3,alignItems:"center",justifyContent:"center"}}>
                             
                         </View>
                   </View>
              
                  <View style={{flexDirection:"row",paddingHorizontal:10,borderBottomWidth:0.19,borderColor:"gray",paddingVertical:10}}>
                        <View>
                            <Entypo name="location-pin" size={24} color="#40b455" />
                        </View>
                        <TouchableOpacity 
                          onPress={() => { 
                              this.setState({checkoutModal:false},()=>{
                                this.props.navigation.navigate("SelectAddress", { backFunction: (address) => { this.backFunction(address)}})
                              })
                     
                            }}
                           style={{flex:1}}
                        >
                           
                              <View style={{flex:1,flexDirection:"row"}}>
                                  <View style={{flex:0.3}}>
                                              <Text style={[styles.text]}>Delivery at - </Text>
                                  </View>
                                  <View style={{flex:0.7}}>
                                            <Text style={[styles.text,{color:"#000"}]} numberOfLines={1} >{this.state.address?.address} </Text>
                                  </View>
                                   <View style={{flex:0.1}}>
                                  <Ionicons name="md-chevron-down" size={24} color="black" />
                                  </View>
                       
                             
                            </View>
                    
                        </TouchableOpacity>
                  </View>
                   <FlatList 
                      data={this.state.selectedItems}
                      keyExtractor={(item,index)=>index.toString()}
                      renderItem ={({item,index})=>{
                          return(
                              <View style={{flexDirection:"row",marginTop:10,paddingHorizontal:10}}>
                                   <View style={{flex:0.1}}>
                                        <FontAwesome name="dot-circle-o" size={24} color={themeColor}/>
                                   </View>
                                   <View style={{flex:0.7,alignItems:"center",justifyContent:"center"}}>
                                            <Text style={[styles.text,{color:"#000"}]}>{item.name}</Text>
                                   </View>
                                   <View style={{flexDirection:"row",flex:0.2,backgroundColor:themeColor,height:height*0.04,alignItems:"center",justifyContent:"space-around"}}>
                                          <TouchableOpacity 
                                                    onPress={()=>{
                                                        this.decreaseQuantity2(item,index)
                                                    }}
                                            >
                                            <AntDesign name={"minus"} size={14} color="#fff" />
                                        </TouchableOpacity>
                                        <Text style={[styles.text,{color:"#fff"}]}>{item.quantity}</Text>
                                        <TouchableOpacity 
                                            onPress={()=>{
                                            this.addQuantity2(item,index)
                                        }}
                                        >
                                         <AntDesign name="plus" size={14} color="#fff" />
                                    </TouchableOpacity>
                                   </View>
                              </View>
                          )
                      }}
                   />
                  <View style={{height:height*0.08,borderTopWidth:0.19,borderColor:"gray",flexDirection:"row",alignItems:"center",justifyContent:"center"}}>
                      {!this.state.confirming? <TouchableOpacity style={{height:"80%",width:"50%",backgroundColor:themeColor,borderRadius:10,alignItems:"center",justifyContent:"space-around",flexDirection:"row"}}
                         onPress={()=>{
                             this.confirmOrder()
                         }}
                       >
                           <View>
                                     <Text style={[styles.text,{color:"#fff"}]}>Confirm</Text>
                           </View>
                         
                       </TouchableOpacity>:
                        <View  style={{height:"80%",width:"50%",backgroundColor:themeColor,borderRadius:10,alignItems:"center",justifyContent:"space-around",flexDirection:"row"}}>
                                <ActivityIndicator size={"large"} color={"#fff"}/>
                        </View>
                       }
                  </View>
            </View>
           </Modal>
        )
    }
    noResult =()=>{
        if(this.state.shownoresult){
           return(
               <View style={{height:height*0.7,alignItems:"center",justifyContent:"center"}}>
                   <View style={{flex:0.5,alignItems:"center",justifyContent:"center",}}>
                        <LottieView
                                 ref={animation => {
                                    this.notfoundAnimation = animation;
                                }}
                                style={{

                                    marginLeft:10,
                                    width: width*0.2,
                                    height: height*0.2,

                                }}
                             source={require('../assets/lottie/notFound.json')}
                 
                        />
                   </View>
                
                        <View style={{flex:0.5}}>
                              <View style={{alignItems:"center",justifyContent:"center",marginTop:10}}>
                                     <Text style={[styles.text,{color:"#000",textAlign:"center"}]}>No, Clinics Found We will Notify Once the Clinic Found</Text>
                              </View>
                              <View style={{alignItems:"center",justifyContent:"center",marginTop:10}}>
                                   <TouchableOpacity 
                                     onPress={()=>{this.setState({showModal:false})}}
                                     style={{height:height*0.05,width:width*0.3,alignItems:"center",justifyContent:"center",backgroundColor:themeColor,borderRadius:10}}
                                   >
                                           <Text style={[styles.text,{color:"#fff"}]}>OK</Text>
                                   </TouchableOpacity>
                              </View>
                            
                        </View>
               </View>
                 
           )    
        }
        return null
    }
    getInternetCharge =(medicineprice,deliveryPrice)=>{
     let   total = medicineprice+deliveryPrice
     return Math.ceil(total*(2/100))
    }
    validateDetails =(item,index)=>{
        if(this.state.deliveryDetailsLoading){
            return(
                <View>
                             <ActivityIndicator size={"large"} color={themeColor}/>
                </View>
           
            )
        }
        if(this.state.errorDetails){
            return(
                <View style={{marginVertical:10,alignItems:"center",justifyContent:"center"}}>
                    <Text style={[styles.text,{color:"#000"}]}>{this.state.errorDetails.message}</Text>
                </View>
            )
        }
       return(
           <View>
               <View style={{alignItems:"center",justifyContent:"center"}}>
                 
                   <View style={{marginTop:5,flexDirection:"row"}}>
                       <View style={{flex:0.4,alignItems:"center",justifyContent:"center"}}>
                                 <Text style={[styles.text]}>Distance  </Text>
                       </View>
                        <View style={{flex:0.2,alignItems:"center",justifyContent:"center"}}>
                                <Text style={[styles.text,{color:"#000"}]}>:</Text>
                        </View>
                        <View style={{flex:0.4,}}>
                            <Text style={[styles.text]}>{this.state.priceDetails.distance} km</Text>
                        </View>
                   </View>
                          <View style={{marginTop:5,flexDirection:"row"}}>
                       <View style={{flex:0.4,alignItems:"center",justifyContent:"center"}}>
                                 <Text style={[styles.text]}>Medicine Price  </Text>
                       </View>
                        <View style={{flex:0.2,alignItems:"center",justifyContent:"center"}}>
                                <Text style={[styles.text,{color:"#000"}]}>:</Text>
                        </View>
                        <View style={{flex:0.4,}}>
                            <Text style={[styles.text]}>₹ {item.otherDetails.price}</Text>
                        </View>
                   </View>
                           <View style={{marginTop:5,flexDirection:"row"}}>
                       <View style={{flex:0.4,alignItems:"center",justifyContent:"center"}}>
                                 <Text style={[styles.text]}>Delivery Price </Text>
                       </View>
                        <View style={{flex:0.2,alignItems:"center",justifyContent:"center"}}>
                                <Text style={[styles.text,{color:"#000"}]}>:</Text>
                        </View>
                        <View style={{flex:0.4,}}>
                            <Text style={[styles.text]}>₹ {this.state.priceDetails.estimated_price}</Text>
                        </View>
                   </View>
                         <View style={{marginTop:5,flexDirection:"row"}}>
                       <View style={{flex:0.4,alignItems:"center",justifyContent:"center"}}>
                                 <Text style={[styles.text]}>Internet Charge </Text>
                       </View>
                        <View style={{flex:0.2,alignItems:"center",justifyContent:"center"}}>
                                <Text style={[styles.text,{color:"#000"}]}>:</Text>
                        </View>
                        <View style={{flex:0.4,}}>
                            <Text style={[styles.text]}>₹ {this.getInternetCharge(item.otherDetails.price,this.state.priceDetails.estimated_price)}</Text>
                        </View>
                   </View>
                               <View style={{marginTop:5,flexDirection:"row"}}>
                       <View style={{flex:0.4,alignItems:"center",justifyContent:"center"}}>
                                 <Text style={[styles.text]}>Total </Text>
                       </View>
                        <View style={{flex:0.2,alignItems:"center",justifyContent:"center"}}>
                                <Text style={[styles.text,{color:"#000"}]}>:</Text>
                        </View>
                        <View style={{flex:0.4,}}>
                            <Text style={[styles.text]}>₹ {this.getInternetCharge(item.otherDetails.price,this.state.priceDetails.estimated_price)+item.otherDetails.price+this.state.priceDetails.estimated_price}</Text>
                        </View>
                   </View>
               
               </View>
               <View style={{marginVertical:10,alignItems:"center",justifyContent:"center"}}>
                       {!this.state.loading?<TouchableOpacity style={{height:height*0.04,width:width*0.3,alignItems:"center",justifyContent:"center",backgroundColor:themeColor,borderRadius:5}}
                         onPress={()=>{this.confirmPharmacy(item,this.getInternetCharge(item.otherDetails.price,this.state.priceDetails.estimated_price)+item.otherDetails.price+this.state.priceDetails.estimated_price)}}
                        >
                          <Text style={[styles.text,{color:"#fff"}]}>Place Order</Text>
                      </TouchableOpacity>:
                      <View style={{height:height*0.04,width:width*0.3,alignItems:"center",justifyContent:"center",backgroundColor:themeColor,borderRadius:5}}>
                         <ActivityIndicator size={"large"} color={"#fff"} />
                      </View>
                    }
               </View>
                    
           </View>
       )
    }
    getDeliveryDetails = async(item,index) =>{

        const headers = {
            'client-id': 'a61aec7d-50af-4dc0-b933-d09d9d82e320',
            'Authorization': token,
            'Accept-Language': 'en_US',
            'Content-Type':'application/json'
        }
        this.setState({deliveryDetailsLoading:true})
        let sendData ={
            "pickup_details":[
                {
                    "lat":Number(item.otherDetails.lat) ,
                    "lng":Number( item.otherDetails.lang),
                    "reference_id": item.id.toString()
                    
                }
            ],
            "optimised_route": true,
            "drop_details":[
                {
                     "lat":Number(item.for_order.lat),
                     "lng":Number(item.for_order.lang),
                     "reference_id":item.id.toString()
                }
            ]
        }

       
        try{
            const {data} = await axios.post(`${dunzourl}/api/v2/quote`,sendData,{
                 headers:headers
              })
              console.log(data)
               this.setState({deliveryDetailsLoading:false,priceDetails:data})
        }catch(error){
            this.setState({errorDetails:error.response.data})
            console.log(error.response.data,"kkkk")
            this.setState({deliveryDetailsLoading:false})
        }

    }  
      bottomModal =()=>{
        return(
           <Modal 
            swipeThreshold={100}
            // onSwipeComplete={() => { this.setState({ showModal:false})}}
         
            animationOutTiming={50}
            animationOut={"slideOutDown"}
            style={{alignItems:"flex-end",marginHorizontal:0,flexDirection:"row",marginVertical:0}}
             statusBarTranslucent={true}
             deviceHeight={screenHeight}
             isVisible={this.state.showModal}
           >
               <View style={{height:height*0.9,backgroundColor:"#fff",width,elevation:5,borderTopRightRadius:15,borderTopLeftRadius:15}}>
                   <View style={{flexDirection:"row"}}>
                       <View style={{flex:0.3}}>

                       </View>
                       <View style={{flex:0.4,alignItems:"center",justifyContent:"center"}}>
                            <View style={{height:5,width:width*0.1,backgroundColor:"gray",marginVertical:10,borderRadius:5}}>
                             </View>
                       </View>
                        <View style={{flex:0.3,alignItems:"center",justifyContent:"center"}}>
                             <Text style={[styles.text,{color:"#000"}]}>{this.milliconverter(this.state.counter)}</Text> 
                         </View>
                   </View>
        
                   <View style={{flex:1}}>
                     
                         <View style={{flex:0.7,}}>
                              <Progress.Bar 
                               height={2}
                               progress={this.state.progress}
                               color={themeColor}
                               width={width} 
                               borderWidth={0}
                               borderRadius={1}
                              />
                              <FlatList 
                                // ItemSeparatorComponent={this.seperator}
                                ListEmptyComponent={this.noResult()}
                                ListHeaderComponent={this.headers()}
                                data={this.state.acceptedClinics}
                                keyExtractor={(item,index)=>index.toString()}
                                renderItem={({item,index})=>{
                                    return(
                                        <View style={{marginVertical:20}}>
                                            <View style={{flexDirection:"row"}}>
                                                
                                   
                                                 <View style={{flex:0.1,alignItems:"center",justifyContent:"center"}}>
                                                         <Text style={[styles.text,{color:"#000"}]}>{index+1} .</Text>
                                                 </View>
                                                <View style={{flex:0.6,alignItems:"center",justifyContent:"space-around"}}>
                                                    <View style={{flexDirection:"row",alignItems:"center",justifyContent:"center",width:"100%"}}>
                                                        <View style={{flexDirection:"row"}}>
                                                            <View>
                                                                <Text style={[styles.text,{color:"#000",textAlign:"center"}]}>{item.otherDetails.name}</Text>

                                                            </View>
                                                            {/* <View style={{flexDirection:"row"}}>
                                                               <Text style={[styles.text]}> - {item.otherDetails.discount}</Text> 
                                                               <MaterialCommunityIcons name="brightness-percent" size={24} color="#63BCD2" style={{marginLeft:3}}/>
                                                            </View> */}
                                                        </View>
                                          

                                                    </View>
                                                     <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-around",marginTop:10}}>
                                                          <TouchableOpacity style={[styles.boxWithShadow, { backgroundColor: "#fff", height: 30, width: 30, borderRadius: 15, alignItems: "center", justifyContent: 'center', marginLeft: 10 }]}
                                        onPress={() => {
                                            if (Platform.OS == "android") {
                                                Linking.openURL(`tel:${this.state?.clinicDetails?.mobile}`)
                                            } else {

                                                Linking.canOpenURL(`telprompt:${this.state?.clinicDetails?.mobile}`)
                                            }
                                         }}
                                    >
                                        <FontAwesome name="phone" size={20} color="#63BCD2" />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.boxWithShadow, { backgroundColor: "#fff", height: 30, width: 30, borderRadius: 15, alignItems: "center", justifyContent: 'center', marginLeft: 10 }]}
                                        onPress={() => {
                                            Linking.openURL(
                                                `https://www.google.com/maps/dir/?api=1&destination=` +
                                                item.lat +
                                                `,` +
                                               item.lang +
                                                `&travelmode=driving`
                                            );
                                        }}
                                    >
                                        <FontAwesome5 name="directions" size={20} color="#63BCD2" />
                                    </TouchableOpacity>
                                    <View style={{marginLeft:10}}>
                                        <Text style={[styles.text]}>({item.distance}) km</Text>
                                    </View>
                                                     </View>
                                                </View>
                                                <View style={{flex:0.3,alignItems:"center",justifyContent:"center"}}>
                                                       <TouchableOpacity 
                                                           style={{height:height*0.04,width:"80%",alignItems:"center",justifyContent:"center",backgroundColor:themeColor,borderRadius:5}}
                                                            onPress={()=>{
                                                                this.setState({selectedClinicIndex:index,deliveryDetailsLoading:true,priceDetails:null,errorDetails:null})
                                                                this.getDeliveryDetails(item,index);
                                                            }}
                                                           >
                                                                    <Text style={[styles.text,{color:"#fff"}]}>View Price</Text>
                                                           </TouchableOpacity>
                                            
                                                </View>
                                                         </View>
                                             <View>
                                                    <View style={{alignItems:"center",justifyContent:"center",marginTop:5}}>
                                                        
                                                         
                                                    </View>
                                                    {this.state.selectedClinicIndex===index&&
                                                        this.validateDetails(item,index)
                                                    }
                                            </View>
                                        </View>
                                    )
                                }}
                              />
                         </View>
                { !this.state.shownoresult&&       <View style={{flex:0.3,alignItems:"center",justifyContent:"center"}}>
                        <LottieView
                                ref={animation => {
                                    this.searchanimation = animation;
                                }}
                                style={{

                                    marginLeft:10,
                                    width: width,
                                    height: "80%",

                                }}
                         source={require('../assets/lottie/search.json')}
                 
                        />
                         <View style={{marginTop:-50}}>
                             <View>
                                   <Text style={[styles.text,{color:"#000"}]}>Waiting For Medical Response</Text>
                             </View>
                             <View style={{alignItems:"center",justifyContent:"center"}}>
                                  <TouchableOpacity style={{height:height*0.04,width:width*0.2,alignItems:"center",justifyContent:"center",backgroundColor:themeColor,marginTop:5,borderRadius:5}}
                                    onPress={()=>{this.setState({showModal:false,counter:0},()=>{
                                           clearInterval(this.interval);
                                           clearInterval(this.requestInterVal);
                                          this.searchanimation.pause()
                                    })}}
                                  >
                                      <Text style={[styles.text,{color:"#fff"}]}>Cancel</Text>
                                  </TouchableOpacity>
                             </View>
                         </View>
                         </View>}
                   </View>
               
               </View>
           </Modal>
        )
     
    }
    componentDidUpdate(){
        if(this.state.counter===60000){
           clearInterval(this.requestInterVal);
           clearInterval(this.interval);
           this.searchanimation.pause();
           this.setState({counter:0,shownoresult:true,progress:0},()=>{
               if(this.notfoundAnimation){
                          this.notfoundAnimation.play();
               }
                 
           })
       
        }
    }
    removeMedicine =(item,index)=>{
       let duplicate = this.state.prescribed
       duplicate[index].isAdded = false
       this.setState({prescribed:duplicate})
    }
  render() {
      const config = {
          velocityThreshold: 0.3,
          directionalOffsetThreshold: 80
      };
      const { item } = this.state
    return (
         <>
            <SafeAreaView style={styles.topSafeArea} />
            <SafeAreaView style={styles.bottomSafeArea}>
                <StatusBar backgroundColor={themeColor}/>
                <View style={{ height: height * 0.1, backgroundColor:themeColor,flexDirection:"row"}}>
                     <View style={{flex:0.7}}>
                         <View style={{flex:0.5,justifyContent:"center",marginLeft:20}}>
                            <Text style={[styles.text,{color:"#ffff",fontWeight:'bold',fontSize:height*0.03}]}>{this.state?.item?.clinicname?.name?.toUpperCase()}</Text>

                         </View>
                         <View style={{flex:0.5,marginLeft:20,}}>
                             <View>
                                   <Text style={[styles.text,{color:"#fff",fontSize:height*0.017}]}>{this.state?.item?.clinicname?.address}</Text>
                             </View>
                         
                            <View style={{ }}>
                                <Text style={[styles.text, { color: "#fff" ,fontSize:height*0.017}]}>{this.state?.item?.clinicname?.city}-{this.state?.item?.clinicname?.pincode}</Text>
                            </View>
                         </View>
                        
                     </View>
                     <View style={{flex:0.3,alignItems:'center',justifyContent:'center'}}>
                          <Image 
                            style={{height:'80%',width:'80%',resizeMode:"contain"}}
                            source={{ uri:"https://i.pinimg.com/originals/8d/a6/79/8da6793d7e16e36123db17c9529a3c40.png"}}
                          />
                     </View>
                </View>
                <GestureRecognizer
                    onSwipe={(direction, state) => this.onSwipe(direction, state)}
                    config={config}
                    style={{
                        flex: 1,
                        backgroundColor: "#fff"
                    }}
                >
                   
             
                 <View style={{flex:1}}>
                    <View style={{ flex: 0.13,borderColor:"#eee",borderBottomWidth:0.5,}}>
                        <View style={{flex:0.5,flexDirection:"row",alignItems:"center",justifyContent:"space-around"}}>
                             <View style={{flexDirection:'row'}}>
                               <View>
                                    <Text style={[styles.text,{fontSize:height*0.02}]}>Name : </Text>
                               </View>
                                <View>
                                    <Text style={[styles.text,{color:"#000",fontSize:height*0.02}]}>{this.state?.item?.username.name}</Text>
                                </View>
                           </View>
                               <View style={{ flexDirection: 'row' }}>
                                <View>
                                    <Text style={[styles.text,{fontSize:height*0.02}]}>Age : </Text>
                                </View>
                                <View>
                                        <Text style={[styles.text, { color: "#000",fontSize:height*0.02 }]}>{this.state?.item?.username.age}</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <View>
                                    <Text style={[styles.text,{fontSize:height*0.02}]}>Sex : </Text>
                                </View>
                                <View>
                                    <Text style={[styles.text, { color: "#000",fontSize:height*0.02}]}>{this?.state?.item?.sex}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{flex:0.5,paddingRight:20,flexDirection:"row",justifyContent:"space-around"}}>
                            <View>
                                
                            </View>
                            <Text style={[styles.text,{fontSize:height*0.016}]}>Prescription No : {this.state?.item?.id}</Text>
                            <Text style={[styles.text,{textAlign:"right",fontSize:height*0.016}]}>{moment(this.state?.item?.created).format('DD/MM/YYYY')}</Text>
                        </View>
                       
                    </View>
                    <View style={{flex:0.22}}>
                            {
                                this.renderHeader()
                            }
                    </View>
                  
                        <View style={{flex:0.48,}}>

                            {this.state.selected =="Prescribed"?
                            <FlatList
                             showsVerticalScrollIndicator={false}
                             ListFooterComponent={this.footer()}
                             style={{height:"100%"}}
                             data={this.state.prescribed}
                             keyExtractor={(item, index) => index.toString()}
                             renderItem={({ item, index }) => {
                                return (
                                    <View style={{
                                        paddingBottom:10,
                                        flex: 1,
                                        borderBottomWidth: 0.5,
                                        borderColor: '#D1D2DE',
                                        backgroundColor: '#FFFFFF',
                                    }}>
                                        <View style={{ flexDirection: "row", justifyContent: "space-between", paddingLeft: 15, marginTop: 5 }}>
                                            <View style={{ flexDirection: "row", flex: 0.7 }}>
                                                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>


                                                    <Text style={[styles.text, { color: "#000", fontSize: 18 }]}>{item.medicinename.name}</Text>
                                                    <Text style={[styles.text, { color: "gray",}]}> * {item.days} days</Text>
                                                    <Text style={[styles.text, { color: "gray", }]}> </Text>
                                                </View>

                                            </View>


                                        </View>

                                        {
                                            this.renderItem(item,index)
                                        }
                                    {item.isAdded&&this.state.buy&&<View style={{position:"absolute",right:20,}}>
                                                <TouchableOpacity
                                                  onPress={()=>{this.removeMedicine(item,index)}}
                                                >
                                                    <Entypo name="circle-with-cross" size={24} color="red" />
                                                </TouchableOpacity>
                                         </View>}
                                    </View>
                                )
                            }}
                        />:
                        <FlatList 
                          showsVerticalScrollIndicator={false}
                          data={this.state.medicinesGiven}
                          keyExtractor={(item,index)=>index.toString()}
                          renderItem ={({item,index})=>{
                               return(
                                   <View style={{
                                       paddingBottom: 10,
                                       flex: 1,
                                       borderBottomWidth: 0.5,
                                       borderColor: '#D1D2DE',
                                       backgroundColor: '#FFFFFF',
                                       flexDirection: "row",
                                       marginTop: 10
                                   }}>
                                       <View style={{ flex: 0.1, alignItems: "center", justifyContent: "center" }}>
                                           <Text style={[styles.text]}>{index + 1} . </Text>
                                       </View>
                                       <View style={{ flex: 0.7 }}>
                                           <View style={{ flexDirection: "row" }}>
                                               <View>
                                                   <Text style={[styles.text, { color: "#000", }]}>{item.medicinename.name}</Text>
                                               </View>
                                               <View style={{ marginLeft: 10 }}>
                                                   <Text style={[styles.text, { color: "#000", }]}>({item.medicinename.type})</Text>
                                               </View>
                                           </View>
                                           {/* {(item.medicinename.type === "Tablet" || item.medicinename.type === "Capsules") && <View style={{ flexDirection: "row" }}>
                                                             <View>
                                                                 <Text style={[styles.text]}> {item.morning_count} - {item.afternoon_count} -{item.night_count} </Text>
                                                             </View>
                                                             <View>
                                                                 <Text style={[styles.text]}>( {item.after_food ? "AF" : "BF"} )</Text>
                                                             </View>
                                                         </View>} */}
                                           <View style={{ marginTop: 10 }}>
                                               <Text style={[styles.text]}>{item.command}</Text>
                                           </View>

                                       </View>
                                       <View style={{ flex: 0.2, alignItems: "center", justifyContent: "space-around" }}>
                                           {/* <View>
                                                             <Text style={[styles.text]}> {item.days} days</Text>
                                                         </View> */}
                                           <View>
                                               <Text style={[styles.text]}>count : {item.total_qty} </Text>
                                           </View>
                                       </View>
                                   </View>
                               )
                          }}
                        />
                    
                    }

                    </View>
                    <View style={{flex:0.1,}}>
                        <View style={{flex:0.5}}>

                        </View>
                        <View style={{alignSelf:'flex-end',flex:0.5,alignItems:"flex-end",justifyContent:"center",marginRight:10}}>
                            <View>
                                <Text style={styles.text}>Dr.{this.state?.item?.doctordetails?.name}</Text>
                           
                            </View>
                            <View>
                                    <Text style={styles.text}>{this.state?.item?.doctordetails?.specialization}</Text>
                            </View>
                            <View>
                                    <Text style={styles.text}>{this.state?.item?.doctordetails?.mobile}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ flex: 0.07, backgroundColor:themeColor,flexDirection:'row'}}>
                        <TouchableOpacity style={{ flex: 0.5, flexDirection: "row",alignItems: 'center', justifyContent: "center"}}
                         onPress ={()=>{
                             if (Platform.OS == "android") {
                                 Linking.openURL(`tel:${this.state.appDetails?.mobile}`)
                             } else {

                                 Linking.canOpenURL(`telprompt:${this.state.appDetails?.mobile}`)
                             }
                         }}
                        >
                            <View style={{alignItems:'center',justifyContent:"center"}}>
                                <Feather name="phone" size={height*0.035} color="#fff" />
                            </View>
                            <View style={{alignItems:'center',justifyContent:"center",marginLeft:5}}>
                                    <Text style={[styles.text, { color: "#ffff" }]}>{this.state.item?.clinicname?.mobile}</Text>
                            </View>
                        </TouchableOpacity >
                        <View style={{ flex: 0.5, flexDirection: "row"}}>
                            <View style={{ alignItems: 'center', justifyContent: "center" }}>
                                <Feather name="mail" size={height*0.035} color="#fff" />
                            </View>
                            <View style={{ alignItems: 'center', justifyContent: "center", marginLeft: 5 }}>
                                    <Text style={[styles.text, { color: "#ffff" }]}>{this.state?.item?.clinicname?.email}</Text>
                            </View>
                        </View>
                    </View>
                
                 </View>
                </GestureRecognizer>
                 {/* {this.props.user.profile.occupation=="Doctor"&&<View style={{position:"absolute",width,justifyContent:"center",bottom:70,left:20}}>
                     <TouchableOpacity
                        style={{ backgroundColor: this.state.valid ? "green" :"red",height:height*0.05,width:width*0.4,alignItems:'center',justifyContent:'center',borderRadius:5}}
                        onPress={() => {
                            if (!this.state.valid) {
                                this.setState({ load: false })
                                return this.showSimpleMessage("Prescription is already invalid genrate another prescription", "#dd7030",)
                            }
                            this.setState({showModal2:true})
                        //  this.validate()
                        }}
                     >{
                         this.state.load?<ActivityIndicator  color ={"#fff"} size ="large"/>:
                                <Text style={[styles.text, { color: "#fff" }]}>{this.state.valid ? "Make Invalid" : "Invalid"}</Text>

                     }
                     </TouchableOpacity>
               
                 </View>} */}
                <Modal
                    deviceHeight={deviceHeight}
                    animationIn="slideInUp"
                    animationOut="slideOutDown"
                    isVisible={this.state.showModal2}
                    onBackdropPress={() => { this.setState({ showModal2: false }) }}
                >
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <View style={{ height: height * 0.3, width: width * 0.9, backgroundColor: "#fff", borderRadius: 20, alignItems: "center", justifyContent: "space-around" }}>
                            <View>
                                <Text style={[styles.text, { fontWeight: "bold", color: themeColor, fontSize: 20 ,textAlign:"center"}]}>Are you sure do you want to Make Invalid?</Text>
                            </View>
                            <View style={{ flexDirection: "row", alignItems: 'center', justifyContent: "space-around", width, }}>
                                <TouchableOpacity style={{ backgroundColor: themeColor, height: height * 0.05, width: width * 0.2, alignItems: "center", justifyContent: 'center', borderRadius: 10 }}
                                    onPress={() => { this.validate() }}
                                >
                                    <Text style={[styles.text, { color: "#fff" }]}>Yes</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ backgroundColor: themeColor, height: height * 0.05, width: width * 0.2, alignItems: "center", justifyContent: "center", borderRadius: 10 }}
                                    onPress={() => { this.setState({ showModal2: false }) }}
                                >
                                    <Text style={[styles.text, { color: "#fff" }]}>No</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
                {
                    this.lottieModal()
                }
            
                    <Modal
                    deviceHeight={deviceHeight}
                    isVisible={this.state.paymentLoading}
                  >
                   <View style={{flex:1,alignItems:"center",justifyContent:"center"}}>
                    <ActivityIndicator  color={"#fff"} size="large"/>
                   </View>
                  </Modal>
            </SafeAreaView>

        </>
    );
  }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column"
    },
    text: {
        fontFamily,
        fontSize:height*0.02
    },
    topSafeArea: {
        flex: 0,
        backgroundColor: "#5081BC"
    },
    bottomSafeArea: {
        flex: 1,
        backgroundColor: "#fff"
    },
    elevation: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0,
        shadowRadius: 4.65,
        elevation: 6,
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
        user: state.selectedUser,
        clinic: state.selectedClinic,
        ownedClinics: state.selectedOwnedClinics,
        workingClinics: state.selectedWorkingClinics,
    }
}
export default connect(mapStateToProps, { selectTheme, selectClinic, selectWorkingClinics, selectOwnedClinics, setNoticationRecieved })(PrescriptionView)