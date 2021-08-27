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
import moment from 'moment';
export default class ViewMedicines extends Component {

    constructor(props) {
        let item = props.route.params.item
        super(props);
        this.state = {
           item
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
    componentDidMount() {
     
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
                                <Text style={[styles.text, { color: '#fff', fontWeight: 'bold', fontSize: 18 }]}>{this.state.item.title}</Text>
                            </View>
                            <View style={{ flex: 0.2, flexDirection: "row", alignItems: "center", justifyContent: 'center' }}
                            
                            >
                            
                            </View>
                        </View>
                               <ScrollView>
                                    <View style={{flexDirection:"row",marginTop:10}}>
                                            <View style={{flex:0.4,flexDirection:"row",alignItems:"center",justifyContent:"center"}}>
                                                <Text style={[styles.text]}>Name</Text>
                                            </View>
                                             <View style={{flex:0.2,alignItems:"center",justifyContent:"center"}}>
                                                  <Text style={[styles.text]}>:</Text>
                                            </View>
                                            <View style={{flex:0.4}}>
                                                  <Text style={[styles.text]}>{this.state.item.title}</Text>
                                            </View>
                                    </View>
                                     <View style={{flexDirection:"row",marginTop:10}}>
                                            <View style={{flex:0.4,flexDirection:"row",alignItems:"center",justifyContent:"center"}}>
                                                <Text style={[styles.text]}>brand</Text>
                                            </View>
                                             <View style={{flex:0.2,alignItems:"center",justifyContent:"center"}}>
                                                  <Text style={[styles.text]}>:</Text>
                                            </View>
                                            <View style={{flex:0.4}}>
                                                  <Text style={[styles.text]}>{this.state.item.brand}</Text>
                                            </View>
                                    </View>
                                         <View style={{flexDirection:"row",marginTop:10}}>
                                            <View style={{flex:0.4,flexDirection:"row",alignItems:"center",justifyContent:"center"}}>
                                                <Text style={[styles.text]}>Market Price</Text>
                                            </View>
                                            <View style={{flex:0.2,alignItems:"center",justifyContent:"center"}}>
                                                  <Text style={[styles.text]}>:</Text>
                                            </View>
                                            <View style={{flex:0.4}}>
                                                  <Text style={[styles.text]}>{this.state.item.marketprice}</Text>
                                            </View>
                                    </View>
                                         <View style={{flexDirection:"row",marginTop:10}}>
                                            <View style={{flex:0.4,flexDirection:"row",alignItems:"center",justifyContent:"center"}}>
                                                <Text style={[styles.text]}>Max Retail Price</Text>
                                            </View>
                                              <View style={{flex:0.2,alignItems:"center",justifyContent:"center"}}>
                                                  <Text style={[styles.text]}>:</Text>
                                            </View>
                                            <View style={{flex:0.4}}>
                                                  <Text style={[styles.text]}>{this.state.item.maxretailprice}</Text>
                                            </View>
                                    </View>
                                         <View style={{flexDirection:"row",marginTop:10}}>
                                            <View style={{flex:0.4,flexDirection:"row",alignItems:"center",justifyContent:"center"}}>
                                                <Text style={[styles.text]}>Type</Text>
                                            </View>
   <View style={{flex:0.2,alignItems:"center",justifyContent:"center"}}>
                                                  <Text style={[styles.text]}>:</Text>
                                            </View>
                                            <View style={{flex:0.4}}>
                                                  <Text style={[styles.text]}>{this.state.item.type}</Text>
                                            </View>
                                    </View>
                                        <View style={{flexDirection:"row",marginTop:10}}>
                                            <View style={{flex:0.4,flexDirection:"row",alignItems:"center",justifyContent:"center"}}>
                                                <Text style={[styles.text]}>Created</Text>
                                            </View>
                                            <View style={{flex:0.2,alignItems:"center",justifyContent:"center"}}>
                                                  <Text style={[styles.text]}>:</Text>
                                            </View>
                                            <View style={{flex:0.4}}>
                                                  <Text style={[styles.text]}>{moment(this.state.item.created).format("DD-MM-YYYY")}  {moment(this.state.item.created).format("hh:mm a")}</Text>
                                            </View>
                                    </View>
                                         <View style={{flexDirection:"row",marginTop:10}}>
                                            <View style={{flex:0.4,flexDirection:"row",alignItems:"center",justifyContent:"center"}}>
                                                <Text style={[styles.text]}>Last Updated</Text>
                                            </View>
                                        <View style={{flex:0.2,alignItems:"center",justifyContent:"center"}}>
                                                  <Text style={[styles.text]}>:</Text>
                                            </View>
                                            <View style={{flex:0.4}}>
                                                  <Text style={[styles.text]}>{moment(this.state.item.updated).format("DD-MM-YYYY")}  {moment(this.state.item.updated).format("hh:mm a")}</Text>
                                            </View>
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