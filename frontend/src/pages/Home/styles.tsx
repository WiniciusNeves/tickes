import styled from "styled-components/native";
import { LinearGradient } from "react-native-linear-gradient";

export const Container = styled.View`
    flex: 1;

    align-items: center;
    justify-content: center;
    margin: 10px;
    border-radius: 24px;
    border: 2px solid #CFC6C6;

`;

export const Text = styled.Text`
    font-size: 24px;
    font-weight: bold;
    color: #CFC6C6;
`;

export const Button = styled(LinearGradient).attrs({
    colors: ["#6F71EE", "#3F4188"],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 0 },
})`
    width: 82%;
    height: 70px;
    border-radius: 4px;
    align-items: center;
    justify-content: center;
    margin: 40px;
`;

