import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const FridgeContext = createContext();

export const FridgeDataProvider = ({ children }) => {
  const [isLoadingFridgeItems, setLoadingFridgeItems] = useState(true);
  const [fridgeItems, setFridgeItems] = useState([]);

  const loadFridgeItems = async () => {
    setLoadingFridgeItems(true);
    const storageFridgeItems = JSON.parse(
      await AsyncStorage.getItem("fridgeItems")
    );
    setFridgeItems(storageFridgeItems);
    setLoadingFridgeItems(false);
  };

  const saveFridgeItems = async () => {
    await AsyncStorage.setItem("fridgeItems", JSON.stringify(fridgeItems));
  };

  const addFridgeItems = async (item) => {
    setFridgeItems((i) => [...i, item]);
    saveFridgeItems();
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
      }}
    >
      {children}
    </FridgeContext.Provider>
  );
};
