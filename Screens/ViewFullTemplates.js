import React, { Component } from 'react';
import { View, Text, Dimensions, TouchableOpacity, StyleSheet, TextInput, FlatList, Image, SafeAreaView, StatusBar, ActivityIndicator, ScrollView, Keyboard, Alert} from 'react-native';
import { Ionicons, Entypo, AntDesign, FontAwesome} from '@expo/vector-icons';
import { connect } from 'react-redux';
import { selectTheme } from '../actions';
import settings from '../AppSettings';
import medicine from '../components/Medicine';
import Medicine from '../components/Medicine';
import HttpsClient from '../api/HttpsClient';
const { height, width } = Dimensions.get("window");
const fontFamily = settings.fontFamily;
const themeColor = settings.themeColor;
import axios from 'axios';
import DropDownPicker from 'react-native-dropdown-picker';
import moment from 'moment';
import Modal from 'react-native-modal';
import MedicineDetailsTemplate from '../components/MedicineDetailsTemplate';
import MedicineTemplateView2 from '../components/MedicineTemplateView2';
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";
const screenHeight= Dimensions.get("screen").height
const url = settings.url;
const ages = [
    {
        label: "0-3", value:"0-3"
    },
    {
        label: "4-18", value: "4-18"
    },
    {
        label: "18-35", value: "18-35"
    },
    {
        label: "35-60", value: "35-60"
    },
    {
        label: "60-120", value: "60-120"
    },
]
class ViewFullTemplates extends Component {
    constructor(props) {
        let item = props.route.params.item
        super(props);
        this.state = {
          item,
          edit:false,
          template:null,
          selectedCategory:null,
          priscribed:[],
          MedicinesGiven:[],
          modal:false,
          priscribedEdit:[],
          MedicinesGivenEdit:[],
          showTab:true
        };
    }
    filterMedicines = () =>{
        let priscribed = this.state.template.medicines.filter((item) => !item.is_given)
        let MedicinesGiven = this.state.template.medicines.filter((item) => item.is_given)
        this.setState({ priscribed, MedicinesGiven, priscribedEdit:[...priscribed],MedicinesGivenEdit:[...MedicinesGiven]})
    }
    getMedicines= async()=>{
        let api = `${url}/api/prescription/templateEdit/?templateid=${this.state.item.id}`
        const data = await HttpsClient.get(api)
        if(data.type =="success"){
            this.setState({ medicines: data.data.medicines, template:data.data,selectedCategory:data.data.category},()=>{
                this.filterMedicines()
            })
        }
    }
    changeFunction = (type, value, index) => {
        let duplicate = this.state.priscribedEdit

        if (type == "delete") {
            duplicate.splice(index, 1)
            return this.setState({ priscribedEdit: duplicate });
        }
        if (type == "morning_count") {
            duplicate[index].morning_count = value
            return this.setState({ priscribedEdit: duplicate })
        }
        if (type == "afternoon_count") {
            duplicate[index].afternoon_count = value
            return this.setState({ priscribedEdit: duplicate })
        }
        if (type == "night_count") {
            duplicate[index].night_count = value
            return this.setState({ priscribedEdit: duplicate })
        }
        if (type == "after_food") {
            duplicate[index].after_food = value
            return this.setState({ priscribedEdit: duplicate })
        }
        if (type == "total_qty") {
            duplicate[index].total_qty = value
            return this.setState({ priscribedEdit: duplicate })
        }
        if (type == "days") {
            duplicate[index].days = value
            return this.setState({ priscribedEdit: duplicate })
        }
        if (type == "comment") {
            duplicate[index].command = value
            return this.setState({ priscribedEdit: duplicate })
        }
        if (type == "variant") {
            duplicate[index].variant = value
            return this.setState({ priscribedEdit: duplicate })
        }
        if (type == "type") {
            duplicate[index].type = value
            return this.setState({ priscribedEdit: duplicate })
        }
        if (type == "name") {
            duplicate[index].title = value
            duplicate[index].medicine = value
            return this.setState({ priscribedEdit: duplicate })
        }
        if (type == "validTimes") {
            duplicate[index].invalid_count = value
            return this.setState({ priscribedEdit: duplicate })
        }
        if (type == "containsDrugs") {
            duplicate[index].is_drug = value
            return this.setState({ priscribedEdit: duplicate })
        }
    }

