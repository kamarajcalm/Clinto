
import React, { Component } from 'react';
import { View, Text, Dimensions, TouchableOpacity, StyleSheet, TextInput, FlatList, Image, SafeAreaView, Linking, ScrollView} from 'react-native';
import { Ionicons, Entypo, AntDesign, FontAwesome5, FontAwesome} from '@expo/vector-icons';
import { connect } from 'react-redux';
import { selectTheme } from '../actions';
import settings from '../AppSettings';
import medicine from '../components/Medicine';
import Medicine from '../components/Medicine';
import HttpsClient from '../api/HttpsClient';
import { SliderBox } from "react-native-image-slider-box";
const { height, width } = Dimensions.get("window");
const fontFamily = settings.fontFamily;
const themeColor = settings.themeColor;
const url = settings.url;
const images = [
    "https://source.unsplash.com/1024x768/?nature",
    "https://source.unsplash.com/1024x768/?water",
    "https://source.unsplash.com/1024x768/?girl",
    "https://source.unsplash.com/1024x768/?tree",
]
class ViewAppointments extends Component {
    constructor(props) {
        super(props);
        let item =this.props.route.params.item
        console.log(item)
        this.state = {
            item
        };
    }
    getCall = () => {
        if (Platform.OS == "android") {
            Linking.openURL(`tel:${this.state.item?.patientname?.mobile}`)
        } else {

            Linking.canOpenURL(`telprompt:${this.state.item?.patientname?.mobile}`)
        }
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
    getDirections =(item)=>{
        
        Linking.openURL(
            `https://www.google.com/maps/dir/?api=1&destination=` +
            this.state.item?.clinicname.lat+
            `,` +
            this.state.item?.clinicname.long+
            `&travelmode=driving`
        );
    }
    chatClinic = async () => {
        let api = `${url}/api/prescription/createClinicChat/?clinic=${this.state.item.clinic}&customer=${this.props.user.id}`

        let data = await HttpsClient.get(api)
       console.log(data)

        if (data.type == "success") {
            this.props.navigation.navigate('Chat', { item: data.data })
        }
    }
    chatDoctor =async ()=>{
        let api = `${url}/api/prescription/createDoctorChat/?doctor=${this.state.item.doctor}&customer=${this.props.user.id}`
        let data = await HttpsClient.get(api)
        console.log(data)
        if (data.type == "success") {
            this.props.navigation.navigate('Chat', { item: data.data })
        }
    }
    render() {
         let dp =null
        if (this.state.item.doctordetails.dp){
            dp = `${url}${this.state.item.doctordetails.dp}`
        }
        console.log(this.state.item)
        return (
            <>
                <SafeAreaView style={styles.topSafeArea} />
                <SafeAreaView style={styles.bottomSafeArea}>
                                  {/* HEADERS */}
                    <View style={{ height: height * 0.1, backgroundColor: themeColor, borderBottomRightRadius: 20, borderBottomLeftRadius: 20, flexDirection: 'row', alignItems: "center" }}>
                        <TouchableOpacity style={{ flex: 0.2, alignItems: "center", justifyContent: 'center' }}
                            onPress={() => { this.props.navigation.goBack() }}
                        >
                            <Ionicons name="chevron-back-circle" size={30} color="#fff" />
                        </TouchableOpacity>
                        <View style={{ flex: 0.7, }}>
                            <Text style={[styles.text, { color: "#fff", fontSize: 24, fontWeight: 'bold'}]}> Appointment Details</Text>
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

                      <View style={{margin:20}}>
                   
                              <View>
                                    <Text style={{ fontWeight: "bold", fontSize: 18 ,color:"#000"}}>{this.state.item.clinicname.name}</Text>
                              </View>
                            
                            
                          
                          <View style={{marginTop:10}}>
                                <View style={{}}>
                                    <Text>{"address"}</Text>

                                </View>
                                <View style={{}}>
                                    <Text>{"city"} - 76768</Text>

                                </View>
                          </View>
                            <View style={{ marginTop: 10 ,flexDirection:"row"}}>
                             
                                    <TouchableOpacity style={[styles.boxWithShadow, { backgroundColor: "#fff", height: 30, width: 30, borderRadius: 15, alignItems: "center", justifyContent: 'center' }]}
                                    onPress={() => { this.chatClinic() }}
                                    >
                                    <Ionicons name="md-chatbox" size={20} color="#63BCD2" />
                                    </TouchableOpacity>
                                <TouchableOpacity style={[styles.boxWithShadow, { backgroundColor: "#fff", height: 30, width: 30, borderRadius: 15, alignItems: "center", justifyContent: 'center' ,marginLeft:10}]}
                                        onPress={() => { this.getCall()  }}
                                >
                                    <FontAwesome name="phone" size={20} color="#63BCD2"  />
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.boxWithShadow, { backgroundColor: "#fff", height: 30, width: 30, borderRadius: 15, alignItems: "center", justifyContent: 'center', marginLeft: 10}]}
                                    onPress={() => {
                                        this.getDirections(this.state.item)
                                    }}
                                >
                                    <FontAwesome5 name="directions" size={20} color="#63BCD2"  />
                                </TouchableOpacity>
                               
                            </View>
                      </View>
                       
                        {/* Appointment Details */}
                        <View style={[styles.boxWithShadow,{height:height*0.07,width,backgroundColor:"#eee",flexDirection:"row",alignItems:"center",justifyContent:"space-between",paddingHorizontal:20}]}>
                              <View>
                                   <Text style={[styles.text]}>Appoinment Details</Text>
                              </View>
                              <View>
                                  <AntDesign name="down" size={20} color="black" />
                              </View>
                        </View>
                        <View style={{margin:20}}>
                            <View >
                               <Text style={[styles.text]}>Doctor</Text>
                            </View>
                            <View style={{flexDirection:"row",height:height*0.1}}>
                                    <View style={{flex:0.3,marginTop:5}}>
                                        <Image 
                                           style={{height:60,width:60,borderRadius:30,resizeMode:"cover"}}
                                           source ={{uri:dp}}
                                        />
                                    </View>
                                <View style={{ flex: 0.7 ,justifyContent:"center",flexDirection:"row"}}>
                                    <View style={{flex:0.7,justifyContent:"center"}}>
                                        <View>
                                            <Text style={[styles.text]}>{this.state.item.doctordetails.name}</Text>
                                        </View>
                                        <View>
                                            <Text style={[styles.text]}>specialization</Text>
                                        </View>
                                    </View>
                                    <View style={{flex:0.3,alignItems:"center",justifyContent:"center"}}>
                                        <TouchableOpacity style={[styles.boxWithShadow, { backgroundColor: "#fff", height: 30, width: 30, borderRadius: 15, alignItems: "center", justifyContent: 'center' }]}
                                            onPress={() => { this.chatDoctor()}}
                                        >
                                            <Ionicons name="md-chatbox" size={20} color="#63BCD2" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={{marginHorizontal:20}}>
                            <View style={{flexDirection:"row"}}>
                                <Text style={[styles.text]}>Appointment Status:</Text>
                                <Text style={[styles.text, { marginLeft: 10, color: this.validateColor(this.state.item.status)}]}>{this.state.item.status}</Text>
                            </View>
                            <View style={{marginTop:10}}>
                                <View>
                                        <Text>Requested date & time</Text>
                                </View>
                                <View style={{flexDirection:"row",marginTop:10}}>
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
                    </ScrollView>
                </SafeAreaView>
             
               
               {this.state.item.status=="Completed"&& <View style={{ alignItems: 'center', justifyContent: 'center', position: "absolute", bottom: 20, width }}>
                    <TouchableOpacity style={{ height: height * 0.05, width: width * 0.4, alignItems: 'center', justifyContent: "center", borderRadius: 10, backgroundColor: themeColor }}
                        onPress={() => { this.props.navigation.navigate('PrescriptionView', { pk: this.state.item.prescription }) }}
                        // onPress={() => { this.props.navigation.navigate('ViewPriscription', { pk: this.state.item.prescription})}}
                    >
                        <Text style={[styles.text, { color: "#fff" }]}>Show Prescription</Text>
                    </TouchableOpacity>
                </View>}
            </>
        );
    }
}
const styles = StyleSheet.create({
    text: {
        fontFamily
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
        user:state.selectedUser
    }
}
export default connect(mapStateToProps, { selectTheme })(ViewAppointments);