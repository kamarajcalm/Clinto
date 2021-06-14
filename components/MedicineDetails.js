import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, Switch, TextInput} from 'react-native';
import settings from '../AppSettings'
import { AntDesign, Entypo } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';
import Modal from "react-native-modal";

const { height, width } = Dimensions.get("window");
const fontFamily = settings.fontFamily;
const themeColor = settings.themeColor;
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
import DropDownPicker from 'react-native-dropdown-picker';
export default class MedicineDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
        afterFood:false,
        morning:false,
        night:false,
        afterNoon:false,
        morningCount:0,
        afterNoonCount:0,
        nightCount:0,
        days:"",
        qty:'',
        comment:"",
        selectedVariant:"",
        name:""
    };
  }
    toggleSwitch =()=>{
        this.setState({ afterFood:!this.state.afterFood},()=>{
            this.props.changeFunction("after_food",this.state.afterFood,this.props.index)
        })
    }
    changeDays =(text)=>{
        this.setState({days:text},()=>{
            this.props.changeFunction("days", this.state.days, this.props.index)
        })
    }
    changeQty = (text)=>{
        this.setState({ qty: text }, () => {
            this.props.changeFunction("total_qty", this.state.qty, this.props.index)
        })
    }
    changeComment = (comment) =>{
        this.setState({ comment: comment }, () => {
            this.props.changeFunction("comment", this.state.comment, this.props.index)
        })
    }
    changeVariant = (variant) => {
        
        this.props.changeFunction("variant", this.state.selectedVariant, this.props.index)
    
    }
    changeType =(item) =>{
        this.props.changeFunction("type", item.value, this.props.index)
    }
    changeName = (name) => {
        this.setState({name})
        this.props.changeFunction("name", name, this.props.index)
    }
    componentDidMount(){
        
    }
  render() {
      const{item,index} =this.props
      console.log(item)
    //   let variants = []
    //   try{
    //       item.variants.forEach((i) => {
    //           let obj = {
    //               label: i,
    //               value: i,
    //           }
    //           variants.push(obj)
    //       })
    //   }catch(e){
    //       console.log(e)
    //   }
    
                        // if tablets
      if (item.type == "Tablet" || item.type =="Drops"||item.type =="Capsules"){
         return (
        <View
            key={index}
            style={styles.card}
        >
            <View style={{ flex: 0.2,flexDirection:"row" ,margin:10}}>
                <Text style={[styles.text, { fontWeight: "bold", fontSize: 20 }]}>{item.title}</Text>
              

            </View>
            <View style={{flexDirection:"row",marginHorizontal:10,alignItems:"center",justifyContent:"space-between"}}>
                <View style={{flexDirection:"row"}}>
                         <Text style={[styles.text]}>Category :</Text>
                         <Text style={[styles.text,{}]}> {item.type}</Text>
                </View>
               
               {/* <View style={{flexDirection:"row"}}>
                             <View style={{alignItems:"center",justifyContent:"center"}}>
                                <Text style={{ marginRight: 10 }}>Variant</Text>
                             </View>
                           
                             <DropDownPicker
                                 items={variants}
                                 placeholder ="select"
                                 containerStyle={{ height: 40, width: width * 0.25 }}
                                 style={{ backgroundColor: '#fafafa' }}
                                 itemStyle={{
                                     justifyContent: 'flex-start'
                                 }}
                                 dropDownStyle={{ backgroundColor: '#fafafa', width: width * 0.25 }}
                                 onChangeItem={item => this.setState({
                                     selectedVariant: item.value
                                 },()=>{
                                     this.changeVariant(item.value)
                                 })}

                             />
                         
               </View> */}
            </View>
            <View style={{marginHorizontal:10,flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>
           
            </View>
            <View style={{flexDirection:"row",flex:0.5,}}>
               
                <View style={{ flex: 1,justifyContent:"center"}}>

                    <View style={{ flexDirection: "row",}}>
                        <View style={{ flex: 0.33, alignItems: 'center', justifyContent: "center" }}>
                            <TouchableOpacity style={{ height: height * 0.03, width: width * 0.2, backgroundColor: this.state.morning ? themeColor : "gray", alignItems: "center", justifyContent: 'center', borderRadius: 10 }}
                                onPress={() => {  this.setState({ morning: !this.state.morning }, () => { 
                                   if(this.state.morning){
                                       this.props.changeFunction("morning_count",1,index)
                                       this.setState({ morningCount: 1})
                                   }else{
                                       this.props.changeFunction("morning_count",0,index)
                                       this.setState({ morningCount: 0 })
                                   }
                                }) }}
                            >
                                <Text style={[styles.text, { color: "#fff" }]}>Morning</Text>
                            </TouchableOpacity>
                            {this.state.morning && <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: "space-around", width: width * 0.15, marginTop: 10 }}>
                                <TouchableOpacity
                                    onPress={() => { this.setState({ morningCount: this.state.morningCount - 1 },()=>{
                                        this.props.changeFunction("morning_count", this.state.morningCount, index)
                                          if(this.state.morningCount==0){

                                              this.setState({ morning: !this.state.morning})
                                          }
                                    }) }}
                                >
                                    <Entypo name="circle-with-minus" size={15} color="black" />
                                </TouchableOpacity>

                                <View>
                                    <Text style={[styles.text, { color: "gray" }]}>{this.state.morningCount}</Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() => { this.setState({ morningCount: this.state.morningCount + 1 },()=>{
                                        this.props.changeFunction("morning_count", this.state.morningCount , index)
                                    }) }}
                                >
                                    <AntDesign name="pluscircle" size={15} color="black" />
                                </TouchableOpacity>
                            </View>}
                        </View>
                        <View style={{ flex: 0.33, alignItems: 'center', justifyContent: "center" }}>
                            <TouchableOpacity style={{ height: height * 0.03, width: width * 0.2, backgroundColor: this.state.afterNoon ? themeColor : "gray", alignItems: "center", justifyContent: 'center', borderRadius: 10 }}
                                onPress={() => { this.setState({ afterNoon: !this.state.afterNoon }, () => { 
                                 
                                    if (this.state.afterNoon) {
                                        this.props.changeFunction("afternoon_count", 1, index)
                                        this.setState({afterNoonCount:1})
                                    }else{
                                        this.props.changeFunction("afternoon_count", 0, index)
                                        this.setState({afterNoonCount:0})
                                    }
                                
                                }) }}
                            >
                                <Text style={[styles.text, { color: "#fff" }]}>Afternoon</Text>
                            </TouchableOpacity>
                            {this.state.afterNoon && <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: "space-around", width: width * 0.15, marginTop: 10 }}>
                                <TouchableOpacity
                                    onPress={() => { this.setState({ afterNoonCount: this.state.afterNoonCount - 1 },()=>{
                                        this.props.changeFunction("afternoon_count", this.state.afterNoonCount, index)
                                        if (this.state.afterNoonCount == 0) {
                                            this.setState({ afterNoon: !this.state.afterNoon })
                                        }
                                    }) }}
                                >
                                    <Entypo name="circle-with-minus" size={15} color="black" />
                                </TouchableOpacity>


                                <View>
                                    <Text style={[styles.text, { color: "gray" }]}>{this.state.afterNoonCount}</Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() => { this.setState({ afterNoonCount: this.state.afterNoonCount + 1 },()=>{
                                        this.props.changeFunction("afternoon_count", this.state.afterNoonCount , index)
                                    }) }}
                                >
                                    <AntDesign name="pluscircle" size={15} color="black" />
                                </TouchableOpacity>
                            </View>}
                        </View>
                        <View style={{ flex: 0.33, alignItems: 'center', justifyContent: "center" }}>
                            <TouchableOpacity style={{ height: height * 0.03, width: width * 0.2, backgroundColor: this.state.night ? themeColor : "gray", alignItems: "center", justifyContent: 'center', borderRadius: 10 }}
                                onPress={() => { this.setState({ night: !this.state.night }, () => { 
                                    if(this.state.night){
                                        this.props.changeFunction("night_count",1, index)
                                        this.setState({ nightCount: 1 })
                                    }else{
                                        this.props.changeFunction("night_count",0, index)
                                        this.setState({ nightCount: 0 })
                                    }
                                  
                                
                                }) }}
                            >
                                <Text style={[styles.text, { color: "#fff" }]}>Night</Text>
                            </TouchableOpacity>
                            {this.state.night && <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: "space-around", width: width * 0.15, marginTop: 10 }}>
                                <TouchableOpacity
                                    onPress={() => { this.setState({ nightCount: this.state.nightCount - 1 },()=>{
                                        this.props.changeFunction("night_count", this.state.nightCount , index)
                                        if (this.state.nightCount == 0) {
                                            this.setState({ night: !this.state.night })
                                        }
                                    }) }}
                                >
                                    <Entypo name="circle-with-minus" size={15} color="black" />
                                </TouchableOpacity>


                                <View>
                                    <Text style={[styles.text, { color: "gray" }]}>{this.state.nightCount}</Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() => { this.setState({ nightCount: this.state.nightCount + 1 },()=>{
                                        this.props.changeFunction("night_count", this.state.nightCount , index)
                                    }) }}
                                >
                                    <AntDesign name="pluscircle" size={15} color="black" />
                                </TouchableOpacity>
                            </View>}
                        </View>

                    </View>
              
                </View>
            </View>
            <>
         <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-around", flex: 0.2 }}>
              { item.type!="Drops"&&<View style={{flexDirection:"row"}}>
                    <Text style={[styles.text, { fontWeight: 'bold' }]}>After food</Text>

                    <Switch
                        style={{ marginLeft: 10 }}
                        trackColor={{ false: '#767577', true: '#81b0ff' }}
                        thumbColor={this.state.afterFood ? '#f5dd4b' : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={() => { this.toggleSwitch() }}
                        value={this.state.afterFood}
                    />
                </View>}
                <View style={{flexDirection:'row'}}>
                    <View style={{alignItems:'center',justifyContent:'center'}}>
                        <Text>No of days</Text>
                    </View>
                  
                    <TextInput 
                       value={this.state.days}
                       selectionColor={themeColor}
                       keyboardType="numeric"
                       style={{height:35,width: 50,backgroundColor:'#eee',borderRadius:5,marginLeft:5,paddingLeft:5}}
                       onChangeText ={(text)=>{this.changeDays(text)}}
                    
                    />
                </View>
                    
            </View>
            </>
                 <View style={{margin:10}}>
                     <Text>Comments:</Text>
                     <TextInput
                       selectionColor={themeColor}
                       multiline={true} 
                       onChangeText={(comment) => { this.changeComment(comment)}}
                       style={{height:height*0.07,width:"100%",backgroundColor:"#eee",borderRadius:10,marginTop:10,textAlignVertical:"top",padding:5}}
                       value ={this.state.comment}
                     />
                 </View>
         <TouchableOpacity
                onPress={() => { this.props.changeFunction("delete",item,index)}}
           style={{position:"absolute",top:10,right: 10,}}
         >
                <Entypo name="circle-with-cross" size={24} color="red" />
         </TouchableOpacity>
        </View>
    );
      }
      if (item.type =="Liquid"){
          return (
              <View
                  key={index}
                  style={[styles.card,{}]}
              >
                  <View style={{ flex: 0.4, alignItems: 'center', justifyContent: "center" }}>
                      <Text style={[styles.text, { fontWeight: "bold", fontSize: 20 }]}>{item.title}</Text>
                  </View>
                  <View style={{ flexDirection: "row", marginHorizontal: 10, alignItems: "center", justifyContent: "space-between" }}>
                      <View style={{ flexDirection: "row" }}>
                          <Text style={[styles.text]}>Category :</Text>
                          <Text style={[styles.text, {}]}> {item.type}</Text>
                      </View>

                   
                  </View>
                  <View style={{ flex: 0.6, alignItems: 'center', justifyContent: "space-around",flexDirection:"row"}}>
                      <TouchableOpacity style={{ height: height * 0.03, width: width * 0.2, backgroundColor: this.state.morning ? themeColor : "gray", alignItems: "center", justifyContent: 'center', borderRadius: 10 }}
                          onPress={() => {
                              this.setState({ morning: !this.state.morning }, () => {
                                    if(this.state.morning){
                                       this.props.changeFunction("morning_count",1,index)
                                       this.setState({ morningCount: 1})
                                   }else{
                                       this.props.changeFunction("morning_count",0,index)
                                       this.setState({ morningCount: 0 })
                                   }
                                
                              })
                          }}
                      >
                          <Text style={[styles.text, { color: "#fff" }]}>Morning</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity style={{ height: height * 0.03, width: width * 0.2, backgroundColor: this.state.afterNoon ? themeColor : "gray", alignItems: "center", justifyContent: 'center', borderRadius: 10 }}
                          onPress={() => {
                              this.setState({ afterNoon: !this.state.afterNoon }, () => {

                                  if (this.state.afterNoon) {
                                      this.props.changeFunction("afternoon_count", 1, index)
                                      this.setState({ afterNoonCount: 1 })
                                  } else {
                                      this.props.changeFunction("afternoon_count", 0, index)
                                      this.setState({ afterNoonCount: 0 })
                                  }

                              })
                          }}
                      >
                          <Text style={[styles.text, { color: "#fff" }]}>Afternoon</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={{ height: height * 0.03, width: width * 0.2, backgroundColor: this.state.night ? themeColor : "gray", alignItems: "center", justifyContent: 'center', borderRadius: 10 }}
                          onPress={() => {
                              this.setState({ night: !this.state.night }, () => {
                                  if (this.state.night) {
                                      this.props.changeFunction("night_count", 1, index)
                                      this.setState({ nightCount: 1 })
                                  } else {
                                      this.props.changeFunction("night_count", 0, index)
                                      this.setState({ nightCount: 0 })
                                  }


                              })
                          }}
                      
                      >
                          <Text style={[styles.text, { color: "#fff" }]}>Night</Text>
                      </TouchableOpacity>
                  </View>
                  <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-around"}}>
                    <View style={{flexDirection:"row"}}>
                        <View style={{alignItems:'center',justifyContent:"center"}}>
                              <Text>Enter ml</Text>
                        </View>
                       
                          <TextInput
                              keyboardType={"numeric"}
                              selectionColor ={themeColor}
                              style={{ height: 35, width: 50, backgroundColor: '#eee', borderRadius: 5, marginLeft: 5, paddingLeft: 5 }}
                              onChangeText={(text) => {this.changeQty(text)}}
                          />
                    </View>
                     
                      <View style={{flexDirection:"row"}}>
                          <View style={{alignItems:'center',justifyContent:"center"}}>
                              <Text>Enter no of days</Text>
                          </View>
                      
                          <TextInput
                              keyboardType ={"numeric"}
                              selectionColor={themeColor}
                              style={{ height: 35, width: 50, backgroundColor: '#eee', borderRadius: 5, marginLeft: 5, paddingLeft: 5 }}
                              value={this.state.days}
                              onChangeText={(text) => { this.changeDays(text) }}
                          />
                      </View>
                  </View>
                  <View style={{ margin: 10 }}>
                      <Text>Comments:</Text>
                      <TextInput
                          selectionColor={themeColor}
                          multiline={true}
                          onChangeText={(comment) => { this.changeComment(comment) }}
                          style={{ height: height * 0.07, width: "100%", backgroundColor: "#eee", borderRadius: 10, marginTop: 10, textAlignVertical: "top", padding: 5 }}
                          value={this.state.comment}
                      />
                  </View>
                  <TouchableOpacity
                      onPress={() => { this.props.changeFunction("delete", item, index) }}
                      style={{ position: "absolute", top: 10, right: 10, }}
                  >
                      <Entypo name="circle-with-cross" size={24} color="red" />
                  </TouchableOpacity>
            
              </View>
          )
          
      }
      if (item.type == "Cream") {
          return (
              <View
                  key={index}
                  style={[styles.card, {}]}
              >
                  <View style={{ flex: 0.4, alignItems: 'center', justifyContent: "center" }}>
                      <Text style={[styles.text, { fontWeight: "bold", fontSize: 20 }]}>{item.title}</Text>
                  </View>
                  <View style={{ flexDirection: "row", marginHorizontal: 10, alignItems: "center", justifyContent: "space-between" }}>
                      <View style={{ flexDirection: "row" }}>
                          <Text style={[styles.text]}>Category :</Text>
                          <Text style={[styles.text, {}]}> {item.type}</Text>
                      </View>

                      {/* <View style={{ flexDirection: "row" }}>
                          <View style={{ alignItems: "center", justifyContent: "center" }}>
                              <Text style={{ marginRight: 10 }}>Variant</Text>
                          </View>

                          <DropDownPicker
                              items={variants}
                              placeholder="select"
                              containerStyle={{ height: 40, width: width * 0.25 }}
                              style={{ backgroundColor: '#fafafa' }}
                              itemStyle={{
                                  justifyContent: 'flex-start'
                              }}
                              dropDownStyle={{ backgroundColor: '#fafafa', width: width * 0.25 }}
                              onChangeItem={item => this.setState({
                                  selectedVariant: item.value
                              }, () => {
                                  this.changeVariant(item.value)
                              })}

                          />

                      </View> */}
                  </View>
                  <View style={{ flex: 0.6, alignItems: 'center', justifyContent: "space-around", flexDirection: "row" }}>
                      <TouchableOpacity style={{ height: height * 0.03, width: width * 0.2, backgroundColor: this.state.morning ? themeColor : "gray", alignItems: "center", justifyContent: 'center', borderRadius: 10 }}
                          onPress={() => {
                              this.setState({ morning: !this.state.morning }, () => {
                                  if (this.state.morning) {
                                      this.props.changeFunction("morning_count", 1, index)
                                      this.setState({ morningCount: 1 })
                                  } else {
                                      this.props.changeFunction("morning_count", 0, index)
                                      this.setState({ morningCount: 0 })
                                  }

                              })
                          }}
                      >
                          <Text style={[styles.text, { color: "#fff" }]}>Morning</Text>
                      </TouchableOpacity>

                      <TouchableOpacity style={{ height: height * 0.03, width: width * 0.2, backgroundColor: this.state.afterNoon ? themeColor : "gray", alignItems: "center", justifyContent: 'center', borderRadius: 10 }}
                          onPress={() => {
                              this.setState({ afterNoon: !this.state.afterNoon }, () => {

                                  if (this.state.afterNoon) {
                                      this.props.changeFunction("afternoon_count", 1, index)
                                      this.setState({ afterNoonCount: 1 })
                                  } else {
                                      this.props.changeFunction("afternoon_count", 0, index)
                                      this.setState({ afterNoonCount: 0 })
                                  }

                              })
                          }}
                      >
                          <Text style={[styles.text, { color: "#fff" }]}>Afternoon</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={{ height: height * 0.03, width: width * 0.2, backgroundColor: this.state.night ? themeColor : "gray", alignItems: "center", justifyContent: 'center', borderRadius: 10 }}
                          onPress={() => {
                              this.setState({ night: !this.state.night }, () => {
                                  if (this.state.night) {
                                      this.props.changeFunction("night_count", 1, index)
                                      this.setState({ nightCount: 1 })
                                  } else {
                                      this.props.changeFunction("night_count", 0, index)
                                      this.setState({ nightCount: 0 })
                                  }


                              })
                          }}
                      >
                          <Text style={[styles.text, { color: "#fff" }]}>Night</Text>
                      </TouchableOpacity>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-around" }}>
                    

                      <View style={{ flexDirection: "row" }}>
                          <View style={{ alignItems: 'center', justifyContent: "center" }}>
                              <Text>Enter no of Times</Text>
                          </View>

                          <TextInput
                              keyboardType={"numeric"}
                              selectionColor={themeColor}
                              style={{ height: 35, width: 50, backgroundColor: '#eee', borderRadius: 5, marginLeft: 5, paddingLeft: 5 }}
                           
                              onChangeText={(text) => { this.changeQty(text) }}
                          />
                      </View>
                  </View>
                  <View style={{ margin: 10 }}>
                      <Text>Comments:</Text>
                      <TextInput
                          selectionColor={themeColor}
                          multiline={true}
                          onChangeText={(comment) => { this.changeComment(comment) }}
                          style={{ height: height * 0.07, width: "100%", backgroundColor: "#eee", borderRadius: 10, marginTop: 10, textAlignVertical: "top", padding: 5 }}
                          value={this.state.comment}
                      />
                  </View>
                  <TouchableOpacity
                      onPress={() => { this.props.changeFunction("delete", item, index) }}
                      style={{ position: "absolute", top: 10, right: 10, }}
                  >
                      <Entypo name="circle-with-cross" size={24} color="red" />
                  </TouchableOpacity>

              </View>
          )

      }
      if (item.type == "Injections") {
          return (
              <View
                  key={index}
                  style={[styles.card3, {flex:1}]}
              >
                  <View style={{ alignItems: 'center', justifyContent: "center",flex:0.2 }}>
                      <Text style={[styles.text, { fontWeight: "bold", fontSize: 20 }]}>{item.title}</Text>
                  </View>
                  <View style={{ flexDirection: "row", marginHorizontal: 10, alignItems: "center",flex:0.2}}>
                      <View style={{ flexDirection: "row" }}>
                          <Text style={[styles.text]}>Category :</Text>
                          <Text style={[styles.text, {}]}> {item.type}</Text>
                      </View>

                    
                  </View>
               
                  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-around" ,flex:0.2}}>


                      <View style={{ flexDirection: "row" ,alignItems:"center",justifyContent:"center"}}>
                          <View style={{ alignItems: 'center', justifyContent: "center" }}>
                              <Text>Enter Qty</Text>
                          </View>

                          <TextInput
                              keyboardType={"numeric"}
                              selectionColor={themeColor}
                              style={{ height: 35, width: 50, backgroundColor: '#eee', borderRadius: 5, marginLeft: 5, paddingLeft: 5 }}
                              value={this.state.qty}
                              onChangeText={(text) => { this.changeQty(text) }}
                          />
                      </View>
                  </View>
                  <View style={{ margin: 10 ,flex:0.6,}}>
                      <Text>Comments:</Text>
                      <View style={{flex:1,alignItems:"center",justifyContent:"center"}}>
                          <TextInput
                              selectionColor={themeColor}
                              multiline={true}
                              onChangeText={(comment) => { this.changeComment(comment) }}
                              style={{ height: "70%", width: "100%", backgroundColor: "#eee", borderRadius: 10,  textAlignVertical: "top", padding: 5 }}
                              value={this.state.comment}
                          />
                      </View>
                     
                  </View>
                  <TouchableOpacity
                      onPress={() => { this.props.changeFunction("delete", item, index) }}
                      style={{ position: "absolute", top: 10, right: 10, }}
                  >
                      <Entypo name="circle-with-cross" size={24} color="red" />
                  </TouchableOpacity>

              </View>
          )

      }
    
      if (item.type == "Others" || item.type == "Suppositories" || item.type =="Inhalers"){
          return(
              <View 
                  key={index}
                  style={[styles.card2,styles.elevation]}
              >
                  <View style={{  margin:20 }}>
                      <Text style={[styles.text, { fontWeight: "bold", fontSize: 20 }]}>{item.title}</Text>
                  </View>
                  <View style={{ flexDirection: "row",alignItems:"center",justifyContent:"center", }}>
                      <View style={{ alignItems: 'center', justifyContent: "center" }}>
                          <Text>Enter Qty</Text>
                      </View>

                      <TextInput
                          keyboardType={"numeric"}
                          selectionColor={themeColor}
                          style={{ height: 35, width: 50, backgroundColor: '#eee', borderRadius: 5, marginLeft: 5, paddingLeft: 5 }}
                          value={this.state.qty}
                          onChangeText={(text) => { this.changeQty(text) }}
                      />
                  </View>
                  <View style={{ margin: 10 }}>
                      <Text>Comments:</Text>
                      <TextInput
                          selectionColor={themeColor}
                          multiline={true}
                          onChangeText={(comment) => { this.changeComment(comment) }}
                          style={{ height: height * 0.07, width: "100%", backgroundColor: "#eee", borderRadius: 10, marginTop: 10, textAlignVertical: "top", padding: 5 }}
                          value={this.state.comment}
                      />
                  </View>
                  <TouchableOpacity
                      onPress={() => { this.props.changeFunction("delete", item, index) }}
                      style={{ position: "absolute", top: 10, right: 10, }}
                  >
                      <Entypo name="circle-with-cross" size={24} color="red" />
                  </TouchableOpacity>
              </View>
          )
      }
      if(item.manual){
          return(
              <View style={[styles.card4]}>
                  <View style={{ marginLeft: 15, }}>
                      <Text style={[styles.text, { color: "#000" }]}>Enter Name</Text>
                      <TextInput
                          value={this.state.name}
                          selectionColor={themeColor}
                          onChangeText={(name) => { this.changeName(name) }}
                          style={{ width: width * 0.8, height: height * 0.05, backgroundColor: "#fafafa", borderRadius: 15, padding: 10, marginTop: 10 }}
                      />
                  </View>
               {this.state.name.length>0&&<View style={{margin:15}}>
                      <Text style={[styles.text,{color:"#000"}]}>Select Type</Text>
                      <View style={{ marginLeft: 10,marginTop:10 }}>
                          <DropDownPicker
                              items={types}
                              containerStyle={{ height: 40, width: width * 0.4 }}
                              style={{ backgroundColor: '#fafafa' }}
                              itemStyle={{
                                  justifyContent: 'flex-start'
                              }}
                              dropDownStyle={{ backgroundColor: '#fafafa', width: width * 0.4 }}
                            //   onChangeItem={item => this.setState({
                            //       selectedType: item.value
                            //   })}
                              onChangeItem={(item)=>{
                                  this.changeType(item)
                              }}  
                          />
                      </View>
                  </View>}
                  
                  <TouchableOpacity
                      onPress={() => { this.props.changeFunction("delete", item, index) }}
                      style={{ position: "absolute", top: 10, right: 10, }}
                  >
                      <Entypo name="circle-with-cross" size={24} color="red" />
                  </TouchableOpacity>
              </View>
          )
      }
      return null
  }
}
const styles = StyleSheet.create({
    text: {
        fontFamily,
        
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
        backgroundColor: "#fff",
        elevation: 6,
        margin: 10,
        height: height * 0.4,
        borderRadius: 10,
      
    },
    card2: {
        backgroundColor: "#fff",
        elevation: 6,
        margin: 10,
        height: height * 0.27,
        borderRadius: 10,

    },
       card3: {
        backgroundColor: "#fff",
        elevation: 6,
        margin: 10,
        height: height * 0.25,
        borderRadius: 10,

    },
    card4:{
        backgroundColor: "#fff",
        elevation: 6,
        margin: 10,
        minHeight: height * 0.4,
        borderRadius: 10,

    },
})