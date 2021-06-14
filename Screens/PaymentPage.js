import React, { Component } from 'react';
import { View, Text, Dimensions, TouchableOpacity, StyleSheet, TextInput, FlatList, Image, SafeAreaView, ScrollView, ActivityIndicator} from 'react-native';
import { Ionicons, Entypo, AntDesign } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { selectTheme } from '../actions';
import settings from '../AppSettings';
import medicine from '../components/Medicine';
import Medicine from '../components/Medicine';
import HttpsClient from '../api/HttpsClient';
import { LinearGradient } from 'expo-linear-gradient';
const { height, width } = Dimensions.get("window");
const fontFamily = settings.fontFamily;
const themeColor = settings.themeColor;
const deviceHeight =Dimensions.get("screen").height
import Modal from 'react-native-modal';
import RazorpayCheckout from 'react-native-razorpay';
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";
const url = settings.url;
import axios from 'axios';
class PaymentPage extends Component {
    constructor(props) {


        super(props);
        this.state = {
          plans:[
              {
                  name:"1 Month Subscriptions",
                  cost:"₹500",
                  packname:"Monthly"
              },
            {
                name: "3 Month Subscriptions",
                cost: "₹1400",
                packname: "Quarterly"
            },
            {
                name: "6 Month Subscriptions",
                cost: "₹2800",
                packname: "Halfly"
            },
            {
                name: "year Subscriptions",
                cost: "₹4700",
                packname: "Yearly"
            },
          ],
          loading:false,
        };
    }
    componentDidMount() {
   
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
    failPayment = async(error)=>{
        let api = `${url}/api/profile/validatePayment/`
        let sendData ={
            error
        }
        let post = await HttpsClient.post(api, sendData)
        console.log(post,"failll")

    }
    validatePayment =async(data)=>{
     let api = `${url}/api/profile/validatePayment/`
     let sendData ={
         razorpay_order_id: data.razorpay_order_id,
         razorpay_payment_id: data.razorpay_payment_id,
         razorpay_signature: data.razorpay_signature
     }
     console.log(sendData,"errrrt")
     let post =await HttpsClient.post(api,sendData)
     if(post.type =="success"){
         this.showSimpleMessage("recharge success", "#00A300", "success")
         return this.props.navigation.goBack()
     }
    }
    makeOrder = async(i)=>{
  
       this.setState({loading:true})
        let api =`${url}/api/profile/paymentOrder/`
    
        let sendData ={
            plan:i.packname,
            user:this.props.user.id,
            clinic: this.props.clinic.clinicpk
        }
    let post =await HttpsClient.post(api,sendData)
    console.log(post)
 
    if(post.type =="success"){

            var options = {
                description: `${i.name}`,
                image: 'https://i.imgur.com/3g7nmJC.png',
                currency: 'INR',
                key: 'rzp_test_qlBHML4RDDiVon',
                name: 'Med-Portal',
                order_id: `${post.data.order_id}`,
                prefill: {
                    email: `${this.props.user.email}`,
                    contact: `${this.props.user.profile.mobile}`,
                    name:`${this.props.user.first_name}`
                },
                theme: { color: '#1f1f1f' }
            }
    RazorpayCheckout.open(options).then((data) => {
  
        // handle success
        this.validatePayment(data)
        this.setState({loading:false})
      
   
    }).catch((error) => {
        // handle failure
        this.failPayment(error)
        this.setState({ loading: false })

        return this.showSimpleMessage(`${error.error.description}`, "#dd7030")
      
    });
    }else{
        this.setState({ loading: false })
    }
    }
    render() {
        return (
            <>
                <SafeAreaView style={styles.topSafeArea} />
                <SafeAreaView style={styles.bottomSafeArea}>
                    <View style={{ flex: 1 }}>
                        {/* HEADERS */}
                        <View style={{ height: height * 0.1, backgroundColor: themeColor, borderBottomRightRadius: 20, borderBottomLeftRadius: 20, flexDirection: 'row', alignItems: "center" }}>
                            <TouchableOpacity style={{ flex: 0.2, alignItems: "center", justifyContent: 'center' }}
                                onPress={() => { this.props.navigation.goBack() }}
                            >
                                <Ionicons name="chevron-back-circle" size={30} color="#fff" />
                            </TouchableOpacity>
                            <View style={{ flex: 0.6, alignItems: "center", justifyContent: "center" }}>
                                <Text style={[styles.text, { color: "#fff", fontWeight: "bold", fontSize: 20 }]}> Recharge</Text>
                            </View>
                            <View style={{ flex: 0.2, alignItems: "center", justifyContent: "center" }}>
                            </View>
                        </View>

                                                   {/* Current Pack */}
                       
                                                {/* Our plans */}

                        <View style={{alignItems:'center',justifyContent:"center"}}>
                            <Text style={[styles.text,{fontWeight:"bold",fontSize:18}]}>Our plans</Text>
                        </View>

                                              {/* Recharge cards */}
                        <ScrollView
                           showsVerticalScrollIndicator={false}
                        >
                            {
                                this.state.plans.map((i,index)=>{
                                    return(
                                         <LinearGradient
                                            key={index}
                                            style={[styles.card2, styles.elevation]}
                                            colors={['#4c669f', '#3b5998', '#192f6a']}
                                         >
                                            <TouchableOpacity 
                                             style={{flex:1}}
                                                onPress={() => {
                                                    this.makeOrder(i)
                                              
                                                }}
                                            >
                                                <View style={{ alignItems: "center", justifyContent: "center", flex: 0.3 }}>
                                                    <Text style={[styles.text, { fontWeight: "bold", fontSize: 18 ,color:"#fff"}]}>{i.name}</Text>
                                                </View>
                                                <View style={{ alignItems: 'center', justifyContent: "center", flex: 0.7 }}>
                                                    <Text style={styles.text, { fontSize: 22 ,color:"#fff"}}>{i.cost}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </LinearGradient>
                                    )
                                })
                            }
                           
                        </ScrollView>

                    </View>
                  <Modal
                  deviceHeight={deviceHeight}
                    isVisible={this.state.loading}
                  >
                   <View style={{flex:1,alignItems:"center",justifyContent:"center"}}>
                    <ActivityIndicator  color={"#fff"} size="large"/>
                   </View>
                  </Modal>
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
    elevation: {
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0,
        shadowRadius: 4.65,

        elevation: 8,
    },
    card: {
        backgroundColor: "#333",
        elevation: 6,
        margin: 20,
        height: height * 0.3,
        borderRadius: 10,

    },
    card2: {
        backgroundColor: "#333",
        elevation: 6,
        margin: 20,
        height: height * 0.2,
        borderRadius: 10,

    },

})
const mapStateToProps = (state) => {

    return {
        theme: state.selectedTheme,
        user: state.selectedUser,
        clinic: state.selectedClinic,
    }
}
export default connect(mapStateToProps, { selectTheme })(PaymentPage);