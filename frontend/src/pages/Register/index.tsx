import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { TouchableWithoutFeedback, Keyboard } from 'react-native';
import {
    Container,
    PickerContainer,
    Input,
    Label,
    ButtonContainer,
    Button,
    ButtonText,
    Icon,
} from './styles';

export default function Register() {
    const [selectedValue1, setSelectedValue1] = useState('1');
    const [selectedValue2, setSelectedValue2] = useState('');
    const [selectedValue3, setSelectedValue3] = useState('');

    const navigation = useNavigation();

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <Container>
                <Label>[  ] PRONTO ATENDIMENTO</Label>
                <PickerContainer>
                    <Picker
                        selectedValue={selectedValue1}
                        onValueChange={(itemValue) => setSelectedValue1(itemValue)}
                        style={{ width: '100%' }}
                    >
                        <Picker.Item label="ex.. 1" value="1" />
                        <Picker.Item label="2" value="2" />
                        <Picker.Item label="3" value="3" />
                        <Picker.Item label="4" value="4" />
                    </Picker>
                </PickerContainer>

                <Label>[  ] ST DO CLIENTE</Label>
                <Input
                    value={selectedValue2}
                    onChangeText={(text) => setSelectedValue2(text.replace(/[^0-9]/g, ''))}
                    keyboardType="numeric"
                    placeholder="Digite um número"
                />

                <Label>[  ] ZONA DO ALARME</Label>
                <Input
                    value={selectedValue3}
                    onChangeText={(text) => setSelectedValue3(text.replace(/[^0-9]/g, ''))}
                    keyboardType="numeric"
                    placeholder="Digite um número"
                />

                <ButtonContainer>
                    <Button onPress={() => { /* Handle register action */ }}>
                        <Icon name="arrow-forward" size={24} color="#CFC6C6" style={{ marginRight: 8 }} />
                        <ButtonText>REGISTRAR</ButtonText>
                    </Button>

                    <Button onPress={() => navigation.goBack()} style={{ backgroundColor: '#000' }}>
                        <Icon name="arrow-left" size={24} color="#CFC6C6" style={{ marginRight: 8 }} />
                        <ButtonText>VOLTAR</ButtonText>
                    </Button>
                </ButtonContainer>
            </Container>
        </TouchableWithoutFeedback>
    );
}
