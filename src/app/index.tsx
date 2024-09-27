import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';


export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (email === '' || password === '') {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
    } else {
      Alert.alert('Sucesso', `Email: ${email}\nSenha: ${password}`);
    }
  };

  return (
    
      <View className="flex-1 justify-center items-center bg-gray-100 p-6">
        <Text className="text-4xl font-bold text-blue-600 mb-10">Login</Text>

        {/* Campo de Email */}
        <TextInput
          className="border border-gray-300 rounded-lg w-full p-4 mb-4 bg-white"
          placeholder="Digite seu e-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* Campo de Senha */}
        <TextInput
          className="border border-gray-300 rounded-lg w-full p-4 mb-6 bg-white"
          placeholder="Digite sua senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
          autoCapitalize="none"
        />

        {/* Botão de Login */}
        <TouchableOpacity className="bg-blue-500 p-4 rounded-lg w-full" onPress={handleLogin}>
          <Text className="text-white text-center text-lg">Entrar</Text>
        </TouchableOpacity>

        {/* Esqueceu a Senha */}
        <TouchableOpacity className="mt-4" onPress={() => Alert.alert('Esqueceu a senha', 'Link para recuperar senha')}>
          <Text className="text-blue-500">Esqueceu sua senha?</Text>
        </TouchableOpacity>
      </View>
    
  );
}
