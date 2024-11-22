import React, { useState, useEffect } from 'react';
import { View, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Para navegação

const LoadingScreen = () => {
    const [isLoading, setIsLoading] = useState(true);
    const navigation = useNavigation(); // Hook de navegação

    // Simula um delay para carregar a tela
    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false); // Depois de 3 segundos, esconde o carregamento
            (navigation.navigate as any)('Home'); // Navega para a tela Home
        }, 4000); // 3 segundos de carregamento
    }, []);

    return (
        <View style={styles.container}>
            {isLoading ? (
                <View style={styles.loaderContainer}>
                    {/* Substitua o caminho da imagem com a sua imagem */}
                    <Image
                        source={require('../../assets/images/logoVerde.png')}
                        style={styles.image}
                    />
                    <ActivityIndicator size="large" color="#00ff00" />
                </View>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    loaderContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 150,
        height: 150,
        marginBottom: 40,
    },
});

export default LoadingScreen;

