import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, TextInput, TouchableOpacity, Image, SafeAreaView, ToastAndroid, Pressable, ActivityIndicator, TouchableWithoutFeedback} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import { selectTheme } from '../actions';
import settings from '../AppSettings';
import { Entypo } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
const { height ,width} = Dimensions.get("window");
const fontFamily =settings.fontFamily;
const themeColor=settings.themeColor;
const url =settings.url;
const screenHeight =Dimensions.get('screen').height
import Modal from 'react-native-modal';
import { AntDesign } from '@expo/vector-icons';
import MedicineDetails from '../components/MedicineDetails';
import HttpsClient from '../api/HttpsClient';
import Toast from 'react-native-simple-toast';
import SimpleToast from 'react-native-simple-toast';
import DropDownPicker from 'react-native-dropdown-picker';
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';

class AddPrescription extends Component {
  constructor(props) {
      let sex= [
          {
             label:"Male",value:'Male'
          },
          {
              label: "Female", value: 'Female'
          },
          {
              label: "Others", value: 'Others'
          },
    ]
    super(props);
      let appoinment = props?.route?.params?.appoinment||null
  console.log(appoinment,"popop")
    this.state = {
                mode: 'date',
                date: new Date(),
                medicines:[],
                mobileNo:"",
                patientsName:'',
                Reason:'',
                healthIssues:[],
                loading: false,
                doctorFees:"",
                sex,
                healthIssue:"",
                Age:"",
                selectedSex:sex[0].value,
                nextVisit:null,
                show1:false,
                appointment_taken:false,
                appointmentId:null,
                Address:"",
                Diseases:[],
                Disease:"",
                appoinment,
                creating:false,
    };
  }
  componentDidMount(){
    if(this.state.appoinment){
        this.searchUser(this.state?.appoinment?.patientname.mobile, this.state?.appoinment?.requesteddate, this.state?.appoinment?.clinic)
    }
  }
    addManualMedicine =()=>{
        let duplicate = this.state.medicines
        let pushObject ={
            manual:true
        }
        duplicate.push(pushObject)
        this.setState({ medicines: duplicate})
    }
    changeFunction = (type, value, index)=>{
        let duplicate = this.state.medicines

        if (type =="delete"){
            duplicate.splice(index,1)
          return this.setState({ medicines:duplicate});
        }
        if (type =="morning_count"){
            duplicate[index].morning_count =value
            return   this.setState({ medicines:duplicate})
        }
        if (type == "afternoon_count"){
            duplicate[index].afternoon_count = value
            return   this.setState({ medicines: duplicate })
        }
        if (type == "night_count") {
            duplicate[index].night_count = value
            return   this.setState({ medicines: duplicate })
        }
        if (type =="after_food"){
            duplicate[index].after_food = value
            return   this.setState({ medicines: duplicate })
        }
        if (type == "total_qty") {
            duplicate[index].total_qty = value
            return   this.setState({ medicines: duplicate })
        }
        if (type == "days") {
            duplicate[index].days = value
            return  this.setState({ medicines: duplicate })
        }
        if (type == "comment") {
            duplicate[index].command = value
            return  this.setState({ medicines: duplicate })
        }
        if (type == "variant") {
            duplicate[index].variant = value
            return this.setState({ medicines: duplicate })
        }
        if (type == "type") {
            duplicate[index].type = value
            return this.setState({ medicines: duplicate })
        }
        if (type == "name") {
            duplicate[index].title = value
            duplicate[index].medicine = value
            return this.setState({ medicines: duplicate })
        }
}
    backFunction =(medicines)=>{
        try{
            medicines.forEach((i) => {
                    i.after_food = false,
                    i.morning_count = 0,
                    i.afternoon_count = 0,
                    i.night_count = 0,
                    i.total_qty = 0,
                    i.days = 0,
                    i.medicine = i?.title
            })
        }catch(e){
          
        }
       
        this.setState({ medicines:this.state.medicines.concat(medicines)})
    }
 addPriscription = async()=>{
   
     this.setState({creating:true})
        let api =`${url}/api/prescription/addPrescription/`
     if (this.props.clinic?.validtill?.available == false){
         this.setState({ creating: false })
       return  this.showSimpleMessage("Please recharge to create Prescription", "#B22222", "danger")
     }
  
        if(this.state.medicines.length == 0){
            this.setState({ creating: false })
            return this.showSimpleMessage("Please add medicine", "#dd7030",)
        
        }
        if (this.state.doctorFees =="") {
            this.setState({ creating: false })
            return this.showSimpleMessage("Please fill doctorFees", "#dd7030",)
            
        }
        if (this.state.Reason =="") {
            this.setState({ creating: false })
            return this.showSimpleMessage("Please fill Reason", "#dd7030",)
       
        }
        this.state.medicines.forEach((i)=>{
            try{
                if (i.type == "Liquid"){
                    return 
                } else if (i.type == "Injections"){
                    return
                }
                else if (i.type == "Cream"){
                    return
                }
                else{
                    console.log("gjhj")
                    i.total_qty = i.days * (i.morning_count||0 + i.afternoon_count||0 + i.night_count||0)
                }
               
                 

                }
            
            catch (e){
                console.log(e)
            }
            
        })
 
        let sendData ={
            doctor: this.props.user.id,
            medicines:this.state.medicines,
            health_issues:this.state.healthIssues,
            username:this.state.patientsName,
            usermobile:this.state.mobileNo,
            ongoing_treatment: this.state.Reason,
            doctor_fees:this.state.doctorFees,
            clinic: this.state?.appoinment?.clinic||this.props.clinic.clinicpk,
            age:this.state.Age,
            sex:this.state.selectedSex,
            next_visit:this.state.nextVisit,
            address:this.state.Address,
            new_disease:this.state.Disease
        }
   
        if(this.state.appointmentId){
          sendData.appointment =this.state.appointmentId
        }
       const post = await HttpsClient.post(api,sendData)
       console.log(post,"post")
       if(post.type=="success"){
           if(this.state.appoinment){
               
               let api = `${url}/api/prescription/appointments/${this.state.appoinment.id}/`
                let sendData = {
                    status: "Completed"
                }
                console.log(sendData)
                let post = await HttpsClient.patch(api, sendData)
                if (post.type == "success") {
                    this.setState({ creating: false })
                    this.showSimpleMessage("Completed SuccessFully", "#00A300", "success")

                   return this.props.navigation.goBack()
                } else {
                    this.showSimpleMessage("Try again", "#B22222", "danger")
                    this.setState({ modal: false })
                }
           }else{
               this.setState({ creating: false })
               this.showSimpleMessage("Added SuccessFully", "#00A300", "success")
               setTimeout(() => {
                   this.props.navigation.goBack()
               }, 1500)
           }
          

       }else{
           this.setState({ creating: false })
           this.showSimpleMessage("Try again", "#B22222", "danger")
       }
       
    }
    showDatePicker = () => {
        this.setState({ show: true })
    };

