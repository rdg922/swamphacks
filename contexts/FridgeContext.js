import React, { createContext, useState, useEffect, useContext } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';
import { supabase } from '../supabaseClient';
import { ttamToBinary, nutriToBinary, binaryToTTAM, binaryTo360 } from '../logic/decode';
import { el } from 'date-fns/locale';
import samples from '../samples.json';
import AuthContext from './AuthContext';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import * as Sharing from 'expo-sharing';
import { TextDecoder } from 'text-encoding';
import { PDFDocument } from 'pdf-lib';


export const FridgeContext = createContext();

export const FridgeDataProvider = ({ children }) => {

    const [isLoadingFridgeItems, setLoadingFridgeItems] = useState(true);
    const [fridgeItems, setFridgeItems] = useState([]);

    const loadFridgeItems = async () => {
        setLoadingFridgeItems(true);
        const storageFridgeItems = JSON.parse(await AsyncStorage.getItem('fridgeItems'));
        setFridgeItems(storageFridgeItems);
        setLoadingFridgeItems(false);
    }

    const saveFridgeItems = async () => {
        await AsyncStorage.setItem('fridgeItems', JSON.stringify(fridgeItems));
    }

    const addFridgeItems = async (items) => {
        setFridgeItems(i => [...i, items]);
        saveFridgeItems();
    }

    useState(() => {
        loadFridgeItems();
    }, [])

  return (
    <FridgeContext.Provider value={{ fridgeItems, isLoadingFridgeItems, loadFridgeItems, addFridgeItems }}>
      {children}
    </FridgeContext.Provider>
  );
};