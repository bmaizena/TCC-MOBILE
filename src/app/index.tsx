import { useEffect, useState } from "react";
import { Dimensions, StatusBar, Text, TextInput, TouchableOpacity, View, FlatList, Animated } from "react-native";
import { Link } from "expo-router";
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useApi} from '../../hooks/useApi';


import { useNavigation } from '@react-navigation/native';

export default function Home() {
    const [currentLocation, setCurrentLocation] = useState(null);
    const [initialRegion, setInitialRegion] = useState(null);
    const [permissionDenied, setPermissionDenied] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredBusStops, setFilteredBusStops] = useState([]);
    const [showBusStopList, setShowBusStopList] = useState(false); // Estado para exibir a lista de pontos
    const [bottomSheetHeight] = useState(new Animated.Value(0)); // Altura da aba inferior
    const [selectedBusStop, setSelectedBusStop] = useState(null); // Ponto de ônibus selecionado
    const [showSavedStops, setShowSavedStops] = useState(false); // Exibir pontos salvos ou não
    const [savedBusStops, setSavedBusStops] = useState([]); // Lista de pontos salvos
    

    const [menuVisible, setMenuVisible] = useState(false);
    const navigation = useNavigation();

    const toggleMenu = () => setMenuVisible(!menuVisible);
    
    // Lista de pontos de ônibus
    const [busStops, setBusStopList] = useState([]);
    const api = useApi();

    async function getPontos(){
        const pontos = await api.listAll();
        setBusStopList(pontos);
    }

    useEffect(() => {
        getPontos();
    }, []);
    
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

    // Exibe ou oculta a aba inferior com os pontos salvos
    const toggleSavedStopsSheet = () => {
        if (showSavedStops) {
            // Fecha a aba de pontos salvos
            setShowSavedStops(false);
        } else {
            // Mostra a aba de pontos salvos e esconde a aba de informações do ponto
            setShowSavedStops(true);
            setSelectedBusStop(null);
        }
        Animated.timing(bottomSheetHeight, {
            toValue: showSavedStops ? 0 : 300, // Mostra a aba (300px) ou oculta (0px)
            duration: 300,
            useNativeDriver: false,
        }).start();
    };

    // Exibe ou oculta a aba inferior com informações do ponto
    const toggleBottomSheet = (busStop) => {
        if (busStop) {
            // Mostra a aba de informações do ponto e esconde a de pontos salvos
            setSelectedBusStop(busStop);
            setShowSavedStops(false);
        } else {
            // Fecha a aba de informações do ponto
            setSelectedBusStop(null);
        }
        Animated.timing(bottomSheetHeight, {
            toValue: busStop ? 455 : 0, // Define a altura da aba (350px ou 0)
            duration: 300,
            useNativeDriver: false,
        }).start();
    };

    const saveBusStop = () => {
        // Verifica se o ponto já está salvo
        if (!savedBusStops.some(stop => stop.id === selectedBusStop.id)) {
            setSavedBusStops([...savedBusStops, selectedBusStop]);
            alert("Ponto salvo com sucesso!");
        } else {
            alert("Esse ponto já está salvo.");
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
                                onPress={() => toggleBottomSheet(stop)}
                                
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
                                        <TouchableOpacity onPress={() => {focusOnBusStop(item); toggleBottomSheet(item);}} className="p-2 border-b border-gray-200">
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
                        
         {selectedBusStop && (
            <Animated.View
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: bottomSheetHeight,
                    backgroundColor: "#b6cddc",
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    padding: 16,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: -2 },
                    shadowOpacity: 0.3,
                    shadowRadius: 5,
                }}
            >
                <Text className="text-lg font-bold mb-2">{selectedBusStop.name}</Text>
                <Text className="text-gray-600">{selectedBusStop.description}</Text>
                <Text className="mt-4 font-semibold">Previsão de Chegada:</Text>
                <Text className="text-gray-700">{selectedBusStop.arrivalPrediction}</Text>
                <Text className="mt-4 font-semibold">Previsão de Saída:</Text>
                <Text className="text-gray-700">{selectedBusStop.departurePrediction}</Text>
                <Text className="mt-4 font-semibold">Horários:</Text>
                <Text className="text-gray-700">{selectedBusStop.schedules.join(", ")}</Text>
                <Text className="mt-4 font-semibold">Valor da Passagem:</Text>
                <Text className="text-gray-700">{selectedBusStop.fare}</Text>

                {/* Botão para salvar o ponto */}
                <TouchableOpacity
                    onPress={saveBusStop}
                    className="mt-4 bg-blue-500 px-4 py-2 rounded-md"
                >
                    <Text className="text-white text-center">Salvar Ponto</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => toggleBottomSheet(null)}
                    className="absolute top-4 right-4"
                >
                    <Icon name="close" size={24} color="#333" />
                </TouchableOpacity>
            </Animated.View>
        )}

        {showSavedStops && (
            <Animated.View
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: bottomSheetHeight,
                    backgroundColor: "#b6cddc",
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    padding: 16,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: -2 },
                    shadowOpacity: 0.3,
                    shadowRadius: 5,
                }}
            >
                <Text className="text-lg font-bold mb-2">Meus Pontos Salvos</Text>
                {savedBusStops.length > 0 ? (
                    <FlatList
                        data={savedBusStops}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <View className="border-b border-gray-200 py-2">
                                <Text className="text-gray-700 font-semibold">{item.name}</Text>
                                <Text className="text-gray-500">{item.description}</Text>
                            </View>
                        )}
                    />
                ) : (
                    <Text className="text-gray-600">Nenhum ponto salvo ainda.</Text>
                )}
                <TouchableOpacity
                    onPress={toggleSavedStopsSheet}
                    className="absolute top-4 right-4"
                >
                    <Icon name="close" size={24} color="#333" />
                </TouchableOpacity>
            </Animated.View>
        )}

        )}

            
            <View className="absolute bottom-0 left-0 right-0 bg-sky-100 flex-row justify-around items-center p-4 shadow-lg ">
                <TouchableOpacity  className="items-center">
                    <Icon name="account-balance-wallet" size={24} color="#4A90E2" />
                    <Link href={'/saldo'}>Saldo</Link>
                </TouchableOpacity>

                <TouchableOpacity onPress={toggleSavedStopsSheet} className="items-center">
                    <Icon name="bookmark" size={24} color="#4A90E2" />
                    <Text>Pontos Salvos</Text>
                </TouchableOpacity>

                <TouchableOpacity className="items-center">
                    <Icon name="contact-mail" size={24} color="#4A90E2" />
                    <Link href={'https://wa.me/5513991225846'}>Contato</Link>
                </TouchableOpacity>
            </View>
            {/* Aba inferior */}
            
            
        </View>
        
    );
}
