import React, { Component } from 'react';
import { View, Text, Dimensions, TouchableOpacity, StyleSheet, TextInput, FlatList, Image, SafeAreaView, StatusBar,ActivityIndicator ,ScrollView} from 'react-native';
import { Ionicons, Entypo, AntDesign ,FontAwesome5,FontAwesome} from '@expo/vector-icons';
import { connect } from 'react-redux';
import { selectTheme } from '../../actions';
import settings from '../../AppSettings';

const { height, width } = Dimensions.get("window");
const fontFamily = settings.fontFamily;
const themeColor = settings.themeColor;
const screenHeight = Dimensions.get("screen").height;
import axios from 'axios';
import moment from 'moment';
import HttpsClient from '../../api/HttpsClient';
import Modal from 'react-native-modal';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";
const url = settings.url;
const today = moment(new Date()).format("YYYY-MM-DD")
class PendingAppoinments extends Component {
    constructor(props) {
        super(props);
        this.state = {
            offset:0,
            appoinments:[],
            next:true,
            selectedAppointment:null,
            selectedIndex:null,
            appoinmentFixDate:today,
            appoinmentFixTime:moment(new Date()).format('hh:mm a'),
            showAppoinmentDatePicker:false,
            showAppoinmentTimePicker:false,
            refreshing:false
        };
    }
              showSimpleMessage(content,color, type = "info", props = {}) {
        const message = {
            message: content,
            backgroundColor:color,
            icon: { icon: "auto", position: "left" },
            type,
            ...props,
        };

        showMessage(message);
    }
        RejectAppointment =async()=>{
        let api = `${url}/api/prescription/appointments/${this.state.selectedAppointment.id}/`
        let sendData = { 
            status: "Declined"
        }
        console.log(sendData)
        let post = await HttpsClient.patch(api, sendData)
        if (post.type == "success") {
            let duplicate = this.state.AppointmentsPending
            duplicate.splice(this.state.selectedIndex, 1)
            this.showSimpleMessage("Rejected SuccessFully", "#dd7030",)
            this.getAppointments();
            this.getAppointments2();
            this.setState({ modal: false, AppointmentsPending: duplicate })
        } else {
            this.showSimpleMessage("Try again", "#B22222", "danger")
            this.setState({ modal: false })
        }
    }
        acceptAppointment =async()=>{
        this.setState({loading:true})
        let api = `${url}/api/prescription/appointments/${this.state.selectedAppointment.id}/`
        let sendData ={
            accepteddate:this.state.today2,
            acceptedtime:this.state.time,
            status:"Accepted"
        }
        console.log(sendData)
      let post = await HttpsClient.patch(api,sendData)
      if(post.type =="success"){
           this.setState({loading:false})
           this.getPendingAppoinments()
          let duplicate = this.state.appoinments
          duplicate.splice(this.state.selectedIndex, 1)
          this.showSimpleMessage("Accepted SuccessFully", "#00A300","success")
          this.setState({ modal: false, appoinments:duplicate})
      }else{
           this.setState({loading:false})
          this.showSimpleMessage("Try again", "#B22222", "danger")
          this.setState({ modal: false })
      }
    }
getPendingAppoinments = async()=>{
        let api = `${url}/api/prescription/appointments/?clinic=${this.props.clinic.clinicpk}&status=Pending&limit=5&offset=${this.state.offset}`
    
    const data = await HttpsClient.get(api)
    console.log(api)
    if (data.type == "success") {

 
        this.setState({ appoinments: this.state.appoinments.concat(data.data.results),refreshing:false })
        if (data.data.next != null) {
            this.setState({ next: true })
        } else {
            this.setState({ next: false })
        }
    }else{
        this.setState({refreshing:false})
    }
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
                           this.setState({userfound:true,profiles})
                   }
                    let profiles =[]
                    let pushObj = {
                        label:data.data[0].name,
                        value:data.data[0].user.id,
                        mobile:data.data[0].user.username
                    }
                    profiles.push(pushObj)
                    data.data[0].childUsers.forEach((item)=>{
                        let pushObj ={
                            label:item.name,
                            value:item.childpk,
                            mobile:item.mobile
                        }
                        profiles.push(pushObj)
                    })
                   this.setState({profiles})
                   this.setState({ patientname: profiles[0].label, user: profiles[0]})
               
           }
        }
    }
     requestAppointment = async () => {
        this.setState({creating:true})
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
      
    
        let post = await HttpsClient.post(api, sendData)
        console.log(post, "klkk")
        if (post.type == "success") {
            this.setState({ patientNo: "", reason: "", patientname:""})
            this.setState({ creating: false, showAppoinmentModal: false, Appointments:[],offset:0,next:true},()=>{
                this.getPendingAppoinments()
            })
           
            this.showSimpleMessage("requested SuccessFully", "#00A300", "success")
        } else {
            this.setState({ creating: false, showAppoinmentModal: false})
            this.showSimpleMessage(`${post?.data?.error||"Oops! Something's wrong! "}`, "#B22222", "danger")
        }
    }
   componentDidMount(){
      this.getPendingAppoinments()
                 this._unsubscribe = this.props.navigation.addListener('focus', () => {
            //   this.setState({offset:0,appoinments:[]},()=>{
            //         this.getPendingAppoinments()
            //   })
              
        });
   }
           handleConfirm1 = (date) => {
        this.setState({ appoinmentFixDate: moment(date).format('YYYY-MM-DD'),})
        this.hideDatePicker1();
    
    };
       handleConfirm2 = (date) => {
        this.setState({ appoinmentFixTime:  moment(date).format('hh:mm a'),})
        this.hideDatePicker2();
    };
    hideDatePicker1 =()=>{
        this.setState({showAppoinmentDatePicker:false,showAppoinmentModal:true})
    }
     hideDatePicker1 =()=>{
        this.setState({showAppoinmentTimePicker:false,showAppoinmentModal:true})
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
                   { this.state?.profiles?.length>0&& <View style={{ marginHorizontal: 20,marginVertical:10 }}>
                            <Text style={[styles.text, { fontWeight: "bold", fontSize: 18 }]}>Select Profile</Text>
                            <View style={{ marginTop: 10 }}>
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
                                       this.setState({user:item,patientname:item.label})
                                    } }
                                />
                            </View>

                        </View>}
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
                
                        <View style={{ marginLeft: 20, marginTop: 20 }}>
                            <View style={{ alignItems: "center", justifyContent: "center" }}>
                                <Text style={[styles.text, { fontWeight: "bold", fontSize: 18 }]}>Select Date</Text>
                            </View>

                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                                <TouchableOpacity style={{ marginTop: 10 }}
                                    onPress={() => { this.setState({showAppoinmentModal:false},()=>{
                                        setTimeout(()=>{
                                                this.setState({ showAppoinmentDatePicker: true }) 
                                        },500)
                                    })}}
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
                                <Text style={[styles.text, { fontWeight: "bold", fontSize: 18 }]}>Select Time</Text>

                            </View>
                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                                <TouchableOpacity style={{ marginTop: 10 }}
                                    onPress={() => { this.setState({showAppoinmentModal:false},()=>{
                                        setTimeout(()=>{
                                                this.setState({ showAppoinmentTimePicker: true })
                                        },500)
                                    }) }}
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
    handleEndReached =()=>{
         if (this.state.next) {
            this.setState({ offset: this.state.offset + 5 }, () => {
                this.getPendingAppoinments()
            })
        }
        return
    }
            hideDatePicker3 =()=>{
        this.setState({ show3: false, modal: true })
    }
        hideDatePicker2 = () => {
        this.setState({ show2: false,modal: true})
    };
    handleConfirm3 = (date) => {
        this.setState({ today2: moment(date).format('YYYY-MM-DD'), show3: false, })
        this.hideDatePicker3();
    };
        handleConfirm2 = (date) => {
        this.setState({ time: moment(date).format('hh:mm a'), show2: false, date: new Date(date) }, () => {


        })
        this.hideDatePicker2();
    };
