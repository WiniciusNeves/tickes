import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import auth from '@react-native-firebase/auth';

import LoadingScreen from './pages/Loading';
import HomeScreen from './pages/Home';
import AdminScreen from './pages/Admin';
import UserScreen from './pages/User';
import AuthScreen from './pages/Auth';
import RegisterScreen from './pages/Register';
import ToastComponent from './components/ToastComponent';

const Stack = createStackNavigator();

export default function App() {
  const [userRole, setUserRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async (user) => {
      if (user) {
        setIsAuthenticated(true);
        const idTokenResult = await user.getIdTokenResult();
        setUserRole(idTokenResult.claims.role || 'user');
      } else {
        setIsAuthenticated(false);
        setUserRole(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Loading">
        <Stack.Screen
          name="Loading"
          component={LoadingScreen}
          options={{ headerShown: false }}
        />
        
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />

        {/* Caso o usuário queira fazer login */}
        <Stack.Screen
          name="Auth"
          component={AuthScreen}
          options={{ headerShown: false }}
        />

        {/* Caso o usuário queira registrar um ticket */}
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />

        {/* Quando o usuário já está autenticado, ele pode acessar suas telas */}
        {isAuthenticated && userRole === 'admin' && (
          <Stack.Screen
            name="Admin"
            component={AdminScreen}
            options={{ headerShown: false }}
          />
        )}

        {isAuthenticated && userRole !== 'admin' && (
          <Stack.Screen
            name="User"
            component={UserScreen}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>

      <ToastComponent />
    </NavigationContainer>
  );
}
