import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import Toast from 'react-native-toast-message';
import { Container, Box, Button, ButtonText, Label, ButtonContainer, Input } from './styles';
import Icon from 'react-native-vector-icons/FontAwesome';
import { createTicket } from '../../api/ticketsService';
import { Text, View, Image } from 'react-native';


const areaToPeopleMap = {
  'AREA 1': ['RICARDO', 'ENIO', 'TREINAMENTO'],
  'AREA 2': ['PAZETTE', 'DAVID', 'ALISSON', 'JONATA', 'RODRIGUES', 'TREINAMENTO'],
  'AREA 3': ['ADILSON', 'JEFFERSON', 'GUILHERME', 'JAISSON', 'TREINAMENTO'],
  'AREA 4': ['ROSSATO', 'VITOR', 'PATRIC', 'RODRIGUES', 'GELSON', 'TREINAMENTO'],
  'AREA 5': ['CARABOTTA', 'DAVID', 'CLAIRTON', 'JONATAN', 'RODRIGUES', 'TREINAMENTO'],
  'AREA 10': ['RODRIGO ROSA', 'JEFERSON', 'GABRIEL', 'MARCELO', 'GIOVANE', 'FELIPE', 'RODRIGO BRUM'],
};

export default function Register() {
  const [selectedValue1, setSelectedValue1] = useState('');
  const [selectedValue2, setSelectedValue2] = useState('');
  const [selectedValue3, setSelectedValue3] = useState('');
  const [selectedValue4, setSelectedValue4] = useState('');
  const [filteredPeople, setFilteredPeople] = useState([]);

  const navigation = useNavigation();

  useEffect(() => {
    setFilteredPeople(areaToPeopleMap[selectedValue1] || []);
    setSelectedValue4('');
  }, [selectedValue1]);

  function handleRegister() {
    if (!selectedValue2 || !selectedValue3 || !selectedValue4) {
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
    <Container>
      <View style={{ flex: 1 }}>

        <View style={{ flex: 2, backgroundColor: "#006F45", width: 800 }}>
          <Image
            source={require('../../assets/images/Bem_vindo_ao_RAPA_1.png')}
            style={{ width: 161, height: 35, alignSelf: 'center', marginTop: 50 }}
          />
          <Image
            source={require('../../assets/images/Registro_de_ocorrencia.png')}
            style={{
              width: 260, height: 20, alignSelf: 'center', marginTop: 30 

            }}
          />
        </View>


        <View style={{ flex: 4, backgroundColor: "#DFE8E2", }} >
          <Box style={{ backgroundColor: "#fff", width: 380, alignSelf: 'center', justifyContent: 'center', position: 'absolute', top: -125, borderRadius: 10 }}>
            <Label>Area do pronto atendimento</Label>
            <View style={{ borderWidth: 1, borderColor: '#006F45', borderRadius: 10, overflow: 'hidden', marginBottom: 20 }}>
              <Picker
                selectedValue={selectedValue1}
                onValueChange={(itemValue) => setSelectedValue1(itemValue)}
                style={{ width: 340, height: 50, color: '#006F45' }}
                dropdownIconColor="#006F45"
              >
                <Picker.Item label="Selecione uma área" value="" />
                {Object.keys(areaToPeopleMap).map((area) => (
                  <Picker.Item key={area} label={area} value={area} />
                ))}
              </Picker>
            </View>
            <Label>Nome do atendente</Label>
            <View style={{ borderWidth: 1, borderColor: '#006F45', borderRadius: 10, overflow: 'hidden', marginBottom: 20 }}>
              <Picker
                selectedValue={selectedValue4}
                onValueChange={(itemValue) => setSelectedValue4(itemValue)}
                style={{ width: 340, height: 50, color: '#006F45' }}
                dropdownIconColor="#006F45"
              >
                <Picker.Item label="Selecione um atendente" value="" />
                {filteredPeople.map((person) => (
                  <Picker.Item key={person} label={person} value={person} />
                ))}
              </Picker>
            </View>

            <Label>ST Cliente</Label>

            <Input
              value={selectedValue2}
              onChangeText={handleNumericInput(setSelectedValue2)}
              keyboardType="numeric"
              placeholder="Informe o ST do cliente"
              placeholderTextColor="#006F45"
            />

            <Label>Zona de Alarme</Label>
            <Input
              value={selectedValue3}
              onChangeText={handleNumericInput(setSelectedValue3)}
              keyboardType="numeric"
              placeholder="Informe a zona do alarme"
              placeholderTextColor="#006F45"
            />
          </Box>
          <ButtonContainer style={{ position: 'absolute', top: 380, alignSelf: 'center' }}>
            <Button onPress={handleRegister} style={{ backgroundColor: '#006F45', width: 380, marginTop: 20 }}>
              <Icon name="plus" size={20} color="#fff" style={{ marginRight: 10 }} />
              <ButtonText>REGISTRAR</ButtonText>
            </Button>


            <Button onPress={() => navigation.goBack()} style={{ backgroundColor: '#c8c8c8', width: 380, marginTop: 20, borderWidth: 1, borderColor: '#006F45' }}>
              <Icon name="arrow-left" size={20} color="#000" style={{ marginRight: 10 }} />
              <ButtonText style={{ color: '#000' }}>VOLTAR</ButtonText>
            </Button>
          </ButtonContainer>

        </View>
      </View>
    </Container>
  );
}