    hideDatePicker = () => {
        this.setState({ show: false })
    };
    handleConfirm = (date) => {
          
        let nextVisit =  moment(date).format('YYYY-MM-DD')
        this.setState({ nextVisit,show1:false})
        
        this.hideDatePicker();
    };
    // onChange1 = (selectedDate) => {
    //     if (selectedDate.type == "set") {
    //     let nextVisit =  moment(new Date(selectedDate.nativeEvent.timestamp)).format('YYYY-MM-DD')
    //     this.setState({ nextVisit,show1:false})
    //     }
    // }
    searchUser = async(mobileNo,date,clinic)=>{
        let api = `${url}/api/prescription/getAppointmentUser/?doctor=${this.props.user.id}&user=${mobileNo}&clinic=${clinic||this.props.clinic.clinicpk}&requesteddate=${date||moment(new Date()).format('YYYY-MM-DD')}`
       console.log(api,'ppppppp')
        this.setState({mobileNo})
        if(mobileNo.length>9){
             this.setState({loading:true})
            const data = await HttpsClient.get(api)
            console.log(api)
            console.log(data)
           if(data.type =="success"){
               if (data.data.user.mobile == mobileNo){
                  
                   this.setState({ 
                       Age:data.data.user.age.toString(),
                       patientsName: data.data.user.name, 
                       healthIssues: data.data.user.health_issues||[],
                       Reason: data.data.user.appointment_reason,
                       appointment_taken: data.data.user.appointment_taken,
                       appointmentId: data.data.user.appointment,
                    })
               }
             this.setState({loading:false})
           }else{
               this.setState({ loading: false })
           }
        }
    }
    showSimpleMessage(content,color, type = "info", props = {}) {
        const message = {
            message: content,
            backgroundColor:color,
            icon: { icon: "auto", position: "left" },
            type,
            ...props,
        };

        showMessage(message);
    }
    setModalVisible = (visible) => {
        this.setState({ loading: visible });
    }
    pushIssues =(issue)=>{
        if (this.state.healthIssue!=""){
            let duplicate = this.state.healthIssues
            duplicate.push(this.state.healthIssue)
          return  this.setState({ healthIssues: duplicate, healthIssue: "" })
        }else{
            return this.showSimpleMessage("Health issue should not be empty", "#dd7030")
        }
        
    }
    deleteIssues =(i,index)=>{
       let duplicate =this.state.healthIssues
       duplicate.splice(index,1)
       this.setState({healthIssues:duplicate})
    }
    searchDiseases = async(Disease)=>{
        this.setState({ Disease})
        let api = `${url}/api/prescription/disease/?search=${Disease}`
        let data = await HttpsClient.get(api)
        console.log(data,"jjj")
        if(data.type =="success"){
            this.setState({ Diseases:data.data })
        }
        
    }
  render() {
      const { loading } = this.state;
   
    return (
        <>
            <SafeAreaView style={styles.topSafeArea} />
            <SafeAreaView style={styles.bottomSafeArea}>
                <TouchableWithoutFeedback
                    onPress={() => { this.setState({ Diseases:[]})}}
                >

               
        <View style={{flex:1}}>
                    {/* HEADERS */}
            <View style={{ height: height * 0.1, backgroundColor: themeColor, borderBottomRightRadius: 20, borderBottomLeftRadius: 20, flexDirection:'row',alignItems:"center"}}>
                <TouchableOpacity style={{flex:0.2,alignItems:"center",justifyContent:'center'}}
                  onPress={()=>{this.props.navigation.goBack()}}
                >
                    <Ionicons name="chevron-back-circle" size={30} color="#fff" />
                </TouchableOpacity>
                <View style={{flex:0.5,alignItems:"center",justifyContent:"center"}}>
                    <Text style={[styles.text,{ color: '#fff',marginLeft: 20 ,fontWeight:"bold",fontSize:20}]}> Prescription</Text>
                </View>
                 <View style={{flex:0.2}}>
                </View>       
            </View>
            {/* FORMS */}

            <ScrollView 
             contentContainerStyle={{ marginHorizontal:20}}
             showsVerticalScrollIndicator={false}
             keyboardShouldPersistTaps={"handled"}
            >
                
                <View style={{ marginTop: 20 }}>
                    <Text style={[styles.text], { fontWeight: "bold", fontSize: 18 }}>Mobile No</Text>
                    <TextInput
                         maxLength ={10}
                         value ={this.state.mobileNo}
                         selectionColor={themeColor}
                         keyboardType="numeric"
                                onChangeText={(mobileNo) => { this.searchUser(mobileNo)}}
                         style={{ width: width * 0.9, height: height * 0.05, backgroundColor: "#fafafa", borderRadius: 15, padding: 10, marginTop: 10}}
                    />
                </View>
                <View style={{ marginTop: 20 }}>
                    <Text style={[styles.text], { fontWeight: "bold", fontSize: 18 }}>Patient's Name</Text>
                    <TextInput
                        value ={this.state.patientsName}
                        selectionColor={themeColor}
                        onChangeText={(patientsName) => { this.setState({ patientsName }) }}
                        style={{ width: width * 0.9, height: height * 0.05, backgroundColor: "#fafafa", borderRadius: 15, padding: 10, marginTop: 10 }}
                    />
                </View>
                        <View style={{ marginTop: 20 }}>
                            <Text style={[styles.text], { fontWeight: "bold", fontSize: 18 }}>Age</Text>
                            <TextInput
                               keyboardType ={"numeric"}
                                value={this.state.Age}
                                selectionColor={themeColor}
                                onChangeText={(Age) => { this.setState({ Age }) }}
                                style={{ width: width * 0.9, height: height * 0.05, backgroundColor: "#fafafa", borderRadius: 15, padding: 10, marginTop: 10 }}
                            />
                        </View>
                        <View style={{ marginTop: 20 ,flexDirection:"row"}}>
                            <View style={{alignItems:"center",justifyContent:"center"}}>
                                <Text style={[styles.text], { fontWeight: "bold", fontSize: 18 }}>Sex</Text>

                            </View>
                           
                             <View style={{marginLeft:10}}>
                                <DropDownPicker
                                    items={this.state.sex}
                                    defaultValue={this.state.sex[0]?.value}
                                    containerStyle={{ height: 40, width: width * 0.4 }}
                                    style={{ backgroundColor: '#fafafa' }}
                                    itemStyle={{
                                        justifyContent: 'flex-start'
                                    }}
                                    dropDownStyle={{ backgroundColor: '#fafafa', width: width * 0.4 }}
                                    onChangeItem={item => this.setState({
                                        selectedSex: item.value
                                    })}

                                />
                             </View>
                          
                        </View>
                        {/* <View style={{ marginTop: 20 }}>
                            <Text style={[styles.text], { fontWeight: "bold", fontSize: 18 }}>Address</Text>
                            <TextInput
                                value={this.state.Address}
                                selectionColor={themeColor}
                             
                                onChangeText={(Address) => { this.setState({ Address }) }}
                                style={{ width: width * 0.9, height: height * 0.1, backgroundColor: "#fafafa", borderRadius: 15, padding: 10, marginTop: 10 ,textAlignVertical:"top"}}
                            />
                        </View> */}
                        <View style={{ marginTop: 20 }}>
                            <Text style={[styles.text], { fontWeight: "bold", fontSize: 18 }}>Health issues</Text>
                            {
                                this.state?.healthIssues?.map((i,index)=>{
                                      return(
                                          <View style={{margin:10,flexDirection:"row"}}
                                           key={index}
                                          >
                                              <View style={{flex:0.7}}>
                                                  <Text>{index + 1}. {i}</Text>
                                              </View>
                                              <TouchableOpacity style={{flex:0.3}}
                                               onPress={()=>{this.deleteIssues(i,index)}}
                                              
                                              >
                                                  <Entypo name="circle-with-cross" size={24} color="red" />
                                              </TouchableOpacity>

                                          </View>
                                      )
                                })
                            }
                            <View style={{flexDirection:'row',alignItems:"center",justifyContent:"space-around"}}>
                                <TextInput
                                    value ={this.state.healthIssue}
                                    selectionColor={themeColor}
                                    multiline={true}
                                    onChangeText={(healthIssue) => { this.setState({ healthIssue}) }}
                                    style={{ width: width * 0.6, height: height * 0.07, backgroundColor: "#fafafa", borderRadius: 15, padding: 10, marginTop: 10, }}
                                />
                                <TouchableOpacity 
                                  style={{height:height*0.05,alignItems:"center",justifyContent:'center',width:width*0.2,borderRadius:10,backgroundColor:themeColor,marginTop:10}}
                                  onPress={()=>{this.pushIssues()}}
                               
                               >
                                    <Text style={[styles.text,{color:"#fff"}]}>Add</Text>
                                </TouchableOpacity>
                            </View>
                          
                        </View>
                       {this.state.mobileNo.length>9&& <View style={{ marginTop: 20 }}>
                            <Text style={[styles.text], { fontWeight: "bold", fontSize: 18 }}>Appointment Details:</Text>
                            <View style={{flexDirection:"row",marginTop:5,marginLeft:10}}>
                                <Text style={[styles.text,{fontWeight:"bold",color:"gray"}]}>Appointment Taken:</Text>
                                <Text style={[styles.text,{marginLeft:10}]}>{this.state.appointment_taken?"yes":"No"}</Text>
                            </View>
                            {this.state.appointment_taken&&<View style={{ flexDirection: "row", marginTop: 5, marginLeft: 10 }}>
                                <Text style={[styles.text, { fontWeight: "bold", color: "gray" }]}>Token Id:</Text>
                                <Text style={[styles.text, { marginLeft: 10 }]}>{this.state.appointmentId}</Text>
                            </View>}
                        </View>}
                        <View style={{ marginTop: 20 }}>
                            <Text style={[styles.text], { fontWeight: "bold", fontSize: 18 }}>Reason for this Visit</Text>
                            <TextInput
                                value ={this.state.Reason}
                                onChangeText={(Reason) => { this.setState({ Reason}) }}
                                selectionColor={themeColor}
                                multiline={true}
                                style={{ width: width * 0.9, height: height * 0.15, backgroundColor: "#fafafa", borderRadius: 15, padding: 10, marginTop: 10, textAlignVertical:"top"}}
                            />
                        </View>
                        {/* <View style={{ marginTop: 20 }}>
                            <Text style={[styles.text], { fontWeight: "bold", fontSize: 18 }}>Diseases</Text>
                            <TextInput
                                value={this.state.Disease}
                                onChangeText={(Disease) => { this.searchDiseases(Disease) }}
                                selectionColor={themeColor}
                                multiline={true}
                                style={{ width: width * 0.9, height: height * 0.07, backgroundColor: "#fafafa", borderRadius: 15, padding: 10, marginTop: 10, textAlignVertical: "top" }}
                            />
                        </View>
                        {this.state.Diseases.length>0&&<ScrollView 
                        showsVerticalScrollIndicator ={false}
                                style={{
                                    position: "relative", width: width * 0.9, height: height * 0.2, backgroundColor: "#eee", bottom: 0, shadowColor: "#000",
                                    shadowOffset: {
                                        width: 0,
                                        height: 2
                                    },
                                    shadowOpacity: 0.25,
                                    shadowRadius: 4,
                                    elevation: 5,}}>
                           {
                               this.state.Diseases.map((i,index)=>{
                                   return(
                                       <TouchableOpacity 
                                           key ={index}
                                           style={{margin:20,justifyContent:"center"}}
                                           onPress={() => { this.setState({ Disease: i.title,Diseases:[]})}}
                                       >
                                           <Text style={[styles.text,{color:themeColor}]}>{i.title}</Text>
                                       </TouchableOpacity>
                                   )
                               })
                           }
                        </ScrollView>} */}
                <View style={{ marginTop: 20 }}>
                    <Text style={[styles.text], { fontWeight: "bold", fontSize: 18 }}>Add Medicines</Text>
                                <View style={{ flexDirection: "row", marginTop: 20,alignItems:'center',justifyContent:"space-around"}}>
                    <TouchableOpacity style={{ alignItems: "center", justifyContent: 'center', flexDirection: "row" }}
                        onPress={() => { this.props.navigation.navigate("SearchMedicines", { backFunction: (medicines) => { this.backFunction(medicines) } }) }}
                    >
                        <AntDesign name={"search1"} size={30} color={themeColor} />
                    </TouchableOpacity>
                 
                </View>    
                
                </View>
                {
                   this.state.medicines.map((item,index)=>{
                        return(
                            <MedicineDetails item={item} index={index} changeFunction={(type, value, index) => { this.changeFunction(type, value, index)}} />
                        )
                    })
                }
                
                        <View style={{ marginTop: 20 }}>
                            <Text style={[styles.text], { fontWeight: "bold", fontSize: 18 }}>Doctor Fees</Text>
                            <TextInput
                                value={this.state.doctorFees}
                                selectionColor={themeColor}
                                keyboardType="numeric"
                                onChangeText={(doctorFees) => { this.setState({ doctorFees }) }}
                                style={{ width: width * 0.9, height: height * 0.05, backgroundColor: "#fafafa", borderRadius: 15, padding: 10, marginTop: 10 }}
                            />
                        </View>
                            <View >

                                <Text style={[styles.text], { fontWeight: "bold", fontSize: 18, }}>Next Visit</Text>
                            </View>
                            <View style={{ width: width * 0.9, height: height * 0.05, backgroundColor: "#fafafa", borderRadius: 15, padding: 10, marginTop: 10 ,flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>
                              <View style={{alignItems:"center",justifyContent:"center"}}>
                                    <Text style={[styles.text]}>{this.state.nextVisit}</Text>
                              </View>
                                <View style={{}}>
                                    <TouchableOpacity
                                        onPress={() => { this.setState({ show1: true }) }}
                                    >
                                        <AntDesign name="calendar" size={24} color="black" />
                                    </TouchableOpacity>

                                
                                </View>
                           
                        </View>
                <View style={{height:height*0.15,alignItems:"center",justifyContent:'center'}}>
                    <TouchableOpacity style={{height:height*0.06,alignItems:"center",justifyContent:'center',backgroundColor:themeColor,width:width*0.3,borderRadius:15}}
                      onPress={()=>{this.addPriscription()}}
                    >
                           {this.state.creating?<ActivityIndicator color="#fff" size="large"/>:<Text style={[styles.text,{color:"#fff"}]}>CREATE</Text>}
                    </TouchableOpacity>
                </View>
                        <View style={styles.centeredView}>
                            <Modal
                             isVisible={loading}
                             deviceHeight ={screenHeight}
                            >
                                <View style={styles.centeredView}>
                                    <View style={styles.modalView}>
                                     <ActivityIndicator color={themeColor} size ="large" />
                                      
                                    </View>
                                </View>
                            </Modal>
                        
                        </View>
            </ScrollView>
                    {/* {this.state.show1 && (
                        <DateTimePicker
                            testID="TimePicker1"
                            value={this.state.date}
                            mode={this.state.mode}
                            is24Hour={false}
                            display="default"
                            onChange={(time) => { this.onChange1(time) }}
                        />
                    )} */}

                    <DateTimePickerModal
                        isVisible={this.state.show1}
                        mode="date"
                        onConfirm={this.handleConfirm}
                        onCancel={this.hideDatePicker}
                    />
        </View>
    </TouchableWithoutFeedback>
     </SafeAreaView>
       </>
        
    );
 
  }
}
const styles= StyleSheet.create({
  text:{
      fontFamily
  },
  elevation:{
      borderRadius: 10,
      shadowColor: "#000",
      shadowOffset: {
          width: 0,
          height: 4,
      },
      shadowOpacity: 0,
      shadowRadius: 4.65,

      elevation: 8,
  },
    card: {
        backgroundColor: "#fff",
        elevation: 6,
        margin: 10,
        height: height * 0.2,
        borderRadius:10,
        flexDirection:"row"
    },
    topSafeArea: {
        flex: 0,
        backgroundColor: themeColor
    },
    bottomSafeArea: {
        flex: 1,
        backgroundColor: "#fff"
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
         height:60,
         width:60,
        backgroundColor: "white",
        borderRadius: 30,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        alignItems:"center",
        justifyContent:"center"
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    }
})
const mapStateToProps = (state) => {

    return {
        theme: state.selectedTheme,
        user:state.selectedUser,
        clinic: state.selectedClinic
    }
}
export default connect(mapStateToProps, { selectTheme })(AddPrescription);