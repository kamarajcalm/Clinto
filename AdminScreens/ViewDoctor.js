import React, { Component } from 'react';
import { View, Text, StatusBar, Dimensions, TouchableOpacity, StyleSheet, FlatList, Image, SafeAreaView, AsyncStorage } from 'react-native';
import settings from '../AppSettings';
import { connect } from 'react-redux';
import { selectTheme } from '../actions';
const { height, width } = Dimensions.get("window");
import { Ionicons, AntDesign, Entypo} from '@expo/vector-icons';
import Modal from 'react-native-modal';
import { NavigationContainer, CommonActions } from '@react-navigation/native';
const fontFamily = settings.fontFamily;
const themeColor = settings.themeColor;
   let weekdays =["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
class ViewDoctor extends Component {
    constructor(props) {
        let item =props.route.params.item
        let owner =props.route.params.owner
        super(props);
        this.state = {
            item,
            owner
        };
    }
    componentDidMount() {
        console.log(this.state.item?.doctor?.profile?.name)
    }
    getTodayTimings = (today,color) => {
      
   return(
       this.state.item.clinicShits[today][0].timings.map((i, index) => {
           return (
               <View 
                key={index}
                style={{ flexDirection: "row", marginTop: 5 }}>
                   <Text style={[styles.text, { marginLeft: 5,color }]}>{i[0]}</Text>
                   <Text style={[styles.text ,{color}]}>-</Text>
                   <Text style={[styles.text ,{color}]}>{i[1]}</Text>
               </View>
           )
       })
   )
       
       



    }

    render() {
        return (
            <>
                <SafeAreaView style={styles.topSafeArea} />
                <SafeAreaView style={styles.bottomSafeArea}>
                    <View style={{ flex: 1, backgroundColor: "#fff" }}>
                        <StatusBar backgroundColor={themeColor} />
                           {/* HEADERS */}
                        <View style={{ height: height * 0.1, backgroundColor: themeColor, borderBottomRightRadius: 20, borderBottomLeftRadius: 20, flexDirection: 'row', alignItems: "center" }}>
                            <TouchableOpacity style={{ flex: 0.2, alignItems: "center", justifyContent: 'center' }}
                               onPress={()=>{this.props.navigation.goBack()}}
                            >
                                <Ionicons name="chevron-back-circle" size={30} color="#fff" />
                            </TouchableOpacity>
                            <View style={{ flex: 0.6, alignItems: "center", justifyContent: "center" }}>
                                <Text style={[styles.text, { color: '#fff', fontWeight: 'bold', fontSize: height*0.02 }]}>{this.state.item?.doctor?.profile?.name}</Text>
                            </View>
                           {this.state.owner&&<TouchableOpacity style={{ flex: 0.2, flexDirection:"row",alignItems:"center",justifyContent:'center' }}
                                onPress={() => { this.props.navigation.navigate('EditDoctorTimings',{clinic:this.state.item,})}}
                            >
                                <Entypo name="back-in-time" size={24} color="#fff" />
                                <Text style={[styles.text, { marginLeft: 10, color: "#fff" }]}>Edit </Text>
                            </TouchableOpacity>}
                  
                        
                        </View>
                        {/* Timings */}
                        <View style={{alignItems:"center",justifyContent:"center",marginTop:20}}>
                            <Text style={[styles.text,{fontWeight:"bold",}]}>Timings:</Text>
                        </View>
                        <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-around",marginTop:20}}>
                            <View style={{flex:0.5,alignItems:"center",justifyContent:'center',flexDirection:"row"}}>
                                <View style={{flex:0.8,alignItems:"center",justifyContent:"center"}}>
                                    <Text style={[styles.text, { fontWeight: "bold", fontSize: height*0.02 }]}>Day</Text>
                                </View>
                               <View style={{flex:0.2}}>
                                    <Text style={[styles.text, { fontWeight: "bold", fontSize: height*0.02 }]}>:</Text>

                               </View>
                            </View> 
                            <View style={{ flex: 0.5, alignItems: "center", justifyContent: 'center' }}>
                                <Text style={[styles.text, { fontWeight: "bold", fontSize: height*0.02}]}>Working Timings:</Text>
                            </View>
                        </View>
                        {
                            weekdays.map((day,index)=>{
                                    let today =weekdays[new Date().getDay()]
                                     let color = day==today?"red":"#000"
                                return(
                                             <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-around", marginTop: 20 }} key={index}>
                            <View style={{ flex: 0.5, alignItems: "center", justifyContent: 'center',flexDirection:"row"}}>
                                <View style={{ flex: 0.8, alignItems: "center", justifyContent: "center" }}>
                                    <Text style={[styles.text, { fontWeight: "bold", fontSize: height*0.02 ,color}]}>{day}</Text>
                                </View>
                                <View style={{ flex: 0.2 }}>
                                    <Text style={[styles.text, { fontWeight: "bold", fontSize: height*0.02 ,color}]}>:</Text>

                                </View>
                            </View>
                            <View style={{ flex: 0.5, alignItems: "center", justifyContent: 'center'}}>
                                {
                                    this.getTodayTimings(day,color)
                                }
                            </View>
                        </View>
                                )
                            })
                        }
                   
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

    }
}
export default connect(mapStateToProps, { selectTheme })(ViewDoctor);

