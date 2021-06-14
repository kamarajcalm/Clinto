import React, { Component } from 'react';
import { View, Text, Dimensions, TouchableOpacity, StyleSheet, TextInput, FlatList, Image, SafeAreaView, Alert, ScrollView} from 'react-native';
import { Ionicons, Entypo, AntDesign, MaterialIcons} from '@expo/vector-icons';
import { connect } from 'react-redux';
import { selectTheme } from '../actions';
import settings from '../AppSettings';
import medicine from '../components/Medicine';
import Medicine from '../components/Medicine';
const { height, width } = Dimensions.get("window");
const fontFamily = settings.fontFamily;
const themeColor = settings.themeColor;
const url = settings.url;
const screenHeight = Dimensions.get("screen").height
import { ActivityIndicator, } from 'react-native-paper';
import HttpsClient from '../api/HttpsClient';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";
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

const initialLayout = { width: Dimensions.get('window').width };
class InventoryNew extends Component {
    constructor(props) {
        super(props);
        const routes = [
            { key: 'Items', title: 'Items' },
            { key: 'Orders', title: 'Orders' },
            { key: 'Sold', title: 'Sold' },

        ];
        this.state = {
            routes,
            index: 0,
            items:[],
            categoryName:'',
            creating:false,
            refreshing:false,
            orders:[],
            date: new Date(),
            show: false,
            today: null,
            orderDetails:"",
            Discount:"",
            Amount:"",
            selectedStatus:types[0].value,
            modal2:false,
            soldItems:[]
        };
    }
    deleteSold = async(item,index)=>{
        let api = `${url}/api/prescription/soldinventory/${item.id}/`
        let del = await HttpsClient.delete(api)
        if (del.type == "success") {
            this.showSimpleMessage("Deleted SuccessFully", "#00A300", "success")
            let duplicate =this.state.soldItems
            duplicate.splice(index,1)
            this.setState({ soldItems:duplicate})
        } else {
            this.showSimpleMessage("Try again", "#B22222", "danger")
        }
    }
    createAlertSold =(item,index)=>{
        Alert.alert(
            "Do you want to delete?",
            `${item.contact_details}`,
            [
                {
                    text: "No",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "Yes", onPress: () => { this.deleteSold(item,index)} }
            ]
        );
    }
    createAlert = (item,index) => {
        
        Alert.alert(
            "Do you want to delete?",
            `${item.title}`,
            [
                {
                    text: "No",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "Yes", onPress: () => { this.deleteCategory(item,index) } }
            ]
        );

    }
    validateColor = (status) => {
        if (status == "Pending") {
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
    getItems = async()=>{
        this.setState({ refreshing:true})
        let api = `${url}/api/prescription/inventorycategory/?inventory=${this.props.medical.inventory}`

      let data =await HttpsClient.get(api)
      if(data.type =="success"){
          this.setState({ refreshing: false })
          this.setState({items:data.data})
      }else{
          this.setState({ refreshing: false })
      }
    }
    getOrders =async()=>{
        let api = `${url}/api/prescription/inventoryorders/?inventory=${this.props.medical.inventory}`
        let data =await HttpsClient.get(api)
        console.log(api)
        if(data.type =="success"){
              this.setState({orders:data.data})
        }
    }
    createOrders =async()=>{
        this.setState({ creating: true })
        if (this.state.orderDetails == "") {
            this.setState({ creating: false })
            return this.showSimpleMessage("Please add order Details", "#dd7030",)
        }
        if (this.state.today ==null) {
            this.setState({ creating: false })
            return this.showSimpleMessage("Please add expected Arriving", "#dd7030",)
        }
        if (this.state.Amount == "") {
            this.setState({ creating: false })
            return this.showSimpleMessage("Please add amount", "#dd7030",)
        }
        let api = `${url}/api/prescription/createOrders/`
        let sendData ={
            status:this.state.selectedStatus,
            order_details:this.state.orderDetails,
            expected_arriving:this.state.today,
            discount:this.state.Discount,
            amount:this.state.Amount,
            clinic:this.props.medical.clinicpk
        }
        let post = await HttpsClient.post(api,sendData)
        if (post.type == "success") {
            this.setState({ modal: false, orderDetails: "", Discount: "", Amount:""})
            this.setState({ creating: false })
            this.showSimpleMessage("created SuccessFully", "#00A300", "success")
            this.getOrders()
        } else {
            this.setState({ creating: false })
            this.showSimpleMessage("Try again", "#B22222", "danger")
        }
    }
    addCategory = async()=>{
        if(this.state.categoryName ==""){
         return this.showSimpleMessage("Please fill category", "#dd7030",)
        }
        this.setState({creating:true})
        let api = `${url}/api/prescription/createCategory/`
        let sendData ={
           title:this.state.categoryName,
            clinic: this.props.medical.clinicpk
        }
        let post = await HttpsClient.post(api,sendData)
        console.log(post,"ppp")
        if(post.type =="success"){
            this.setState({ creating: false })
            this.setState({ categoryName:""})
            this.getItems()
            this.showSimpleMessage("Added SuccessFully", "#00A300", "success")
        }else{
            this.setState({ creating: false })
            this.showSimpleMessage("Try again", "#B22222", "danger")
        }
    }
    deleteCategory = async(item,index)=>{
        let api = `${url}/api/prescription/inventorycategory/${item.id}/`
        let del =await HttpsClient.delete(api)
         if(del.type =="success"){
             this.showSimpleMessage("Deleted SuccessFully", "#00A300", "success")
             let duplicate = this.state.items
             duplicate.splice(index,1)
             this.setState({ items: duplicate})
         }else{
             this.showSimpleMessage("Try again", "#B22222", "danger")
         }
    }
    getSold =async()=>{
        let api = `${url}/api/prescription/soldinventory/?inventory=${this.props.medical.inventory}`
        const data = await HttpsClient.get(api)
        console.log(api)
        if(data.type=="success"){
              this.setState({soldItems:data.data})
        }
    }
    componentDidMount() {
     this.getItems()  
     this.getOrders()
     this.getSold()
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.getItems()
            this.getOrders()
            this.getSold()
        });
    }
    componentWillUnmount(){
        this._unsubscribe()
    }
    header =()=>{
        return(
            <View style={{flexDirection:'row',}}>
                  <View style={{flex:0.2,alignItems:'center',justifyContent:'center'}}>
                      <Text style={[styles.text,{color:"#000"}]}>#</Text>
                  </View>
                <View style={{ flex: 0.4, alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={[styles.text, { color: "#000" }]}>Category</Text>
                  </View>
                <View style={{ flex: 0.2, alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={[styles.text, { color: "#000" }]}>Action</Text>
                  </View>
                <View style={{ flex: 0.2, alignItems: 'center', justifyContent: 'center'}}>

                  </View>
            </View>
        )
    }
    FirstRoute =()=>{
        return(
            <View style={{flex:1}}>
               <View style={{height:height*0.08,flexDirection:'row',backgroundColor:"#fff",alignItems:"center",justifyContent:"space-around"}}>
                    <View>
                       <TextInput 
                         value={this.state.categoryName}
                         style={{height:height*0.05,width:width*0.6,backgroundColor:"#fafafa",borderRadius:10}}
                         placeholder ={"Enter category"}
                         selectionColor ={themeColor}
                            onChangeText={(categoryName) => { this.setState({ categoryName})}}
                       />
                    </View>
                    <View>
                       <TouchableOpacity style={{height:height*0.05,width:width*0.3,alignItems:"center",justifyContent:"center",backgroundColor:themeColor,borderRadius:10}}
                        onPress ={()=>{this.addCategory()}}
                       >
                            {this.state.creating?<ActivityIndicator size ={"small"} color={"#fff"}/>: <Text style={[styles.text,{color:"#fff"}]}>Add</Text>}
                       </TouchableOpacity>
                    </View>
               </View>
               <FlatList 
                 refreshing={this.state.refreshing}
                 onRefresh ={()=>{this.getItems()}}
                 data ={this.state.items}
                 keyExtractor ={(item,index)=>index.toString()}
                 ListHeaderComponent={this.header()}
                 renderItem ={({item,index})=>{
                    return(
                        <View style={{ flexDirection: 'row',marginTop:15 }}>
                            <View style={{ flex: 0.2, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={[styles.text, {  }]}>{index+1}</Text>
                            </View>
                            <View style={{ flex: 0.4, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={[styles.text, { }]}>{item.title}</Text>
                            </View>
                            <TouchableOpacity style={{ flex: 0.2, alignItems: 'center', justifyContent: 'center' }}
                                onPress={() => { this.props.navigation.navigate('ViewCategory',{item})}}
                            >
                                <Text style={[styles.text, {  textDecorationLine:"underline"}]}>View</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ flex: 0.2, alignItems: 'center', justifyContent: 'center' }}
                             onPress ={()=>{this.createAlert(item,index)}}
                            >
                                <Entypo name="cross" size={20} color="red" />
                            </TouchableOpacity>
                        </View>
                    )
                 }}
               />
            </View>
        )
    }
                    //    orders
    orderHeaders =()=>{
        return(
            <View style={{flexDirection:"row",marginTop:10}}>
                <View style={{ width:width*0.1,alignItems:'center',justifyContent:"center"}}>
                  <Text style={[styles.text,{color:"#000"}]}>#</Text>
                </View>
                <View style={{ width: width * 0.3, alignItems: 'center', justifyContent: "center" }}>
                    <Text style={[styles.text, { color: "#000" }]}>Arriving Date</Text>
                </View>
                <View style={{ width: width * 0.35, alignItems: 'center', justifyContent: "center" }}>
                    <Text style={[styles.text, { color: "#000" }]}>Distributor Name</Text>
                </View>
                <View style={{ width: width * 0.3, alignItems: 'center', justifyContent: "center" }}>
                    <Text style={[styles.text, { color: "#000" }]}>Mobile No</Text>
                </View>
                <View style={{ width: width * 0.2, alignItems: 'center', justifyContent: "center" }}>
                    <Text style={[styles.text, { color: "#000" }]}>Discount</Text>
                </View>
                <View style={{ width: width * 0.2, alignItems: 'center', justifyContent: "center" }}>
                    <Text style={[styles.text, { color: "#000" }]}>Status</Text>
                </View>
                <View style={{ width: width * 0.1, alignItems: 'center', justifyContent: "center" }}>
                 
                </View>
            </View>
        )
    }
    modal2 =()=>{
        return(
            <Modal
                deviceHeight={screenHeight}
                isVisible={this.state.modal2}
                onBackdropPress={() => { this.setState({ modal2: false }) }}
            >
                <View style={{ flex: 1, justifyContent: "center" }}>
             
                    <View style={{ height: height * 0.6, backgroundColor: "#eee", borderRadius: 10, }}>
                        <View>
                            <Text>sff</Text>
                        </View>
                    </View>

                </View>
                </Modal>
        )
    }
    // modal = () => {
        
    //     return (
    //         <Modal
    //             deviceHeight={screenHeight}
    //             isVisible={this.state.modal}
    //             onBackdropPress={() => { this.setState({ modal: false }) }}
    //         >
    //             <View style={{ flex: 1, justifyContent: "center" }}>
    //                 <View style={{ height: height * 0.6, backgroundColor: "#eee", borderRadius: 10, }}>
    //                     <View style={{ marginHorizontal: 20, marginTop: 10 }}>
    //                         <Text style={[styles.text, { color: '#000' }]}>Select status</Text>
    //                         <View style={{ marginTop: 10 }}>
    //                             <DropDownPicker
    //                                 items={types}
    //                                 defaultValue={types[0].value}
    //                                 containerStyle={{ height: 40, width: width * 0.4 }}
    //                                 style={{ backgroundColor: '#fafafa' }}
    //                                 itemStyle={{
    //                                     justifyContent: 'flex-start'
    //                                 }}
    //                                 dropDownStyle={{ backgroundColor: '#fafafa', width: width * 0.4 }}

    //                                 onChangeItem={(item) => {
    //                                     this.setState({ selectedStatus: item.value })
    //                                 }}
    //                             />
    //                         </View>
    //                         <View style={{ marginTop:10 }}>
    //                             <Text style={[styles.text, { color: '#000' }]}>order Details</Text>
    //                             <TextInput
                                   
    //                                 multiline={true}
    //                                 style={{ width: width * 0.8, height: height * 0.07, backgroundColor: "#fff", borderRadius: 5, marginTop: 10, textAlignVertical: "top" }}
    //                                 selectionColor={themeColor}
    //                                 value={this.state.orderDetails}
    //                                 onChangeText={(orderDetails) => { this.setState({ orderDetails }) }}
    //                             />
    //                         </View>
    //                         <View style={{ marginTop: 10,}}>
    //                             <Text style={[styles.text, { color: "#000" }]}>Expected Arriving</Text>
    //                             <View style={{ flexDirection: "row", marginTop: 10 }}>
    //                                 <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center' }}
    //                                     onPress={() => { this.setState({ show: true }) }}
    //                                 >
    //                                     <MaterialIcons name="date-range" size={24} color="black" />
    //                                 </TouchableOpacity>
    //                                 <View style={{ alignItems: 'center', justifyContent: "center", marginLeft: 10 }}>
    //                                     <Text style={[styles.text]}>{this.state.today}</Text>
    //                                 </View>
    //                             </View>
    //                         </View>
    //                         <View style={{ marginTop: 10 }}>
    //                             <Text style={[styles.text, { color: '#000' }]}>Discount</Text>
    //                             <TextInput
    //                                 keyboardType={"numeric"}
    //                                 style={{ width: width * 0.8, height: height * 0.05, backgroundColor: "#fff", borderRadius: 5, marginTop: 10 }}
    //                                 selectionColor={themeColor}
    //                                 value={this.state.Discount}
    //                                 onChangeText={(Discount) => { this.setState({ Discount }) }}
    //                             />
    //                         </View>
    //                         <View style={{ marginTop: 10 }}>
    //                             <Text style={[styles.text, { color: '#000' }]}>Amount</Text>
    //                             <TextInput
    //                                 keyboardType={"numeric"}
    //                                 style={{ width: width * 0.8, height: height * 0.05, backgroundColor: "#fff", borderRadius: 5, marginTop: 10 }}
    //                                 selectionColor={themeColor}
    //                                 value={this.state.Amount}
    //                                 onChangeText={(Amount) => { this.setState({ Amount }) }}
    //                             />
    //                         </View>
    //                         <View style={{ alignItems: "center", justifyContent: "center" }}>
    //                             <TouchableOpacity style={{ backgroundColor: themeColor, height: height * 0.05, width: width * 0.4, alignItems: 'center', justifyContent: 'center', marginTop: 25, borderRadius: 5 }}
    //                                 onPress={() => { this.createOrders() }}
    //                             >
    //                                 {!this.state.creating ? <Text style={[styles.text, { color: '#fff' }]}>Add</Text> :
    //                                     <ActivityIndicator size={"small"} color={"#fff"} />
    //                                 }
    //                             </TouchableOpacity>
    //                         </View>
    //                     </View>
    //                 </View>

    //             </View>
    //         </Modal>
    //     )
    // }
    deleteOrders = async(item)=>{
        let api = `${url}/api/prescription/inventoryorders/${item.id}/`
        let del = await HttpsClient.delete(api)
        if (del.type == "success") {
            this.showSimpleMessage("Deleted SuccessFully", "#00A300", "success")
            this.getOrders()
        } else {
            this.showSimpleMessage("Try again", "#B22222", "danger")
        }
    }
    AlertForOrderDelete =(item)=>{
        Alert.alert(
            "Do you want to delete?",
            `${item?.order_details}`,
            [
                {
                    text: "No",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "Yes", onPress: () => { this.deleteOrders(item) } }
            ]
        );
    }
    SecondRoute =()=>{
        return (
            <View style={{flex:1}}>
                <ScrollView
                 horizontal={true}
                 showsHorizontalScrollIndicator={false}
                >
               
               <FlatList 
                 ListHeaderComponent ={this.orderHeaders()}
                 data ={this.state.orders}
                 keyExtractor ={(item,index)=>index.toString()}
                 renderItem = {({item,index})=>{
                   return(
                       <TouchableOpacity style={{ flexDirection: "row", flex: 1, marginTop: 10,backgroundColor:"#eee" ,paddingVertical:20}}
                         onPress ={()=>{this.props.navigation.navigate('ViewOrders',{item})}}
                       >
                           <View style={{ width: width * 0.1, alignItems: 'center', justifyContent: "center" }}>
                               <Text style={[styles.text, { color: "#000" }]}>{index+1}</Text>
                           </View>
                           <View style={{ width: width * 0.3, alignItems: 'center', justifyContent: "center" }}>
                               <Text style={[styles.text, { color: "#000" }]}>{item.expected_arriving}</Text>
                           </View>
                           <View style={{ width: width * 0.35, alignItems: 'center', justifyContent: "center" }}>
                               <Text style={[styles.text, { color: "#000" }]}>{item.from_contact}</Text>
                           </View>
                           <View style={{ width: width * 0.3, alignItems: 'center', justifyContent: "center" }}>
                               <Text style={[styles.text, { color: "#000" }]}>{item.from_contactNo}</Text>
                           </View>
                           <View style={{ width: width * 0.2, alignItems: 'center', justifyContent: "center" }}>
                               <Text style={[styles.text, { color: "#000" }]}>{item.discount}</Text>
                           </View>
                           <View style={{ width: width * 0.2, alignItems: 'center', justifyContent: "center" }}>
                               <Text style={[styles.text, { color: this.validateColor(item.status) }]}>{item.status}</Text>
                           </View>
                           <TouchableOpacity style={{ width: width * 0.1, alignItems: 'center', justifyContent: "center" }}
                               onPress={() => { this.AlertForOrderDelete(item) }}
                           >
                               <Entypo name="cross" size={20} color="red" />
                           </TouchableOpacity>
                           
                       </TouchableOpacity>
                   )
                 }}
               />

                </ScrollView>
                <View style={{
                    position: "absolute",
                    bottom: 50,
                    left: 20,
                    right: 20,
                    flex: 1,
                    flexDirection:"row",
                    alignItems: "center",
                    justifyContent:"space-around",
                    borderRadius: 20
                }}>
                    <TouchableOpacity
                        style={{ backgroundColor: themeColor, width: width * 0.4, alignItems: "center", justifyContent: "center", borderRadius: 5, height: height * 0.05 }}
                        onPress={() => { this.props.navigation.navigate('CreateBill') }}
                    >
                        <Text style={[styles.text, { color: "#fff" }]}>Create Bill</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{backgroundColor:themeColor,width:width*0.4,alignItems:"center",justifyContent:"center",borderRadius:5,height:height*0.05}}
                        onPress={() => { this.props.navigation.navigate('CreateOrders') }}
                    >
                      <Text style={[styles.text,{color:"#fff"}]}>Create orders</Text>
                    </TouchableOpacity>
                </View>
              
            </View>
        )
    }
    renderHeader3 =()=>{
        return(
            <View 
             style={{flexDirection:"row",marginTop:10,paddingVertical:15}}
              
            >
            <View 
             style={{width:width*0.1,alignItems:"center",justifyContent:"center"}}
            >
               <Text style={[styles.text,{color:"#000"}]}>#</Text>
            </View>
                <View
                    style={{ width: width * 0.3, alignItems: "center", justifyContent: "center" }}
                >
                    <Text style={[styles.text, { color: "#000" }]}>Name</Text>
                </View>
                <View
                    style={{ width: width * 0.3, alignItems: "center", justifyContent: "center" }}
                >
                    <Text style={[styles.text, { color: "#000" }]}>Mobile</Text>
                </View>
                <View
                    style={{ width: width * 0.2, alignItems: "center", justifyContent: "center" }}
                >
                    <Text style={[styles.text, { color: "#000" }]}>Date</Text>
                </View>
                <View
                    style={{ width: width * 0.2, alignItems: "center", justifyContent: "center" }}
                >
                    <Text style={[styles.text, { color: "#000" }]}>Amount</Text>
                </View>
                <View
                    style={{ width: width * 0.2, alignItems: "center", justifyContent: "center" }}
                >
                    <Text style={[styles.text, { color: "#000" }]}>Discount</Text>
                </View>
                <View
                    style={{ width: width * 0.2, alignItems: "center", justifyContent: "center" }}
                >
                    <Text style={[styles.text, { color: "#000" }]}>Item Count</Text>
                </View>
                <View
                    style={{ width: width * 0.2, alignItems: "center", justifyContent: "center" }}
                >
                    <Text style={[styles.text, { color: "#000" }]}>Action</Text>
                </View>
            </View>
        )
    }
    ThirdRoute =()=>{
        return (
            <View style={{flex:1}}>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
              >
                   <FlatList 
                     data ={this.state.soldItems}
                     keyExtractor={(item,index)=>index.toString()}
                     ListHeaderComponent ={this.renderHeader3()}
                     renderItem ={({item,index})=>{
                         return(
                             <TouchableOpacity
                                 style={{ flexDirection: "row", marginTop: 0.4 ,backgroundColor:"#eee",paddingVertical:10}}
                                 onPress ={()=>{this.props.navigation.navigate("ViewSold",{item})}}
                             >
                                 <View
                                     style={{ width: width * 0.1, alignItems: "center", justifyContent: "center" }}
                                 >
                                     <Text style={[styles.text, {color:"#000"  }]}>{index+1}</Text>
                                 </View>
                                 <View
                                     style={{ width: width * 0.3, alignItems: "center", justifyContent: "center" }}
                                 >
                                     <Text style={[styles.text, {color:"#000"}]}>{item.contact_details}</Text>
                                 </View>
                                 <View
                                     style={{ width: width * 0.3, alignItems: "center", justifyContent: "center" }}
                                 >
                                     <Text style={[styles.text, {color:"#000"}]}>{item.contact_no}</Text>
                                 </View>
                                 <View
                                     style={{ width: width * 0.2, alignItems: "center", justifyContent: "center" }}
                                 >
                                     <Text style={[styles.text, {color:"#000"}]}>{moment(item.created).format('DD-MM-YYYY')}</Text>
                                 </View>
                                 <View
                                     style={{ width: width * 0.2, alignItems: "center", justifyContent: "center" }}
                                 >
                                     <Text style={[styles.text, { color:"#000" }]}>{item.total}</Text>
                                 </View>
                                 <View
                                     style={{ width: width * 0.2, alignItems: "center", justifyContent: "center" }}
                                 >
                                     <Text style={[styles.text, { color:"#000" }]}>{item.discount}</Text>
                                 </View>
                                 <View
                                     style={{ width: width * 0.2, alignItems: "center", justifyContent: "center" }}
                                 >
                                     <Text style={[styles.text, { color:"#000" }]}>{item.items.length}</Text>
                                 </View>
                                 <View
                                     style={{ width: width * 0.2, alignItems: "center", justifyContent: "center" }}
                                 >
                                     <TouchableOpacity 
                                      onPress ={()=>{this.createAlertSold(item,index)}}
                                     >
                                         <Entypo name="circle-with-cross" size={24} color="red" />
                                     </TouchableOpacity>
                                
                                 </View>
                             </TouchableOpacity>
                         )
                     }}
                   />

              </ScrollView>
            </View>
        )
    }
    indexChange = async (index) => {
   
        this.setState({ index })

    }
    renderScene = SceneMap({
        Items: this.FirstRoute,
        Orders: this.SecondRoute,
        Sold: this.ThirdRoute,
    });
    render() {
        const { index, routes } = this.state
        return (
            <>
                <SafeAreaView style={styles.topSafeArea} />
                <SafeAreaView style={styles.bottomSafeArea}>

                    {/* HEADERS */}
                  
                    <TabView
                        style={{ backgroundColor: "#ffffff" }}
                        navigationState={{ index, routes }}
                        renderScene={this.renderScene}
                        onIndexChange={(index) => { this.indexChange(index) }}
                        initialLayout={initialLayout}
                        renderTabBar={(props) =>
                            <TabBar
                                {...props}
                                renderLabel={({ route, focused, color }) => (
                                    <Text style={{ color: focused ? themeColor : 'gray', margin: 8, fontWeight: "bold" }}>
                                        {route.title}
                                    </Text>
                                )}
                                style={{ backgroundColor: "#fff", height: 50, fontWeight: "bold", color: "red" }}
                                labelStyle={{ fontWeight: "bold", color: "red" }}
                                indicatorStyle={{ backgroundColor: themeColor, height: 5 }}
                            />
                        }

                    />
                    {/* {
                        this.modal()
                    } */}
                    {
                        this.modal2()
                    }
                    <DateTimePickerModal
                        testID="2"
                        isVisible={this.state.show}
                        mode="date"
                        onConfirm={this.handleConfirm}
                        onCancel={this.hideDatePicker}
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
    card: {
        backgroundColor: "#fff",
        elevation: 6,
        margin: 20,
        height: height * 0.3
    },
    button: {
        height: height * 0.05,
        width: width * 0.4,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: themeColor,
        borderRadius: 10,
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
export default connect(mapStateToProps, { selectTheme })(InventoryNew);