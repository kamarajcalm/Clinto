import React, { Component } from 'react';
import { View, Text, Dimensions, TouchableOpacity, StyleSheet, TextInput, FlatList, Image, SafeAreaView, StatusBar,ActivityIndicator } from 'react-native';
import { Ionicons, Entypo, AntDesign,FontAwesome ,FontAwesome5} from '@expo/vector-icons';
import { connect } from 'react-redux';
import { selectTheme } from '../../actions';
import settings from '../../AppSettings';
const screenHeight = Dimensions.get('screen').height
const { height, width } = Dimensions.get("window");
const fontFamily = settings.fontFamily;
const themeColor = settings.themeColor;
import axios from 'axios';
import moment from 'moment';
import HttpsClient from '../../api/HttpsClient';
import Modal from 'react-native-modal';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";
const url = settings.url;

class InProgressAppoinment extends Component {
    constructor(props) {
        super(props);
        this.state = {
           offset:0,
           appoinments:[],
           refreshing:false,
           next:true
        };
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
           this.getAppointments();
           this.getAppointments2();
          let duplicate = this.state.AppointmentsPending
          duplicate.splice(this.state.selectedIndex, 1)
          this.showSimpleMessage("Accepted SuccessFully", "#00A300","success")
          this.setState({ modal: false, AppointmentsPending:duplicate})
      }else{
           this.setState({loading:false})
          this.showSimpleMessage("Try again", "#B22222", "danger")
          this.setState({ modal: false })
      }
    }
        completeAppointment =async()=>{
        this.props.navigation.navigate('addPriscription', { appoinment: this.state.selectedAppointment })
        return
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
getProgressAppoinments= async()=>{
      let   api = `${url}/api/prescription/appointments/?clinic=${this.props.clinic.clinicpk}&status=Accepted&limit=5&offset=${this.state.offset}`
      let data = await HttpsClient.get(api)
      if(data.type=="success"){

            this.setState({ appoinments:this.state.appoinments.concat(data.data.results),refreshing:false})
            if (data.data.next != null) {
                this.setState({ next: true })
            } else {
                this.setState({ next: false })
            }
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
   componentDidMount(){
      this.getProgressAppoinments()
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
            this.getProgressAppoinments();
            this.setState({ modal: false, AppointmentsPending: duplicate })
        } else {
            this.showSimpleMessage("Try again", "#B22222", "danger")
            this.setState({ modal: false })
        }
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
    onEndReached =()=>{
                if (this.state.next) {
            this.setState({ offset: this.state.offset + 5 }, () => {
                this.getProgressAppoinments()
            })
        }
        return
    }
    render() {
        return (
            <>
                <SafeAreaView style={styles.topSafeArea} />
                <SafeAreaView style={styles.bottomSafeArea}>
                 <StatusBar backgroundColor={themeColor} barStyle={"default"} />

                  <FlatList
                    onEndReached={()=>{this.onEndReached()}} 
                    data={this.state.appoinments}
                    keyExtractor={(item,index)=>index.toString()}
                    renderItem={({item,index})=>{
                            return(
                                              <TouchableOpacity
                            onPress={() => { this.viewAppointments(item)}}
                            style={{
                                marginTop: 10,
                                height: height * 0.15,
                                backgroundColor: "#eee",
                                marginHorizontal: 10,
                                borderRadius: 10,
                         }}
                        >

                 
                    
                            <View style={{flex:0.6,flexDirection:'row'}}>
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
                                    <View style={{ flex:0.5,flexDirection:"row",paddingTop:10}}>
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
                               <View style={{flex:0.4,flexDirection:"row"}}>
                                      
                                      <TouchableOpacity style={{flex:0.5,alignItems:"center",justifyContent:"center"}}
                                            onPress={() => {

                                                this.setState({ selectedAppointment: item, selectedIndex: index, }, () => {
                                                    this.completeAppointment()
                                                })
                                            }}
                                      >
                                          <Text style={[styles.text, { color: "orange" }]}>Complete</Text>
                                      </TouchableOpacity>
                                        <TouchableOpacity style={{ flex: 0.5, alignItems: "center", justifyContent: "center" }}
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
export default connect(mapStateToProps, { selectTheme })(InProgressAppoinment);