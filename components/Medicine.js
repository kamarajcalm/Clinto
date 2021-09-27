import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions, StyleSheet} from 'react-native';
import settings from '../AppSettings'
import { AntDesign } from '@expo/vector-icons';
const { height, width } = Dimensions.get("window");
const fontFamily = settings.fontFamily;
const themeColor = settings.themeColor;
export default class Medicine extends Component {
  constructor(props) {
    super(props);
    this.state = {
        selected:false,
    };
  }
getColor =(item)=>{
  const found =  this.props.selected.find((med)=>{
       return med.id == item.id
  })
  if(found){
      return "green"
  }else
    return "gray"
}
  render() {
      const {item} =this.props
    return (
        <TouchableOpacity
            onPress={() => { this.props.selection(item)}}
            style={{ height: height * 0.1, marginTop: 10, flexDirection: "row" }}
        >
            <View style={{ flex: 0.2, alignItems: "center", justifyContent: "center" }}>
                <Image
                    source={{ uri:"https://lh3.googleusercontent.com/proxy/-hC9-7bgQSA6mg2aIAdRbGAtwRX0MHjYEudKywiZGdS_wfVmm3DYdTrWFihHZtYTvevDjbaEnMSJW_dA8S2eITlWp3Q27yFEW_qge7xPHVOfuSzsuDru2IvyqXB28w" }}
                    style={{ height: "80%", width: "80%", resizeMode: "contain", borderRadius: 15 }}
                />
            </View>
            <View style={{ flex: 0.6, alignItems: "center", justifyContent: "center" ,flexDirection:"row"}}>
                <Text style={[styles.text]}>{item.title}</Text>
                <Text style={[styles.text,{marginLeft:10,color:"gray"}]}>({item.type})</Text>
            </View>
            <View style={{ flex: 0.2, alignItems: "center", justifyContent: 'center' }}
                
            >
                <AntDesign name="medicinebox" size={24} color={this.getColor(item) } />
            </View>
         
        </TouchableOpacity>
    );
  }
}
const styles = StyleSheet.create({
    text: {
        fontFamily
    },
  

})