
import React, { Component } from 'react';
import { View, Text, Dimensions, TouchableOpacity, StyleSheet, TextInput, FlatList, Image, SafeAreaView, Platform, ScrollView} from 'react-native';
import { Ionicons, Entypo, AntDesign, FontAwesome5, Feather ,FontAwesome} from '@expo/vector-icons';
import { connect } from 'react-redux';
import { selectTheme } from '../actions';
import settings from '../AppSettings';
import medicine from '../components/Medicine';
import Medicine from '../components/Medicine';
import HttpsClient from '../api/HttpsClient';
const { height, width } = Dimensions.get("window");
const screenHeight = Dimensions.get('screen').height
const fontFamily = settings.fontFamily;
import { Linking } from 'react-native';
import { SliderBox } from "react-native-image-slider-box";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";
const images = [
    "https://source.unsplash.com/1024x768/?nature",
    "https://source.unsplash.com/1024x768/?water",
    "https://source.unsplash.com/1024x768/?girl",
    "https://source.unsplash.com/1024x768/?tree",
]
const themeColor = settings.themeColor;
const url = settings.url;
const Date1 = new Date()
import moment from 'moment';
import Modal from 'react-native-modal';
const today = moment(Date1).format("YYYY-MM-DD")
class ViewAppointmentDoctors extends Component {
    constructor(props) {
        super(props);
        let item = this.props.route.params.item
        console.log(item)
        this.state = {
            item,
            modal:false,
            show:false,
        };
    }
    showDatePicker = () => {
        this.setState({ show: true })
    };

    hideDatePicker = () => {
        this.setState({ show: false })
    };

