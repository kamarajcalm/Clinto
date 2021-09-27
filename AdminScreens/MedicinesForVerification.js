import React, { Component } from 'react';
import { View, Text, FlatList, ActivityIndicator, Dimensions, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { EvilIcons, Ionicons, MaterialIcons ,FontAwesome5} from '@expo/vector-icons';
import HttpsClient from '../api/HttpsClient';
import settings from '../AppSettings';
const url = settings.url
const inputColor = settings.TextInput
const themeColor = settings.themeColor
const fontFamily = settings.fontFamily
const { height, width } = Dimensions.get("window");
import axios from 'axios';
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";
import Modal from 'react-native-modal';
const screenHeight = Dimensions.get("screen").height
let types = [
    {
        label: "Tablet", value: 'Tablet'
    },
    {
        label: "Drops", value: 'Drops'
    },
    {
        label: "Others", value: 'Others'
    },
    {
        label: "Capsules", value: 'Capsules'
    },
    {
        label: "Liquid", value: 'Liquid'
    },

    {
        label: "Cream", value: 'Cream'
    },
    {
        label: "Injections", value: 'Injections'
    },
]
export default class MedicinesForVerification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      medicines: [],
      offset: 0,
      next: true,
      cancelToken: undefined,
      refreshing: false,
      verifyModal:false,
      selectedItem:null,
      changeTypeModal:false
    };
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
  getMedicines = async () => {

    const api = `${url}/api/prescription/medicines/?unverified=true&limit=10&offset=${this.state.offset}`
    const data = await HttpsClient.get(api)
    console.log(api)
    if (data.type == "success") {
      this.setState({ medicines: this.state.medicines.concat(data.data.results), refreshing: false })
      if (data.data.next == null) {
        this.setState({ next: false })
      }
    } else {
      this.setState({ refreshing: false })
    }
  }
  componentDidMount() {
    this.getMedicines()
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.setState({ offset: 0, next: true, medicines: [] }, () => {
        this.getMedicines()
      })

    });
  }
  loadMore = () => {
    if (this.state.next) {
      this.setState({ offset: this.state.offset + 10 }, () => {
        this.getMedicines()
      })
    }
  }
  verifyItem = async(item,index)=>{
    const api = `${url}/api/prescription/medicines/${this.state.selectedItem.id}/?unverified=true`
    let sendData ={
      is_verified:true,
      title:this.state.selectedItem.title,
      marketprice:this.state.selectedItem.marketprice,
      maxretailprice:this.state.selectedItem.maxretailprice
    }
    let del = await HttpsClient.patch(api,sendData)
    if (del.type == "success") {
      let duplicate = this.state.medicines
      duplicate.splice(index, 1)
      this.setState({ medicines: duplicate })
      return this.showSimpleMessage("Verified Succesfully", "green", "success")

    }else{
         return this.showSimpleMessage("Something went wrong", "red", "danger")
    }
  }
  createAlert = (item, index) => {
    Alert.alert(
      "Do you want to verify?",
      `${item.title}`,
      [
        {
          text: "No",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Yes", onPress: () => { this.verifyItem(item, index) } }
      ]
    );

  }
  header = () => {
    return (
      <View style={{}}>
       
        <View style={{ flexDirection: "row", marginTop: 10, flex: 1 }}>
          <View style={{ flex: 0.2, alignItems: "center", justifyContent: "center" }}>
            <Text style={[styles.text, { color: "#000", fontSize: height * 0.022 }]}>#</Text>
          </View>
          <View style={{ flex: 0.6, alignItems: "center", justifyContent: "center" }}>
            <Text style={[styles.text, { color: "#000", fontSize: height * 0.022 }]}>Name</Text>
          </View>
          <View style={{ flex: 0.2, alignItems: "center", justifyContent: "center" }}>
            <Text style={[styles.text, { color: "#000", fontSize: height * 0.022 }]}>Verify</Text>
          </View>
        </View>
     
      </View>
    )
  }
  renderFooter = () => {
    if (this.state.next) {
      return (
        <ActivityIndicator size={"large"} color={"#fff"} />
      )
    } else {
      return null
    }
  }
  Refresh = () => {
    this.setState({ offset: 0, next: true, medicines: [], refreshing: true }, () => {
      this.getMedicines()
    })
  }
setTitle = (title)=>{
   let duplicate = this.state.selectedItem
   duplicate.title = title
   this.setState({selectedItem:duplicate})
}
setMarketPrice =(price)=>{
     let duplicate = this.state.selectedItem
   duplicate.marketprice = price
   this.setState({selectedItem:duplicate})
}
setMaxRetailPrice =(price)=>{
     let duplicate = this.state.selectedItem
      duplicate.maxretailprice = price
      this.setState({selectedItem:duplicate})
}
changeType =(item)=>{
  let duplicate = this.state.selectedItem
      duplicate.type = item.value
      this.setState({selectedItem:duplicate})
}
changeMedicineType =()=>{
  return(
    <Modal 
       isVisible={this.state.changeTypeModal}
       deviceHeight={screenHeight}
        onBackdropPress={()=>{
         this.setState({changeTypeModal:false})
       }}
       statusBarTranslucent={true}
      >
                    <View style={{flex:1,alignItems:"center",justifyContent:"center"}}>
                        <View style={{height:height*0.4,width:width*0.8,backgroundColor:"#fff",borderRadius:10}}>
                             <View style={{marginVertical:10,alignItems:"center",justifyContent:"center"}}>
                                 <Text style={[styles.text]}>Select Type</Text>
                             </View>
                              {
                                  types.map((item,index)=>{
                          
                                    return(
                                            <TouchableOpacity key={index} style={{flexDirection:"row",marginTop:10}}
                                             onPress={()=>{
                                                this.setState({changeTypeModal:false},()=>{
                                                    this.changeType(item)
                                                    setTimeout(()=>{
                                                       this.setState({verifyModal:true})
                                                    },500)
                                                }) 
                                               }}
                                            
                                            >
                                                <View style={{flex:0.7,alignItems:"center",justifyContent:"center"}}>
                                                    <Text style={[styles.text,{color:"#000",fontSize:height*0.02}]}>{item.label}</Text>
                                                </View>
                                                <View style={{flex:0.3,alignItems:"center",justifyContent:"center"}}>
                                                    <FontAwesome5 name="dot-circle" size={24} color={this.state.selectedDiagnosis===item.value?"#63BCD2":"gray"}/>
                                                </View>
                                            </TouchableOpacity>
                                        )
                                
                           })
                        }
                        </View>
                       
                </View>
      </Modal>
  )
}
  verifyModal =()=>{
    return(
      <Modal 
        statusBarTranslucent={true}
       isVisible={this.state.verifyModal}
       onBackdropPress={()=>{
         this.setState({verifyModal:false})
       }}
       deviceHeight={screenHeight}
      >
       <View style={{flex:1,alignItems:"center",justifyContent:"center"}}>
            <View style={{height:height*0.5,backgroundColor:"#fff",borderRadius:10,width:width*0.9,}}>
                 <View style={{alignItems:"center",justifyContent:"center",marginVertical:20}}>
                      <Text style={[styles.text,{color:"#000",fontSize:height*0.02}]}>Verfiy Medicine</Text>
                 </View>
                 <View style={{paddingHorizontal:20,flexDirection:"row"}}>
                   <View style={{flex:0.4}}>
                          <Text style={[styles.text]}>Medicine Name </Text>
                   </View>
                   <View style={{flex:0.1,alignItems:"center",justifyContent:"center"}}>
                               <Text style={[styles.text]}> : </Text>
                   </View>
                   <View style={{flex:0.5,}}>
                          <TextInput 
                            style={{height:35,width:"90%",backgroundColor:"#fafafa"}}
                            selectionColor={themeColor}
                            value={this.state?.selectedItem?.title}
                            onChangeText={(title)=>this.setTitle(title)}
                          />
                   </View>
                 </View>
                     <View style={{paddingHorizontal:20,flexDirection:"row",marginTop:20}}>
                   <View style={{flex:0.4}}>
                          <Text style={[styles.text]}>Medicine Type </Text>
                   </View>
                   <View style={{flex:0.1,alignItems:"center",justifyContent:"center"}}>
                               <Text style={[styles.text]}> : </Text>
                   </View>
                   <View style={{flex:0.5,}}>
                                <TouchableOpacity 
                                 onPress={()=>{
                                   this.setState({verifyModal:true},()=>{
                                      setTimeout(()=>{
                                          this.setState({changeTypeModal:true})
                                      },500)
                                   })
                                 }}
                                
                                >
                                              <Text style={[styles.text]}>{this.state?.selectedItem?.type}</Text>
                                </TouchableOpacity>
                         
                   </View>
                 </View>
                         <View style={{paddingHorizontal:20,flexDirection:"row",marginTop:20}}>
                   <View style={{flex:0.4}}>
                      <Text style={[styles.text]}>Market Price</Text>
                   </View>
                   <View style={{flex:0.1,alignItems:"center",justifyContent:"center"}}>
                               <Text style={[styles.text]}> : </Text>
                   </View>
                   <View style={{flex:0.5,}}>
                               <TextInput 
                           keyboardType={"numeric"}
                            style={{height:35,width:"90%",backgroundColor:"#fafafa"}}
                            selectionColor={themeColor}
                            value={this.state?.selectedItem?.marketprice?.toString()}
                            onChangeText={(price)=>this.setMarketPrice(price)}
                          />
                   </View>
                 </View>
                                <View style={{paddingHorizontal:20,flexDirection:"row",marginTop:20}}>
                   <View style={{flex:0.4}}>
                          <Text style={[styles.text]}>Max Retail Price </Text>
                   </View>
                   <View style={{flex:0.1,alignItems:"center",justifyContent:"center"}}>
                               <Text style={[styles.text]}> : </Text>
                   </View>
                   <View style={{flex:0.5,}}>
                                 <TextInput 
                           keyboardType={"numeric"}
                            style={{height:35,width:"90%",backgroundColor:"#fafafa"}}
                            selectionColor={themeColor}
                            value={this.state?.selectedItem?.maxretailprice?.toString()}
                            onChangeText={(price)=>this.setMaxRetailPrice(price)}
                          />       
                   </View>
                 </View>
                                            <View style={{paddingHorizontal:20,flexDirection:"row",marginTop:20}}>
                   <View style={{flex:0.4}}>
                          <Text style={[styles.text]}>Price Change </Text>
                   </View>
                   <View style={{flex:0.1,alignItems:"center",justifyContent:"center"}}>
                               <Text style={[styles.text]}> : </Text>
                   </View>
                   <View style={{flex:0.5,}}>
                               <Text style={[styles.text]}>{this.state?.selectedItem?.pricechange}</Text>
                   </View>
                 </View>
                 <View style={{marginTop:40,alignItems:"center",justifyContent:"center"}}>
                        <TouchableOpacity style={{height:height*0.05,width:width*0.4,alignItems:"center",justifyContent:"center",backgroundColor:"green"}}
                          onPress={()=>{
                            this.setState({verifyModal:false})
                            this.verifyItem()
                          }}
                        >
                             <Text style={[styles.text,{color:"#fff"}]}>Verify</Text>
                        </TouchableOpacity>
                 </View>
            </View>
       </View>
      </Modal>
    )
  }
  render() {
    return (
      <>
      <FlatList
        onRefresh={() => { this.Refresh() }}
        refreshing={this.state.refreshing}
        contentContainerStyle={{ paddingBottom: 90 }}
        ListHeaderComponent={this.header()}
        onEndReached={() => { this.loadMore() }}
        onEndReachedThreshold={0.1}
        data={this.state.medicines}
        keyExtractor={(item, index) => index.toString()}
        ListFooterComponent={this.renderFooter()}
        renderItem={({ item, index }) => {

          return (
            <View style={{ flexDirection: "row", marginTop: 10, flex: 1 }}>
              <View style={{ flex: 0.2, alignItems: "center", justifyContent: "center" }}>
                <Text style={[styles.text, { fontSize: height * 0.022 }]}>{index + 1}</Text>
              </View>
              <View style={{ flex: 0.6, alignItems: "center", justifyContent: "center" }}>
                <Text style={[styles.text, { fontSize: height * 0.022 }]}>{item.title}</Text>
              </View>
              <TouchableOpacity style={{ flex: 0.2, alignItems: "center", justifyContent: "center" }}
                onPress={()=>{
                   this.setState({selectedItem:item,verifyModal:true})
                }}
              >
                <Text style={[styles.text, { fontSize: height * 0.022 ,textDecorationLine:"underline"}]}>VERIFY</Text>
              </TouchableOpacity>
            
            </View>
          )
        }}
      />
      {
        this.verifyModal()
      }
      {
        this.changeMedicineType()
      }
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
  }

})