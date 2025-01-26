import React, { useEffect, useState, useRef } from "react";
import { View, ScrollView, Text } from "react-native";

const NUM_HEIGHT = 60; // Height for each item

/**
 * NumberScroller Component
 */
const NumberScroller = ({ r, height, setter, length }) => {
  const handleScrollEnd = (event) => {
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / height); // Snap to closest index
    setter(index + 1); // Set the selected value (1-indexed)
  };

  return (
    <ScrollView
      ref={r}
      showsVerticalScrollIndicator={false}
      snapToInterval={height}
      snapToAlignment="start"
      decelerationRate="fast"
      onMomentumScrollEnd={handleScrollEnd}
      scrollEventThrottle={16}
      className="w-full h-full"
      contentContainerStyle={{ alignItems: "center", paddingVertical: height / 2 - 10 }}
    >
      {Array.from({ length }, (_, i) => (i < 9 ? '0' : '') + (i + 1).toString()).map((item) => (
        <View key={item} style={{ height, justifyContent: "center" }}>
          <Text className="text-6xl">{item}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

/**
 * DateScroller Component
 */
const DateScroller = ({setCurrentMonth, setCurrentDate, setCurrentYear}) => {
  const monthScrollRef = useRef(null);
  const dateScrollRef = useRef(null);
  const yearScrollRef = useRef(null);

  const scrollToToday = () => {
    const today = new Date();
    const monthIdx = today.getMonth();
    const dateIdx = today.getDate() - 1;
    const yearIdx = today.getFullYear() % 100 - 1;

    monthScrollRef.current?.scrollTo({
      y: NUM_HEIGHT * monthIdx,
      animated: true,
    });
    dateScrollRef.current?.scrollTo({
      y: NUM_HEIGHT * dateIdx,
      animated: true,
    });
    yearScrollRef.current?.scrollTo({
      y: NUM_HEIGHT * yearIdx,
      animated: true,
    });
  };

  useEffect(() => {
    setTimeout(scrollToToday, 40);
  }, []);

  return (
    <View className="flex-row space-x-2 justify-center w-full">
      {/* Month Scroller */}
      <View className="w-24 items-center">
        <Text>MONTH</Text>
        <View className="w-24 h-24 bg-red-800 border-black border-[5px] rounded-lg justify-center overflow-hidden">
          <NumberScroller
            r={monthScrollRef}
            height={NUM_HEIGHT}
            length={12}
            setter={setCurrentMonth}
          />
        </View>
      </View>

      {/* Date Scroller */}
      <View className="w-24 items-center">
        <Text>DATE</Text>
        <View className="w-24 h-24 bg-red-800 rounded-lg border-black border-[5px] justify-center overflow-hidden">
          <NumberScroller
            r={dateScrollRef}
            height={NUM_HEIGHT}
            length={31}
            setter={setCurrentDate}
          />
        </View>
      </View>

      {/* Year Scroller */}
      <View className="w-24 items-center">
        <Text>YEAR</Text>
        <View className="w-24 h-24 bg-red-800 rounded-lg border-black border-[5px] justify-center overflow-hidden">
          <NumberScroller
            r={yearScrollRef}
            height={NUM_HEIGHT}
            length={99}
            setter={(index) => setCurrentYear(2000 + index)}
          />
        </View>
      </View>
    </View>
  );
};

export default DateScroller;

