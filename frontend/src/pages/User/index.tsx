import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Container, Button, ButtonText, Subtitle, Title } from "./styles";
import { Image, StyleSheet, View } from "react-native";

export default function User() {
    const navigation = useNavigation();

    return (
        <Container>
            <View style={styles.imageContainer}>
                <Image
                    source={require('../../assets/images/logoVerde.png')}
                    style={styles.image}
                />
            </View>

            <Title>Bem-vindo à tela do usuário</Title>
            <Subtitle>
                Esta tela é exclusivamente para usuários comuns, por isso sua sessão foi encerrada ou você não tem permissão para acessar essa tela de admin.
            </Subtitle>

            <Button onPress={() => (navigation.navigate as any)("Home")}>
                <ButtonText>Sair</ButtonText>
            </Button>
        </Container>
    );
}

const styles = StyleSheet.create({
    imageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
    },
    image: {
        width: 150,
        height: 150,
        resizeMode: 'contain',
    },
});

