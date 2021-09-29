import React, { Component } from 'react';
import { View, Text, StatusBar, Dimensions, TouchableOpacity, StyleSheet, FlatList, Image, SafeAreaView, ScrollView } from 'react-native';
import settings from '../AppSettings';
import { connect } from 'react-redux';
import { selectTheme } from '../actions';
const { height, width } = Dimensions.get("window");
import { Ionicons ,AntDesign} from '@expo/vector-icons';
import authAxios from '../api/authAxios';
const fontFamily = settings.fontFamily;
const themeColor = settings.themeColor;
const url = settings.url;
const date = new Date()
import { Entypo,FontAwesome,FontAwesome5 } from '@expo/vector-icons';
import { Linking } from 'react-native';
import { Feather } from '@expo/vector-icons';
import HttpsClient from '../api/HttpsClient';
import Modal from 'react-native-modal';
import { SliderBox } from "react-native-image-slider-box";
const screenHeight = Dimensions.get('screen').height;
   let weekdays =["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";
class ViewClinicDetails extends Component {
    constructor(props) {
        let item = props.route.params.item
        let owner = props?.route?.params?.owner||false
        super(props);
        this.state = {
            item:null,
            receptionList: [],
            doctors: [],
            showModal: false,
            deleteDoctor: null,
            deleteDocorIndex: null,
            deleteReceptionIndex: null,
            deleteReceptionist: null,
            showAll: false,
            pk:item,
            owner,
            images:[]
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
    getReceptionList = async () => {
        let api = `${url}/api/prescription/recopinists/?clinic=${this.state.pk.clinicpk}`
        console.log(api)
        const data = await HttpsClient.get(api)
        if (data.type == "success") {
            this.setState({ receptionList: data.data })
        }
    }
    backFunction = async (item) => {
        console.log(item, "bbbbbb")
        this.setState({ doctor: item })


    }
    getDoctors = async () => {
        let api = `${url}/api/prescription/clinicDoctors/?clinic=${this.state.pk.clinicpk}`
        const data = await HttpsClient.get(api)
        console.log(api, "jjjjj")
        if (data.type == "success") {
            this.setState({ doctors: data.data })
        }
    }
    deleteDoctor = async () => {
        let api = `${url}/api/prescription/clinicDoctors/${this.state.deleteDoctor.id}/`
        let deletee = await HttpsClient.delete(api);
        if (deletee.type == "success") {
            this.state.doctors.splice(this.state.deleteDocorIndex, 1);
            this.setState({ doctors: this.state.doctors })
            this.showSimpleMessage("Deleted SuccessFully","green","success")
            this.setState({ showModal: false })
        } else {
            this.showSimpleMessage("Try Again", "red", "danger")
        }

    }
    deleteReceptionist = async () => {
        let api = `${url}/api/prescription/recopinists/${this.state.deleteReceptionist.id}/`
        let deletee = await HttpsClient.delete(api);
        if (deletee.type == "success") {
            this.state.receptionList.splice(this.state.deleteReceptionIndex, 1);
            this.setState({ receptionList: this.state.receptionList })
            this.showSimpleMessage("Deleted SuccessFully", "green", "success")
            this.setState({ showModal2: false })
        } else {
            this.showSimpleMessage("Try Again", "red", "danger")
        }
    }
    getClinicDetails =async()=>{
        let api = `${url}/api/prescription/clinics/${this.state.pk.clinicpk}/`
        const data =await HttpsClient.get(api)
        console.log(api,"JK")
        if(data.type =="success"){
            this.setState({item:data.data})
        }
    }
    getClinicImages = async()=>{
        let api = `${url}/api/prescription/clinicImages/?clinic=${this.state.pk.clinicpk}`
        console.log(api)
        let data = await HttpsClient.get(api)

        if (data.type == "success") {
            let images = []
            data.data.forEach((item, index) => {
                images.push(`${url}${item.imageUrl}`)
            })
            this.setState({ images }, () => {
                console.log(images)
            })

        }
    }
    componentDidMount() {
        this.getClinicImages()
        this.getClinicDetails()
        this.getReceptionList();
        this.getDoctors();
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.getClinicImages();
            this.getClinicDetails()
            this.getReceptionList();
            this.getDoctors();
        });
    }
    getTodayTimings =(item)=>{
      let  days =["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
      let today =days[date.getDay()]
      console.log(today,"kkkkkk")
      return(
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
    getTodayTimings2 = (item)=>{
         let  days =["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
         let today =days[date.getDay()]
      return(
          item.clinicShifts[today][0].timings.map((i, index) => {
              return (
                 <View 
                key={index}
                style={{ flexDirection: "row",marginTop:5,paddingHorizontal:10}}>
              
              
                     <View style={{flex:1,alignItems:"center",justifyContent:"space-around",flexDirection:"row"}}>
                                <View style={{flex:0.1,alignItems:"center",justifyContent:"center"}}>
                            <Text style={[styles.text,{color:"#000",fontSize:height*0.02}]}>{index+1} .</Text>
                     </View>
                       <View style={{flex:0.4,alignItems:"center",justifyContent:"center"}}>
                              <Text style={[styles.text, { marginLeft: 5,fontSize:height*0.02 }]}>{i[0]}</Text>
                       </View>
                        <View style={{flex:0.2,alignItems:"center",justifyContent:"center"}}>
                            
                        </View> 
                        <View style={{flex:0.4,}}>
                            <Text style={[styles.text,{fontSize:height*0.02}]}>{i[1]}</Text>
                        </View>
    
                   </View>
                
               </View>
              )
          })
      ) 
    }
     getTodayTimings3 = (today,color) => {
    
   return(
       this.state.item.clinicShifts[today][0].timings.map((i, index) => {
           console.log(i,"ppp")
           return (
               <View 
                key={index}
                style={{ flexDirection: "row",marginTop:5,paddingHorizontal:10}}>
              
              
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
         if(this.state?.item?.clinicOpened=="opened"){
             return "green"
         }else{
             return "red"
         }
     }
    componentWillUnmount() {
        this._unsubscribe();
    }
    render() {
        return (
            <>
                <SafeAreaView style={styles.topSafeArea} />
                <SafeAreaView style={styles.bottomSafeArea}>
                    <View style={{ flex: 1, backgroundColor: "#fff" }}>
                        <StatusBar backgroundColor={themeColor} />
                        {/* HEADERS */}
                        <View style={{ height: height * 0.1, backgroundColor: themeColor,flexDirection: 'row', alignItems: "center" }}>
                            <TouchableOpacity style={{ flex: 0.2, alignItems: "center", justifyContent: 'center' }}
                                onPress={() => { this.props.navigation.goBack() }}
                            >
                                <Ionicons name="chevron-back-circle" size={30} color="#fff" />
                            </TouchableOpacity>
                            <View style={{ flex: 0.6, alignItems: "center", justifyContent: "center" }}>
                                <Text style={[styles.text, { color: '#fff', fontWeight: 'bold', fontSize: 18 }]}>{this.state?.item?.companyName}</Text>
                            </View>
                           {this.state.owner&&<TouchableOpacity style={{ flex: 0.2, flexDirection: "row", alignItems: "center", justifyContent: 'center' }}
                                onPress={() => { this.props.navigation.navigate('EditClinicDetails', { clinic: this?.state?.item }) }}
                            >
                                <Entypo name="back-in-time" size={24} color="#fff" />
                                <Text style={[styles.text, { marginLeft: 10, color: "#fff" }]}>Edit </Text>
                            </TouchableOpacity>}
                        </View>


                        <ScrollView style={{ flex: 1, }}>
                            {/* image */}
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

                            {/* Details */}
                            <View style={[styles.boxWithShadow, { height: height * 0.07, width, backgroundColor: "#eee", flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20 }]}>
                                <View>
                                    <Text style={[styles.text]}>Clinic Details</Text>
                                </View>
                              
                            </View>
                             <View style={{ margin: 20 }}>

                                <View style={{flexDirection:"row"}}>
                                    <View>
                                            <Text style={{  fontSize: 18, color: "#000" }}>{this.state?.item?.companyName?.toUpperCase()}</Text>
                                    </View>
                                    <View style={{height:10,width:10,borderRadius:5,marginLeft:10,backgroundColor:this.validateOpen(),marginTop:8}}>
                                        
                                    </View>
                        
                                    <View style={{marginLeft:10,flexDirection:"row"}}>
                                        <View style={{alignItems:"center",justifyContent:"center"}}>
                                                 <Text style={[styles.text,{color:"black"}]}>{this.state?.item?.ratings}</Text>
                                        </View>
                                       <View style={{alignItems:"center",justifyContent:"center",marginLeft:5}}>
                                           <AntDesign name="star" size={24} color="#63BCD2" />
                                       </View>
                                    </View>
                                </View>



                                <View style={{ marginTop: 10 }}>
                                    <View style={{}}>
                                        <Text style={[styles.text]}>{ this.state?.item?.address }</Text>

                                    </View>
                                    <View style={{}}>
                                        <Text style={[styles.text]}>{this.state?.item?.city} - {this.state?.item?.pincode}</Text>

                                    </View>
                                </View>
                                <View style={{ marginTop: 10, flexDirection: "row" ,}}>
                                   <View style={{flex:0.5,flexDirection:"row",alignItems:"center",justifyContent:"space-around"}}>

                                
 
                                    <TouchableOpacity style={[styles.boxWithShadow, { backgroundColor: "#fff", height: 30, width: 30, borderRadius: 15, alignItems: "center", justifyContent: 'center', marginLeft: 10 }]}
                                        onPress={() => {
                                            if (Platform.OS == "android") {
                                                Linking.openURL(`tel:${this.state?.item?.mobile}`)
                                            } else {

                                                Linking.canOpenURL(`telprompt:${this.state?.item?.mobile}`)
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
                                                         <Text style={[styles.text, { }]}> : </Text> 
                                                    </View>
                                                </View>
                                                            <View style={{flex:0.7}}>
                                                  {this.state.item&&
                                            this.getTodayTimings3(item,color)
                                        }
                                         </View>
                                         </View>
                             
                                  
                                     </View>
                                 ) 
                               })
                           
                             }


                            </View>





                           
                           {this.state.owner&& <View>
                            <View style={[styles.boxWithShadow, { height: height * 0.07, width, backgroundColor: "#eee", flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20 }]}>
                                <View>
                                    <Text style={[styles.text]}>Payment Info</Text>
                                </View>
                             
                            </View>
                            <View>
                                <View style={{ flexDirection: "row", marginHorizontal: 20, marginTop: 10 }}>
                                    <View style={{ alignItems: "center", justifyContent: "center" }}>
                                        <Text style={[styles.text, { fontWeight: "bold", fontSize: height*0.02 }]}>Valid Till:</Text>
                                    </View>
                                    <View style={{ alignItems: 'center', justifyContent: "center" }}>
                                        <Text style={[styles.text, { marginLeft: 10 }]}>{this.state?.pk?.validtill.validTill}</Text>
                                    </View>
                                </View>

                                <View style={{alignItems:"center",justifyContent:"center",marginVertical:20}}>
                                    <TouchableOpacity style={{ height: height * 0.04, width: width * 0.3, backgroundColor: themeColor, alignItems: "center", justifyContent: "center"}}
                                            onPress={() => { this.props.navigation.navigate("PaymentPage", { item:this.state.pk }) }}
                                    >
                                         <Text style={[styles.text,{color:"#fff"}]}>Recharge</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            </View>
}
                            <View style={[styles.boxWithShadow,{ height: height * 0.07, width, backgroundColor: "#eee", flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20 ,marginTop:10}]}>
                                <View>
                                    <Text style={[styles.text]}>Reception list:</Text>
                                </View>
                             
                            </View>
                            <View style={{ margin: 20 }}>
                              
                                <FlatList
                                    data={this.state.receptionList}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({ item, index }) => {
                                        return (
                                            <TouchableOpacity style={{ flexDirection: "row", height: height * 0.1, }}
                                              onPress={()=>{this.props.navigation.navigate('ViewReceptionProfile',{item})}}
                                            >
                                                <View style={{ alignItems: "center", justifyContent: "center", flex: 0.33 }}>
                                                    <Image
                                                        source={{ uri: item.user.profile.displayPicture || "https://s3-ap-southeast-1.amazonaws.com/practo-fabric/practices/711061/lotus-multi-speciality-health-care-bangalore-5edf8fe3ef253.jpeg" }}
                                                        style={{ height: 60, width: 60, borderRadius: 30, }}
                                                    />
                                                </View>

                                                <View style={{ alignItems: 'center', justifyContent: "center", flex: 0.33 }}>
                                                    <Text>{item.user.first_name}</Text>
                                                </View>
                                             {this.state.owner&&<TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', flex: 0.33 }}
                                                    onPress={() => { this.setState({ showModal2: true, deleteReceptionist: item, deleteReceptionIndex: index }) }}
                                                >
                                                    <Entypo name="circle-with-cross" size={24} color={themeColor} />
                                                </TouchableOpacity>}
                                            </TouchableOpacity>
                                        )
                                    }}
                                />
                            </View>
                            <View style={[styles.boxWithShadow, { height: height * 0.07, width, backgroundColor: "#eee", flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20 }]}>
                                <View>
                                    <Text style={[styles.text]}>Doctor List:</Text>
                                </View>
                             
                            </View>
                            <View style={{ margin: 20 }}>
                               
                                <FlatList
                                    data={this.state.doctors}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({ item, index }) => {
                                        return (
                                            <TouchableOpacity style={{ flexDirection: "row", marginTop: 15 }}
                                                onPress={() => {
                                                    this.props.navigation.navigate('ViewDoctor', { item ,owner:this.state.owner})
                                                }}
                                            >
                                                <View style={{ alignItems: "center", justifyContent: "center", flex: 0.2 }}>
                                                    <Image
                                                        source={{ uri: item.doctor.profile.displayPicture || "https://s3-ap-southeast-1.amazonaws.com/practo-fabric/practices/711061/lotus-multi-speciality-health-care-bangalore-5edf8fe3ef253.jpeg" }}
                                                        style={{ height:height*0.05, width: height*0.05, borderRadius: height*0.025, }}
                                                    />
                                                </View>

                                                <View style={{ alignItems: 'center', justifyContent: "center", flex: 0.2 }}>
                                                    <Text style={[styles.text,{fontSize:height*0.02}]}>{item.doctor.first_name}</Text>
                                                </View>
                                                <View style={{ flex: 0.5, alignItems: 'center', justifyContent: 'center' }}>
                                                    <View >
                                                        <Text style={[styles.text,{fontSize:height*0.02}]}>Today Timings:</Text>
                                                    </View>
                                                    {
                                                        this.getTodayTimings(item)
                                                    }

                                                </View>

                                               {this.state.owner&& <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', flex: 0.1 }}
                                                    onPress={() => { this.setState({ showModal: true, deleteDoctor: item, deleteDocorIndex: index }) }}
                                                >
                                                    <Entypo name="circle-with-cross" size={24} color={themeColor} />
                                                </TouchableOpacity>}
                                            </TouchableOpacity>
                                        )
                                    }}
                                />
                            </View>
                           {this.state.owner&& 
                           <>
                           <View style={{ flexDirection: "row", alignItems: 'center', justifyContent: 'space-around', height: height * 0.2 }}>


                                <View style={{ flexDirection: "row", alignItems: 'center', justifyContent: "center", marginTop: 20 }}>
                                    <TouchableOpacity style={{ height: height * 0.05, width: width * 0.4, backgroundColor: themeColor, borderRadius: 5, alignItems: 'center', justifyContent: "center" }}
                                        onPress={() => { this.props.navigation.navigate("CreateReceptionist", { item: this.state.item }) }}
                                    >
                                        <Text style={[styles.text, { color: "#fff" }]}>Create Receptionist</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ flexDirection: "row", alignItems: 'center', justifyContent: "center", marginTop: 20 }}>
                                    <TouchableOpacity style={{ height: height * 0.05, width: width * 0.4, backgroundColor: themeColor, borderRadius: 5, alignItems: 'center', justifyContent: "center" }}
                                        onPress={() => { this.props.navigation.navigate('AddDoctor', { clinic: this.state.item.id }) }}
                                    >
                                        <Text style={[styles.text, { color: "#fff" }]}>Add Doctors</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                               <View style={{ flexDirection: "row", alignItems: 'center', justifyContent: "center", marginVertical:10 }}>
                                <TouchableOpacity style={{ height: height * 0.05, width: width * 0.4, backgroundColor: themeColor, borderRadius: 5, alignItems: 'center', justifyContent: "center" }}
                                    onPress={() => { this.props.navigation.navigate('UploadImages',{ clinic: this.state.pk.clinicpk})}}
                                >
                                    <Text style={[styles.text, { color: "#fff" }]}>Add Images</Text>
                                </TouchableOpacity>
                            </View>
                            </>
                            }
                        </ScrollView>
                        <View>
                            <Modal
                                statusBarTranslucent={true}
                                deviceHeight={screenHeight}
                                animationIn="slideInUp"
                                animationOut="slideOutDown"
                                isVisible={this.state.showModal}
                                onBackdropPress={() => { this.setState({ showModal: false }) }}
                            >
                                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                    <View style={{ height: height * 0.3, width: width * 0.9, backgroundColor: "#fff", borderRadius: 20, alignItems: "center", justifyContent: "space-around" }}>
                                        <View>
                                            <Text style={[styles.text, { fontWeight: "bold", color: themeColor, fontSize: 20 }]}>Do you want to Delete?</Text>
                                        </View>
                                        <View style={{ flexDirection: "row", alignItems: 'center', justifyContent: "space-around", width, }}>
                                            <TouchableOpacity style={{ backgroundColor: themeColor, height: height * 0.05, width: width * 0.2, alignItems: "center", justifyContent: 'center', borderRadius: 10 }}
                                                onPress={() => { this.deleteDoctor() }}
                                            >
                                                <Text style={[styles.text, { color: "#fff" }]}>Yes</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={{ backgroundColor: themeColor, height: height * 0.05, width: width * 0.2, alignItems: "center", justifyContent: "center", borderRadius: 10 }}
                                                onPress={() => { this.setState({ showModal: false }) }}
                                            >
                                                <Text style={[styles.text, { color: "#fff" }]}>No</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </Modal>
                            <Modal
                                statusBarTranslucent={true}
                                deviceHeight={screenHeight}
                                animationIn="slideInUp"
                                animationOut="slideOutDown"
                                isVisible={this.state.showModal2}
                                onBackdropPress={() => { this.setState({ showModal2: false }) }}
                            >
                                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                    <View style={{ height: height * 0.3, width: width * 0.9, backgroundColor: "#fff", borderRadius: 20, alignItems: "center", justifyContent: "space-around" }}>
                                        <View>
                                            <Text style={[styles.text, { fontWeight: "bold", color: themeColor, fontSize: 20 }]}>Do you want to Delete?</Text>
                                        </View>
                                        <View style={{ flexDirection: "row", alignItems: 'center', justifyContent: "space-around", width, }}>
                                            <TouchableOpacity style={{ backgroundColor: themeColor, height: height * 0.05, width: width * 0.2, alignItems: "center", justifyContent: 'center', borderRadius: 10 }}
                                                onPress={() => { this.deleteReceptionist() }}
                                            >
                                                <Text style={[styles.text, { color: "#fff" }]}>Yes</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={{ backgroundColor: themeColor, height: height * 0.05, width: width * 0.2, alignItems: "center", justifyContent: "center", borderRadius: 10 }}
                                                onPress={() => { this.setState({ showModal2: false }) }}
                                            >
                                                <Text style={[styles.text, { color: "#fff" }]}>No</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </Modal>
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
        user: state.selectedUser
    }
}
export default connect(mapStateToProps, { selectTheme })(ViewClinicDetails);