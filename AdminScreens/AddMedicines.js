import React, { Component } from 'react';
import { View, Text, FlatList, ActivityIndicator, Dimensions, TextInput, StyleSheet, TouchableOpacity ,SafeAreaView,ScrollView} from 'react-native';
import { EvilIcons, Ionicons } from '@expo/vector-icons';
import HttpsClient from '../api/HttpsClient';
import settings from '../AppSettings';
const url = settings.url
const inputColor = settings.TextInput
const themeColor = settings.themeColor
const fontFamily = settings.fontFamily
const { height, width } = Dimensions.get("window")
import DropDownPicker from 'react-native-dropdown-picker';
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";
export default class AddMedicines extends Component {
    constructor(props) {
        let item = props?.route?.params?.item ||null
        super(props);
        this.state = {
            item,
            medicines: [],
            offset: 0,
            next: true,
            medicineName:"",
            selectedType:null,
            brand:"",
            marketPrice:"",
            maxretailprice:"",
            types: [
                {
                    label: "Liquid", value: "Liquid"
                },
                {
                    label: "Tablet", value: "Tablet"
                },
                {
                    label: "Capsules", value: "Capsules"
                },
                {
                    label: "Cream", value: "Cream"
                },
                {
                    label: "Injections", value: "Injections"
                },
                {
                    label: "Drops", value: "Drops"
                },
                {
                    label: "Inhalers", value: "Inhalers"
                },
                {
                    label: "Suppositories", value: "Suppositories"
                },
                {
                    label: "Others", value: "Others"
                },

            ],
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
    componentDidMount() {
        if(this.state.item){
            this.setState({
                    medicineName:this.props.route.params.item.title,
                    selectedType:this.props.route.params.item.type,
                    brand:this.props.route.params.item.brand,
                    marketPrice:this.props.route.params.item.marketprice.toString(),
                    maxretailprice:this.props.route.params.item.maxretailprice.toString(),
           }) 
        }

    }

    create = async()=>{
        this.setState({creating:true})
        if(this.state.medicineName ==""){
            this.setState({ creating: false })
          return  this.showSimpleMessage("Please fill medicine name","orange","info")
        }
        let api = `${url}/api/prescription/medicines/`
        if(this.state.item){
            api = `${url}/api/prescription/medicines/${this.state.item.id}/`
        }
        let sendData ={
            title:this.state.medicineName,
            type:this.state.selectedType,
            brand:this.state.brand,
            marketprice:Number(this.state.marketPrice),
            maxretailprice:Number(this.state.maxretailprice)
        }
        if(this.state.item){
            if(this.props.route.params.verify){
                sendData.is_verified=true,
                sendData.pricechange =0 ,
                sendData.price_verified=true
            }
             let patch = await HttpsClient.patch(api,sendData)
             console.log(patch)
                 if(patch.type =="success"){
                    this.setState({ creating: false })
                    this.showSimpleMessage("created SuccessFully","green","success")
                    return this.props.navigation.goBack()
                }else{
                    this.setState({ creating: false })
                return  this.showSimpleMessage("Try Again", "red", "danger")
                }

        }else{
                let post = await HttpsClient.post(api,sendData)
                console.log(post)
                if(post.type =="success"){
                    this.setState({ creating: false })
                    this.showSimpleMessage("created SuccessFully","green","success")
                    return this.props.navigation.goBack()
                }else{
                    this.setState({ creating: false })
                return  this.showSimpleMessage("Try Again", "red", "danger")
                }
        }

        
    }
    render() {
        return (
            <>
                <SafeAreaView style={styles.topSafeArea} />
                <SafeAreaView style={styles.bottomSafeArea}>
                    <View style={{ flex: 1, backgroundColor: "#fff" }}>
                            {/* HEADERS */}
                        <View style={{ height: height * 0.1, backgroundColor: themeColor, flexDirection: 'row', alignItems: "center" }}>
                            <TouchableOpacity style={{ flex: 0.2, alignItems: "center", justifyContent: 'center' }}
                                onPress={() => { this.props.navigation.goBack() }}
                            >
                                <Ionicons name="chevron-back-circle" size={30} color="#fff" />
                            </TouchableOpacity>
                            <View style={{ flex: 0.6, alignItems: "center", justifyContent: "center" }}>
                                <Text style={[styles.text, { color: '#fff', fontWeight: 'bold', fontSize: 18 }]}>{this.state.item?"Edit Medicine":"Add Medicines" }</Text>
                            </View>
                            <View style={{ flex: 0.2, flexDirection: "row", alignItems: "center", justifyContent: 'center' }}
                            
                            >
                            
                            </View>
                        </View>
                         <ScrollView 
                         
                          keyboardShouldPersistTaps={"handled"}
                          contentContainerStyle={{paddingBottom:30}}
                         
                         >
                              <View style={{marginTop:10,paddingHorizontal:20}}>
                                  <Text style={[styles.text,{color:"#000",fontSize:height*0.022}]}>Enter Medicine Name :</Text>
                                  <TextInput 
                                         value ={this.state.medicineName}
                                        style={{height:35,width:width*0.8,backgroundColor:inputColor,marginTop:10,paddingLeft:10}}
                                        selectionColor={themeColor}
                                        onChangeText={(medicineName) => { this.setState({ medicineName})}}
                                  />
                              </View>
                            <View style={{marginTop:10,paddingHorizontal:20}}>
                                <Text>Type</Text>
                                <View
                                   style={{height:this.state.open?height*0.4:50,paddingVertical:10}}
                                >
                                    <DropDownPicker
                                       onClose={()=>{
                                           this.setState({open:false})
                                       }}
                                        onOpen={()=>{this.setState({open:true})}}
                                        items={this.state.types}
                                        defaultValue={this.state.selectedType}
                                        containerStyle={{ height: 40 }}
                                        style={{ backgroundColor: '#fafafa' }}
                                        itemStyle={{
                                            justifyContent: 'flex-start'
                                        }}
                                        dropDownStyle={{ backgroundColor: '#fafafa' }}
                                        onChangeItem={item => this.setState({
                                            selectedType: item.value
                                        })}
                                    />
                                </View>

                            </View>
                            <View style={{ marginTop: 10, paddingHorizontal: 20 }}>
                                <Text style={[styles.text, { color: "#000", fontSize: height * 0.022 }]}>Enter Brand :</Text>
                                <TextInput
                                    value={this.state.brand}
                                    style={{ height: 35, width: width * 0.8, backgroundColor: inputColor, marginTop: 10, paddingLeft: 10 }}
                                    selectionColor={themeColor}
                                    onChangeText={(brand) => { this.setState({ brand }) }}
                                />
                            </View>
                            <View style={{ marginTop: 10, paddingHorizontal: 20 }}>
                                <Text style={[styles.text, { color: "#000", fontSize: height * 0.022 }]}>Enter marketprice :</Text>
                                <TextInput
                                    keyboardType={"numeric"}
                                    value={this.state.marketPrice}
                                    style={{ height: 35, width: width * 0.8, backgroundColor: inputColor, marginTop: 10, paddingLeft: 10 }}
                                    selectionColor={themeColor}
                                    onChangeText={(marketPrice) => { this.setState({ marketPrice }) }}
                                />
                            </View>
                            <View style={{ marginTop: 10, paddingHorizontal: 20 }}>
                                <Text style={[styles.text, { color: "#000", fontSize: height * 0.022 }]}>Enter maxretailprice :</Text>
                                <TextInput
                                    keyboardType={"numeric"}
                                    value={this.state.maxretailprice}
                                    style={{ height: 35, width: width * 0.8, backgroundColor: inputColor, marginTop: 10, paddingLeft: 10 }}
                                    selectionColor={themeColor}
                                    onChangeText={(maxretailprice) => { this.setState({ maxretailprice }) }}
                                />
                            </View>
                            <View style={{marginTop:20,alignItems:"center",justifyContent:"center"}}>
                                <TouchableOpacity style={{height:height*0.05,width:width*0.4,alignItems:"center",justifyContent:"center",backgroundColor:themeColor}}
                                 onPress ={()=>{this.create()}}
                                >
                                     {!this.state.creating? <Text style={[styles.text,{color:"#fff"}]}>{this.state.item?"Edit":"Create"}</Text>:
                                     <ActivityIndicator size={"large"} color={"#fff"}/>
                                     }
                                </TouchableOpacity>
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

})