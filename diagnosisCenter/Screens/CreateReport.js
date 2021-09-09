import React, { Component } from 'react';
import { View, Text, Dimensions, TouchableOpacity, StyleSheet, TextInput, FlatList, Image, SafeAreaView, StatusBar,ActivityIndicator ,ScrollView,Keyboard,AsyncStorage} from 'react-native';
import { Ionicons, Entypo, AntDesign,Fontisto } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { selectTheme } from '../../actions';
import settings from '../../AppSettings';
const screenHeight = Dimensions.get("screen").height
const { height, width } = Dimensions.get("window");
const fontFamily = settings.fontFamily;
const themeColor = settings.themeColor;
const inputColor=settings.TextInput;
import axios from 'axios';
import moment from 'moment';
import DropDownPicker from 'react-native-dropdown-picker';
import HttpsClient from '../../api/HttpsClient';
import Modal from 'react-native-modal';
// import * as DocumentPicker from 'expo-document-picker';
import * as mime from 'react-native-mime-types';
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as  ImagePicker from 'expo-image-picker';
import DocumentPicker from 'react-native-document-picker'
import { compose } from 'redux';
const url = settings.url; 
class CreateReport extends Component {
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
        this.state = {
            selectedSex:null,
            sex,
            patientNo:"",
            profiles:[],
            user:null,
            loading:false,
            Age:"",
            PrescriptionId:"",
            reports:[],
            report:"",
            patientsName:"",
            selectedProfile:null,
            selectedFile:null,
            creating:false,
       
            suggestedReports:[],
            userFound:false,
            addModal:false,
            keyBoardHeight:0,
            files:[],
            searched:false,
            reportObj:null,
            resultDate:null,
            dob:"",
            bloodGroup:""
        };
    }
    
