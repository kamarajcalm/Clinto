import React, { Component } from 'react';
import { View, Text, Dimensions,ActivityIndicator, TouchableOpacity, StyleSheet, TextInput, FlatList, Image, SafeAreaView,Alert } from 'react-native';
import { Ionicons, Entypo, AntDesign ,MaterialIcons} from '@expo/vector-icons';
import { connect } from 'react-redux';
import { selectTheme } from '../actions';
import settings from '../AppSettings';
import medicine from '../components/Medicine';
import Medicine from '../components/Medicine';
import HttpsClient from '../api/HttpsClient';
import moment from 'moment';
const { height, width } = Dimensions.get("window");
const screenHeight = Dimensions.get("screen").height
const fontFamily = settings.fontFamily;
const themeColor = settings.themeColor;
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";
const url = settings.url;
let types = [
    {
        label: "Pending", value: 'Pending'
    },
    {
        label: "Cancelled", value: 'Cancelled'
    },
    {
        label: "Received", value: 'Received'
    },
    {
        label: "Distrubutor Cancelled", value: 'Distrubutor Cancelled'
    },

]
import Modal from 'react-native-modal';
import { ScrollView } from 'react-native-gesture-handler';
class ViewOrders extends Component {
    constructor(props) {
        let item =props.route.params.item
        console.log(item,"ppp")
        super(props);
        this.state = {
            item,
            date: new Date(),
            show: false,
            today: this.props.route.params.item.expected_arriving,
            orderDetails: this.props.route.params.item.order_details,
            Discount: this.props.route.params.item.discount.toString(),
            Amount: this.props.route.params.item.amount.toString(),
            selectedStatus:this.props.route.params.item.status,
            distributorName: this.props.route.params.item.from_contact,
            MobileNo: this.props.route.params.item.from_contactNo,
            singledit:false,
            boxes:"",
            NoofPieces:"",
            noOfQty:"",
            NoofStrips:"",
            selectedItem:null,
            editing:false
        };
    }
    updateOrders = async () => {
        this.setState({ creating: true })
        if (this.state.orderDetails == "") {
            this.setState({ creating: false })
            return this.showSimpleMessage("Please add order Details", "#dd7030",)
        }
        if (this.state.today == null) {
            this.setState({ creating: false })
            return this.showSimpleMessage("Please add expected Arriving", "#dd7030",)
        }
        if (this.state.Amount == "") {
            this.setState({ creating: false })
            return this.showSimpleMessage("Please add amount", "#dd7030",)
        }
        let api = `${url}/api/prescription/inventoryorders/${this.state.item.id}/`
        let sendData = {
            status: this.state.selectedStatus,
            order_details: this.state.orderDetails,
            expected_arriving: this.state.today,
            discount: this.state.Discount,
            amount: this.state.Amount,
            from_contact:this.state.distributorName,
            from_contactNo:this.state.MobileNo
        }
        let post = await HttpsClient.patch(api, sendData)
        console.log(post)
        if (post.type == "success") {
            this.setState({ 
                modal: false, 
                orderDetails: post.data.order_details, 
                Discount: post.data.discount.toString(), 
                Amount: post.data.amount.toString(), 
                selectedStatus:post.data.status,
                distributorName:post.data.from_contact,
                MobileNo: post.data.from_contactNo
            })
            this.setState({ creating: false })
            this.showSimpleMessage("Edited SuccessFully", "#00A300", "success")

        } else {
            this.setState({ creating: false })
            this.showSimpleMessage("Try again", "#B22222", "danger")
        }
    }
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
    deleteCategory2 = async (item) => {
        let api = `${url}/api/prescription/inventoryorders/${this.state.item.id}/`
        let del = await HttpsClient.delete(api)
        if (del.type == "success") {
            this.showSimpleMessage("Deleted SuccessFully", "#00A300", "success")
            this.props.navigation.goBack()
        } else {
            this.showSimpleMessage("Try again", "#B22222", "danger")
        }
    }
    createAlert2 = (item) => {
        Alert.alert(
            "Do you want to delete?",
            `${this.state.item.order_details}`,
            [
                {
                    text: "No",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "Yes", onPress: () => { this.deleteCategory2(item) } }
            ]
        );

    }
    editItem = async()=>{
      let duplicate = {...this.state.selectedItem}

      duplicate.number_of_boxes= Number(this.state.boxes),
      duplicate.number_of_medicines = Number(this.state.NoofPieces)
      duplicate.number_of_strips= Number(this.state.NoofStrips)
      duplicate.quantity= Number(this.state.Quantity)
      duplicate.type ="quantity"
        let api = `${url}/api/prescription/editSubIn/`
        let post = await HttpsClient.post(api,duplicate)
        if(post.type=="success"){
             let dup = this.state.item
            dup.items[this.state.selectedIndex] = duplicate
            this.showSimpleMessage("edited successFully","green","success")
            this.setState({ singledit: false, editing: false, item:dup})
        }else{
            this.showSimpleMessage("Try Again","green", "success")
            this.setState({ editing: false })
        }
    }
    calculateQuantity = () => {
        if (this.state.selectedItem?.medicineDetail?.type != "Tablet" && this.state.selectedItem?.medicineDetail?.type != "Capsules") {
            let NoofPiecesPerBox = this.state.selectedItem.medicineDetail.medicines_per_strips
            let boxes = Number(this.state.boxes)
            let Pieces = Number(this.state.NoofPieces)
            let quantity = 0
            quantity = (boxes * NoofPiecesPerBox) + Pieces
            console.log(quantity, "qq")

            return this.setState({ Quantity: quantity.toString() })
        }
        let box = Number(this.state.boxes)
        let strips = Number(this.state.NoofStrips)
        let medicines = Number(this.state.NoofPieces)
        let quantity = 0
        quantity += (box * this.state.selectedItem.medicineDetail.strips_per_boxes) * this.state.selectedItem.medicineDetail.medicines_per_strips
        quantity += strips * this.state.selectedItem.medicineDetail.medicines_per_strips
        quantity += medicines
        return this.setState({ Quantity: quantity.toString()})
    }
    showDifferent =()=>{
        if (this.state?.selectedItem?.medicineDetail?.type != "Tablet" && this.state?.selectedItem?.medicineDetail?.type != "Capsules") {
            return (
                <>
                    <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
                        <View style={{}}>
                            <Text style={[styles.text, { color: "#000" }]}>Number of Boxes</Text>
                        </View>

                        <TextInput
                            keyboardType={"numeric"}
                            value={this.state.boxes}
                            onChangeText={(boxes) => {
                                this.setState({ boxes }, () => {
                                    this.calculateQuantity()
                                })
                            }}
                            style={{ height: height * 0.1, width: width * 0.5, backgroundColor: "#fff", borderRadius: 10, paddingLeft: 10, marginTop: 5 }}
                            selectionColor={themeColor}
                        />


                    </View>
                    <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
                        <View style={{}}>
                            <Text style={[styles.text, { color: "#000" }]}>Number of Pieces</Text>
                        </View>

                        <TextInput
                            keyboardType={"numeric"}
                            value={this.state.NoofPieces}
                            onChangeText={(NoofPieces) => {
                                this.setState({ NoofPieces }, () => {
                                    this.calculateQuantity()
                                })
                            }}
                            style={{ height: height * 0.1, width: width * 0.5, backgroundColor: "#fff", borderRadius: 10, paddingLeft: 10, marginTop: 5 }}
                            selectionColor={themeColor}
                        />


                    </View>
                </>
            )
        }
        return (
            <>
                <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
                    <View style={{}}>
                        <Text style={[styles.text, { color: "#000" }]}>Number of Boxes</Text>
                    </View>

                    <TextInput
                        keyboardType={"numeric"}
                        value={this.state.boxes}
                        onChangeText={(boxes) => {
                            this.setState({ boxes }, () => {
                                this.calculateQuantity()
                            })
                        }}
                        style={{ height: height * 0.1, width: width * 0.5, backgroundColor: "#fff", borderRadius: 10, paddingLeft: 10, marginTop: 5 }}
                        selectionColor={themeColor}
                    />


                </View>
                <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
                    <View style={{}}>
                        <Text style={[styles.text, { color: "#000" }]}>Number of Strips</Text>
                    </View>

                    <TextInput
                        keyboardType={"numeric"}
                        value={this.state.NoofStrips}
                        onChangeText={(NoofStrips) => {
                            this.setState({ NoofStrips }, () => {
                                this.calculateQuantity()
                            })
                        }}
                        style={{ height: height * 0.1, width: width * 0.5, backgroundColor: "#fff", borderRadius: 10, paddingLeft: 10, marginTop: 5 }}
                        selectionColor={themeColor}
                    />


                </View>
                <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
                    <View style={{}}>
                        <Text style={[styles.text, { color: "#000" }]}>Number of Tablets</Text>
                    </View>

                    <TextInput
                        keyboardType={"numeric"}
                        value={this.state.NoofPieces}
                        onChangeText={(NoofPieces) => {
                            this.setState({ NoofPieces }, () => {
                                this.calculateQuantity()
                            })
                        }}
                        style={{ height: height * 0.1, width: width * 0.5, backgroundColor: "#fff", borderRadius: 10, paddingLeft: 10, marginTop: 5 }}
                        selectionColor={themeColor}
                    />


                </View>
            </>
        )
    }
    singleEditModal =()=>{

        const { height, width } = Dimensions.get("window");
        return(
            <Modal
                deviceHeight={screenHeight}
                isVisible={this.state.singledit}
                onBackdropPress={() => { this.setState({ singledit: false }) }}
            >
                <View style={{ flex: 1, justifyContent: "center",alignSelf:"center" }}>
                    <View style={{ height: height * 0.8, backgroundColor: "#eee", borderRadius: 10,width:width*0.7 }}>
                        <ScrollView
                          contentContainerStyle={{alignItems:"center",justifyContent:"center"}}
                        >
                                 <View style={{alignItems:"center",justifyContent:"center",marginVertical:20}}>
                                     <Text style={[styles.text,{color:"#000",fontSize:22}]}>Add Medicines</Text>
                                 </View>
                                  {
                                      this.showDifferent()
                                  }

                            <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
                                <View style={{}}>
                                    <Text style={[styles.text, { color: "#000" }]}>Quantity</Text>
                                </View>

                                <TextInput
                                    editable={false}
                                    keyboardType={"numeric"}
                                    value={this.state.Quantity}
                                    onChangeText={(Quantity) => {
                                        this.setState({ Quantity }, () => {
                                            this.calculateQuantity()
                                        })
                                    }}
                                    style={{ height: height * 0.1, width: width * 0.5, backgroundColor: "#fff", borderRadius: 10, paddingLeft: 10, marginTop: 5 }}
                                    selectionColor={themeColor}
                                />


                            </View>
                            
                            <View style={{ alignItems:"center" ,justifyContent:"center",marginVertical:20}}>
                                  <TouchableOpacity style={{height:height*0.1,width:width*0.3,alignItems:"center",justifyContent:"center",backgroundColor:themeColor}}
                                    onPress={()=>{
                                        this.setState({editing:true},()=>{
                                            this.editItem()
                                        })
                                       
                                    
                                    }}
                                  >
                                         {!this.state.editing?<Text style={[styles.text,{color:"#fff"}]}>Edit</Text>:
                                          <ActivityIndicator size={"large"}  color={"#fff"}/>
                                        }
                                  </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>

                </View>
            </Modal>
        )
    }
    modal=() => {
        const { height, width } = Dimensions.get("window");
        return (
            <Modal
                deviceHeight={screenHeight}
                isVisible={this.state.modal}
                onBackdropPress={() => { this.setState({ modal: false }) }}
            >
                <View style={{ flex: 1, justifyContent: "center" }}>
                    <View style={{ height: height * 0.8, backgroundColor: "#eee", borderRadius: 10, }}>
                        <ScrollView>


                        <View style={{ marginHorizontal: 20, marginTop: 10 }}>
                            <Text style={[styles.text, { color: '#000' }]}>Select status</Text>
                            <View style={{ marginTop: 10 }}>
                                <DropDownPicker
                                    items={types}
                                    defaultValue={this.state.selectedStatus}
                                    containerStyle={{ height: 40, width: width * 0.8 }}
                                    style={{ backgroundColor: '#fafafa' }}
                                    itemStyle={{
                                        justifyContent: 'flex-start'
                                    }}
                                    dropDownStyle={{ backgroundColor: '#fafafa', width: width * 0.8 }}

                                    onChangeItem={(item) => {
                                        this.setState({ selectedStatus: item.value })
                                    }}
                                />
                            </View>
                            <View style={{ marginTop: 10 }}>
                                <Text style={[styles.text, { color: '#000' }]}>Distrubutor Name</Text>
                                <TextInput
                                    multiline={true}
                                    style={{ width: width * 0.8, height: height * 0.1, backgroundColor: "#fff", borderRadius: 5, marginTop: 10, textAlignVertical: "top" }}
                                    selectionColor={themeColor}
                                    value={this.state.distributorName}
                                    onChangeText={(distributorName) => { this.setState({ distributorName }) }}
                                />
                            </View>
                                <View style={{ marginTop: 10 }}>
                                    <Text style={[styles.text, { color: '#000' }]}>Mobile No</Text>
                                    <TextInput
                                        keyboardType={"numeric"}
                                        style={{ width: width * 0.8, height: height * 0.1, backgroundColor: "#fff", borderRadius: 5, marginTop: 10 }}
                                        selectionColor={themeColor}
                                        value={this.state.MobileNo}
                                        onChangeText={(MobileNo) => { this.setState({ MobileNo }) }}
                                    />
                                </View>
                            <View style={{ marginTop: 10 }}>
                                <Text style={[styles.text, { color: '#000' }]}>order Details</Text>
                                <TextInput
                                    multiline={true}
                                    style={{ width: width * 0.8, height: height * 0.1, backgroundColor: "#fff", borderRadius: 5, marginTop: 10 ,textAlignVertical:"top"}}
                                    selectionColor={themeColor}
                                    value={this.state.orderDetails}
                                    onChangeText={(orderDetails) => { this.setState({ orderDetails }) }}
                                />
                            </View>
                            <View style={{ marginTop: 10, }}>
                                <Text style={[styles.text, { color: "#000" }]}>Expected Arriving</Text>
                                <View style={{ flexDirection: "row", marginTop: 10 }}>
                                    <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center' }}
                                        onPress={() => { this.setState({ show: true }) }}
                                    >
                                        <MaterialIcons name="date-range" size={24} color="black" />
                                    </TouchableOpacity>
                                    <View style={{ alignItems: 'center', justifyContent: "center", marginLeft: 10 }}>
                                        <Text style={[styles.text]}>{this.state.today}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={{ marginTop: 10 }}>
                                <Text style={[styles.text, { color: '#000' }]}>Discount</Text>
                                <TextInput
                                    keyboardType={"numeric"}
                                    style={{ width: width * 0.8, height: height * 0.1, backgroundColor: "#fff", borderRadius: 5, marginTop: 10 }}
                                    selectionColor={themeColor}
                                    value={this.state.Discount}
                                    onChangeText={(Discount) => { this.setState({ Discount }) }}
                                />
                            </View>
                            <View style={{ marginTop: 10 }}>
                                <Text style={[styles.text, { color: '#000' }]}>Amount</Text>
                                <TextInput
                                    keyboardType={"numeric"}
                                    style={{ width: width * 0.8, height: height * 0.1, backgroundColor: "#fff", borderRadius: 5, marginTop: 10 }}
                                    selectionColor={themeColor}
                                    value={this.state.Amount}
                                    onChangeText={(Amount) => { this.setState({ Amount }) }}
                                />
                            </View>
                            <View style={{ alignItems: "center", justifyContent: "center" ,marginVertical:20}}>
                                <TouchableOpacity style={{ backgroundColor: themeColor, height: height * 0.1, width: width * 0.4, alignItems: 'center', justifyContent: 'center', marginTop: 25, borderRadius: 5 }}
                                    onPress={() => { this.updateOrders() }}
                                >
                                    {!this.state.creating ? <Text style={[styles.text, { color: '#fff' }]}>Edit</Text> :
                                        <ActivityIndicator size={"small"} color={"#fff"} />
                                    }
                                </TouchableOpacity>
                            </View>
                        </View>
                        </ScrollView>
                    </View>

                </View>
            </Modal>
        )
    }
    validateColor =(status)=>{
        if (status == "Pending"){
            return "orange"
        }
        if (status == "Cancelled") {
            return "red"
        }
        if (status == "Received") {
            return "green"
        }
        if (status == "Distrubutor Cancelled") {
            return "red"
        }
    }
    renderHeader =()=>{
        const { height, width } = Dimensions.get("window");
        return(
            <>
             <View style={{ alignItems: "center", marginVertical: 10 }}>
                    <Text style={[styles.text, { color: "#000", fontSize: 22,}]}>Medicines</Text>
                </View>
            <View style={{flexDirection:"row",flex:1,marginTop:10}}>
                <View style={{flex:0.05,alignItems:"center",justifyContent:"center"}}>
                    <Text style={[styles.text,{color:"#000"}]}>#</Text>
                </View>
                <View style={{ flex:0.2, alignItems: "center", justifyContent: "center" }}>
                    <Text style={[styles.text,{color:"#000"}]}>Name</Text>
                </View>
                <View style={{ flex:0.1, alignItems: "center", justifyContent: "center" }}>
                    <Text style={[styles.text,{color:"#000"}]}>Type</Text>
                </View>
                <View style={{ flex:0.1, alignItems: "center", justifyContent: "center" }}>
                    <Text style={[styles.text,{color:"#000"}]}>boxes</Text>
                </View>
                <View style={{ flex:0.1, alignItems: "center", justifyContent: "center" }}>
                    <Text style={[styles.text,{color:"#000"}]}>Strips</Text>
                </View>
                <View style={{ flex:0.1, alignItems: "center", justifyContent: "center" }}>
                    <Text style={[styles.text,{color:"#000"}]}>Pieces</Text>
                </View>
                <View style={{flex:0.1, alignItems: "center", justifyContent: "center" }}>
                    <Text style={[styles.text,{color:"#000"}]}>Quantity</Text>
                </View>
                <View style={{flex: 0.1,alignItems: "center", justifyContent: "center" }}>
                    <Text style={[styles.text, { color: "#000" }]}>Status</Text>
                </View>
                <View style={{flex:0.1,alignItems: "center", justifyContent: "center" }}>
                    <Text style={[styles.text, { color: "#000" }]}>Edit</Text>
                </View>
                <View style={{ flex: 0.05, alignItems: "center", justifyContent: "center" }}>
                    
                </View>
            </View>
            </>
        )
    }
    renderFooter =()=>{
        const { height, width } = Dimensions.get("window");
        return(
            <>
               
            <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-around",flexWrap:"wrap",borderColor:"#333",borderBottomWidth:0.5}}>
                <View style={{ marginTop: 10, marginHorizontal: 10 }}>
                    <Text style={[styles.text, { color: "#000" }]}>Order Details :</Text>
                    <View style={{ marginTop: 5, marginLeft: 10 }}>
                        <Text style={[styles.text]}>{this.state.orderDetails}</Text>
                    </View>
                </View>
                <View style={{ marginTop: 20, marginHorizontal: 10 }}>
                    <Text style={[styles.text, { color: "#000" }]}>Order Created :</Text>
                    <View style={{ marginTop: 5, marginLeft: 10 }}>
                        <Text style={[styles.text]}>{moment(this.state.item.created).format('YYYY-MM-DD')}</Text>
                    </View>
                </View>
                <View style={{ marginTop: 20, marginHorizontal: 10 }}>
                    <Text style={[styles.text, { color: "#000" }]}>Expected Arriving :</Text>
                    <View style={{ marginTop: 5, marginLeft: 10 }}>
                        <Text style={[styles.text]}>{this.state.today}</Text>
                    </View>
                </View>
                <View style={{ marginTop: 20, marginHorizontal: 10 }}>
                    <Text style={[styles.text, { color: "#000" }]}>Amount</Text>
                    <View style={{ marginTop: 5, marginLeft: 10, flexDirection: 'row' }}>

                        <Text style={[styles.text]}>??? {this.state.Amount}</Text>
                    </View>
                </View>
                <View style={{ marginTop: 20, marginHorizontal: 10 }}>
                    <Text style={[styles.text, { color: "#000" }]}>Discount</Text>
                    <View style={{ marginTop: 5, marginLeft: 10, flexDirection: 'row' }}>

                        <Text style={[styles.text]}>??? {this.state.Discount}</Text>
                    </View>
                </View>
                <View style={{ marginTop: 20, marginHorizontal: 10 }}>
                    <View>
                            <Text style={[styles.text, { color: "#000" }]}>Status</Text>
                    </View>
                 
                    <View style={{ marginTop: 5,}}>
               
                        <Text style={[styles.text, { color: this.validateColor(this.state.selectedStatus) }]}> {this.state.selectedStatus}</Text>
                    </View>
                </View>
         
            </View>
            </>
        )
    }
    changeStatus = async(item,index)=>{
        let api = `${url}/api/prescription/editSubIn/`

        let sendData ={
            id:item.id,
            is_added:!item.is_added,
            type:"received"
        }
        let post = await HttpsClient.post(api, sendData)
        if(post.type=="success"){
             let duplicate =  this.state.item
             duplicate.items[index].is_added = !duplicate.items[index].is_added
             this.setState({item:duplicate})
        }
       
    }
    render() {
        const { height, width } = Dimensions.get("window");
        return (
            <>
                <SafeAreaView style={styles.topSafeArea} />
                <SafeAreaView style={styles.bottomSafeArea}>
                    {/* Headers */}
                    <View style={{ height: height * 0.12, backgroundColor: themeColor, borderBottomRightRadius: 20, borderBottomLeftRadius: 20, flexDirection: 'row', alignItems: "center" }}>
                        <TouchableOpacity style={{ flex: 0.2, alignItems: "center", justifyContent: 'center' }}
                            onPress={() => { this.props.navigation.goBack() }}
                        >
                            <Ionicons name="chevron-back-circle" size={30} color="#fff" />
                        </TouchableOpacity>
                        <View style={{ flex: 0.6,alignItems:"center",justifyContent:"center" }}>
                            <Text style={[styles.text, { color: "#fff", fontSize: 24, fontWeight: 'bold' }]}>Order Details</Text>
                        </View>
                        <View style={{flex:0.2}}>
                            <Text style={[styles.text, { color: "#fff", fontSize: 24, fontWeight: 'bold' }]}></Text>
                        </View>
                    </View>
                    <View style={{flex:1}}>
                        <ScrollView>

              
                       
                             {
                                 this.renderFooter()
                             }
                            <FlatList 
                              data= {this.state.item.items}
                              keyExtractor ={(item,index)=>index.toString()}
                              ListHeaderComponent ={this.renderHeader()}
                        
                              renderItem ={({item,index})=>{
                                    return(
                                        <View style={{ flexDirection: "row" ,marginTop:5,flex:1}}>
                                            <View style={{flex:0.05, alignItems: "center", justifyContent: "center" }}>
                                                <Text style={[styles.text]}>{index+1}</Text>
                                            </View>
                                            <View style={{ flex: 0.2,alignItems: "center", justifyContent: "center" }}>
                                                <Text style={[styles.text]}>{item.medicineDetail.title}</Text>
                                            </View>
                                            <View style={{ flex: 0.1,alignItems: "center", justifyContent: "center" }}>
                                                <Text style={[styles.text]}>{item.medicineDetail.type}</Text>
                                            </View>
                                            <View style={{ flex: 0.1,alignItems: "center", justifyContent: "center" }}>
                                                <Text style={[styles.text]}>{item.number_of_boxes}</Text>
                                            </View>
                                            <View style={{ flex: 0.1, alignItems: "center", justifyContent: "center" }}>
                                                <Text style={[styles.text]}>{item.number_of_strips}</Text>
                                            </View>
                                            <View style={{ flex: 0.1, alignItems: "center", justifyContent: "center" }}>
                                                <Text style={[styles.text]}>{item.number_of_medicines}</Text>
                                            </View>
                                            <View style={{ flex: 0.1,alignItems: "center", justifyContent: "center" }}>
                                                <Text style={[styles.text]}>{item.quantity}</Text>
                                            </View>
                                            <View style={{ flex: 0.1,alignItems: "center", justifyContent: "center" }}>
                                                <Text style={[styles.text, { color: item.is_added?"green":"red" }]}>{item.is_added?"recieved":"pending"}</Text>
                                            </View>
                                            <TouchableOpacity style={{ flex:0.1, alignItems: "center", justifyContent: "center" }}
                                                onPress={() => {
                                                    this.setState({ 
                                                        selectedItem: item, 
                                                        selectedIndex:index,
                                                        boxes: item.number_of_boxes.toString(), 
                                                        NoofStrips: item.number_of_strips.toString(),
                                                        NoofPieces:item.number_of_medicines.toString(),
                                                        Quantity: item.quantity.toString()
                                                    },()=>{
                                                 this.setState({singledit:true})
                                             })}}
                                            >
                                                <Entypo name="edit" size={24} color={themeColor} />
                                            </TouchableOpacity>
                                            <TouchableOpacity style={{ flex: 0.05, alignItems: "center", justifyContent: "center" }}
                                                onPress={() => {
                                                   this.changeStatus(item,index)
                                                }}
                                            >
                                             <Text style={[styles.text,{color:themeColor,textDecorationLine:"underline"}]}>swap</Text> 
                                            </TouchableOpacity>
                                        </View>
                                    )
                              }}
                            />
                            <View style={{ width, alignItems: "center", justifyContent: "space-around", flexDirection: 'row', paddingVertical: height * 0.03 }}>
                                {this.state.item.status != "Received" && <TouchableOpacity
                                    style={{ height: height * 0.1, width: width * 0.3, alignItems: "center", justifyContent: "center", borderRadius: 5 }}
                                    onPress={() => { this.setState({ modal: true, }) }}
                                >
                                    <Text style={[styles.text], { color:"green" ,textDecorationLine:"underline",fontSize:22}}>Edit</Text>
                                </TouchableOpacity>}
                                <TouchableOpacity
                                    style={{ height: height * 0.1, width: width * 0.3,  alignItems: "center", justifyContent: "center", borderRadius: 5 }}
                                    onPress={() => { this.createAlert2() }}
                                >
                                    <Text style={[styles.text], { color: "red",textDecorationLine:"underline" ,fontSize:22}}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                
                    <DateTimePickerModal
                        testID="2"
                        isVisible={this.state.show}
                        mode="date"
                        onConfirm={this.handleConfirm}
                        onCancel={this.hideDatePicker}
                    />
                    {
                        this.modal()
                    }
                    {
                        this.singleEditModal()
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

    }
}
export default connect(mapStateToProps, { selectTheme })(ViewOrders);