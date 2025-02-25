import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-toast-message';
import { Container, PickerContainer, Input, Label, ButtonContainer, Button, ButtonText } from './styles';
import { createTicket } from '../../api/ticketsService';
import Icon from 'react-native-vector-icons/FontAwesome5';

export default function Register() {
  const [selectedValue1, setSelectedValue1] = useState('APOIO 1 DIA');
  const [selectedValue2, setSelectedValue2] = useState('');
  const [selectedValue3, setSelectedValue3] = useState('');
  const [selectedValue4, setSelectedValue4] = useState('');

  const navigation = useNavigation();

  function handleRegister() {
    if (!selectedValue2 || !selectedValue3) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Por favor, preencha todos os campos.',
      });
      return;
    }

    const ticketData = {
      stCliente: selectedValue2,
      zonaAlarme: selectedValue3,
      prontoAtendimento: selectedValue1,
      name: selectedValue4,
    };

    createTicket(ticketData)
      .then(() => {
        Toast.show({
          type: 'success',
          text1: 'Sucesso',
          text2: 'Ticket registrado com sucesso!',
        });
        setTimeout(() => {
          navigation.goBack();
        }, 2000);
      })
      .catch((error) => {
        console.error(error);
        Toast.show({
          type: 'error',
          text1: 'Erro',
          text2: 'Ocorreu um erro ao registrar o ticket.',
        });
      });
  }

  const handleNumericInput = (setter) => (text) => {
    const numericText = text.replace(/\D/g, '');
    setter(numericText);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>
          <Label style={styles.label}>[  ] PRONTO ATENDIMENTO</Label>
          <PickerContainer>
            <Picker
              selectedValue={selectedValue1}
              onValueChange={(itemValue) => setSelectedValue1(itemValue)}
              style={styles.picker}
            >
              {[
                'APOIO 1 DIA', 'APOIO 1 NOITE', 'APOIO 2 DIA', 'APOIO 2 NOITE',
                'APOIO 3 DIA', 'APOIO 3 NOITE', 'APOIO 4 DIA', 'APOIO 4 NOITE',
                'APOIO 5 DIA', 'APOIO 5 NOITE', 'APOIO 10',
              ].map((value) => (
                <Picker.Item key={value} label={value} value={value} />
              ))}
            </Picker>
          </PickerContainer>

          <Label style={styles.label}>[  ] ST DO CLIENTE</Label>
          <Input
            value={selectedValue2}
            onChangeText={handleNumericInput(setSelectedValue2)}
            keyboardType="numeric"
            placeholder="Informe o ST do cliente"
            placeholderTextColor="#A9A9A9"
          />

          <Label style={styles.label}>[  ] ZONA DO ALARME</Label>
          <Input
            value={selectedValue3}
            onChangeText={handleNumericInput(setSelectedValue3)}
            keyboardType="numeric"
            placeholder="Informe a zona do alarme"
            placeholderTextColor="#A9A9A9"
          />

          <Label style={styles.label}>[  ] Nome</Label>
          <PickerContainer>
            <Picker
              selectedValue={selectedValue4}
              onValueChange={(itemValue) => setSelectedValue4(itemValue)}
              style={styles.picker}
            >
              {[
                'JEFFERSON',
                'ROSSATO',
                'CARABOTA',
                'PAZETTE',
                'JAISSON',
                'GUILHERME',
              ].map((value) => (
                <Picker.Item key={value} label={value} value={value} />
              ))}
            </Picker>
          </PickerContainer>
          
          <ButtonContainer>
            <LinearGradient
              colors={['#457547', '#002C0B']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientButton}
            >
              <Button onPress={handleRegister} style={{ backgroundColor: 'transparent' }}>
                <Icon name="plus" size={20} color="#fff" style={styles.icon} />
                <ButtonText>REGISTRAR</ButtonText>
              </Button>
            </LinearGradient>

            <Button onPress={() => navigation.goBack()} style={styles.backButton}>
              <Icon name="arrow-left" size={20} color="#fff" style={styles.icon} />
              <ButtonText>VOLTAR</ButtonText>
            </Button>
          </ButtonContainer>
        </Container>
      </TouchableWithoutFeedback>
      <Toast />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  label: {
    marginBottom: 8,
    marginTop: 16,
  },
  picker: {
    width: '100%',
    height: 50,
    color: '#A9A9A9',
  },
  gradientButton: {
    height: 60,
    borderRadius: 12,
  },
  backButton: {
    backgroundColor: '#000',
    marginTop: 16,
  },
  icon: {
    marginRight: 10,
  },
});