    changeFunction2 = (type, value, index) => {
        let duplicate = this.state.MedicinesGivenEdit
        if (type == "total_qty") {
            duplicate[index].total_qty = value
            return this.setState({ MedicinesGivenEdit: duplicate })
        }
        if (type == "comment") {
            duplicate[index].command = value
            return this.setState({ MedicinesGivenEdit: duplicate })
        }
        if (type == "delete") {
            duplicate.splice(index, 1)
            return this.setState({ MedicinesGivenEdit: duplicate })
        }

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
    backFunction = (medicines) => {
        try {
            medicines.forEach((i) => {
                i.after_food = false,
                    i.morning_count = 0,
                    i.afternoon_count = 0,
                    i.night_count = 0,
                    i.total_qty = 0,
                    i.days = 0,
                    i.medicine = i?.title,
                    i.is_drug = false,
                    i.invalid_count = 0,
                    i.is_given = false
            })
        } catch (e) {

        }

        this.setState({ priscribedEdit: this.state.priscribedEdit.concat(medicines) })
    }
    backFunction2 =(medicines) => {
        try {
            medicines.forEach((i) => {
                i.is_given = true,
                    i.total_qty = 0,
                    i.medicine = i.id
            })
        } catch (e) {

        }

        this.setState({ MedicinesGivenEdit: this.state.MedicinesGivenEdit.concat(medicines) })
    }
    delete = async() =>{
        let api = `${url}/api/prescription/prescriptionTemplates/${this.state.item.id}/`
        let del = await HttpsClient.delete(api)
        if(del.type =="success"){
            this.props.navigation.goBack()
            return this.showSimpleMessage("Edited SuccessFully", "green", "success")
        }else{
            return this.showSimpleMessage("try again","red","danger")
        }
    }
    componentDidMount() {
     
    }

    _keyboardDidShow = () => {
        this.setState({ showTab: false })
    };

    _keyboardDidHide = () => {
        this.setState({ showTab: true })
    };
    componentDidMount() {
        Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
      this.getMedicines()
    }

    modal =()=>{
        return (
            <Modal 
               statusBarTranslucent ={true}
               deviceHeight ={screenHeight}
               onBackdropPress ={()=>{this.setState({modal:false})}}
               isVisible ={this.state.modal}
            >
                <View style={{flex:1,alignItems:"center",justifyContent:"center"}}>
                       <View style ={{height:height*0.4,width:width*0.8,backgroundColor:"#fff",borderRadius:10}}>
                              <View style={{marginVertical:10,alignItems:"center"}}>
                                        <Text style={[styles.text,{color:"#000",fontSize:18,textDecorationLine:"underline"}]}>Select Age Category :</Text>
                              </View>
                            <FlatList 
                              data ={ages}
                              keyExtractor ={(item,index)=>index.toString()}
                              renderItem ={({item,index})=>{
                                  return (
                                      <TouchableOpacity style={{ flexDirection: "row", marginTop: 20, alignItems: 'center', justifyContent: "space-around",  }}
                                          onPress={() => { this.setState({selectedCategory:item.label,modal:false}) }}
                                      >
                                          <View style={{ flex: 0.6, alignItems: "center", justifyContent: 'center' }}>
                                              <Text style={[styles.text,{color:"#000"}]}>{item.label}</Text>
                                          </View>

                                          <View style={{ flex: 0.4, alignItems: 'center', justifyContent: "center" }}>
                                              <FontAwesome name="dot-circle-o" size={24} color={this.state.selectedCategory == item.label ? themeColor : "gray"} />

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
    getCategory =() =>{
        if(this.state.edit){
            return   this.state.selectedCategory
        }
        return this.state?.template?.category
    }
    renderHeader = () =>{
        return (
            <>
            <View style={{ marginVertical: 20, alignItems: "center" }}>
                <Text style={[styles.text, { color: "#000", fontSize: 22, textDecorationLine: "underline" }]}>Prescribed :</Text>
            </View>
        {
            this.state.edit &&
                <View style={{ alignItems: "center", marginVertical: 10 }}>
                    <TouchableOpacity style={{ flexDirection: "row" }}
                    onPress={() => { this.props.navigation.navigate("SearchMedicines", { backFunction: (medicines) => { this.backFunction(medicines) } }) }}
                    >
                        <View>
                            <Ionicons name="add-circle" size={30} color={themeColor} />
                        </View>
                        <View style={{ alignItems: "center", justifyContent: "center" }}>
                            <Text style={[styles.text, { color: themeColor, marginLeft: 10 }]}>Medicines</Text>
                        </View>
                    </TouchableOpacity>

                </View>
        }
        </>
        )
    
    }
    renderHeader2 = () =>{
        return (
            <>
                <View style={{ marginVertical: 20, alignItems: "center" }}>
                    <Text style={[styles.text, { color: "#000", fontSize: 22, textDecorationLine: "underline" }]}>MedicinesGiven:</Text>
                </View>
                {
                    this.state.edit &&
                    <View style={{ alignItems: "center", marginVertical: 10 }}>
                        <TouchableOpacity style={{ flexDirection: "row" }}
                            onPress={() => { this.props.navigation.navigate("SearchMedicines", { backFunction2: (medicines) => { this.backFunction2(medicines) }, toGive: true }) }}
                        >
                            <View>
                                <Ionicons name="add-circle" size={30} color={themeColor} />
                            </View>
                            <View style={{ alignItems: "center", justifyContent: "center" }}>
                                <Text style={[styles.text, { color: themeColor, marginLeft: 10 }]}>Medicines</Text>
                            </View>
                        </TouchableOpacity>

                    </View>
                }
            </>
        )
    }
    save = async() =>{
        let medicines =this.state.priscribedEdit.concat(this.state.MedicinesGivenEdit)
        medicines.concat(this.state.priscribedEdit)
        if(medicines.length == 0){
            return this.showSimpleMessage("Please Add Medicines","orange","info")
        }
        let api = `${url}/api/prescription/templateEdit/`
        let sendData = {
            category:this.state.selectedCategory,
            medicines,
            template:this.state.item.id
        }
        let post  = await HttpsClient.post(api,sendData)
        console.log(post)
         if(post.type =="success"){
             this.props.navigation.goBack()
             return this.showSimpleMessage("Edited SuccessFully", "green", "info")
         }else{
             return this.showSimpleMessage("Try Again", "red", "danger")
         }
    }
    createAlert = () => {
        Alert.alert(
            "Do you want to delete?",
            ``,
            [
                {
                    text: "No",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "Yes", onPress: () => { this.delete() } }
            ]
        );
    }
    render() {
        return (
            <>
                <SafeAreaView style={styles.topSafeArea} />
                <SafeAreaView style={styles.bottomSafeArea}>
                    <StatusBar backgroundColor={themeColor} barStyle={"default"} />

                    <View style={{ height: height * 0.1, backgroundColor: themeColor, borderBottomRightRadius: 20, borderBottomLeftRadius: 20, flexDirection: 'row', alignItems: "center" }}>
                        <TouchableOpacity style={{ flex: 0.2, alignItems: "center", justifyContent: 'center' }}
                            onPress={() => { this.props.navigation.goBack() }}
                        >
                            <Ionicons name="chevron-back-circle" size={30} color="#fff" />
                        </TouchableOpacity>
                        <View style={{ flex: 0.6, alignItems: "center", justifyContent: "center" }}>
                            <Text style={[styles.text, { color: "#fff", fontSize: 18 }]}>Details</Text>
                        </View>
                        <View style={{ flex: 0.2 }}>

                        </View>
                    </View>
                   
                        <ScrollView 
                          showsVerticalScrollIndicator={false}
                          contentContainerStyle ={{paddingBottom:200}}
                        >

           
                          <View style={{marginTop:20,marginLeft:20,}}>
                              <Text style={[styles.text,{color:"#000",fontSize:18}]}>Category</Text>
                            
                              
                                
                                    <TouchableOpacity style={{ height: 40 ,width:width*0.6,borderColor:"gray",borderWidth:1,borderRadius:5,justifyContent:"center",marginTop:10,flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}
                                     onPress ={()=>{
                                         if(this.state.edit){
                                             this.setState({modal:true})
                                         }
                                         return
                                     }}
                                    >
                                        <View>
                                            <Text style={[styles.text, { color: "#000", marginLeft: 10 }]}>{this.getCategory()}</Text>
                                        </View>
                                        {this.state.edit&& <View style={{marginRight:10}}>
                                              <AntDesign name="caretdown" size={20} color="black" />
                                         </View>}
                                  </TouchableOpacity>
                              
                          </View>
                        
                            <FlatList 
                               ListHeaderComponent ={this.renderHeader()}
                            data={this.state.edit ? this.state.priscribedEdit : this.state.priscribed }
                               keyExtractor ={(item,index)=>index.toString()}
                               renderItem ={({item,index})=>{
                                   return (
                                       <MedicineDetailsTemplate item={item} index={index} changeFunction={(type, value, index) => { this.changeFunction(type, value, index) }} edit={this.state.edit} />
                                   )
                               }}
                            />
                    <FlatList
                        ListHeaderComponent={this.renderHeader2()}
                            data={this.state.edit ? this.state.MedicinesGivenEdit :this.state.MedicinesGiven }
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => {
                            return (
                                <MedicineTemplateView2 item={item} index={index} changeFunction={(type, value, index) => { this.changeFunction2(type, value, index) }} edit={this.state.edit}/>
                            )
                        }}
                    />
                          
         
                    </ScrollView>
                </SafeAreaView>
                {this.state.showTab&&<View style={{ position: "absolute", bottom: 50, width, alignItems: "center", justifyContent: "space-between" }}>
                    {
                        this.state.edit ? <View style={{flexDirection:"row",width,alignItems:"center",justifyContent:"space-around"}}>
                            <TouchableOpacity style={{ height: height * 0.05, width: width * 0.3, alignItems: "center", justifyContent: "center", backgroundColor: themeColor }}
                             onPress ={()=>{this.setState({edit:false,})}}
                            >
                                <Text style={[styles.text, { color: "#fff" }]}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ height: height * 0.05, width: width * 0.3, alignItems: "center", justifyContent: "center", backgroundColor: themeColor }}
                             onPress ={()=>{this.save()}}
                            >
                                <Text style={[styles.text, { color: "#fff" }]}>Save</Text>
                            </TouchableOpacity>
                        </View> :
                            <View style={{ flexDirection: "row", width, alignItems: "center", justifyContent: "space-around" }}>
                                <TouchableOpacity style={{ height: height * 0.05, width: width * 0.3, alignItems: "center", justifyContent: "center", backgroundColor: themeColor }}
                                 onPress ={()=>{this.setState({edit:true})}}
                                >
                                    <Text style={[styles.text, { color: "#fff" }]}>Edit</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ height: height * 0.05, width: width * 0.3, alignItems: "center", justifyContent: "center", backgroundColor: "red" }}
                                 onPress ={()=>{this.createAlert()}}
                                >
                                    <Text style={[styles.text, { color: "#fff" }]}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                    }
                </View>}
                {
                    this.modal()
                }
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
    }

})
const mapStateToProps = (state) => {

    return {
        theme: state.selectedTheme,
        user: state.selectedUser,
        clinic: state.selectedClinic
    }
}
export default connect(mapStateToProps, { selectTheme })(ViewFullTemplates);