addReport =()=>{
    if(!this.state.searched){
         return this.showSimpleMessage("Please Select Report by Searching Only","orange","info")   
    }

  let pushObj ={
      report :this.state.reportObj,
      file:this.state.selectedFile||null
  }
  this.state.files.push(pushObj)
  this.setState({files:this.state.files,addModal:false})
}
     componentDidMount(){
         Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
   
 
      }
         _keyboardDidShow = (e) => {
    
        this.setState({keyBoardHeight:e.endCoordinates.height})
    };

    _keyboardDidHide = () => {
        this.setState({ keyBoardHeight: 0 })
    };
   componentWillUnmount(){
  
        Keyboard.removeListener('keyboardDidShow', this._keyboardDidShow);
        Keyboard.removeListener('keyboardDidHide', this._keyboardDidHide);
   }

    hideDatePicker = () => {
        this.setState({ show1: false })
    };
    handleConfirm = (date) => {
          
        let resultDate =  moment(date).format('YYYY-MM-DD')
        this.setState({ resultDate,show1:false})
        
        this.hideDatePicker();
    };
        hideDatePicker2 = () => {
        this.setState({ show: false })
    };

    handleConfirm2 = (date) => {
        this.setState({ dob: moment(date).format('YYYY-MM-DD'), show: false, date: new Date(date) })
        this.hideDatePicker();
    };
   selectFile = async()=>{
       try {
  const res = await DocumentPicker.pick({
  
  })

        const photo = {
            uri:   res[0].uri,
            type:res[0].type,
            name: res[0].name,
        };
           this.setState({selectedFile:photo})
} catch (err) {
  if (DocumentPicker.isCancel(err)) {
     
  } else {
    throw err
  }
}


}
    searchUser = async (mobileNo) => {
        let api = `${url}/api/profile/userss/?search=${mobileNo}&role=Customer`
        this.setState({ patientNo: mobileNo ,})
     
        if (mobileNo.length > 9) {
            this.setState({loading:true})
           let data =await HttpsClient.get(api)
           if(data.type =="success"){
                 this.setState({loading:false})
                   if(data.data.length>0){
                           this.setState({userfound:true,})
                    let profiles =[]
                    let pushObj ={
                        label:data.data[0].name,
                        value:data.data[0].user.id,
                        age:data.data[0].age,
                        sex:data.data[0].sex,
                        mobile:data.data[0].mobile
                    }
                    profiles.push(pushObj)
                    data.data[0].childUsers.forEach((item)=>{
                        let pushObj ={
                            label:item.name,
                            value:item.childpk,
                            mobile:item.mobile,
                            age:item.age,
                            sex:item.sex
                        }
                        profiles.push(pushObj)
                    })
                   this.setState({profiles,selectedProfile:profiles[0]})
                   this.setState({ patientsName:profiles[0].label, user: profiles[0],loading:false,selectedSex:profiles[0].sex,Age:profiles[0].age.toString()})
                   }
         
               
           }else{
               alert
               this.setState({loading:false})
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
    
   searchReports = async(report)=>{
       this.setState({report,searched:false})   
        let api =`${url}/api/prescription/labreports/?clinic=${this.props.clinic.clinicpk}`
        console.log(api)
         const data = await HttpsClient.get(api)
         if(data.type=="success"){
               
               this.setState({reports:data.data,})
         }
    }
       removeSelectedReport =(item,index)=>{
        let duplicate = this.state.files
         duplicate.splice(index,1)
         this.setState({files:duplicate})
    }
    getPrescription = async()=>{
       this.setState({loading:true,userFound:false})
       let api = `${url}/api/prescription/prescriptions/${this.state.PrescriptionId}/`
       let data = await HttpsClient.get(api)
       console.log(api)
       if(data.type=="success"){
            this.setState({loading:false})
            if(data?.data?.id){
                this.setState({
                    userFound:true, 
                    patientsName:data.data.username.name, 
                    loading:false,
                    selectedSex:data.data.sex,
                    Age:data.data.age.toString(),
                    suggestedReports:data.data.reports,
                    patientNo:data.data.username.mobile
                })
            }
   
       }else{
            this.setState({loading:false})
       }
    }
     handleCheck = ()=>{
       
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.getPrescription();
        }, 700);
    }



    create = async()=>{
                //    cases:
        // 1.if user enter the prescription id
        // 2.if user enter the mobileNo
        // 3.NO details about the user
       this.setState({creating:true})
      if(!this.state.userFound){
          if(this.state.dob==""){
               this.setState({creating:false})
              return this.showSimpleMessage("Please enter Dob","orange","info")
          }
      }
        
       if(this.state.patientNo==""){
           this.setState({creating:false})
           return this.showSimpleMessage("Please Enter Mobile No","orange","info")
       }
        if(this.state.patientNo.length<10){
           this.setState({creating:false})
           return this.showSimpleMessage("Please Enter 10 Digit Mobile No","orange","info")
       }
       if(this.state.patientsName==""){
           this.setState({creating:false})
           return this.showSimpleMessage("Please Enter Name","orange","info")
       }
       if(this.state.selectedSex==null){
           this.setState({creating:false})
           return this.showSimpleMessage("Please select Sex","orange","info")
       }

        let api = `${url}/api/prescription/addLabReport/`
      
     
       
        let sendData ={
      
            clinic:this.props.clinic.clinicpk,
            result_expected:this.state.resultDate,
            bodyType:"formData",
      
        }
   

          if(this.state.userFound){
             sendData.prescription = this.state.PrescriptionId
        }else{
            sendData.name= this.state.patientsName,
            sendData.mobile = this.state.patientNo,
            sendData.sex = this.state.selectedSex,
            sendData.dob = this.state.dob,
            sendData.blood_group = this.state.bloodGroup
        }
              let  reports = []
        this.state.files.forEach((item,index)=>{
            if(item.file){
                     sendData[`file${index}`]=item.file
            }
               
                reports.push(item.report.id)
                const dataa = JSON.stringify(reports)
                sendData["reports"] = dataa
        })
        console.log(sendData)
        let post = await HttpsClient.post(api,sendData)
        console.log(post)
        if(post.type=="success"){
             this.setState({creating:false})
             this.props.navigation.goBack();
             return this.showSimpleMessage("Report Created Successfully","green","success")
        }else{
             this.setState({creating:false})
             return this.showSimpleMessage("Something Went Wrong","red","danger")
        }
    }
    componentDidUpdate(prevProps, prevState){
        if (prevState.PrescriptionId !== this.state.PrescriptionId) {
         
           this.handleCheck()
        }
    }
    removeSelectedFile =(item,index)=>{
         let duplicate = this.state.files
         duplicate.splice(index,1)
         this.setState({files:duplicate})
    }
    addReportModal = ()=>{
        return(
            <Modal 
              deviceHeight={screenHeight}
              statusBarTranslucent={true}
              isVisible={this.state.addModal}
               onBackdropPress={()=>{this.setState({addModal:false})}}
               style={{marginBottom:this.state.keyBoardHeight}}
            >
              <View style={{height:height*0.6,width:width*0.9,backgroundColor:"#fff",borderRadius:10}}>
                    <ScrollView>
                          <View style={{alignItems:"center",justifyContent:"center",marginVertical:20}}>
                                <Text style={[styles.text,{color:"#000"}]}> Add Report Details :</Text>
                          </View>
                            <View style={{paddingHorizontal:20}}>
                                    <Text style={[styles.text], { color: "#000", }}>Select Type of Reports</Text>
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
                                    width: width * 0.7, backgroundColor: '#fafafa', borderColor: "#333", borderTopWidth: 0.5,marginLeft:20
                                 
                                   }}>
                           {
                               this.state.reports.map((i,index)=>{
                                   return(
                                       <TouchableOpacity 
                                           key ={index}
                                           style={{padding:15,justifyContent:"center",width:width*0.7,borderColor:"#333",borderBottomWidth:0.3,height:35}}
                                           onPress={()=>{
                                               
                                               this.setState({report:i.other_title,reports:[],searched:true,reportObj:{id:i.id,report:i.other_title}})
                                           }}
                                       >
                                           <Text style={[styles.text,{color:themeColor,}]}>{i.other_title}</Text>
                                       </TouchableOpacity>
                                   )
                               })
                           }
                        </ScrollView>}
                          <View style={{ marginTop: 20 ,paddingHorizontal:20}}>
                                  <Text style={[styles.text], { color: "#000",fontSize: 18 }}>Upload File</Text>
                                  <TouchableOpacity style={{marginTop:20,alignItems:"center",justifyContent:"center"}}
                                    onPress={()=>{
                                       this.selectFile()
                                    }}
                                  >
                                         <Ionicons name="document-attach" size={24} color="black" />
                                  </TouchableOpacity>
                            
                                  
                                     <View style={{alignItems:"center",justifyContent:"center",flexDirection:"row"}}>
                                         <View>
                                                 <Text style={[styles.text,{color:'#000'}]}>{this?.state?.selectedFile?.name}</Text> 
                                         </View>
                                            
                                     </View>
                       
                       
                               </View>
                               <View style={{alignItems:"center",justifyContent:"center",marginVertical:30}}>
                                   <TouchableOpacity style={{height:height*0.04,width:width*0.4,alignItems:"center",justifyContent:"center",backgroundColor:themeColor,borderRadius:5}}
                                    onPress={()=>{this.addReport()}}
                                   >
                                         <Text style={[styles.text,{color:"#fff"}]}>Add Report</Text>
                                   </TouchableOpacity>
                               </View>
                    </ScrollView>
              </View>
            </Modal>
        )
    }
    render() {
        return (
            <>
                <SafeAreaView style={styles.topSafeArea} />
                <SafeAreaView style={styles.bottomSafeArea}>
                 <StatusBar backgroundColor={themeColor} barStyle={"default"} />
                           <View style={{ height: height * 0.1, backgroundColor: themeColor, flexDirection: 'row', alignItems: "center" }}>
                              <TouchableOpacity style={{flex:0.2,alignItems:"center",justifyContent:'center'}}
                                onPress={()=>{this.props.navigation.goBack()}}
                              >
                                  <Ionicons name="chevron-back-circle" size={30} color="#fff" />
                              </TouchableOpacity>
                            <View style={{ flex: 0.6, alignItems: "center", justifyContent: "center" }}>
                                <Text style={[styles.text, { color: '#fff', fontWeight: 'bold', fontSize: 18 }]}>Create Report</Text>
                            </View>
                             <View style={{flex:0.2}}>
                                  
                             </View>
                        </View>
                         <ScrollView 
                           showsVerticalScrollIndicator={false}
                          ref={ref=>this.scrollRef=ref}
                         >
                                 <View style={{ marginTop: 20 ,paddingHorizontal:20}}>
                                  <Text style={[styles.text], { color: "#000",fontSize: 18 }}>Enter Prescription Id</Text>
                                    <TextInput
                                        value ={this.state.PrescriptionId}
                                        selectionColor={themeColor}
                                        onChangeText={(PrescriptionId) => { this.setState({ PrescriptionId }) }}
                                                style={{ width: width * 0.7, height: 35, backgroundColor: inputColor, borderRadius: 10, padding: 10, marginTop: 10 }}
                                    />
                               </View>
                              <View style={{ marginTop: 20 ,paddingHorizontal:20}}>
                                <Text style={[styles.text], { color:"#000", fontSize: 18 }}>Mobile No</Text>
                                <TextInput
                                    maxLength ={10}
                                    value ={this.state.patientNo}
                                    selectionColor={themeColor}
                                    keyboardType="numeric"
                                    onChangeText={(patientNo) => { this.searchUser(patientNo)}}
                                            style={{ width: width * 0.7, height: 35, backgroundColor: inputColor, borderRadius: 10, padding: 10, marginTop: 10}}
                                />
                               </View>
                               {this.state?.profiles?.length>0&&<View style={{ marginTop: 20 ,flexDirection:"row",paddingHorizontal:20}}>
                            <View style={{alignItems:"center",justifyContent:"center"}}>
                                    <Text style={[styles.text], { color: "#000", fontSize: 18 }}>Change Profile</Text>

                            </View>
                           
                             <View style={{marginLeft:10}}>
                                <DropDownPicker
                                    placeholder={"select Profile"}
                                    defaultValue={this.state.selectedProfile.value}
                                    items={this.state.profiles}
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
                                        this.setState({selectedProfile:item,patientsName:item.label,loading:false,selectedSex:item.sex,Age:item.age.toString()})
                                }
                                }

                                />
                             </View>
                          
                        </View>}
                               <View style={{ marginTop: 20 ,paddingHorizontal:20}}>
                                  <Text style={[styles.text], { color: "#000",fontSize: 18 }}>Patient's Name</Text>
                                    <TextInput
                                        value ={this.state.patientsName}
                                        selectionColor={themeColor}
                                        onChangeText={(patientsName) => { this.setState({ patientsName }) }}
                                                style={{ width: width * 0.7, height: 35, backgroundColor: inputColor, borderRadius: 10, padding: 10, marginTop: 10 }}
                                    />
                               </View>
                                          <View style={{ marginTop: 20 ,flexDirection:"row",paddingHorizontal:20}}>
                            <View style={{alignItems:"center",justifyContent:"center"}}>
                                    <Text style={[styles.text], { color: "#000", fontSize: 18 }}>Sex</Text>

                            </View>
                           
                             <View style={{marginLeft:10}}>
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
                             </View>
                          
                        </View>
                    {!this.state.userFound?  <View style={{marginTop:20,paddingHorizontal:20}}>
                                    <Text style={[styles.text,{color:"#000",fontSize: 18}]}>Date of Birth</Text>
                                    <View style={{ width: width * 0.8, height: height * 0.05, borderRadius: 15, backgroundColor:inputColor, margin: 10, paddingLeft: 10,flexDirection:"row" }}>
                                        <TouchableOpacity style={{alignItems:'center',justifyContent:'center'}}
                                         onPress ={()=>{this.setState({show:true})}}
                                        >
                                            <Fontisto name="date" size={24} color="black" />
                                        </TouchableOpacity>
                                        <View style={{marginLeft:10,alignItems:"center",justifyContent:'center'}}>
                                            <Text>{this.state.dob}</Text>
                                        </View>

                                    </View>
                                 
                         </View>:
                  <View style={{marginTop:20,paddingHorizontal:20}}>
                                    <Text style={[styles.text,{color:"#000",fontSize: 18}]}>Age</Text>
                                    <TextInput 
                                      selectionColor={themeColor}
                                      value={this.state.Age}
                                      onChangeText={(Age)=>{Age}}
                                      style={{ width: width * 0.8, height: height * 0.05, borderRadius: 15, backgroundColor: inputColor, margin: 10, paddingLeft: 10,flexDirection:"row" }}
                                       

                                   />
                                 
                         </View>
                         }
                            
       {!this.state.userFound&&  <View style={{marginTop:20,paddingHorizontal:20}}>
                                    <Text style={[styles.text,{color:"#000",fontSize: 18}]}>Blood Group</Text>
                                    <TextInput 
                                      selectionColor={themeColor}
                                      value={this.state.bloodGroup}
                                      onChangeText={(bloodGroup)=>{this.setState({bloodGroup})}}
                                      style={{ width: width * 0.8, height: height * 0.05, borderRadius: 15, backgroundColor: inputColor, margin: 10, paddingLeft: 10,flexDirection:"row" }}
                                       

                                   />
                                 
                         </View>}
                            <View style={{ marginTop: 20 ,paddingHorizontal:20}}>
                                      {this.state.suggestedReports.length>0&&<Text style={[styles.text], { color: "#000", fontSize: 18 }}>Suggested Reports :</Text>}
                                 {
                            this.state.suggestedReports.map((item,index)=>{
                                    return(
                                  <View 
                                    key={index}
                                   style={{flexDirection:"row",alignItems:"center",justifyContent:"center",marginTop:10}} key={index}>
                                                       <View>
                                                              <Text style={[styles.text,{color:"#000"}]}>{index+1}.{item}</Text>
                                                       </View>
                                                
                                    </View>
                                    )
                            })
                        }
                
                           
                 
                          
                        </View>
                                <View style={{ marginTop: 20 ,alignItems:"center",justifyContent:"center"}}>
                                    <View>
                                           <Text style={[styles.text], { color: "#000",fontSize: 18 }}>Add Report</Text>
                                    </View>
                                    <TouchableOpacity style={{marginTop:10}}
                                     onPress={()=>{this.setState({addModal:true})}}
                                    >
                                            
                                               <Ionicons name="add-circle" size={34} color="black" />
                                    </TouchableOpacity>
                               
                                   
                       
                               </View>
                               {
                                   this.state.files.map((item,index)=>{
                                        return(
                                            <View style={{flexDirection:"row"}} key={index}>
                                                <View style={{flex:0.2,alignItems:"center",justifyContent:"center"}}>
                                                    <Text style={[styles.text,{color:"#000"}]}>{index+1} .</Text>
                                                </View>
                                                <View style={{flex:0.6}}>
                                                            <View style={{marginTop:10}}>
                                                            <Text style={[styles.text,{color:"#000"}]}>Report Name :{item.report.report}</Text>
                                                        </View>
                                                        <View style={{marginTop:10}}>
                                                            <Text style={[styles.text,{color:"#000"}]}>File :{item?.file?.name}</Text>
                                                        </View>
                                                </View>
                                                <TouchableOpacity style={{flex:0.2,alignItems:"center",justifyContent:"center"}}
                                                  onPress={()=>{this.removeSelectedReport(item,index)}}
                                                >
                                                        <Entypo name="circle-with-cross" size={24} color="red" />
                                                </TouchableOpacity>
                                            </View>
                                        )
                                   })
                               }
                                    <View style={{paddingHorizontal:20,marginTop:20}}>

                                <Text style={[styles.text], { color: "#000", fontSize: 18, }}>Result Expected On</Text>
                            </View>
                            <TouchableOpacity 
                              onPress={() => { this.setState({ show1: true }) }}
                              style={{ width: width * 0.7, height: height * 0.05, backgroundColor: inputColor, borderRadius: 15, padding: 10, marginTop: 10 ,flexDirection:"row",alignItems:"center",justifyContent:"space-between",marginLeft:20}}>
                              
                              
                              <View style={{alignItems:"center",justifyContent:"center"}}>
                                    <Text style={[styles.text]}>{this.state.resultDate}</Text>
                              </View>
                                <View style={{}}>
                                    <View
                                        
                                    >
                                        <AntDesign name="calendar" size={24} color="black" />
                                    </View>

                                
                                </View>
                           
                        </TouchableOpacity>
                               <View style={{marginVertical:30,alignItems:"center",justifyContent:"center"}}>
                                       {!this.state.creating? <TouchableOpacity style={{height:height*0.04,width:width*0.3,alignItems:"center",justifyContent:"center",backgroundColor:themeColor,borderRadius:5}}
                                          onPress={()=>{this.create()}}
                                        >
                                              <Text style={[styles.text,{color:"#fff"}]}>Create</Text>
                                        </TouchableOpacity>:
                                        <View style={{height:height*0.04,width:width*0.3,alignItems:"center",justifyContent:"center",backgroundColor:themeColor,borderRadius:5}}>
                                            <ActivityIndicator size={"small"}  color={"#fff"}/>
                                        </View>
                                        }
                               </View>
                         </ScrollView>
                               <View style={styles.centeredView}>
                            <Modal
                             isVisible={this.state.loading}
                             deviceHeight ={screenHeight}
                            >
                                <View style={styles.centeredView}>
                                    <View style={styles.modalView}>
                                     <ActivityIndicator color={themeColor} size ="large" />
                                      
                                    </View>
                                </View>
                            </Modal>
                        
                        </View>
                        {
                            this.addReportModal()
                        }
                                 <DateTimePickerModal
                        isVisible={this.state.show1}
                        mode="date"
                        onConfirm={this.handleConfirm}
                        onCancel={this.hideDatePicker}
                    />
                       <DateTimePickerModal
                                    isVisible={this.state.show}
                                    mode="date"
                                    onConfirm={this.handleConfirm2}
                                    onCancel={this.hideDatePicker2}
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
})
const mapStateToProps = (state) => {

    return {
        theme: state.selectedTheme,
        user:state.selectedUser,
        clinic: state.selectedClinic
    }
}
export default connect(mapStateToProps, { selectTheme })(CreateReport);