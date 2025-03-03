import React from "react";
import { ScrollView, View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Dashboard from "./Dashboard";
import auth from "@react-native-firebase/auth";

export default function Admin() {
    const navigation = useNavigation();
    return (
        <View>
            <ScrollView>
                <Dashboard />
                <TouchableOpacity
                    onPress={() => navigation.navigate("Home")}
                    style={{ marginTop: 20, padding: 10, backgroundColor: "#002C0B", borderRadius: 5, width: "70%", position: "relative", alignSelf: "center" }}
                >
                    <Text style={{ color: "#fff", fontSize: 16, textAlign: "center" }}>Voltar para Home</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        auth()
                            .signOut()
                            .then(() => {
                                navigation.navigate("Home");
                            })
                            .catch((error) => {
                                console.log(error);
                            });
                    }}
                    style={{ marginTop: 20, padding: 10, backgroundColor: "#6C7B8B", borderRadius: 5, width: "50%", position: "relative", alignSelf: "center" }}
                >
                    <Text style={{ color: "#fff", fontSize: 16, textAlign: "center" }}>Sair da conta Admin</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}
