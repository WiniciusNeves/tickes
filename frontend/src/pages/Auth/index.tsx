import React, { useState } from 'react';
import { Container, InputContainer, Input, ButtonContainer, Button, ButtonText} from './styles';
import { useNavigation } from '@react-navigation/native';

export default function Auth() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();

    return (
        <Container>
            <InputContainer>

                <Input
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                    placeholder="E-mail"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={{ flex: 1 }}
                />
            </InputContainer>


            <InputContainer>

                <Input
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                    placeholder="Senha"
                    secureTextEntry={true}
                    autoCapitalize="none"
                    style={{ flex: 1 }}
                />
            </InputContainer>

            <ButtonContainer>
                <Button onPress={() => navigation.goBack()} style={{ marginRight: 10, backgroundColor: '#000' }}>
                    <ButtonText>Voltar</ButtonText>
                </Button>
                <Button onPress={() => console.log('Entrar')}>
                    <ButtonText>Entrar</ButtonText>
                </Button>
            </ButtonContainer>
        </Container>
    );
}


