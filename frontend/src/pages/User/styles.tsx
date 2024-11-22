import styled from "styled-components/native";

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

export const Title = styled.Text`
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 10px;
`;

export const Subtitle = styled.Text`
    font-size: 16px;
    color: #555;
    margin-bottom: 30px;
    text-align: center;
`;

export const Button = styled.TouchableOpacity`
    background-color: #457547;
    padding-vertical: 12px;
    padding-horizontal: 24px;
    border-radius: 8px;
`;

export const ButtonText = styled.Text`
    color: #fff;
    font-size: 16px;
    font-weight: bold;
`;
