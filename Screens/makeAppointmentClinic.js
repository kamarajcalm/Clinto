import React, { Component } from 'react';
import { View, Text, StatusBar, Dimensions, Image, StyleSheet, TouchableOpacity, AsyncStorage, SafeAreaView, ScrollView, ToastAndroid, TextInput ,ActivityIndicator} from 'react-native';
import settings from '../AppSettings';
import axios from 'axios';
import Modal from 'react-native-modal';
import { Ionicons, Entypo, AntDesign, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
const { height } = Dimensions.get("window");
const { width } = Dimensions.get("window");

const themeColor = settings.themeColor;
const fontFamily = settings.fontFamily;
const url = settings.url;
import { connect } from 'react-redux';
import { selectTheme } from '../actions';
import { NavigationContainer, CommonActions } from '@react-navigation/native';
import HttpsClient from '../api/HttpsClient';
import DropDownPicker from 'react-native-dropdown-picker';
import moment from 'moment';
import Toast from 'react-native-simple-toast';
import SimpleToast from 'react-native-simple-toast';
import DateTimePickerModal from "react-native-modal-datetime-picker";
let weekdays =["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";
class makeAppointmentClinic extends Component {
    constructor(props) {

        let item = props.route.params.item
        super(props);
        this.state = {
            showModal: false,
            item,
            selectedDoctor: null,
            date: new Date(),
            show: false,
            show2: false,
            time: null,
            today: null,
            doctors:[],
            reason:""
        };
    }
 
    getDoctors = async () => {
        let api = `${url}/api/prescription/clinicDoctors/?clinic=${this.state.item.pk}`
        const data = await HttpsClient.get(api)
        console.log(api, "jjjjj")
        if (data.type == "success") {
            let doctors = []
            data.data.forEach((i)=>{
                let sendObject = {
                    label: `${i.doctor.first_name} (${i.doctor.profile.specialization})`,
                    value: i.doctor.first_name,
                    pk: i.doctor.id,
                    clinicShits: i.clinicShits,
                    
                }
                doctors.push(sendObject)
            })
            this.setState({ doctors,selectedDoctor:doctors[0]})
        }
    }

    componentDidMount() {
      
       this.getDoctors()
    }
    showDatePicker = () => {
        this.setState({ show: true })
    };

    hideDatePicker = () => {
        this.setState({ show: false })
    };
    showDatePicker2 = () => {
        this.setState({ show2: true })
    };

    hideDatePicker2 = () => {
        this.setState({ show2: false })
    };
    handleConfirm = (date) => {
        
        this.setState({ today: moment(date).format('YYYY-MM-DD'), show: false, date: new Date(date) }, () => {
          

        })
        this.hideDatePicker();
    };
    handleConfirm2 = (date) => {

        this.setState({ time: moment(date).format('hh:mm a'), show2: false, date: new Date(date) }, () => {
            

        })
        this.hideDatePicker2();
    };
    // onChange = (selectedDate) => {
    //     if (selectedDate.type == "set") {
    //         this.setState({ today: moment(new Date(selectedDate.nativeEvent.timestamp)).format('YYYY-MM-DD'), show: false, date: new Date(selectedDate.nativeEvent.timestamp) }, () => {


    //         })

    //     } else {
    //         return null
    //     }

    // }
    // onChange2 = (selectedDate) => {
    //     if (selectedDate.type == "set") {
    //         this.setState({ time: moment(new Date(selectedDate.nativeEvent.timestamp)).format('hh:mm a'), show2: false, date: new Date(selectedDate.nativeEvent.timestamp) }, () => {


    //         })

    //     } else {
    //         return null
    //     }

    // }
    requestAppointment = async () => {

        if(this.state.today ==null){
            return this.showSimpleMessage("please select date", "#dd7030","info")
            
        }
        if (this.state.time == null) {
            return this.showSimpleMessage("please select time", "#dd7030","info")
        }
        if(this.state.reason==""){
              return this.showSimpleMessage("please Enter Reason", "#dd7030","info")  
        }
        let api = `${url}/api/prescription/addAppointment/`
        let sendData = {
            clinic: this.state.item.pk,
            requesteduser: this.props.user.id,
            requesteddate: this.state.today,
            requestedtime: this.state.time,
            reason:this.state.reason,
        }

        if(this.state.selectedDoctor){
            sendData.doctor = this.state.selectedDoctor.pk
        }
        
        let post = await HttpsClient.post(api, sendData)
        console.log(post,"klkk")
        if (post.type == "success") {
            this.setState({ creating: false })
            this.showSimpleMessage("requested SuccessFully", "#00A300", "success")
            return this.props.navigation.dispatch(
                CommonActions.reset({
                index: 0,
                routes: [
                    {
                    name: 'Appointments',

                    },

                ],
                })
            )
              
        } else {
            this.setState({creating:false})
            this.showSimpleMessage(`${post?.data?.error||"try again"}`, "#B22222", "danger")
        }
    }
    getTodayTimings = (today,color) => {

        return (
            this.state.selectedDoctor?.clinicShits[today][0].timings.map((i, index) => {
                return (
                    <View
                        key={ index}
                        style={{ flexDirection: "row", marginTop: 5 }}>
                       
                        <Text style={[styles.text, { marginLeft: 5,color }]}>{i[0]}</Text>
                        <Text style={[styles.text,{color}]}>-</Text>
                        <Text style={[styles.text,{color}]}>{i[1]}</Text>
                    </View>
                )
            })
            // this.state.selectedDoctor?.clinicShits[today].map((i, index) => {
            //     return (
            //         <View style={{ flexDirection: "row", marginTop: 5 }}>
            //             <Text style={[styles.text, { fontWeight: "bold" }]}>{index + 1}.</Text>
            //             { i.timings.length>0&&<Text style={[styles.text, { marginLeft: 5 }]}>{i.timings[0][0]}</Text>}
            //             <Text style={[styles.text]}>-</Text>
            //             {i.timings.length > 0 &&<Text style={[styles.text]}>{i.timings[0][1]}</Text>}
            //         </View>
            //     )
            // })
        )



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
                    <View style={{ flex: 1, }}>
                        <StatusBar backgroundColor={themeColor} />
                        {/* Headers */}
                        <View style={{ height: height * 0.1, backgroundColor: themeColor, borderBottomRightRadius: 20, borderBottomLeftRadius: 20, justifyContent: "center", flexDirection: "row" }}>
                            <TouchableOpacity style={{ flex: 0.2, marginLeft: 20, alignItems: "center", justifyContent: 'center' }}
                                onPress={() => { this.props.navigation.goBack() }}
                            >
                                <Ionicons name="chevron-back-circle" size={30} color="#fff" />
                            </TouchableOpacity>
                            <View style={{ flex: 0.6, alignItems: 'center', justifyContent: "center" }}>
                                <Text style={[styles.text, { color: "#fff",fontWeight:"bold",fontSize:20}]}> Appointment</Text>
                            </View>
                            <View style={{ flex: 0.2, alignItems: 'center', justifyContent: "center" }}>

                            </View>
                        </View>
                        <ScrollView 
                          contentContainerStyle={{paddingBottom:30}}
                          keyboardShouldPersistTaps={"handled"}
                        >
                   { this.state.doctors.length>0&&        <View style={{ margin: 20 }}>
                                <Text style={[styles.text, { fontWeight: "bold", fontSize:height*0.02 }]}>Select Doctor</Text>
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
                            
                                            {/* Timings */}
             {this.state.item.type!=="Lab"       &&        <>               
                            <View style={{ alignItems: "center", justifyContent: "center", marginTop: 20 }}>
                                <Text style={[styles.text, { fontWeight: "bold", }]}>Timings:</Text>
                            </View>
                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-around", marginTop: 20 }}>
                                <View style={{ flex: 0.5, alignItems: "center", justifyContent: 'center', flexDirection: "row" }}>
                                    <View style={{ flex: 0.8, alignItems: "center", justifyContent: "center" }}>
                                        <Text style={[styles.text, { fontWeight: "bold", fontSize:height*0.02 }]}>Day</Text>
                                    </View>
                                    <View style={{ flex: 0.2 }}>
                                        <Text style={[styles.text, { fontWeight: "bold", fontSize:height*0.02 }]}>:</Text>

                                    </View>
                                </View>
                                <View style={{ flex: 0.5, alignItems: "center", justifyContent: 'center' }}>
                                    <Text style={[styles.text, { fontWeight: "bold", fontSize:height*0.02 }]}>Working Timings:</Text>
                                </View>
                            </View>
                            {
                                weekdays.map((day,index)=>{
                                          let today =weekdays[new Date().getDay()]
                                     let color = day==today?"red":"#000"
                             
                                    return(
                                                     <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-around", marginTop: 20 }} key={index}>
                                <View style={{ flex: 0.5, alignItems: "center", justifyContent: 'center', flexDirection: "row" }}>
                                    <View style={{ flex: 0.8, alignItems: "center", justifyContent: "center" }}>
                                        <Text style={[styles.text, { fontWeight: "bold", fontSize: height*0.02 ,color}]}>{day}</Text>
                                    </View>
                                    <View style={{ flex: 0.2 }}>
                                        <Text style={[styles.text, { fontWeight: "bold", fontSize:height*0.02 ,color}]}>:</Text>

                                    </View>
                                </View>
                                <View style={{ flex: 0.5, alignItems: "center", justifyContent: 'center' }}>
                                    {
                                        this.getTodayTimings(day,color)
                                    }
                                </View>
                            </View>
                                    )
                                })
                            }
                   
                            
                              </>}
                            <View style={{ marginLeft: 20, marginTop: 20 }}>
                                <View style={{alignItems:"center",justifyContent:"center"}}>
                                    <Text style={[styles.text, { fontWeight: "bold", fontSize:height*0.02 }]}>Select Date</Text>
                                </View>
                               
                                <View style={{ flexDirection: "row" ,alignItems:"center",justifyContent:"center"}}>
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
                                <View style={{alignItems:"center",justifyContent:'center'}}>
                                    <Text style={[styles.text, { fontWeight: "bold", fontSize:height*0.02 }]}>Select Time</Text>

                                </View>
                                <View style={{ flexDirection: "row" ,alignItems:"center",justifyContent:"center"}}>
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
                          
                            <View style={{margin:20}}>
                                <View style={{}}>
                                    <Text style={[styles.text,{fontWeight:"bold"}]}>Reason :</Text>
                                   
                                </View>
                                <View style={{marginTop:10}}>
                                    <TextInput
                                    selectionColor ={themeColor}
                                        value={this.state.reason}
                                        style={{ width: width *0.9, height: height * 0.1, backgroundColor: "#eee", borderRadius: 10, paddingLeft: 5, textAlignVertical: "top" ,paddingTop:5}}
                                        onChangeText={(reason) => { this.setState({ reason }) }}

                                    />
                                </View>
                   
                            </View>
                            <View
                                style={{ alignItems: "center", justifyContent: "center" }}
                            >
                                <TouchableOpacity
                                    style={{ height: height * 0.05, width: width * 0.4, borderRadius: 20, alignItems: "center", justifyContent: "center", flexDirection: "row", backgroundColor: themeColor, marginTop: 20 }}
                                    onPress={() => {
                                        this.setState({creating:true},()=>{
                                            this.requestAppointment()
                                        })
                                        }}
                                >
                                    {
                                        !this.state.creating ? 
                                        <Text style={[styles.text, { color: "#fff" }]}>Confirm </Text>:
                                        <ActivityIndicator 
                                         size={"large"}
                                         color={"#fff"}
                                        />
                                    }
                                   


                                </TouchableOpacity>
                            </View>
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
                            )}
                            */}
                            <DateTimePickerModal
                                testID="2"
                                isVisible={this.state.show}
                                mode="date"
                                onConfirm={this.handleConfirm}
                                onCancel={this.hideDatePicker}
                            />
                            <DateTimePickerModal
                                testID="1"
                                isVisible={this.state.show2}
                                mode="time"
                                onConfirm={this.handleConfirm2}
                                onCancel={this.hideDatePicker2}
                            />
                        </ScrollView>
                        
                       
                    </View>

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
})

const mapStateToProps = (state) => {

    return {
        theme: state.selectedTheme,
        user: state.selectedUser,
    }
}
export default connect(mapStateToProps, { selectTheme })(makeAppointmentClinic)