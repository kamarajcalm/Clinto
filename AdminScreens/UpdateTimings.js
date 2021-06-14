import React, { Component } from 'react';
import { View, Text, StatusBar, Dimensions, TouchableOpacity, StyleSheet, FlatList, Image, SafeAreaView, TextInput } from 'react-native';
import settings from '../AppSettings';
import { connect } from 'react-redux';
import { selectTheme } from '../actions';
const { height, width } = Dimensions.get("window");
import { Ionicons ,Entypo} from '@expo/vector-icons';
import authAxios from '../api/authAxios';
import HttpsClient from '../api/HttpsClient';
const fontFamily = settings.fontFamily;
const themeColor = settings.themeColor;
const url = settings.url
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";
import { StackActions, CommonActions} from '@react-navigation/native';


class UpdateTimings extends Component {
    constructor(props) {
       
        let clinicPk = props?.route?.params?.item?.id || props?.route?.params?.clinicPk
        super(props);
        this.state = {
            isMedical:this.props.route.params.medical||false,
            show1:false,
            show2:false,
            mode: 'time',
            date: new Date(),
            clinicPk,
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
        };
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
    componentDidMount() {
       
    }
    componentWillUnmount() {
       
    }
    UpdateTimings = async()=>{
        let times = []
        times.push(
            this.state.Sun,
            this.state.Mon,
            this.state.Tue,
            this.state.Wed,
            this.state.Thu,
            this.state.Fri,
            this.state.Sat
        )
        times.forEach((i) => {

            if (i.endtime == undefined) {
                return this.showSimpleMessage(`please fill the endtime of ${i.day}`, "#dd7030",)
             
            }
            if (i.starttime == undefined) {
                return this.showSimpleMessage(`please fill the starttime of ${i.day}`, "#dd7030",)
            }
        })
        let api = `${url}/api/prescription/updateTime/`

        let sendData ={
            clinic:this.state.clinicPk,
            times
        }
        console.log(this.state.clinicPk,"pppppppppp")
        let post =  await HttpsClient.post(api,sendData)
          console.log(post,"hjj")
        if(post.type =="success"){
            this.showSimpleMessage("Updated SuccessFully", "#00A300", "success")
                if(this.state.isMedical){
                    return this.props.navigation.dispatch(
                        CommonActions.reset({
                            index: 0,
                            routes: [
                                {
                                    name: 'Medicals',

                                },

                            ],
                        })
                    )
                }
              return this.props.navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [
                        {
                            name: 'Clinics',

                        },

                    ],
                })
            )
        }
        else{

            this.showSimpleMessage("Try again", "#B22222", "danger")
        }
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
    // onChange1 = (selectedDate) => {
    //     if (selectedDate.type == "set") {
    //         this.setState({ show1: false, }, () => {
    //             if (this.state.day == "Sun") {
    //                 let duplicate = this.state.Sun

    //                 duplicate.day = "Sun",
    //                     duplicate.index = 0,
    //                     duplicate.starttime = moment(new Date(selectedDate.nativeEvent.timestamp)).format('h:mm a')

    //                 return this.setState({ Sun: duplicate })
    //             }
    //             if (this.state.day == "Mon") {
    //                 let duplicate = this.state.Mon

    //                 duplicate.day = "Mon",
    //                     duplicate.index = 1,
    //                     duplicate.starttime = moment(new Date(selectedDate.nativeEvent.timestamp)).format('h:mm a')

    //                 return this.setState({ Mon: duplicate })
    //             }
    //             if (this.state.day == "Tue") {
    //                 let duplicate = this.state.Tue

    //                 duplicate.day = "Tue",
    //                     duplicate.index = 2,
    //                     duplicate.starttime = moment(new Date(selectedDate.nativeEvent.timestamp)).format('h:mm a')

    //                 return this.setState({ Tue: duplicate })
    //             }
    //             if (this.state.day == "Wed") {
    //                 let duplicate = this.state.Wed
    //                 duplicate.day = "Wed",
    //                     duplicate.index = 3,
    //                     duplicate.starttime = moment(new Date(selectedDate.nativeEvent.timestamp)).format('h:mm a')

    //                 return this.setState({ Wed: duplicate })
    //             }
    //             if (this.state.day == "Thu") {
    //                 let duplicate = this.state.Thu

    //                 duplicate.day = "Thu",
    //                     duplicate.index = 4,
    //                     duplicate.starttime = moment(new Date(selectedDate.nativeEvent.timestamp)).format('h:mm a')

    //                 return this.setState({ Thu: duplicate })
    //             }
    //             if (this.state.day == "Fri") {
    //                 let duplicate = this.state.Fri

    //                 duplicate.day = "Fri",
    //                     duplicate.index = 5,
    //                     duplicate.starttime = moment(new Date(selectedDate.nativeEvent.timestamp)).format('h:mm a')

    //                 return this.setState({ Fri: duplicate })
    //             }
    //             if (this.state.day == "Sat") {
    //                 let duplicate = this.state.Sat

    //                 duplicate.day = "Sat",
    //                     duplicate.index = 6,
    //                     duplicate.starttime = moment(new Date(selectedDate.nativeEvent.timestamp)).format('h:mm a')

    //                 return this.setState({ Sat: duplicate })
    //             }

    //         })

    //     } else {
    //         return null
    //     }

    // }
    // onChange2 = (selectedDate) => {
    //     if (selectedDate.type == "set") {
    //         this.setState({ show2: false, }, () => {

    //             if (this.state.day == "Sun") {
    //                 let duplicate = this.state.Sun
    //                 duplicate.endtime = moment(new Date(selectedDate.nativeEvent.timestamp)).format('h:mm a')
    //                 return this.setState({ Sun: duplicate })
    //             }
    //             if (this.state.day == "Mon") {
    //                 let duplicate = this.state.Mon
    //                 duplicate.endtime = moment(new Date(selectedDate.nativeEvent.timestamp)).format('h:mm a')
    //                 return this.setState({ Mon: duplicate })
    //             }
    //             if (this.state.day == "Tue") {
    //                 let duplicate = this.state.Tue
    //                 duplicate.endtime = moment(new Date(selectedDate.nativeEvent.timestamp)).format('h:mm a')
    //                 return this.setState({ Tue: duplicate })
    //             }
    //             if (this.state.day == "Wed") {
    //                 let duplicate = this.state.Wed
    //                 duplicate.endtime = moment(new Date(selectedDate.nativeEvent.timestamp)).format('h:mm a')
    //                 return this.setState({ Wed: duplicate })
    //             }
    //             if (this.state.day == "Thu") {
    //                 let duplicate = this.state.Thu
    //                 duplicate.endtime = moment(new Date(selectedDate.nativeEvent.timestamp)).format('h:mm a')
    //                 return this.setState({ Thu: duplicate })
    //             }
    //             if (this.state.day == "Fri") {
    //                 let duplicate = this.state.Fri
    //                 duplicate.endtime = moment(new Date(selectedDate.nativeEvent.timestamp)).format('h:mm a')
    //                 return this.setState({ Fri: duplicate })
    //             }
    //             if (this.state.day == "Sat") {
    //                 let duplicate = this.state.Sat
    //                 duplicate.endtime = moment(new Date(selectedDate.nativeEvent.timestamp)).format('h:mm a')
    //                 return this.setState({ Sat: duplicate })
    //             }



    //         })

    //     } else {
    //         return null
    //     }

    // }
    render() {
        return (
            <>
                <SafeAreaView style={styles.topSafeArea} />
                <SafeAreaView style={styles.bottomSafeArea}>
                    <View style={{ flex: 1, backgroundColor: "#fff" ,}}>
                        <StatusBar backgroundColor={themeColor} />
                                     {/* HEADERS */}
                        <View style={{ height: height * 0.1, backgroundColor: themeColor, borderBottomRightRadius: 20, borderBottomLeftRadius: 20, justifyContent: "center", flexDirection: "row" }}>

                            <TouchableOpacity style={{ flex: 0.2, alignItems: 'center', justifyContent: "center" }}
                                onPress={() => { this.props.navigation.goBack() }}
                            >
                                <Ionicons name="chevron-back-circle" size={30} color="#fff" />
                            </TouchableOpacity>
                            <View style={{ flex: 0.6, alignItems: 'center', justifyContent: "center" }}>
                                <Text style={[styles.text, { color: "#fff" }]}>Update Timings</Text>
                            </View>
                            <View style={{ flex: 0.2, alignItems: 'center', justifyContent: "center" }}>

                            </View>
                        </View>

                               {/* TIMINGS */}
                <View style={{padding:20}}>
                        <View>
                            <Text style={[styles.text, { fontWeight: "bold", fontSize: 18 }]}>Sun :</Text>
                        </View>
                        <View style={{ height: height * 0.07, flexDirection: "row", }}>

                            <View style={{ flex: 0.5 }}>
                                <Text style={styles.text}>Opening Time</Text>
                                <View style={{ flexDirection: "row", marginTop: 5, alignItems: "center", }}>
                                    <TouchableOpacity
                                        onPress={() => { this.setState({ show1: true, day: "Sun" }) }}
                                    >
                                        <Entypo name="clock" size={24} color="black" />

                                    </TouchableOpacity>

                                    <Text style={{ marginLeft: 10 }}>{this.state.Sun?.starttime}</Text>
                                </View>

                            </View>

                            <View style={{ flex: 0.5, }}>
                                <Text style={styles.text}>Closing Time</Text>
                                <View style={{ flexDirection: "row", marginTop: 5, alignItems: "center", }}>
                                    <TouchableOpacity
                                        onPress={() => { this.setState({ show2: true, day: "Sun" }) }}
                                    >
                                        <Entypo name="clock" size={24} color="black" />

                                    </TouchableOpacity>

                                    <Text style={{ marginLeft: 10 }}>{this.state.Sun?.endtime}</Text>
                                </View>

                            </View>
                        </View>
                        <View>
                            <Text style={[styles.text, { fontWeight: "bold", fontSize: 18 }]}>Mon :</Text>
                        </View>
                        <View style={{ height: height * 0.07, flexDirection: "row", }}>

                            <View style={{ flex: 0.5 }}>
                                <Text style={styles.text}>Opening Time</Text>
                                <View style={{ flexDirection: "row", marginTop: 5, alignItems: "center", }}>
                                    <TouchableOpacity
                                        onPress={() => { this.setState({ show1: true, day: "Mon" }) }}
                                    >
                                        <Entypo name="clock" size={24} color="black" />

                                    </TouchableOpacity>

                                    <Text style={{ marginLeft: 10 }}>{this.state.Mon?.starttime}</Text>
                                </View>

                            </View>

                            <View style={{ flex: 0.5, }}>
                                <Text style={styles.text}>Closing Time</Text>
                                <View style={{ flexDirection: "row", marginTop: 5, alignItems: "center", }}>
                                    <TouchableOpacity
                                        onPress={() => { this.setState({ show2: true, day: "Mon" }) }}
                                    >
                                        <Entypo name="clock" size={24} color="black" />

                                    </TouchableOpacity>

                                    <Text style={{ marginLeft: 10 }}>{this.state.Mon?.endtime}</Text>
                                </View>

                            </View>
                        </View>

                        <View>
                            <Text style={[styles.text, { fontWeight: "bold", fontSize: 18 }]}>Tue :</Text>
                        </View>
                        <View style={{ height: height * 0.07, flexDirection: "row", }}>

                            <View style={{ flex: 0.5 }}>
                                <Text style={styles.text}>Opening Time</Text>
                                <View style={{ flexDirection: "row", marginTop: 5, alignItems: "center", }}>
                                    <TouchableOpacity
                                        onPress={() => { this.setState({ show1: true, day: "Tue" }) }}
                                    >
                                        <Entypo name="clock" size={24} color="black" />

                                    </TouchableOpacity>

                                    <Text style={{ marginLeft: 10 }}>{this.state.Tue?.starttime}</Text>
                                </View>

                            </View>

                            <View style={{ flex: 0.5, }}>
                                <Text style={styles.text}>Closing Time</Text>
                                <View style={{ flexDirection: "row", marginTop: 5, alignItems: "center", }}>
                                    <TouchableOpacity
                                        onPress={() => { this.setState({ show2: true, day: "Tue" }) }}
                                    >
                                        <Entypo name="clock" size={24} color="black" />

                                    </TouchableOpacity>

                                    <Text style={{ marginLeft: 10 }}>{this.state.Tue?.endtime}</Text>
                                </View>

                            </View>
                        </View>

                        <View>
                            <Text style={[styles.text, { fontWeight: "bold", fontSize: 18 }]}>Wed :</Text>
                        </View>
                        <View style={{ height: height * 0.07, flexDirection: "row", }}>

                            <View style={{ flex: 0.5 }}>
                                <Text style={styles.text}>Opening Time</Text>
                                <View style={{ flexDirection: "row", marginTop: 5, alignItems: "center", }}>
                                    <TouchableOpacity
                                        onPress={() => { this.setState({ show1: true, day: "Wed" }) }}
                                    >
                                        <Entypo name="clock" size={24} color="black" />

                                    </TouchableOpacity>

                                    <Text style={{ marginLeft: 10 }}>{this.state.Wed?.starttime}</Text>
                                </View>

                            </View>

                            <View style={{ flex: 0.5, }}>
                                <Text style={styles.text}>Closing Time</Text>
                                <View style={{ flexDirection: "row", marginTop: 5, alignItems: "center", }}>
                                    <TouchableOpacity
                                        onPress={() => { this.setState({ show2: true, day: "Wed" }) }}
                                    >
                                        <Entypo name="clock" size={24} color="black" />

                                    </TouchableOpacity>

                                    <Text style={{ marginLeft: 10 }}>{this.state.Wed?.endtime}</Text>
                                </View>

                            </View>
                        </View>
                        <View>
                            <Text style={[styles.text, { fontWeight: "bold", fontSize: 18 }]}>Thu :</Text>
                        </View>
                        <View style={{ height: height * 0.07, flexDirection: "row", }}>

                            <View style={{ flex: 0.5 }}>
                                <Text style={styles.text}>Opening Time</Text>
                                <View style={{ flexDirection: "row", marginTop: 5, alignItems: "center", }}>
                                    <TouchableOpacity
                                        onPress={() => { this.setState({ show1: true, day: "Thu" }) }}
                                    >
                                        <Entypo name="clock" size={24} color="black" />

                                    </TouchableOpacity>

                                    <Text style={{ marginLeft: 10 }}>{this.state.Thu?.starttime}</Text>
                                </View>

                            </View>

                            <View style={{ flex: 0.5, }}>
                                <Text style={styles.text}>Closing Time</Text>
                                <View style={{ flexDirection: "row", marginTop: 5, alignItems: "center", }}>
                                    <TouchableOpacity
                                        onPress={() => { this.setState({ show2: true, day: "Thu" }) }}
                                    >
                                        <Entypo name="clock" size={24} color="black" />

                                    </TouchableOpacity>

                                    <Text style={{ marginLeft: 10 }}>{this.state.Thu?.endtime}</Text>
                                </View>

                            </View>
                        </View>


                        <View>
                            <Text style={[styles.text, { fontWeight: "bold", fontSize: 18 }]}>Fri :</Text>
                        </View>
                        <View style={{ height: height * 0.07, flexDirection: "row", }}>

                            <View style={{ flex: 0.5 }}>
                                <Text style={styles.text}>Opening Time</Text>
                                <View style={{ flexDirection: "row", marginTop: 5, alignItems: "center", }}>
                                    <TouchableOpacity
                                        onPress={() => { this.setState({ show1: true, day: "Fri" }) }}
                                    >
                                        <Entypo name="clock" size={24} color="black" />

                                    </TouchableOpacity>

                                    <Text style={{ marginLeft: 10 }}>{this.state.Fri?.starttime}</Text>
                                </View>

                            </View>

                            <View style={{ flex: 0.5, }}>
                                <Text style={styles.text}>Closing Time</Text>
                                <View style={{ flexDirection: "row", marginTop: 5, alignItems: "center", }}>
                                    <TouchableOpacity
                                        onPress={() => { this.setState({ show2: true, day: "Fri" }) }}
                                    >
                                        <Entypo name="clock" size={24} color="black" />

                                    </TouchableOpacity>

                                    <Text style={{ marginLeft: 10 }}>{this.state.Fri?.endtime}</Text>
                                </View>

                            </View>
                        </View>


                        <View>
                            <Text style={[styles.text, { fontWeight: "bold", fontSize: 18 }]}>Sat :</Text>
                        </View>
                        <View style={{ height: height * 0.07, flexDirection: "row", }}>

                            <View style={{ flex: 0.5 }}>
                                <Text style={styles.text}>Opening Time</Text>
                                <View style={{ flexDirection: "row", marginTop: 5, alignItems: "center", }}>
                                    <TouchableOpacity
                                        onPress={() => { this.setState({ show1: true, day: "Sat" }) }}
                                    >
                                        <Entypo name="clock" size={24} color="black" />

                                    </TouchableOpacity>

                                    <Text style={{ marginLeft: 10 }}>{this.state.Sat?.starttime}</Text>
                                </View>

                            </View>

                            <View style={{ flex: 0.5, }}>
                                <Text style={styles.text}>Closing Time</Text>
                                <View style={{ flexDirection: "row", marginTop: 5, alignItems: "center", }}>
                                    <TouchableOpacity
                                        onPress={() => { this.setState({ show2: true, day: "Sat" }) }}
                                    >
                                        <Entypo name="clock" size={24} color="black" />

                                    </TouchableOpacity>

                                    <Text style={{ marginLeft: 10 }}>{this.state.Sat?.endtime}</Text>
                                </View>

                            </View>
                        </View>
                        {/* {this.state.show1 && (
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
                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                            <TouchableOpacity style={{ width: width * 0.4, height: height * 0.05, borderRadius: 10, alignItems: 'center', justifyContent: "center", backgroundColor: themeColor }}
                                onPress={() => { this.UpdateTimings() }}
                            >
                                <Text style={[styles.text, { color: "#fff" }]}>Update</Text>
                            </TouchableOpacity>
                        </View>
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
        user: state.selectedUser
    }
}
export default connect(mapStateToProps, { selectTheme })(UpdateTimings);