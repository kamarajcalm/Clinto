import React, { Component } from 'react';
import { View, Text, Dimensions, TouchableOpacity, StyleSheet, TextInput, FlatList, Image, SafeAreaView, ScrollView, Linking } from 'react-native';
import { Ionicons, Entypo, AntDesign, MaterialIcons, FontAwesome5, FontAwesome} from '@expo/vector-icons';
import { connect, connectAdvanced } from 'react-redux';
import { selectTheme } from '../actions';
import settings from '../AppSettings';
import medicine from '../components/Medicine';
import Medicine from '../components/Medicine';
import HttpsClient from '../api/HttpsClient';
const { height, width } = Dimensions.get("window");
const fontFamily = settings.fontFamily;
const themeColor = settings.themeColor;
const url = settings.url;
import { SliderBox } from "react-native-image-slider-box";
const images = [
    "https://source.unsplash.com/1024x768/?nature",
    "https://source.unsplash.com/1024x768/?water",
    "https://source.unsplash.com/1024x768/?girl",
    "https://source.unsplash.com/1024x768/?tree",
]
import moment from 'moment-timezone';
const date = new Date();
const day = date.getDay();

class ViewClinic extends Component {
    constructor(props) {
        let item = props.route.params.item
 console.log(item,"iiii")
        super(props);
        this.state = {
            item,
            clinicDetails:null,
            showAll:true,
            doctors:[],
            showAllDoctorTimings:false,
            selectedDoctor:null
        };
    }
    getDoctors = async (id) => {
        let api = `${url}/api/prescription/clinicDoctors/?clinic=${id}`
        const data = await HttpsClient.get(api)
        console.log(api, "jjjjj")
        if (data.type == "success") {
            this.setState({ doctors: data.data })
        }
    }
    getClinicDetails = async()=>{
        const api = `${url}/api/prescription/clinics/${this.state.item.pk}/`
        console.log(api)
        const data = await HttpsClient.get(api)
        if(data.type=="success"){
            this.setState({clinicDetails:data.data})
            this.getDoctors(data.data.id)
        }
    }
    componentDidMount() {
       console.log(this.state.doctors,"jkjk")
        this.getClinicDetails()
        console.log(this.props.user)
    }
    getTodayTimings = (today,item) => {
        return (
            item.clinicShits[today][0].timings.map((i, index) => {
                return (
                    <View
                        key={index}
                        style={{ flexDirection: "row", marginTop: 5 }}>
                        <Text style={[styles.text, { fontWeight: "bold" }]}>{index + 1}.</Text>
                        <Text style={[styles.text, { marginLeft: 5 }]}>{i[0]}</Text>
                        <Text style={[styles.text]}>-</Text>
                        <Text style={[styles.text]}>{i[1]}</Text>
                    </View>
                )
            })
           
        )
    }
    getTodayTimings2 = (item) => {
        let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
        let today = days[date.getDay()]
        return (
            item.clinicShits[today][0].timings.map((i, index) => {
                return (
                    <View
                        key={index}
                        style={{ flexDirection: "row", marginTop: 5 }}>
                        <Text style={[styles.text, { fontWeight: "bold" }]}>{index + 1}.</Text>
                        <Text style={[styles.text, { marginLeft: 5 }]}>{i[0]}</Text>
                        <Text style={[styles.text]}>-</Text>
                        <Text style={[styles.text]}>{i[1]}</Text>
                    </View>
                )
            })
           
        )



    }
    chatClinic = async () => {
        let api = `${url}/api/prescription/createClinicChat/?clinic=${this.state.item.pk}&customer=${this.props.user.id}`

        let data = await HttpsClient.get(api)


        if (data.type == "success") {
            this.props.navigation.navigate('Chat', { item: data.data })
        }
    }
    getOpened = (openTime = this.state?.clinicDetails?.working_hours[date.getDay()][0], closeTime = this.state?.clinicDetails?.working_hours[date.getDay()][1], timezone ="Asia/Kolkata")=>{
      
   

        const now = moment.tz(timezone);

     
        const date = now.format("YYYY-MM-DD");
        const storeOpenTime = moment.tz(date + ' ' + openTime, "YYYY-MM-DD h:mmA", timezone);
        const storeCloseTime = moment.tz(date + ' ' + closeTime, "YYYY-MM-DD h:mmA", timezone);

        let check;
        if (storeCloseTime.isBefore(storeOpenTime)) {
            // Handle ranges that span over midnight
            check = now.isAfter(storeOpenTime) || now.isBefore(storeCloseTime);
        } else {
            // Normal range check using an inclusive start time and exclusive end time
            check = now.isBetween(storeOpenTime, storeCloseTime, null, '[)');
        }
        console.log(openTime,closeTime,check,"kkk")
        return check ? "open" : "closed";
    }
    getDay =(day)=>{
      
     let  days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri","Sat"]
        return days[day]
     
    }
    validateOpen =()=>{
        if(this.getOpened()=="open"){
            return(
                <View style={{flexDirection:'row',}}>
                    <View style={{alignItems:"center",justifyContent:"center"}}> 
                        <Text style={[styles.text, { color: "green" }]}>Open</Text>

                    </View>
                    <TouchableOpacity style={{alignItems:"center",justifyContent:"center",flexDirection:"row"}}
                        onPress={() => { this.setState({ showAll: !this.state.showAll }) }}
                    >
                        <Text style={[styles.text, { marginLeft: 10 }]}>closes at {this.state.clinicDetails?.working_hours[date.getDay()][1]}</Text>
                        <View style={{ alignItems: "center", justifyContent: "center", marginTop: 3 }}>
                            <AntDesign name={this.state.showAll ? "up" : "down"} size={15} color="black" />
                        </View>
                      
                    </TouchableOpacity>
                </View>
                
            )
        }else{
            return (
                <View style={{flexDirection:"row",}}>
                    <View style={{alignItems:"center",justifyContent:"center"}}>
                        <Text style={[styles.text, { fontSize: 18, color: "red" }]}>Closed</Text>

                    </View>
                    <TouchableOpacity style={{alignItems:"center",justifyContent:"center",flexDirection:"row"}}
                        onPress={() => { this.setState({ showAll: !this.state.showAll }) }}
                    >
                        <Text style={[styles.text, { marginLeft: 10 }]}>opens at {this.state?.clinicDetails?.working_hours[date.getDay() + 1][0]} {this.getDay(date.getDay() + 1)}</Text>
                        <View style={{alignItems:"center",justifyContent:"center",marginTop:3}}>
                            <AntDesign name={this.state.showAll ? "up" : "down"} size={15} color="black" />
                        </View>
 
                    </TouchableOpacity>
                </View>
               
            
            )
        }
    }
    render() {
        let dp =null
        if (this.state.item.displayPicture){
            dp = `${url}${this.state.item.displayPicture}`
        }
   
        console.log(this.state?.clinicDetails,"pppp");

        return (
            <>
                <SafeAreaView style={styles.topSafeArea} />
                <SafeAreaView style={styles.bottomSafeArea}>
                    <View style={{ flex: 1 }}>
                        {/* HEADERS */}
                        <View style={{ height: height * 0.1, backgroundColor: themeColor, flexDirection: 'row', alignItems: "center" }}>
                            <TouchableOpacity style={{ flex: 0.2, alignItems: "center", justifyContent: 'center' }}
                                onPress={() => { this.props.navigation.goBack() }}
                            >
                                <Ionicons name="chevron-back-circle" size={30} color="#fff" />
                            </TouchableOpacity>
                            <View style={{ flex: 0.6, alignItems: "center", justifyContent: "center" }}>
                                <Text style={[styles.text, { color: "#fff", fontWeight: "bold", fontSize: 20 }]}> Details</Text>
                            </View>
                            <View style={{ flex: 0.2, alignItems: "center", justifyContent: "center" }}>
                            </View>
                        </View>

                        <ScrollView 
                         style={{}}
                      
                        >
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
                       {/* Clinic Details */}
                            <View style={{ margin: 20 }}>

                                <View>
                                    <Text style={{ fontWeight: "bold", fontSize: 18, color: "#000" }}>{this.state.item.title.toUpperCase()}</Text>
                                </View>



                                <View style={{ marginTop: 10 }}>
                                    <View style={{}}>
                                        <Text style={[styles.text]}>{ this.state?.clinicDetails?.address }</Text>

                                    </View>
                                    <View style={{}}>
                                        <Text style={[styles.text]}>{this.state?.clinicDetails?.city} - {this.state?.clinicDetails?.pincode}</Text>

                                    </View>
                                </View>
                                <View style={{ marginTop: 10, flexDirection: "row" ,}}>
                                   <View style={{flex:0.5,flexDirection:"row",alignItems:"center",justifyContent:"space-around"}}>

                                
                                    <TouchableOpacity style={[styles.boxWithShadow, { backgroundColor: "#fff", height: 30, width: 30, borderRadius: 15, alignItems: "center", justifyContent: 'center' }]}
                                        onPress={() => { this.chatClinic() }}
                                    >
                                        <Ionicons name="md-chatbox" size={20} color="#63BCD2" />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.boxWithShadow, { backgroundColor: "#fff", height: 30, width: 30, borderRadius: 15, alignItems: "center", justifyContent: 'center', marginLeft: 10 }]}
                                        onPress={() => {
                                            if (Platform.OS == "android") {
                                                Linking.openURL(`tel:${this.state?.clinicDetails?.mobile}`)
                                            } else {

                                                Linking.canOpenURL(`telprompt:${this.state?.clinicDetails?.mobile}`)
                                            }
                                         }}
                                    >
                                        <FontAwesome name="phone" size={20} color="#63BCD2" />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.boxWithShadow, { backgroundColor: "#fff", height: 30, width: 30, borderRadius: 15, alignItems: "center", justifyContent: 'center', marginLeft: 10 }]}
                                        onPress={() => {
                                            Linking.openURL(
                                                `https://www.google.com/maps/dir/?api=1&destination=` +
                                                this.state.item.lat +
                                                `,` +
                                                this.state.item.long +
                                                `&travelmode=driving`
                                            );
                                        }}
                                    >
                                        <FontAwesome5 name="directions" size={20} color="#63BCD2" />
                                    </TouchableOpacity>
                                    </View>
                                    <View style={{ alignItems: "center", justifyContent: 'center',flex:0.5 }}>
                                        <TouchableOpacity style={{ height: height * 0.05, width: width * 0.4, backgroundColor: themeColor, borderRadius: 10, alignItems: "center", justifyContent: "center", flexDirection: "row" }}
                                            onPress={() => { this.props.navigation.navigate('makeAppointmentClinic', { item: this.state.item, }) }}
                                        >
                                            <Text style={[styles.text, { color: "#fff" }]}>Book Appointment</Text>


                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>

                                           {/* clinic Timings */}
                            <View style={[styles.boxWithShadow, { height: height * 0.07, width, backgroundColor: "#eee", flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20 }]}>
                                <View>
                                    <Text style={[styles.text]}>Opening Hours</Text>
                                </View>
                                {
                                    this.validateOpen()
                                }
                                {/* <View>
                                    <AntDesign name="down" size={20} color="black" />
                                </View> */}
                            </View>
                            <View style={{ padding: 10, }}>
                                
                                {/* <View style={{ marginHorizontal: 20, marginTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: "space-between" }}>
                                    <View>
                                        <Text style={[styles.text, { fontWeight: "bold", fontSize: 18 }]}>OpeningTime:</Text>
                                    </View>
                                    <View>
                                        <Text style={[styles.text, { fontWeight: "bold", fontSize: 18 }]}>ClosingTime:</Text>
                                    </View>
                                </View>
                                <View style={{ marginHorizontal: 20, marginTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: "space-between" }}>
                                    <View>
                                        <View style={{ alignSelf: "flex-start" }}>
                                            <Text style={[styles.text, { fontWeight: "bold", fontSize: 18, color: "gray" }]}>Today:</Text>
                                        </View>

                                        <Text style={[styles.text, { fontWeight: "bold", fontSize: 18 }]}>{this.state?.clinicDetails?.working_hours[date.getDay()][0]}</Text>
                                    </View>
                                    <View>
                                        <Text style={[styles.text, { fontWeight: "bold", fontSize: 18 }]}>{this.state?.clinicDetails?.working_hours[date.getDay()][1]}</Text>
                                    </View>

                                </View>
                                <View style={{ alignItems: "center", justifyContent: "center" }}>
                                    <TouchableOpacity
                                        onPress={() => { this.setState({ showAll: !this.state.showAll }) }}
                                    >
                                        <Text>{this.state.showAll ? "showLess" : "showAll"}</Text>
                                    </TouchableOpacity>
                                </View> */}
                              
                                {this.state.showAll &&
                                    this.state?.clinicDetails?.sortedTimings.map((i) => {
                                        let day = ""
                                        let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday","Saturday"]
                                    
                                        day = days[i[2]]
                                       
                                     
                                        return (
                                            <View style={{ marginHorizontal: 20, marginTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: "space-between" }}>
                                                <View style={{flexDirection:"row",width:width*0.6}}>
                                                    <View style={{ flex:0.5,flexDirection:"row"}}>
                                                        <View style={{flex: 0.9,}}>
                                                            <Text style={[styles.text, { fontWeight: "bold", fontSize: 18, color: "gray" }]}>{day}</Text>
                                                        </View>
                                                       <View style={{flex: 0.1,}}>
                                                            <Text style={[styles.text, { fontWeight: "bold", fontSize: 18, color: "gray",  }]}>:</Text>

                                                       </View>
                                                    </View>
                                                    <View style={{flexDirection:"row",flex:0.5}}>
                                                        <View style={{flexDirection:"row"}}>
                                                            <Text style={[styles.text, { fontWeight:"bold"}]}>{i[0]}</Text>
                                                            <Text style={[styles.text, { fontWeight: "bold" }]}>-</Text>
                                                            <Text style={[styles.text, { fontWeight: "bold" }]}>{i[1]}</Text>
                                                        </View>
                                                    
                                                    </View>
                                                </View>
                                               
                                            </View>
                                        )
                                    })
                                }
                            </View>
                            <View style={[styles.boxWithShadow, { height: height * 0.07, width, backgroundColor: "#eee", flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20 }]}>
                                <View>
                                    <Text style={[styles.text]}>Doctors List</Text>
                                </View>
                                <View>
                                    <AntDesign name="down" size={20} color="black" />
                                </View>
                            </View>
                            <View style={{ }}>
                               
                                <FlatList
                                    data={this.state.doctors}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({ item, index }) => {
                                        console.log(item.doctor.profile.displayPicture,"doctor")
                                        return (
                                            <View style={{  }}
                                               
                                            >
                                                <View style={[{ flexDirection: "row", marginTop: 15,backgroundColor:"#fff",height:height*0.13,borderRadius:5,marginHorizontal:10}]}>
                                                   
                                                    <View style={{ justifyContent: "center", flex: 0.3 ,alignItems:"center"}}>
                                                       <Image 
                                                         style ={{height:60,width:60,borderRadius:30}}
                                                            source={{ uri: item.doctor.profile.displayPicture}}
                                                       />
                                                    </View>
                                                    <View style={{flex:0.3,justifyContent:"center"}}>
                                                            <View>
                                                            <Text style={[styles.text,{color:"#000"}]}>{item.doctor.first_name}</Text>
                                                            </View>
                                                            <View>
                                                            <Text style={[styles.text, {  }]}>{item.doctor.profile.specialization}</Text>
                                                            </View>
                                                    </View>
                                                    <View style={{ flex: 0.4, alignItems: 'center', justifyContent: 'center' }}>
                                                        <View >
                                                            <Text style={[styles.text,]}>Today Timings:</Text>
                                                        </View>
                                                        {
                                                            this.getTodayTimings2(item)
                                                        }

                                                    </View>
                                               </View>
                                                        {/* Show all timings... */}
                                               
                                                   <View >
                                                         <TouchableOpacity style={{alignItems:"center",justifyContent:"center",marginBottom:20}}
                                                        onPress={() => this.setState({ showAllDoctorTimings:!this.state.showAllDoctorTimings,selectedDoctor:item})}
                                                         >
                                                            {
                                                                this.state.showAllDoctorTimings&&this.state.selectedDoctor == item  ?
                                                                <View style={{flexDirection:"row",}}>
                                                                       <View style={{alignItems:"center",justifyContent:"center"}}>
                                                                        <Text style={[styles.text]}>show less</Text>
                                                                       </View>
                                                                    <View style={{ alignItems: "center", justifyContent: "center",marginLeft: 5, marginTop:3}}>
                                                                        <AntDesign name={"up"} size={15} color="black" />

                                                                      </View>
                                                                </View>:
                                                                <View style={{ flexDirection: "row" }}>
                                                                    <View style={{alignItems:"center",justifyContent:"center"}}>
                                                                        <Text style={[styles.text]}>show all</Text>
                                                                    </View>
                                                                   <View style={{alignItems:"center",justifyContent:"center",marginLeft:5,}}>
                                                                        <AntDesign name={"down"} size={15} color="black" />

                                                                   </View>
                                                                </View>
                                                            }
                                                         </TouchableOpacity>
                                                         {
                                                        this.state.showAllDoctorTimings&&this.state.selectedDoctor==item&&
                                                             <>
                                                           
                                                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-around", marginTop: 20 }}>
                                                                <View style={{ flex: 0.5, alignItems: "center", justifyContent: 'center', flexDirection: "row" }}>
                                                                    <View style={{ flex: 0.8, alignItems: "center", justifyContent: "center" }}>
                                                                        <Text style={[styles.text, { fontWeight: "bold", fontSize: 18 }]}>Day</Text>
                                                                    </View>
                                                                    <View style={{ flex: 0.2 }}>
                                                                        <Text style={[styles.text, { fontWeight: "bold", fontSize: 18 }]}>:</Text>

                                                                    </View>
                                                                </View>
                                                                <View style={{ flex: 0.5, alignItems: "center", justifyContent: 'center' }}>
                                                                    <Text style={[styles.text, { fontWeight: "bold", fontSize: 18 }]}>Working Timings:</Text>
                                                                </View>
                                                            </View>
                                                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-around", marginTop: 20 }}>
                                                                <View style={{ flex: 0.5, alignItems: "center", justifyContent: 'center', flexDirection: "row" }}>
                                                                    <View style={{ flex: 0.8, alignItems: "center", justifyContent: "center" }}>
                                                                        <Text style={[styles.text, { fontWeight: "bold", fontSize: 18 }]}>Sunday</Text>
                                                                    </View>
                                                                    <View style={{ flex: 0.2 }}>
                                                                        <Text style={[styles.text, { fontWeight: "bold", fontSize: 18 }]}>:</Text>

                                                                    </View>
                                                                </View>
                                                                <View style={{ flex: 0.5, alignItems: "center", justifyContent: 'center' }}>
                                                                    {
                                                                        this.getTodayTimings("Sunday",item)
                                                                    }
                                                                </View>
                                                            </View>
                                                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-around", marginTop: 20 }}>
                                                                <View style={{ flex: 0.5, alignItems: "center", justifyContent: 'center', flexDirection: "row" }}>
                                                                    <View style={{ flex: 0.8, alignItems: "center", justifyContent: "center" }}>
                                                                        <Text style={[styles.text, { fontWeight: "bold", fontSize: 18 }]}>Monday</Text>
                                                                    </View>
                                                                    <View style={{ flex: 0.2 }}>
                                                                        <Text style={[styles.text, { fontWeight: "bold", fontSize: 18 }]}>:</Text>

                                                                    </View>
                                                                </View>
                                                                <View style={{ flex: 0.5, alignItems: "center", justifyContent: 'center' }}>
                                                                    {
                                                                        this.getTodayTimings("Monday",item)
                                                                    }
                                                                </View>
                                                            </View>

                                                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-around", marginTop: 20 }}>
                                                                <View style={{ flex: 0.5, alignItems: "center", justifyContent: 'center', flexDirection: "row" }}>
                                                                    <View style={{ flex: 0.8, alignItems: "center", justifyContent: "center" }}>
                                                                        <Text style={[styles.text, { fontWeight: "bold", fontSize: 18 }]}>Tuesday</Text>
                                                                    </View>
                                                                    <View style={{ flex: 0.2 }}>
                                                                        <Text style={[styles.text, { fontWeight: "bold", fontSize: 18 }]}>:</Text>

                                                                    </View>
                                                                </View>
                                                                <View style={{ flex: 0.5, alignItems: "center", justifyContent: 'center' }}>
                                                                    {
                                                                        this.getTodayTimings("Tuesday",item)
                                                                    }
                                                                </View>
                                                            </View>
                                                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-around", marginTop: 20 }}>
                                                                <View style={{ flex: 0.5, alignItems: "center", justifyContent: 'center', flexDirection: "row" }}>
                                                                    <View style={{ flex: 0.8, alignItems: "center", justifyContent: "center" }}>
                                                                        <Text style={[styles.text, { fontWeight: "bold", fontSize: 18 }]}>Wednesday</Text>
                                                                    </View>
                                                                    <View style={{ flex: 0.2 }}>
                                                                        <Text style={[styles.text, { fontWeight: "bold", fontSize: 18 }]}>:</Text>

                                                                    </View>
                                                                </View>
                                                                <View style={{ flex: 0.5, alignItems: "center", justifyContent: 'center' }}>
                                                                    {
                                                                        this.getTodayTimings("Wednesday",item)
                                                                    }
                                                                </View>
                                                            </View>
                                                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-around", marginTop: 20 }}>
                                                                <View style={{ flex: 0.5, alignItems: "center", justifyContent: 'center', flexDirection: "row" }}>
                                                                    <View style={{ flex: 0.8, alignItems: "center", justifyContent: "center" }}>
                                                                        <Text style={[styles.text, { fontWeight: "bold", fontSize: 18 }]}>Thursday</Text>
                                                                    </View>
                                                                    <View style={{ flex: 0.2 }}>
                                                                        <Text style={[styles.text, { fontWeight: "bold", fontSize: 18 }]}>:</Text>

                                                                    </View>
                                                                </View>
                                                                <View style={{ flex: 0.5, alignItems: "center", justifyContent: 'center' }}>
                                                                    {
                                                                        this.getTodayTimings("Thursday",item)
                                                                    }
                                                                </View>
                                                            </View>
                                                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-around", marginTop: 20 }}>
                                                                <View style={{ flex: 0.5, alignItems: "center", justifyContent: 'center', flexDirection: "row" }}>
                                                                    <View style={{ flex: 0.8, alignItems: "center", justifyContent: "center" }}>
                                                                        <Text style={[styles.text, { fontWeight: "bold", fontSize: 18 }]}>Friday</Text>
                                                                    </View>
                                                                    <View style={{ flex: 0.2 }}>
                                                                        <Text style={[styles.text, { fontWeight: "bold", fontSize: 18 }]}>:</Text>

                                                                    </View>
                                                                </View>
                                                                <View style={{ flex: 0.5, alignItems: "center", justifyContent: 'center' }}>
                                                                    {
                                                                        this.getTodayTimings("Friday",item)
                                                                    }
                                                                </View>
                                                            </View>
                                                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-around", marginTop: 20 }}>
                                                                <View style={{ flex: 0.5, alignItems: "center", justifyContent: 'center', flexDirection: "row" }}>
                                                                    <View style={{ flex: 0.8, alignItems: "center", justifyContent: "center" }}>
                                                                        <Text style={[styles.text, { fontWeight: "bold", fontSize: 18 }]}>Saturday</Text>
                                                                    </View>
                                                                    <View style={{ flex: 0.2 }}>
                                                                        <Text style={[styles.text, { fontWeight: "bold", fontSize: 18 }]}>:</Text>

                                                                    </View>
                                                                </View>
                                                                <View style={{ flex: 0.5, alignItems: "center", justifyContent: 'center' }}>
                                                                    {
                                                                        this.getTodayTimings("Saturday",item)
                                                                    }
                                                                </View>
                                                            </View>
                                                             </>
                                                         }
                                                   </View>
                                               
                                            </View>
                                        )
                                    }}
                                />
                            </View>
                          
                          
                         
             
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
        user: state.selectedUser,
    }
}
export default connect(mapStateToProps, { selectTheme })(ViewClinic);