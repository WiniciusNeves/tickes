import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Image, StyleSheet, View } from 'react-native';
import { Container, InputContainer, Input, ButtonContainer, Button, ButtonText } from './styles';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import auth from '@react-native-firebase/auth';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  function handleLogin() {
    if (!email || !password) {
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Campos obrigatórios',
        text2: 'Preencha o e-mail e a senha.',
      });
      return;
    }

    auth()
      .signInWithEmailAndPassword(email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        const idTokenResult = await user.getIdTokenResult();

        const userRole = idTokenResult.claims.role;

        if (userRole === 'admin') {
          (navigation.navigate as any)('Admin')
        } else if (userRole === 'user') {
          (navigation.navigate as any)('User')
        } else {
          Toast.show({
            type: 'error',
            position: 'top',
            text1: 'Acesso negado!',
            text2: 'Você não tem permissão para acessar o sistema.',
          });
          auth().signOut();
        }

        Toast.show({
          type: 'success',
          position: 'top',
          text1: 'Login bem-sucedido!',
          text2: 'Você foi autenticado com sucesso.',
        });
      })
      .catch((error) => {
        let errorMessage = 'Verifique suas credenciais.';
        if (error.code === 'auth/user-not-found') {
          errorMessage = 'Usuário não encontrado.';
        } else if (error.code === 'auth/wrong-password') {
          errorMessage = 'Senha incorreta.';
        } else if (error.code === 'auth/invalid-credentials') {
          errorMessage = 'Credenciais inválidas. Verifique seu e-mail e senha.';
        }

        Toast.show({
          type: 'error',
          position: 'top',
          text1: 'Falha no Login!',
          text2: errorMessage,
        });
      });
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <Container>
        <View style={styles.imageContainer}>
          <Image
            source={require('../../assets/images/logoVerde.png')}
            style={styles.image}
          />
        </View>

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
            <Button onPress={handleLogin} style={{ backgroundColor: 'transparent' }}>
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

      <Toast />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
});
