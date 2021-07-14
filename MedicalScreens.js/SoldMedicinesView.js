import React, { Component } from 'react';
import { View, Text, Dimensions, TouchableOpacity, StyleSheet, TextInput, FlatList, Image, SafeAreaView, ScrollView,ActivityIndicator } from 'react-native';
import { Ionicons, Entypo, AntDesign } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { selectTheme } from '../actions';
import settings from '../AppSettings';
import medicine from '../components/Medicine';
import Medicine from '../components/Medicine';
import HttpsClient from '../api/HttpsClient';
import moment from 'moment';
const { height, width } = Dimensions.get("window");
const fontFamily = settings.fontFamily;
const themeColor = settings.themeColor;
const url = settings.url;
class SoldMedicinesView extends Component {
    constructor(props) {
     
        super(props);
        this.state = {
           medicines:[],
           offset:0,
           next:true
        };
    }
    getMedicines =async()=>{
        let api = `${url}/api/prescription/soldSubs/?limit=6&offset=${this.state.offset}&inventory=${this?.props?.medical?.inventory || this?.props?.clinic?.inventory}`
        const medicines = await HttpsClient.get(api)
        if(medicines.type=="success"){
            this.setState({ medicines: medicines.data.results})
            if (medicines.data.next == null){
                this.setState({next:false})
            }
        }
    }
    renderFooter =()=>{
        if(this.state.next){
            return(
                <ActivityIndicator size={"large"} color={themeColor}/>
            )
        }
        return null
    }
    renderHeader =()=>{
        return(
            <View style= {{flexDirection:"row",flex:1,marginTop:10}}>
                 <View style={{flex:0.1,alignItems:"center",justifyContent:"center"}}>
                    <Text style={[styles.text,{color:"#000"}]}>#</Text>
                 </View>
                <View style={{ flex: 0.3, alignItems: "center", justifyContent: "center" }}>
                    <Text style={[styles.text, { color: "#000" }]}>Medicine</Text>
                </View>
                <View style={{ flex: 0.2, alignItems: "center", justifyContent: "center" }}>
                    <Text style={[styles.text, { color: "#000" }]}>Type</Text>
                </View>
                <View style={{ flex: 0.2, alignItems: "center", justifyContent: "center" }}>
                    <Text style={[styles.text, { color: "#000" }]}>Date</Text>
                </View>
                <View style={{ flex: 0.1, alignItems: "center", justifyContent: "center" }}>
                    <Text style={[styles.text, { color: "#000" }]}>Amount</Text>
                </View>
                <View style={{ flex: 0.1, alignItems: "center", justifyContent: "center" }}>
                    <Text style={[styles.text, { color: "#000" }]}>Qty</Text>
                </View>
            </View>
        )
    }
    componentDidMount() {
       this.getMedicines()
    }
    loadMore =()=>{
        if(this.state.next){
            this.setState({offset:this.state.offset+6},()=>{
                this.getMedicines()
            })
        }
    }
    render() {
        const { height, width } = Dimensions.get("window");
        return (
            <>
                <SafeAreaView style={styles.topSafeArea} />
                <SafeAreaView style={styles.bottomSafeArea}>
                    <View style={{ height: height * 0.12, backgroundColor: themeColor, borderBottomRightRadius: 20, borderBottomLeftRadius: 20, flexDirection: 'row', alignItems: "center" }}>
                        <TouchableOpacity style={{ flex: 0.2, alignItems: "center", justifyContent: 'center' }}
                            onPress={() => { this.props.navigation.goBack() }}
                        >
                            <Ionicons name="chevron-back-circle" size={30} color="#fff" />
                        </TouchableOpacity>
                        <View style={{ flex: 0.6, alignItems: "center", justifyContent: "center" }}>
                            <Text style={[styles.text, { color: "#fff", fontSize: 24, fontWeight: 'bold' }]}>Sold Medicines</Text>
                        </View>
                        <View style={{ flex: 0.2 }}>
                            <Text style={[styles.text, { color: "#fff", fontSize: 24, fontWeight: 'bold' }]}></Text>
                        </View>
                    </View>
                    <FlatList 
                      ListFooterComponent ={this.renderFooter()}
                      ListHeaderComponent ={this.renderHeader()}
                      data = {this.state.medicines}
                      keyExtractor ={(item,index)=>index.toString()}
                      onEndReached ={()=>{this.loadMore()}}
                      onEndReachedThreshold={0.1}
                      renderItem ={({item,index})=>{
                          return(
                              <View style={{ flexDirection: "row", flex: 1, marginTop: 10 }}>
                                  <View style={{ flex: 0.1, alignItems: "center", justifyContent: "center" }}>
                                      <Text style={[styles.text, { color: "#000" }]}>{index+1}</Text>
                                  </View>
                                  <View style={{ flex: 0.3, alignItems: "center", justifyContent: "center" }}>
                                      <Text style={[styles.text, { color: "#000" }]}>{item.medicineDetail.title}</Text>
                                  </View>
                                  <View style={{ flex: 0.2, alignItems: "center", justifyContent: "center" }}>
                                      <Text style={[styles.text, { color: "#000" }]}>{item.medicineDetail.type}</Text>
                                  </View>
                                  <View style={{ flex: 0.2, alignItems: "center", justifyContent: "center" }}>
                                      <Text style={[styles.text, { color: "#000" }]}>{moment(item.created).format("DD-MM-YYYY")}</Text>
                                  </View>
                                  <View style={{ flex: 0.1, alignItems: "center", justifyContent: "center" }}>
                                      <Text style={[styles.text, { color: "#000" }]}>{item.sold_total}</Text>
                                  </View>
                                  <View style={{ flex: 0.1, alignItems: "center", justifyContent: "center" }}>
                                      <Text style={[styles.text, { color: "#000" }]}>{item.quantity}</Text>
                                  </View>
                              </View>
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


})
const mapStateToProps = (state) => {

    return {
        theme: state.selectedTheme,
        user: state.selectedUser,
        medical: state.selectedMedical,
        clinic: state.selectedClinic

    }
}
export default connect(mapStateToProps, { selectTheme })(SoldMedicinesView);