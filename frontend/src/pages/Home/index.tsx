import React from "react";
import { Container, Text } from  "./styles"
import { useNavigation } from "@react-navigation/native";

export default function Home() {
    const { navigate } = useNavigation();
    return (
        <Container>
            <Text>Home</Text> 
        </Container>
    );
}
