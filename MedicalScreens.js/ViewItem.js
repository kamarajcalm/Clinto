import React, { Component } from 'react';
import { View, Text, Dimensions, TouchableOpacity, StyleSheet, TextInput, FlatList, Image, SafeAreaView, Alert, ActivityIndicator} from 'react-native';
import { Ionicons, Entypo, AntDesign, FontAwesome, FontAwesome5, MaterialIcons} from '@expo/vector-icons';
import { connect } from 'react-redux';
import { selectTheme } from '../actions';
import settings from '../AppSettings';
import medicine from '../components/Medicine';
import Medicine from '../components/Medicine';
import HttpsClient from '../api/HttpsClient';
import Modal from 'react-native-modal';
import DropDownPicker from 'react-native-dropdown-picker';
const { height, width } = Dimensions.get("window");
const fontFamily = settings.fontFamily;
const themeColor = settings.themeColor;
const screenHeight = Dimensions.get("screen").height;
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";
import {  } from 'react-native-paper';
import moment from 'moment';
import DateTimePickerModal from "react-native-modal-datetime-picker";
const url = settings.url;
let types = [
    {
        label: "Box", value: 'Box'
    },
    {
        label: "Strip", value: 'Strip'
    },
    {
        label: "Quantity", value: 'Quantity'
    },

]
class ViewItem extends Component {
    constructor(props) {
        let item = props.route.params.item
        console.log(item,"oooo")
        super(props);
        this.state = {
            modal: false,
            MedicineName: "",
            Price: '',
            type: types[0].value,
            items: [],
            NoofStripe:"0",
            NoofMedicines:"0",
            boxes:"",
            item,
            date: new Date(),
            show:false,
            today: null,
            quantity:"",
            converted:false

        };
    }
    showDatePicker = () => {
        this.setState({ show: true })
    };

