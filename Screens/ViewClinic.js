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
 let weekdays =["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
import moment from 'moment-timezone';
import StarRating from 'react-native-star-rating-widget';
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
            selectedDoctor:null,
            images:[]
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
    getClinicImages = async () => {
        let api = `${url}/api/prescription/clinicImages/?clinic=${this.state.item.pk}`
        console.log(api)
        let data = await HttpsClient.get(api)
         console.log(data,"jhkjhkjj")
        if (data.type == "success") {
            let images = []
            data.data.forEach((item, index) => {
                images.push(`${url}${item.imageUrl}`)
            })
            this.setState({ images })

        }
    }
    componentDidMount() {
       console.log(this.state.doctors,"jkjk")
        this.getClinicDetails()
        this.getClinicImages()
        console.log(this.props.user)
    }
    getTodayTimings = (today,item) => {
                 let  days =["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
      let todayy =days[date.getDay()]
      let color;
        return (
            item.clinicShits[today][0].timings.map((i, index) => {
                 if(todayy==today){
                     color="red"
                 }else{
                     color="#000"
                 }
                return (
                    <View
                        key={index}
                        style={{ flexDirection: "row", marginTop: 5 }}>
                        <Text style={[styles.text, { color}]}>{index + 1}.</Text>
                        <Text style={[styles.text, { marginLeft: 5,color }]}>{i[0]}</Text>
                        <Text style={[styles.text,{color}]}>-</Text>
                        <Text style={[styles.text,{color}]}>{i[1]}</Text>
                    </View>
                )
            })
           
        )
    }
    getTodayTimings2 = (item)=>{
         let  days =["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
      let today =days[date.getDay()]
    
  if( item.clinicShits){
       
    return(
          item.clinicShits[today][0].timings.map((i, index) => {
                console.log(i,"hhh")
              return (
                  
                 <View 
                key={index}
                style={{ flexDirection: "row",marginTop:5,paddingHorizontal:5,backgroundColor:"red"}}>
              
              
                     <View style={{flex:1,alignItems:"center",justifyContent:"space-around",flexDirection:"row"}}>
                                <View style={{flex:0.1,alignItems:"center",justifyContent:"center"}}>
                            <Text style={[styles.text,{color:"#000"}]}>{index+1} .</Text>
                     </View>
                       <View style={{flex:0.4,}}>
                              <Text style={[styles.text, { marginLeft: 5 }]}>{i[0]}</Text>
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
    getTodayTimings3 = (today,color) => {
    
   return(
       this.state.clinicDetails?.clinicShifts[today][0].timings.map((i, index) => {
           console.log(i,"ppp")
           return (
               <View 
                key={index}
                style={{ flexDirection: "row",}}>
             
              
                     <View style={{flex:1,alignItems:"center",justifyContent:"space-around",flexDirection:"row"}}>
                                <View style={{flex:0.1,alignItems:"center",justifyContent:"center"}}>
                            <Text style={[styles.text,{color}]}>{index+1} .</Text>
                     </View>
                       <View style={{flex:0.4,alignItems:"center",justifyContent:"center"}}>
                              <Text style={[styles.text, { marginLeft: 5 ,color}]}>{i[0]}</Text>
                       </View>
                        <View style={{flex:0.2,alignItems:"center",justifyContent:"center"}}>
                             
                        </View> 
                        <View style={{flex:0.4,}}>
                            <Text style={[styles.text,{color}]}>{i[1]}</Text>
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
    // validateOpen =()=>{
    //     if(this.getOpened()=="open"){
    //         return(
    //             <View style={{flexDirection:'row',}}>
    //                 <View style={{alignItems:"center",justifyContent:"center"}}> 
    //                     <Text style={[styles.text, { color: "green" }]}>Open</Text>

    //                 </View>
    //                 <TouchableOpacity style={{alignItems:"center",justifyContent:"center",flexDirection:"row"}}
    //                     onPress={() => { this.setState({ showAll: !this.state.showAll }) }}
    //                 >
    //                     <Text style={[styles.text, { marginLeft: 10 }]}>closes at {this.state.clinicDetails?.working_hours[date.getDay()][1]}</Text>
    //                     <View style={{ alignItems: "center", justifyContent: "center", marginTop: 3 }}>
    //                         <AntDesign name={this.state.showAll ? "up" : "down"} size={15} color="black" />
    //                     </View>
                      
    //                 </TouchableOpacity>
    //             </View>
                
    //         )
    //     }else{
    //         return (
    //             <View style={{flexDirection:"row",}}>
    //                 <View style={{alignItems:"center",justifyContent:"center"}}>
    //                     <Text style={[styles.text, { fontSize: 18, color: "red" }]}>Closed</Text>

    //                 </View>
    //                 <TouchableOpacity style={{alignItems:"center",justifyContent:"center",flexDirection:"row"}}
    //                     onPress={() => { this.setState({ showAll: !this.state.showAll }) }}
    //                 >
    //                     <Text style={[styles.text, { marginLeft: 10 }]}>opens at {this.state?.clinicDetails?.working_hours[date.getDay() + 1][0]} {this.getDay(date.getDay() + 1)}</Text>
    //                     <View style={{alignItems:"center",justifyContent:"center",marginTop:3}}>
    //                         <AntDesign name={this.state.showAll ? "up" : "down"} size={15} color="black" />
    //                     </View>
 
    //                 </TouchableOpacity>
    //             </View>
               
            
    //         )
    //     }
    // }
    getTitle =()=>{
        if(this.state.item.type=="Lab"){
            return "Diagnosis Center"
        }
        if(this.state.item.type=="MedicalStore"){
            return "Pharmacy"
        }
        return "Clinic"
    }
    render() {
        let dp =null
        if (this.state.item.displayPicture){
            dp = `${this.state.item.displayPicture}`
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
                                <Text style={[styles.text, { color: "#fff",  fontSize: 20 }]}> {this.getTitle()} </Text>
                            </View>
                            <View style={{ flex: 0.2, alignItems: "center", justifyContent: "center" }}>
                            </View>
                        </View>

                        <ScrollView 
                          showsVerticalScrollIndicator={false}
                          contentContainerStyle={{paddingBottom:90}}
                        >
                            <View style={{ height: height * 0.25, }}>
                                <SliderBox
                                    images={this.state.images}
                                    dotColor={themeColor}
                                    imageLoadingColor={themeColor}
                                    ImageComponentStyle={{ height: "100%", width: "100%", resizeMode: "cover" }}
                                    autoplay={true}
                                    circleLoop={true}
                                />
                            </View>
                       {/* Clinic Details */}
                            <View style={{ margin: 20 }}>

                                <View style={{flexDirection:"row"}}>
                                    <View>
                                            <Text style={{  fontSize: 18, color: "#000" }}>{this.state.item.title.toUpperCase()}</Text>
                                    </View>
                                    <View style={{height:10,width:10,borderRadius:5,marginLeft:10,backgroundColor:this.validateOpen(),marginTop:8}}>
                                        
                                    </View>
                        
                                    <View style={{marginLeft:10,flexDirection:"row"}}>
                                        <View style={{alignItems:"center",justifyContent:"center"}}>
                                                 <Text style={[styles.text,{color:"black"}]}>{this.state?.clinicDetails?.ratings}</Text>
                                        </View>
                                       <View style={{alignItems:"center",justifyContent:"center",marginLeft:5}}>
                                           <AntDesign name="star" size={24} color="#63BCD2" />
                                       </View>
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
                               {this.state.item.type!="MedicalStore"   &&  <View style={{ alignItems: "center", justifyContent: 'center',flex:0.5 }}>
                                        <TouchableOpacity style={{ height: height * 0.05, width: width * 0.4, backgroundColor: themeColor, borderRadius: 10, alignItems: "center", justifyContent: "center", flexDirection: "row" }}
                                            onPress={() => { this.props.navigation.navigate('makeAppointmentClinic', { item: this.state.item, }) }}
                                        >
                                            <Text style={[styles.text, { color: "#fff" }]}>Book Appointment</Text>


                                        </TouchableOpacity>
                                    </View>}
                                </View>
                            </View>

                                           {/* clinic Timings */}
               
                            <View style={{ padding: 10, }}>
                                
              
                               <View style={{flexDirection:"row"}}>
                                   <View style={{flex:0.3}}>

                                   </View>
                                          <View style={{flex:0.7,flexDirection:"row"}}>

                                    <View style={{flex:0.5,alignItems:"center",justifyContent:"center"}}>
                                                <Text style={[styles.text,{color:"#000"}]}>Open</Text>
                                            </View>
                                            <View style={{flex:0.5,alignItems:"center",justifyContent:"center"}}>
                                                <Text style={[styles.text,{color:"#000"}]}>Close</Text>
                                            </View>  
                               </View>
                               </View>
                        
                                         {
                               weekdays.map((item)=>{
                                     let today =weekdays[date.getDay()]
                                     let color = item==today?"red":"#000"
                                 return (
                                     <View style={{marginTop:15}}>
                                         <View style={{flexDirection:"row"}}>
                                                <View style={{flex:0.3,alignItems:"center",justifyContent:"center",flexDirection:"row"}}>
                                                    <View style={{flex:0.8,alignItems:"center",justifyContent:"center"}}>
                                                                      <Text style={[styles.text, { color}]}>{item}  </Text>
                                                    </View>
                                                    <View style={{alignItems:"center",justifyContent:"center"}}>
                                                         <Text style={[styles.text, { color}]}> : </Text> 
                                                    </View>
                                                </View>
                                                            <View style={{flex:0.7}}>
                                                  {this.state.clinicDetails&&
                                            this.getTodayTimings3(item,color)
                                        }
                                         </View>
                                         </View>
                             
                                  
                                     </View>
                                 ) 
                               })
                           
                             }


                            </View>
                      { this.state.doctors.length>0&&  <>
                            <View style={[styles.boxWithShadow, { height: height * 0.07, width, backgroundColor: "#eee", flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20 }]}>
                                <View>
                                    <Text style={[styles.text]}>Doctors List</Text>
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
                                                   
                                                    <View style={{ justifyContent: "center", flex: 0.2 ,alignItems:"center"}}>
                                                       <Image 
                                                         style ={{height:60,width:60,borderRadius:30}}
                                                            source={{ uri: item.doctor.profile.displayPicture}}
                                                       />
                                                    </View>
                                                    <TouchableOpacity style={{flex:0.8,flexDirection:"row",alignItems:"center",paddingLeft:20}}
                                                    onPress={() => this.setState({ showAllDoctorTimings:!this.state.showAllDoctorTimings,selectedDoctor:item})}
                                                    >
                                                            <View>
                                                            <Text style={[styles.text,{color:"#000"}]}>{item.doctor.first_name}</Text>
                                                            </View>
                                                            <View style={{marginLeft:10}}>
                                                            <Text style={[styles.text, {  }]}>( {item.doctor.profile.specialization} )</Text>
                                                            </View>
                                                            <View style={{marginLeft:10}}>
                                                                  <Ionicons name={`${this.state.showAllDoctorTimings&&this.state.selectedDoctor==item?"chevron-up-outline":"chevron-down-outline"}`} size={20} color="black" />
                                                            </View>
                                                    </TouchableOpacity>
                                                    {/* <View style={{ flex: 0.4, alignItems: 'center', justifyContent: 'center' }}>
                                                        <View >
                                                            <Text style={[styles.text,]}>Today Timings:</Text>
                                                        </View>
                                                        {
                                                            this.getTodayTimings2(item)
                                                        }

                                                    </View> */}
                                               </View>
                                                        {/* Show all timings... */}
                                               
                                                   <View >
                                               
                                                         {
                                                        this.state.showAllDoctorTimings&&this.state.selectedDoctor==item&&
                                                             <>
                                                           
                                                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-around", marginTop: 20 }}>
                                                                <View style={{ flex: 0.5, alignItems: "center", justifyContent: 'center', flexDirection: "row" }}>
                                                                    <View style={{ flex: 0.8, alignItems: "center", justifyContent: "center" }}>
                                                                        <Text style={[styles.text, {  fontSize: height*0.025,color:"#000"}]}>Day</Text>
                                                                    </View>
                                                                    <View style={{ flex: 0.2 }}>
                                                                        <Text style={[styles.text, {  fontSize: height*0.025}]}>:</Text>

                                                                    </View>
                                                                </View>
                                                                <View style={{ flex: 0.5, alignItems: "center", justifyContent: 'center' }}>
                                                                    <Text style={[styles.text, {  fontSize: height*0.025,color:"#000"}]}>Working Timings:</Text>
                                                                </View>
                                                            </View>
                                                            {
                                                                weekdays.map((day,index)=>{
                                                                    let color;
                                                                  if( day==weekdays[date.getDay()]){
                                                                      color="red"
                                                                  }else{
                                                                            color="#000"  
                                                                  }
                                                                 
                                                                        return(
                                                                                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-around", marginTop: 20 }}>
                                                                <View style={{ flex: 0.5, alignItems: "center", justifyContent: 'center', flexDirection: "row" }}>
                                                                    <View style={{ flex: 0.8, alignItems: "center", justifyContent: "center" }}>
                                                                        <Text style={[styles.text, {  fontSize: height*0.02,color}]}>{day}</Text>
                                                                    </View>
                                                                    <View style={{ flex: 0.2 }}>
                                                                        <Text style={[styles.text, {  fontSize: height*0.02,color}]}>:</Text>

                                                                    </View>
                                                                </View>
                                                                <View style={{ flex: 0.5, alignItems: "center", justifyContent: 'center' }}>
                                                                    {
                                                                        this.getTodayTimings(day,item)
                                                                    }
                                                                </View>
                                                            </View>
                                                                        )
                                                                })
                                                            }
                                                    
                             
                                                             </>
                                                         }
                                                   </View>
                                               
                                            </View>
                                        )
                                    }}
                                />
                            </View>
                            </>}
                          
                         
             
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