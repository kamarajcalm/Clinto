import React, { Component } from 'react';
import { View, Text, StatusBar, Dimensions, TouchableOpacity, StyleSheet, FlatList, Image, SafeAreaView, ScrollView} from 'react-native';
import settings from '../AppSettings';
import { connect } from 'react-redux';
import { selectTheme } from '../actions';
const { height, width } = Dimensions.get("window");
const deviceHeight =Dimensions.get('screen').height
import { Ionicons } from '@expo/vector-icons';
import authAxios from '../api/authAxios';
const fontFamily = settings.fontFamily;
const themeColor = settings.themeColor;
const url =settings.url;
const date =new Date()
import { Entypo } from '@expo/vector-icons';
import { Linking } from 'react-native';
import { Feather } from '@expo/vector-icons';
import HttpsClient from '../api/HttpsClient';
import Modal from 'react-native-modal';
import Toast from 'react-native-simple-toast';
class ClinicDetails extends Component {
    constructor(props) {
        let item = props.route.params.item
        console.log(item,"cccc")
        super(props);
        this.state = {
            item,
            receptionList:[],
            doctors:[],
            showModal:false,
            deleteDoctor:null,
            deleteDocorIndex:null,
            deleteReceptionIndex:null,
            deleteReceptionist:null,
            showAll:false
        };
    }
    getReceptionList =async()=>{
        let api = `${url}/api/prescription/recopinists/?clinic=${this.state.item.id}`
     console.log(api)
     const data = await HttpsClient.get(api)
     if(data.type=="success"){
         this.setState({ receptionList:data.data})
     }
    }
    backFunction = async (item) => {
        console.log(item, "bbbbbb")
        this.setState({ doctor: item })


    }
    getDoctors =async()=>{
        let api = `${url}/api/prescription/clinicDoctors/?clinic=${this.state.item.id}`
        const data = await HttpsClient.get(api)
        console.log(api,"jjjjj")
        if (data.type == "success") {
            this.setState({ doctors: data.data })
        }
    }
    deleteDoctor = async()=>{
        let api = `${url}/api/prescription/clinicDoctors/${this.state.deleteDoctor.id}/`
        let deletee = await  HttpsClient.delete(api);
        if(deletee.type=="success"){
              this.state.doctors.splice(this.state.deleteDocorIndex,1);
              this.setState({doctors:this.state.doctors})
              Toast.show("deleted Successfully")
              this.setState({showModal:false})
        }else{
            Toast.show("Try again")
        }
        
    }
    deleteReceptionist =async()=>{
        let api = `${url}/api/prescription/recopinists/${this.state.deleteReceptionist.id}/`
        console.log(api,"ppppp")
        let deletee = await HttpsClient.delete(api);
        if (deletee.type == "success") {
            this.state.receptionList.splice(this.state.deleteReceptionIndex, 1);
            this.setState({ receptionList: this.state.receptionList })
            Toast.show("deleted Successfully")
            this.setState({ showModal2: false })
        } else {
            Toast.show("Try again")
        }
    }
    componentDidMount() {
        
        this.getReceptionList();
        this.getDoctors();
        this._unsubscribe = this.props.navigation.addListener('focus', () => {

            this.getReceptionList();
            this.getDoctors();
        });
    }
    getTodayTimings =(item)=>{
      let  days =["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
      let today =days[date.getDay()]

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
                        <View style={{ height: height * 0.1, backgroundColor: themeColor, borderBottomRightRadius: 20, borderBottomLeftRadius: 20, flexDirection: 'row', alignItems: "center" }}>
                            <TouchableOpacity style={{ flex: 0.2, alignItems: "center", justifyContent: 'center' }}
                              onPress={()=>{this.props.navigation.goBack()}}
                            >
                                <Ionicons name="chevron-back-circle" size={30} color="#fff" />
                            </TouchableOpacity>
                            <View style={{ flex: 0.6, alignItems: "center", justifyContent: "center" }}>
                                <Text style={[styles.text, { color: '#fff', fontWeight: 'bold', fontSize: 18 }]}>{this.state.item.companyName}</Text>
                            </View>
                            <TouchableOpacity style={{ flex: 0.2, flexDirection: "row", alignItems: "center", justifyContent: 'center' }}
                                onPress={() => { this.props.navigation.navigate('EditClinicDetails', { clinic: this.state.item }) }}
                            >
                                <Entypo name="back-in-time" size={24} color="#fff" />
                                <Text style={[styles.text, { marginLeft: 10, color: "#fff" }]}>Edit </Text>
                            </TouchableOpacity>
                        </View>
                    
                        
                       <ScrollView style={{flex:1,}}>
                                {/* image */}
                           <View style={{height:height*0.2,width}}>
                                <Image 
                                  style={{height:"100%",width:"100%",resizeMode:"cover",borderRadius:5}}
                                    source={{ uri: this.state.item.displayPicture||"https://t2conline.com/wp-content/uploads/2019/04/thumbnail_Minor_Injury_Walk_In_Clinic1.jpg"}}
                                />
                           </View>
                      
                              {/* Details */}
                              <View style={{flexDirection:"row",marginHorizontal:20,marginTop:10}}>
                                  <View style={{alignItems:"center",justifyContent:"center"}}>
                                    <Text style={[styles.text,{fontWeight:"bold",fontSize:18}]}>Owned By:</Text>
                                  </View>
                                <View style={{alignItems:'center',justifyContent:"center"}}>
                                    <Text style={[styles.text,{marginLeft:10}]}>{this.state?.item?.owner.first_name}</Text>
                                </View>
                              </View>
                            <View style={{ marginHorizontal:20,marginTop:10 }}>
                                <View style={{ }}>
                                    <Text style={[styles.text, { fontWeight: "bold", fontSize: 18 }]}>Address:</Text>
                                </View>
                                <View style={{  marginTop:10}}>
                                    <Text style={[styles.text, { marginLeft: 10 }]}>{this.state?.item?.address}</Text>
                                    <Text style={[styles.text, { marginLeft: 10 }]}>{this.state?.item?.city}</Text>
                                    <Text style={[styles.text, { marginLeft: 10 }]}>{this.state?.item?.state}</Text>
                                    <Text style={[styles.text, { marginLeft: 10 ,fontWeight:"bold"}]}>{this.state?.item?.pincode}</Text>
                                </View>
                             
                            </View>
                            <View style={{ marginHorizontal: 20, marginTop: 10,flexDirection:'row',alignItems:'center',justifyContent:"space-between"}}>
                                <View>
                                    <Text style={[styles.text,{fontWeight:"bold",fontSize:18}]}>OpeningTime:</Text>
                                </View>
                                <View>
                                    <Text style={[styles.text,{fontWeight:"bold",fontSize:18}]}>ClosingTime:</Text>
                                </View>
                            </View>
                            <View style={{ marginHorizontal: 20, marginTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: "space-between" }}>
                                <View>
                                    <View style={{ alignSelf: "flex-start" }}>
                                        <Text style={[styles.text, { fontWeight: "bold", fontSize: 18, color: "gray" }]}>Today:</Text>
                                    </View>

                                    { this.state?.item?.working_hours?.length>0&& <Text style={[styles.text, { fontWeight: "bold", fontSize: 18 }]}>{this.state?.item?.working_hours[date?.getDay()][0]}</Text>}
                                </View>
                                <View>
                                    {this.state?.item?.working_hours?.length > 0&&<Text style={[styles.text, { fontWeight: "bold", fontSize: 18 }]}>{this.state?.item?.working_hours[date?.getDay()][1]}</Text>}
                                </View>
                               
                            </View>
                            <View style={{alignItems:"center",justifyContent:"center"}}>
                                <TouchableOpacity
                                  onPress={()=>{this.setState({showAll:!this.state.showAll})}}
                                >
                                    <Text>{this.state.showAll?"showLess":"showAll"}</Text>
                                </TouchableOpacity>
                            </View>
                            {this.state.showAll && this.state.item.working_hours?.length>0&&
                                    this.state.item.working_hours.map((i,index)=>{
                                     let day= ""
                                     if(i[2]=="0"){
                                         day ="Sun"
                                     }else if(i[2]=="1"){
                                         day ="Mon"
                                     } else if (i[2] == "2") {
                                         day = "Tue"
                                     } else if (i[2] == "3") {
                                         day = "Wed"
                                     } else if (i[2] == "4") {
                                         day = "Thu"
                                     } else if (i[2] == "5") {
                                         day = "Fri"
                                     } else if (i[2] == "6") {
                                         day = "Sat"
                                     }else{
                                         day ==""
                                     }
                                        
                                        return(
                                            <View 
                                             style={{ marginHorizontal: 20, marginTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: "space-between" }}
                                             key ={index}
                                            >
                                                <View>
                                                    <View style={{alignSelf:"flex-start"}}>
                                                        <Text style={[styles.text, { fontWeight: "bold", fontSize: 18,color:"gray" }]}>{day}:</Text>
                                                    </View>
                                                    
                                                    <Text style={[styles.text, { fontWeight: "bold", fontSize: 18 }]}>{i[0]}</Text>
                                                </View>
                                                <View>
                                                    <Text style={[styles.text, { fontWeight: "bold", fontSize: 18 }]}>{i[1]}</Text>
                                                </View>
                                            </View>
                                        )
                                    })
                           }
                                   
                            
                             
                               
                           
                         
                            <View style={{ flexDirection: "row", marginHorizontal: 20, marginTop: 10 }}>
                                <View style={{ alignItems: "center", justifyContent: "center" }}>
                                    <Text style={[styles.text, { fontWeight: "bold", fontSize: 18 }]}>Mobile:</Text>
                                </View>
                                <View style={{ alignItems: 'center', justifyContent: "center" }}>
                                    <Text style={[styles.text, { marginLeft: 10 }]}>{this.state?.item?.mobile}</Text>
                                </View>
                                <TouchableOpacity style={{marginLeft:5,alignItems:"center",justifyContent:"center"}}
                                    onPress={() => {
                                        if (Platform.OS == "android") {
                                            Linking.openURL(`tel:${this.state?.item?.mobile}`)
                                        } else {

                                            Linking.canOpenURL(`telprompt:${this.state?.item?.mobile}`)
                                        }
                                    }}
                                >
                                    <Feather name="phone" size={20} color="black" />
                                </TouchableOpacity>
                            </View>
                            <View style={{ flexDirection: "row", marginHorizontal: 20, marginTop: 10 }}>
                                <View style={{ alignItems: "center", justifyContent: "center" }}>
                                    <Text style={[styles.text, { fontWeight: "bold", fontSize: 18 }]}>Emergency Contact 1</Text>
                                </View>
                                <View style={{ alignItems: 'center', justifyContent: "center" }}>
                                    <Text style={[styles.text, { marginLeft: 10 }]}>{this.state?.item?.firstEmergencyContactNo}</Text>
                                </View>
                                <TouchableOpacity style={{ marginLeft: 5 }} 
                                    onPress={() => {
                                        if (Platform.OS == "android") {
                                            Linking.openURL(`tel:${this.state?.item?.firstEmergencyContactNo}`)
                                        } else {

                                            Linking.canOpenURL(`telprompt:${this.state?.item?.firstEmergencyContactNo}`)
                                        }
                                    }}
                                >
                                    <Feather name="phone" size={20} color="black" />
                                </TouchableOpacity>
                            </View>
                            <View style={{ flexDirection: "row", marginHorizontal: 20, marginTop: 10 }}>
                                <View style={{ alignItems: "center", justifyContent: "center" }}>
                                    <Text style={[styles.text, { fontWeight: "bold", fontSize: 18 }]}>Emergency Contact 2</Text>
                                </View>
                                <View style={{ alignItems: 'center', justifyContent: "center" }}>
                                    <Text style={[styles.text, { marginLeft: 10 }]}>{this.state?.item?.secondEmergencyContactNo}</Text>
                                </View>
                                <TouchableOpacity style={{ marginLeft: 5 }} 
                                    onPress={() => {
                                        if (Platform.OS == "android") {
                                            Linking.openURL(`tel:${this.state?.item?.secondEmergencyContactNo}`)
                                        } else {

                                            Linking.canOpenURL(`telprompt:${this.state?.item?.secondEmergencyContactNo}`)
                                        }
                                    }}
                                >
                                    <Feather name="phone" size={20} color="black" />
                                </TouchableOpacity>
                            </View>
                            <View style={{margin:20}}>
                                <Text style={[styles.text,{fontWeight:"bold",fontSize:18}]}> Receptionist List:</Text>
                                 <FlatList 
                                    data={this.state.receptionList}
                                    keyExtractor={(item,index)=>index.toString()}
                                    renderItem={({item,index})=>{
                                        return(
                                            <TouchableOpacity style={{flexDirection:"row",height:height*0.1,}}
                                                onPress={() => { this.props.navigation.navigate('ReceptionistProfile',{item:item})}}
                                            >
                                                <View style={{alignItems:"center",justifyContent:"center",flex:0.33}}>
                                                    <Image
                                                        source={{ uri: item.user.profile.displayPicture || "https://s3-ap-southeast-1.amazonaws.com/practo-fabric/practices/711061/lotus-multi-speciality-health-care-bangalore-5edf8fe3ef253.jpeg" }}
                                                        style={{ height: 60, width: 60, borderRadius: 30, }}
                                                    />
                                                </View>
                                             
                                                <View style={{alignItems:'center',justifyContent:"center",flex:0.33}}>
                                                    <Text>{item.user.first_name}</Text>
                                                </View>
                                                <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', flex: 0.33}}
                                                    onPress={() => { this.setState({ showModal2: true,deleteReceptionist: item,deleteReceptionIndex:index }) }}
                                                >
                                                    <Entypo name="circle-with-cross" size={24} color={themeColor} />
                                                </TouchableOpacity>
                                            </TouchableOpacity>
                                        )
                                    }}
                                 />
                            </View>
                            <View style={{ margin: 20 }}>
                                <Text style={[styles.text, { fontWeight: "bold", fontSize: 18 }]}> Doctors List:</Text>
                                <FlatList
                                    data={this.state.doctors}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({ item, index }) => {
                                        return (
                                            <TouchableOpacity style={{ flexDirection: "row", marginTop:15 }}
                                              onPress={()=>{
                                                  this.props.navigation.navigate('ViewDoctor',{item,owner:true})
                                              }}
                                            >
                                                <View style={{ alignItems: "center", justifyContent: "center",flex:0.2 }}>
                                                    <Image
                                                        source={{ uri: item.doctor.profile.displayPicture || "https://s3-ap-southeast-1.amazonaws.com/practo-fabric/practices/711061/lotus-multi-speciality-health-care-bangalore-5edf8fe3ef253.jpeg" }}
                                                        style={{ height: 60, width: 60, borderRadius: 30, }}
                                                    />
                                                </View>

                                                <View style={{ alignItems: 'center', justifyContent: "center" ,flex:0.2}}>
                                                    <Text>{item.doctor.first_name}</Text>
                                                </View>
                                                <View style={{flex:0.5, alignItems: 'center', justifyContent: 'center' }}>
                                                    <View >
                                                        <Text style={[styles.text]}>Today Timings:</Text>
                                                    </View>
                                                   {
                                                       this.getTodayTimings(item)
                                                   }
                                                  
                                               </View>
                                                
                                                <TouchableOpacity style={{alignItems:'center',justifyContent:'center',flex:0.1}} 
                                                  onPress={()=>{this.setState({showModal:true,deleteDoctor:item,deleteDocorIndex:index})}}
                                                >
                                                    <Entypo name="circle-with-cross" size={24} color={themeColor} />
                                                </TouchableOpacity>
                                            </TouchableOpacity>
                                        )
                                    }}
                                />
                            </View>
                            <View style={{flexDirection:"row",alignItems:'center',justifyContent:'space-around',height:height*0.2}}>

                            
                            <View style={{ flexDirection: "row", alignItems:'center',justifyContent:"center",marginTop:20}}>
                                <TouchableOpacity style={{height:height*0.05,width:width*0.4,backgroundColor:themeColor,borderRadius:5,alignItems:'center',justifyContent:"center"}}
                                    onPress={() => { this.props.navigation.navigate("CreateReceptionist",{item:this.state.item})}}
                                >
                                    <Text style={[styles.text,{color:"#fff"}]}>Create Receptionist</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ flexDirection: "row", alignItems: 'center', justifyContent: "center", marginTop: 20 }}>
                                <TouchableOpacity style={{ height: height * 0.05, width: width * 0.4, backgroundColor: themeColor, borderRadius: 5, alignItems: 'center', justifyContent: "center" }}
                                        onPress={() => { this.props.navigation.navigate('AddDoctor',{clinic:this.state.item.id}) }}
                                >
                                    <Text style={[styles.text, { color: "#fff" }]}>Add Doctors</Text>
                                </TouchableOpacity>
                            </View>
                            </View>
                       </ScrollView>
                        <View>
                            <Modal
                                deviceHeight={deviceHeight}
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
                                 deviceHeight={deviceHeight}
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
})
const mapStateToProps = (state) => {

    return {
        theme: state.selectedTheme,
        user: state.selectedUser
    }
}
export default connect(mapStateToProps, { selectTheme })(ClinicDetails);
