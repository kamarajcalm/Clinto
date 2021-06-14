import React, { Component } from 'react';
import { View, Text, StatusBar, Dimensions, Image, StyleSheet, TouchableOpacity, AsyncStorage, SafeAreaView, ScrollView } from 'react-native';
import settings from '../AppSettings';
import axios from 'axios';
import Modal from 'react-native-modal';
const { height } = Dimensions.get("window");
const { width } = Dimensions.get("window");
import { Ionicons, Entypo, AntDesign, Feather, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
const themeColor = settings.themeColor;
const fontFamily = settings.fontFamily;
import { connect } from 'react-redux';
import { selectTheme } from '../actions';
import { NavigationContainer, CommonActions } from '@react-navigation/native';
import * as  ImagePicker from 'expo-image-picker';
import { TextInput } from 'react-native-gesture-handler';
import * as Location from 'expo-location';

import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
import HttpsClient from '../api/HttpsClient';
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";

import authAxios from '../api/authAxios';

const url = settings.url
class EditDoctorTimings extends Component {
    constructor(props) {
        let clinic = props.route.params.clinic
        super(props);
        this.state = {
            openingTime: null,
            closingTime: null,
            mode: 'time',
            date: new Date(),
            show1: false,
            show2: false,
            doctor: null,
            clinic,
            Sun: {
                day: "Sun",
                index: 0,
                starttime: "6:00 am",
                endtime: "7:00 pm"
            },
            Mon: {
                day: "Mon",
                index: 1,
                starttime: "6:00 am",
                endtime: "7:00 pm"
            },
            Tue: {
                day: "Tue",
                starttime: "6:00 am",
                endtime: "7:00 pm",
                index: 2,
            },
            Wed: {
                day: "Wed",
                starttime: "6:00 am",
                endtime: "7:00 pm",
                index: 3,
            },
            Thu: {
                day: "Thu",
                starttime: "6:00 am",
                endtime: "7:00 pm",
                index: 4,
            },
            Fri: {
                day: "Fri",
                starttime: "6:00 am",
                endtime: "7:00 pm",
                index: 5,
            },
            Sat: {
                day: "Sat",
                starttime: "6:00 am",
                endtime: "7:00 pm",
                index: 6,
            },
            SunArray: [],
            MonArray: [],
            TueArray: [],
            WedArray: [],
            ThuArray: [],
            FriArray: [],
            SatArray: [],
        };
    }

    backFunction = async (item) => {
        console.log(item, "bbbbbb")
        this.setState({ doctor: item })


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
    showDatePicker = () => {
        this.setState({ show1: true })
    };

    hideDatePicker = () => {
        this.setState({ show1: false })
    };
    showDatePicker2 = () => {
        this.setState({ show2: true })
    };

    hideDatePicker2 = () => {
        this.setState({ show2: false })
    };
    handleConfirm = (date) => {
        this.setState({ show1: false, }, () => {
            if (this.state.day == "Sun") {
                let duplicate = this.state.Sun
                duplicate.day = "Sun",
                    duplicate.index = 0,
                    duplicate.starttime = moment(date).format('h:mm a')

                return this.setState({ Sun: duplicate })
            }
            if (this.state.day == "Mon") {
                let duplicate = this.state.Mon

                duplicate.day = "Mon",
                    duplicate.index = 1,
                    duplicate.starttime = moment(date).format('h:mm a')

                return this.setState({ Mon: duplicate })
            }
            if (this.state.day == "Tue") {
                let duplicate = this.state.Tue

                duplicate.day = "Tue",
                    duplicate.index = 2,
                    duplicate.starttime = moment(date).format('h:mm a')

                return this.setState({ Tue: duplicate })
            }
            if (this.state.day == "Wed") {
                let duplicate = this.state.Wed
                duplicate.day = "Wed",
                    duplicate.index = 3,
                    duplicate.starttime = moment(date).format('h:mm a')

                return this.setState({ Wed: duplicate })
            }
            if (this.state.day == "Thu") {
                let duplicate = this.state.Thu

                duplicate.day = "Thu",
                    duplicate.index = 4,
                    duplicate.starttime = moment(date).format('h:mm a')

                return this.setState({ Thu: duplicate })
            }
            if (this.state.day == "Fri") {
                let duplicate = this.state.Fri

                duplicate.day = "Fri",
                    duplicate.index = 5,
                    duplicate.starttime = moment(date).format('h:mm a')

                return this.setState({ Fri: duplicate })
            }
            if (this.state.day == "Sat") {
                let duplicate = this.state.Sat

                duplicate.day = "Sat",
                    duplicate.index = 6,
                    duplicate.starttime = moment(date).format('h:mm a')

                return this.setState({ Sat: duplicate })
            }

        })

        this.hideDatePicker();
    };
    handleConfirm2 = (date) => {
        this.setState({ show2: false, }, () => {
            if (this.state.day == "Sun") {
                let duplicate = this.state.Sun
                duplicate.endtime = moment(date).format('h:mm a')
                return this.setState({ Sun: duplicate })
            }
            if (this.state.day == "Mon") {
                let duplicate = this.state.Mon
                duplicate.endtime = moment(date).format('h:mm a')
                return this.setState({ Mon: duplicate })
            }
            if (this.state.day == "Tue") {
                let duplicate = this.state.Tue
                duplicate.endtime = moment(date).format('h:mm a')
                return this.setState({ Tue: duplicate })
            }
            if (this.state.day == "Wed") {
                let duplicate = this.state.Wed
                duplicate.endtime = moment(date).format('h:mm a')
                return this.setState({ Wed: duplicate })
            }
            if (this.state.day == "Thu") {
                let duplicate = this.state.Thu
                duplicate.endtime = moment(date).format('h:mm a')
                return this.setState({ Thu: duplicate })
            }
            if (this.state.day == "Fri") {
                let duplicate = this.state.Fri
                duplicate.endtime = moment(date).format('h:mm a')
                return this.setState({ Fri: duplicate })
            }
            if (this.state.day == "Sat") {
                let duplicate = this.state.Sat
                duplicate.endtime = moment(date).format('h:mm a')
                return this.setState({ Sat: duplicate })
            }


        })

        this.hideDatePicker2();
    };

    update = async () => {
        let api = `${url}/api/prescription/addDoctors/`
        let timings = [
            {
                type: "Monday",
                timings: this.state.MonArray
            },
            {
                type: "Tuesday",
                timings: this.state.TueArray
            },
            {
                type: "Wednesday",
                timings: this.state.WedArray
            },
            {
                type: "Thursday",
                timings: this.state.ThuArray
            },
            {
                type: "Friday",
                timings: this.state.FriArray
            },
            {
                type: "Saturday",
                timings: this.state.SatArray
            },
            {
                type: "Sunday",
                timings: this.state.SunArray
            },
        ]
        let sendData = {
            shift:this.state.clinic.id,
            timings,

        }
console.log(sendData,"ppp")
        let post = await HttpsClient.post(api, sendData)
        console.log(post, "jkjjj")
        if (post.type == "success") {
            this.showSimpleMessage("Added Successfully", "#00A300", "success")
            setTimeout(() => {
                this.props.navigation.goBack()
            })
        } else {
            this.showSimpleMessage("Try again", "#B22222", "danger")
        }
    }
    setTimings =()=>{
        if (this.state.clinic.clinicShits.Sunday.length > 0) {
            this.state.clinic.clinicShits.Sunday[0].timings.forEach((i,index) => {
                let arr = this.state.SunArray
                let pushObject = {
                    starttime: i[0],
                    endtime: i[1],
                    index:index
                }
                arr.push(pushObject)
                this.setState({ SunArray: arr })
            })
        }
        if (this.state.clinic.clinicShits.Monday.length>0){
            this.state.clinic.clinicShits.Monday[0].timings.forEach((i,index)=>{
                let arr =this.state.MonArray
                let pushObject ={
                    starttime:i[0],
                    endtime:i[1],
                    index: index
                }
                arr.push(pushObject)
                this.setState({ MonArray:arr})
            })
        }
   
        if (this.state.clinic.clinicShits.Tuesday.length > 0) {
            this.state.clinic.clinicShits.Tuesday[0].timings.forEach((i,index) => {
                let arr = this.state.TueArray
                let pushObject = {
                    starttime: i[0],
                    endtime: i[1],
                    index: index
                }
                arr.push(pushObject)
                this.setState({ TueArray: arr })
            })
        }
      
        if (this.state.clinic.clinicShits.Wednesday.length > 0) {
            this.state.clinic.clinicShits.Wednesday[0].timings.forEach((i,index) => {
                let arr = this.state.WedArray
                let pushObject = {
                    starttime: i[0],
                    endtime: i[1],
                    index: index
                }
                arr.push(pushObject)
                this.setState({ WedArray: arr })
            })
        }

        if (this.state.clinic.clinicShits.Thursday.length > 0) {
            this.state.clinic.clinicShits.Thursday[0].timings.forEach((i,index) => {
                let arr = this.state.ThuArray
                let pushObject = {
                    starttime: i[0],
                    endtime: i[1],
                    index: index
                }
                arr.push(pushObject)
                this.setState({ ThuArray: arr })
            })
        }
        if (this.state.clinic.clinicShits.Friday.length > 0) {
            this.state.clinic.clinicShits.Friday[0].timings.forEach((i,index) => {
                let arr = this.state.FriArray
                let pushObject = {
                    starttime: i[0],
                    endtime: i[1],
                    index: index
                }
                arr.push(pushObject)
                this.setState({ FriArray: arr })
            })
        }
        if (this.state.clinic.clinicShits.Saturday.length > 0) {
            this.state.clinic.clinicShits.Saturday[0].timings.forEach((i,index) => {
                let arr = this.state.SatArray
                let pushObject = {
                    starttime: i[0],
                    endtime: i[1],
                    index: index
                }
                arr.push(pushObject)
                this.setState({ SatArray: arr })
            })
        }
    }
    componentDidMount() {
       this.setTimings()
    }
    pushSun = () => {
        let duplicate = this.state.SunArray
        if (this.state.Sun.starttime == undefined) {
            return this.showSimpleMessage("please add from Time", "#dd7030",)
         
        }
        if (this.state.Sun.endtime == undefined) {
            return this.showSimpleMessage("please add end Time", "#dd7030",)
          
        }
        duplicate.push(this.state.Sun)
        this.setState({ Sun: {}, SunArray: duplicate })
    }
    removeSunArray = (item, index) => {
        let duplicate = this.state.SunArray
        duplicate.splice(index, 1)
        this.setState({ SunArray: duplicate })
    }
    pushMon = () => {
        let duplicate = this.state.MonArray

        if (this.state.Mon.starttime == undefined) {
            return this.showSimpleMessage("please add from Time", "#dd7030",)
        }
        if (this.state.Mon.endtime == undefined) {
            return this.showSimpleMessage("please add end Time", "#dd7030",)
        }
        duplicate.push(this.state.Mon)
        this.setState({ Mon: {}, MonArray: duplicate })
    }
    removeMonArray = (item, index) => {
        let duplicate = this.state.MonArray
        duplicate.splice(index, 1)
        this.setState({ MonArray: duplicate })
    }
    pushTue = () => {
        let duplicate = this.state.TueArray

        if (this.state.Tue.starttime == undefined) {
            return this.showSimpleMessage("please add from Time", "#dd7030",)
        }
        if (this.state.Tue.endtime == undefined) {
            return this.showSimpleMessage("please add end Time", "#dd7030",)
        }
        duplicate.push(this.state.Tue)
        this.setState({ Tue: {}, TueArray: duplicate })
    }
    removeTueArray = (item, index) => {
        let duplicate = this.state.TueArray
        duplicate.splice(index, 1)
        this.setState({ TueArray: duplicate })
    }
    pushWed = () => {
        let duplicate = this.state.WedArray

        if (this.state.Wed.starttime == undefined) {
            return this.showSimpleMessage("please add from Time", "#dd7030",)
        }
        if (this.state.Wed.endtime == undefined) {
            return this.showSimpleMessage("please add end Time", "#dd7030",)
        }
        duplicate.push(this.state.Wed)
        this.setState({ Wed: {}, WedArray: duplicate })
    }
    removeWedArray = (item, index) => {
        let duplicate = this.state.WedArray
        duplicate.splice(index, 1)
        this.setState({ WedArray: duplicate })
    }
    pushThu = () => {
        let duplicate = this.state.ThuArray

        if (this.state.Thu.starttime == undefined) {
            return this.showSimpleMessage("please add from Time", "#dd7030",)
        }
        if (this.state.Thu.endtime == undefined) {
            return this.showSimpleMessage("please add end Time", "#dd7030",)
        }
        duplicate.push(this.state.Thu)
        this.setState({ Thu: {}, ThuArray: duplicate })
    }
    removeThuArray = (item, index) => {
        let duplicate = this.state.ThuArray
        duplicate.splice(index, 1)
        this.setState({ ThuArray: duplicate })
    }
    pushFri = () => {
        let duplicate = this.state.FriArray

        if (this.state.Fri.starttime == undefined) {
            return this.showSimpleMessage("please add from Time", "#dd7030",)
        }
        if (this.state.Fri.endtime == undefined) {
            return this.showSimpleMessage("please add end Time", "#dd7030",)
        }
        duplicate.push(this.state.Fri)
        this.setState({ Fri: {}, FriArray: duplicate })
    }
    removeFriArray = (item, index) => {
        let duplicate = this.state.FriArray
        duplicate.splice(index, 1)
        this.setState({ FriArray: duplicate })
    }
    pushSat = () => {
        let duplicate = this.state.SatArray

        if (this.state.Sat.starttime == undefined) {
            return this.showSimpleMessage("please add from Time", "#dd7030",)
        }
        if (this.state.Sat.endtime == undefined) {
            return this.showSimpleMessage("please add end Time", "#dd7030",)
        }
        duplicate.push(this.state.Sat)
        this.setState({ Sat: {}, SatArray: duplicate })
    }
    removeSatArray = (item, index) => {
        let duplicate = this.state.SatArray
        duplicate.splice(index, 1)
        this.setState({ SatArray: duplicate })
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

                            <TouchableOpacity style={{ flex: 0.2, alignItems: 'center', justifyContent: "center" }}
                                onPress={() => { this.props.navigation.goBack() }}
                            >
                                <Ionicons name="chevron-back-circle" size={30} color="#fff" />
                            </TouchableOpacity>
                            <View style={{ flex: 0.6, alignItems: 'center', justifyContent: "center" }}>
                                <Text style={[styles.text, { color: "#fff" }]}>Edit Timings</Text>
                            </View>
                            <View style={{ flex: 0.2, alignItems: 'center', justifyContent: "center" }}>

                            </View>
                        </View>
                        <View style={{ flex: 1 }}>


                            <ScrollView style={{ margin: 20 }}
                                showsVerticalScrollIndicator={false}
                            >

                                
                                {/* TIMINGS... */}

                                <View style={{ padding: 20 }}>
                                    <View>
                                        <Text style={[styles.text, { fontWeight: "bold", fontSize: 18 }]}>Sun :</Text>
                                    </View>
                                    {
                                        this.state.SunArray.map((i, index) => {
                                            return (
                                                <View
                                                    style={{ flexDirection: "row", marginTop: 7 }}
                                                    key={index}
                                                >
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <Text style={[styles.text, { color: "gray" }]}>{i.starttime}</Text>
                                                        <Text style={[styles.text, { color: "gray" }]}>-</Text>
                                                        <Text style={[styles.text, { color: "gray" }]}>{i.endtime}</Text>
                                                    </View>
                                                    <TouchableOpacity
                                                        style={{ marginLeft: 10 }}
                                                        onPress={() => { this.removeSunArray(i, index) }}
                                                    >
                                                        <Entypo name="circle-with-cross" size={24} color="red" />
                                                    </TouchableOpacity>
                                                </View>
                                            )
                                        })
                                    }
                                    <View style={{ height: height * 0.08, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>

                                        <View style={{ flex: 0.33 }}>
                                            <View style={{ alignItems: "center", justifyContent: "center" }}>
                                                <Text style={styles.text}>From Time</Text>
                                            </View>

                                            <View style={{ flexDirection: "row", marginTop: 5, alignItems: "center", }}>
                                                <TouchableOpacity
                                                    onPress={() => { this.setState({ show1: true, day: "Sun" }) }}
                                                >
                                                    <Entypo name="clock" size={24} color="black" />

                                                </TouchableOpacity>

                                                <Text style={{ marginLeft: 10 }}>{this.state.Sun?.starttime}</Text>
                                            </View>

                                        </View>

                                        <View style={{ flex: 0.33, }}>
                                            <View style={{ alignItems: "center", justifyContent: "center" }}>
                                                <Text style={styles.text}>To Time</Text>
                                            </View>

                                            <View style={{ flexDirection: "row", marginTop: 5, alignItems: "center", }}>
                                                <TouchableOpacity
                                                    onPress={() => { this.setState({ show2: true, day: "Sun" }) }}
                                                >
                                                    <Entypo name="clock" size={24} color="black" />

                                                </TouchableOpacity>

                                                <Text style={{ marginLeft: 10 }}>{this.state.Sun?.endtime}</Text>
                                            </View>

                                        </View>
                                        <TouchableOpacity style={{ height: height * 0.05, backgroundColor: themeColor, alignItems: 'center', justifyContent: 'center', borderRadius: 10, flex: 0.33 }}
                                            onPress={() => { this.pushSun() }}
                                        >
                                            <Text style={[styles.text, { color: "#fff" }]}>Add</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View>
                                        <Text style={[styles.text, { fontWeight: "bold", fontSize: 18 }]}>Mon :</Text>
                                    </View>
                                    {
                                        this.state.MonArray.map((i, index) => {
                                            return (
                                                <View
                                                    style={{ flexDirection: "row", marginTop: 7 }}
                                                    key={index}
                                                >
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <Text style={[styles.text, { color: "gray" }]}>{i.starttime}</Text>
                                                        <Text style={[styles.text, { color: "gray" }]}>-</Text>
                                                        <Text style={[styles.text, { color: "gray" }]}>{i.endtime}</Text>
                                                    </View>
                                                    <TouchableOpacity
                                                        onPress={() => { this.removeMonArray(i, index) }}
                                                    >
                                                        <Entypo name="circle-with-cross" size={24} color="red" />
                                                    </TouchableOpacity>
                                                </View>
                                            )
                                        })
                                    }
                                    <View style={{ height: height * 0.08, flexDirection: "row", }}>

                                        <View style={{ flex: 0.33, }}>
                                            <Text style={styles.text}>From Time</Text>
                                            <View style={{ flexDirection: "row", marginTop: 5, alignItems: "center", }}>
                                                <TouchableOpacity
                                                    onPress={() => { this.setState({ show1: true, day: "Mon" }) }}
                                                >
                                                    <Entypo name="clock" size={24} color="black" />

                                                </TouchableOpacity>

                                                <Text style={{ marginLeft: 10 }}>{this.state.Mon?.starttime}</Text>
                                            </View>

                                        </View>

                                        <View style={{ flex: 0.33, }}>
                                            <Text style={styles.text}>To Time</Text>
                                            <View style={{ flexDirection: "row", marginTop: 5, alignItems: "center", }}>
                                                <TouchableOpacity
                                                    onPress={() => { this.setState({ show2: true, day: "Mon" }) }}
                                                >
                                                    <Entypo name="clock" size={24} color="black" />

                                                </TouchableOpacity>

                                                <Text style={{ marginLeft: 10 }}>{this.state.Mon?.endtime}</Text>
                                            </View>

                                        </View>
                                        <TouchableOpacity style={{ height: height * 0.05, backgroundColor: themeColor, alignItems: 'center', justifyContent: 'center', borderRadius: 10, flex: 0.33 }}
                                            onPress={() => { this.pushMon() }}
                                        >
                                            <Text style={[styles.text, { color: "#fff" }]}>Add</Text>
                                        </TouchableOpacity>
                                    </View>

                                    <View>
                                        <Text style={[styles.text, { fontWeight: "bold", fontSize: 18 }]}>Tue :</Text>
                                    </View>
                                    {
                                        this.state.TueArray.map((i, index) => {
                                            return (
                                                <View style={{ flexDirection: "row", marginTop: 7 }}>
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <Text style={[styles.text, { color: "gray" }]}>{i.starttime}</Text>
                                                        <Text style={[styles.text, { color: "gray" }]}>-</Text>
                                                        <Text style={[styles.text, { color: "gray" }]}>{i.endtime}</Text>
                                                    </View>
                                                    <TouchableOpacity
                                                        onPress={() => { this.removeTueArray(i, index) }}
                                                    >
                                                        <Entypo name="circle-with-cross" size={24} color="red" />
                                                    </TouchableOpacity>
                                                </View>
                                            )
                                        })
                                    }
                                    <View style={{ height: height * 0.07, flexDirection: "row", }}>

                                        <View style={{ flex: 0.33 }}>
                                            <Text style={styles.text}>From Time</Text>
                                            <View style={{ flexDirection: "row", marginTop: 5, alignItems: "center", }}>
                                                <TouchableOpacity
                                                    onPress={() => { this.setState({ show1: true, day: "Tue" }) }}
                                                >
                                                    <Entypo name="clock" size={24} color="black" />

                                                </TouchableOpacity>

                                                <Text style={{ marginLeft: 10 }}>{this.state.Tue?.starttime}</Text>
                                            </View>

                                        </View>

                                        <View style={{ flex: 0.33, }}>
                                            <Text style={styles.text}>To Time</Text>
                                            <View style={{ flexDirection: "row", marginTop: 5, alignItems: "center", }}>
                                                <TouchableOpacity
                                                    onPress={() => { this.setState({ show2: true, day: "Tue" }) }}
                                                >
                                                    <Entypo name="clock" size={24} color="black" />

                                                </TouchableOpacity>

                                                <Text style={{ marginLeft: 10 }}>{this.state.Tue?.endtime}</Text>
                                            </View>

                                        </View>
                                        <TouchableOpacity style={{ height: height * 0.05, backgroundColor: themeColor, alignItems: 'center', justifyContent: 'center', borderRadius: 10, flex: 0.33 }}
                                            onPress={() => { this.pushTue() }}
                                        >
                                            <Text style={[styles.text, { color: "#fff" }]}>Add</Text>
                                        </TouchableOpacity>
                                    </View>

                                    <View>
                                        <Text style={[styles.text, { fontWeight: "bold", fontSize: 18 }]}>Wed :</Text>
                                    </View>
                                    {
                                        this.state.WedArray.map((i, index) => {
                                            return (
                                                <View
                                                    style={{ flexDirection: "row", marginTop: 7 }}
                                                    key={index}
                                                >
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <Text style={[styles.text, { color: "gray" }]}>{i.starttime}</Text>
                                                        <Text style={[styles.text, { color: "gray" }]}>-</Text>
                                                        <Text style={[styles.text, { color: "gray" }]}>{i.endtime}</Text>
                                                    </View>
                                                    <TouchableOpacity
                                                        onPress={() => { this.removeWedArray(i, index) }}
                                                    >
                                                        <Entypo name="circle-with-cross" size={24} color="red" />
                                                    </TouchableOpacity>
                                                </View>
                                            )
                                        })
                                    }
                                    <View style={{ height: height * 0.08, flexDirection: "row", }}>

                                        <View style={{ flex: 0.33 }}>
                                            <Text style={styles.text}>From Time</Text>
                                            <View style={{ flexDirection: "row", marginTop: 5, alignItems: "center", }}>
                                                <TouchableOpacity
                                                    onPress={() => { this.setState({ show1: true, day: "Wed" }) }}
                                                >
                                                    <Entypo name="clock" size={24} color="black" />

                                                </TouchableOpacity>

                                                <Text style={{ marginLeft: 10 }}>{this.state.Wed?.starttime}</Text>
                                            </View>

                                        </View>

                                        <View style={{ flex: 0.33, }}>
                                            <Text style={styles.text}>To Time</Text>
                                            <View style={{ flexDirection: "row", marginTop: 5, alignItems: "center", }}>
                                                <TouchableOpacity
                                                    onPress={() => { this.setState({ show2: true, day: "Wed" }) }}
                                                >
                                                    <Entypo name="clock" size={24} color="black" />

                                                </TouchableOpacity>

                                                <Text style={{ marginLeft: 10 }}>{this.state.Wed?.endtime}</Text>
                                            </View>

                                        </View>
                                        <TouchableOpacity style={{ height: height * 0.05, backgroundColor: themeColor, alignItems: 'center', justifyContent: 'center', borderRadius: 10, flex: 0.33 }}
                                            onPress={() => { this.pushWed() }}
                                        >
                                            <Text style={[styles.text, { color: "#fff" }]}>Add</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View>
                                        <Text style={[styles.text, { fontWeight: "bold", fontSize: 18 }]}>Thu :</Text>
                                    </View>
                                    {
                                        this.state.ThuArray.map((i, index) => {
                                            return (
                                                <View style={{ flexDirection: "row", marginTop: 7 }}>
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <Text style={[styles.text, { color: "gray" }]}>{i.starttime}</Text>
                                                        <Text style={[styles.text, { color: "gray" }]}>-</Text>
                                                        <Text style={[styles.text, { color: "gray" }]}>{i.endtime}</Text>
                                                    </View>
                                                    <TouchableOpacity
                                                        onPress={() => { this.removeThuArray(i, index) }}
                                                    >
                                                        <Entypo name="circle-with-cross" size={24} color="red" />
                                                    </TouchableOpacity>
                                                </View>
                                            )
                                        })
                                    }
                                    <View style={{ height: height * 0.08, flexDirection: "row", }}>

                                        <View style={{ flex: 0.33 }}>
                                            <Text style={styles.text}>From Time</Text>
                                            <View style={{ flexDirection: "row", marginTop: 5, alignItems: "center", }}>
                                                <TouchableOpacity
                                                    onPress={() => { this.setState({ show1: true, day: "Thu" }) }}
                                                >
                                                    <Entypo name="clock" size={24} color="black" />

                                                </TouchableOpacity>

                                                <Text style={{ marginLeft: 10 }}>{this.state.Thu?.starttime}</Text>
                                            </View>

                                        </View>

                                        <View style={{ flex: 0.33, }}>
                                            <Text style={styles.text}>To Time</Text>
                                            <View style={{ flexDirection: "row", marginTop: 5, alignItems: "center", }}>
                                                <TouchableOpacity
                                                    onPress={() => { this.setState({ show2: true, day: "Thu" }) }}
                                                >
                                                    <Entypo name="clock" size={24} color="black" />

                                                </TouchableOpacity>

                                                <Text style={{ marginLeft: 10 }}>{this.state.Thu?.endtime}</Text>
                                            </View>

                                        </View>
                                        <TouchableOpacity style={{ height: height * 0.05, backgroundColor: themeColor, alignItems: 'center', justifyContent: 'center', borderRadius: 10, flex: 0.33 }}
                                            onPress={() => { this.pushThu() }}
                                        >
                                            <Text style={[styles.text, { color: "#fff" }]}>Add</Text>
                                        </TouchableOpacity>
                                    </View>


                                    <View>
                                        <Text style={[styles.text, { fontWeight: "bold", fontSize: 18 }]}>Fri :</Text>
                                    </View>
                                    {
                                        this.state.FriArray.map((i, index) => {
                                            return (
                                                <View style={{ flexDirection: "row", marginTop: 7 }}>
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <Text style={[styles.text, { color: "gray" }]}>{i.starttime}</Text>
                                                        <Text style={[styles.text, { color: "gray" }]}>-</Text>
                                                        <Text style={[styles.text, { color: "gray" }]}>{i.endtime}</Text>
                                                    </View>
                                                    <TouchableOpacity
                                                        onPress={() => { this.removeFriArray(i, index) }}
                                                    >
                                                        <Entypo name="circle-with-cross" size={24} color="red" />
                                                    </TouchableOpacity>
                                                </View>
                                            )
                                        })
                                    }
                                    <View style={{ height: height * 0.08, flexDirection: "row", }}>

                                        <View style={{ flex: 0.33 }}>
                                            <Text style={styles.text}>From Time</Text>
                                            <View style={{ flexDirection: "row", marginTop: 5, alignItems: "center", }}>
                                                <TouchableOpacity
                                                    onPress={() => { this.setState({ show1: true, day: "Fri" }) }}
                                                >
                                                    <Entypo name="clock" size={24} color="black" />

                                                </TouchableOpacity>

                                                <Text style={{ marginLeft: 10 }}>{this.state.Fri?.starttime}</Text>
                                            </View>

                                        </View>

                                        <View style={{ flex: 0.33, }}>
                                            <Text style={styles.text}>To Time</Text>
                                            <View style={{ flexDirection: "row", marginTop: 5, alignItems: "center", }}>
                                                <TouchableOpacity
                                                    onPress={() => { this.setState({ show2: true, day: "Fri" }) }}
                                                >
                                                    <Entypo name="clock" size={24} color="black" />

                                                </TouchableOpacity>

                                                <Text style={{ marginLeft: 10 }}>{this.state.Fri?.endtime}</Text>
                                            </View>

                                        </View>
                                        <TouchableOpacity style={{ height: height * 0.05, backgroundColor: themeColor, alignItems: 'center', justifyContent: 'center', borderRadius: 10, flex: 0.33 }}
                                            onPress={() => { this.pushFri() }}
                                        >
                                            <Text style={[styles.text, { color: "#fff" }]}>Add</Text>
                                        </TouchableOpacity>
                                    </View>


                                    <View>
                                        <Text style={[styles.text, { fontWeight: "bold", fontSize: 18 }]}>Sat :</Text>
                                    </View>
                                    {
                                        this.state.SatArray.map((i, index) => {
                                            return (
                                                <View style={{ flexDirection: "row", marginTop: 7 }}>
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <Text style={[styles.text, { color: "gray" }]}>{i.starttime}</Text>
                                                        <Text style={[styles.text, { color: "gray" }]}>-</Text>
                                                        <Text style={[styles.text, { color: "gray" }]}>{i.endtime}</Text>
                                                    </View>
                                                    <TouchableOpacity
                                                        onPress={() => { this.removeSatArray(i, index) }}
                                                    >
                                                        <Entypo name="circle-with-cross" size={24} color="red" />
                                                    </TouchableOpacity>
                                                </View>
                                            )
                                        })
                                    }
                                    <View style={{ height: height * 0.08, flexDirection: "row", }}>

                                        <View style={{ flex: 0.33 }}>
                                            <Text style={styles.text}>From Time</Text>
                                            <View style={{ flexDirection: "row", marginTop: 5, alignItems: "center", }}>
                                                <TouchableOpacity
                                                    onPress={() => { this.setState({ show1: true, day: "Sat" }) }}
                                                >
                                                    <Entypo name="clock" size={24} color="black" />

                                                </TouchableOpacity>

                                                <Text style={{ marginLeft: 10 }}>{this.state.Sat?.starttime}</Text>
                                            </View>

                                        </View>

                                        <View style={{ flex: 0.33, }}>
                                            <Text style={styles.text}>To Time</Text>
                                            <View style={{ flexDirection: "row", marginTop: 5, alignItems: "center", }}>
                                                <TouchableOpacity
                                                    onPress={() => { this.setState({ show2: true, day: "Sat" }) }}
                                                >
                                                    <Entypo name="clock" size={24} color="black" />

                                                </TouchableOpacity>

                                                <Text style={{ marginLeft: 10 }}>{this.state.Sat?.endtime}</Text>
                                            </View>

                                        </View>
                                        <TouchableOpacity style={{ height: height * 0.05, backgroundColor: themeColor, alignItems: 'center', justifyContent: 'center', borderRadius: 10, flex: 0.33 }}
                                            onPress={() => { this.pushSat() }}
                                        >
                                            <Text style={[styles.text, { color: "#fff" }]}>Add</Text>
                                        </TouchableOpacity>
                                    </View>
                                    {this.state.show1 && (
                                        <DateTimePicker
                                            testID="TimePicker1"
                                            value={this.state.date}
                                            mode={this.state.mode}
                                            is24Hour={false}
                                            display="default"
                                            onChange={(time) => { this.onChange1(time) }}
                                        />
                                    )}
                                    {this.state.show2 && (
                                        <DateTimePicker
                                            testID="TimePicker2"
                                            value={this.state.date}
                                            mode={this.state.mode}
                                            is24Hour={false}
                                            display="default"
                                            onChange={(time) => { this.onChange2(time) }}
                                        />
                                    )}
                                </View>

                                <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
                                    <TouchableOpacity style={{ width: width * 0.4, height: height * 0.05, borderRadius: 10, alignItems: 'center', justifyContent: "center", backgroundColor: themeColor }}
                                        onPress={() => { this.update() }}
                                    >
                                        <Text style={[styles.text, { color: "#fff" }]}>Update</Text>
                                    </TouchableOpacity>
                                </View>

                            </ScrollView>

                        </View>

{/* 
                        {this.state.show1 && (
                            <DateTimePicker
                                testID="TimePicker1"
                                value={this.state.date}
                                mode={this.state.mode}
                                is24Hour={false}
                                display="default"
                                onChange={(time) => { this.onChange1(time) }}
                            />
                        )}
                        {this.state.show2 && (
                            <DateTimePicker
                                testID="TimePicker2"
                                value={this.state.date}
                                mode={this.state.mode}
                                is24Hour={false}
                                display="default"
                                onChange={(time) => { this.onChange2(time) }}
                            />
                        )} */}
                        <DateTimePickerModal
                            isVisible={this.state.show1}
                            mode="time"
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
    modalView1: {
        backgroundColor: '#fff',
        marginHorizontal: 0,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        justifyContent: 'flex-end',
        width: width
    }
})

const mapStateToProps = (state) => {

    return {
        theme: state.selectedTheme,

    }
}
export default connect(mapStateToProps, { selectTheme })(EditDoctorTimings)