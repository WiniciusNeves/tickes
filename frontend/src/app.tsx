import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator  } from '@react-navigation/stack';

import 'react-native-gesture-handler';
import 'react-native-vector-icons';

import Home from './pages/Home';
import Register from './pages/Register';
import Auth from './pages/Auth';

const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
                <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
                <Stack.Screen name="Auth" component={Auth} options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
