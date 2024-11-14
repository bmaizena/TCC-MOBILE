import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, StatusBar } from 'react-native';

const SaldoPage = () => {
  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        
        {/* Saldo Atual */}
        <View className="bg-white p-6 mt-6 rounded-lg shadow-md mb-5">
          <Text className="text-gray-600 text-lg">Saldo Atual</Text>
          <Text className="text-3xl font-bold text-green-600 mt-2">R$ 25,00</Text>
        </View>

        {/* Formas de Pagamento */}
        <View className="bg-white p-6 rounded-lg shadow-md mb-5">
          <Text className="text-gray-600 text-lg mb-4">Formas de Pagamento</Text>
          
          <TouchableOpacity className="bg-blue-500 p-4 rounded-lg mb-3">
            <Text className="text-white text-center">Cartão de Crédito</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="bg-blue-500 p-4 rounded-lg mb-3">
            <Text className="text-white text-center">Pix</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="bg-blue-500 p-4 rounded-lg">
            <Text className="text-white text-center">Boleto Bancário</Text>
          </TouchableOpacity>
        </View>

        {/* Reabastecer Passe Mensal */}
        <View className="bg-white p-6 rounded-lg shadow-md">
          <Text className="text-gray-600 text-lg mb-4">Reabastecer Passe Mensal</Text>
          
          <TouchableOpacity className="bg-green-500 p-4 rounded-lg">
            <Text className="text-white text-center text-lg font-semibold">
              Recarregar Passe Mensal
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SaldoPage;
