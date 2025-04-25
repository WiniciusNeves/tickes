// styles.js
import styled from 'styled-components/native';


export const Container = styled.View`
    flex: 1;
    background-color: #DFE8E2;
`;

export const Box = styled.View`
    width: 90%;
    background-color: #fff;
    padding: 10px;
    border-radius: 10px;
    margin: 20px;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 350px; 
`;

export const Buttom = styled.TouchableOpacity`
    background-color: #006F45;
    padding: 20px;
    border-radius: 10px;
    width: 80%;
    align-items: center;
    justify-content: center;
    margin: 10px;
`;
export const ButtomText = styled.Text`
    color: #fff;
    font-size: 16px;
    font-weight: bold;
`;