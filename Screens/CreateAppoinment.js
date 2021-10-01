import React, { Component } from 'react';
import { View, Text, Dimensions, TouchableOpacity, StyleSheet, TextInput, FlatList, Image, SafeAreaView, StatusBar,ActivityIndicator ,ScrollView} from 'react-native';
import { Ionicons, Entypo, AntDesign ,MaterialIcons,FontAwesome} from '@expo/vector-icons';
import { connect } from 'react-redux';
import { selectTheme } from '../actions';
import settings from '../AppSettings';
import medicine from '../components/Medicine';
import Medicine from '../components/Medicine';
import HttpsClient from '../api/HttpsClient';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
const { height, width } = Dimensions.get("window");
const fontFamily = settings.fontFamily;
const themeColor = settings.themeColor;
const inputColor = settings.TextInput
import axios from 'axios';
import moment from 'moment';
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";
const url = settings.url;

class CreateAppoinment extends Component {
    constructor(props) {
        super(props);
        this.state = {
         showAppoinmentDatePicker:false,
         showAppoinmentTimePicker:false,
         reason:"",
         patientNo:"",
         profiles:[],
         patientname:"",
         doctors:[],
         appoinmentFixDate:null,
         appoinmentFixTime:null,
         diagnosisCenter:this.props?.route?.params?.diagnosisCenter||null
        };
    }
    getDoctors = async () => {
        let api = `${url}/api/prescription/clinicDoctors/?clinic=${this.props?.clinic?.clinicpk || this.props.user.profile.recopinistclinics[0].clinicpk}`
        const data = await HttpsClient.get(api)
        console.log(api, "jjjjj")
        if (data.type == "success") {
            let doctors = []
            data.data.forEach((i) => {
                let sendObject = {
                    label: i.doctor.first_name,
                    value: i.doctor.first_name,
                    pk: i.doctor.id,
                    clinicShits: i.clinicShits
                }
                doctors.push(sendObject)
            })
            this.setState({ doctors, selectedDoctor: doctors[0] })
        }
    }
   componentDidMount(){

     if(this.props.user.profile.occupation != "Doctor"){
          this.getDoctors()
     }
   }
  handleConfirm4 = (date) => {
        this.setState({ appoinmentFixDate: moment(date).format('YYYY-MM-DD'),})
        this.hideDatePicker4();
    
    };
       handleConfirm5 = (date) => {
        this.setState({ appoinmentFixTime:  moment(date).format('hh:mm a'),})
        this.hideDatePicker5();
    };
    hideDatePicker4 =()=>{
        this.setState({showAppoinmentDatePicker:false,showAppoinmentModal:true})
    }
     hideDatePicker5 =()=>{
        this.setState({showAppoinmentTimePicker:false,showAppoinmentModal:true})
    }
    searchUser = async (mobileNo) => {
        this.setState({ userfound: false })
        let api = `${url}/api/profile/userss/?search=${mobileNo}&role=Customer`
        console.log(api, 'ppppppp')
        this.setState({ patientNo: mobileNo })
        if (mobileNo.length > 9) {
           let data =await HttpsClient.get(api)
           if(data.type =="success"){
                   if(data.data.length>0){
                             let profiles =[]
                    let pushObj = {
                        label:data.data[0].name,
                        value:data.data[0].user.id,
                        mobile:data.data[0].user.username
                    }
                    let pushObj2  ={
                        label:"Add New User",
                        value:"Add New User",
                        mobile:data.data[0].user.username   
                    }
                    profiles.push(pushObj)

                    data.data[0].childUsers.forEach((item)=>{
                        let pushObj = {
                            label:item.name,
                            value:item.childpk,
                            mobile:item.mobile
                        }
                        profiles.push(pushObj)
                    })
                    profiles.push(pushObj2)
                   this.setState({profiles,userfound:true})
                   this.setState({ patientname: profiles[0].label, user: profiles[0]})
                   }else{
                            this.setState({profiles:[],userfound:false,patientname:"",user:null})
                   }
               
               
           }else{
               this.setState({profiles:[],userfound:false,patientname:"",user:null})
           }
        }
    }
        requestAppointment = async () => {
        this.setState({creating:true})
            if (this.state.patientname == "") {
            this.setState({ creating: false })
            return this.showSimpleMessage("please Enter patient name", "#dd7030",)
   
        }
        if (this.state.appoinmentFixDate == null) {
            this.setState({ creating: false })
            return this.showSimpleMessage("please select date", "#dd7030",)
   
        }
        if (this.state.appoinmentFixTime == null) {
            this.setState({ creating: false })
            return this.showSimpleMessage("please select time", "#dd7030",)
        }
        let api = `${url}/api/prescription/addAppointment/`
        let sendData;
      
        if(this.state.userfound){
            sendData = {
                clinic: this.props?.clinic?.clinicpk || this.props.user.profile.recopinistclinics[0].clinicpk,
                requesteduser: this.state?.user?.value,
                requesteddate: this.state.appoinmentFixDate,
                requestedtime: this.state.appoinmentFixTime,
                reason: this.state.reason,  
            }

        }else{
            sendData = {
                clinic: this.props?.clinic?.clinicpk || this.props.user.profile.recopinistclinics[0].clinicpk,
                requesteduser: this.state.patientNo,
                requesteddate: this.state.appoinmentFixDate,
                requestedtime: this.state.appoinmentFixTime,
                reason: this.state.reason,
                clinicCreation:true,
                first_name:this.state.patientname
            }
        }
        if(!this.state.diagnosisCenter){
              if(this.props.user.profile.occupation=="Doctor"){
                sendData.doctor=this.props.user.id
              }else{
                    sendData.doctor=this.state.selectedDoctor.pk
              }
    
        }
  
        let post = await HttpsClient.post(api, sendData)
        console.log(post, "klkk")
        if (post.type == "success") {
            // this.setState({ patientNo: "", reason: "", patientname:""})
            // this.setState({ creating: false, showAppoinmentModal: false, AppointmentsPending:[],offset3:0,next:true},()=>{
            //     this.getAppointmentsPending()
            // })
            this.props.navigation.goBack()
            this.showSimpleMessage("requested SuccessFully", "#00A300", "success")
        } else {
            this.setState({ creating: false, showAppoinmentModal: false})
            this.showSimpleMessage(`${post?.data?.error||"Oops! Something's wrong! "}`, "#B22222", "danger")
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
    render() {
        return (
            <>
                <SafeAreaView style={styles.topSafeArea} />
                <SafeAreaView style={styles.bottomSafeArea}>
                <StatusBar backgroundColor={themeColor} barStyle={"default"} />
                  <View style={{ height: height * 0.1, backgroundColor: themeColor,flexDirection: 'row', alignItems: "center" }}>
                        <TouchableOpacity style={{ flex: 0.2, alignItems: "center", justifyContent: 'center' }}
                            onPress={() => { this.props.navigation.goBack() }}
                        >
                            <Ionicons name="chevron-back-circle" size={30} color="#fff" />
                        </TouchableOpacity>
                        <View style={{ flex: 0.6,alignItems:"center",justifyContent:"center" }}>
                            <Text style={[styles.text, { color: "#fff" ,fontSize: height*0.025,fontWeight:'bold'}]}>Create Appoinment</Text>
                        </View>
                        <View style={{flex:0.2}}>

                        </View>
                    </View>
                    <View style={{ flex: 1, }}>
             
                        <ScrollView 
                         showsVerticalScrollIndicator ={false}
                        > 
                 
                        <View style={{marginHorizontal:20,marginVertical:10}}>
                                <Text style={[styles.text, { fontWeight: "bold", fontSize: height*0.02 }]}>Patient Contact No</Text>
                                <View style={{marginTop:10}}>
                                    <TextInput
                                        maxLength={10}
                                        keyboardType={"numeric"}
                                        selectionColor={themeColor}
                                        value={this.state.patientNo}
                                        style={{ width: width * 0.8, height: height * 0.05, backgroundColor:inputColor, borderRadius: 10, paddingLeft: 5, textAlignVertical: "top", paddingTop: 5 }}
                                        onChangeText={(patientNo) => { this.searchUser(patientNo) }}

                                    />
                                </View>
                              
                        </View>
                            {this.state?.profiles?.length > 0 && <View style={{
                                marginHorizontal: 20, marginVertical: 10, ...(Platform.OS !== 'android' && {
                                    zIndex: 20
                                }), }}>
                            <Text style={[styles.text, { fontWeight: "bold", fontSize: height*0.02 }]}>Select Profile</Text>
                                <View style={{
                                
                                    marginTop:10
                                }}>
                                <DropDownPicker
                                     defaultValue={this.state?.user?.value}
                                    items={this.state.profiles}
                                    placeholder={"select Profile"}
                                    containerStyle={{ height: 40 }}
                                    style={{ backgroundColor: '#fafafa' }}
                                    itemStyle={{
                                        justifyContent: 'flex-start'
                                    }}
                                    dropDownStyle={{ backgroundColor: '#fafafa' }}
                                    onChangeItem={(item) =>{
                                        if(item.value=="Add New User"){
                                            this.setState({showAppoinmentModal:false,addNewUser:true})
                                            return this.props.navigation.navigate("AddAccount",{parent:this.state.profiles[0]})
                                        }
                                       this.setState({user:item,patientname:item.label})
                                    } }
                                />
                            </View>

                        </View>}
                            <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
                                <Text style={[styles.text, { fontWeight: "bold", fontSize: height*0.02 }]}>Patient Name</Text>
                                <View style={{ marginTop: 10 }}>
                                    <TextInput
                                      
                                        selectionColor={themeColor}
                                        value={this.state.patientname}
                                        style={{ width: width * 0.8, height: height * 0.05, backgroundColor:inputColor, borderRadius: 10, paddingLeft: 5, textAlignVertical: "top", paddingTop: 5 }}
                                        onChangeText={(patientname) => { this.setState({ patientname }) }}

                                    />
                                </View>

                            </View>
                            {this.props.user.profile.occupation != "Doctor" && !this.state.diagnosisCenter && <View style={{
                                marginHorizontal: 20, marginVertical: 10, ...(Platform.OS !== 'android' && {
                                    zIndex: 10
                                }) }}>
                            <Text style={[styles.text, { fontWeight: "bold", fontSize: height*0.02 }]}>Select Doctor</Text>
                            <View style={{ marginTop: 10 }}>
                                <DropDownPicker

                                    items={this.state.doctors}
                                    defaultValue={this.state.doctors[0]?.value}
                                    containerStyle={{ height: 40 }}
                                    style={{ backgroundColor: '#fafafa' }}
                                    itemStyle={{
                                        justifyContent: 'flex-start'
                                    }}
                                    dropDownStyle={{ backgroundColor: '#fafafa' }}
                                    onChangeItem={item => this.setState({
                                        selectedDoctor: item
                                    })}
                                />
                            </View>

                        </View>}
                        <View style={{ marginLeft: 20, marginTop: 20 }}>
                            <View style={{ alignItems: "center", justifyContent: "center" }}>
                                <Text style={[styles.text, { fontWeight: "bold", fontSize: height*0.02 }]}>Select Date</Text>
                            </View>

                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                                <TouchableOpacity style={{ marginTop: 10 }}
                                    onPress={() => {this.setState({showAppoinmentDatePicker:true})}}
                                >
                                    <FontAwesome name="calendar" size={24} color="black" />
                                </TouchableOpacity>
                                <View style={{ alignItems: 'center', justifyContent: "center", marginLeft: 20, marginTop: 5 }}>
                                    <Text>{this.state.appoinmentFixDate}</Text>
                                </View>

                            </View>


                        </View>
                        <View style={{ marginLeft: 20, marginTop: 20 }}>
                            <View style={{ alignItems: "center", justifyContent: 'center' }}>
                                <Text style={[styles.text, { fontWeight: "bold", fontSize: height*0.02 }]}>Select Time</Text>

                            </View>
                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                                <TouchableOpacity style={{ marginTop: 10 }}
                                    onPress={() => { this.setState({showAppoinmentTimePicker:true})}}
                                >
                                    <FontAwesome name="calendar" size={24} color="black" />
                                </TouchableOpacity>
                                <View style={{ alignItems: 'center', justifyContent: "center", marginLeft: 20, marginTop: 5 }}>
                                    <Text>{this.state.appoinmentFixTime}</Text>
                                </View>

                            </View>


                        </View>
                            <View style={{ margin: 20 }}>
                                <View style={{}}>
                                    <Text style={[styles.text, { fontWeight: "bold",fontSize:height*0.02 }]}>Reason :</Text>

                                </View>
                                <View style={{ marginTop: 10 }}>
                                    <TextInput
                                        selectionColor={themeColor}
                                        value={this.state.reason}
                                        style={{ width: width * 0.8, height: height * 0.1, backgroundColor:inputColor,borderRadius: 10, paddingLeft: 5, textAlignVertical: "top", paddingTop: 5 }}
                                        onChangeText={(reason) => { this.setState({ reason }) }}

                                    />
                                </View>

                            </View>
                            <View style={{margin:20,alignItems:'center',justifyContent:'center'}}>
                               <TouchableOpacity 
                                 style={{backgroundColor:themeColor,height:height*0.05,width:width*0.4,alignItems:'center',justifyContent:'center',borderRadius:10}}
                                 onPress ={()=>{this.requestAppointment()}}
                               >
                                   {!this.state.creating?<Text style={[styles.text,{color:"#fff",fontSize:height*0.016}]}>Create Appoinment</Text>:
                                   <ActivityIndicator  color ={"#fff"} size ={"small"}/>
                                   }
                               </TouchableOpacity>
                            </View>
                        </ScrollView>
                 
                    
                </View>
                     
                   
                </SafeAreaView>
                  <DateTimePickerModal
                            
                            isVisible={this.state.showAppoinmentDatePicker}
                            mode="date"
                            onConfirm={this.handleConfirm4}
                            onCancel={this.hideDatePicker4}
                        />
                        <DateTimePickerModal
                        
                            isVisible={this.state.showAppoinmentTimePicker}
                            mode="time"
                            onConfirm={this.handleConfirm5}
                            onCancel={this.hideDatePicker5}
                        />    
            </>
        );
    }
}
const styles = StyleSheet.create({
    text: {
        fontFamily
    },
    card: {
        backgroundColor: "#fff",
        elevation: 6,
        margin: 20,
        height: height * 0.3
    },
        topSafeArea: {
        flex: 0,
        backgroundColor: themeColor
    },
    bottomSafeArea: {
        flex: 1,
        backgroundColor: "#fff"
    },

})
const mapStateToProps = (state) => {

    return {
        theme: state.selectedTheme,
        user:state.selectedUser,
        clinic: state.selectedClinic
    }
}
export default connect(mapStateToProps, { selectTheme })(CreateAppoinment);