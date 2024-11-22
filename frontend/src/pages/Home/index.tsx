import React from 'react';
import { Container, GradientButton, ButtonText, ButtonGradient } from './styles';
import { useNavigation } from '@react-navigation/native';
import { Image, StyleSheet, View } from 'react-native';

export default function Home() {
    const navigation = useNavigation();

    return (
        <Container>
            <View style={styles.imageContainer}>
                <Image 
                    source={require('../../assets/images/logoVerde.png')}
                    style={styles.image}
                />
            </View>

            <GradientButton onPress={() => (navigation.navigate as any)('Register')}>
                <ButtonGradient colors={['#457547', '#002C0B']}>
                    <ButtonText>Registrar</ButtonText>
                </ButtonGradient>
            </GradientButton>

            <GradientButton onPress={() => (navigation.navigate as any)('Auth')}>
                <ButtonGradient colors={['#457547', '#002C0B']}>
                    <ButtonText>Entrar</ButtonText>
                </ButtonGradient>
            </GradientButton>
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
        width: 200,
        height: 200,
        resizeMode: 'contain',
    },
});

