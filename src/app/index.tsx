import { useEffect, useState } from "react";
import { Dimensions, StatusBar, Text, TextInput, TouchableOpacity, View, FlatList } from "react-native";
import { Link } from "expo-router";
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useApi} from '@/hook/useApi'

import { useNavigation } from '@react-navigation/native';

export default function Home() {
    const [currentLocation, setCurrentLocation] = useState(null);
    const [initialRegion, setInitialRegion] = useState(null);
    const [permissionDenied, setPermissionDenied] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredBusStops, setFilteredBusStops] = useState([]);
    const [showBusStopList, setShowBusStopList] = useState(false); // Estado para exibir a lista de pontos
    

    const [menuVisible, setMenuVisible] = useState(false);
    const navigation = useNavigation();

    const toggleMenu = () => setMenuVisible(!menuVisible);
    
    // Lista de pontos de ônibus
    const [busStops, setBusStopList] = useState([
        {
            id: 1,
            latitude: -24.703849,
            longitude: -48.007183,
            name: "Ponto 1",
            description: "Ponto de Ônibus de teste rua sem saída"
        },
        {
            id: 2,
            latitude: -24.702543,
            longitude: -48.006223,
            name: "Ponto 2",
            description: "Ponto de Ônibus de teste pracinha rodoviária"
        },
        {
            id: 3,
            latitude: -24.703250,
            longitude: -48.005935,
            name: "Ponto 3",
            description: "Ponto de Ônibus próximo à entrada da escola"
        },
        {
            id: 4,
            latitude: -24.704568,
            longitude: -48.006349,
            name: "Ponto 4",
            description: "Ponto de Ônibus em frente à pracinha"
        },
        {
            id: 5,
            latitude: -24.703861,
            longitude: -48.008461,
            name: "Ponto 5",
            description: "Ponto de Ônibus ao lado da padaria"
        },
        {
            id: 6,
            latitude: -24.704549,
            longitude: -48.003767,
            name: "Ponto 6",
            description: "Ponto de Ônibus na esquina da farmácia"
        },
        {
            id: 7,
            latitude: -24.704910,
            longitude: -48.005283,
            name: "Ponto 7",
            description: "Ponto de Ônibus em frente ao supermercado"
        }
    ]);
    
    useEffect(() => {
        const getLocation = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                setPermissionDenied(true);
                console.log("Permissão de acesso à localização negada!");
                return;
            }
        
            let location = await Location.getCurrentPositionAsync({});
            setCurrentLocation(location.coords);
        
            setInitialRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
            });
        };
      
        getLocation();
    }, []);
    
    // Função para buscar pontos de ônibus com base na pesquisa
    const searchBusStops = () => {
        const results = busStops.filter(stop =>
            stop.name.toLowerCase().includes(searchQuery.toLowerCase())
            
        );
        setFilteredBusStops(results);
        

        if (results.length > 0) {
            const { latitude, longitude } = results[0];
            setInitialRegion({
                latitude,
                longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
            });
            
        } else {
            alert("Nenhum ponto encontrado.");
        }
    };

    // Função para focar em um ponto específico no mapa ao clicar na lista
    const focusOnBusStop = (busStop) => {
        setInitialRegion({
            latitude: busStop.latitude,
            longitude: busStop.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
        });
        
        setShowBusStopList(false); // Fecha a lista após selecionar um ponto
        setMenuVisible(!menuVisible);
        
        
    };
      
    return (
        <View className="flex-1 justify-center items-center bg-slate-200 ">
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
            
            {initialRegion && (
                <MapView
                    style={{ flex: 1, width: '100%' }}
                    region={initialRegion}
                    zoomEnabled={true}
                    loadingEnabled={true}
                    showsUserLocation={true}
                    showsMyLocationButton={false}
                >
                    {currentLocation && (
                        <Marker
                            coordinate={{
                                latitude: currentLocation.latitude,
                                longitude: currentLocation.longitude,
                            }}
                            title="Sua Localização"
                        />
                    )}
                    {busStops.map(stop => {
                       return (
                            <Marker
                                
                                key={stop.id}
                                coordinate={{ latitude: stop.latitude, longitude: stop.longitude }}
                                title={stop.name}
                                description={stop.description}
                            />
                       );
                    })}
                </MapView>
            )}
            
            <View className="absolute top-12 left-16 right-4">
                <View className="flex-row items-center bg-sky-100 rounded-full shadow-md px-4 py-1">
                    <TextInput
                        className="flex-1 text-base text-gray-700"
                        placeholder="Busque por um ponto de ônibus"
                        placeholderTextColor="#999"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    <TouchableOpacity onPress={searchBusStops}>
                        <Icon name="search" size={24} color="#4A90E2" />
                    </TouchableOpacity>
                </View>
            </View>

           

            {/* Botão de Menu Hambúrguer */}
            <TouchableOpacity
                onPress={toggleMenu}
                className="absolute top-12 left-4 bg-sky-100 px-4 py-4 rounded-full shadow-md"
            >
                <Text style={{ fontSize: 15 }}>☰</Text>
            </TouchableOpacity>

            {/* Menu lateral */}
            {menuVisible && (
                <View className="absolute top-28 left-4 bg-slate-200 shadow-lg rounded-lg p-4">
                    <TouchableOpacity
                        onPress={() => {
                            setMenuVisible(false);
                        }}
                    >
                        <Link className="text-lg text-blue-500 p-1" href={'http://192.168.86.33:8000/login'}>Login</Link>

                        <Link className="text-lg text-blue-500 p-1" href={'https://wa.me/5513991225846'}>Contato</Link>
                        
                        {/* Link para mostrar a lista de pontos de ônibus */}
                        <TouchableOpacity onPress={() => setShowBusStopList(!showBusStopList)} className="text-lg text-blue-500">
                            <Text className="text-lg text-blue-500 p-1">Ver lista de pontos</Text>
                        </TouchableOpacity>

                        {/* Lista de pontos de ônibus */}
                        {showBusStopList && (
                            <View >
                                <FlatList
                                    data={busStops}
                                    keyExtractor={(item) => item.id.toString()}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity onPress={() => focusOnBusStop(item)} className="p-2 border-b border-gray-200">
                                            <Text className="text-lg text-gray-700 ">{item.name}</Text>
                                        </TouchableOpacity>
                                    )}
                                />
                            </View>
                        )}
                        <Link className="text-lg text-blue-500 p-1" href={'http://192.168.86.33:8000/'}>Página Web</Link>

                        <Link className="text-lg text-blue-500 p-1" href={'http://192.168.86.33:8000/cadastros/cadastro'}>Cadastro</Link>
                    </TouchableOpacity>
                </View>
                )}
                        
            
            <View className="absolute bottom-0 left-0 right-0 bg-sky-100 flex-row justify-around items-center p-4 shadow-lg ">
                <TouchableOpacity  className="items-center">
                    <Icon name="account-balance-wallet" size={24} color="#4A90E2" />
                    <Link href={'/saldo'}>Saldo</Link>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => alert('Rotas Salvas')} className="items-center">
                    <Icon name="bookmark" size={24} color="#4A90E2" />
                    <Text className="text-xs text-gray-700">Pontos Salvos</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => alert('Contato')} className="items-center">
                    <Icon name="contact-mail" size={24} color="#4A90E2" />
                    <Text className="text-xs text-gray-700">Contato</Text>
                </TouchableOpacity>
            </View>
            
        </View>
        
    );
}
