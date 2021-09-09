import React, { Component } from 'react';
import { View, Text, Dimensions, TouchableOpacity, StyleSheet, TextInput, FlatList, Image, SafeAreaView, StatusBar,ActivityIndicator } from 'react-native';
import { Ionicons, Entypo, AntDesign } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { selectTheme } from '../../actions';
import settings from '../../AppSettings';
const { height, width } = Dimensions.get("window");
const fontFamily = settings.fontFamily;
const themeColor = settings.themeColor;
import axios from 'axios';
import moment from 'moment';
import HttpsClient from '../../api/HttpsClient';

const url = settings.url;

class AllAppointments extends Component {
    constructor(props) {
        super(props);
        this.state = {
           appoinments:[],
           offset:0,
           refreshing:false,
           next:true
        };
    }
    getAppointments = async()=>{
         let  api = `${url}/api/prescription/appointments/?clinic=${this.props.clinic.clinicpk}&date=${moment(this.props.date).format("YYYY-MM-DD")}&limit=5&offset=${this.state.offset}`
        console.log(api)
                const data = await HttpsClient.get(api)
      
        if (data.type == "success") {
       

            this.setState({ appoinments:this.state.appoinments.concat(data.data.results),refreshing:false})
            if (data.data.next != null) {
                this.setState({ next: true })
            } else {
                this.setState({ next: false })
            }
        }else{
            this.setState({fetching:false})
        }
        }
   componentDidMount(){
      this.getAppointments()
      this._unsubscribe = this.props.navigation.addListener('focus', () => {
              this.setState({offset:0,appoinments:[]},()=>{
                    this.getAppointments()
              })
              
        });
   }
   componentWillUnmount(){
       this._unsubscribe();
   }
   componentDidUpdate(prevProps,prevState){
     if(prevProps.date!=this.props.date){
         this.setState({offset:0,appoinments:[]},()=>{
            this.getAppointments()
    
         })
 
     }
   }
    validateInformation =(item)=>{
        
        if (item?.status == "Pending" || item?.status == "Rejected") {
            return(
                <View style={{marginTop:10}}>
                    <Text style={[styles.text]}>{item.requestedtime}</Text>
                </View>
            )
    }
        if (item?.status == "Accepted") {
            return (
                <View style={{ marginTop: 10 }}>
                    <Text style={[styles.text]}>{item.acceptedtime}</Text>
                </View>
            )
        }
        if (item?.status == "Completed") {
            return (
                <View style={{ marginTop: 10 }}>
                    <Text style={[styles.text]}>{item.acceptedtime}</Text>
                </View>
            )
        }
    }
    refresh =()=>{
        this.setState({offset:0,appoinments:[]},()=>{
            this.getAppointments()
        })
    }
    handleEndReached =()=>{
        if(this.state.next){
            this.setState({offset:this.state.offset+5},()=>{
                this.getAppointments()
            })
        }
        return
    }
        validateColor =(status)=>{
        if(status =="Completed"){
            return "green"
        }
        if (status == "Accepted") {
            return "#63BCD2"
        }
        if (status == "Pending") {
            return "orange"
        }
        if (status == "Rejected") {
            return "red"
        }
        if (status == "Declined") {
            return "red"
        }
    }
    render() {
        return (
            <>
                <SafeAreaView style={styles.topSafeArea} />
                <SafeAreaView style={styles.bottomSafeArea}>
                 <StatusBar backgroundColor={themeColor} barStyle={"default"} />

                    <FlatList 
                      onEndReached={()=>{this.handleEndReached()}}
                       refreshing ={this.state.refreshing}
                       onRefresh={()=>{this.refresh()}}
                       data={this.state.appoinments}
                       keyExtractor={(item,index)=>index.toString()}
                       renderItem ={({item,index})=>{
                        return(
                            <TouchableOpacity
                                onPress={() => { this.viewAppointments(item) }}
                                style={{
                                    marginTop: 10,
                                    minHeight: height * 0.15,
                                    backgroundColor: "#eee",
                                    marginHorizontal: 10,
                                    borderRadius: 10,
                                }}

                            >
                               

                                <View

                                    style={{
                                        flex:1,
                                        flexDirection: "row"
                                    }}

                                >
                                    <View style={{ flex: 0.6 }}>
                                        <View style={{flex:0.6}}>

                                        
                                        <View style={{ paddingLeft: 10, paddingTop: 10 }}>
                                            <Text style={[styles.text, { fontWeight: "bold", color: "#000" }]}>{item.patientname.name}</Text>
                                        </View>
                                        <View style={{ paddingLeft: 10, paddingTop: 10, flexDirection: "row" }}>
                                            <View>
                                                <Text style={[styles.text, { fontWeight: "bold" }]}>Reason : </Text>
                                            </View>
                                            <View>
                                                <Text style={[styles.text, { fontWeight: "bold" }]}>{item.reason}</Text>
                                            </View>

                                        </View>
                                        </View>
                                        <View style={{ flexDirection: 'row',  alignItems: "center", flex:0.4,}}>
                                            <TouchableOpacity style={[styles.boxWithShadow, { backgroundColor: "#fff", height: 30, width: 30, borderRadius: 15, alignItems: "center", justifyContent: 'center',marginLeft:10 }]}
                                                onPress={() => {this.chatwithCustomer(item) }}
                                            >
                                                <Ionicons name="md-chatbox" size={20} color="#63BCD2" />
                                            </TouchableOpacity>
                                            <TouchableOpacity style={[styles.boxWithShadow, { backgroundColor: "#fff", height: 30, width: 30, borderRadius: 15, alignItems: "center", justifyContent: 'center' ,marginLeft:10}]}
                                                onPress={() => {this.getCall(item) }}
                                            >
                                                <Ionicons name="call" size={20} color="#63BCD2" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                     <View style={{flex:0.4,alignItems:'center',justifyContent:"center"}}>
                                         {
                                             this.validateInformation(item)
                                         }
                                         <View style={{marginTop:5}}>
                                             <Text style={[styles.text,{color:this.validateColor(item?.status)}]}>{item?.status}</Text>
                                         </View>
                                     </View>
                  

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
    topSafeArea: {
        flex: 0,
        backgroundColor: themeColor
    },
    bottomSafeArea: {
        flex: 1,
        backgroundColor: "#fff"
    },
    boxWithShadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5
    }

})
const mapStateToProps = (state) => {

    return {
        theme: state.selectedTheme,
        user:state.selectedUser,
        clinic: state.selectedClinic
    }
}
export default connect(mapStateToProps, { selectTheme })(AllAppointments);