refresh =()=>{
    this.setState({refreshing:true,appoinments:[],offset:0},()=>{
        this.getPendingAppoinments()
    })
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
                                onPress={() => { this.setState({modal:false},()=>{
                                    setTimeout(()=>{
                                        this.setState({ show3: true })
                                    },500)
                                })}}
                            >
                                <FontAwesome name="calendar" size={24} color="black" />
                            </TouchableOpacity>
                            <View style={{ alignItems: "center", justifyContent: "center", marginLeft: 10, marginTop: 7}}>
                                <Text>{this.state?.today2}</Text>
                            </View>
                   
                          </View>
                         
                        <Text style={[styles.text, { fontWeight: "bold", fontSize: 18}]}>Select Time</Text>
                        <View style={{flexDirection:"row"}}>
                            <TouchableOpacity
                                style={{ marginTop: 10 }}
                                onPress={() => { this.setState({ modal:false},()=>{
                                    setTimeout(() => {
                                        this.setState({ show2: true })
                                    }, 500)
                                })}}
                            >
                                <FontAwesome5 name="clock" size={24} color="black" />
                            </TouchableOpacity>
                            <View style={{alignItems:"center",justifyContent:"center",marginLeft:10,marginTop:7}}>
                                <Text>{this.state?.time}</Text>
                            </View>
                            
                        </View>
                        <View>
                           {!this.state.loading? <TouchableOpacity style={{backgroundColor:themeColor,height:height*0.05,width:width*0.4,alignItems:'center',justifyContent:"center",borderRadius:10,marginTop:30}}
                              onPress ={()=>{this.acceptAppointment()}}
                            >
                                <Text style={[styles.text,{color:"#fff"}]}>Accept</Text>
                            </TouchableOpacity>:
                            <View style={{backgroundColor:themeColor,height:height*0.05,width:width*0.4,alignItems:'center',justifyContent:"center",borderRadius:10,marginTop:30}}>
                                    <ActivityIndicator  size={"small"} color={"#fff"}/>
                            </View>
                            }
                        </View>
                     </View>
                     
                 </View>
            </Modal>
        )
    }
        viewAppointments =(item)=>{
   
        return this.props.navigation.navigate('ViewAppointmentDoctors',{item})
    }
    render() {
        return (
            <>
                <SafeAreaView style={styles.topSafeArea} />
                <SafeAreaView style={styles.bottomSafeArea}>
                 <StatusBar backgroundColor={themeColor} barStyle={"default"} />

                 <FlatList 
                   onEndReached={()=>{this.handleEndReached()}}
                   onRefresh={()=>{this.refresh()}}
                   refreshing={this.state.refreshing}
                   data={this.state.appoinments}
                   keyExtractor={(item,index)=>index.toString()}
                   renderItem={({item,index})=>{
                
                             return(
             <TouchableOpacity
                                onPress={() => { this.viewAppointments(item) }}
                                style={{
                                    marginTop: 10,
                                    height: height * 0.15,
                                    backgroundColor: "#eee",
                                    marginHorizontal: 10,
                                    borderRadius: 10,
                                }}
                            >


                            
                                    <View style={{ flex: 0.6,flexDirection:"row" }}>
                                        <View style={{flex:0.5}}>
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
                                        
                                        <View style={{ paddingLeft: 10, paddingTop: 10, flexDirection: "row",flex:0.5 }}>
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
                                       
                                    </View>
                                    <View style={{ flex: 0.4, flexDirection: "row",}}>
                                             <TouchableOpacity 
                                              style={{flex:0.5,alignItems:"center",justifyContent:"center"}}
                                              onPress={() => { this.setState({ modal: true, selectedAppointment: item, selectedIndex: index, today2: item.requesteddate, time: item.requestedtime }) }}
                                             >
                                                 <Text style={[styles.text, { color: "#32CD32" }]}>Accept</Text>
                                             </TouchableOpacity>
                                        <TouchableOpacity
                                        style={{ flex: 0.5, alignItems: "center", justifyContent: "center" }}
                                            onPress={() => {
                                                this.setState({ selectedAppointment: item, selectedIndex: index }, () => {
                                                    this.RejectAppointment()
                                                })
                                            }}
                                        >
                                            <Text style={[styles.text, { color: "#B22222" }]}>Reject</Text>
                                        </TouchableOpacity>
                                     
                                    </View>
                

                              
                      
                            </TouchableOpacity>
                    )
                   
                   }}
                 /> 
                         {this.appoinmentModal()}
                  <View style={{
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
                    </View>
                                 <DateTimePickerModal
                            isVisible={this.state.showAppoinmentDatePicker}
                            mode="date"
                            onConfirm={this.handleConfirm1}
                            onCancel={this.hideDatePicker1}
                        />
                        <DateTimePickerModal
                        
                            isVisible={this.state.showAppoinmentTimePicker}
                            mode="time"
                            onConfirm={this.handleConfirm2}
                            onCancel={this.hideDatePicker2}
                         />
                               {this.Modal()}
                                              <DateTimePickerModal
                            isVisible={this.state.show3}
                            mode="date"
                            onConfirm={this.handleConfirm3}
                            onCancel={this.hideDatePicker3}
                        />
                        <DateTimePickerModal
                        
                            isVisible={this.state.show2}
                            mode="time"
                            onConfirm={this.handleConfirm2}
                            onCancel={this.hideDatePicker2}
                        />
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
        clinic: state.selectedClinic
    }
}
export default connect(mapStateToProps, { selectTheme })(PendingAppoinments);