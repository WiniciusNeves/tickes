import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { Container, InputContainer, Input, ButtonContainer, Button, ButtonText } from './styles';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import { useNavigation } from '@react-navigation/native';
import { Icon } from 'react-native-vector-icons/Icon';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <Container>
        <InputContainer>
          <Input
            value={email}
            onChangeText={(text) => setEmail(text)}
            placeholder="E-mail"
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor={'#A9A9A9'}
            style={{ flex: 1 }}
          />
          <FontAwesome5 name="envelope" size={20} color="#A9A9A9" style={{ position: 'absolute', right: 10, top: 15 }} />
        </InputContainer>

        <InputContainer>
          <Input
            value={password}
            onChangeText={(text) => setPassword(text)}
            placeholder="Senha"
            secureTextEntry={true}
            autoCapitalize="none"
            placeholderTextColor={'#A9A9A9'}
            style={{ flex: 1 }}
          />
          <FontAwesome5 name="lock" size={20} color="#A9A9A9" style={{ position: 'absolute', right: 10, top: 15 }} />
        </InputContainer>

        <ButtonContainer>
          <LinearGradient
            colors={['#457547', '#002C0B']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ width: '50%', height: 60, borderRadius: 12 }}
          >
            <Button onPress={() => console.log('Entrar')} style={{ backgroundColor: 'transparent' }}>
              <FontAwesome5 name="share" size={20} color="#fff" style={{ marginRight: 10 }} />
              <ButtonText>Entrar</ButtonText>
            </Button>
          </LinearGradient>

          <Button onPress={() => navigation.goBack()} style={{ backgroundColor: '#000' }}>
            <FontAwesome5 name="arrow-left" size={20} color="#fff" style={{ marginRight: 10 }} />
            <ButtonText>Voltar</ButtonText>
          </Button>
        </ButtonContainer>
      </Container>
    </KeyboardAvoidingView>
  );
}