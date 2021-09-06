import React, { Component } from 'react';
import { View, Text, Dimensions, TouchableOpacity, StyleSheet, TextInput, FlatList, Image, SafeAreaView, StatusBar,ActivityIndicator ,ScrollView} from 'react-native';
import { Ionicons, Entypo, AntDesign } from '@expo/vector-icons';
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
            selectedProfile:null
        };
    }

   componentDidMount(){
    
   }
    searchUser = async (mobileNo) => {
        let api = `${url}/api/profile/userss/?search=${mobileNo}&role=Customer`
        this.setState({ patientNo: mobileNo ,})
     
        if (mobileNo.length > 9) {
            this.setState({loading:true})
           let data =await HttpsClient.get(api)
           if(data.type =="success"){
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
               this.setState({loading:false})
           }
        }
    }
   searchReports = async(report)=>{
       this.setState({report})   
         let api =`${url}/api/prescription/reportcategory/`
         const data = await HttpsClient.get(api)
         if(data.type=="success"){
               this.scrollRef.scrollTo( {x:0,y:height,animated: true})
               this.setState({reports:data.data})
         }
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
                          ref={ref=>this.scrollRef=ref}
                         >
                              <View style={{ marginTop: 20 ,paddingHorizontal:20}}>
                                <Text style={[styles.text], { color:"#000", fontSize: 18 }}>Mobile No</Text>
                                <TextInput
                                    maxLength ={10}
                                    value ={this.state.mobileNo}
                                    selectionColor={themeColor}
                                    keyboardType="numeric"
                                    onChangeText={(mobileNo) => { this.searchUser(mobileNo)}}
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
                                                  <View style={{ marginTop: 20,paddingHorizontal:20 }}>
                                <Text style={[styles.text], { color: "#000", fontSize: 18 }}>Age</Text>
                            <TextInput
                               keyboardType ={"numeric"}
                                value={this.state.Age}
                                selectionColor={themeColor}
                                onChangeText={(Age) => { this.setState({ Age })}}
                                style={{ width: width * 0.7, height: 35, backgroundColor:inputColor, borderRadius: 10, padding: 10, marginTop: 10 }}
                            />
                        </View>
                              <View style={{ marginTop: 20 ,paddingHorizontal:20}}>
                                  <Text style={[styles.text], { color: "#000",fontSize: 18 }}>Enter Prescription Id</Text>
                                    <TextInput
                                        value ={this.state.patientsName}
                                        selectionColor={themeColor}
                                        onChangeText={(patientsName) => { this.setState({ patientsName }) }}
                                                style={{ width: width * 0.7, height: 35, backgroundColor: inputColor, borderRadius: 10, padding: 10, marginTop: 10 }}
                                    />
                               </View>
            
                            <View style={{ marginTop: 20 ,paddingHorizontal:20}}>
                            <View style={{}}>
                                    <Text style={[styles.text], { color: "#000", fontSize: 18 }}>Select Type of Report</Text>
                                               <TextInput
                                value={this.state.report}
                                onChangeText={(report) => { this.searchReports(report) }}
                                selectionColor={themeColor}
                                multiline={true}
                                style={{ width: width * 0.9, height:35, backgroundColor: inputColor,  padding: 10, marginTop: 10, textAlignVertical: "top" }}
                            />
                            </View>
                           
                       {this.state.reports.length>0&&<ScrollView 
                        showsVerticalScrollIndicator ={false}
                                style={{
                                    width: width * 0.9, backgroundColor: '#fafafa', borderColor: "#333", borderTopWidth: 0.5
                                 
                                   }}>
                           {
                               this.state.reports.map((i,index)=>{
                                   return(
                                       <TouchableOpacity 
                                           key ={index}
                                           style={{padding:15,justifyContent:"center",width:width*0.9,borderColor:"#333",borderBottomWidth:0.3,height:35}}
                                           onPress={() => { this.setState({ report:i.title,reports:[]},()=>{
                                          
                                           })}}
                                       >
                                           <Text style={[styles.text,{color:themeColor,}]}>{i.title}</Text>
                                       </TouchableOpacity>
                                   )
                               })
                           }
                        </ScrollView>}
                          
                        </View>
                              <View style={{ marginTop: 20 ,paddingHorizontal:20}}>
                                  <Text style={[styles.text], { color: "#000",fontSize: 18 }}>Upload File</Text>
                                  <TouchableOpacity style={{marginTop:20,alignItems:"center",justifyContent:"center"}}>
                                         <Ionicons name="document-attach" size={24} color="black" />
                                  </TouchableOpacity>
                               </View>

                               <View>
                                    
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