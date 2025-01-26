import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const FridgeContext = createContext();

export const FridgeDataProvider = ({ children }) => {
  const [isLoadingFridgeItems, setLoadingFridgeItems] = useState(true);
  const [fridgeItems, setContextFridgeItems] = useState([]);

  const loadFridgeItems = async () => {
    setLoadingFridgeItems(true);
    try {
      const stored = await AsyncStorage.getItem("fridgeItems");
      if (stored) {
        const parsed = JSON.parse(stored);
        setContextFridgeItems(parsed || []);
      } else {
        setContextFridgeItems([]);
      }
    } catch (error) {
      console.error("Error loading fridge items:", error);
      setContextFridgeItems([]);
    } finally {
      setLoadingFridgeItems(false);
    }
  };

  const saveFridgeItems = async (items) => {
    try {
      await AsyncStorage.setItem("fridgeItems", JSON.stringify(items));
    } catch (error) {
      console.error("Error saving fridge items:", error);
    }
  };

  const addFridgeItems = async (item) => {
    const newItems = [...fridgeItems, item];
    setContextFridgeItems(newItems);
    await saveFridgeItems(newItems);
  };

  const setFridgeItems = async (items) => {
    setContextFridgeItems(items);
    await saveFridgeItems(items);
  };

  useEffect(() => {
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

