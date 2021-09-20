import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image, SafeAreaView, ToastAndroid, Pressable, Switch, ActivityIndicator, TextInput, Alert, TouchableWithoutFeedback, ScrollView,Keyboard, KeyboardAvoidingView, Platform} from 'react-native';
import { connect, connectAdvanced } from 'react-redux';
import { selectTheme } from '../actions';
import settings from '../AppSettings';
import { Entypo } from '@expo/vector-icons';
import { Ionicons ,FontAwesome5} from '@expo/vector-icons';
const { height ,width} = Dimensions.get("window");
const fontFamily =settings.fontFamily;
const themeColor=settings.themeColor;
const inputColor=settings.TextInput;
const url =settings.url;
const screenHeight =Dimensions.get('screen').height
import Modal from 'react-native-modal';
import { AntDesign } from '@expo/vector-icons';
import MedicineDetails from '../components/MedicineDetails';
import MedicineDetails2 from '../components/MedicineDetails2';
import HttpsClient from '../api/HttpsClient';
import Toast from 'react-native-simple-toast';
import SimpleToast from 'react-native-simple-toast';
import DropDownPicker from 'react-native-dropdown-picker';
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import moment from 'moment';
import { FlatList } from 'react-native-gesture-handler';

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
      this.state = {
                mode: 'date',
                date: new Date(),
                medicines:[],
                mobileNo:"",
                patientsName:'',
                Reason:"",
                healthIssues:[],
                loading: false,
                doctorFees:"",
                sex,
                healthIssue:"",
                Age:"",
                selectedSex:null,
                nextVisit:null,
                show1:false,
                appointment_taken:false,
                appointmentId:null,
                Address:"",
                Diseases:[],
                Disease:"",
                appoinment,
                creating:false,
                containDrugs:false,
                validityTimes:"0",
                MedicinesGiven:[],
                check:true,
                selectedDiagonosis:[],
                profiles:[],
                selectedProfile:null,
                addModal:false,
                profileName:"",
                keyBoardHeight:0,
                report:"",
                reports:[],
                selectedReports:[],
                sexModal:false,
                profileModal:false,
                doctors:[],
                doctorModal:false,
                selectedDoctor:null
    };
  }
