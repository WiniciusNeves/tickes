import styled from 'styled-components/native';

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

export const Label = styled.Text`
    font-size: 24px;
    font-weight: bold;
    color: #457547;
    margin-bottom: 10px;
`;

export const PickerContainer = styled.View`
    width: 100%;
    margin-vertical: 10px;
    border-width: 1px;
    border-color: #CFC6C6;
    border-radius: 10px;
    background-color: #FFF;
`;

export const Input = styled.TextInput`
    width: 100%;
    height: 50px;
    border-width: 1px;
    border-color: #CFC6C6;
    border-radius: 10px;
    padding-left: 10px;
    margin-vertical: 10px;
    background-color: #FFF;
    font-size: 16px;
`;

export const ButtonContainer = styled.View`
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 16%;
    margin: 20px;
`;

export const Button = styled.TouchableOpacity`
    background-color: #5e50ff;
    padding: 10px 20px;
    border-radius: 12px;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    flex: 1;
    margin: 5px;
`;

export const ButtonText = styled.Text`
    font-size: 24px;
    font-weight: bold;
    color: #fff;
`;

export const ButtonGradient = styled.View`
    background-color: #5e50ff;
    padding: 10px 20px;
    border-radius: 12px;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    flex: 1;
    margin: 5px;
`;