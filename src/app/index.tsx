import { useEffect, useState } from "react";
import { Dimensions, StatusBar, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Link } from "expo-router";
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { useNavigation } from '@react-navigation/native';




export default function Home(){
    const windowWidth = Dimensions.get("window").width;
    const windowHeight = Dimensions.get("window").height;
      
    const [currentLocation, setCurrentLocation] = useState(null);
    const [initialRegion, setInitialRegion] = useState(null);
    const [permissionDenied, setPermissionDenied] = useState(false);

    const [menuVisible, setMenuVisible] = useState(false);
    const navigation = useNavigation();
  
    const toggleMenu = () => setMenuVisible(!menuVisible);
      
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
      
    return (
        <View className="flex-1 justify-center items-center bg-slate-200 ">
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
            {initialRegion && (
                    
                    <MapView
                        style={{flex:1, width:'100%'}}
                        initialRegion={initialRegion}
                        showsUserLocation={true}
                        showsMyLocationButton={false}
                    >
                    
                    
                    
                        {currentLocation && (
                            <Marker
                                coordinate={{
                                    latitude: currentLocation.latitude,
                                    longitude: currentLocation.longitude,
                                }}
                            title="Your Location"
                            />
                        )}
                    </MapView>
                    
                
            )}
            
            <View className="absolute top-12 left-16 right-4">
                <View className="flex-row items-center bg-sky-100 rounded-full shadow-md px-4 py-2">
                    <TextInput
                        className="flex-1 text-base text-gray-700"
                        placeholder="Busque uma rota"
                        placeholderTextColor="#999"
                    />
                </View>
            </View>
             {/* Botão de Menu Hambúrguer */}
            <TouchableOpacity
                onPress={toggleMenu}
                className="absolute top-12 left-4 bg-sky-100 p-2 rounded-full shadow-md"
            >
                <Text style={{ fontSize: 20 }}>☰</Text>
            </TouchableOpacity>

            {/* Menu lateral */}
            {menuVisible && (
                <View className="absolute top-28 left-4 bg-slate-200 shadow-lg rounded-lg p-4">
                <TouchableOpacity
                    onPress={() => {
                    setMenuVisible(false);
                    }}
                >
                    <Link className="text-lg text-blue-500" href={'./login'}>Login</Link>
                    <Link className="text-lg text-blue-500" href={'./login'}>Contato</Link>
                    
                </TouchableOpacity>
                </View>
            )}
             <View className="absolute bottom-0 left-0 right-0 bg-sky-100 flex-row justify-around items-center p-4 shadow-lg ">
                <TouchableOpacity onPress={() => alert('Saldo')} className="items-center">
                <Icon name="account-balance-wallet" size={24} color="#4A90E2" />
                <Text className="text-xs text-gray-700">Saldo</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => alert('Rotas Salvas')} className="items-center">
                <Icon name="bookmark" size={24} color="#4A90E2" />
                <Text className="text-xs text-gray-700">Rotas Salvas</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => alert('Contato')} className="items-center">
                <Icon name="contact-mail" size={24} color="#4A90E2" />
                <Text className="text-xs text-gray-700">Contato</Text>
                </TouchableOpacity>
            </View>
            
            
        </View>
    );
}