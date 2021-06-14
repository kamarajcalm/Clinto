import React, { Component } from 'react';
import { View, Text, StatusBar, Dimensions, TouchableOpacity, StyleSheet, Linking, FlatList, Image, SafeAreaView, ToastAndroid, TextInput, ScrollView, ActivityIndicator} from 'react-native';
import settings from '../AppSettings';
import { connect } from 'react-redux';
import { selectTheme } from '../actions';
const { height, width } = Dimensions.get("window");
import { Ionicons } from '@expo/vector-icons';
const fontFamily = settings.fontFamily;
const themeColor = settings.themeColor;
const screenHeight =Dimensions.get("screen").height;
import Modal from 'react-native-modal';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import axios from 'axios';
const initialLayout = { width: Dimensions.get('window').width };
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import moment from 'moment';
import HttpsClient from '../api/HttpsClient';
import { FontAwesome, FontAwesome5, Octicons, Fontisto, EvilIcons, Feather, AntDesign} from '@expo/vector-icons';
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";
import { color } from 'react-native-reanimated';
import DropDownPicker from 'react-native-dropdown-picker';

const Date1 = new Date()
const today = moment(Date1).format("YYYY-MM-DD")
const url = settings.url
class Appointments extends Component {
    constructor(props) {
        const routes = [
            { key: 'NewAppointments', title: 'New Appointments' },
            { key: 'Completed', title: 'All Appointments'},

        ];
        super(props);
        this.state = {
            index: 0,
            routes: routes,
            modal:false,
            mode: 'time',
            date: new Date(),
            show: false,
            Appointments:[],
            selectedAppointment:null,
            selectedIndex:null,
            Appointments2:[],
            today,
            search:false,
            cancelToken:undefined,
            showAppoinmentModal:false,
            doctors:[],
            selectedDoctor:null,
            time:moment(new Date()).format('hh:mm a'),
            patientNo:"",
            patientname:"",
            next:true,
            next2:true,
            offset2:0,
            offset:0,
            isFectching:false,
            isFectching2:false,
            first:true,
        };
    }
    searchUser = async (mobileNo) => {
        this.setState({ userfound: false })
        let api = `${url}/api/profile/userss/?search=${mobileNo}&role=Customer`
        console.log(api, 'ppppppp')
        this.setState({ patientNo: mobileNo })
        if (mobileNo.length > 9) {
           let data =await HttpsClient.get(api)
           if(data.type =="success"){
               if (data.data[0].mobile == mobileNo){
                   this.setState({userfound:true})
                   this.setState({ patientname: data.data[0].name, user: data.data[0].user})
               }
           }
        }
    }
    requestAppointment = async () => {
        this.setState({creating:true})
        if (this.state.today == null) {
            this.setState({ creating: false })
            return this.showSimpleMessage("please select date", "#dd7030",)
   
        }
        if (this.state.time == null) {
            this.setState({ creating: false })
            return this.showSimpleMessage("please select time", "#dd7030",)
        }
        let api = `${url}/api/prescription/addAppointment/`
        let sendData;
        if(this.state.userfound){
            sendData = {
                clinic: this.props?.clinic?.clinicpk || this.props.user.profile.recopinistclinics[0].clinicpk,
                doctor: this.state.selectedDoctor.pk,
                requesteduser: this.state?.user?.id,
                requesteddate: this.state.today,
                requestedtime: this.state.time,
                reason: this.state.reason,
                
            }

        }else{
            sendData = {
                clinic: this.props?.clinic?.clinicpk || this.props.user.profile.recopinistclinics[0].clinicpk,
                doctor: this.state.selectedDoctor.pk,
                requesteduser: this.state.patientNo,
                requesteddate: this.state.today,
                requestedtime: this.state.time,
                reason: this.state.reason,
                clinicCreation:true,
                first_name:this.state.patientname
            }
        }
      
       
        let post = await HttpsClient.post(api, sendData)
        console.log(post, "klkk")
        if (post.type == "success") {
            this.setState({ patientNo: "", reason: "", patientname:""})
            this.setState({ creating: false, showAppoinmentModal: false, Appointments:[],offset:0,next:true},()=>{
                this.getAppointments()
            })
           
            this.showSimpleMessage("requested SuccessFully", "#00A300", "success")
        } else {
            this.setState({ creating: false, showAppoinmentModal: false})
            this.showSimpleMessage("Try again", "#B22222", "danger")
        }
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
    chatClinic = async (item) => {
   
        let api = `${url}/api/prescription/createClinicChat/?clinic=${item.clinic}&customer=${this.props.user.id}`

        let data = await HttpsClient.get(api)
        console.log(data)

        if (data.type == "success") {
            this.props.navigation.navigate('Chat', { item: data.data })
        }
    }
    getAppointments2 = async () => {
        let api = ""
        if (this.props.user.profile.occupation == "Doctor") {
            api = `${url}/api/prescription/appointments/?doctor=${this.props.user.id}&date=${this.state.today}&limit=5&offset=${this.state.offset2}`
        } else if (this.props.user.profile.occupation == "ClinicRecoptionist") {
            api = `${url}/api/prescription/appointments/?clinic=${this.props.user.profile.recopinistclinics[0].clinicpk}&date=${this.state.today}&limit=5&offset=${this.state.offset2}`
        }
        else {
            api = `${url}/api/prescription/appointments/?requesteduser=${this.props.user.id}&limit=5&offset=${this.state.offset2}`
        }
        console.log(api,"second")
        const data = await HttpsClient.get(api)
      
        if (data.type == "success") {
       

            this.setState({ Appointments2:this.state.Appointments2.concat(data.data.results),isFectching2:false})
            if (data.data.next != null) {
                this.setState({ next2: true })
            } else {
                this.setState({ next2: false })
            }
        }
    }
    getAppointments =async()=>{

        let api =""
        if (this.props.user.profile.occupation == "Doctor") {
            api = `${url}/api/prescription/appointments/?doctor=${this.props.user.id}&pending=true&accepted=true&limit=5&offset=${this.state.offset}`
        } else if (this.props.user.profile.occupation == "ClinicRecoptionist"){
            api = `${url}/api/prescription/appointments/?clinic=${this.props.user.profile.recopinistclinics[0].clinicpk}&pending=true&accepted=true&limit=5&offset=${this.state.offset}`
        }
        else{
            api = `${url}/api/prescription/appointments/?requesteduser=${this.props.user.id}&pending=true&accepted=true&limit=5&offset=${this.state.offset}`
        }
        console.log(api,"first")
        const data =await HttpsClient.get(api,"lll")
  
        if(data.type =="success"){
       

            this.setState({ Appointments:this.state.Appointments.concat(data.data.results),isFectching:false})
            if (data.data.next != null) {
                this.setState({ next: true })
            } else {
                this.setState({ next: false })
            }
        }
    }

    showDatePicker = () => {
        this.setState({ show: true })
    };

    hideDatePicker = () => {
        this.setState({ show: false })
    };


    handleConfirm = (date) => {
        this.setState({ today: moment(date).format('YYYY-MM-DD'), show: false, date: new Date(date),Appointments2:[],offset2:0,next2:true}, () => {
          this.getAppointments2()

        })
        this.hideDatePicker();
    };
    // onChange = (selectedDate) => {
    //     if (selectedDate.type == "set") {
    //         this.setState({ today: moment(new Date(selectedDate.nativeEvent.timestamp)).format('YYYY-MM-DD'), show: false, date: new Date(selectedDate.nativeEvent.timestamp) }, () => {


    //         })

    //     } else {
    //         return null
    //     }

    // }

    handleConfirm2 = (date) => {
        this.setState({ time: moment(date).format('hh:mm a'), show2: false, date: new Date(date) }, () => {


        })
        this.hideDatePicker();
    };
    // onChange2 = (selectedDate) => {
    //     if (selectedDate.type == "set") {
    //         this.setState({ time: moment(new Date(selectedDate.nativeEvent.timestamp)).format('hh:mm a'), show2: false, date: new Date(selectedDate.nativeEvent.timestamp) }, () => {


    //         })

    //     } else {
    //         return null
    //     }

    // }
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
    componentDidMount() {
        this.getDoctors()
        this.getAppointments();
        this.getAppointments2();
        this.setState({first:false})
        this._unsubscribe = this.props.navigation.addListener('focus',() => {
            if(!this.state.first){
                this.setState({ modal: false })
                this.setState({ offset2: 0, offset: 0, Appointments2: [], Appointments: [], next: true, next2: true }, () => {
                    console.log("oipopo")
                    this.getAppointments();
                    this.getAppointments2();
                })

            }
           
            

        });
    }
    componentWillUnmount(){
        this._unsubscribe();
    }
    renderFooter = () => {
        if (this.state.next) {
            return (
                <ActivityIndicator size="large" color={themeColor} />
            )
        }
        return null
    }
    renderFooter2 = () => {
        if (this.state.next2) {
            return (
                <ActivityIndicator size="large" color={themeColor} />
            )
        }
        return null
    }
    acceptAppointment =async()=>{
        let api = `${url}/api/prescription/appointments/${this.state.selectedAppointment.id}/`
        let sendData ={
            accepteddate:this.state.today,
            acceptedtime:this.state.time,
            status:"Accepted"
        }
        console.log(sendData)
      let post = await HttpsClient.patch(api,sendData)
      if(post.type =="success"){
          let duplicate = this.state.Appointments
          duplicate[this.state.selectedIndex]=post.data
          this.showSimpleMessage("Accepted SuccessFully", "#00A300","success")
          this.setState({ modal:false,Appointments:duplicate})
      }else{
          this.showSimpleMessage("Try again", "#B22222", "danger")
          this.setState({ modal: false })
      }
    }
    RejectAppointment =async()=>{
        let api = `${url}/api/prescription/appointments/${this.state.selectedAppointment.id}/`
        let sendData = { 
            status: "Declined"
        }
        console.log(sendData)
        let post = await HttpsClient.patch(api, sendData)
        if (post.type == "success") {
            let duplicate = this.state.Appointments
            duplicate.splice(this.state.selectedIndex, 1)
            this.showSimpleMessage("Rejected SuccessFully", "#dd7030",)
          
            this.setState({ modal: false, Appointments: duplicate })
        } else {
            this.showSimpleMessage("Try again", "#B22222", "danger")
            this.setState({ modal: false })
        }
    }
    completeAppointment =async()=>{
        if(this.props.user.profile.occupation=="Doctor"){
            this.props.navigation.navigate('addPriscription', { appoinment: this.state.selectedAppointment })
        }else{
            let api = `${url}/api/prescription/appointments/${this.state.selectedAppointment.id}/`
            let sendData = {
                status: "Completed"
            }
            let post = await HttpsClient.patch(api, sendData)
            if (post.type == "success") {
                let duplicate = this.state.Appointments
                duplicate.splice(this.state.selectedIndex, 1)
                this.showSimpleMessage("Completed SuccessFully", "#00A300",)

                this.setState({ modal: false, Appointments: duplicate })
            } else {
                this.showSimpleMessage("Try again", "#B22222", "danger")
                this.setState({ modal: false })
            }
        }
       
        
    }
    onChange = (selectedDate) => {
        if (selectedDate.type == "set"){
            this.setState({ today: moment(new Date(selectedDate.nativeEvent.timestamp)).format('YYYY-MM-DD'), show: false, date: new Date(selectedDate.nativeEvent.timestamp) }, () => {
                console.log(this.state.today, "jjjj")

            })

        } else {
            return null
        }

    }
    validateInformation =(item)=>{
        
        if (item?.status == "Pending" || item?.status == "Rejected") {
            return(
                <View style={{marginTop:10}}>
                    <Text style={[styles.text]}>{item.requestedtime}</Text>
                </View>
            )
    }
        if (item?.status == "Accepted") {
            return (
                <View style={{ marginTop: 10 }}>
                    <Text style={[styles.text]}>{item.acceptedtime}</Text>
                </View>
            )
        }
        if (item?.status == "Completed") {
            return (
                <View style={{ marginTop: 10 }}>
                    <Text style={[styles.text]}>{item.acceptedtime}</Text>
                </View>
            )
        }
}
    // validateInformation =(item)=>{
    //     if (item.status =="Pending"){
    //         return(
    //             <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>
    //                 <View style={{flexDirection:"row",marginTop:5}}>
    //                     <Text style={[styles.text, { color: "gray" }]}>Requseted date:</Text>
    //                     <Text style={[styles.text,{fontWeight:"bold"} ]}>{item.requesteddate}</Text>
    //                 </View>
    //                 <View style={{flexDirection:'row',marginTop:5}}>
    //                     <Text style={[styles.text, { color: "gray" }]}> Time:</Text>
    //                     <Text style={[styles.text, { fontWeight: "bold" }  ]}>{item.requestedtime}</Text>
    //                 </View>
    //             </View>
    //         )
    //     }
    //     if (item.status == "Accepted") {
    //         return (
    //             <View style={{ flexDirection: "row", alignItems: "center", justifyContent:"space-between" }}>
    //                 <View style={{ flexDirection: "row", marginTop: 5 }}>
    //                     <Text style={[styles.text, { color: "gray" }]}>Accepted date:</Text>
    //                     <Text style={[styles.text,]}>{item.accepteddate}</Text>
    //                 </View>
    //                 <View style={{ flexDirection: 'row', marginTop: 5 }}>
    //                     <Text style={[styles.text, { color: "gray" }]}> Time:</Text>
    //                     <Text style={[styles.text,]}>{item.acceptedtime}</Text>
    //                 </View>
    //             </View>
    //         )
    //     }
    // }
    viewAppointments =(item)=>{
        if(this.props.user.profile.occupation =="Customer"){
           return   this.props.navigation.navigate('ViewAppointment',{item})
        }
        return this.props.navigation.navigate('ViewAppointmentDoctors',{item})
    }
    validateColor =(status)=>{
        if(status =="Completed"){
            return "green"
        }
        if (status == "Accepted") {
            return "blue"
        }
        if (status == "Pending") {
            return "orange"
        }
        if (status == "Rejected") {
            return "red"
        }
        if (status == "Declined") {
            return "red"
        }
    }
    handleEndReached = () => {
        if (this.state.next) {
            this.setState({ offset: this.state.offset + 5 }, () => {
               this.getAppointments()
            })
        }
        return
    }
    handleEndReached2 = () => {
        if (this.state.next2) {
            this.setState({ offset2: this.state.offset2 + 5 }, () => {
                this.getAppointments2()
            })
        }
        return
    }
    handleRefresh =()=>{
        this.setState({ Appointments: [], isFectching:true,next:true,offset:0},()=>{
            this.getAppointments()
        })
    }
    handleRefresh2 = () => {
        this.setState({ Appointments2: [], isFectching2: true, next2: true, offset2: 0,today:moment(new Date()).format("YYYY-MM-DD") }, () => {
            this.getAppointments2()
        })
    }
    FirstRoute =()=>{
        return(
            <FlatList 
              refreshing={this.state.isFectching}
              onRefresh ={()=>{this.handleRefresh()}}
              ListFooterComponent ={this.renderFooter}
              contentContainerStyle={{paddingBottom:90}}
              data={this.state.Appointments}
              onEndReached={()=>{this.handleEndReached()}}
              onEndReachedThreshold={0.1}
              keyExtractor ={(item,index)=>index.toString()}
              renderItem ={({item,index})=>{
               

            if (this.props.user.profile.occupation == "Customer") {
          
                            let dp =null
                            if (item?.doctordetails?.dp){
                                dp = `${url}${item?.doctordetails?.dp}`
                            }
               
                return(
                    <TouchableOpacity
                        onPress={() => { this.viewAppointments(item)}}
                      style={{
                            marginTop: 10,
                            minHeight: height * 0.2,
                            backgroundColor: "#eee",
                            marginHorizontal: 10,
                            borderRadius: 10,
                      }}
                    >
                     <View style={{flexDirection:"row",flex:1,}}>
                          <View style={{flex:0.3,alignItems:"center",justifyContent:"center"}}> 
                              <Image
                                style={{height:'80%',width:"95%",borderRadius:5}}
                                source ={{uri:dp}}
                                resizeMode ={"cover"}
                              />
                          </View>
                          <View style={{flex:0.7,paddingLeft:10}}>
                              <View style={{marginTop:20}}>
                                    <Text style={[styles.text,{color:"#000",fontWeight:"bold"}]}>{item?.clinicname?.name}</Text>
                              </View>
                                <View style={{ marginTop: 10,flexDirection:"row" }}>
                                    <Text style={[styles.text, { color: "#000", }]}>Reason :</Text>
                                    <Text style={[styles.text, { color: "#000",  }]}> {item?.reason}</Text>
                                </View>
                                <View style={{ flexDirection: "row", marginTop: 10,}}>
                                    <Text style={[styles.text, { color: "#000", }]}>{item?.requesteddate}</Text>
                                    <Text style={[styles.text, { color: "#000", }]}>|</Text>
                                    <Text style={[styles.text, { color: "#000", }]}>{item?.requestedtime}</Text>
                                </View>
                                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 10,}}>
                                    <View style={{flex:0.7}}>
                                        <Text style={[styles.text,{color:this.validateColor(item?.status)}]}>{item?.status}</Text>
                                    </View>
                                    <View style={{flexDirection:'row',justifyContent:"space-around",alignItems:"center",flex:0.3}}>
                                         <TouchableOpacity style={[styles.boxWithShadow,{backgroundColor:"#fff",height:30,width:30,borderRadius:15,alignItems:"center",justifyContent:'center'}]}
                                          onPress ={()=>{this.chatClinic(item)}}
                                         >
                                            <Ionicons name="md-chatbox" size={20} color="#63BCD2" />
                                         </TouchableOpacity>
                                        <TouchableOpacity style={[styles.boxWithShadow, { backgroundColor: "#fff", height: 30, width: 30, borderRadius: 15, alignItems: "center", justifyContent: 'center' }]}
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
                                            <FontAwesome5 name="directions" size={20} color="#63BCD2" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                          </View>
                     </View>
               
                       
                   

                
                    </TouchableOpacity>
                )
                }else{
                    return(
                        <TouchableOpacity
                            onPress={() => { this.viewAppointments(item)}}
                            style={{
                                marginTop: 10,
                                minHeight: height * 0.17,
                                backgroundColor: "#eee",
                                marginHorizontal: 10,
                                borderRadius: 10,
                         }}
                        >

                 
                        <View
                            style={{
                                
                                flexDirection: "row",
                            }}

                        >
                            <View style={{flex:0.6}}>
                                    <View style={{ paddingLeft:10 ,paddingTop:10}}>
                                        <Text style={[styles.text, {fontWeight:"bold",color:"#000"}]}>{item.patientname.name}</Text>
                                    </View>
                                    <View style={{ paddingLeft: 10, paddingTop: 10 ,flexDirection:"row"}}>
                                        <View>
                                            <Text style={[styles.text, { fontWeight: "bold" }]}>Reason : </Text>
                                        </View>
                                        <View>
                                            <Text style={[styles.text, { fontWeight: "bold" }]}>{item.reason}</Text>
                                        </View>
                                     
                                    </View>
                                    <View style={{ paddingLeft: 10, paddingTop: 10 ,flexDirection:"row"}}>
                                        <View>
                                            <Text style={[styles.text, {}]}>{item.requesteddate}</Text>
                                        </View>
                                        <View>
                                            <Text style={[styles.text]}> | </Text>
                                        </View>
                                        <View>
                                            <Text style={[styles.text]}> {item.requestedtime} </Text>
                                        </View>
                                    </View>
                                    <View style={{ paddingLeft: 10, paddingTop: 10 ,}}>
                                        <Text style={[styles.text, { fontWeight: "bold", color: this.validateColor(item?.status) }]}>{item?.status}</Text>
                                    </View>
                               </View>
                               <View style={{flex:0.4}}>

                                    <View style={{ flex: 0.5, alignItems: 'center', justifyContent: 'center' }}>

                                        {item?.status == "Pending" ? <TouchableOpacity style={{ height: height * 0.05, width: "80%", borderRadius: 10, alignItems: 'center', justifyContent: "center", backgroundColor: "#32CD32" }}
                                            onPress={() => { this.setState({ modal: true, selectedAppointment: item, selectedIndex: index, today: item.requesteddate, time: item.requestedtime }) }}
                                        >
                                            <Text style={[styles.text, { color: "#fff" }]}>Accept</Text>
                                        </TouchableOpacity> : <TouchableOpacity style={{ height: height * 0.05, width: "70%", borderRadius: 10, alignItems: 'center', justifyContent: "center", backgroundColor: "orange" }}
                                            onPress={() => {

                                                this.setState({ selectedAppointment: item, selectedIndex: index, }, () => {
                                                    this.completeAppointment()
                                                })
                                            }}
                                        >
                                            <Text style={[styles.text, { color: "#fff" }]}>finish</Text>
                                        </TouchableOpacity>}
                                    </View>

                                    {item?.status != "Completed" && <View style={{ flex: 0.5, alignItems: 'center', justifyContent: 'center' }}>
                                        <TouchableOpacity style={{ height: height * 0.05, width: "80%", borderRadius: 10, alignItems: 'center', justifyContent: "center", backgroundColor: "#B22222" }}
                                            onPress={() => {
                                                this.setState({ selectedAppointment: item, selectedIndex: index }, () => {
                                                    this.RejectAppointment()
                                                })
                                            }}
                                        >
                                            <Text style={[styles.text, { color: "#fff" }]}>Reject</Text>
                                        </TouchableOpacity>
                                    </View>}
                               </View>
                                {/* <View style={{ flex: 0.6, justifyContent: "center" }}>
                                    <View style={{ flexDirection: "row", margin: 5, flex: 0.5 }}>

                                        <Text style={[styles.text, { fontWeight: "bold" }]}>Name   :</Text>
                                        <Text style={[styles.text, { marginLeft: 10 }]}>{item.patientname.name}</Text>
                                    </View>
                                    <View style={{ flexDirection: "row", margin: 5, flex: 0.5 }}>
                                        <Text style={[styles.text, { fontWeight: "bold" }]}>Reason:</Text>
                                        <View style={{ justifyContent: 'center', flex: 1 }}>
                                            <Text style={[styles.text, { marginLeft: 10 }]}>{item.reason}</Text>

                                        </View>

                                    </View>
                                </View> */}



                            {/* <View style={{ flex: 0.4, flexDirection: "row", alignItems: "center", justifyContent: 'center' }}>
                               
                              


                                <View style={{ flex: 0.5, alignItems: 'center', justifyContent: 'center' }}>

                                    {item.status =="Pending"?<TouchableOpacity style={{ height: height * 0.05, width: "80%", borderRadius: 10, alignItems: 'center', justifyContent: "center", backgroundColor: "#32CD32" }}
                                            onPress={() => { this.setState({ modal: true, selectedAppointment: item, selectedIndex: index, today: item.requesteddate, time: item.requestedtime})}}
                        >
                            <Text style={[styles.text, { color: "#fff" }]}>Accept</Text>
                                    </TouchableOpacity> : <TouchableOpacity style={{ height: height * 0.05, width: "70%", borderRadius: 10, alignItems: 'center', justifyContent: "center", backgroundColor: "orange"  }}
                                                onPress={() => {
                                                  
                                                    this.setState({ selectedAppointment: item, selectedIndex: index, },()=>{
                                                this.completeAppointment()
                                            }) }}
                                    >
                                        <Text style={[styles.text, { color: "#fff" }]}>finish</Text>
                                    </TouchableOpacity>}
                                </View> 
                              
                                {item.status != "Completed" && <View style={{ flex: 0.5, alignItems: 'center', justifyContent: 'center' }}>
                                    <TouchableOpacity style={{ height: height * 0.05, width: "80%", borderRadius: 10, alignItems: 'center', justifyContent: "center", backgroundColor: "#B22222" }}
                                        onPress={() => {
                                            this.setState({ selectedAppointment: item, selectedIndex: index }, () => {
                                                this.RejectAppointment()
                                            })
                                        }}
                        >
                            <Text style={[styles.text, { color: "#fff" }]}>Reject</Text>
                        </TouchableOpacity>
                    </View>}
                            </View> */}
                            
                        </View>
                        {/* <View style ={{
                            margin:10,
                            alignItems:"center",
                            justifyContent:"center",
                            flexDirection:"row"
                        }}>
                        
                            <View style={{flex:1}}>
                                    {
                                        this.validateInformation(item)
                                    }
                            </View>
                       
                        
                        </View> */}
                        </TouchableOpacity>
                    )
                }
                 
              }} 
            />
        )
    }
    validateStatus =(status)=>{
        if (status == "Completed"){
            return "green"
        }
        if (status == "Rejected") {
            return "red"
        }
        if (status == "Accepted") {
            return "Yellow"
        }
      
    }
    SecondRoute =()=>{
        return(
            <FlatList
            refreshing={this.state.isFectching2}
            onRefresh ={()=>{this.handleRefresh2()}}
            onEndReached ={()=>{this.handleEndReached2()}}
            onEndReachedThreshold={0.1}
            ListFooterComponent={this.renderFooter2}
            contentContainerStyle={{paddingBottom:90}}
                data={this.state.Appointments2}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => {
                    if (this.props.user.profile.occupation == "Customer") {
                        let dp = null
                        if (item?.doctordetails?.dp) {
                            dp = `${url}${item.doctordetails.dp}`
                        }
                        return (
                            <TouchableOpacity
                                onPress={() => { this.viewAppointments(item) }}
                                style={{
                                    marginTop: 10,
                                    minHeight: height * 0.2,
                                    backgroundColor: "#eee",
                                    marginHorizontal: 10,
                                    borderRadius: 10,
                                }}
                            >
                                <View style={{ flexDirection: "row", flex: 1, }}>
                                    <View style={{ flex: 0.3, alignItems: "center", justifyContent: "center" }}>
                                        <Image
                                            style={{ height: '80%', width: "95%", borderRadius: 5 }}
                                            source={{ uri: dp }}
                                            resizeMode={"cover"}
                                        />
                                    </View>
                                    <View style={{ flex: 0.7, paddingLeft: 10 }}>
                                        <View style={{ marginTop: 20 }}>
                                            <Text style={[styles.text, { color: "#000", fontWeight: "bold" }]}>{item.clinicname.name}</Text>
                                        </View>
                                        <View style={{ marginTop: 10, flexDirection: "row" }}>
                                            <Text style={[styles.text, { color: "#000", }]}>Reason :</Text>
                                            <Text style={[styles.text, { color: "#000", }]}> {item.reason}</Text>
                                        </View>
                                        <View style={{ flexDirection: "row", marginTop: 10, }}>
                                            <Text style={[styles.text, { color: "#000", }]}>{item.requesteddate}</Text>
                                            <Text style={[styles.text, { color: "#000", }]}>|</Text>
                                            <Text style={[styles.text, { color: "#000", }]}>{item.requestedtime}</Text>
                                        </View>
                                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 10, }}>
                                            <View style={{ flex: 0.7 }}>
                                                <Text style={[styles.text, { color: this.validateColor(item?.status) }]}>{item?.status}</Text>
                                            </View>
                                            <View style={{ flexDirection: 'row', justifyContent: "space-around", alignItems: "center", flex: 0.3 }}>
                                                <TouchableOpacity style={[styles.boxWithShadow, { backgroundColor: "#fff", height: 30, width: 30, borderRadius: 15, alignItems: "center", justifyContent: 'center' }]}
                                                    onPress={() => { this.chatClinic(item) }}
                                                >
                                                    <Ionicons name="md-chatbox" size={20} color="#63BCD2"/>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={[styles.boxWithShadow, { backgroundColor: "#fff", height: 30, width: 30, borderRadius: 15, alignItems: "center", justifyContent: 'center' }]}
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
                                                    <FontAwesome5 name="directions" size={20} color="#63BCD2"/>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                </View>





                            </TouchableOpacity>

                        )
                    } else {
                        return (
                             <TouchableOpacity
                                onPress={() => { this.viewAppointments(item) }}
                                style={{
                                    marginTop: 10,
                                    minHeight: height * 0.15,
                                    backgroundColor: "#eee",
                                    marginHorizontal: 10,
                                    borderRadius: 10,
                                }}

                            >
                               

                                <View

                                    style={{
                                        flex:1,
                                        flexDirection: "row"
                                    }}

                                >
                                    <View style={{ flex: 0.6 }}>
                                        <View style={{flex:0.6}}>

                                        
                                        <View style={{ paddingLeft: 10, paddingTop: 10 }}>
                                            <Text style={[styles.text, { fontWeight: "bold", color: "#000" }]}>{item.patientname.name}</Text>
                                        </View>
                                        <View style={{ paddingLeft: 10, paddingTop: 10, flexDirection: "row" }}>
                                            <View>
                                                <Text style={[styles.text, { fontWeight: "bold" }]}>Reason : </Text>
                                            </View>
                                            <View>
                                                <Text style={[styles.text, { fontWeight: "bold" }]}>{item.reason}</Text>
                                            </View>

                                        </View>
                                        </View>
                                        <View style={{ flexDirection: 'row',  alignItems: "center", flex:0.4,}}>
                                            <TouchableOpacity style={[styles.boxWithShadow, { backgroundColor: "#fff", height: 30, width: 30, borderRadius: 15, alignItems: "center", justifyContent: 'center',marginLeft:10 }]}
                                                onPress={() => { }}
                                            >
                                                <Ionicons name="md-chatbox" size={20} color="#63BCD2" />
                                            </TouchableOpacity>
                                            <TouchableOpacity style={[styles.boxWithShadow, { backgroundColor: "#fff", height: 30, width: 30, borderRadius: 15, alignItems: "center", justifyContent: 'center' ,marginLeft:10}]}
                                                onPress={() => { }}
                                            >
                                                <Ionicons name="call" size={20} color="#63BCD2" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                     <View style={{flex:0.4,alignItems:'center',justifyContent:"center"}}>
                                         {
                                             this.validateInformation(item)
                                         }
                                         <View style={{marginTop:5}}>
                                             <Text style={[styles.text,{color:this.validateColor(item?.status)}]}>{item?.status}</Text>
                                         </View>
                                     </View>
                                    {/* <View style={{ flex: 0.6, justifyContent: "center" }}>
                                                     <View style={{ flexDirection: "row", margin: 5, flex: 0.5 }}>

                                        <Text style={[styles.text, { fontWeight: "bold" }]}>Name   :</Text>
                                        <Text style={[styles.text, { marginLeft: 10 }]}>{item.patientname.name}</Text>
                                    </View>
                                    <View style={{ flexDirection: "row", margin: 5, flex: 0.5 }}>
                                        <Text style={[styles.text, { fontWeight: "bold" }]}>Reason:</Text>
                                        <View style={{ justifyContent: 'center', flex: 1 }}>
                                            <Text style={[styles.text, { marginLeft: 10 }]}>{item.reason}</Text>

                                        </View>

                                    </View>
                                    </View> */}

                                    {/* TABS */}
{/* 
                                    <View style={{ flex: 0.4, flexDirection: "row", alignItems: "center", justifyContent: 'center', }}>
                                        <View style={{ alignItems: 'center', justifyContent: "center" }}>
                                            <View style={{ alignItems: "center", justifyContent: "center" }}>
                                                <Text style={[styles.text]}>Status:</Text>
                                            </View>
                                            <View style={{ alignItems: "center", justifyContent: "center" }}>
                                                <Text style={[styles.text, { color: this.validateColor(item.status) }]}>{item.status}</Text>

                                            </View>
                                        </View>

                                    </View> */}

                                </View>

                                {/* <View style={{
                                    margin: 10,
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexDirection: "row"
                                }}>

                                    <View style={{ flex: 1 }}>
                                        {
                                            this.validateInformation(item)
                                        }
                                    </View>


                                </View> */}
                            </TouchableOpacity>

                           
                        )
                    }
                }}
            />
        )
       
    }
    renderScene = SceneMap({
        NewAppointments: this.FirstRoute,
        Completed: this.SecondRoute,
    });
    // renderScene = (routes) => {

    //     return(<FlatList 
    //         data ={this.state.Appointments}
    //         keyExtractor ={(item,index)=>index.toString()}
    //         renderItem ={({item,index})=>{

                
    //             if (this.props.user.profile.occupation !="Doctor"){
    //                 let dp =null
    //                 if (item.doctordetails.dp){
    //                     dp = `${url}${item.doctordetails.dp}`
    //                 }
    //             return(
    //                 <View
    //                     style={{
    //                         marginTop: 10,
    //                         minHeight: height * 0.1,
    //                         backgroundColor: "#eee",
    //                         marginHorizontal: 10,
    //                         borderRadius: 10,
    //                         flexDirection: "row"
    //                     }}

    //                 >
    //                     <TouchableOpacity style={{ flex: 0.2, alignItems: "center", justifyContent: 'center' }}
    //                         onPress={() => { this.props.navigation.navigate('ProfileView') }}
    //                     >
    //                         <Image
    //                             source={{ uri: dp||"https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg" }}
    //                             style={{ height: 60, width: 60, borderRadius: 30 }}
    //                         />
    //                     </TouchableOpacity>
    //                     <View style={{ flex: 0.4, justifyContent: "space-around", alignItems: "center", }}>
    //                         <Text style={[styles.text]}>{item.doctordetails.name}</Text>
    //                         <Text style={[styles.text]}>{item.clinicname}</Text>
    //                     </View>

    //                     {/* TABS */}

    //                     <View style={{ flex: 0.4, flexDirection: "row", alignItems: "center", justifyContent: 'center' }}>
    //                         <View style={{ alignItems: 'center', justifyContent: "center" }}>
    //                             <Text style={[styles.text]}>Status:</Text>
    //                             <Text style={[styles.text]}>{item.status}</Text>
    //                         </View>
                     
    //                     </View>
    //                 </View>

    //             )
    //             }else{
    //                 return(
    //                     <View
    //                         style={{
    //                             marginTop: 10,
    //                             minHeight: height * 0.1,
    //                             backgroundColor: "#eee",
    //                             marginHorizontal: 10,
    //                             borderRadius: 10,
    //                             flexDirection: "row"
    //                         }}

    //                     >
    //                         <TouchableOpacity style={{ flex: 0.2, alignItems: "center", justifyContent: 'center' }}
    //                             onPress={() => { this.props.navigation.navigate('ProfileView') }}
    //                         >
    //                             <Image
    //                                 source={{ uri: item.patientname.dp || "https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg" }}
    //                                 style={{ height: 60, width: 60, borderRadius: 30 }}
    //                             />
    //                         </TouchableOpacity>
    //                         <View style={{ flex: 0.4, justifyContent: "space-around", alignItems: "center", }}>
    //                             <Text style={[styles.text]}>{item.patientname.name}</Text>
    //                             <Text style={[styles.text]}>{item.patientname.mobile}</Text>
    //                         </View>

                       

    //                         <View style={{ flex: 0.4, flexDirection: "row", alignItems: "center", justifyContent: 'center' }}>
    //                                {/* this */}
    //                             {item.status != "Completed"  ? 
                                
                                
    //                             <View style={{ flex: 0.5, alignItems: 'center', justifyContent: 'center' }}>
                                    
    //                                 {item.status =="Pending"?<TouchableOpacity style={{ height: height * 0.05, width: "80%", borderRadius: 10, alignItems: 'center', justifyContent: "center", backgroundColor: "#32CD32" }}
    //                                     onPress={() => { this.setState({ modal: true, selectedAppointment:item,selectedIndex:index})}}
    //                     >
    //                         <Text style={[styles.text, { color: "#fff" }]}>Accept</Text>
    //                                 </TouchableOpacity> : <TouchableOpacity style={{ height: height * 0.05, width: "70%", borderRadius: 10, alignItems: 'center', justifyContent: "center", backgroundColor: "#32CD32"  }}
    //                                         onPress={() => { this.setState({  selectedAppointment: item, selectedIndex: index },()=>{
    //                                             this.completeAppointment()
    //                                         }) }}
    //                                 >
    //                                     <Text style={[styles.text, { color: "#fff" }]}>finish</Text>
    //                                 </TouchableOpacity>}
    //                             </View> :
    //                             // or
    //                             <View style={{ alignItems: 'center', justifyContent: "center" }}>
    //                                 <Text style={[styles.text]}>Status:</Text>
    //                                 <Text style={[styles.text]}>{item.status}</Text>
    //                             </View>}
    //                             {item.status != "Completed" && <View style={{ flex: 0.5, alignItems: 'center', justifyContent: 'center' }}>
    //                                 <TouchableOpacity style={{ height: height * 0.05, width: "80%", borderRadius: 10, alignItems: 'center', justifyContent: "center", backgroundColor: "#B22222" }}
    //                                     onPress={() => {
    //                                         this.setState({ selectedAppointment: item, selectedIndex: index }, () => {
    //                                             this.RejectAppointment()
    //                                         })
    //                                     }}
    //                     >
    //                         <Text style={[styles.text, { color: "#fff" }]}>Reject</Text>
    //                     </TouchableOpacity>
    //                 </View>}
    //                         </View>
    //                     </View>
    //                 )
    //             }
    //         }}
    //     />
               
    //     )
    // }
    indexChange = async (index,) => {
        //    if(index == 0){
        //      this.getAppointments()
        //    }
        //    if(index == 1){
        //        this.getAppointments2()
        //    }
            this.setState({ index })
        
    }
    SearchOppoinments=async(text)=>{

        if (typeof this.state.cancelToken != typeof undefined) {
            this.state.cancelToken.cancel('cancelling the previous request')
        }
        this.state.cancelToken = axios.CancelToken.source()
        let api = `${url}/api/prescription/appointments/?requesteduser=${this.props.user.id}&search=${text}`
        console.log(api,"pppp")
        const data = await axios.get(api, { cancelToken: this.state.cancelToken.token });
        this.setState({ Appointments2: data.data })
       

       
    }
    Modal =()=>{
      
        return(
            <Modal 
                deviceHeight={screenHeight}
              isVisible={this.state.modal}
              onBackdropPress={()=>{this.setState({modal:false})}}
            >
                 <View style={{flex:1,justifyContent:"center"}}>
                     <View style={{height:height*0.3,backgroundColor:"#eee",borderRadius:10,alignItems:'center',justifyContent:'center'}}>
                          <Text style={[styles.text,{fontWeight:"bold",fontSize:18}]}>Select Date:</Text>
                          <View style={{flexDirection:"row"}}>
                            <TouchableOpacity
                                style={{ marginTop: 10 }}
                                onPress={() => { this.setState({ show: true }) }}
                            >
                                <FontAwesome name="calendar" size={24} color="black" />
                            </TouchableOpacity>
                            <View style={{ alignItems: "center", justifyContent: "center", marginLeft: 10, marginTop: 7}}>
                                <Text>{this.state?.today}</Text>
                            </View>
                   
                          </View>
                         
                        <Text style={[styles.text, { fontWeight: "bold", fontSize: 18}]}>Select Time</Text>
                        <View style={{flexDirection:"row"}}>
                            <TouchableOpacity
                                style={{ marginTop: 10 }}
                                onPress={() => { this.setState({ show2: true }) }}
                            >
                                <FontAwesome5 name="clock" size={24} color="black" />
                            </TouchableOpacity>
                            <View style={{alignItems:"center",justifyContent:"center",marginLeft:10,marginTop:7}}>
                                <Text>{this.state?.time}</Text>
                            </View>
                            
                        </View>
                        <View>
                            <TouchableOpacity style={{backgroundColor:themeColor,height:height*0.05,width:width*0.4,alignItems:'center',justifyContent:"center",borderRadius:10,marginTop:30}}
                              onPress ={()=>{this.acceptAppointment()}}
                            >
                                <Text style={[styles.text,{color:"#fff"}]}>Accept</Text>
                            </TouchableOpacity>
                        </View>
                     </View>
                     
                 </View>
            </Modal>
        )
    }
    appoinmentModal =()=>{
        return (
            <Modal
                deviceHeight={screenHeight}
                isVisible={this.state.showAppoinmentModal}
                onBackdropPress={() => { this.setState({ showAppoinmentModal: false }) }}
            >
                <View style={{ flex: 1, justifyContent: "center" }}>
                    <View style={{ height: height * 0.6, backgroundColor: "#eee", borderRadius: 10, }}>
                        <ScrollView 
                         showsVerticalScrollIndicator ={false}
                        > 
                        <View style={{marginVertical:10,alignItems:'center',justifyContent:"center"}}>
                            <Text style={[styles.text,{color:"#000",fontWeight:"bold",fontSize:20}]}>Create New Appoinment</Text>
                          
                        </View>
                        <View style={{marginHorizontal:20,marginVertical:10}}>
                                <Text style={[styles.text, { fontWeight: "bold", fontSize: 18 }]}>Patient Contact No</Text>
                                <View style={{marginTop:5}}>
                                    <TextInput
                                        maxLength={10}
                                        keyboardType={"numeric"}
                                        selectionColor={themeColor}
                                        value={this.state.patientNo}
                                        style={{ width: width * 0.8, height: height * 0.05, backgroundColor: "#fff", borderRadius: 10, paddingLeft: 5, textAlignVertical: "top", paddingTop: 5 }}
                                        onChangeText={(patientNo) => { this.searchUser(patientNo) }}

                                    />
                                </View>
                              
                        </View>
                            <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
                                <Text style={[styles.text, { fontWeight: "bold", fontSize: 18 }]}>Patient Name</Text>
                                <View style={{ marginTop: 5 }}>
                                    <TextInput
                                      
                                        selectionColor={themeColor}
                                        value={this.state.patientname}
                                        style={{ width: width * 0.8, height: height * 0.05, backgroundColor: "#fff", borderRadius: 10, paddingLeft: 5, textAlignVertical: "top", paddingTop: 5 }}
                                        onChangeText={(patientname) => { this.setState({ patientname }) }}

                                    />
                                </View>

                            </View>
                        <View style={{ marginHorizontal: 20,marginVertical:10 }}>
                            <Text style={[styles.text, { fontWeight: "bold", fontSize: 18 }]}>Select Doctor</Text>
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

                        </View>
                        <View style={{ marginLeft: 20, marginTop: 20 }}>
                            <View style={{ alignItems: "center", justifyContent: "center" }}>
                                <Text style={[styles.text, { fontWeight: "bold", fontSize: 18 }]}>Select Date</Text>
                            </View>

                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                                <TouchableOpacity style={{ marginTop: 10 }}
                                    onPress={() => { this.setState({ show: true }) }}
                                >
                                    <FontAwesome name="calendar" size={24} color="black" />
                                </TouchableOpacity>
                                <View style={{ alignItems: 'center', justifyContent: "center", marginLeft: 20, marginTop: 5 }}>
                                    <Text>{this.state.today}</Text>
                                </View>

                            </View>


                        </View>
                        <View style={{ marginLeft: 20, marginTop: 20 }}>
                            <View style={{ alignItems: "center", justifyContent: 'center' }}>
                                <Text style={[styles.text, { fontWeight: "bold", fontSize: 18 }]}>Select Time</Text>

                            </View>
                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                                <TouchableOpacity style={{ marginTop: 10 }}
                                    onPress={() => { this.setState({ show2: true }) }}
                                >
                                    <FontAwesome name="calendar" size={24} color="black" />
                                </TouchableOpacity>
                                <View style={{ alignItems: 'center', justifyContent: "center", marginLeft: 20, marginTop: 5 }}>
                                    <Text>{this.state.time}</Text>
                                </View>

                            </View>


                        </View>
                            <View style={{ margin: 20 }}>
                                <View style={{}}>
                                    <Text style={[styles.text, { fontWeight: "bold" }]}>Reason :</Text>

                                </View>
                                <View style={{ marginTop: 10 }}>
                                    <TextInput
                                        selectionColor={themeColor}
                                        value={this.state.reason}
                                        style={{ width: width * 0.8, height: height * 0.1, backgroundColor: "#fff", borderRadius: 10, paddingLeft: 5, textAlignVertical: "top", paddingTop: 5 }}
                                        onChangeText={(reason) => { this.setState({ reason }) }}

                                    />
                                </View>

                            </View>
                            <View style={{margin:20,alignItems:'center',justifyContent:'center'}}>
                               <TouchableOpacity 
                                 style={{backgroundColor:themeColor,height:height*0.05,width:width*0.4,alignItems:'center',justifyContent:'center',borderRadius:10}}
                                 onPress ={()=>{this.requestAppointment()}}
                               >
                                   {!this.state.creating?<Text style={[styles.text,{color:"#fff"}]}>Create Appoinment</Text>:
                                   <ActivityIndicator  color ={"#fff"} size ={"small"}/>
                                   }
                               </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                    
                </View>
            </Modal>
        )
    }
    renderFilter =()=>{
        if (this.state.index == 1 && this.props.user.profile.occupation == "Customer"){
            return(
                <View style={{ flex: 0.4, alignItems: "center", justifyContent: "center"}}>
                    <TouchableOpacity 
                      onPress ={()=>{this.setState({search:true})}}
                      style={{alignSelf:"flex-end",marginRight:20}}
                    >
                        <Feather name="search" size={24} color="#fff" />
                    </TouchableOpacity>
                    
                </View>
            )
        }
        if (this.state.index == 1)
        return(
            <View style={{ flex: 0.4, alignItems: "center", justifyContent: "center" }}>
                    <View style={{ flexDirection: "row" }}>
                        <View style={{ alignItems: "center", justifyContent: "center" }}>
                            <Text style={[styles.text, { color: "#fff" }]}>{this.state.today}</Text>
                        </View>

                        <TouchableOpacity
                            style={{ marginLeft: 20 }}
                            onPress={() => { this.setState({ show: true }) }}
                        >
                            <Fontisto name="date" size={24} color={"#fff"} />
                        </TouchableOpacity>


                        <DateTimePickerModal
                            isVisible={this.state.show}
                            mode="date"
                            onConfirm={this.handleConfirm}
                            onCancel={this.hideDatePicker}
                        />
                    </View>
                </View>
            
        )
    }
    render() {
        const { index, routes } = this.state
        return (
            <>
                <SafeAreaView style={styles.topSafeArea} />
                <SafeAreaView style={styles.bottomSafeArea}>
                    <View style={{ flex: 1, backgroundColor: "#fff" }}>
                        <StatusBar backgroundColor={themeColor} />
                              {/* HEADERS */}
                      {!this.state.search?<View style={{ height: height * 0.1, backgroundColor: themeColor, borderBottomRightRadius: 20, borderBottomLeftRadius: 20, flexDirection: 'row', alignItems: "center" }}>
                    
                            <View style={{ flex: 0.6,  }}>
                                <View>
                                    <Text style={[styles.text, { color: '#fff', marginLeft: 20, fontWeight: 'bold', fontSize: 25 }]}>Appointments</Text>

                                </View>
                            </View>
                            {
                                this.renderFilter()
                            }
                        </View>:
                            <View style={{ height: height * 0.1, backgroundColor: themeColor, borderBottomRightRadius: 20, borderBottomLeftRadius: 20, flexDirection: 'row', alignItems: "center" }}>
                                <TouchableOpacity style={{ flex: 0.2, alignItems: "center", justifyContent: 'center' }}
                                    onPress={() => {
                                      this.setState({search:false})
                                    }}
                                >
                                    <Ionicons name="chevron-back-circle" size={30} color="#fff" />
                                </TouchableOpacity>
                                <View style={{ flex: 0.7, alignItems: "center", justifyContent: "center" }}>
                                    <TextInput
                                        autoFocus={true}
                                        selectionColor={themeColor}
                                        style={{ height: "45%", backgroundColor: "#fafafa", borderRadius: 15, padding: 10, marginTop: 10, width: "100%" }}
                                        placeholder="search by reason or clinic name"
                                        onChangeText={(text) => { this.SearchOppoinments(text)}}
                                    />
                               </View>
                        </View>
                        }
                        <TabView
                            style={{ backgroundColor: "#ffffff" }}
                            navigationState={{ index, routes }}
                            renderScene={this.renderScene}
                            onIndexChange={(index) => { this.indexChange(index) }}
                            initialLayout={initialLayout}
                            renderTabBar={(props) =>
                                <TabBar
                                    {...props}
                                    renderLabel={({ route, focused, color }) => (
                                        <Text style={{ color: focused ? themeColor : 'gray', margin: 8, fontWeight: "bold" }}>
                                            {route.title}
                                        </Text>
                                    )}
                                    style={{ backgroundColor: "#fff", height: 50, fontWeight: "bold", color: "red" }}
                                    labelStyle={{ fontWeight: "bold", color: "red" }}
                                    indicatorStyle={{ backgroundColor: themeColor, height: 5 }}
                                />
                            }

                        />
                         {/* Appointments */}
                        {this.Modal()}
                        {this.appoinmentModal()}
                        {/* {this.state.show && (
                            <DateTimePicker
                                testID="dateTimePicker1"
                                value={this.state.date}
                                mode={"date"}
                                is24Hour={true}
                                display="default"
                                onChange={(time) => { this.onChange(time) }}
                            />
                        )}
                        {this.state.show2 && (
                            <DateTimePicker
                                testID="dateTimePicker2"
                                value={this.state.date}
                                mode={"time"}

                                display="default"
                                onChange={(time) => { this.onChange2(time) }}
                            />
                        )} */}
                        <DateTimePickerModal
                            isVisible={this.state.show}
                            mode="date"
                            onConfirm={this.handleConfirm}
                            onCancel={this.hideDatePicker}
                        />
                        <DateTimePickerModal
                        
                            isVisible={this.state.show2}
                            mode="time"
                            onConfirm={this.handleConfirm2}
                            onCancel={this.hideDatePicker2}
                        />
                    </View>
                    {this.props.user.profile.occupation!="Customer"&&<View style={{
                        position: "absolute",
                        bottom: 100,
                        left: 20,
                        right: 20,
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center",

                        borderRadius: 20
                    }}>
                        <TouchableOpacity
                            onPress={() => { this.setState({showAppoinmentModal:true}) }}
                        >
                            <AntDesign name="pluscircle" size={40} color={themeColor} />
                        </TouchableOpacity>
                    </View>}
                </SafeAreaView>
            </>
        );
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
        user:state.selectedUser,
        clinic: state.selectedClinic,
    }
}
export default connect(mapStateToProps, { selectTheme })(Appointments);
