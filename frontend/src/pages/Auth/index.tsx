import React, { useState, useEffect } from 'react';
import { KeyboardAvoidingView, Platform, Image, StyleSheet, View } from 'react-native';
import { Container, InputContainer, Input, ButtonContainer, Button, ButtonText } from './styles';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useNavigation, CommonActions } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import auth from '@react-native-firebase/auth';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const idTokenResult = await user.getIdTokenResult();
          const userRole = idTokenResult.claims.role;

          if (userRole === 'admin') {
            navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'Admin' }] }));
          } else if (userRole === 'user') {
            navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'User' }] }));
          } else {
            Toast.show({ type: 'error', text1: 'Acesso negado!', text2: 'Você não tem permissão.' });
            auth().signOut();
          }
        } catch (error) {
          Toast.show({ type: 'error', text1: 'Erro ao verificar usuário.', text2: error.message });
        }
      }
      setIsAuthChecked(true);
    });

    return () => unsubscribe();
  }, [navigation]);

  function handleLogin() {
    if (!email || !password) {
      Toast.show({ type: 'error', text1: 'Campos obrigatórios', text2: 'Preencha e-mail e senha.' });
      return;
    }

    auth()
      .signInWithEmailAndPassword(email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        const idTokenResult = await user.getIdTokenResult();
        const userRole = idTokenResult.claims.role;

        if (userRole === 'admin') {
          navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'Admin' }] }));
        } else if (userRole === 'user') {
          navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'User' }] }));
        } else {
          Toast.show({ type: 'error', text1: 'Acesso negado!', text2: 'Sem permissão.' });
          auth().signOut();
        }

        Toast.show({ type: 'success', text1: 'Login bem-sucedido!', text2: 'Bem-vindo!' });
      })
      .catch((error) => {
        let errorMessage = 'Verifique suas credenciais.';
        if (error.code === 'auth/user-not-found') errorMessage = 'Usuário não encontrado.';
        else if (error.code === 'auth/wrong-password') errorMessage = 'Senha incorreta.';
        else if (error.code === 'auth/invalid-credentials') errorMessage = 'Credenciais inválidas.';

        Toast.show({ type: 'error', text1: 'Falha no Login!', text2: errorMessage });
      });
  }

  if (!isAuthChecked) return null; // Evita navegação prematura antes da verificação

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <Container>
        <View style={styles.imageContainer}>
          <Image source={require('../../assets/images/logoVerde.png')} style={styles.image} />
        </View>

        <InputContainer>
          <Input
            value={email}
            onChangeText={setEmail}
            placeholder="E-mail"
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#A9A9A9"
            style={{ flex: 1 }}
          />
          <FontAwesome5 name="envelope" size={20} color="#A9A9A9" style={styles.icon} />
        </InputContainer>

        <InputContainer>
          <Input
            value={password}
            onChangeText={setPassword}
            placeholder="Senha"
            secureTextEntry
            autoCapitalize="none"
            placeholderTextColor="#A9A9A9"
            style={{ flex: 1 }}
          />
          <FontAwesome5 name="lock" size={20} color="#A9A9A9" style={styles.icon} />
        </InputContainer>

        <ButtonContainer>
          <LinearGradient colors={['#457547', '#002C0B']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.gradientButton}>
            <Button onPress={handleLogin} style={{ backgroundColor: 'transparent' }}>
              <FontAwesome5 name="share" size={20} color="#fff" style={styles.icon} />
              <ButtonText>Entrar</ButtonText>
            </Button>
          </LinearGradient>

          <Button onPress={() => navigation.goBack()} style={{ ...styles.backButton }}>
            <FontAwesome5 name="arrow-left" size={20} color="#fff" style={styles.icon} />
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
  icon: {
    position: 'absolute',
    right: 10,
    top: 15,
  },
  gradientButton: {
    width: '50%',
    height: 60,
    borderRadius: 12,
  },
  backButton: {
    backgroundColor: '#000',
    marginTop: 16,
    width: '40%',

  },
});