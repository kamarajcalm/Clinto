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
    ScrollView,
    TextInput
} from 'react-native';
import { Feather } from '@expo/vector-icons';
const width = Dimensions.get("screen").width
const height = Dimensions.get("screen").height
const screenHeight = Dimensions.get("screen").height

import { connect } from 'react-redux';
import { selectTheme, selectClinic, selectWorkingClinics, selectOwnedClinics ,setNoticationRecieved} from '../actions';
import settings from '../AppSettings'
import moment from 'moment';
const url = settings.url
const themeColor = settings.themeColor
const fontFamily = settings.fontFamily
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";
import HttpsClient from '../api/HttpsClient';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import { NavigationContainer, CommonActions } from '@react-navigation/native';
import Modal from 'react-native-modal';
import LottieView from 'lottie-react-native';
// import Image from 'react-native-scalable-image';
class PrescriptionView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            item: this.props?.route?.params?.item || null,
            valid: this.props.route?.params?.item?.active,
            load: false,
            pk: this.props?.route?.params?.pk || null,
            showModal2: false,
            selected: "Prescribed",
            lottieModal: false,
            prescribed: [],
            medicinesGiven: [],
            drugModal:false,
            drugs:[]
        };
    }
    getDetails = async () => {
        let api = `${url}/api/prescription/prescriptions/${this.state.pk}/`
        const data = await HttpsClient.get(api)
        console.log(api)
        if (data.type == "success") {
            this.setState({ item: data.data },()=>{
                this.validateAnimations()
                this.filterMedicines()
                this.filterDrugs()
            })
        }
    }
    IssuePriscription = async () => {
        let api = `${url}/api/prescription/issuedPrescription/`
        let sendData = {
            prescription: this.state.item.id,
            clinic: this.props.medical.clinicpk,
        }
        if(this.state.drugs.length>0){
             let drugs = []
            this.state.drugs.forEach((item)=>{
                 let pushObj ={
                     id: item.id,
                     name: item.medicinename.name,
                     qty:item.qty,
                     total_qty: item.total_qty,
                     type: item.medicinename.type
                 }
                drugs.push(pushObj)
            })
            sendData.drugs = drugs
        }
        let post = await HttpsClient.post(api, sendData)
        console.log(post, "dd")
        if (post.type == "success") {
            this.setState({issuing:false,drugModal:false})
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
        else{
            this.setState({ issuing: false, })
            return (this.showSimpleMessage("Try again","red","danger"))
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
        const prescribed = this.state.item.medicines.filter((item) => !item.is_given)
        const medicinesGiven = this.state.item.medicines.filter((item) => item.is_given)
        this.setState({ prescribed, medicinesGiven })
    }
    filterDrugs =()=>{
        const drugs = this.state.item.medicines.filter((item) => item.is_drug)
        this.setState({ drugs})
    }
    componentDidMount() {
       
        if(this.state.pk == null){
            this.validateAnimations()
            this.filterMedicines()
            this.filterDrugs()
        }
     
        if (this.state.pk) {
  
            this.getDetails()
        
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
                     { item.command&&  <View style={{ marginTop: 10 }}>
                            <Text style={[styles.text, { fontWeight: "bold" }]}>Comments:</Text>
                            <View>
                                <Text style={[styles.text, { marginLeft: 10 }]}>{item.command}</Text>
                            </View>
                        </View>}
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
                this.props.setNoticationRecieved(null)
                this.props.navigation.goBack()
                break;
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
    renderHeader = () => {
        return (
            <View>
                <View style={{ marginHorizontal: 20, flexDirection: "row", marginTop: 10 }}>
                    <View style={{ alignItems: "center", justifyContent: "center" }}>
                        <Text style={[styles.text, { color: "#000", }]}>Reason : </Text>
                    </View>
                    <View style={{ alignItems: "center", justifyContent: "center" }}>
                        <Text style={[styles.text, {}]}>{this.state?.item?.ongoing_treatment}</Text>
                    </View>
                </View>
                <View style={{ marginHorizontal: 20, flexDirection: "row", marginTop: 10 }}>
                    <View style={{ alignItems: "center", justifyContent: "center" }}>
                        <Text style={[styles.text, { color: "#000", }]}>Diagnosis : </Text>
                    </View>
                    <View style={{ alignItems: "center", justifyContent: "center" }}>
                        <Text style={[styles.text, {}]}>{this.state.item?.diseaseTitle}</Text>
                    </View>
                </View>

                {/* <View style={{ marginHorizontal: 20, flexDirection: "row", marginTop: 10, alignItems: "center", justifyContent: "space-around" }}>
                    <TouchableOpacity
                        onPress={() => { this.setState({ selected: "Prescribed" }) }}
                        style={{ height: height * 0.04, width: width * 0.4, backgroundColor: this.state.selected == "Prescribed" ? themeColor : "gray", alignItems: "center", justifyContent: "center", borderRadius: 5 }}
                    >
                        <Text style={[styles.text, { color: "#fff" }]}>Prescribed</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => { this.setState({ selected: "Medicines Given" }) }}
                        style={{ height: height * 0.04, width: width * 0.4, backgroundColor: this.state.selected == "Medicines Given" ? themeColor : "gray", alignItems: "center", justifyContent: "center", borderRadius: 5 }}
                    >
                        <Text style={[styles.text, { color: "#fff" }]}>Medicines Given</Text>
                    </TouchableOpacity>
                </View> */}
            </View>
        )
    }
    changeQty =(qty,index,max)=>{
        let duplicate = this.state.drugs
        let qtyy = Number(qty)
        if (qtyy<max){
         
            duplicate[index].qty = qtyy.toString()
        }
        else{
            duplicate[index].qty = max.toString()
        }
     
        this.setState({drugs:duplicate})
      
    }
    drugModal =()=>{
        return  (
            <Modal
               deviceHeight={screenHeight}
               statusBarTranslucent ={true}
              isVisible ={this.state.drugModal}
              onBackdropPress={() => { this.setState({ drugModal:false})}}
            >
                <View style={{ }}>
                 

                 
                    <ScrollView style={{ height: height * 0.4, backgroundColor: "#eee", borderRadius: 10, }}>
                      
                               <View style={{marginVertical:10,alignItems:"center",justifyContent:'center'}}>
                                   <Text style={[styles.text,{color:"#000",fontSize:18,textDecorationLine:"underline"}]}>DRUGS</Text>
                               </View>
                                           {/* HEADERS */}
                               <View style={{flexDirection:"row"}}>
                                     <View style={{flex:0.4,alignItems:"center",justifyContent:"center"}}>
                                        <Text style={[styles.text,{color:'#000',fontSize:18}]}>Medicine</Text>
                                     </View>
                                <View style={{ flex: 0.2, alignItems: "center", justifyContent: "center"}}>
                                        <Text style={[styles.text, { color: '#000', fontSize: 18 }]}>Type</Text>
                                      </View>
                                <View style={{ flex: 0.2, alignItems: "center", justifyContent: "center"}}>
                                           <Text style={[styles.text, { color: '#000', fontSize: 18 }]}>Max</Text>
                                     </View>
                                <View style={{ flex: 0.2, alignItems: "center", justifyContent: "center"}}>
                                       <Text style={[styles.text, { color: '#000', fontSize: 18 }]}>Qty</Text>
                                     </View>
                               </View>
                               {
                                   this.state.drugs.map((item,index)=>{
                                       return(
                                           <View style={{ flexDirection: "row",marginTop:10 }}
                                        
                                           key={index}
                                           >
                                               <View style={{ flex: 0.4, alignItems: "center", justifyContent: "center" }}>
                                                   <Text style={[styles.text, { color: '#000', fontSize: 18 ,fontWeight:"bold"}]}>{item.medicinename.name}</Text>
                                               </View>
                                               <View style={{ flex: 0.2, alignItems: "center", justifyContent: "center" }}>
                                                   <Text style={[styles.text, { color: '#000', fontSize: 18 }]}>{item.medicinename.type}</Text>
                                               </View>
                                               <View style={{ flex: 0.2, alignItems: "center", justifyContent: "center" }}>
                                                   <TextInput 
                                                      style={{height:height*0.05,width:"70%",backgroundColor:"#fff",borderRadius:5,color:"#000",alignItems:"center",justifyContent:"center"}}
                                                      editable ={false}
                                                      selectionColor={themeColor}
                                                      value={item.total_qty.toString()}
                                                   />
                                               </View>
                                               <View style={{ flex: 0.2, alignItems: "center", justifyContent: "center" }}>
                                                   <TextInput
                                                       keyboardType={"numeric"}
                                                        value={item?.qty}
                                                       style={{ height: height * 0.05, width: "70%", backgroundColor: "#fff", borderRadius: 5}}
                                                       onChangeText={(qty) => { this.changeQty(qty, index,item.total_qty)}}
                                                       selectionColor={themeColor}
                                                   />
                                               </View>
                                           </View>
                                       )
                                   })
                               }
                            <View style={{marginVertical:20,alignItems:"center"}}>
                                 <TouchableOpacity 
                                   onPress={()=>{
                                       this.setState({issuing:true},()=>{
                                           this.IssuePriscription()
                                       })
                                   }}
                                  style={{height:height*0.05,width:width*0.4,alignItems:"center",justifyContent:"center",borderRadius:10,backgroundColor:themeColor}}
                                 >
                                    {!this.state.issuing?<Text style={[styles.text,{color:"#fff"}]}>Issue</Text>:
                                      <ActivityIndicator 
                                        size={"large"}
                                        color={"#fff"}
                                      />
                                    
                                    }
                                 </TouchableOpacity>
                            </View>
                     </ScrollView>
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
                    <View style={{ height: height * 0.1, backgroundColor: themeColor, flexDirection: "row" }}>
                        <View style={{ flex: 0.7 }}>
                            <View style={{ flex: 0.5, justifyContent: "center", marginLeft: 20 }}>
                                <Text style={[styles.text, { color: "#ffff", fontWeight: 'bold', fontSize: 20 }]}>{this.state?.item?.clinicname?.name?.toUpperCase()}</Text>

                            </View>
                            <View style={{ flex: 0.5, marginLeft: 20 }}>
                                <Text style={[styles.text, { color: "#fff" }]}>{this.state?.item?.clinicname?.address}</Text>
                                <View style={{}}>
                                    <Text style={[styles.text, { color: "#fff" }]}>{this.state?.item?.clinicname?.city}-{this.state?.item?.clinicname?.pincode}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{ flex: 0.3, alignItems: 'center', justifyContent: 'center' }}>
                            <Image
                                style={{ height: '80%', width: '80%', resizeMode: "contain" }}
                                source={{ uri: "https://i.pinimg.com/originals/8d/a6/79/8da6793d7e16e36123db17c9529a3c40.png" }}
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


                        <View style={{ flex: 1 }}>
                            <View style={{ flex: 0.15, borderColor: "#eee", borderBottomWidth: 0.5 }}>
                                <View style={{ marginHorizontal: 20, flexDirection: "row", alignItems: 'center', justifyContent: 'space-around', marginVertical: 15 }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <View>
                                            <Text style={[styles.text]}>Name : </Text>
                                        </View>
                                        <View>
                                            <Text style={[styles.text, { color: "#000", }]}>{this.state?.item?.username.name}</Text>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <View>
                                            <Text style={[styles.text]}>Age : </Text>
                                        </View>
                                        <View>
                                            <Text style={[styles.text, { color: "#000", }]}>{this.state?.item?.username.age}</Text>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <View>
                                            <Text style={[styles.text]}>Sex : </Text>
                                        </View>
                                        <View>
                                            <Text style={[styles.text, { color: "#000", }]}>{this?.state?.item?.sex}</Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={{ marginHorizontal: 20, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                    <View>
                                        <Text style={[styles.text, { textAlign: "right" }]}>{moment(this.state?.item?.created).format('DD/MM/YYYY')}</Text>
                                    </View>
                                    <View style={{}}>
                                        <Text style={[styles.text]}>Prescription No : {this.state?.item?.id}</Text>

                                    </View>
                                </View>
                            </View>

                            <View style={{ flex: 0.2 }}>
                                {
                                    this.renderHeader()
                                }
                            </View>
                            <View style={{ flex: 0.48, }}>

                                {this.state.selected == "Prescribed" ? 
                                
                                <FlatList
                                     showsVerticalScrollIndicator ={false}
                                    contentContainerStyle={{paddingBottom:50}}
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
                                                flexDirection: "row",
                                                marginTop: 10
                                            }}>
                                                <View style={{ flex: 0.1, alignItems: "center", justifyContent: "center" }}>
                                                    <Text style={[styles.text]}>{index + 1} . </Text>
                                                </View>
                                                <View style={{ flex: 0.7 }}>
                                                    <View style={{ flexDirection: "row" }}>
                                                        <View>
                                                            <Text style={[styles.text, { color: "#000", fontWeight:"bold"}]}>{item.medicinename.name}</Text>
                                                        </View>
                                                        <View style={{ marginLeft: 10 }}>
                                                            <Text style={[styles.text, { color: "#000", }]}>({item.medicinename.type})</Text>
                                                        </View>
                                                    </View>
                                                    {(item.medicinename.type === "Tablet" || item.medicinename.type === "Capsules") && <View style={{ flexDirection: "row" }}>
                                                        <View>
                                                            <Text style={[styles.text]}> {item.morning_count} - {item.afternoon_count} -{item.night_count} </Text>
                                                        </View>
                                                        <View>
                                                            <Text style={[styles.text]}>( {item.after_food ? "AF" : "BF"} )</Text>
                                                        </View>
                                                    </View>}
                                                    <View style={{ marginTop: 10 }}>
                                                        <Text style={[styles.text]}>{item.command}</Text>
                                                    </View>

                                                </View>
                                                <View style={{ flex: 0.2, alignItems: "center", justifyContent: "space-around" }}>
                                                    <View>
                                                        <Text style={[styles.text]}> {item.days} days</Text>
                                                    </View>
                                                    <View>
                                                        <Text style={[styles.text]}>count : {item.total_qty} </Text>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        )

                                    }}
                                /> : <FlatList
                                        showsVerticalScrollIndicator={false}
                                        contentContainerStyle={{ paddingBottom: 50 }}
                                        data={this.state.medicinesGiven}
                                        keyExtractor={(item, index) => index.toString()}
                                        renderItem={({ item, index }) => {
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
                                                            <Text style={[styles.text, { color: "#000",fontWeight:"bold" }]}>{item.medicinename.name}</Text>
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
                                            </TouchableOpacity>
                                        )


                                    }}
                                />

                                }

                            </View>
                            <View style={{ flex: 0.1, }}>
                                <View style={{ flex: 0.5 }}>

                                </View>
                                <View style={{ alignSelf: 'flex-end', flex: 0.5, alignItems: "flex-end", justifyContent: "center", marginRight: 10 }}>
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
                            <View style={{ flex: 0.07, backgroundColor: themeColor, flexDirection: 'row', alignItems: "center", justifyContent: "space-around" }}>
                                <TouchableOpacity style={{ flexDirection: "row", alignItems: 'center', justifyContent: "center" }}
                                    onPress={() => {
                                        if (Platform.OS == "android") {
                                            Linking.openURL(`tel:${this.state.appDetails?.mobile}`)
                                        } else {

                                            Linking.canOpenURL(`telprompt:${this.state.appDetails?.mobile}`)
                                        }
                                    }}
                                >
                                    <View style={{ alignItems: 'center', justifyContent: "center" }}>
                                        <Feather name="phone" size={24} color="#fff" />
                                    </View>
                                    <View style={{ alignItems: 'center', justifyContent: "center", marginLeft: 5 }}>
                                        <Text style={[styles.text, { color: "#ffff" }]}>{this.state.item?.clinicname?.mobile}</Text>
                                    </View>
                                </TouchableOpacity >
                                <View style={{ flexDirection: "row" }}>
                                    <View style={{ alignItems: 'center', justifyContent: "center" }}>
                                        <Feather name="mail" size={24} color="#fff" />
                                    </View>
                                    <View style={{ alignItems: 'center', justifyContent: "center", marginLeft: 5 }}>
                                        <Text style={[styles.text, { color: "#ffff" }]}>{this.state.item?.clinicname?.email}</Text>
                                    </View>
                                </View>
                            </View>

                        </View>
                    </GestureRecognizer>
                    {<View style={{position:"absolute",width,justifyContent:"center",bottom:70,left:20}}>
                     <TouchableOpacity
                            style={{ backgroundColor:themeColor,height:height*0.05,width:width*0.4,alignItems:'center',justifyContent:'center',borderRadius:5}}
                        onPress={() => {
                            if (!this.state.valid) {
                                this.setState({ load: false })
                                return this.showSimpleMessage("Prescription is invalid ", "#dd7030",)
                            }
                            if(this.state.drugs.length==0){
                               return this.setState({issuing:true},()=>{
                                    this.IssuePriscription()
                                })
                            
                            }
                           this.setState({drugModal:true})
                        //  this.validate()
                        }}
                     >{
                                this.state.issuing?<ActivityIndicator  color ={"#fff"} size ="large"/>:
                         <View style={{flexDirection:"row"}}>
                             <View style={{alignItems:'center',justifyContent:"center"}}>
                                 <Text style={[styles.text, { color: "#fff" }]}>Issue</Text>
                             </View>
                           
                             <View style={{alignItems:"center",justifyContent:"center",marginLeft:10}}>
                                            <View style={{ height: 10, width: 10, borderRadius: 5, backgroundColor: this.state.valid ? "green" : "red" }}>

                                  </View>
                             </View>
                         </View>
                               

                     }
                     </TouchableOpacity>
               
                 </View>}
                    {/* <View style={{ position: "absolute", width, justifyContent: "center", bottom: 130, left: 20 }}>
                      <TouchableOpacity 
                            onPress={() => { this.props.navigation.navigate("BillPrescription",{item:this.state.item})}}
                            style={{ backgroundColor: themeColor, height: height * 0.05, width: width * 0.4, alignItems: 'center', justifyContent: 'center', borderRadius: 5 }}
                      >
                            <Text style={[styles.text, { color: "#fff" }]}>Create Bill</Text>
                      </TouchableOpacity>
                  </View> */}
                    {
                        this.lottieModal()
                    }
                    {
                        this.drugModal()
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
    }
});

const mapStateToProps = (state) => {
    return {
        theme: state.selectedTheme,
        user: state.selectedUser,
        clinic: state.selectedClinic,
        ownedClinics: state.selectedOwnedClinics,
        workingClinics: state.selectedWorkingClinics,
        medical: state.selectedMedical
    }
}
export default connect(mapStateToProps, { selectTheme, selectClinic, selectWorkingClinics, selectOwnedClinics, setNoticationRecieved })(PrescriptionView)