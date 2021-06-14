import React, { Component } from 'react';
import { View, Text, Dimensions, TouchableOpacity, StyleSheet, TextInput, FlatList, Image, SafeAreaView, StatusBar } from 'react-native';
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
import axios from 'axios';
const url = settings.url;

class SearchPatient extends Component {
    constructor(props) {
        super(props);
        this.state = {
            patients: [],
            cancelToken: undefined
        };
    }

    SearchPatient = async (query) => {

        if (typeof this.state.cancelToken != typeof undefined) {
            this.state.cancelToken.cancel('cancelling the previous request')
        }
        this.state.cancelToken = axios.CancelToken.source()
        let api = `${url}/api/profile/userss/?search=${query}&role=Customer`
        console.log(api)
        if (query!=''){
            const data = await axios.get(api, { cancelToken: this.state.cancelToken.token });
            console.log(data.data)
            this.setState({ patients: data.data })
            console.log(data.statusText, "sssss")
        }else{
            return
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
                            onPress={() => { this.props.navigation.goBack() }}
                        >
                            <Ionicons name="chevron-back-circle" size={30} color="#fff" />
                        </TouchableOpacity>
                        <View style={{ flex: 0.7, alignItems: "center", justifyContent: "center" }}>
                            <TextInput
                                autoFocus={true}
                                selectionColor={themeColor}
                                style={{ height: "45%", backgroundColor: "#fafafa", borderRadius: 15, padding: 10, marginTop: 10, width: "100%" }}
                                placeholder="Search Patients"
                                onChangeText={(text) => { this.SearchPatient(text) }}
                            />
                        </View>

                    </View>
                    <FlatList
                        data={this.state.patients}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => {
                            let dp = ''
                            if (item.displayPicture) {
                                dp = `${item.displayPicture}`
                            }
                            return (
                                <TouchableOpacity style={{ height: height * 0.07, marginTop: 20, flexDirection: "row" }}
                                    onPress={() => { this.props.navigation.navigate('ListPatientPriscription',{item:item}) }}
                                >
                                    <View style={{ flex: 0.3, alignItems: 'center', justifyContent: "center" }}>
                                        <Image
                                            source={{ uri: dp || "https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg" }}
                                            style={{ height: 60, width: 60, borderRadius: 30 }}
                                        />
                                    </View>
                                    <View style={{ flex: 0.7 }}>
                                        <View>
                                            <Text style={[styles.text]}>{item.name}</Text>
                                        </View>
                                        <View>
                                            <Text style={[styles.text]}>{item.mobile}</Text>
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
export default connect(mapStateToProps, { selectTheme })(SearchPatient);