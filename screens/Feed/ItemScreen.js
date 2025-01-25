import { useState } from 'react';
import { View, ActivityIndicator, Text, TextInput, Image, Platform, Alert, TouchableOpacity } from 'react-native';
import { getBarcodeData } from '../../logic/barcodeFetch';
import { SafeAreaView } from 'react-native-safe-area-context';

const ItemScreen = ({ navigation, route }) => {
    const { barcode } = route.params;

    useState(() => {
        console.log(barcode);
    }, []);

    return (
        <SafeAreaView>
            <View>
                <Text>Testing 123</Text>
                <TouchableOpacity onPress={() => navigation.navigate('ScanBarcode')} className='bg-red-500 w-20 h-20'>

                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default ItemScreen;