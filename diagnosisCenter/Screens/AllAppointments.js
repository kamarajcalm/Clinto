import React, { Component } from 'react';
import { View, Text, Dimensions, TouchableOpacity, StyleSheet, TextInput, FlatList, Image, SafeAreaView, StatusBar,ActivityIndicator } from 'react-native';
import { Ionicons, Entypo, AntDesign } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { selectTheme } from '../../actions';
import settings from '../../AppSettings';
const { height, width } = Dimensions.get("window");
const fontFamily = settings.fontFamily;
const themeColor = settings.themeColor;
import axios from 'axios';
import moment from 'moment';
import HttpsClient from '../../api/HttpsClient';
import { LinearGradient } from 'expo-linear-gradient';
const url = settings.url;

class AllAppointments extends Component {
    constructor(props) {
        super(props);
        this.state = {
           appoinments:[],
           offset:0,
           refreshing:false,
           next:true
        };
    }
    getAppointments = async()=>{
         let  api = `${url}/api/prescription/appointments/?clinic=${this.props.clinic.clinicpk}&date=${moment(this.props.date).format("YYYY-MM-DD")}&limit=5&offset=${this.state.offset}`
        console.log(api)
                const data = await HttpsClient.get(api)
      
        if (data.type == "success") {
       

            this.setState({ appoinments:this.state.appoinments.concat(data.data.results),refreshing:false})
            if (data.data.next != null) {
                this.setState({ next: true })
            } else {
                this.setState({ next: false })
            }
        }else{
            this.setState({fetching:false})
        }
        }
   componentDidMount(){
      this.getAppointments()
      this._unsubscribe = this.props.navigation.addListener('focus', () => {
              this.setState({offset:0,appoinments:[]},()=>{
                    this.getAppointments()
              })
              
        });
   }
    viewAppointments =(item)=>{
   
        return this.props.navigation.navigate('ViewAppointmentDoctors',{item})
    }
   componentWillUnmount(){
       this._unsubscribe();
   }
   componentDidUpdate(prevProps,prevState){
     if(prevProps.date!=this.props.date){
         this.setState({offset:0,appoinments:[]},()=>{
            this.getAppointments()
    
         })
 
     }
   }
    validateInformation =(item)=>{
        
        if (item?.status == "Pending" || item?.status == "Rejected") {
            return(
                <View style={{marginTop:10}}>
                    <Text style={[styles.text]}>{item.requestedtime}</Text>
                </View>
            )
    }
        if (item?.status == "Accepted") {
            return (
                <View style={{ marginTop: 10 }}>
                    <Text style={[styles.text]}>{item.acceptedtime}</Text>
                </View>
            )
        }
        if (item?.status == "Completed") {
            return (
                <View style={{ marginTop: 10 }}>
                    <Text style={[styles.text]}>{item.acceptedtime}</Text>
                </View>
            )
        }
    }
    refresh =()=>{
        this.setState({offset:0,appoinments:[]},()=>{
            this.getAppointments()
        })
    }
    handleEndReached =()=>{
        if(this.state.next){
            this.setState({offset:this.state.offset+5},()=>{
                this.getAppointments()
            })
        }
        return
    }
        validateColor =(status)=>{
        if(status =="Completed"){
            return "green"
        }
        if (status == "Accepted") {
            return "#63BCD2"
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
        getFirstLetter =(item ,patient=null)=>{
            if(patient){
                let name = item.patientname.name.split("")
                return name[0].toUpperCase()
            }
       
           let clinicName = item?.clinicname?.name.split("")
  
            return clinicName[0].toUpperCase();
        
     
    }
        chatwithCustomer= async (item) => {
        let api = null
        if (this.props.user.profile.occupation == "Doctor") {
            api = `${url}/api/prescription/createDoctorChat/?doctor=${this.props.user.id}&customer=${item.requesteduser}`
        }else{
            api = `${url}/api/prescription/createClinicChat/?clinic=${item.clinic}&customer=${item.requesteduser}`
        }

        let data = await HttpsClient.get(api)
        console.log(data, "kkk")
        if (data.type == "success") {
            this.props.navigation.navigate('Chat', { item: data.data })
        }
    }
    render() {
        return (
            <>
                <SafeAreaView style={styles.topSafeArea} />
                <SafeAreaView style={styles.bottomSafeArea}>
                 <StatusBar backgroundColor={themeColor} barStyle={"default"} />

                    <FlatList 
                        contentContainerStyle={{paddingBottom:150}}
                       onEndReached={()=>{this.handleEndReached()}}
                       refreshing ={this.state.refreshing}
                       onRefresh={()=>{this.refresh()}}
                       data={this.state.appoinments}
                       keyExtractor={(item,index)=>index.toString()}
                       renderItem ={({item,index})=>{
                        return(
                                 <TouchableOpacity
                                onPress={() => { this.viewAppointments(item) }}
                                style={[styles.boxWithShadow,{
                                    marginTop: 10,
                                    minHeight: height * 0.22,
                                    backgroundColor: "#fff",
                                    marginHorizontal: 10,
                                    borderRadius: 10,
                                    paddingBottom:20
                                }]}
                            >
                             <View style={{ flexDirection: "row", flex: 1, }}>
                                    
                                        <View style={{ flex: 0.3, alignItems: "center", justifyContent: "center" }}>
                                       <LinearGradient 
                                            style={{ height: height*0.08, width: height*0.08, borderRadius: height*0.04,alignItems: "center", justifyContent: "center" }}
                                            colors={["#333", themeColor, themeColor]}
                                        >
                                            <View >
                                                <Text style={[styles.text, { color: "#ffff", fontWeight: "bold", fontSize: 22 }]}>{this.getFirstLetter(item,"patient")}</Text>
                                            </View>
                                        </LinearGradient>
                                      </View>
                                      <View style={{flex:0.7}}>
                                             <View style={{marginTop:height*0.02,flexDirection:"row"}}>
                                                     <View style={{flexDirection:"row",flex:0.7}}>
                                                     <View style={{alignItems:"center",justifyContent:"center"}}>
                                                           <Text style={[styles.text,{color:"#000",fontSize:height*0.02,fontWeight:"bold"}]}>{item.patientname.name}</Text>
                                                    </View>
                                                    <View style={{alignItems:"center",justifyContent:"center"}}>
                                                        <Text style={[styles.text,{color:"#000",fontSize:height*0.017,}]}> ({item.patientname.age} - {item.patientname.sex})</Text>
                                                    </View>
                                                </View>
                                                <View style={{flex:0.3,flexDirection:"row",alignItems:"center",justifyContent:"space-around"}}>
                                                          <TouchableOpacity style={[styles.boxWithShadow, { backgroundColor: "#fff", height:height*0.04, width:height*0.04, borderRadius:height*0.02, alignItems: "center", justifyContent: 'center' }]}
                                                    onPress={() => { this.chatwithCustomer(item) }}
                                                >
                                                    <Ionicons name="md-chatbox" size={height*0.02} color="#63BCD2" />
                                                </TouchableOpacity>
                                                                                       <TouchableOpacity style={[styles.boxWithShadow, { backgroundColor: "#fff", height:height*0.04, width: height*0.04, borderRadius:height*0.02, alignItems: "center", justifyContent: 'center', }]}
                                                                                onPress={() => {
                                                                        
                                                                                        if (Platform.OS == "android") {
                                                                                            Linking.openURL(`tel:${item?.patientname.mobile}`)
                                                                                        } else {

                                                                                            Linking.canOpenURL(`telprompt:${item?.patientname.mobile}`)
                                                                                        }}}
                                                        
                                                        
                                                                            >
                                                                            <Ionicons name="call" size={height*0.02} color="#63BCD2" />
                                                                            </TouchableOpacity>
                                             
                                                </View>
                                             </View>
                                          
                                             <View style={{marginTop:height*0.01,}}>
                                                    <View>
                                                        <Text style={[styles.text,{color:"#000",fontSize:height*0.018}]}>Reason : {item.reason}</Text>
                                                    </View>
                                             </View>
                                                 <View style={{marginTop:height*0.01,}}>
                                                    <View>
                                                        <Text style={[styles.text,{color:"#000",fontSize:height*0.018}]}>Requested : {item.requesteddate} | {item.requestedtime}</Text>
                                                    </View>
                                             </View>
                                                <View style={{marginTop:height*0.01,}}>
                                                    <View>
                                                        <Text style={[styles.text,{color:"#000",fontSize:height*0.018}]}>Accepted : {item.accepteddate} | {item.acceptedtime}</Text>
                                                    </View>
                                               </View>
                                              <View style={{marginTop:height*0.01,flexDirection:"row"}}>
                                                    <View>
                                                        <Text style={[styles.text,{color:"#000",fontSize:height*0.018}]}>Status : </Text>
                                                    </View>
                                                     <View>
                                                        <Text style={[styles.text,{color:this.validateColor(item.status),fontSize:height*0.018}]}>{item.status}</Text>
                                                    </View>
                                               </View>
                                      </View>
                             </View>
                            </TouchableOpacity>
                        )
                    }}
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
        user:state.selectedUser,
        clinic: state.selectedClinic
    }
}
export default connect(mapStateToProps, { selectTheme })(AllAppointments);