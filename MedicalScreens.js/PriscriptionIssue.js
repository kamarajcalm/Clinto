import React, { Component } from 'react';
import { View, Text, StatusBar, Dimensions, TouchableOpacity, StyleSheet, FlatList, Image, SafeAreaView, Appearance,} from 'react-native';
import settings from '../AppSettings';
import { connect } from 'react-redux';
import { selectTheme,selectMedical} from '../actions';
const { height, width } = Dimensions.get("window");
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Ionicons, AntDesign, Fontisto, FontAwesome} from '@expo/vector-icons';
import authAxios from '../api/authAxios';
import HttpsClient from '../api/HttpsClient';
import moment from 'moment';
import Modal from 'react-native-modal';
const fontFamily = settings.fontFamily;
let themeColor = settings.themeColor;
const url = settings.url;
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";
class PriscriptionIssue extends Component {
    constructor(props) {
        const Date1 = new Date()
        const day = Date1.getDate()
        const month = Date1.getMonth() + 1
        const year = Date1.getFullYear()
        const today = `${year}-${month}-${day}`
        super(props);
        this.state = {
            today,
            mode: 'date',
            date: new Date(),
            show: false,
            priscriptions:[],
            showModal:false,
            medicals:[],
            showCalender:false,
            isFetching:false,
        };
    }

    showDatePicker = () => {
        this.setState({ showCalender: true })
    };

    hideDatePicker = () => {
        this.setState({ showCalender: false })
    };

