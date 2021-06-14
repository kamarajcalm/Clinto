import React, { Component } from 'react';
import { View, Text, Dimensions, TouchableOpacity, StyleSheet, TextInput, FlatList, Image, SafeAreaView } from 'react-native';
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
class SearchPateint extends Component {
    constructor(props) {
        super(props);
        this.state = {
           pateints:[]
        };
    }
    SearchPateint = async(query)=>{
        if(query.length>9){
            let api = `${url}/api/profile/userss/?search=${query}&role=Customer`

            const data = await HttpsClient.get(api)
            if (data.type == "success") {
                this.setState({ pateints: data.data })
            }
        }
     
        
    }
    render() {
        return (
            <>
                <SafeAreaView style={styles.topSafeArea} />
                <SafeAreaView style={styles.bottomSafeArea}>
                
                        <View style={{ height: height * 0.1, backgroundColor: themeColor, borderBottomRightRadius: 20, borderBottomLeftRadius: 20, flexDirection: 'row', alignItems: "center" }}>
                            <TouchableOpacity style={{ flex: 0.2, alignItems: "center", justifyContent: 'center' }}
                                onPress={() => { this.props.navigation.goBack() }}
                            >
                                <Ionicons name="chevron-back-circle" size={30} color="#fff" />
                            </TouchableOpacity>
                            <View style={{ flex: 0.7, alignItems: "center", justifyContent: "center" }}>
                                <TextInput
                                
                                    autoFocus={true}
                                    selectionColor={themeColor}
                                    style={{ height: "45%", backgroundColor: "#fafafa", borderRadius: 15, padding: 10, marginTop: 10, width: "100%" }}
                                    placeholder="Enter Phone number"
                                    onChangeText ={(text)=>{this.SearchPateint(text)}}
                                />
                            </View>

                        </View>
                        <FlatList 
                           data ={this.state.pateints}
                           keyExtractor ={(item,index)=>index.toString()}
                           renderItem ={({item,index})=>{
                               return(
                                   <TouchableOpacity style={[styles.card, { flexDirection: "row", borderRadius: 5, marginTop: 15 }]}
                                       onPress={() => { this.props.navigation.navigate('ListPriscriptions', { item }) }}
                                   >
                                       <View style={{ flex: 0.3, alignItems: 'center', justifyContent: "center" }}>
                                           <Image
                                               source={{ uri: "https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg" }}
                                               style={{ height: 60, width: 60, borderRadius: 30 }}
                                           />
                                       </View>
                                       <View style={{ flex: 0.4, justifyContent: 'center', alignItems: 'center' }}>
                                           <View >
                                               <Text style={[styles.text, { fontSize: 18, }]}>{item.name}</Text>
                                               <Text style={[styles.text, { fontSize: 12, }]}>{item.mobile}</Text>
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
  

})
const mapStateToProps = (state) => {

    return {
        theme: state.selectedTheme,

    }
}
export default connect(mapStateToProps, { selectTheme })(SearchPateint);