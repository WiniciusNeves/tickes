import React from "react";
import { Text, View, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import { Container, Box, Buttom, ButtomText } from "./styles";



export default function Home() {
    const navigation = useNavigation();
    return (
        <Container>
            <Image
                source={require('../../assets/images/fundo.png')}
                style={{ width: 500, height: 400, position: 'absolute', top: 0, left: 0 }}   
            />
            <Image
                source={require('../../assets/images/Bem_vindo_ao_RAPA.png')}
                style={{width: 221, height: 170, marginTop: 10, marginLeft: 10, position: 'absolute', top: 50, left: "25%"}}
            />
            <Box>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#8D8D8D', margin: 10 }}>Escolha uma das opções abaixo</Text>
                <Buttom onPress={() => navigation.navigate("Register")}>
                    <ButtomText>Registro de ocorrência</ButtomText>
                </Buttom>
                <Buttom onPress={() => navigation.navigate("Auth")}>
                    <ButtomText>Acessar painel</ButtomText>
                </Buttom>

            </Box>
            <Image
                source={require('../../assets/images/Ativo_8.png')}
                style={{ width: 132, height: 12, position: 'absolute', bottom: 25, left: 140 }}
            />
        </Container>

    );
}