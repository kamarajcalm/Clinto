import React, { Component } from 'react';
import { View, Text, Dimensions, TouchableOpacity, StyleSheet, TextInput, FlatList, Image, SafeAreaView, ScrollView, Linking } from 'react-native';
import { Ionicons, Entypo, AntDesign, MaterialIcons, FontAwesome5,FontAwesome } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { selectTheme } from '../actions';
import settings from '../AppSettings';
import medicine from '../components/Medicine';
import Medicine from '../components/Medicine';
import HttpsClient from '../api/HttpsClient';
const { height, width } = Dimensions.get("window");
const fontFamily = settings.fontFamily;
const themeColor = settings.themeColor;
const url = settings.url;
import moment from 'moment-timezone';
const date = new Date();
const day = date.getDay();
 let weekdays =["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
class ViewMedicals extends Component {
    constructor(props) {
        let item = props.route.params.item

        super(props);
        this.state = {
            item,
            clinicDetails: null,
            showAll: false,
            doctors: [],
            showAllDoctorTimings: false,
            selectedDoctor: null
        };
    }
    
    getClinicDetails = async () => {
        const api = `${url}/api/prescription/clinics/${this.state.item.pk}/`
        console.log(api)
        const data = await HttpsClient.get(api)
        if (data.type == "success") {
            this.setState({ clinicDetails: data.data })
      
        }
    }
    componentDidMount() {
     
        this.getClinicDetails()
        console.log(this.props.user)
    }
    getTodayTimings = (today, item) => {
        return (
            item.clinicShits[today].map((i, index) => {
                return (
                    <View style={{ flexDirection: "row", marginTop: 5 }}>
                        <Text style={[styles.text, { fontWeight: "bold" }]}>{index + 1}.</Text>
                        <Text style={[styles.text, { marginLeft: 5 }]}>{i.timings[0][0]}</Text>
                        <Text style={[styles.text]}>-</Text>
                        <Text style={[styles.text]}>{i.timings[0][1]}</Text>
                    </View>
                )
            })
        )
    }
    getTodayTimings2 = (item)=>{
         let  days =["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
      let today =days[date.getDay()]
  if( item.clinicShifts){
    return(
          item.clinicShifts[today][0].timings.map((i, index) => {
                console.log(i,"hhh")
              return (
                  
                 <View 
                key={index}
                style={{ flexDirection: "row",marginTop:5,paddingHorizontal:10}}>
              
              
                     <View style={{flex:1,alignItems:"center",justifyContent:"space-around",flexDirection:"row"}}>
                                <View style={{flex:0.1,alignItems:"center",justifyContent:"center"}}>
                            <Text style={[styles.text,{color:"#000"}]}>{index+1} .</Text>
                     </View>
                       <View style={{flex:0.4,alignItems:"center",justifyContent:"center"}}>
                              <Text style={[styles.text, { marginLeft: 5 }]}>{i[0]}</Text>
                       </View>
                        <View style={{flex:0.2,alignItems:"center",justifyContent:"center"}}>
                            
                        </View> 
                        <View style={{flex:0.4,}}>
                            <Text style={[styles.text]}>{i[1]}</Text>
                        </View>
    
                   </View>
                
               </View>
              )
          })
      ) 
  }else{
     return(
         <View style={{alignItems:"center",justifyContent:"center"}}>
             <Text>No Timings Updated</Text>
         </View>
     )
  }

      
    }
    chatClinic = async () => {
        let api = `${url}/api/prescription/createClinicChat/?clinic=${this.state.item.pk}&customer=${this.props.user.id}`

        let data = await HttpsClient.get(api)


        if (data.type == "success") {
            this.props.navigation.navigate('Chat', { item: data.data })
        }
    }
    getOpened = (openTime = this.state?.clinicDetails?.working_hours[date.getDay()][0], closeTime = this.state?.clinicDetails?.working_hours[date.getDay()][1], timezone = "Asia/Kolkata") => {



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
        console.log(openTime, closeTime, check, "kkk")
        return check ? "open" : "closed";
    }
           getTodayTimings3 = (today) => {
    
   return(
       this.state.clinicDetails?.clinicShifts[today][0].timings.map((i, index) => {
           console.log(i,"ppp")
           return (
               <View 
                key={index}
                style={{ flexDirection: "row",marginTop:5,paddingHorizontal:10}}>
              
              
                     <View style={{flex:1,alignItems:"center",justifyContent:"space-around",flexDirection:"row"}}>
                                <View style={{flex:0.1,alignItems:"center",justifyContent:"center"}}>
                            <Text style={[styles.text,{color:"#000"}]}>{index+1} .</Text>
                     </View>
                       <View style={{flex:0.4,alignItems:"center",justifyContent:"center"}}>
                              <Text style={[styles.text, { marginLeft: 5 }]}>{i[0]}</Text>
                       </View>
                        <View style={{flex:0.2,alignItems:"center",justifyContent:"center"}}>
                             
                        </View> 
                        <View style={{flex:0.4,}}>
                            <Text style={[styles.text]}>{i[1]}</Text>
                        </View>
    
                   </View>
                
               </View>
           )
       })
   )
       
       



    }
         validateOpen = ()=>{
         if(this.state?.clinicDetails?.clinicOpened=="opened"){
             return "green"
         }else{
             return "red"
         }
     }
    getDay = (day) => {

        let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
        return days[day]

    }
   
    render() {
        let dp = null
        if (this.state.item.displayPicture) {
            dp = `${url}${this.state.item.displayPicture}`
        }



        return (
            <>
                <SafeAreaView style={styles.topSafeArea} />
                <SafeAreaView style={styles.bottomSafeArea}>
                    <View style={{ flex: 1 }}>
                        {/* HEADERS */}
                        <View style={{ height: height * 0.1, backgroundColor: themeColor, borderBottomRightRadius: 20, borderBottomLeftRadius: 20, flexDirection: 'row', alignItems: "center" }}>
                            <TouchableOpacity style={{ flex: 0.2, alignItems: "center", justifyContent: 'center' }}
                                onPress={() => { this.props.navigation.goBack() }}
                            >
                                <Ionicons name="chevron-back-circle" size={30} color="#fff" />
                            </TouchableOpacity>
                            <View style={{ flex: 0.6, alignItems: "center", justifyContent: "center" }}>
                                <Text style={[styles.text, { color: "#fff", fontWeight: "bold", fontSize: 20 }]}> {this.state.item.title.toUpperCase()}</Text>
                            </View>
                            <View style={{ flex: 0.2, alignItems: "center", justifyContent: "center" }}>
                            </View>
                        </View>

                        <ScrollView
                            style={{}}
                            contentContainerStyle={{ paddingBottom: 150 }}
                        >
                            <Image
                                style={{ height: height * 0.2, resizeMode: "cover" }}
                                source={{ uri: dp }}
                            />
                                          <View style={{ margin: 20 }}>

                                <View style={{flexDirection:"row"}}>
                                    <View>
                                            <Text style={{ fontWeight: "bold", fontSize: 18, color: "#000" }}>{this.state.item.title.toUpperCase()}</Text>
                                    </View>
                                    <View style={{height:10,width:10,borderRadius:5,marginLeft:10,backgroundColor:this.validateOpen(),marginTop:8}}>
                                        
                                    </View>
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
                                 
                                </View>
                            </View>
                            <View style={{ padding: 10, }}>
                                        <View style={{ marginHorizontal: 20, marginTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: "space-between" }}>
                                <View>
                                    <Text style={[styles.text, { color:"#000", fontSize: 18 }]}>Opening Time:</Text>
                                </View>
                                <View>
                                    <Text style={[styles.text, { color:"#000", fontSize: 18 }]}>Closing Time:</Text>
                                </View>
                            </View>
                            <View style={{ marginHorizontal: 20, marginTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: "space-between" }}>
                                <View>
                                    <View style={{ alignSelf: "flex-start" }}>
                                        <Text style={[styles.text, {color:"#000",fontSize: 18,}]}>Today:</Text>
                                    </View>

                                   
                                </View>

                            </View>
                             <View style={{}}>
                                    {this.state.clinicDetails&&
                                         this.getTodayTimings2(this.state.clinicDetails)
                                      }
                               
                            </View>
                            <View style={{ alignItems: "center", justifyContent: "center" }}>
                                <TouchableOpacity
                                    onPress={() => { this.setState({ showAll: !this.state.showAll }) }}
                                >
                                    <Text style={[styles.text,{color:"#000"}]}>{this.state.showAll ? "show Less" : "show All"}</Text>
                                </TouchableOpacity>
                            </View>
                   

                                          {this.state.showAll&&
                               weekdays.map((item)=>{
                                 return (
                                     <View style={{marginTop:5}}>
                                         <View style={{alignItems:"center",justifyContent:"center"}}>
                                                 <Text style={[styles.text, { fontWeight: "bold" }]}>{item} : </Text>
                                         </View>
                                         <View style={{}}>
                                                  {this.state.clinicDetails&&
                                            this.getTodayTimings3(item)
                                        }
                                         </View>
                                  
                                     </View>
                                 ) 
                               })
                           
                             }
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
export default connect(mapStateToProps, { selectTheme })(ViewMedicals);