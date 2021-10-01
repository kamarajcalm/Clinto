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
import { LinearGradient } from 'expo-linear-gradient';
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
        getFirstLetter =(item ,patient=null)=>{
            if(patient){
                let name = item.patientname.name.split("")
                return name[0].toUpperCase()
            }
       
           let clinicName = item?.clinicname?.name.split("")
  
            return clinicName[0].toUpperCase();
        
     
    }
               chatwithCustomer= async (item) => {
        let api = null
   
            api = `${url}/api/prescription/createClinicChat/?clinic=${item.clinic}&customer=${item.requesteduser}`
        

        let data = await HttpsClient.get(api)
        console.log(data, "kkk")
        if (data.type == "success") {
            this.props.navigation.navigate('Chat', { item: data.data })
        }
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
        viewAppointments =(item)=>{
   
        return this.props.navigation.navigate('ViewAppointmentDoctors',{item})
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
            let duplicate = this.state.appoinments
            duplicate.splice(this.state.selectedIndex, 1)
            this.showSimpleMessage("Rejected SuccessFully", "#dd7030",)
            this.getProgressAppoinments();
            this.setState({ modal: false, appoinments: duplicate })
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
                  contentContainerStyle={{paddingBottom:150}}
                     refreshing={this.state.refreshing}
                     onRefresh={()=>{this.onRefresh()}}
                    onEndReached={()=>{this.onEndReached()}} 
                    data={this.state.appoinments}
                    keyExtractor={(item,index)=>index.toString()}
                    renderItem={({item,index})=>{
                            return(
                                                    <TouchableOpacity
                                onPress={() => { this.viewAppointments(item) }}
                                style={[styles.boxWithShadow,{
                                    marginTop: 10,
                                    minHeight: height * 0.2,
                                    backgroundColor: "#fff",
                                    marginHorizontal: 10,
                                    borderRadius: 10,
                                    paddingBottom:20
                                }]}
                            >
                             <View style={{ flexDirection: "row", flex: 1, }}>
                                    
                                        <View style={{ flex: 0.3, alignItems: "center", justifyContent: "center" }}>
                                       <LinearGradient 
                                            style={{ height: height*0.08, width: height*0.08, borderRadius: height*0.04,alignItems: "center", justifyContent: "center" }}
                                            colors={["#333", themeColor, themeColor]}
                                        >
                                            <View >
                                                <Text style={[styles.text, { color: "#ffff", fontWeight: "bold", fontSize: 22 }]}>{this.getFirstLetter(item,"patient")}</Text>
                                            </View>
                                        </LinearGradient>
                                      </View>
                                      <View style={{flex:0.7}}>
                                             <View style={{marginTop:height*0.02,flexDirection:"row"}}>
                                                     <View style={{flexDirection:"row",flex:0.7}}>
                                                     <View style={{alignItems:"center",justifyContent:"center"}}>
                                                           <Text style={[styles.text,{color:"#000",fontSize:height*0.02,fontWeight:"bold"}]}>{item.patientname.name}</Text>
                                                    </View>
                                                    <View style={{alignItems:"center",justifyContent:"center"}}>
                                                        <Text style={[styles.text,{color:"#000",fontSize:height*0.017,}]}> ({item.patientname.age} - {item.patientname.sex})</Text>
                                                    </View>
                                                </View>
                                                <View style={{flex:0.3,flexDirection:"row",alignItems:"center",justifyContent:"space-around"}}>
                                                          <TouchableOpacity style={[styles.boxWithShadow, { backgroundColor: "#fff", height:height*0.04, width:height*0.04, borderRadius:height*0.02, alignItems: "center", justifyContent: 'center' }]}
                                                    onPress={() => { this.chatwithCustomer(item) }}
                                                >
                                                    <Ionicons name="md-chatbox" size={height*0.02} color="#63BCD2" />
                                                </TouchableOpacity>
                                                                                       <TouchableOpacity style={[styles.boxWithShadow, { backgroundColor: "#fff", height:height*0.04, width: height*0.04, borderRadius:height*0.02, alignItems: "center", justifyContent: 'center', }]}
                                                                                onPress={() => {
                                                                        
                                                                                        if (Platform.OS == "android") {
                                                                                            Linking.openURL(`tel:${item?.patientname.mobile}`)
                                                                                        } else {

                                                                                            Linking.canOpenURL(`telprompt:${item?.patientname.mobile}`)
                                                                                        }}}
                                                        
                                                        
                                                                            >
                                                                            <Ionicons name="call" size={height*0.02} color="#63BCD2" />
                                                                            </TouchableOpacity>
                                             
                                                </View>
                                             </View>

                                             <View style={{marginTop:height*0.01,}}>
                                                    <View>
                                                        <Text style={[styles.text,{color:"#000",fontSize:height*0.018}]}>Reason : {item.reason}</Text>
                                                    </View>
                                             </View>
                                                <View style={{marginTop:height*0.01,}}>
                                                    <View>
                                                        <Text style={[styles.text,{color:"#000",fontSize:height*0.018}]}>Accepted : {item.accepteddate} | {item.acceptedtime}</Text>
                                                    </View>
                                             </View>
                                             <View style={{marginTop:height*0.01,flexDirection:"row",alignItems:"center",justifyContent:"space-around"}}>
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
                                      </View>
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