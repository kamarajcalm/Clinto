import React, { Component } from 'react'
import { Dimensions, FlatList, Text, TouchableOpacity, View ,StyleSheet} from 'react-native';
import settings from '../AppSettings';
const fontFamily = settings.fontFamily;
const themeColor = settings.themeColor;
const {height,width} =Dimensions.get('window')
 const data =[
   {
     medicineName:"Dolomites",
     requiredQuantity:5,
     customerName:"kamaraj"
   },
   {
     customerName:"kamaraj",
     medicineName:"Cipla",
     requiredQuantity:5
   },
   {
    customerName:"kamaraj",
     medicineName:"paracetomol",
     requiredQuantity:5
   },
 ]
export default class Requests extends Component {
  separator=()=>{
    return(
      <View style={{height:0.5,backgroundColor:"gray"}}>

      </View>
    )
  }
  render() {
    return (
      <View>
          <FlatList
            data={data}
            keyExtractor={(item,index)=>index.toString()}
            ItemSeparatorComponent={this.separator}
            renderItem ={({item,index})=>{
                   return(
                     <View style={{height:height*0.2,backgroundColor:"#fafafa",}}>
                          <View style={{flex:0.6,alignItems:"center",justifyContent:"space-around"}}>
                            <View>
                               <Text style={[styles.text]}>Name: {item.customerName}</Text>
                            </View>
                              <View>
                                    <Text style={[styles.text,{color:"#000"}]}>{item.medicineName} :{item.requiredQuantity}</Text>
                              </View>
                               
                          </View>
                          <View style={{flex:0.4,alignItems:"center",justifyContent:"space-around",flexDirection:"row"}}>
                                  <View>
                                      <TouchableOpacity style={{height:height*0.05,width:width*0.3,alignItems:"center",justifyContent:"center",backgroundColor:"#238a1c"}}>
                                            <Text style={[styles.text,{color:"#fff"}]}>Accept</Text>
                                      </TouchableOpacity>
                                  </View>
                                  <View>
                              <TouchableOpacity style={{height:height*0.05,width:width*0.3,alignItems:"center",justifyContent:"center",backgroundColor:"#94240d"}}>
                                            <Text style={[styles.text,{color:"#fff"}]}>Reject</Text>
                                      </TouchableOpacity>
                                  </View>
                          </View>
                     </View>
                   )
            }}
          />  
      </View>
    )
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
    card: {

        backgroundColor: "#eeee",
        height: height * 0.1,
        marginHorizontal: 10,
        marginVertical: 3

    },
})