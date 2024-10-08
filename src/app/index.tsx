import { useEffect, useState } from "react";
import { Dimensions, Text, View } from "react-native";
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Link } from "expo-router";

export default function Mapa2(){
    const windowWidth = Dimensions.get("window").width;
    const windowHeight = Dimensions.get("window").height;
      
    const [currentLocation, setCurrentLocation] = useState(null);
    const [initialRegion, setInitialRegion] = useState(null);
      
    useEffect(() => {
        const getLocation = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
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
        <View className="flex-1 justify-center items-center">
            <Text>MapView - 2</Text>
            <Link href={'./login'}>Login</Link>

            {initialRegion && (
                <MapView 
                    style={{width:'100%', height:'90%'}} 
                    initialRegion={initialRegion} 
                    showsUserLocation
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
        </View>
    );
}