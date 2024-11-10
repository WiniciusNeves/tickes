import styled from "styled-components/native";
import Icon from 'react-native-vector-icons/FontAwesome';

export const Icone = styled(Icon)`
    color: #000;
    font-size: 40px;
`;

export const Container = styled.View`
    flex: 1;
    align-items: center;
    justify-content: center;
    margin: 10px;
    border-radius: 24px;
    border: 2px solid #CFC6C6;
    padding: 20px;
    background-color: #F3F3F3;
`;

export const ButtonContainer = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 15%;
    margin: 20px;
`;

export const Button = styled.TouchableOpacity`
    background-color: #5e50ff;
    padding: 10px 20px;
    border-radius: 12px;
    align-items: center;
    justify-content: center;
    flex: 1;
    margin: 5px;
`;

export const ButtonText = styled.Text`
    font-size: 24px;
    font-weight: bold;
    color: #CFC6C6;
`;

export const InputContainer = styled.View`
    flex-direction: row;
    align-items: center;
    border-width: 1px;
    border-color: #CFC6C6;
    border-radius: 8px;
    padding: 10px;
    margin: 10px 0;
    width: 100%;
    background-color: #fff;
`;

export const Input = styled.TextInput`
    flex: 1;
    height: 40px;
    font-size: 16px;
    color: #333;
    margin-left: 10px;
`;

