import React, { Component } from 'react';
import { View, Text, FlatList, ActivityIndicator, Dimensions, TextInput, StyleSheet, TouchableOpacity,Alert} from 'react-native';
import { EvilIcons, Ionicons, MaterialIcons} from '@expo/vector-icons';
import HttpsClient from '../api/HttpsClient';
import settings from '../AppSettings';
const url =settings.url
const inputColor = settings.TextInput
const themeColor = settings.themeColor
const fontFamily =settings.fontFamily
const {height,width} = Dimensions.get("window");
import axios from 'axios';
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";
export default class UniversalMedicines extends Component {
  constructor(props) {
    super(props);
    this.state = {
       medicines:[],
       offset:0,
       next:true,
       cancelToken: undefined,
       refreshing:false,
       first:true,
    };
  }
  getMedicines = async()=>{
   this.setState({first:false})
    const api = `${url}/api/prescription/medicines/?limit=10&offset=${this.state.offset}`
    const data = await HttpsClient.get(api)
    console.log(api)
    if(data.type=="success"){
      this.setState({ medicines: this.state.medicines.concat(data.data.results), refreshing: false})
      if(data.data.next == null){
        this.setState({next:false})
      }
    }else{
      this.setState({ refreshing: false})
    }
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
   componentDidMount(){
     this.getMedicines()
     this._unsubscribe = this.props.navigation.addListener('focus', () => {
       if(!this.state.first){

         this.setState({ offset: 0, next: true, medicines: [] }, () => {
           this.getMedicines()
         })
       }

     
    
     });
   }
  loadMore =()=>{
     if(this.state.next){
         this.setState({offset:this.state.offset+10},()=>{
               this.getMedicines()
         })
     }
  }
  searchMedicines = async(query)=>{
    if (typeof this.state.cancelToken != typeof undefined) {
      this.state.cancelToken.cancel('cancelling the previous request')
    }
    this.state.cancelToken = axios.CancelToken.source()
    let api = `${url}/api/prescription/medicines/?name=${query}`
    console.log(api, "ppp")
    const data = await axios.get(api, { cancelToken: this.state.cancelToken.token });
    this.setState({ medicines: data.data })
  }
  deleteItem = async(item,index)=>{
    const api = `${url}/api/prescription/medicines/${item.id}/`
    let del = await HttpsClient.delete(api)
    if(del.type =="success"){
        let duplicate =this.state.medicines
        duplicate.splice(index,1)
        this.setState({ medicines: duplicate})
        return this.showSimpleMessage("Deleted Succesfully","green","success")
        
    }
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
        { text: "Yes", onPress: () => { this.deleteItem(item,index) } }
      ]
    );

  }
  header =()=>{
    return(
      <View style={{}}> 
        <View style={{ height: 40, flexDirection: "row", alignItems: "center", justifyContent: "space-around", backgroundColor: inputColor,}}>
          <View style={{ alignItems: "center", justifyContent: "center",}}>
                  <EvilIcons name="search" size={24} color="black" />
               </View>
               <TextInput 
                style={{ height: 35, width: width * 0.8,}}
                selectionColor={themeColor}
                placeholder={"search"}
                onChangeText ={(text)=>{this.searchMedicines(text)}}
               />
          </View>
          <View style={{flexDirection:"row",marginTop:10,flex:1}}>
              <View style={{flex:0.1,alignItems:"center",justifyContent:"center"}}>
                  <Text style={[styles.text,{color:"#000",fontSize:height*0.022}]}>#</Text>
              </View>
             <View style={{ flex: 0.5, alignItems: "center", justifyContent: "center" }}>
                 <Text style={[styles.text, { color: "#000", fontSize: height * 0.022 }]}>Name</Text>
              </View>
          <View style={{ flex: 0.3, alignItems: "center", justifyContent: "center" }}>
                  <Text style={[styles.text, { color: "#000", fontSize: height * 0.022 }]}>Type</Text>
              </View>
          </View>
        <TouchableOpacity style={{ flex: 0.1, alignItems: "center", justifyContent: "center" }}
          
        >

        </TouchableOpacity>
      </View>
    )
  }
  renderFooter =()=>{
    if(this.state.next){
      return(
        <ActivityIndicator size={"large"} color={"#fff"}/>
      )
    }else{
      return null
    }
  }
  Refresh =()=>{
    this.setState({ offset: 0, next: true, medicines: [],refreshing: true}, () => {
      this.getMedicines()
    })
  }
  render() {
    return (
      <>
      <FlatList 
        onRefresh={() => { this.Refresh()}}
        refreshing={this.state.refreshing}
        contentContainerStyle={{paddingBottom:90}}
        ListHeaderComponent ={this.header()}
        onEndReached ={()=>{this.loadMore()}}
        onEndReachedThreshold={0.1}
        data ={this.state.medicines}
        keyExtractor ={(item,index)=>index.toString()}
        ListFooterComponent = {this.renderFooter()}
        renderItem ={({item,index})=>{
        
            return(
              <View style={{ flexDirection: "row", marginTop: 10, flex: 1 }}>
                <View style={{ flex: 0.1, alignItems: "center", justifyContent: "center" }}>
                  <Text style={[styles.text, { fontSize: height * 0.022 }]}>{index+1}</Text>
                </View>
                <View style={{ flex: 0.5, alignItems: "center", justifyContent: "center" }}>
                  <Text style={[styles.text, {fontSize: height * 0.022 }]}>{item.title}</Text>
                </View>
                <View style={{ flex: 0.3, alignItems: "center", justifyContent: "center" }}>
                  <Text style={[styles.text, {  fontSize: height * 0.022 }]}>{item.type}</Text>
                </View>
                <TouchableOpacity style={{ flex: 0.1, alignItems: "center", justifyContent: "center" }}
                  onPress={() => { this.createAlert(item, index) }}
                >
                  <MaterialIcons name="delete" size={24} color={themeColor} />
                </TouchableOpacity>
              </View>
            )
        }}
      />
        <TouchableOpacity style={{position:"absolute",bottom:30,left:width*0.45}}
          onPress={() => { this.props.navigation.navigate('AddMedicines')}}
        >
          <Ionicons name="add-circle-sharp" size={49} color={themeColor} />
        </TouchableOpacity>
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