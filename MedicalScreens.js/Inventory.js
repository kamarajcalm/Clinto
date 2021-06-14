import React, { Component } from 'react';
import { View, Text, Dimensions, TouchableOpacity, StyleSheet, TextInput, FlatList, Image, SafeAreaView } from 'react-native';
import { Ionicons, Entypo, AntDesign } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { selectTheme } from '../actions';
import settings from '../AppSettings';
import medicine from '../components/Medicine';
import Medicine from '../components/Medicine';
const { height, width } = Dimensions.get("window");
const fontFamily = settings.fontFamily;
const themeColor = settings.themeColor;
const url =settings.url;
import { Modal, } from 'react-native-paper';
import HttpsClient from '../api/HttpsClient';

import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";
class Inventory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal:false,
            catogoriesTitle:"",
            categories:[]
        };
    }
    addCatogories =async()=>{
        console.log(this.props.medical.inventory,"iii")
        let api = `${url}/api/prescription/addInventory/`
         let sendData ={
             title: this.state.catogoriesTitle,
             inventory: this.props.medical.inventory,
             type:"maincategory"
         }
         const post = await HttpsClient.post(api,sendData)
        if(post.type  =="success"){
             
            this.getCategories()
              this.setState({showModal:false})
        }else{
            this.showSimpleMessage("Try again", "#B22222", "danger")

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
    getCategories =async()=>{
        let api = `${url}/api/prescription/maincategory/?inventory=${this.props.medical.inventory}`
        console.log(api)
        const data =await HttpsClient.get(api)
        console.log(data,"jjj")
            if(data.type =="success"){
                this.setState({ categories:data.data})
            }
    }
    componentDidMount(){
         this.getCategories()
    }
    render() {
        return (
            <>
                <SafeAreaView style={styles.topSafeArea} />
                <SafeAreaView style={styles.bottomSafeArea}>
                
                        {/* HEADERS */}
                        <View style={{ height: height * 0.1, backgroundColor: themeColor, borderBottomRightRadius: 20, borderBottomLeftRadius: 20, flexDirection: 'row', alignItems: "center" }}>

                            <View style={{ flex: 1, alignItems:'center',justifyContent:"center"}}>
                                <Text style={[styles.text, { color: '#fff', fontWeight: 'bold', fontSize: 23, marginLeft: 20 }]}>Catogories</Text>
                            </View>

                        </View>
                
                       
                  
                    <FlatList 
                      data ={this.state.categories}
                      contentContainerStyle={{alignItems:"center",justifyContent:"space-around"}}
                      numColumns ={2}
                      keyExtractor ={(item,index)=>index.toString()}
                      renderItem ={({item,index})=>{
                         return(
                             <TouchableOpacity 
                               style={[styles.button,{marginTop:20,marginLeft:20}]}
                               onPress={()=>{this.props.navigation.navigate('AddItem',{item})}}
                             >
                                 <Text style={[styles.text,{color:"#fff"}]}>{item.title}</Text>
                             </TouchableOpacity>
                         )
                      }}
                    
                    />
                    <View style={{
                        position: "absolute",
                        bottom: 20,
                        left: 20,
                        right: 20,
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 20
                    }}>
                        <TouchableOpacity
                            onPress={() => { this.setState({ showModal: true }) }}
                        >
                            <AntDesign name="pluscircle" size={40} color={themeColor} />
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>

                <Modal 
                style={{alignItems:"center",justifyContent:"center"}}
                    visible={this.state.showModal} 
                    onDismiss={() => { this.setState({ showModal: false }) }} 
                    contentContainerStyle={{height:height*0.3, alignItems: 'center', justifyContent: "center" ,backgroundColor:"#fff",borderRadius:15,width:width*0.85}}
                    dismissable={true}
                >
                    <View>
                        <Text>Enter Title </Text>
                        <TextInput 
                           value={this.state.catogoriesTitle}
                           style={{marginTop:20,width:width*0.7,height:height*0.05,backgroundColor:"#fafafa",paddingLeft:15}}
                           onChangeText ={(text)=>{this.setState({catogoriesTitle:text})}}
                           selectionColor={themeColor}
                        />
                        <View style={{alignItems:"center",justifyContent:'center'}}>
                            <TouchableOpacity style={[styles.button, { marginTop: 20 }]}
                              onPress={()=>{this.addCatogories()}}
                            >
                                <Text style={[styles.text, { color: "#fff" }]}>Add</Text>
                            </TouchableOpacity>
                        </View>
                       
                    </View>
                </Modal>
              
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
    button:{
        height: height * 0.05,
         width: width * 0.4, 
         alignItems: 'center', 
         justifyContent: 'center', 
         backgroundColor: themeColor, 
         borderRadius: 10,
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
        user: state.selectedUser,
        medical: state.selectedMedical
    }
}
export default connect(mapStateToProps, { selectTheme })(Inventory);