    hideDatePicker = () => {
        this.setState({ show: false })
    };
    handleConfirm = (date) => {

        this.setState({ today: moment(date).format('YYYY-MM-DD'), show: false, date: new Date(date) }, () => {


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
    addMedicine = async () => {
        this.setState({ creating: true })
        // if (this.state.type =="Box"){
        //     if (this.state.boxes == "") {
        //         this.setState({ creating: false })
        //         return this.showSimpleMessage("Please add No of boxes", "#dd7030",)
        //     }
        //     if (this.state.NoofStripe == "") {
        //         this.setState({ creating: false })
        //         return this.showSimpleMessage("Please add No of Stripe", "#dd7030",)
        //     }
        //     if (this.state.NoofMedicines == "") {
        //         this.setState({ creating: false })
        //         return this.showSimpleMessage("Please add No of Medicines", "#dd7030",)
        //     }
        // } else if (this.state.type =="Strip"){
        //     if (this.state.NoofStripe == "") {
        //         this.setState({ creating: false })
        //         return this.showSimpleMessage("Please add No of Stripe", "#dd7030",)
        //     }
        //     if (this.state.NoofMedicines == "") {
        //         this.setState({ creating: false })
        //         return this.showSimpleMessage("Please add No of Medicines", "#dd7030",)
        //     }
        // }else{
        //     if (this.state.NoofMedicines == "") {
        //         this.setState({ creating: false })
        //         return this.showSimpleMessage("Please add No of Medicines", "#dd7030",)
        //     }
        // }
    
     
        let api = `${url}/api/prescription/createSubInventories/`
        let sendData = {
            title:this.state.item.title,
            type:this.state.type,
            category:this.state.item.id,
            number_of_boxes:Number(this.state.boxes),
            number_of_strips:Number(this.state.NoofStripe),
            number_of_medicines:Number(this.state.NoofMedicines),
            expiry_date:this.state.today,
            quantity:this.state.quantity
        }

        let post = await HttpsClient.post(api, sendData)
        console.log(post)
        if (post.type == "success"){
            this.setState({ modal: false })
            this.setState({ creating: false })
            this.showSimpleMessage("Added SuccessFully", "#00A300", "success")
            this.getItems()
        } else {
            this.setState({ creating: false })
            this.showSimpleMessage("Try again", "#B22222", "danger")
        }
    }
    getItems = async () => {
        let api = `${url}/api/prescription/subinventory/?category=${this.props.route.params.item.id}`
        console.log(api)
        let data = await HttpsClient.get(api)
        if (data.type == "success") {
            this.setState({ items: data.data })
        }
    }
    componentDidMount() {
        this.getItems()
    }
    deleteCategory = async (item) => {
        let api = `${url}/api/prescription/subinventory/${item.id}/`
        let del = await HttpsClient.delete(api)
        if (del.type == "success") {
            this.showSimpleMessage("Deleted SuccessFully", "#00A300", "success")
            this.getItems()
        } else {
            this.showSimpleMessage("Try again", "#B22222", "danger")
        }
    }
    calculateQuantity=()=>{
        if (this.props.route.params.item.type == "Tablet" || this.props.route.params.item.type == "Capsules"){
            let box = Number(this.state.boxes)
            let strips = Number(this.state.NoofStripe)
            let medicines = Number(this.state.NoofMedicines)
            let quantity = 0
            quantity += (box * this.state.item.strips_per_boxes) * this.state.item.medicines_per_strips
            quantity += strips * this.state.item.medicines_per_strips
            quantity += medicines
          return  this.setState({ quantity: quantity.toString() })
        }
        let box = Number(this.state.boxes)
        let medicines = Number(this.state.NoofMedicines)
        let quantity = 0
        quantity += (box * this.state.item.medicines_per_strips) + medicines
        return this.setState({ quantity: quantity.toString() })
    }
   convertToStandards =()=>{
       if (this.props.route.params.item.type == "Tablet" || this.props.route.params.item.type == "Capsules") {
       let quantity = Number(this.state.quantity)
       let total_strips = Math.floor(quantity / this.state.item.medicines_per_strips)
       let boxes = Math.floor(total_strips / this.state.item.strips_per_boxes)
       let strips = total_strips % this.state.item.strips_per_boxes
       let medicines = quantity % this.state.item.medicines_per_strips
       return this.setState({ boxes: boxes.toString(), NoofStripe: strips.toString(), NoofMedicines: medicines.toString(),converted:true})
       }
       let quantity = Number(this.state.quantity)
       let boxes = Math.floor(quantity / this.state.item.medicines_per_strips)
       let medicines = quantity % this.state.item.medicines_per_strips
       return this.setState({ boxes: boxes.toString(), NoofMedicines: medicines.toString(), converted: true })
    }
    showDiffrentFields =()=>{
        if (this.props.route.params.item.type == "Tablet" || this.props.route.params.item.type =="Capsules"){
            return (
                <>
                    <View style={{ marginHorizontal: 20, marginTop: 10 }}>
                        <Text style={[styles.text, { color: '#000' }]}>No of  boxes</Text>
                        <TextInput
                            keyboardType={"numeric"}
                            style={{ width: width * 0.8, height: height * 0.05, backgroundColor: "#fff", borderRadius: 5, marginTop: 10 }}
                            selectionColor={themeColor}
                            value={this.state.boxes}
                            onChangeText={(boxes) => { this.setState({ boxes,converted:false},()=>{
                                this.calculateQuantity()
                            })}}
                        />
                    </View>
                <View style={{ marginHorizontal: 20, marginTop: 10 }}>
                    <Text style={[styles.text, { color: '#000' }]}>No of strip per boxes</Text>
                    <TextInput
                        keyboardType={"numeric"}
                        style={{ width: width * 0.8, height: height * 0.05, backgroundColor: "#fff", borderRadius: 5, marginTop: 10 }}
                        selectionColor={themeColor}
                        value={this.state.NoofStripe}
                            onChangeText={(NoofStripe) => {
                                this.setState({ NoofStripe, converted: false},()=>{
                                   this.calculateQuantity()
                            })}}
                    />
                </View>
                    <View style={{ marginHorizontal: 20, marginTop: 10 }}>
                        <Text style={[styles.text, { color: '#000' }]}>No of Tablet per Strips</Text>
                        <TextInput
                            keyboardType={"numeric"}
                            style={{ width: width * 0.8, height: height * 0.05, backgroundColor: "#fff", borderRadius: 5, marginTop: 10 }}
                            selectionColor={themeColor}
                            value={this.state.NoofMedicines}
                            onChangeText={(NoofMedicines) => {
                                this.setState({ NoofMedicines, converted: false},()=>{
                                  this.calculateQuantity()
                            }) }}
                        />
                    </View>
                </>
            )
        }
       return(
           <>
               <View style={{ marginHorizontal: 20, marginTop: 10 }}>
                   <Text style={[styles.text, { color: '#000' }]}>No of  boxes</Text>
                   <TextInput
                       keyboardType={"numeric"}
                       style={{ width: width * 0.8, height: height * 0.05, backgroundColor: "#fff", borderRadius: 5, marginTop: 10 }}
                       selectionColor={themeColor}
                       value={this.state.boxes}
                       onChangeText={(boxes) => {
                           this.setState({ boxes, converted: false }, () => {
                               this.calculateQuantity()
                           })
                       }}
                   />
               </View>
               <View style={{ marginHorizontal: 20, marginTop: 10 }}>
                   <Text style={[styles.text, { color: '#000' }]}>No of Pieces</Text>
                   <TextInput
                       keyboardType={"numeric"}
                       style={{ width: width * 0.8, height: height * 0.05, backgroundColor: "#fff", borderRadius: 5, marginTop: 10 }}
                       selectionColor={themeColor}
                       value={this.state.NoofMedicines}
                       onChangeText={(NoofMedicines) => {
                           this.setState({ NoofMedicines, converted: false }, () => {
                               this.calculateQuantity()
                           })
                       }}
                   />
               </View>
           </>
       )
        
    }
    modal = () => {
        return (
            <Modal
                deviceHeight={screenHeight}
                isVisible={this.state.modal}
                onBackdropPress={() => { this.setState({ modal: false }) }}
            >
                <View style={{ flex: 1, justifyContent: "center" }}>
                    <View style={{ height: height * 0.6, backgroundColor: "#eee", borderRadius: 10, }}>
                    
                    
                        {
                            this.showDiffrentFields()
                        }
                        <View style={{ marginHorizontal: 20, marginTop: 10 }}>
                            <Text style={[styles.text, { color: '#000' }]}>Quantity</Text>
                            <TextInput
                                editable={false}
                                keyboardType={"numeric"}
                                style={{ width: width * 0.8, height: height * 0.05, backgroundColor: "#fff", borderRadius: 5, marginTop: 10 }}
                                selectionColor={themeColor}
                                value={this.state.quantity}
                                onChangeText={(quantity) => { this.setState({ quantity }) }}
                            />
                        </View>
                        <View style={{marginTop:10,marginHorizontal:20}}>
                            <Text style={[styles.text,{color:"#000"}]}>Expiry date</Text>
                            <View style={{flexDirection:"row",marginTop:10}}>
                                <TouchableOpacity style={{alignItems:'center',justifyContent:'center'}}
                                 onPress ={()=>{this.setState({show:true})}}
                                >
                                    <MaterialIcons name="date-range" size={24} color="black" />
                                </TouchableOpacity>
                                 <View style={{alignItems:'center',justifyContent:"center",marginLeft:10}}>
                                     <Text style={[styles.text]}>{this.state.today}</Text>
                                 </View>
                            </View>
                        </View>
                        <View style={{ alignItems: "center", justifyContent: "space-around" ,flexDirection:"row"}}>
                            <TouchableOpacity style={{ backgroundColor: themeColor, height: height * 0.05, width: width * 0.4, alignItems: 'center', justifyContent: 'center', marginTop: 25, borderRadius: 5 }}
                                onPress={() => { this.convertToStandards() }}
                            >
                              <Text style={[styles.text, { color: '#fff' }]}>Covert</Text>
                               
                                
                            </TouchableOpacity>
                          {this.state.converted&&  <TouchableOpacity style={{ backgroundColor: themeColor, height: height * 0.05, width: width * 0.4, alignItems: 'center', justifyContent: 'center', marginTop: 25, borderRadius: 5 }}
                                onPress={() => { this.addMedicine() }}
                            >
                                {!this.state.creating ? <Text style={[styles.text, { color: '#fff' }]}>Add</Text> :
                                    <ActivityIndicator size={"small"} color={"#fff"} />
                                }
                            </TouchableOpacity>}
                        </View>

                    </View>

                </View>
            </Modal>
        )
    }
    createAlert = (item) => {
        Alert.alert(
            "Do you want to delete?",
            ``,
            [
                {
                    text: "No",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "Yes", onPress: () => { this.deleteCategory(item) } }
            ]
        );

    }
    renderHeader = () => {
        return (
            <View style={{ flexDirection: 'row', flex: 1, marginTop: 10 }}>
                <View style={{ flex: 0.1, alignItems: "center", justifyContent: "center" }}>
                    <Text style={[styles.text, { color: "#000" }]}>#</Text>
                </View>
                <View style={{ flex: 0.2, alignItems: "center", justifyContent: "center" }}>
                    <Text style={[styles.text, { color: "#000" }]}>Boxes</Text>
                </View>
                <View style={{ flex: 0.2, alignItems: "center", justifyContent: "center" }}>
                    <Text style={[styles.text, { color: "#000" }]}>Strips</Text>
                </View>
                <View style={{ flex: 0.2, alignItems: "center", justifyContent: "center" }}>
                    <Text style={[styles.text, { color: "#000" }]}>Medicines</Text>
                </View>
                <View style={{ flex: 0.2, alignItems: "center", justifyContent: "center" }}>
                    <Text style={[styles.text], { color: "#000" }}>Qty</Text>
                </View>
                <View style={{ flex: 0.1, alignItems: "center", justifyContent: "center" }}>
                 
                </View>
            </View>
        )
    }
    renderHeader2 = () => {
        return (
            <View style={{ flexDirection: 'row', flex: 1, marginTop: 10 }}>
                <View style={{ flex: 0.1, alignItems: "center", justifyContent: "center" }}>
                    <Text style={[styles.text, { color: "#000" }]}>#</Text>
                </View>
                <View style={{ flex: 0.266, alignItems: "center", justifyContent: "center" }}>
                    <Text style={[styles.text, { color: "#000" }]}>No of Boxes</Text>
                </View>
                <View style={{ flex: 0.266, alignItems: "center", justifyContent: "center" }}>
                    <Text style={[styles.text, { color: "#000" }]}>No of Pieces</Text>
                </View>
                <View style={{ flex: 0.266, alignItems: "center", justifyContent: "center" }}>
                    <Text style={[styles.text], { color: "#000" }}>Qty</Text>
                </View>
                <View style={{ flex: 0.1, alignItems: "center", justifyContent: "center" }}>

                </View>
            </View>
        )
    }
    render() {
        return (
            <>
                <SafeAreaView style={styles.topSafeArea} />
                <SafeAreaView style={styles.bottomSafeArea}>
                    {/*headers  */}
                    <View style={{ height: height * 0.1, backgroundColor: themeColor, borderBottomRightRadius: 20, borderBottomLeftRadius: 20, flexDirection: 'row', alignItems: "center" }}>
                        <TouchableOpacity style={{ flex: 0.2, alignItems: "center", justifyContent: 'center' }}
                            onPress={() => { this.props.navigation.goBack() }}
                        >
                            <Ionicons name="chevron-back-circle" size={30} color="#fff" />
                        </TouchableOpacity>
                        <View style={{ flex: 0.7, }}>
                            <Text style={[styles.text, { color: "#fff", fontSize: 24, fontWeight: 'bold' }]}>{this.props.route.params.item.title}</Text>
                        </View>

                    </View>
                    <FlatList
                        ListHeaderComponent={this.state.item.type=="Tablet"||this.state.item.type=="Capsules"?this.renderHeader():this.renderHeader2()}
                        data={this.state.items}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => {
                            if (this.state.item.type == "Tablet" || this.state.item.type == "Capsules" ){
                                return (
                                    <View
                                        style={{ flexDirection: "row", marginTop: 5, flex: 1, backgroundColor: "#eee", paddingVertical: 10 }}

                                    >

                                        <View style={{ flex: 0.1, alignItems: "center", justifyContent: "center" }}>
                                            <Text style={[styles.text, { color: "#000" }]}>{index + 1}</Text>
                                        </View>

                                        <View style={{ flex: 0.2, alignItems: "center", justifyContent: "center" }}>
                                            <Text style={[styles.text, { color: "#000" }]}>{item.number_of_boxes}</Text>
                                        </View>

                                        <View style={{ flex: 0.2, alignItems: "center", justifyContent: "center" }}>
                                            <Text style={[styles.text, { color: "#000" }]}>{item.number_of_strips}</Text>
                                        </View>

                                        <View style={{ flex: 0.2, alignItems: "center", justifyContent: "center" }}>
                                            <Text style={[styles.text, { color: "#000" }]}>{item.number_of_medicines}</Text>
                                        </View>

                                        <View style={{ flex: 0.2, alignItems: "center", justifyContent: "center" }}>
                                            <Text style={[styles.text], { color: "#000" }}>{item.quantity}</Text>
                                        </View>

                                        <TouchableOpacity style={{ flex: 0.1, alignItems: "center", justifyContent: "center" }}
                                            onPress={() => {
                                                this.createAlert(item)
                                            }}
                                        >
                                            <Entypo name="cross" size={20} color="red" />
                                        </TouchableOpacity>

                                    </View>
                                )
                            }else{
                                return(
                                    <View 
                                        style={{ flexDirection: "row", marginTop: 5, flex: 1, backgroundColor: "#eee", paddingVertical: 10 }}
                                    >
                                        <View style={{ flex: 0.1, alignItems: "center", justifyContent: "center" }}>
                                            <Text style={[styles.text, { color: "#000" }]}>{index+1}</Text>
                                        </View>
                                        <View style={{ flex: 0.266, alignItems: "center", justifyContent: "center" }}>
                                            <Text style={[styles.text, { color: "#000" }]}>{item.number_of_boxes}</Text>
                                        </View>
                                        <View style={{ flex: 0.266, alignItems: "center", justifyContent: "center" }}>
                                            <Text style={[styles.text, { color: "#000" }]}>{item.number_of_medicines}</Text>
                                        </View>
                                        <View style={{ flex: 0.266, alignItems: "center", justifyContent: "center" }}>
                                            <Text style={[styles.text], { color: "#000" }}>{item.quantity}</Text>
                                        </View>
                                        <TouchableOpacity style={{ flex: 0.1, alignItems: "center", justifyContent: "center" }}
                                            onPress={() => {
                                                this.createAlert(item)
                                            }}
                                        >
                                            <Entypo name="cross" size={20} color="red" />
                                        </TouchableOpacity>
                                    </View>
                                )
                            }
               
                        }}
                    />
                    <DateTimePickerModal
                        testID="2"
                        isVisible={this.state.show}
                        mode="date"
                        onConfirm={this.handleConfirm}
                        onCancel={this.hideDatePicker}
                    />
                    <View style={{
                        position: "absolute",
                        bottom: 50,
                        left: 20,
                        right: 20,
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center",

                        borderRadius: 20
                    }}>
                        <TouchableOpacity
                            onPress={() => { this.setState({ modal: true }) }}
                        >
                            <AntDesign name="pluscircle" size={40} color={themeColor} />
                        </TouchableOpacity>
                    </View>
                    {
                        this.modal()
                    }
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
        medical: state.selectedMedical
    }
}
export default connect(mapStateToProps, { selectTheme })(ViewItem);