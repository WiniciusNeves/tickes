import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Container, PickerContainer, Input, Label, ButtonContainer, Button, ButtonText } from './styles';

import Icon from 'react-native-vector-icons/FontAwesome5';
export default function Register() {
    const [selectedValue1, setSelectedValue1] = useState('APOIO 1 DIA');
    const [selectedValue2, setSelectedValue2] = useState('');
    const [selectedValue3, setSelectedValue3] = useState('');

    const navigation = useNavigation();

    function handleRegister() {
        
    }
    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <Container>
                    <Label>[  ] PRONTO ATENDIMENTO</Label>
                    <PickerContainer>
                        <Picker
                            selectedValue={selectedValue1}
                            onValueChange={(itemValue) => setSelectedValue1(itemValue)}
                            style={{ width: '100%', height: 50, color: '#A9A9A9' }}
                        >
                            <Picker.Item label="APOIO 1 DIA" value="APOIO 1 DIA" />
                            <Picker.Item label="APOIO 1 NOITE" value="APOIO 1 NOITE" />
                            <Picker.Item label="APOIO 2 DIA" value="APOIO 2 DIA" />
                            <Picker.Item label="APOIO 2 NOITE" value="APOIO 2 NOITE" />
                            <Picker.Item label="APOIO 3 DIA" value="APOIO 3 DIA" />
                            <Picker.Item label="APOIO 3 NOITE" value="APOIO 3 NOITE" />
                            <Picker.Item label="APOIO 4 DIA" value="APOIO 4 DIA" />
                            <Picker.Item label="APOIO 4 NOITE" value="APOIO 4 NOITE" />
                            <Picker.Item label="APOIO 5 DIA" value="APOIO 5 DIA" />
                            <Picker.Item label="APOIO 5 NOITE" value="APOIO 5 NOITE" />
                            <Picker.Item label="APOIO 10" value="APOIO 10" />
                        </Picker>
                    </PickerContainer>

                    <Label>[  ] ST DO CLIENTE</Label>
                    <Input
                        value={selectedValue2}
                        onChangeText={(text) => setSelectedValue2(text)}
                        keyboardType="default"
                        placeholder="Informe o ST do cliente"
                        placeholderTextColor="#A9A9A9"
                    />

                    <Label>[  ] ZONA DO ALARME</Label>
                    <Input
                        value={selectedValue3}
                        onChangeText={(text) => setSelectedValue3(text)}
                        keyboardType="default"
                        placeholder="Informe a zona do alarme"
                        placeholderTextColor="#A9A9A9"
                    />

                    <ButtonContainer>
                        <LinearGradient
                            colors={['#457547', '#002C0B']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={{ height: 60, borderRadius: 12 }}
                        >
                            <Button onPress={() => {handleRegister() }} style={{ backgroundColor: 'transparent' }}>
                            <Icon name="plus" size={20} color="#fff" style={{ marginRight: 10}}/>
                                <ButtonText>REGISTRAR</ButtonText>
                            </Button>
                        </LinearGradient>

                        <Button onPress={() => navigation.goBack()} style={{ backgroundColor: '#000' }}>
                            <Icon name="arrow-left" size={20} color="#fff" style={{ marginRight: 10}}/>
                            <ButtonText>VOLTAR</ButtonText>
                        </Button>
                    </ButtonContainer>
                </Container>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}
