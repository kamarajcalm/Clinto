import React, { Component } from 'react';
import { View, Text, Dimensions, TouchableOpacity, StyleSheet, TextInput, FlatList, Image, SafeAreaView, StatusBar} from 'react-native';
import { Ionicons, Entypo, AntDesign } from '@expo/vector-icons';
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
const DATA  =[
    {
        name:"doctor",
        specialization:"heart surgeon"
    },
    {
        name: "doctor2",
        specialization: "heart surgeon"
    },
    {
        name: "doctor3",
        specialization: "heart surgeon"
    }
]
class SearchDoctors extends Component {
    constructor(props) {
        super(props);
        this.state = {
             doctors:[]
        };
    }

    SearchDoctors = async(query)=>{
        let api = `${url}/api/profile/userss/?search=${query}&role=Doctor`
        console.log(api)
        let data =await HttpsClient.get(api)
        console.log(data)
        if(data.type ="success"){
            this.setState({ doctors:data.data})
        }
    }
    render() {
        return (
              <>
                <SafeAreaView style={styles.topSafeArea} />
                <SafeAreaView style={styles.bottomSafeArea}>
                    <StatusBar backgroundColor={themeColor} barStyle={"default"} />
           
                <View style={{ height: height * 0.1, backgroundColor: themeColor, borderBottomRightRadius: 20, borderBottomLeftRadius: 20, flexDirection: 'row', alignItems: "center" }}>
                    <TouchableOpacity style={{ flex: 0.2, alignItems: "center", justifyContent: 'center' }}
                        onPress={() => { this.props.navigation.goBack()}}
                    >
                        <Ionicons name="chevron-back-circle" size={30} color="#fff" />
                    </TouchableOpacity>
                    <View style={{ flex: 0.7, alignItems: "center", justifyContent: "center" }}>
                        <TextInput
                            autoFocus={true}
                            selectionColor={themeColor}
                            style={{ height: "45%", backgroundColor: "#fafafa", borderRadius: 15, padding: 10, marginTop: 10, width: "100%" }}
                            placeholder="search Doctors"
                            onChangeText={(text)=>{this.SearchDoctors(text)}}
                        />
                    </View>

                </View>
                <FlatList 
                   data ={this.state.doctors}
                   keyExtractor ={(item,index)=>index.toString()}
                   renderItem ={({item,index})=>{
                       console.log(item,"jjj")
                     return(
                         <TouchableOpacity style={{height:height*0.07,marginTop:20,flexDirection:"row"}}
                             onPress={() => { this.props.navigation.navigate("ProfileView",{item})}}
                         >
                             <View style={{ flex: 0.3, alignItems: 'center', justifyContent: "center" }}>
                                 <Image
                                     source={{ uri: item.displayPicture ||"https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg" }}
                                     style={{ height: 60, width: 60, borderRadius: 30 }}
                                 />
                             </View>
                             <View style ={{flex:0.7}}>
                                  <View>
                                      <Text style={[styles.text]}>{item.name}</Text>
                                  </View>
                                 <View>
                                     <Text style={[styles.text]}>{item.specialization}</Text>
                                 </View>
                             </View>
                         </TouchableOpacity>
                     )
                   }}
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
    }

})
const mapStateToProps = (state) => {

    return {
        theme: state.selectedTheme,

    }
}
export default connect(mapStateToProps, { selectTheme })(SearchDoctors);