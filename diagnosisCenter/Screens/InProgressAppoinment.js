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

        completeAppointment =async()=>{
        this.props.navigation.navigate('CreateReport', { appoinment: this.state.selectedAppointment })
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
            this._unsubscribe = this.props.navigation.addListener('focus', () => {
              this.setState({offset:0,appoinments:[]},()=>{
                    this.getProgressAppoinments()
              })
              
        });
   }
   componentWillUnmount(){
       this._unsubscribe()
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

    onEndReached =()=>{
                if (this.state.next) {
            this.setState({ offset: this.state.offset + 5 }, () => {
                this.getProgressAppoinments()
            })
        }
        return
    }
    onRefresh =()=>{
        this.setState({offset:0,appoinments:[]},()=>{
            this.getProgressAppoinments()
        })
    }
    render() {
        return (
            <>
                <SafeAreaView style={styles.topSafeArea} />
                <SafeAreaView style={styles.bottomSafeArea}>
                 <StatusBar backgroundColor={themeColor} barStyle={"default"} />

                  <FlatList
                     refreshing={this.state.refreshing}
                     onRefresh={()=>{this.onRefresh()}}
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
export default connect(mapStateToProps, { selectTheme })(InProgressAppoinment);