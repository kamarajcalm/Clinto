import React, { Component } from 'react';
import { View, Text, StatusBar, Dimensions, Image, StyleSheet, TouchableOpacity, AsyncStorage, SafeAreaView, ScrollView, Linking,FlatList} from 'react-native';
import settings from '../AppSettings';
import axios from 'axios';
import Modal from 'react-native-modal';
import { Ionicons, Entypo, AntDesign, FontAwesome, MaterialCommunityIcons, MaterialIcons, FontAwesome5} from '@expo/vector-icons';
const { height } = Dimensions.get("window");
const { width } = Dimensions.get("window");
const url =settings.url
const themeColor = settings.themeColor;
const fontFamily = settings.fontFamily;
import { connect } from 'react-redux';
import { selectTheme } from '../actions';
import { NavigationContainer, CommonActions } from '@react-navigation/native';


import HttpsClient from '../api/HttpsClient';

class LinkedAccounts extends Component {
    constructor(props) {
   
        super(props);
        this.state = {
        
        };
    }

   
    componentDidMount() {
     
    }

   header =()=>{
     return(
           <View style={{flexDirection:"row",marginTop:20}}>
                <View style={{flex:0.2,alignItems:"center",justifyContent:"center"}}>
                 
                </View>
                <View style={{flex:0.43,alignItems:"center",justifyContent:"center"}}>
                  <Text style={[styles.text,{color:"#000",fontSize:height*0.02}]}>Name</Text>
                </View>
                <View style={{flex:0.33,alignItems:"center",justifyContent:"center"}}>
                        <Text style={[styles.text,{color:"#000",fontSize:height*0.02}]}>UID</Text>
                </View>
           </View>
     )
   } 
   footer =()=>{
     return(
       <View style={{marginVertical:50,alignItems:"center",justifyContent:"space-around",flexDirection:"row"}}>
            <TouchableOpacity style={{height:height*0.04,width:width*0.3,alignItems:"center",justifyContent:"center",backgroundColor:themeColor,borderRadius:5}}
              onPress={()=>{this.props.navigation.navigate("AddAccount")}}
            >
                 <Text style={[styles.text,{color:'#fff'}]}>Add Account</Text>
            </TouchableOpacity>
                  <TouchableOpacity style={{height:height*0.04,width:width*0.3,alignItems:"center",justifyContent:"center",backgroundColor:themeColor,borderRadius:5}}
              onPress={()=>{this.props.navigation.navigate("AddPet")}}
            >
                 <Text style={[styles.text,{color:'#fff'}]}>Add Pet</Text>
            </TouchableOpacity>
       </View>
     )
   }
    render() {
        return (
            <>
                <SafeAreaView style={styles.topSafeArea} />
                <SafeAreaView style={styles.bottomSafeArea}>
                    <View style={{ flex: 1, }}>
                        <StatusBar backgroundColor={themeColor} />
                              {/* Headers */}
                        <View style={{ height: height * 0.1, backgroundColor: themeColor, borderBottomRightRadius: 20, borderBottomLeftRadius: 20, justifyContent: "center", flexDirection: "row" }}>
                            <TouchableOpacity style={{ flex: 0.2, marginLeft: 20, alignItems: "center", justifyContent: 'center' }}
                                onPress={() => { this.props.navigation.goBack() }}
                            >
                                <Ionicons name="chevron-back-circle" size={30} color="#fff" />
                            </TouchableOpacity>
                            <View style={{ flex: 0.6, alignItems: 'center', justifyContent: "center" }}>
                                <Text style={[styles.text, { color: "#fff" ,fontSize:20,fontWeight:"bold"}]}>Linked Accounts</Text>
                            </View>
                            <View style={{ flex: 0.2, alignItems: 'center', justifyContent: "center" }}>
                               
                            </View>
                        </View>
                       <FlatList 
                         ListFooterComponent={this.footer()}
                         ListHeaderComponent={this.header()}
                         data={this.props.user.profile.childUsers}
                         keyExtractor={(item,index)=>index.toString()}
                         renderItem={({item,index})=>{
                            return(
                              <View style={{flexDirection:"row",marginTop:20}}>
                                   <View style={{flex:0.2,alignItems:"center",justifyContent:"center"}}>
                                      <Ionicons name="person" size={24} color="black" />
                                   </View>
                                   <View style={{flex:0.43,alignItems:"center",justifyContent:"center"}}>
                                      <Text style={[styles.text,{color:"#000",fontSize:height*0.02}]}>{item.name}</Text>
                                   </View>
                                   <View style={{flex:0.33,alignItems:"center",justifyContent:"center"}}>
                                            <Text style={[styles.text,{color:"#000",fontSize:height*0.02}]}>{item.uniqueid}</Text>
                                   </View>
                              </View>
                            )
                         }}
                       />
                       
          
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
        user:state.selectedUser
    }
}
export default connect(mapStateToProps, { selectTheme })(LinkedAccounts)