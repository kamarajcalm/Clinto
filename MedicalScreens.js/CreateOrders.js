import React, { Component } from 'react';
import { View, Text, Dimensions, TouchableOpacity, StyleSheet, TextInput, FlatList, Image, SafeAreaView, ScrollView, ActivityIndicator} from 'react-native';
import { Ionicons, Entypo, AntDesign } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { selectTheme } from '../actions';
import settings from '../AppSettings';
const { height, width } = Dimensions.get("window");
const fontFamily = settings.fontFamily;
const themeColor = settings.themeColor;
const screenHeight = Dimensions.get("screen").height;
const url = settings.url;
import HttpsClient from '../api/HttpsClient';
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";
import DropDownPicker from 'react-native-dropdown-picker';
import Modal from 'react-native-modal';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import { MaterialIcons} from '@expo/vector-icons';
let types = [
    {
        label: "Pending", value: 'Pending'
    },
    {
        label: "Cancelled", value: 'Cancelled'
    },

    {
        label: "Distrubutor Cancelled", value: 'Distrubutor Cancelled'
    },

]
class CreateOrders extends Component {
  constructor(props) {
    super(props);
    this.state = {
        contactNo:"",
        contactName:"",
        Amount:"",
        selectedStatus:types[0].value,
        show:false,
        today:moment(new Date()).format("YYYY-MM-DD"),
        Discount:"0",
        orderDetails:"",
        showModal:false,
        searchMedicines:[],
        itemGot:false,
        boxes:"",
        NoofPieces:"",
        medicines:[],
        Quantity:"",
        NoofStrips:"",
        selectedItem:null,
        minOrder:false,
    };
  }
    loadModal =()=>{
        return(
            <Modal
               isVisible ={this.state.loadModal}
               deviceHeight ={screenHeight}
            >
             <View style={{flex:1,alignItems:"center",justifyContent:"center"}}>
                 <ActivityIndicator size={"large"} color={"#fff"}/>
             </View>
            </Modal>
        )
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
    hideDatePicker = () => {
        this.setState({ show: false })
    };
    handleConfirm = (date) => {

        this.setState({ today: moment(date).format('YYYY-MM-DD'), show: false, date: new Date(date) }, () => {


        })
        this.hideDatePicker();
    };
    searchMedicines = async(Medicine)=>{
        this.setState({ Medicine: Medicine, itemGot:false})
        if (Medicine != "") {
            let api = `${url}/api/prescription/subSearch/?name=${Medicine}&inventory=${this.props.medical.inventory}`
            console.log(api, "ppp")
            let data = await HttpsClient.get(api)
            if (data.type == "success") {
                this.setState({ searchMedicines: data.data })
            }
        } else {
            this.setState({ searchMedicines: [] })
        }
    }
    convertToStandards = () => {
        if (this.state.selectedItem.type == "Tablet" || this.state.selectedItem.type == "Capsules") {
            let quantity = Number(this.state.Quantity)
            let total_strips = Math.floor(quantity / this.state.selectedItem.medicines_per_strips)
            let boxes = Math.floor(total_strips / this.state.selectedItem.strips_per_boxes)
            let strips = total_strips % this.state.selectedItem.strips_per_boxes
            let medicines = quantity % this.state.selectedItem.medicines_per_strips
            return { boxes, strips, medicines}
        }
        let quantity = Number(this.state.Quantity)
        let boxes = Math.floor(quantity / this.state.selectedItem.medicines_per_strips)
        let medicines = quantity % this.state.selectedItem.medicines_per_strips
        return { boxes, strips: 0, medicines}
    }
    calculateQuantity =()=>{
       if(this.state.selectedItem.type!="Tablet"&&this.state.selectedItem.type!="Capsules"){
           let NoofPiecesPerBox = this.state.selectedItem.medicines_per_strips
           let boxes= Number(this.state.boxes)
           let Pieces = Number(this.state.NoofPieces)
           let quantity = 0
           quantity = (boxes * NoofPiecesPerBox) + Pieces
           console.log(quantity,"qq")

           return this.setState({ Quantity:quantity.toString()})
       }
        let box = Number(this.state.boxes)
        let strips = Number(this.state.NoofStrips)
        let medicines = Number(this.state.NoofPieces)
        let quantity = 0
        quantity += (box * this.state.selectedItem.strips_per_boxes) * this.state.selectedItem.medicines_per_strips
        quantity += strips * this.state.selectedItem.medicines_per_strips
        quantity += medicines
        return this.setState({ Quantity: quantity.toString() })
    }
    showDifferntContainers =()=>{
        if (this.state?.selectedItem?.type != "Tablet" && this.state?.selectedItem?.type != "Capsules"){
            return(
                <>
                    <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
                        <View style={{}}>
                            <Text style={[styles.text, { color: "#000" }]}>Number of Boxes</Text>
                        </View>

                        <TextInput
                            keyboardType={"numeric"}
                            value={this.state.boxes}
                            onChangeText={(boxes) => { this.setState({ boxes },()=>{
                                  this.calculateQuantity()
                            }) }}
                            style={{ height: height * 0.05, width: width * 0.8, backgroundColor: "#fff", borderRadius: 10, paddingLeft: 10, marginTop: 5 }}
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
                            onChangeText={(NoofPieces) => { this.setState({ NoofPieces },()=>{
                                this.calculateQuantity()
                            })}}
                            style={{ height: height * 0.05, width: width * 0.8, backgroundColor: "#fff", borderRadius: 10, paddingLeft: 10, marginTop: 5 }}
                            selectionColor={themeColor}
                        />


                    </View>
                </>
            )
        }
        return(
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
                    style={{ height: height * 0.05, width: width * 0.8, backgroundColor: "#fff", borderRadius: 10, paddingLeft: 10, marginTop: 5 }}
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
                        style={{ height: height * 0.05, width: width * 0.8, backgroundColor: "#fff", borderRadius: 10, paddingLeft: 10, marginTop: 5 }}
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
                        style={{ height: height * 0.05, width: width * 0.8, backgroundColor: "#fff", borderRadius: 10, paddingLeft: 10, marginTop: 5 }}
                        selectionColor={themeColor}
                    />


                </View>
            </>
        )
       
    }
    addMedicines =()=>{
         let duplicate = this.state.medicines
         let convert =  this.convertToStandards()
         let find = duplicate.find((i)=>{
             return this.state.selectedItem.id == i.medicine.id
         })
         if(find){
             let findIndex = duplicate.indexOf(find)
             duplicate.splice(findIndex,1)
         }
         let pushObject = {
             medicine:{
                 id:this.state.selectedItem.id,
                 title: this.state.selectedItem.title,
                 type:this.state.selectedItem.type

             },
             required_boxes: convert.boxes,
             required_strips:convert.strips,
             required_pieces:convert.medicines,
             quantity:this.state.Quantity,
         }
        duplicate.push(pushObject)
        return this.setState({ 
            medicines: duplicate, 
            showModal: false, 
            Quantity: "", 
            NoofPieces: "", 
            NoofStrips: "", 
            boxes: "", 
            Medicine:"",
            itemGot:false
        })
    }
    Modal =()=>{
        return(
            <Modal
                deviceHeight={screenHeight}
                isVisible={this.state.showModal}
                onBackdropPress={() => { this.setState({showModal: false })}}
            >
                <View style={{ flex: 1, justifyContent: "center" }}>
                    <View style={{ height: height * 0.6, backgroundColor: "#eee", borderRadius: 10, }}>
                         <View style={{marginVertical:10,alignItems:"center",justifyContent:"center"}}>
                             <Text style={[styles.text,{color:"#000"}]}>Add Medicines</Text>
                         </View>
                         <ScrollView>
                            <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
                                <View style={{}}>
                                    <Text style={[styles.text, { color: "#000" }]}>Search Medicine</Text>
                                </View>

                                <TextInput
                                    value={this.state.Medicine}
                                    onChangeText={(Medicine) => { this.searchMedicines(Medicine) }}
                                    style={{ height: height * 0.05, width: width * 0.8, backgroundColor: "#FFF", borderRadius: 10, paddingLeft: 10, marginTop: 5 }}
                                    selectionColor={themeColor}
                                />


                            </View>
                            {this.state.searchMedicines.length>0&&<ScrollView 
                                style={{ position: "relative", top: -10, width: width * 0.8, height: height * 0.2, backgroundColor: "#fff", borderRadius: 5, alignSelf: "center" }}
                                contentContainerStyle={{ alignItems: "center", justifyContent: "space-around", }}
                            >
                              
                                    {
                                        this.state.searchMedicines.map((item, index) => {
                                            return (
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        this.setState({ Medicine: item.title, type: item.type, itemGot:true ,selectedItem:item}, () => {
                                                            this.setState({ searchMedicines: [] })
                                                        })
                                                    }}
                                                    key={index}
                                                    style={{ padding: 5, backgroundColor: "blue", marginVertical: 5, borderRadius: 5, width: width * 0.4, height: height * 0.05, alignItems: "center", justifyContent: "center" }}
                                                >
                                                    <Text style={[styles.text, { color: "#fff" }]}>{item.title}</Text>
                                                </TouchableOpacity>
                                            )
                                        })
                                    }
                             
                           
                            </ScrollView>}
                            {
                                this.state.itemGot&&<View>
                                    <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
                                        <Text style={[styles.text, { color: "#000" }]}>Type</Text>
                                        <View
                                            style={{ height: height * 0.05, width: width * 0.8, backgroundColor: "#FFF", borderRadius: 10, paddingLeft: 10, marginTop: 5 ,justifyContent:"center"}}
                                        >
                                            <Text style={[styles.text]}>{this.state.type}</Text>
                                        </View>
                                    </View>
                                    {
                                     this.showDifferntContainers()
                                    }
                                    <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
                                        <View style={{}}>
                                            <Text style={[styles.text, { color: "#000" }]}>Quantity</Text>
                                        </View>

                                        <TextInput
                                            editable={false}
                                            keyboardType={"numeric"}
                                            value={this.state.Quantity}
                                            onChangeText={(Quantity) => { this.setState({ Quantity }) }}
                                            style={{ height: height * 0.05, width: width * 0.8, backgroundColor: "#fff", borderRadius: 10, paddingLeft: 10, marginTop: 5 }}
                                            selectionColor={themeColor}
                                        />


                                    </View>
                                    <View style={{marginVertical:10,alignItems:"center"}}>
                                        <TouchableOpacity style={{ height: height * 0.05, width: width * 0.4, alignItems: "center", justifyContent: "center", backgroundColor: themeColor, borderRadius: 5 }}
                                            onPress={() => { this.addMedicines()}}
                                        >
                                            <Text style={[styles.text, { color: "#fff" }]}>Add</Text>
                                        </TouchableOpacity>
                                    </View>
                           
                                </View>
                            }
                         </ScrollView>
                    </View>
                </View>
            </Modal>
        )
    }
    removeItem =(index)=>{
      let duplicate =this.state.medicines
      duplicate.splice(index,1)
        console.log(duplicate,"ppp")
      this.setState({ medicines:duplicate})
    }
    createOrder = async()=>{
        if (this.state.contactName==""){
            this.setState({ creating: false })
            return this.showSimpleMessage("Please fill contactName", "#dd7030",)
        }
        if (this.state.contactNo == "") {
            this.setState({ creating: false })
            return this.showSimpleMessage("Please fill contactNo", "#dd7030",)
        }
        let api = `${url}/api/prescription/createOrders/`
        let sendData ={
            order_details:this.state.orderDetails,
            from_contact:this.state.contactName,
            from_contactNo:this.state.contactNo,
            status:this.state.selectedStatus,
            expected_arriving:this.state.today,
            discount:this.state.Discount,
            amount:this.state.Amount,
            inventory:this.props.medical.inventory,
            orderitems:this.state.medicines
        }
       let post =  await HttpsClient.post(api,sendData)
       if(post.type=="success"){
           this.setState({ creating: false })
           this.showSimpleMessage("order created SuccessFully", "#00A300", "success")
           return this.props.navigation.goBack()
       }else{
           this.setState({ creating: false })
           this.showSimpleMessage("Try again", "#B22222", "danger")
       }
    }
    setEdit =async(item)=>{
        let api = `${url}/api/prescription/maincategory/${item.medicine.id}/`
        let data =await HttpsClient.get(api)
        if(data.type =="success"){
             
            this.setState({ 
                Medicine: data.data.title, 
                type: data.data.type, 
                itemGot: true, 
                selectedItem: data.data, 
                editing: false, 
                NoofStrips: item.required_strips.toString(),
                NoofPieces: item.required_pieces.toString(), 
                boxes: item.required_boxes.toString(),
                Quantity: item.quantity.toString(),
                },()=>{
                 this.setState({showModal:true})
             })
        }else{
            this.showSimpleMessage("Something went wrong", "#B22222", "danger")
        }
    }
    getMinOrder = async()=>{
        this.setState({loadModal:true})
        let api = `${url}/api/prescription/showMinimum/?inventory=${this.props.medical.inventory}`
        console.log(api,"ppp")
        const data = await HttpsClient.get(api)
        if(data.type =="success"){
            this.setState({ medicines: data.data, loadModal:false})
        }else{
            this.setState({ loadModal: false })
            this.showSimpleMessage("Something went wrong", "#B22222", "danger")
        }
    }
  render() {
    return (
          <>
            <SafeAreaView style={styles.topSafeArea}/>
            <SafeAreaView style={styles.bottomSafeArea}>
                {/* Headers */}
                     
                    <View style={{ height: height * 0.1, backgroundColor: themeColor, borderBottomRightRadius: 20, borderBottomLeftRadius: 20, flexDirection: 'row', alignItems: "center" }}>
                        <TouchableOpacity style={{ flex: 0.2, alignItems: "center", justifyContent: 'center' }}
                            onPress={() => { this.props.navigation.goBack() }}
                        >
                            <Ionicons name="chevron-back-circle" size={30} color="#fff" />
                        </TouchableOpacity>
                        <View style={{ flex: 0.6, alignItems: "center", justifyContent: "center" }}>
                            <Text style={[styles.text, { color: "#fff", fontSize: 24, fontWeight: 'bold' }]}>Create Orders</Text>
                        </View>
                        <View style={{ flex: 0.2 }}>
                            <Text style={[styles.text, { color: "#fff", fontSize: 24, fontWeight: 'bold' }]}></Text>
                        </View>
                    </View>

                    {/* Forms */}
                  <ScrollView>
                   
                  <View style={{marginHorizontal:20,marginVertical:10}}>
                      <View style={{}}>
                        <Text style={[styles.text,{color:"#000"}]}>Contact No</Text>
                      </View>
             
                      <TextInput 
                        keyboardType={"numeric"}
                        value={this.state.contactNo}
                        onChangeText={(contactNo) => { this.setState({ contactNo})}}
                        style={{height:height*0.05,width:width*0.9,backgroundColor:"#eee",borderRadius:10,paddingLeft:10,marginTop:5}}
                        selectionColor={themeColor}
                      />
                      
                      
                  </View>
                <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
                    <View style={{ }}>
                        <Text style={[styles.text, { color: "#000" }]}>Contact Name</Text>
                    </View>

                    <TextInput
                        value={this.state.contactName}
                        onChangeText={(contactName) => { this.setState({ contactName }) }}
                        style={{ height: height * 0.05, width: width * 0.9, backgroundColor: "#eee", borderRadius: 10, paddingLeft: 10,marginTop:5 }}
                        selectionColor={themeColor}
                    />


                </View>
                <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
                    <View style={{}}>
                        <Text style={[styles.text, { color: "#000" }]}>Amount</Text>
                    </View>

                    <TextInput
                        keyboardType={"numeric"}
                        value={this.state.Amount}
                        onChangeText={(Amount) => { this.setState({ Amount }) }}
                        style={{ height: height * 0.05, width: width * 0.9, backgroundColor: "#eee", borderRadius: 10, paddingLeft: 10, marginTop: 5 }}
                        selectionColor={themeColor}
                    />


                </View>
                <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
                    <View style={{}}>
                        <Text style={[styles.text, { color: "#000" }]}>Status</Text>
                    </View>
                    <DropDownPicker
                        items={types}
                        defaultValue={this.state.selectedStatus}
                        containerStyle={{ height: 40, width: width * 0.9 }}
                        style={{ backgroundColor: '#eee' ,marginTop:5}}
                        itemStyle={{
                            justifyContent: 'flex-start'
                        }}
                        dropDownStyle={{ backgroundColor: '#eee', width: width * 0.9 }}

                        onChangeItem={(item) => {
                            this.setState({ selectedStatus: item.value })
                        }}
                    />
                </View>
                <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
                    <View style={{}}>
                        <Text style={[styles.text, { color: "#000" }]}>Order Details</Text>
                    </View>

                    <TextInput
                        value={this.state.orderDetails}
                        onChangeText={(orderDetails) => { this.setState({ orderDetails }) }}
                        style={{ height: height * 0.15, width: width * 0.9, backgroundColor: "#eee", borderRadius: 10, paddingLeft: 10, marginTop: 5 ,textAlignVertical:"top"}}
                        selectionColor={themeColor}
                    />


                </View>
                    <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
                        <View style={{}}>
                            <Text style={[styles.text, { color: "#000" }]}>Expected Arriving</Text>
                        </View>

                        <View
                            style={{
                                 height: height * 0.05, 
                                 width: width * 0.9,
                                 backgroundColor: "#eee", 
                                 borderRadius: 10, 
                                 flexDirection:"row",
                                 marginTop: 5, 
                                 alignItems:"center",
                                 justifyContent:"space-between",
                                 paddingHorizontal:20
                                }}
                        
                        > 
                          <View>
                              <Text style={[styles.text]}>{this.state.today}</Text>
                          </View>
                          <TouchableOpacity 
                           onPress ={()=>{this.setState({show:true})}}
                          >
                                <MaterialIcons name="date-range" size={24} color="black" />
                          </TouchableOpacity>
                        </View>


                    </View>
                    <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
                        <View style={{}}>
                            <Text style={[styles.text, { color: "#000" }]}>Discount</Text>
                        </View>

                        <TextInput
                            keyboardType={"numeric"}
                            value={this.state.Discount}
                            onChangeText={(Discount) => { this.setState({ Discount }) }}
                            style={{ height: height * 0.05, width: width * 0.9, backgroundColor: "#eee", borderRadius: 10, paddingLeft: 10, marginTop: 5 }}
                            selectionColor={themeColor}
                        />


                    </View>
                    <View style={{ marginHorizontal: 20, marginVertical: 10, alignItems: "center", justifyContent: "center" }}>
                        <TouchableOpacity style={{ height: height * 0.05, width: width * 0.4, alignItems: "center", justifyContent: "center", backgroundColor: themeColor, borderRadius: 5 }}
                            onPress={() => {this.setState({selectedItem:null},()=>{
                                this.setState({ showModal: true, })
                            })}}
                        >
                            <Text style={[styles.text, { color: "#fff" }]}>Add new</Text>
                        </TouchableOpacity>
                    </View>
                    {
                        this.state.medicines.map((item,index)=>{
                            return(
                                <View style={{height:height*0.25,width:width*0.9,borderRadius:5,backgroundColor:"#eee",alignSelf:"center",paddingTop:10}}>
                                   <View style={{flex:1,alignItems:"center",justifyContent:"space-around"}}>
                                       <View style={{flexDirection:"row",flex:1}}>
                                           <View style={{flex:0.3}}>
                                                <Text style={[styles.text,{marginLeft:10}]}>Name</Text>
                                           </View>
                                           <View style={{flex:0.7}}>
                                                <Text style={[styles.text]}>: {item.medicine.title}</Text>
                                           </View>
                                 
                                       </View>
                                        <View style={{ flexDirection: "row" ,flex:1}}>
                                            <View style={{ flex: 0.3 }}>
                                                <Text style={[styles.text,{marginLeft:10}]}>Type</Text>
                                            </View>
                                            <View style={{ flex: 0.7 }}>
                                                <Text style={[styles.text]}>: {item.medicine.type}</Text>
                                            </View>
                                         
                                        </View>
                                        <View style={{ flexDirection: "row", flex: 1}}>
                                            <View style={{ flex: 0.3 }}>
                                                <Text style={[styles.text,{marginLeft:10}]}>Total Boxes</Text>
                                            </View>
                                            <View style={{ flex: 0.7 }}>
                                                <Text style={[styles.text]}>: {item.required_boxes}</Text>
                                            </View>
                                         
                                          
                                        </View>
                                        <View style={{ flexDirection: "row", flex: 1 }}>
                                            <View style={{ flex: 0.3 }}>
                                                <Text style={[styles.text, { marginLeft: 10 }]}>Total Strips</Text>
                                            </View>
                                            <View style={{ flex: 0.7 }}>
                                                <Text style={[styles.text]}>: {item.required_strips}</Text>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: "row", flex: 1 }}>
                                            <View style={{ flex: 0.3 }}>
                                                <Text style={[styles.text,{marginLeft:10}]}>Total Pieces</Text>
                                            </View>
                                            <View style={{ flex: 0.7 }}>
                                                <Text style={[styles.text]}>: {item.required_pieces}</Text>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: "row", flex: 1   }}>
                                            <View style={{ flex: 0.3 }}>
                                                <Text style={[styles.text,{marginLeft:10}]}>Total Quantity</Text>
                                            </View>
                                            <View style={{ flex: 0.7 }}>
                                                <Text style={[styles.text]}>: {item.quantity}</Text>
                                            </View>
                                     
                                          
                                        </View>
                                        <TouchableOpacity style={{marginVertical:10,height:height*0.05,width:width*0.4,alignItems:"center",justifyContent:"center",borderRadius:5,backgroundColor:themeColor}}
                                         onPress ={()=>{
                                             this.setState({editing:true,editingindex:index},()=>{
                                                 this.setEdit(item)
                                             })
                                         }}
                                        >{
                                            this.state.editing&&this.state.editingindex==index?<ActivityIndicator color={"#fff"} size={"large"}/>:
                                                    <Text style={[styles.text, { color: "#fff" }]}>Edit</Text>
                                        }
                                           
                                        </TouchableOpacity>
                                   </View>
                                   <View style={{position:"absolute",top:10,right:10}}>
                                       <TouchableOpacity 
                                            onPress={() => { this.removeItem(index)}}
                                       
                                       >
                                            <Entypo name="circle-with-cross" size={24} color="black" />
                                        </TouchableOpacity> 
                                   </View>
                                </View>
                            )
                        })
                    }
                    {
                        this.state.medicines.length>0&&
                        <View style={{marginVertical:20,alignItems:"center"}}>
                            <TouchableOpacity 
                              onPress ={()=>{this.createOrder()}}
                             style={{height:height*0.05,width:width*0.4,alignItems:"center",justifyContent:"center",backgroundColor:themeColor,borderRadius:5}}
                            >
                               {!this.state.creating? <Text style={[styles.text,{color:"#fff"}]}>Create</Text>:
                               <ActivityIndicator size={"large"} color={"#fff"}/>
                               
                            }
                            </TouchableOpacity>
                        </View>
                    }
                    {
                        !this.state.minOrder && <View style={{ marginHorizontal: 20, marginVertical: 10, alignItems: "center", justifyContent: "center" }}>
                            <TouchableOpacity style={{ height: height * 0.05, width: width * 0.4, alignItems: "center", justifyContent: "center", backgroundColor: themeColor, borderRadius: 5 }}
                                onPress={() => {
                                   this.setState({minOrder:true},()=>{
                                         this.getMinOrder()
                                   })
                                }}
                            >
                                <Text style={[styles.text, { color: "#fff" }]}>Min Order</Text>
                            </TouchableOpacity>
                        </View>
                    }
                    <DateTimePickerModal
                        testID="2"
                        isVisible={this.state.show}
                        mode="date"
                        onConfirm={this.handleConfirm}
                        onCancel={this.hideDatePicker}
                    />
                </ScrollView>
             {
                 this.Modal()
             }
             {
                 this.loadModal()
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
export default connect(mapStateToProps, { selectTheme })(CreateOrders);