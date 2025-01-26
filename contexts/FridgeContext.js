import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const FridgeContext = createContext();

export const FridgeDataProvider = ({ children }) => {
  const [isLoadingFridgeItems, setLoadingFridgeItems] = useState(true);
  const [fridgeItems, setContextFridgeItems] = useState([]);

  const loadFridgeItems = async () => {
    setLoadingFridgeItems(true);
    const storageFridgeItems = JSON.parse(
      await AsyncStorage.getItem("fridgeItems")
    );
    setContextFridgeItems(storageFridgeItems);
    setLoadingFridgeItems(false);
  };

  const saveFridgeItems = async () => {
    await AsyncStorage.setItem("fridgeItems", JSON.stringify(fridgeItems));
  };

  const addFridgeItems = async (item) => {
    setContextFridgeItems([...fridgeItems, item]);
    await saveFridgeItems();
  };

  const setFridgeItems = async (item) => {
    setContextFridgeItems(item);
    await saveFridgeItems();
  };

  useState(() => {
    loadFridgeItems();
  }, []);

  return (
    <FridgeContext.Provider
      value={{
        fridgeItems,
        isLoadingFridgeItems,
        loadFridgeItems,
        addFridgeItems,
        setFridgeItems,
      }}
    >
      {children}
    </FridgeContext.Provider>
  );
};