    handleConfirm2 = (date) => {
        this.setState({ time: moment(date).format('hh:mm a'), show2: false, date: new Date(date) }, () => {


        })
        this.hideDatePicker();
    };
    handleConfirm = (date) => {
        this.setState({ today: moment(date).format('YYYY-MM-DD'), show: false, date: new Date(date) }, () => {


        })
        this.hideDatePicker();
    };
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
    Modal = () => {

        return (
            <Modal
                deviceHeight={screenHeight}
                isVisible={this.state.modal}
                onBackdropPress={() => { this.setState({ modal: false }) }}
            >
                <View style={{ flex: 1, justifyContent: "center" }}>
                    <View style={{ height: height * 0.3, backgroundColor: "#eee", borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={[styles.text, { fontWeight: "bold", fontSize: 18 }]}>Select Date:</Text>
                        <View style={{ flexDirection: "row" }}>
                            <TouchableOpacity
                                style={{ marginTop: 10 }}
                                onPress={() => { this.setState({ show: true }) }}
                            >
                                <FontAwesome name="calendar" size={24} color="black" />
                            </TouchableOpacity>
                            <View style={{ alignItems: "center", justifyContent: "center", marginLeft: 10, marginTop: 7 }}>
                                <Text>{this.state?.today}</Text>
                            </View>

                        </View>

                        <Text style={[styles.text, { fontWeight: "bold", fontSize: 18 }]}>Select Time</Text>
                        <View style={{ flexDirection: "row" }}>
                            <TouchableOpacity
                                style={{ marginTop: 10 }}
                                onPress={() => { this.setState({ show2: true }) }}
                            >
                                <FontAwesome5 name="clock" size={24} color="black" />
                            </TouchableOpacity>
                            <View style={{ alignItems: "center", justifyContent: "center", marginLeft: 10, marginTop: 7 }}>
                                <Text>{this.state?.time}</Text>
                            </View>

                        </View>
                        <View>
                            <TouchableOpacity style={{ backgroundColor: themeColor, height: height * 0.05, width: width * 0.4, alignItems: 'center', justifyContent: "center", borderRadius: 10, marginTop: 30 }}
                                onPress={() => { this.acceptAppointment() }}
                            >
                                <Text style={[styles.text, { color: "#fff" }]}>Accept</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>
            </Modal>
        )
    }
    validateColor = (status) => {
        if (status == "Completed") {
            return "green"
        }
        if (status == "Accepted") {
            return "green"
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

    getCall =()=>{
        if (Platform.OS == "android") {
            Linking.openURL(`tel:${this.state.item?.patientname?.mobile}`)
        } else {

            Linking.canOpenURL(`telprompt:${this.state.item?.patientname?.mobile}`)
        }
    }
    chatDoctor = async () => {
        let api =null
        if (this.props.user.profile.occupation == "Doctor"){
             api = `${url}/api/prescription/createDoctorChat/?doctor=${this.props.user.id}&customer=${this.state.item.requesteduser}`
        }

        let data = await HttpsClient.get(api)
        console.log(data,"kkk")
        if (data.type == "success") {
            this.props.navigation.navigate('Chat', { item: data.data })
        }
    }
    chatClinic = async () => {
        let api = `${url}/api/prescription/createClinicChat/?clinic=${this.state.item.clinic}&customer=${this.props.user.id}`

        let data = await HttpsClient.get(api)
        console.log(data)

        if (data.type == "success") {
            this.props.navigation.navigate('Chat', { item: data.data })
        }
    }
    acceptAppointment = async () => {
        let api = `${url}/api/prescription/appointments/${this.state.item.id}/`
        let sendData = {
            accepteddate: this.state.today,
            acceptedtime: this.state.time,
            status: "Accepted"
        }
        console.log(sendData)
        let post = await HttpsClient.patch(api, sendData)
        if (post.type == "success") {
            
            this.showSimpleMessage("Accepted SuccessFully", "#00A300", "success")
            this.setState({ modal: false, })
            return this.props.navigation.goBack()
        } else {
            this.showSimpleMessage("Try again", "#B22222", "danger")
            this.setState({ modal: false })
        }
    }
    RejectAppointment = async () => {
        let api = `${url}/api/prescription/appointments/${this.state.item.id}/`
        let sendData = {
            status: "Declined"
        }
        console.log(sendData)
        let post = await HttpsClient.patch(api, sendData)
        if (post.type == "success") {
            this.showSimpleMessage("Rejected SuccessFully", "#00A300", "success")
            this.setState({ modal: false, })
            return this.props.navigation.goBack()
        } else {
            this.showSimpleMessage("Try again", "#B22222", "danger")
            this.setState({ modal: false })
        }
    }
    completeAppointment = async () => {
        this.props.navigation.navigate('addPriscription', { appoinment: this.state.item })

    }
    render() {
        let dp = null
        console.log(this.state.item.patientname,"ppp")
        if (this.state.item.patientname.dp) {
            dp = `${url}${this.state.item.patientname.dp}`
        }
        return (
            <>
                <SafeAreaView style={styles.topSafeArea} />
                <SafeAreaView style={styles.bottomSafeArea}>

                    <View style={{ height: height * 0.1, backgroundColor: themeColor, borderBottomRightRadius: 20, borderBottomLeftRadius: 20, flexDirection: 'row', alignItems: "center" }}>
                        <TouchableOpacity style={{ flex: 0.2, alignItems: "center", justifyContent: 'center' }}
                            onPress={() => { this.props.navigation.goBack() }}
                        >
                            <Ionicons name="chevron-back-circle" size={30} color="#fff" />
                        </TouchableOpacity>
                        <View style={{ flex: 0.7, }}>
                            <Text style={[styles.text, { color: "#fff" ,fontSize:24,fontWeight:'bold'}]}> Appointment Details</Text>
                        </View>

                    </View>
                    <ScrollView>


                        <View style={{ height: height * 0.25, }}>
                            <SliderBox
                                images={images}
                                dotColor={themeColor}
                                imageLoadingColor={themeColor}
                                ImageComponentStyle={{ height: "100%", width: "100%", resizeMode: "cover" }}
                                autoplay={true}
                                circleLoop={true}
                            />
                        </View>
                        <View style={{}}>
                            {/* Clinic Details */}

                            <View style={{ margin: 20 }}>

                                <View>
                                    <Text style={{ fontWeight: "bold", fontSize: 18, color: "#000" }}>{this.state.item.clinicname.name}</Text>
                                </View>



                                <View style={{ marginTop: 10 }}>
                                    <View style={{}}>
                                        <Text>{"address"}</Text>

                                    </View>
                                    <View style={{}}>
                                        <Text>{"city"} - 76768</Text>

                                    </View>
                                </View>
                                <View style={{ marginTop: 10, flexDirection: "row" }}>

                                    {/* <TouchableOpacity style={[styles.boxWithShadow, { backgroundColor: "#fff", height: 30, width: 30, borderRadius: 15, alignItems: "center", justifyContent: 'center' }]}
                                        onPress={() => { this.chatClinic() }}
                                    >
                                        <Ionicons name="md-chatbox" size={20} color="#63BCD2" />
                                    </TouchableOpacity> */}
                                    <TouchableOpacity style={[styles.boxWithShadow, { backgroundColor: "#fff", height: 30, width: 30, borderRadius: 15, alignItems: "center", justifyContent: 'center', marginLeft: 10 }]}
                                        onPress={() => {this.getCall() }}
                                    >
                                        <FontAwesome name="phone" size={20} color="#63BCD2" />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.boxWithShadow, { backgroundColor: "#fff", height: 30, width: 30, borderRadius: 15, alignItems: "center", justifyContent: 'center', marginLeft: 10 }]}
                                        onPress={() => {
                                            this.getDirections(this.state.item)
                                        }}
                                    >
                                        <FontAwesome5 name="directions" size={20} color="#63BCD2" />
                                    </TouchableOpacity>

                                </View>
                            </View>

                            {/* Appointment Details */}
                            <View style={[styles.boxWithShadow, { height: height * 0.07, width, backgroundColor: "#eee", flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20 }]}>
                                <View>
                                    <Text style={[styles.text]}>Pateint Details</Text>
                                </View>
                                <View>
                                    <AntDesign name="down" size={20} color="black" />
                                </View>
                            </View>
                            <View style={{ margin: 20 }}>
                              
                                <View style={{ flexDirection: "row", height: height * 0.1 }}>
                                    <View style={{ flex: 0.3, marginTop: 5 }}>
                                        <Image
                                            style={{ height: 60, width: 60, borderRadius: 30, resizeMode: "cover" }}
                                            source={{ uri: dp }}
                                        />
                                    </View>
                                    <View style={{ flex: 0.7, justifyContent: "center", flexDirection: "row" }}>
                                        <View style={{ flex: 0.7, justifyContent: "center" }}>
                                            <View>
                                                <Text style={[styles.text]}>{this.state.item.patientname.name}</Text>
                                            </View>
                                        
                                        </View>
                                        <View style={{ flex: 0.3, alignItems: "center", justifyContent: "center" ,flexDirection:"row"}}>
                                            <TouchableOpacity style={[styles.boxWithShadow, { backgroundColor: "#fff", height: 30, width: 30, borderRadius: 15, alignItems: "center", justifyContent: 'center' }]}
                                                onPress={() => { this.chatDoctor() }}
                                            >
                                                <Ionicons name="md-chatbox" size={20} color="#63BCD2" />
                                            </TouchableOpacity>
                                            <TouchableOpacity style={[styles.boxWithShadow, { backgroundColor: "#fff", height: 30, width: 30, borderRadius: 15, alignItems: "center", justifyContent: 'center', marginLeft: 10 }]}
                                                onPress={() => { this.getCall()}}
                                            >
                                                <FontAwesome name="phone" size={20} color="#63BCD2" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View style={{ marginHorizontal: 20 }}>
                                <View style={{ flexDirection: "row" }}>
                                    <Text style={[styles.text]}>Appointment Status:</Text>
                                    <Text style={[styles.text, { marginLeft: 10, color: this.validateColor(this.state.item.status) }]}>{this.state.item.status}</Text>
                                </View>
                                <View style={{ marginTop: 10 }}>
                                    <View>
                                        <Text>Requested date & time</Text>
                                    </View>
                                    <View style={{ flexDirection: "row", marginTop: 10 }}>
                                        <View>
                                            <Text style={[styles.text, { marginLeft: 10, color: "gray" }]}>{this.state.item.requesteddate} | </Text>
                                        </View>

                                        <View>
                                            <Text style={[styles.text, { marginLeft: 10, color: "gray" }]}>{this.state.item.requestedtime}</Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={{ marginTop: 10 }}>
                                    <View>
                                        <Text>Confirmed booking  date & time</Text>
                                    </View>
                                    <View style={{ flexDirection: "row", marginTop: 10 }}>
                                        <View>
                                            <Text style={[styles.text, { marginLeft: 10, color: "gray" }]}>{this.state.item.accepteddate}</Text>
                                        </View>

                                        <View>
                                            <Text style={[styles.text, { marginLeft: 10, color: "gray" }]}>{this.state.item.acceptedtime}</Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={{flexDirection:"row",marginTop:20}}>
                                    <View style={{ flex: 0.5, alignItems: 'center', justifyContent: 'center' }}>

                                        {this.state.item.status == "Pending"&& <TouchableOpacity style={{ height: height * 0.05, width: "80%", borderRadius: 10, alignItems: 'center', justifyContent: "center", backgroundColor: "#32CD32" }}
                                            onPress={() => { this.setState({ modal: true,today:this.state.item.requesteddate,time:this.state.item.requestedtime  }) }}
                                        >
                                            <Text style={[styles.text, { color: "#fff" }]}>Accept</Text>
                                        </TouchableOpacity> }
                                        
                                        {this.state.item.status == "Accepted" && <TouchableOpacity style={{ height: height * 0.05, width: "70%", borderRadius: 10, alignItems: 'center', justifyContent: "center", backgroundColor: "orange" }}
                                            onPress={() => {

                                              
                                                    this.completeAppointment()
                                              
                                            }}
                                        >
                                            <Text style={[styles.text, { color: "#fff" }]}>finish</Text>
                                        </TouchableOpacity>}
                                    </View>

                                    {this.state.item.status != "Completed" && this.state.item.status != "Declined" && <View style={{ flex: 0.5, alignItems: 'center', justifyContent: 'center' }}>
                                        <TouchableOpacity style={{ height: height * 0.05, width: "80%", borderRadius: 10, alignItems: 'center', justifyContent: "center", backgroundColor: "#B22222" }}
                                            onPress={() => {
                          
                                                    this.RejectAppointment()
                                            
                                            }}
                                        >
                                            <Text style={[styles.text, { color: "#fff" }]}>Reject</Text>
                                        </TouchableOpacity>
                                    </View>}
                                </View>
                                {/* <View style={{ flexDirection: "row",marginTop:20 }}>
                                <Text style={[styles.text,{fontWeight:"bold"}]}>Requested Date:</Text>
                                <Text style={[styles.text, { marginLeft: 10,color:"gray" }]}>{this.state.item.requesteddate}</Text>
                            </View>
                            <View style={{ flexDirection: "row", marginTop: 20 }}>
                                <Text style={[styles.text, { fontWeight: "bold" }]}>Requested Time:</Text>
                                <Text style={[styles.text, { marginLeft: 10, color: "gray" }]}>{this.state.item.requestedtime}</Text>
                            </View>
                            <View style={{ flexDirection: "row", marginTop: 20 }}>
                                <Text style={[styles.text, { fontWeight: "bold" }]}>Accepted Date:</Text>
                                <Text style={[styles.text, { marginLeft: 10, color: "gray" }]}>{this.state.item.accepteddate}</Text>
                            </View>
                            <View style={{ flexDirection: "row", marginTop: 20 }}>
                                <Text style={[styles.text, { fontWeight: "bold" }]}>Accepted Time:</Text>
                                <Text style={[styles.text, { marginLeft: 10, color: "gray" }]}>{this.state.item.acceptedtime}</Text>
                            </View> */}
                            </View>

                        </View>
{
    this.Modal()
}
                    </ScrollView>
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
                </SafeAreaView>
              
            </>
        );
    }
}
const styles = StyleSheet.create({
    text: {
        fontFamily
    },


})
const mapStateToProps = (state) => {

    return {
        theme: state.selectedTheme,
        user: state.selectedUser
    }
}
export default connect(mapStateToProps, { selectTheme })(ViewAppointmentDoctors);