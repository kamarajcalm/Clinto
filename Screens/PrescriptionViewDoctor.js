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
    FlatList,
    TouchableOpacity,
    Linking,
    Platform,
    StatusBar,
    ActivityIndicator,
    AsyncStorage,
    Alert
} from 'react-native';
import { Feather } from '@expo/vector-icons';
const width = Dimensions.get("screen").width
const height = Dimensions.get("screen").height
const deviceHeight = Dimensions.get("screen").height
import { connect } from 'react-redux';
import { selectTheme, selectClinic, selectWorkingClinics, selectOwnedClinics } from '../actions';
import settings from '../AppSettings'
import moment from 'moment';
const url = settings.url
const themeColor = settings.themeColor
const fontFamily = settings.fontFamily
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";
import HttpsClient from '../api/HttpsClient';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import Modal from 'react-native-modal';
import LottieView from 'lottie-react-native';
import {openComposer} from "react-native-email-link";
const screenHeight = Dimensions.get("screen").height
// import Image from 'react-native-scalable-image';
class PrescriptionViewDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            item: this.props?.route?.params?.item || null,
            valid: this.props.route?.params?.item?.active,
            load: false,
            pk: this.props?.route?.params?.pk || null,
            showModal2: false,
            selected:"Prescribed",
            lottieModal:false,
            prescribed:[],
            medicinesGiven:[]
        };
    }
    getDetails = async () => {
        let api = `${url}/api/prescription/prescriptions/${this.state.pk}/`
        const data = await HttpsClient.get(api)
        console.log(api)
        if (data.type == "success") {
            this.setState({ item: data.data })
        }
    }
    validateAnimations = async()=>{
        let swipeTut = await AsyncStorage.getItem("swipeTut")
        if (swipeTut==null){
            AsyncStorage.setItem("swipeTut","true")
            this.setState({lottieModal:true},()=>{
                this.animation.play()
            })
        }
    }
    filterMedicines =()=>{
        const prescribed = this.state.item.medicines.filter((item)=> !item.is_given)
        const medicinesGiven = this.state.item.medicines.filter((item) => item.is_given)
        this.setState({ prescribed, medicinesGiven})
    }
    componentDidMount() {
        this.validateAnimations()
        this.filterMedicines()
        if (this.state.pk) {
            this.getDetails()
        }

    }
    createCallAlert = () => {
                Alert.alert(
                "Do you want to Call?",
                ``,
                [
                    {
                    text: "No",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                    },
                    { text: "Yes", onPress: () => {
                            if (Platform.OS == "android") {
                                            Linking.openURL(`tel:${this.state.item?.clinicname.mobile}`)
                                        } else {

                                            Linking.canOpenURL(`telprompt:${this.state.item?.clinicname.mobile}`)
                                    }
                    } }
                ]
                );

  }
  createMailAlert = ()=>{
               Alert.alert(
                "Do you want to Mail?",
                ``,
                [
                    {
                    text: "No",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                    },
                    { text: "Yes", onPress: () => {
                                openComposer({
                                    to: this.state?.item?.clinicname?.email
                                })
                    } }
                ]
                );
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
        this.setState({ showModal2: false })

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
                            <Text>Qty: {1}</Text>
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

sepeartor =()=>{
    return(
        <View>
            <Text style={[styles.text,{color:"#000"}]}> , </Text>
        </View>
    )
}
     footer =()=>{
         return(
                 <View style={{marginTop:5,marginLeft:10}}>
               {this.state.item.reports.length>0&&<View style={{paddingLeft:20}}>
                      <Text style={[styles.text,{color:"#000",fontWeight:"bold",fontSize:height*0.017}]}>Suggested Lab Test : </Text>
                 </View>}
                 {
                     this.state.item.reports.map((item,index)=>{
                          return (
                              <View style={{flexDirection:"row",marginTop:10}}>
                                  <View>
                                         <Text style={[styles.text,{fontSize:height*0.017}]}>{index+1} . </Text>         
                                  </View>
                                  <View>
                                           <Text style={[styles.text,{fontSize:height*0.017}]}>{item}</Text>
                                  </View>
                              </View>
                          )
                     })
                 }
             </View>
         )
     }
    renderHeader =()=>{
        return(
          <View style={{flex:1,paddingHorizontal:30}}>
                     <View style={{flex:0.5,}}>
                        {this.state?.item?.ongoing_treatment?<View style={{flex:0.5,flexDirection:"row"}}>
                                  <View style={{alignItems:"center",justifyContent:"center"}}>
                                             <Text style={[styles.text, { color: "#000",fontSize:height*0.017 }]}>Reason : </Text>
                                  </View>
                                  <View style={{alignItems:"center",justifyContent:"center"}}>
                                             <Text style={[styles.text, {fontSize:height*0.017}]}>{this.state?.item?.ongoing_treatment}</Text>
                                  </View>
                            </View>:null}
                            <View style={{flexDirection:"row",flex:this.state?.item?.ongoing_treatment?0.5:1,}}>
                                <View>
                                           <Text style={[styles.text, { color: "#000",fontSize:height*0.017 }]}>Diagnosis : </Text>
                                </View>
                                        

                                    {
                                        this.state.item?.diseaseTitle?.map((item,index)=>{
                                            return(
                                                    <View style={{flexDirection:"row"}}>
                                                        <View>
                                                              <Text style={[styles.text, {color:"#000",fontSize:height*0.017}]}>{item}</Text>
                                                        </View>
                                                       { index < this.state.item.diseaseTitle.length-1&&<View>
                                                                <Text style={[styles.text, {color:"#000",fontSize:height*0.017}]}> , </Text>
                                                        </View>}
                                                     </View> 
                                            )
                                        })
                                    }
                                          
                    </View>
                     </View>
                     <View style={{flex:0.5,flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>
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
        )
    }

    onSwipe(gestureName, gestureState) {
        const { SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT } = swipeDirections;
        this.setState({ gestureName: gestureName });
        switch (gestureName) {
            // case SWIPE_UP:
            //     this.props.navigation.goBack()
            //     break;
            // case SWIPE_DOWN:
            //     this.props.navigation.goBack()
            //     break;
            // case SWIPE_LEFT:
            //     this.props.navigation.goBack()
            //     break;
            case SWIPE_RIGHT:
                this.props.navigation.goBack()
                break;
        }
    }

    lottieModal =()=>{
        const config = {
            velocityThreshold: 0.3,
            directionalOffsetThreshold: 80
        };
        return(
            <Modal
              statusBarTranslucent={true}
              deviceHeight={screenHeight}
              isVisible={this.state.lottieModal}
            >
               
              <View style={{height:height*0.7,alignItems:"center",justifyContent:"center"}}>
               
                    <LottieView
                        ref={animation => {
                            this.animation = animation;
                        }}
                        style={{
                         
                          
                            width:width,
                            height: height*0.4,
                         
                        }}
                        source={require('../assets/lottie/swipe-gesture-right.json')}
                    // OR find more Lottie files @ https://lottiefiles.com/featured
                    // Just click the one you like, place that file in the 'assets' folder to the left, and replace the above 'require' statement
                    />
                    <View style={{position:"relative",top:-100,}}>
                        <View>
                            <Text style={[styles.text,{color:"#fff",marginTop:-40}]}>swipe to go back</Text>
                        </View>
                        <TouchableOpacity style={{height:height*0.05,width:width*0.2,backgroundColor:"#fff",alignItems:"center",justifyContent:"center",borderRadius:5,marginLeft:20}}
                            onPress={() => { 
                                this.animation.pause();
                                this.setState({ lottieModal:false})
                            
                            }}
                        >
                            <Text style={[styles.text,{color:"#000"}]}>ok</Text>
                        </TouchableOpacity>
                    </View>
                  
              </View>
           
            </Modal>
            
        )
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
                    <StatusBar backgroundColor={themeColor} />
                   <View style={{ height: height * 0.1, backgroundColor:themeColor,flexDirection:"row"}}>
                     <View style={{flex:0.7}}>
                         <View style={{flex:0.5,justifyContent:"center",marginLeft:20}}>
                            <Text style={[styles.text,{color:"#ffff",fontWeight:'bold',fontSize:height*0.02}]} numberOfLines={1}>{this.state?.item?.clinicname?.name?.toUpperCase()}</Text>

                         </View>
                         <View style={{flex:0.5,marginLeft:20,}}>
                             <View>
                                   <Text style={[styles.text,{color:"#fff",fontSize:height*0.017}]} numberOfLines={1}>{this.state?.item?.clinicname?.address}</Text>
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


                        <View style={{ flex: 1 ,}}>
                         <View style={{ flex: 0.15,borderColor:"#eee",borderBottomWidth:0.5,}}>
                        <View style={{flex:0.5,flexDirection:"row",alignItems:"center",justifyContent:"space-around"}}>
                             <View style={{flexDirection:'row'}}>
                               <View>
                                    <Text style={[styles.text,{fontSize:height*0.016}]}>Name : </Text>
                               </View>
                                <View>
                                    <Text style={[styles.text,{color:"#000",fontSize:height*0.016}]}>{this.state?.item?.username.name}</Text>
                                </View>
                           </View>
                               <View style={{ flexDirection: 'row' }}>
                                <View>
                                    <Text style={[styles.text,{fontSize:height*0.016}]}>Age : </Text>
                                </View>
                                <View>
                                        <Text style={[styles.text, { color: "#000",fontSize:height*0.016 }]}>{this.state?.item?.age}</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <View>
                                    <Text style={[styles.text,{fontSize:height*0.016}]}>Sex : </Text>
                                </View>
                                <View>
                                    <Text style={[styles.text, { color: "#000",fontSize:height*0.016}]}>{this?.state?.item?.sex}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{flex:0.5,paddingRight:30,flexDirection:"row",justifyContent:"space-between",paddingLeft:30}}>
                            <View>
                                      <Text style={[styles.text,{fontSize:height*0.016}]}>Prescription ID : {this.state?.item?.id}</Text>
                            </View>
                           <View>
                                      <Text style={[styles.text,{textAlign:"right",fontSize:height*0.016}]}>{moment(this.state?.item?.created).format('DD/MM/YYYY')}</Text>
                           </View>
                          
                        </View>
                       
                    </View>

                            <View style={{ flex: 0.15,justifyContent:"center",}}>
                                {
                                    this.renderHeader()
                                }
                            </View>
                            <View style={{ flex: 0.56,}}>
                                
                               {this.state.selected=="Prescribed"?<FlatList
                                    ListFooterComponent={this.footer()}
                                    data={this.state.prescribed}
                                    style={{ height: "100%" }}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({ item, index }) => {
                                     

                                    
                                        return (
                                                 <TouchableOpacity style={{
                                                paddingBottom: 10,
                                                flex: 1,
                                                borderBottomWidth: 0.5,
                                                borderColor: '#D1D2DE',
                                                backgroundColor: '#FFFFFF',
                                               
                                                marginTop:10
                                            }}>
                                                <View style={{flexDirection:"row"}}>
                                                    <View style={{ flex: 0.1, alignItems: "center", justifyContent: "center" }}>
                                                        <Text style={[styles.text,{color:"#000",fontWeight:"bold",fontSize:width*0.037}]}>{index + 1} . </Text>
                                                    </View>
                                                    <View style={{ flex: 0.8 }}>

                                                        <View style={{ flexDirection: "row" }}>
                                                            <View>
                                                                <Text style={[styles.text, { color: "#000", fontWeight: "bold",fontSize:width*0.037}]}>{item.medicinename.name}</Text>
                                                            </View>
                                                            <View style={{ marginLeft: 10 }}>
                                                                <Text style={[styles.text, { color: "#000", fontWeight: "bold",fontSize:width*0.037 }]}>({item.medicinename.type})</Text>
                                                            </View>
                                                        { (item.medicinename.type === "Tablet" || item.medicinename.type === "Capsules") &&    <>
                                                                <View>
                                                                    <Text style={[styles.text,{fontSize:width*0.037}]}>*</Text>
                                                                </View>
                                                                <View>
                                                                    <Text style={[styles.text,{fontSize:width*0.037}]}> {item.days} days</Text>
                                                                </View>
                                                            </>}
                                                        </View>
                                                        {(item.medicinename.type === "Tablet" || item.medicinename.type === "Capsules") && <View style={{ flexDirection: "row" }}>
                                                            <View>
                                                                <Text style={[styles.text,{fontSize:width*0.037}]}> {item.morning_count} - {item.afternoon_count} -{item.night_count} </Text>
                                                            </View>
                                                            <View>
                                                                <Text style={[styles.text,{fontSize:width*0.037}]}>( {item.after_food ? "AF" : "BF"} )</Text>
                                                            </View>
                                                       
                                                        </View>}
                                                             <View style={{marginTop:5}}>
                                                                <Text style={[styles.text,{color:"#DEB887",fontSize:width*0.037}]}>Diagnosis : {item.diagonisname}</Text>
                                                            </View>
                                                    </View>
                                                    <View style={{ flex: 0.2, alignItems: "center", justifyContent: "space-around" }}>

                                                        <View>
                                                            <Text style={[styles.text,{fontSize:width*0.037}]}>Qty : {Math.round(item.total_qty)} </Text>
                                                        </View>
                                                    </View>
                                                </View>
                                           
                                                <View style={{flexDirection:"row"}}>
                                                    <View style={{flex: 0.1,}}>

                                                    </View>
                                                    <View style={{ marginTop: 10 ,flex: 0.9,paddingRight:10}}>
                                                        <Text style={[styles.text,{fontSize:width*0.037}]}>{item.command}</Text>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        )
                                        
                                    }}
                                />:<FlatList 
                                     data={this.state.medicinesGiven}
                                     keyExtractor={(item,index)=>index.toString()}
                                     renderItem={({item,index})=>{
                                   
                                             return (
                                                 <TouchableOpacity style={{
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
                                                                 <Text style={[styles.text, { color: "#000", fontWeight: "bold"}]}>{item.medicinename.name}</Text>
                                                             </View>
                                                             <View style={{ marginLeft: 10 }}>
                                                                 <Text style={[styles.text, { color: "#000", fontWeight: "bold"}]}>({item.medicinename.type})</Text>
                                                             </View>
                                                         </View>
                                                                 <View style={{marginTop:5}}>
                                                                <Text style={[styles.text,{color:"#DEB887"}]}>Diagnosis : {item.diagonisname}</Text>
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
                                                             <Text style={[styles.text]}>Qty : {item.total_qty} </Text>
                                                         </View>
                                                     </View>
                                                 </TouchableOpacity>
                                             )
                                         
                                      
                                     }}
                                />
                                
                                }

                            </View>
                              <View style={{flex:0.07,}}>
                        <View style={{flex:0.5}}>

                        </View>
                        <View style={{alignSelf:'flex-end',flex:0.5,alignItems:"flex-end",justifyContent:"center",marginRight:10}}>
                            <View>
                                <Text style={[styles.text,{fontSize:height*0.015}]}>Dr.{this.state?.item?.doctordetails?.name}</Text>
                           
                            </View>
                            <View>
                                    <Text style={[styles.text,{fontSize:height*0.015}]}>{this.state?.item?.doctordetails?.specialization}</Text>
                            </View>
                            <View>
                                    <Text style={[styles.text,{fontSize:height*0.015}]}>{this.state?.item?.doctordetails?.mobile}</Text>
                            </View>
                        </View>
                    </View>
                             <View style={{ flex: 0.07, backgroundColor: themeColor, flexDirection: 'row' ,}}>
                                <TouchableOpacity style={{ flexDirection: "row", alignItems: 'center', justifyContent: "center" ,flex:0.5}}
                                    onPress={() => {
                                          this.createCallAlert()
                                    }}
                                >
                                    <View style={{ alignItems: 'center', justifyContent: "center" }}>
                                        <Feather name="phone" size={height*0.02} color="#fff" />
                                    </View>
                                    <View style={{ alignItems: 'center', justifyContent: "center", marginLeft: 5 }}>
                                        <Text style={[styles.text, { color: "#ffff" ,fontSize:height*0.017}]}>{this.state.item.clinicname.mobile}</Text>
                                    </View>
                                </TouchableOpacity >
                                <TouchableOpacity style={{ flexDirection: "row",flex:0.5,alignItems:"center",justifyContent:"center" }}
                                  onPress={()=>{
                                   
                                    this.createMailAlert()
                          }}
                                >
                                    <View style={{ alignItems: 'center', justifyContent: "center" }}>
                                        <Feather name="mail" size={height*0.02} color="#fff" />
                                    </View>
                                    <View style={{ alignItems: 'center', justifyContent: "center", marginLeft: 5 }}>
                                        <Text style={[styles.text, { color: "#ffff" ,fontSize:height*0.017}]} numberOfLines={1}>Mail</Text>
                                    </View>
                                </TouchableOpacity>
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
                                    <Text style={[styles.text, { fontWeight: "bold", color: themeColor, fontSize: 20, textAlign: "center" }]}>Are you sure do you want to Make Invalid?</Text>
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
    },
    topSafeArea: {
        flex: 0,
        backgroundColor: themeColor
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
export default connect(mapStateToProps, { selectTheme, selectClinic, selectWorkingClinics, selectOwnedClinics })(PrescriptionViewDoctor)