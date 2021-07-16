import React, { Component } from 'react';
import { View, Text, Dimensions, TouchableOpacity, StyleSheet, TextInput, FlatList, Image, SafeAreaView, StatusBar,ActivityIndicator } from 'react-native';
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
import axios from 'axios';
import moment from 'moment';
const url = settings.url;

class ViewTemplates extends Component {
    constructor(props) {
        super(props);
        this.state = {
            patients: [],
            cancelToken: undefined,
            templates:[],
            offset:0,
            next:true
        };
    }
    getTemplates = async()=>{
        let api = `${url}/api/prescription/prescriptionTemplates/?limit=15&offset=${this.state.offset}&clinic=${this.props.clinic.clinicpk}`
        const data  =await HttpsClient.get(api)
        if (data.type =="success"){
            this.setState({ templates:this.state.templates.concat(data.data.results)})
            if(data.data.next ==null){
                this.setState({next:false})
            }
        }

    }
   componentDidMount(){
       this.getTemplates()
   }
    loadMore =()=>{

    }
    renderHeader =()=>{
        return(
            <View style={{flexDirection:"row",marginVertical:10}}>
                  <View style={{flex:0.1,alignItems:"center",justifyContent:"center"}}>
                        <Text style={[styles.text,{color:"#000",fontSize:18}]}>#</Text>
                  </View>
                  <View style={{flex:0.3,alignItems:"center",justifyContent:"center"}}>
                    <Text style={[styles.text, { color: "#000", fontSize: 18 }]}>Age Group</Text>
                  </View>
                <View style={{ flex: 0.3, alignItems: "center", justifyContent: "center" }}>
                    <Text style={[styles.text, { color: "#000", fontSize: 18 }]}>Diagonis</Text>
                </View>
                <View style={{ flex: 0.3, alignItems: "center", justifyContent: "center" }}>
                    <Text style={[styles.text, { color: "#000", fontSize: 18 }]}>Created</Text>
                </View>
            </View>
        )
    }
    renderFooter =()=>{
        if(this.state.next){
            return(
                <ActivityIndicator  size ={"large"} color ={themeColor}/>
            )
        }
        return null
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
                            <Text style={[styles.text,{color:"#fff",fontSize:18}]}>Templates</Text>
                        </View>
                        <View style={{flex:0.2}}>
                             
                        </View>
                    </View>
                                           {/* TEMPLATES */}
                        <FlatList 
                           onEndReached={()=>{this.loadMore()}}
                           onEndReachedThreshold={0.1}
                           data ={this.state.templates}
                           keyExtractor ={(item,index)=>index.toString()}
                           ListFooterComponent ={this.renderFooter()}
                           ListHeaderComponent ={this.renderHeader()}
                           renderItem ={({item,index})=>{
                                return(
                                    <TouchableOpacity style={{ flexDirection: "row", paddingVertical: 10 ,backgroundColor:"gray"}}
                                      onPress={()=>{this.props.navigation.navigate('ViewFullTemplates',{item})}}
                                    >
                                        <View style={{ flex: 0.1, alignItems: "center", justifyContent: "center" }}>
                                            <Text style={[styles.text, { color: "#fff",  }]}>{index+1}</Text>
                                        </View>
                                        <View style={{ flex: 0.3, alignItems: "center", justifyContent: "center" }}>
                                            <Text style={[styles.text, { color: "#fff", }]}>{item.category}</Text>
                                        </View>
                                        <View style={{ flex: 0.3, alignItems: "center", justifyContent: "center" }}>
                                            <Text style={[styles.text, { color: "#fff", }]}>{item.disease_name}</Text>
                                        </View>
                                        <View style={{ flex: 0.3, alignItems: "center", justifyContent: "center" }}>
                                            <Text style={[styles.text, { color: "#fff", }]}>{moment(item.created).format("DD-MM-YYYY")}</Text>
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
export default connect(mapStateToProps, { selectTheme })(ViewTemplates);