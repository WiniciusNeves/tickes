// Home.js
import React from 'react';
import { Container, GradientButton, ButtonText, ButtonGradient } from "./styles";
import { useNavigation } from "@react-navigation/native";

export default function Home() {
    const navigation = useNavigation();
    return (
        <Container>
            <GradientButton onPress={() => navigation.navigate('Register')}>
                <ButtonGradient>
                    <ButtonText>Registrar</ButtonText>
                </ButtonGradient>
            </GradientButton>

            <GradientButton onPress={() => navigation.navigate('Auth')}>
                <ButtonGradient>
                    <ButtonText>Entrar</ButtonText>
                </ButtonGradient>
            </GradientButton>
        </Container>
    );
}
