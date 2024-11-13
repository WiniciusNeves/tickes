// styles.js
import styled from 'styled-components/native';
import { LinearGradient } from 'react-native-linear-gradient'; // Usar expo-linear-gradient se estiver no Expo
import { TouchableOpacity } from 'react-native';

export const Container = styled.View`
    flex: 1;
    align-items: center;
    justify-content: center;
    margin: 10px;
    border-radius: 24px;
    border: 2px solid #CFC6C6;
`;

export const ButtonText = styled.Text`
    font-size: 24px;
    font-weight: bold;
    color: #CFC6C6;
`;

// Ajuste o botão para garantir que o toque seja capturado
export const GradientButton = styled(TouchableOpacity).attrs({
    activeOpacity: 0.8,
})`
    width: 82%;
    height: 70px;
    border-radius: 4px;
    align-items: center;
    justify-content: center;
    margin: 40px;
    background-color: transparent;
`;

export const ButtonGradient = styled(LinearGradient).attrs({
    colors: ['#6F71EE', '#3F4188'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 0 },
})`
    flex: 1;
    width: 100%;
    height: 100%;
    border-radius: 4px;
    align-items: center;
    justify-content: center;
`;
