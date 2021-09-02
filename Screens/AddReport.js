import React, { Component } from 'react';
import { View, Text, Dimensions, TouchableOpacity, StyleSheet, TextInput, FlatList, Image, SafeAreaView, StatusBar,ActivityIndicator, ScrollView } from 'react-native';
import { Ionicons, Entypo, AntDesign } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { selectTheme } from '../actions';
import settings from '../AppSettings';
import medicine from '../components/Medicine';
import Medicine from '../components/Medicine';
import HttpsClient from '../api/HttpsClient';
const { height, width } = Dimensions.get("window");
const fontFamily = settings.fontFamily;
const themeColor = settings.themeColor;
const inputColor = settings.TextInput
import DropDownPicker from 'react-native-dropdown-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as mime from 'react-native-mime-types';
import axios from 'axios';
import moment from 'moment';
const url = settings.url;

class AddReport extends Component {
    constructor(props) {
        super(props);
        this.state = {
   
        };
    }

   componentDidMount(){
  
   }
selectFile = async()=>{
  const file = await DocumentPicker.getDocumentAsync({
     type: "*/*"
  });
      let filename = file.uri.split('/').pop();
        let match = /\.(\w+)$/.exec(filename);
        const type =  mime.lookup(match[1])

     const fileUpload = {
            uri: file.uri,
            type: type,
            name: file.name,
        };
        console.log(fileUpload)
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
                            <Text style={[styles.text,{color:"#fff",fontSize:18}]}>Add Report</Text>
                        </View>
                        <View style={{flex:0.2}}>
                             
                        </View>
                    </View>
                    <ScrollView>
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

                            </View>
                           
                             <View style={{marginTop:20}}>
                                <DropDownPicker
                                    placeholder={"select"}
                                    items={this.state.sex}
                                    defaultValue={this.state.selectedSex}
                                    containerStyle={{ height: 40, width: width * 0.7 }}
                                    style={{ backgroundColor: inputColor }}
                                    itemStyle={{
                                        justifyContent: 'flex-start'
                                    }}
                                    dropDownStyle={{ backgroundColor: inputColor, width: width * 0.7}}
                                    onChangeItem={item => this.setState({
                                        selectedSex: item.value
                                    })}

                                />
                             </View>
                          
                        </View>
                              <View style={{ marginTop: 20 ,paddingHorizontal:20}}>
                                  <Text style={[styles.text], { color: "#000",fontSize: 18 }}>Upload File</Text>
                                  <TouchableOpacity style={{marginTop:20,alignItems:"center",justifyContent:"center"}}
                                    onPress={()=>{this.selectFile()}}
                                  >
                                         <Ionicons name="document-attach" size={24} color="black" />
                                  </TouchableOpacity>
                               </View>

                               <View>
                                    
                               </View>
                         </ScrollView>
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
    }

})
const mapStateToProps = (state) => {

    return {
        theme: state.selectedTheme,
        user:state.selectedUser,
        clinic: state.selectedClinic
    }
}
export default connect(mapStateToProps, { selectTheme })(AddReport);