import React, { Component } from 'react';
import { View, Text ,ActivityIndicator} from 'react-native';


export default class InventoryDefaultScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
    navigate =()=>{
        this.props.navigation.navigate("InventoryNew")
    }
  componentDidMount(){
      this.navigate()
      this._unsubscribe = this.props.navigation.addListener('focus', () => {
          this.navigate()
      });
  }


  render() {
    return (
      <View style={{flex:1,alignItems:"center",justifyContent:"center",backgroundColor:"#000"}}>
          <ActivityIndicator 
            color={"#fff"}
            size={"large"}
          />
      </View>
    );
  }
}
