import React, { Component } from 'react';
import { View, Text, Dimensions, TouchableOpacity, StyleSheet, TextInput, FlatList, Image, SafeAreaView} from 'react-native';
import { Ionicons, Entypo, AntDesign} from '@expo/vector-icons';
import { connect } from 'react-redux';
import { selectTheme } from '../actions';
import settings from '../AppSettings';
import medicine from '../components/Medicine';
import Medicine from '../components/Medicine';
import HttpsClient from '../api/HttpsClient';
const { height, width } = Dimensions.get("window");
const fontFamily = settings.fontFamily;
const themeColor = settings.themeColor;
const url = settings.url;
import axios from 'axios';
 class SearchMedicines extends Component {
  constructor(props) {
    super(props);
    this.state = {
        selected:[],
        medicines:[],
        cancelToken: undefined
    };
   
  }

    addNew =()=>{
        let duplicate = this.state.medicines
        duplicate.push({manual:true})
        this.props.route.params.backFunction(duplicate)
        this.props.navigation.goBack()
    }
     selectMedicine =(item)=>{

         let data =this.state.selected
         var found = data.find(function (element) {
             return element === item;
         });
        if(found){
          let index =   data.indexOf(found)
           data.splice(index,1)
           this.setState({selected:data})
        }else{
            data.push(item)
            this.setState({ selected: data })
        }
         
         
     }
     SearchMedicines =async(query)=>{
      this.setState({search:true})
      if(typeof this.state.cancelToken != typeof undefined){
         this.state.cancelToken.cancel('cancelling the previous request')
      }
      this.state.cancelToken = axios.CancelToken.source()
      let api= `${url}/api/prescription/medicines/?name=${query}`
       console.log(api,"ppp")
      const data = await axios.get(api,{cancelToken:this.state.cancelToken.token});
         this.setState({ medicines: data.data })
    // const data =await HttpsClient.get(api)
      console.log(data,"kjkjkk")
      console.log(data.statusText,"sssss")

        // if(data.type=="success"){
        //      this.setState({medicines:data.data})
        // }
     }
  render() {
    return (
         <>
            <SafeAreaView style={styles.topSafeArea} />
            <SafeAreaView style={styles.bottomSafeArea}>
      <View style={{flex:1}}>
            <View style={{ height: height * 0.1, backgroundColor: themeColor, borderBottomRightRadius: 20, borderBottomLeftRadius: 20, flexDirection: 'row', alignItems: "center" }}>
                <TouchableOpacity style={{ flex: 0.2, alignItems: "center", justifyContent: 'center' }}
                    onPress={() => { 
                        this.props.route.params.backFunction(this.state.selected)
                        this.props.navigation.goBack() 
                    }}
                >
                    <Ionicons name="chevron-back-circle" size={30} color="#fff" />
                </TouchableOpacity>
                <View style={{ flex: 0.7, alignItems: "center", justifyContent: "center" }}>
                    <TextInput
                        autoFocus={true}
                        selectionColor={themeColor}
                        style={{  height:"45%", backgroundColor: "#fafafa", borderRadius: 15, padding: 10, marginTop: 10 ,width:"100%"}}
                        placeholder="search Medicines"
                        onChangeText ={(text)=>{this.SearchMedicines(text)}}
                    />
                </View>
                 
            </View>
           { this.state.medicines.length>0&&<FlatList
                data={this.state.medicines}
                keyExtractor={(item,index)=>index.toString()}
                renderItem={({item,index})=>{
                    return(
                      <Medicine item ={item} selection={(item)=>{this.selectMedicine(item)}}/>
                    )
                }}
            />}
            {
                this.state.medicines.length ==0&&this.state.search&&<View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                    <View>
                        <Text style={[styles.text]}>No results Found</Text>
                    </View>
                   <TouchableOpacity 
                                onPress={() => {
                                    this.addNew()
                                }}
                                style={{ height: height * 0.05, width: width * 0.4, backgroundColor: themeColor, borderRadius: 15, alignItems: "center", justifyContent: 'center' }}
                   >
                                <Text style={[styles.text, { color: "#fff" }]}>Add New</Text>
                   </TouchableOpacity>
                </View>
            }
            {this.state.medicines.length>0&&<View style={{position:"absolute",bottom:30,left: 20,height:height*0.05,width:width*0.4,backgroundColor:themeColor,borderRadius:15,alignItems:"center",justifyContent:'center'}}>
                  <Text style={[styles.text,{color:"#fff"}]}>selected ({this.state.selected.length})</Text> 
            </View>}
                    {this.state.medicines.length>0&&<TouchableOpacity style={{ position: "absolute", bottom: 30, right: 20, height: height * 0.05, width: width * 0.4, backgroundColor: themeColor, borderRadius: 15, alignItems: "center", justifyContent: 'center' }}
                      onPress={()=>{
                          this.props.route.params.backFunction(this.state.selected)
                          this.props.navigation.goBack()
                        }}
                    >
                        <Text style={[styles.text, { color: "#fff" }]}>Proceed</Text>
                    </TouchableOpacity>}
      </View>
            </SafeAreaView>
        </>
    );
  }
}
const styles = StyleSheet.create({
    text: {
        fontFamily
    },
    card:{
        backgroundColor:"#fff",
        elevation:6,
        margin:20,
        height:height*0.3
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
export default connect(mapStateToProps, { selectTheme })(SearchMedicines);