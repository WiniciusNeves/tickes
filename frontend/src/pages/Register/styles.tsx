import styled from 'styled-components/native';

export const Container = styled.View`
    flex: 1;
    align-items: center;
    justify-content: center;
`;

export const Box = styled.View`
    width: 90%;
    background-color: #fff;
    border-radius: 10px;
    padding: 20px;
    margin-bottom: 20px;
    juastify-content: center;
  

`;


export const Label = styled.Text`
    font-size: 16px;
    margin-top: 10px;
    margin-bottom: 10px;
    font-weight: bold;
    color: #006F45;
    text-align: fleft-start;
`;

export const Input = styled.TextInput`
    width: 100%;
    height: 50px;
    border-radius: 5px;
    border: 1px solid #006F45;
    padding: 10px;
    margin-bottom: 20px;
`;

export const Button = styled.TouchableOpacity`
    background-color: #006F45;
    padding: 15px;
    border-radius: 5px;
    align-items: center;
    justify-content: center;
    flex-direction: row;
`;

export const ButtonText = styled.Text`
    color: #fff;
    font-size: 16px;
    font-weight: bold;
`;

export const ButtonContainer = styled.View`
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
`;