    handleConfirm = (date) => {
        this.setState({ today: moment(date).format('YYYY-MM-DD'), showCalender: false, date: new Date(date) }, () => {
            this.getPriscriptions(this.props.medical.id)
       

        })
        this.hideDatePicker();
    };
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
    getPriscriptions =async(pk)=>{
        let api = `${url}/api/prescription/issued/?clinic=${pk}&date=${moment(this.state.date).format("YYYY-MM-DD")}`
        console.log(api,"[kjk")
        const data = await HttpsClient.get(api)
        console.log(data)
        if(data.type =="success"){
            this.setState({ priscriptions:data.data,isFetching:false})
        }else{
            this.setState({  isFetching: false })
           this.showSimpleMessage("Something Went Wrong", "#dd7030",)
        }

    }
    getClinic = async()=>{
   
        if (this.props.user.profile.occupation == "MedicalRecoptionist") {
  
           let api = `${url}/api/prescription/recopinists/?user=${this.props.user.id}`
            let data = await HttpsClient.get(api)
            console.log(api)
            if (data.type == "success") {

                this.props.selectMedical(data.data[0].clinic)
                this.getPriscriptions(data.data[0].clinic.id)
            }
          
        }else{
            
            let api = `${url}/api/prescription/getDoctorClinics/?medicalRep=${this.props.user.id}`
            let data = await HttpsClient.get(api)
            console.log(api)
            if(data.type =="success"){
                this.setState({ medicals: data.data.ownedclinics})
                this.props.selectMedical(data.data.ownedclinics[0])
                this.getPriscriptions(data.data.ownedclinics[0].clinicpk)
            }
            console.log(data,api)

        }

    
        
       
    }
    setActiveMedical =(item)=>{
        this.props.selectMedical(item)
        this.getPriscriptions(item.clinicpk)
        this.setState({showModal:false})
    }
    componentDidMount() {
       
              this.getClinic();
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
        
            this.getPriscriptions(this.props?.medical?.clinic?.id)

        });
    }
    onRefresh = () => {
        this.setState({ isFetching: true })
        this.getPriscriptions(this.props.medical.id)
    }
    componentWillUnmount(){
        this._unsubscribe();
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
                          
                            <View style={{ flex: 1, flexDirection:"row"}}>
                                <View style={{flex:0.5,}}>
                                    <Text style={[styles.text, { color: '#fff', fontWeight: 'bold', fontSize: 25,marginLeft:10}]}>Prescription</Text>
                                </View>
                                {this.props.user.profile.occupation == "MediacalRep" &&<TouchableOpacity style={{ flex: 0.5, alignItems: "center", justifyContent: "center" ,flexDirection:"row"}}
                                    onPress={() => { this.setState({ showModal: true, showCalender:false})}}
                                >
                                    <View style={{alignItems:"center",justifyContent:"center"}}>
                                        <Text style={[styles.text, { color: '#fff', }]}>{this.props?.medical?.name}</Text>

                                    </View>
                                    <View style={{alignItems:"center",justifyContent:"center"}}>
                                        <AntDesign name="right" size={20} color="#fff" />
                                    </View>
                                  
                                </TouchableOpacity>}
                            </View>
                   
                        </View>
                        {/* DATES */}
                        <View style={{ height: height * 0.07, alignItems: "center", justifyContent: "space-around", flexDirection: "row" }}>
                            <View style={{ flexDirection: "row" }}>
                                <Text style={[styles.text, { color: "#000" }]}>{this.state.today}</Text>
                                <TouchableOpacity
                                    style={{ marginLeft: 20 }}
                                    onPress={() => { this.setState({ showCalender: true }) }}
                                >
                                    <Fontisto name="date" size={24} color={themeColor} />
                                </TouchableOpacity>
                                {/* {this.state.showCalender && (
                                    <DateTimePicker
                                        
                                        testID="dateTimePicker1"
                                        value={this.state.date}
                                        mode={this.state.mode}
                                        is24Hour={true}
                                        display="default"
                                        onChange={(time) => { this.onChange(time) }}
                                    />
                                )} */}
                                <DateTimePickerModal
                                    isVisible={this.state.showCalender}
                                    mode="date"
                                    onConfirm={this.handleConfirm}
                                    onCancel={this.hideDatePicker}
                                />
                            </View>
                            <View>
                                <Text style={[styles.text,]}> Total:{this.state.priscriptions.length}</Text>
                            </View>
                        </View>
                        {/* CHATS */}
                        <FlatList
                            style={{  }}
                            onRefresh={() => this.onRefresh()}
                            refreshing={this.state.isFetching}
                            data={this.state.priscriptions}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item, index }) => {
                                return (
                                    <TouchableOpacity style={[styles.card, { flexDirection: "row", borderRadius: 5 ,marginTop:15}]}
                                        // onPress={() => { this.props.navigation.navigate('PrescriptionView', { item, }) }}
                                    >
                                        <View style={{ flex: 0.3, alignItems: 'center', justifyContent: "center" }}>
                                            <Image
                                                source={{ uri: "https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg" }}
                                                style={{ height: 60, width: 60, borderRadius: 30 }}
                                            />
                                        </View>
                                        <View style={{ flex: 0.4, justifyContent: 'center', alignItems: 'center' }}>
                                            <View >
                                                <Text style={[styles.text,{ fontSize: 18, }]}>{item.patientdetails.name}</Text>
                                                <Text style={[styles.text,{ fontSize: 12, }]}>{item.patientdetails.clinicname}</Text>
                                            </View>

                                        </View>
                                        <View style={{ flex: 0.3, justifyContent: 'center', alignItems: "center" }}>
                                            <View style={{ flex: 0.5, alignItems: 'center', justifyContent: 'center' }}>
                                                <Text>{moment(item.created).format("DD/MM/YYYY")}</Text>

                                            </View>
                                            <View style={{ flex: 0.5, alignItems: 'center', justifyContent: 'center' }}>
                                                <Text>{moment(item.created).format("hh:mm a")}</Text>
                                            </View>

                                        </View>
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
                                onPress={() => { this.props.navigation.navigate('SearchPateint') }}
                            >
                                <AntDesign name="pluscircle" size={40} color={themeColor} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <Modal
                        animationIn="slideInUp"
                        animationOut="slideOutDown"
                        isVisible={this.state.showModal}
                        onBackdropPress={() => { this.setState({ showModal: false }) }}
                    >
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                           
                            <View style={{ height: height * 0.3, width: width * 0.9, backgroundColor: "#fff", borderRadius: 20, alignItems: "center", justifyContent: "center" }}>
                                <View style={{marginTop:5}}>
                                    <Text style={[styles.text,{color:"#000",fontSize:18}]}>Select Clinic</Text>
                                </View>
                                <FlatList
                                    data={this.state.medicals}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({ item, index }) => {
                                        return (
                                            <TouchableOpacity style={{ flexDirection: "row", marginTop: 20, alignItems: 'center', justifyContent: "space-around", width }}
                                                onPress={() => { this.setActiveMedical(item) }}
                                            >   
                                                <View style={{flex:0.6,alignItems:"center",justifyContent:'center'}}>
                                                    <Text style={[styles.text]}>{item.name}</Text>
                                                </View>
                                              
                                                <View style={{flex:0.4,alignItems:'center',justifyContent:"center"}}>
                                                    <FontAwesome name="dot-circle-o" size={24} color={this.props.medical == item ? themeColor : "gray"} />

                                                </View>
                                            </TouchableOpacity>
                                        )
                                    }}
                                />

                            </View>
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
        medical:state.selectedMedical
    }
}
export default connect(mapStateToProps, { selectTheme, selectMedical})(PriscriptionIssue);
