import React from "react";
import { Container, Button, Text } from  "./styles"
import { useNavigation } from "@react-navigation/native";

export default function Home() {
    const { navigate } = useNavigation();
    return (
        <Container>
            <Button onPress={() => navigate("Register")}>
                <Text>Registrar</Text>
            </Button>
            <Button onPress={() => navigate("Login")}>
                <Text>Logar</Text>
            </Button>
        </Container>
    );
}