getClinicDoctors = async()=>{
        let api = `${url}/api/prescription/clinicDoctors/?clinic=${this.props.user.profile.recopinistclinics[0].clinicpk}`
     
        const data = await HttpsClient.get(api)
        if (data.type == "success") {
            this.setState({ doctors: data.data })
                if(this.state.appoinment){
         let findDoctor = data.data.find((item)=>{
             return item.doctor.profile.name==this.state?.appoinment?.doctordetails.name
         })
       if(findDoctor){
           this.setState({selectedDoctor:findDoctor},()=>{
                 this.searchUser(this.state?.appoinment?.patientname.mobile, this.state?.appoinment?.requesteddate, this.state?.appoinment?.clinic)
           })
       }

    }
        }
}
  componentDidMount(){
     if(this.props.user.profile.occupation=="ClinicRecoptionist"){
         this.getClinicDoctors()
     }
           Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);

    this._unsubscribe = this.props.navigation.addListener('focus',()=>{
         this.searchUser(this.state.mobileNo)
    })
      this._subscribe = this.props.navigation.addListener('beforeRemove', (e) => {
          if (this.state.check&&(this.state.medicines.length>0||this.state.MedicinesGiven.length>0)) {
            
              e.preventDefault();

              // Prompt the user before leaving the screen
              Alert.alert(
                  'Go Back?',
                  'Are you sure to discard them and leave the screen?',
                  [
                      { text: "Don't leave", style: 'cancel', onPress: () => {}},
                      {
                          text: 'Discard',
                          style: 'destructive',
                          // If the user confirmed, then we dispatch the action we blocked earlier
                          // This will continue the action that had triggered the removal of the screen
                          onPress: () => this.props.navigation.dispatch(e.data.action),
                      },
                  ]
              );
          }
      })
  }
      _keyboardDidShow = (e) => {
            console.log()
        this.setState({keyBoardHeight:e.endCoordinates.height})
    };

    _keyboardDidHide = () => {
        this.setState({ keyBoardHeight: 0 })
    };
  componentWillUnmount(){
        Keyboard.removeListener('keyboardDidShow', this._keyboardDidShow);
        Keyboard.removeListener('keyboardDidHide', this._keyboardDidHide);
        this._unsubscribe();
        this._subscribe()
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
        if (type == "validTimes") {
            duplicate[index].invalid_count = value
            return this.setState({ medicines: duplicate })
        }
        if (type == "containsDrugs") {
            duplicate[index].is_drug = value
            return this.setState({ medicines: duplicate })
        }
        if (type == "diagnosis") {
            duplicate[index].diagonsis = value
            return this.setState({ medicines: duplicate })
        }
}

    changeFunction2 = (type, value, index) => {
        let duplicate = this.state.MedicinesGiven
        if (type == "total_qty") {
            duplicate[index].total_qty = value
            return this.setState({ MedicinesGiven: duplicate })
        }
        if (type == "comment") {
            duplicate[index].command = value
            return this.setState({ MedicinesGiven: duplicate })
        }
        if (type == "delete") {
            duplicate.splice(index, 1)
            return this.setState({ MedicinesGiven: duplicate })
        }
     if (type == "diagnosis") {
            duplicate[index].diagonsis = value
            return this.setState({ MedicinesGiven: duplicate })
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
                    i.medicine = i?.title,
                    i.is_drug=false,
                    i.invalid_count=0,
                    i.is_given = false,
                    i.command = ""
                    i.diagonsis=null
            })
        }catch(e){
          
        }
       
        this.setState({ medicines:this.state.medicines.concat(medicines)})
    }
    backFunction2 = (medicines) => {
        try {
            medicines.forEach((i) => {
                i.is_given = true,
                i.total_qty = 0,
                i.medicine =i.id,
                i.command =""
            })
        } catch (e) {

        }

        this.setState({ MedicinesGiven: this.state.MedicinesGiven.concat(medicines) })
    }
    createTemplateAlert =(prescribed_medicines,medicines_given,disease) =>{
          
        
              Alert.alert(
                  'Template is Available for?',
                  `Age : ${this.state?.Age} & Diagnosis : ${disease}`,
                  [
                      { text: "No", style: 'cancel', onPress: () => { } },
                      {
                          text: 'use',
                          style: 'destructive',
                      
                          onPress: () => {this.setState({ medicines: this.state.medicines.concat(prescribed_medicines), MedicinesGiven:this.state.MedicinesGiven.concat(medicines_given)})} ,
                      },
                  ]
              );
           
    }
    searchTemplates = async (age=null,disease="") => {
        this.setState({ loading: true })
        let api = `${url}/api/prescription/getTemplate/?clinic=${this.state?.appoinment?.clinic || this?.props?.clinic?.clinicpk||this.props.user.profile.recopinistclinics[0].clinicpk}&age=${age}&diagonsis=${disease}&type=mobile`
         console.log(api)
        let data = await HttpsClient.get(api)
       
        if(data.type=="success"){
            
            this.setState({ loading: false })
            if(data.data.prescribed_medicines.length>0||data.data.medicines_given.length>0){
              
                         this.createTemplateAlert(data.data.prescribed_medicines,data.data.medicines_given,disease)
            }
       
           
        }else{
            this.setState({ loading: false })
        }
    }
 addPriscription = async()=>{
     let error ={

     };
     
     this.setState({creating:true})
        let api =`${url}/api/prescription/addPrescription/`
        if(this.props.user.profile.occupation=="ClinicRecoptionist"){
            if(this.state.selectedDoctor==null){
                        this.setState({ creating: false })
        return  this.showSimpleMessage("Please Select doctor", "#B22222", "danger")
            }
        }
        if (this.props.clinic?.validtill?.available == false){
            this.setState({ creating: false })
        return  this.showSimpleMessage("Please recharge to create Prescription", "#B22222", "danger")
        }
 
        if(this.state.selectedSex==null){
             this.setState({ creating: false })
            return this.showSimpleMessage("Please Select Sex", "#dd7030",) 
        }
        if(this.state.medicines.length == 0){
            this.setState({ creating: false })
            return this.showSimpleMessage("Please add medicine", "#dd7030",)
        
        }
        if (this.state.doctorFees =="") {
            this.setState({ creating: false })
            return this.showSimpleMessage("Please fill doctorFees", "#dd7030",)
            
        }
        for(let i=0;i<this.state.MedicinesGiven.length;i++){
           if(this.state.MedicinesGiven[i].days==0||this.state.MedicinesGiven[i].days==""){
                error.error=`please select No of Days in medicine number ${i+1}`
                break;   
           }
              if(this.state.MedicinesGiven[i].diagonsis==null||this.state.MedicinesGiven[i].diagonsis==undefined||this.state.MedicinesGiven[i].diagonsis==""){
                  error.error=`please select diagnosis in medicine number ${i+1}`
                error.index= i
                break;
            }
        }
        for(let i=0;i<this.state.medicines.length;i++){
               
            if(this.state.medicines[i].morning_count==0&&this.state.medicines[i].afternoon_count==0&&this.state.medicines[i].night_count==0){
               
                error.error=`please select atlease one Frequency in medicine number ${this.state.MedicinesGiven.length+i+1}`
                error.index= i
                break;
              
            }
            if(this.state.medicines[i].days=="0"||this.state.medicines[i].days==""){
                  error.error=`please select No of Days in medicine number ${this.state.MedicinesGiven.length+i+1}`
                error.index= i
                break;
            }
            if(this.state.medicines[i].diagonsis==null||this.state.medicines[i].diagonsis==undefined||this.state.medicines[i].diagonsis==""){
                  error.error=`please select diagnosis in medicine number ${this.state.MedicinesGiven.length+i+1}`
                error.index= i
                break;
            }
        
        }
        if(error?.error){
            this.setState({creating:false})
            return this.showSimpleMessage(`${error.error} `,"orange","info")
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
        let medicines = this.state.medicines.concat(this.state.MedicinesGiven)
        let sendData ={
            doctor_selected:this?.state?.selectedDoctor?.doctor?.id||this.props.user.id,
            medicines,
            health_issues:this.state.healthIssues,
            username:this.state.patientsName,
            usermobile:this.state.mobileNo,
            ongoing_treatment: this.state.Reason,
            doctor_fees:this.state.doctorFees,
            clinic: this.state?.appoinment?.clinic||this.props?.clinic?.clinicpk||this.props.user.profile.recopinistclinics[0].clinicpk,
            age:Number(this.state.Age),
            sex:this.state.selectedSex,
            next_visit:this.state.nextVisit,
            address:this.state.Address,
            diagonsis:this.state.selectedDiagonosis,
            reports:this.state.selectedReports,
            type:"mobile",
        }
    
        if(this.state.appointmentId){
          sendData.appointment =this.state.appointmentId
        }
       const post = await HttpsClient.post(api,sendData)
       console.log(sendData,"seeee")
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
                    this.setState({ creating: false },()=>{
                        this.showSimpleMessage("Completed SuccessFully", "#00A300", "success")
                        return this.props.navigation.goBack()
                    })
         
                } else {
                    this.showSimpleMessage("Try again", "#B22222","danger")
                    this.setState({ modal: false })
                }
           }else{
               this.setState({ creating: false, check:false},()=>{
                   this.showSimpleMessage("Added SuccessFully", "#00A300", "success")
                   setTimeout(() => {
                       this.props.navigation.goBack()
                   }, 1500)
               })
          
           }
          

       }else{
           this.setState({ creating: false })
           this.showSimpleMessage("Try again", "#B22222", "danger")
       }
       
    }
    showDatePicker = () => {
        this.setState({ show1: true })
    };

    hideDatePicker = () => {
        this.setState({ show1: false })
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
    addModal =()=>{
        return(
            <Modal
              onBackButtonPress={()=>{this.setState({addModal:false})}}
              statusBarTranslucent={true}
              isVisible={this.state.addModal}
              deviceHeight={screenHeight}
              style={{marginBottom:this.state.keyBoardHeight}}
            >
              <View style={{flex:1,alignItems:"center",justifyContent:"center"}}>
                 <View style={{height:height*0.4,backgroundColor:"#fff",borderRadius:5,width:width*0.9}}>
                      <View style={{alignItems:"center",justifyContent:"center",marginVertical:20}}>
                          <Text style={[styles.text,{color:"#000",fontSize:height*0.024}]}>Add New Profile :</Text>
                      </View>
                     <View style={{marginLeft:20}}>
                         <View>
                                <Text style={[styles.text,{color:'#000',fontSize:height*0.02}]}>Name :</Text>
                         </View>
                            <TextInput
                        value ={this.state.profileName}
                        selectionColor={themeColor}
                        onChangeText={(profileName) => { this.setState({ profileName }) }}
                                style={{ width: width * 0.7, height: 35, backgroundColor: inputColor, borderRadius: 5, padding: 10, marginTop: 10 }}
                    />
                     </View>
                             <View style={{marginLeft:20,marginTop:10}}>
                         <View>
                                <Text style={[styles.text,{color:'#000',fontSize:height*0.02}]}>Age :</Text>
                         </View>
                            <TextInput
                            keyboardType={"numeric"}
                        value ={this.state.profileAge}
                        selectionColor={themeColor}
                        onChangeText={(profileAge) => { this.setState({ profileAge }) }}
                                style={{ width: width * 0.7, height: 35, backgroundColor: inputColor, borderRadius: 5, padding: 10, marginTop: 10 }}
                    />
                     </View>
                     <View style={{alignItems:"center",justifyContent:"center",marginTop:20}}>
                          <TouchableOpacity style={{height:height*0.04,width:width*0.3,alignItems:"center",justifyContent:"center",backgroundColor:themeColor}}>
                                <Text style={[styles.text,{color:"#fff"}]}>Add</Text>
                          </TouchableOpacity>
                     </View>
                 </View>
              </View>
            </Modal>
        )
    }
    searchUser = async(mobileNo,date,clinic)=>{
        let api 

        if(this.props.user.profile.occupation=="ClinicRecoptionist"){
            if(this.state.selectedDoctor==null){
                return this.showSimpleMessage("Please Select Doctor","orange","info")
            }
          api = `${url}/api/prescription/getAppointmentUser/?doctor=${this.state.selectedDoctor.doctor.id}&user=${mobileNo}&clinic=${this.props.user.profile.recopinistclinics[0].clinicpk}&requesteddate=${date||moment(new Date()).format('YYYY-MM-DD')}`   
        }else{
          api  = `${url}/api/prescription/getAppointmentUser/?doctor=${this.props.user.id}&user=${mobileNo}&clinic=${clinic||this.props.clinic.clinicpk}&requesteddate=${date||moment(new Date()).format('YYYY-MM-DD')}`
        }
       console.log(api,'ppppppp')
       this.setState({mobileNo})
        if(mobileNo.length>9){
             this.setState({loading:true})
            const data = await HttpsClient.get(api)
            console.log(api)
            console.log(data)
           if(data.type =="success"){
                 this.setState({loading:false})

                   let profiles = []
                   let pushObj ={
                       label:data.data.user.name,
                       value:data.data.user.user.id,
                       mobile:data.data.user.user.username,
                       sex:data.data.user.sex,
                       healthIssues:data.data.user.health_issues||[],
                       age:data?.data?.user?.age?.toString()
                   }
                   profiles.push(pushObj)
                   data.data.user.childUsers.forEach((item)=>{
                      let pushObj ={
                          label:item.name,
                          value:item.childpk,
                          age:item.age.toString(),
                          mobile:item.mobile,
                          sex:item.sex,
                          healthIssues:item.health_issues||[]
                      }
                     profiles.push(pushObj)
                   })
            
                   this.setState({ 
                       profiles,
                       Age:profiles[0].age,
                       patientsName:profiles[0].label, 
                       healthIssues: profiles[0].healthIssues,
                       Reason: data.data.user.appointment_reason||"",
                       appointment_taken: data.data.user.appointment_taken,
                       appointmentId: data.data.user.appointment,
                       selectedSex:profiles[0].sex,
                       selectedProfile:profiles[0],
                       mobileNo:profiles[0].mobile
                    },()=>{
                       this.searchTemplates(this.state.Age,this.state.Disease)
                    })
               
               
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
            if(data.data.length>0){
                this.scrollRef.scrollTo( {x:0,y:height*0.8,animated: true})
            }
            this.setState({ Diseases:data.data })
        }
        
    }
    toggleSwitch =()=>{
         this.setState({containDrugs:!this.state.containDrugs})
    }
    handleCheck = ()=>{
       
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.searchTemplates(this.state.Age, this.state.Disease);
        }, 500);
    }
    componentDidUpdate(prevProps, prevState){
        if (prevState.Age !== this.state.Age) {
         
           this.handleCheck()
        }
    }
    removeSelectedDiagonis =(item,index) =>{
         let duplicate = this.state.selectedDiagonosis
         duplicate.splice(index,1)
         this.setState({selectedDiagonosis:duplicate},()=>{
             this.state.selectedDiagonosis.forEach((item)=>{
                 this.searchTemplates(this.state.Age, item)
             })
         })
    }
    searchReports = async(report)=>{
       this.setState({report})   
     let api =`${url}/api/prescription/reportcategory/?is_verified=true?title=${report}`
         const data = await HttpsClient.get(api)
         if(data.type=="success"){
               this.scrollRef.scrollToEnd({animated:true})
               this.setState({reports:data.data})
         }
    }
    removeSelectedReport =(item,index)=>{
        let duplicate = this.state.selectedReports
         duplicate.splice(index,1)
         this.setState({selectedReports:duplicate})
    }
    searchAppoinment = async(mobileNo,date,clinic)=>{
       let api = `${url}/api/prescription/getAppointmentUser/?doctor=${this.state.selectedDoctor?.doctor?.id||this.props.user.id}&user=${mobileNo}&clinic=${clinic||this.props?.clinic?.clinicpk||this.props.user.profile.recopinistclinics[0].clinicpk}&requesteddate=${date||moment(new Date()).format('YYYY-MM-DD')}`
    if(mobileNo.length>9){
             this.setState({loading:true})
            const data = await HttpsClient.get(api)
            console.log(api)
            console.log(data)
           if(data.type =="success"){
                   this.setState({ 
                       Reason: data.data.user.appointment_reason||"",
                       appointment_taken: data.data.user.appointment_taken,
                       appointmentId: data.data.user.appointment,
                      
                    })
               
               
             this.setState({loading:false})
           }else{
               this.setState({ loading: false })
           }
        }
    
    }
    addDiagnosis =()=>{
        if(this.state.Disease==""){
            return this.showSimpleMessage("Please Add Diagnosis","orange","info")
        }
               this.state.selectedDiagonosis.push(this.state.Disease)
               this.searchTemplates(this.state.Age, this.state.Disease)
            
         this.setState({ Disease: "",Diseases:[]})
    }
    sexModal =()=>{
        return(
            <Modal
              deviceHeight={screenHeight}
              isVisible={this.state.sexModal}
              onBackdropPress={()=>{this.setState({sexModal:false})}}
              statusBarTranslucent={true}
            >
              <View style={{flex:1,alignItems:"center",justifyContent:"center"}}>
                        <View style={{height:height*0.3,width:width*0.7,backgroundColor:"#fff",borderRadius:10}}>
                                <View style={{marginVertical:20,alignItems:"center",justifyContent:"center"}}>
                                    <Text style={[styles.text,{color:"#000",fontSize:height*0.02}]}>Select Sex :</Text>
                                </View>
                                          
                            {
                                this.state.sex.map((item,index)=>{
                                        return(
                                            <TouchableOpacity key={index} style={{flexDirection:"row",marginTop:10}}
                                             onPress={()=>{this.setState({selectedSex:item.value,sexModal:false})}}
                                            
                                            >
                                                <View style={{flex:0.7,alignItems:"center",justifyContent:"center"}}>
                                                    <Text style={[styles.text,{color:"#000",fontSize:height*0.02}]}>{item.label}</Text>
                                                </View>
                                                <View style={{flex:0.3,alignItems:"center",justifyContent:"center"}}>
                                                    <FontAwesome5 name="dot-circle" size={24} color={this.state.selectedSex===item.value?"#63BCD2":"gray"}/>
                                                </View>
                                            </TouchableOpacity>
                                        )
                                })
                            }
                        </View>
              
                     
              </View>
            </Modal>
        )
    }
    changeProfileModal =()=>{
       return(
            <Modal
              deviceHeight={screenHeight}
              isVisible={this.state.profileModal}
              onBackdropPress={()=>{this.setState({profileModal:false})}}
              statusBarTranslucent={true}
            >
              <View style={{flex:1,alignItems:"center",justifyContent:"center"}}>
                        <View style={{height:height*0.6,width:width*0.7,backgroundColor:"#fff",borderRadius:10}}>
                                <View style={{marginVertical:20,alignItems:"center",justifyContent:"center"}}>
                                    <Text style={[styles.text,{color:"#000",fontSize:height*0.02}]}>Select Profile :</Text>
                                </View>
                                <FlatList 
                                   showsVerticalScrollIndicator={false}
                                   data={this.state.profiles}
                                   keyExtractor={(item,index)=>index.toString()}
                                   renderItem={({item,index})=>{
                                       return(
                                           <TouchableOpacity key={index} style={{flexDirection:"row",marginTop:10}}
                                             onPress={()=>{
                                                   this.setState({ 
                                                
                                                Age:item.age,
                                                patientsName:item.label, 
                                                healthIssues: item.healthIssues,
                                                selectedSex:item.sex,
                                                selectedProfile:item,
                                                mobileNo:item.mobile,
                                                profileModal:false
                                                },()=>{
                                                this.searchAppoinment(item.mobile)
                                                this.searchTemplates(this.state.Age,this.state.selectedDiagonosis)
                                                })
                                               
                                            
                                            }}
                                            
                                            >
                                                <View style={{flex:0.7,alignItems:"center",justifyContent:"center"}}>
                                                    <Text style={[styles.text,{color:"#000",fontSize:height*0.02}]}>{item.label}</Text>
                                                </View>
                                                <View style={{flex:0.3,alignItems:"center",justifyContent:"center"}}>
                                                    <FontAwesome5 name="dot-circle" size={24} color={this.state.selectedProfile.value===item.value?"#63BCD2":"gray"}/>
                                                </View>
                                            </TouchableOpacity>
                                       )
                                    }}
                                />            
                                <View style={{marginVertical:20,alignItems:"center",justifyContent:"center"}}>
                                        <TouchableOpacity style={{backgroundColor:themeColor,borderRadius:5,height:height*0.04,alignItems:"center",justifyContent:"center",width:width*0.3}}
                                          onPress={()=>{
                                              this.setState({profileModal:false})
                                              this.props.navigation.navigate("AddAccount",{parent:this.state.profiles[0]})
                                            }}
                                        
                                        >
                                               <Text style={[styles.text,{color:"#fff"}]}>Add New</Text>
                                        </TouchableOpacity>
                                </View>
                        </View>
              
                     
              </View>
            </Modal> 
       )
    }
    doctorModal =()=>{
       return(
            <Modal
              deviceHeight={screenHeight}
              isVisible={this.state.doctorModal}
              onBackdropPress={()=>{this.setState({doctorModal:false})}}
              statusBarTranslucent={true}
            >
              <View style={{flex:1,alignItems:"center",justifyContent:"center"}}>
                        <View style={{height:height*0.4,width:width*0.7,backgroundColor:"#fff",borderRadius:10}}>
                                <View style={{marginVertical:20,alignItems:"center",justifyContent:"center"}}>
                                    <Text style={[styles.text,{color:"#000",fontSize:height*0.02}]}>Select Doctor :</Text>
                                </View>
                                <FlatList 
                                   showsVerticalScrollIndicator={false}
                                   data={this.state.doctors}
                                   keyExtractor={(item,index)=>index.toString()}
                                   renderItem={({item,index})=>{
                                       return(
                                           <TouchableOpacity key={index} style={{flexDirection:"row",marginTop:10}}
                                            onPress={()=>{
                                                this.setState({selectedDoctor:item,doctorModal:false})
                                            }}
                                            
                                            >
                                                <View style={{flex:0.7,alignItems:"center",justifyContent:"center"}}>
                                                    <Text style={[styles.text,{color:"#000",fontSize:height*0.02}]}>{item.doctor.profile.name}</Text>
                                                </View>
                                                <View style={{flex:0.3,alignItems:"center",justifyContent:"center"}}>
                                                    <FontAwesome5 name="dot-circle" size={24} color={this.state?.selectedDoctor?.doctor?.id===item.doctor.id?"#63BCD2":"gray"}/>
                                                </View>
                                            </TouchableOpacity>
                                       )
                                    }}
                                />            
                   
                        </View>
              
                     
              </View>
            </Modal> 
       )
    }
  render() {
      const { loading } = this.state;
   
    return (
        <>
            <SafeAreaView style={styles.topSafeArea} />
            <SafeAreaView style={styles.bottomSafeArea}>
            
         <KeyboardAvoidingView behavior={Platform.OS=="ios"?"padding":"height"}
           style={{flex:1}}
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
             ref ={ref=>this.scrollRef=ref}
             contentContainerStyle={{ paddingHorizontal:20}}
             showsVerticalScrollIndicator={false}
             keyboardShouldPersistTaps={"handled"}
            >
             { this.props.user.profile.occupation=="ClinicRecoptionist" && <View style={{ marginTop: 20 }}>
                    <Text style={[styles.text], { color:"#000", fontSize:height*0.02 }}>Select Doctor</Text>
                          <TouchableOpacity style={{marginTop:10,backgroundColor:inputColor,height:35,width:width*0.7,flexDirection:"row"}}
                             
                             onPress={()=>{
                                 this.setState({doctorModal:true})
                             }}
                             >
                                 <View style={{flex:0.8,alignItems:"center",justifyContent:"center"}}>
                                    <Text style={[styles.text,{color:"#000",fontSize:height*0.02}]} numberOfLines={1}>{this.state.selectedDoctor?this.state.selectedDoctor.doctor.profile.name:"Select"}</Text>
                                 </View>
                                 <View style={{flex:0.2,alignItems:"center",justifyContent:"center"}}>
                                     <Entypo name="chevron-small-down" size={20} color="black" />
                                 </View>
                             </TouchableOpacity>
                </View>}
                <View style={{ marginTop: 20 }}>
                    <Text style={[styles.text], { color:"#000", fontSize:height*0.02 }}>Mobile No or UID *</Text>
                    <TextInput
                         maxLength ={10}
                         value ={this.state.mobileNo}
                         selectionColor={themeColor}
                         onChangeText={(mobileNo) => { this.searchUser(mobileNo)}}
                         style={{ width: width * 0.7, height: 35, backgroundColor: inputColor, borderRadius: 5, padding: 10, marginTop: 10}}
                    />
                </View>
               {this.state.profiles.length>0&&<View style={{ marginTop: 20 ,}}>
                            <View style={{}}>
                                    <Text style={[styles.text], { color: "#000", fontSize:height*0.02 }}>Change Profile *</Text>

                            </View>
                              <TouchableOpacity style={{marginTop:10,backgroundColor:inputColor,height:35,width:width*0.4,flexDirection:"row"}}
                             
                             onPress={()=>{
                                 this.setState({profileModal:true})
                             }}
                             >
                                 <View style={{flex:0.8,alignItems:"center",justifyContent:"center"}}>
                                    <Text style={[styles.text,{color:"#000",fontSize:height*0.02}]}>{this.state.selectedProfile?this.state.selectedProfile.label:"Select"}</Text>
                                 </View>
                                 <View style={{flex:0.2,alignItems:"center",justifyContent:"center"}}>
                                     <Entypo name="chevron-small-down" size={20} color="black" />
                                 </View>
                             </TouchableOpacity>
                             {/* <View style={{marginLeft:10}}>
                                <DropDownPicker
                                    placeholder={"select Profile"}
                                    items={this.state.profiles}
                                    defaultValue={this.state.selectedProfile.value}
                                    containerStyle={{ height: 40, width: width * 0.4 }}
                                    style={{ backgroundColor: inputColor }}
                                    itemStyle={{
                                        justifyContent: 'flex-start'
                                    }}
                                    dropDownStyle={{ backgroundColor: inputColor, width: width * 0.4 }}
                                    onChangeItem={(item) => {
                                        if(item.value=="AddNew"){
                                            return this.setState({addModal:true})
                                        }
                                              this.setState({ 
                                                
                                                Age:item.age,
                                                patientsName:item.label, 
                                                healthIssues: item.healthIssues,
                                                selectedSex:item.sex,
                                                selectedProfile:item,
                                                mobileNo:item.mobile
                                                },()=>{
                                                this.searchAppoinment(item.mobile)
                                                this.searchTemplates(this.state.Age,this.state.Disease)
                                                })
                                            
                                }
                                }

                                />
                             </View> */}
                          
                        </View>}
                <View style={{ marginTop: 20 }}>
                                <Text style={[styles.text], { color: "#000",fontSize:height*0.02 }}>Patient's Name *</Text>
                    <TextInput
                        value ={this.state.patientsName}
                        selectionColor={themeColor}
                        onChangeText={(patientsName) => { this.setState({ patientsName }) }}
                                style={{ width: width * 0.7, height: 35, backgroundColor: inputColor, borderRadius: 5, padding: 10, marginTop: 10 }}
                    />
                </View>
                        <View style={{ marginTop: 20 }}>
                                <Text style={[styles.text], { color: "#000", fontSize:height*0.02 }}>Age *</Text>
                            <TextInput
                               keyboardType ={"numeric"}
                                value={this.state.Age}
                                selectionColor={themeColor}
                                onChangeText={(Age) => { this.setState({ Age })}}
                                style={{ width: width * 0.7, height: 35, backgroundColor:inputColor, borderRadius: 5, padding: 10, marginTop: 10 }}
                            />
                        </View>
                        <View style={{ marginTop: 20 ,}}>
                            <View style={{}}>
                                    <Text style={[styles.text], { color: "#000", fontSize:height*0.02 }}>Sex *</Text>

                            </View>
                           
                             {/* <View style={{marginLeft:10}}>
                                <DropDownPicker
                                    placeholder={"select"}
                                    items={this.state.sex}
                                    defaultValue={this.state.selectedSex}
                                    containerStyle={{ height: 40, width: width * 0.4 }}
                                    style={{ backgroundColor: inputColor }}
                                    itemStyle={{
                                        justifyContent: 'flex-start'
                                    }}
                                    dropDownStyle={{ backgroundColor: inputColor, width: width * 0.4 }}
                                    onChangeItem={item => this.setState({
                                        selectedSex: item.value
                                    })}

                                />
                             </View> */}
                             <TouchableOpacity style={{marginTop:10,backgroundColor:inputColor,height:35,width:width*0.4,flexDirection:"row"}}
                             
                             onPress={()=>{
                                 this.setState({sexModal:true})
                             }}
                             >
                                 <View style={{flex:0.8,alignItems:"center",justifyContent:"center"}}>
                                    <Text style={[styles.text,{color:"#000",fontSize:height*0.02}]}>{this.state.selectedSex?this.state.selectedSex:"Select"}</Text>
                                 </View>
                                 <View style={{flex:0.2,alignItems:"center",justifyContent:"center"}}>
                                     <Entypo name="chevron-small-down" size={20} color="black" />
                                 </View>
                             </TouchableOpacity>
                          
                        </View>
                        {/* <View style={{ marginTop: 20 }}>
                            <Text style={[styles.text], { fontWeight: "bold", fontSize:height*0.02 }}>Address</Text>
                            <TextInput
                                value={this.state.Address}
                                selectionColor={themeColor}
                             
                                onChangeText={(Address) => { this.setState({ Address }) }}
                                style={{ width: width * 0.9, height: height * 0.1, backgroundColor: "#fafafa", borderRadius: 15, padding: 10, marginTop: 10 ,textAlignVertical:"top"}}
                            />
                        </View> */}
                        <View style={{ marginTop: 20 }}>
                                <Text style={[styles.text], { color: "#000",fontSize:height*0.02 }}>Health issues</Text>
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
                                    style={{ width: width * 0.7, height: 35, backgroundColor:inputColor, borderRadius: 5, padding: 10, marginTop: 10, }}
                                />
                                <TouchableOpacity 
                                  style={{height:35,alignItems:"center",justifyContent:'center',width:width*0.15,borderRadius:10,backgroundColor:themeColor,marginTop:10}}
                                  onPress={()=>{this.pushIssues()}}
                               
                               >
                                    <Text style={[styles.text,{color:"#fff"}]}>Add</Text>
                                </TouchableOpacity>
                            </View>
                          
                        </View>
                       {this.state.mobileNo.length>9&& <View style={{ marginTop: 20 }}>
                                <Text style={[styles.text], { color: "#000",fontSize:height*0.02 }}>Appointment Details:</Text>
                            <View style={{flexDirection:"row",marginTop:5,marginLeft:10}}>
                                    <Text style={[styles.text, { color: "#000",color:"gray"}]}>Appointment Taken:</Text>
                                <Text style={[styles.text,{marginLeft:10}]}>{this.state.appointment_taken?"yes":"No"}</Text>
                            </View>
                            {this.state.appointment_taken&&<View style={{ flexDirection: "row", marginTop: 5, marginLeft: 10 }}>
                                    <Text style={[styles.text, { color: "#000",color: "gray" }]}>Token Id:</Text>
                                <Text style={[styles.text, { marginLeft: 10 }]}>{this.state.appointmentId}</Text>
                            </View>}
                        </View>}
                        <View style={{ marginTop: 20 }}>
                                <Text style={[styles.text], { color: "#000", fontSize:height*0.02 }}>Reason for this Visit</Text>
                            <TextInput
                                value ={this.state.Reason}
                                onChangeText={(Reason) => { this.setState({ Reason}) }}
                                selectionColor={themeColor}
                                multiline={true}
                                style={{ width: width * 0.7, height: height * 0.1, backgroundColor: inputColor, borderRadius: 5, padding: 10, marginTop: 10, textAlignVertical:"top"}}
                            />
                        </View>
                        <View style={{ marginTop: 20 ,}}>
                                <Text style={[styles.text], { color: "#000", fontSize:height*0.02 }}>Diagnosis *</Text>
                                {
                                    this.state.selectedDiagonosis.map((item,index)=>{
                                            return(
                                                <View style={{flexDirection:"row",alignItems:"center",justifyContent:"center",marginTop:5}} key={index}>
                                                       <View>
                                                              <Text style={[styles.text,{color:"#000"}]}>{item}</Text>
                                                       </View>
                                                       <TouchableOpacity 
                                                         onPress={()=>{this.removeSelectedDiagonis(item,index)}}
                                                       >
                                                            <Entypo name="circle-with-cross" size={24} color="red" />
                                                       </TouchableOpacity>
                                                </View>
                                            )
                                    })
                                }
                             <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-around"}}>
                                          <TextInput
                                value={this.state.Disease}
                                onChangeText={(Disease) => { this.searchDiseases(Disease) }}
                                selectionColor={themeColor}
                                style={{ width: width * 0.7, height:35, backgroundColor: inputColor,  padding: 10, marginTop: 10, textAlignVertical: "top" }}
                            />
                            <TouchableOpacity style={{height:35,width:width*0.15,alignItems:"center",justifyContent:"center",backgroundColor:themeColor,marginTop: 10,borderRadius:5}}
                             onPress={()=>{this.addDiagnosis()}}
                            >
                                  <Text style={[styles.text,{color:"#fff"}]}>Add</Text>
                            </TouchableOpacity>
                             </View>   
                       
                        </View>
                        {this.state.Diseases.length>0&&<ScrollView 
                        showsVerticalScrollIndicator ={false}
                                style={{
                                    width: width * 0.7, backgroundColor: '#fafafa', borderColor: "#333", borderTopWidth: 0.5,marginLeft:5
                                 
                                   }}>
                           {
                               this.state.Diseases.map((i,index)=>{
                                   return(
                                       <TouchableOpacity 
                                           key ={index}
                                           style={{padding:5,justifyContent:"center",width:width*0.6,borderColor:"#333",borderBottomWidth:0.3,height:35,}}
                                           onPress={() => { this.setState({ Disease: "",Diseases:[]},()=>{
                                               this.state.selectedDiagonosis.push(i.title)
                                               this.searchTemplates(this.state.Age, i.title)
                                           })}}
                                       >
                                           <Text style={[styles.text,{color:themeColor,}]}>{i.title}</Text>
                                       </TouchableOpacity>
                                   )
                               })
                           }
                        </ScrollView>}
                            <View style={{ marginTop: 20 }}>
                                <Text style={[styles.text], { color: "#000", fontSize:height*0.02 }}>Medicines Given</Text>
                                <View style={{ flexDirection: "row", marginTop: 20, alignItems: 'center', justifyContent: "space-around" }}>
                                    <TouchableOpacity style={{ alignItems: "center", justifyContent: 'center', flexDirection: "row" }}
                                        onPress={() => { this.props.navigation.navigate("SearchMedicines", { backFunction2: (medicines) => { this.backFunction2(medicines) },toGive:true }) }}
                                    >
                                        <AntDesign name={"search1"} size={30} color={themeColor} />
                                    </TouchableOpacity>

                                </View>

                            </View>
                            {
                                this.state.MedicinesGiven.map((item, index) => {
                                    return (
                                      
                                        <MedicineDetails2 
                                        item={item} 
                                        index={index} 
                                        changeFunction={(type, value, index) => { this.changeFunction2(type, value, index) }}
                                        diagonsis={[...this.state.selectedDiagonosis]}
                                        />
                                      
                                    )
                                })
                            }
                <View style={{ marginTop: 20 }}>
                                <Text style={[styles.text], { color: "#000", fontSize:height*0.02 }}>Prescribe Medicines *</Text>
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
                                                        <MedicineDetails 
                                    item={item} 
                                    index={index}
                                    medicinesGiven = {this.state.MedicinesGiven} 
                                    changeFunction={(type, value, index) => { this.changeFunction(type, value, index)}} 
                                    diagonsis={[...this.state.selectedDiagonosis]}

                                    />
                        )
                  })
              }
                         
               
       
          
                
                        <View style={{ marginTop: 20 }}>
                                <Text style={[styles.text], { color: "#000", fontSize:height*0.02 }}>Doctor Fees *</Text>
                            <TextInput
                                value={this.state.doctorFees}
                                selectionColor={themeColor}
                                keyboardType="numeric"
                                onChangeText={(doctorFees) => { this.setState({ doctorFees }) }}
                                style={{ width: width * 0.7, height: 35, backgroundColor: inputColor, borderRadius: 5, padding: 10, marginTop: 10 }}
                            />
                        </View>
                            <View style={{marginTop:10}}>

                                <Text style={[styles.text], { color: "#000", fontSize:height*0.02, }}>Next Visit</Text>
                            </View>
                            <TouchableOpacity 
                              onPress={() => { this.setState({ show1: true }) }}
                              style={{ width: width * 0.7, height: height * 0.05, backgroundColor: inputColor, borderRadius: 5, padding: 10, marginTop: 10 ,flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>
                              
                              
                              <View style={{alignItems:"center",justifyContent:"center"}}>
                                    <Text style={[styles.text]}>{this.state.nextVisit}</Text>
                              </View>
                                <View style={{}}>
                                    <View
                                        
                                    >
                                        <AntDesign name="calendar" size={24} color="black" />
                                    </View>

                                
                                </View>
                           
                        </TouchableOpacity>
                        {
                            this.state.selectedReports.map((item,index)=>{
                                    return(
                                  <View style={{flexDirection:"row",alignItems:"center",justifyContent:"center",marginTop:10}} key={index}>
                                                       <View>
                                                              <Text style={[styles.text,{color:"#000"}]}>{item}</Text>
                                                       </View>
                                                       <TouchableOpacity 
                                                         onPress={()=>{this.removeSelectedReport(item,index)}}
                                                       >
                                                            <Entypo name="circle-with-cross" size={24} color="red" />
                                                       </TouchableOpacity>
                                    </View>
                                    )
                            })
                        }
                                <View style={{ marginTop: 20 }}>
                                <Text style={[styles.text], { color: "#000", fontSize:height*0.02 }}>Suggest Report</Text>
                            <TextInput
                                value={this.state.report}
                                onChangeText={(report) => { this.searchReports(report) }}
                                selectionColor={themeColor}
                                multiline={true}
                                style={{ width: width * 0.7, height:35, backgroundColor: inputColor,  padding: 10, marginTop: 10, textAlignVertical: "top" }}
                            />
                        </View>
                        {this.state.reports.length>0&&<ScrollView 
                        showsVerticalScrollIndicator ={false}
                                style={{
                                    width: width * 0.7, backgroundColor: '#fafafa', borderColor: "#333", borderTopWidth: 0.5
                                 
                                   }}>
                           {
                               this.state.reports.map((i,index)=>{
                                   return(
                                       <TouchableOpacity 
                                           key ={index}
                                           style={{justifyContent:"center",width:width*0.9,borderColor:"#333",borderBottomWidth:0.3,height:35}}
                                           onPress={() => { 
                                               this.state.selectedReports.push(i.title)
                                               this.setState({ report:"",reports:[]})
                                            }}
                                       >
                                           <Text style={[styles.text,{color:themeColor,}]}>{i.title}</Text>
                                       </TouchableOpacity>
                                   )
                               })
                           }
                        </ScrollView>}
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
                    {
                        this.addModal()
                    }
                    {
                        this.sexModal()
                    }
                    {
                        this.changeProfileModal()
                    }
                    {
                        this.doctorModal()
                    }
        </View>
                </KeyboardAvoidingView>
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