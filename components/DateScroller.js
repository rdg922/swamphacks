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
      contentContainerStyle={{ alignItems: "center", paddingVertical: height / 2 }}
    >
      {Array.from({ length }, (_, i) => i + 1).map((item) => (
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
const DateScroller = () => {
  const [currentMonth, setCurrentMonth] = useState(1);
  const [currentDate, setCurrentDate] = useState(1);
  const [currentYear, setCurrentYear] = useState(2000);

  const monthScrollRef = useRef(null);
  const dateScrollRef = useRef(null);
  const yearScrollRef = useRef(null);

  const scrollToToday = () => {
    const today = new Date();
    const monthIdx = today.getMonth(); // 0-indexed
    const dateIdx = today.getDate() - 1; // 1-indexed to 0-indexed
    const yearIdx = today.getFullYear() - 2000; // Start from 2000

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
    scrollToToday();
  }, []);

  return (
    <View className="flex-row space-x-2 justify-center w-full">
      {/* Month Scroller */}
      <View className="w-20 h-24 bg-red-800 rounded-lg justify-center overflow-hidden">
        <NumberScroller
          r={monthScrollRef}
          height={NUM_HEIGHT}
          length={12}
          setter={setCurrentMonth}
        />
      </View>

      {/* Date Scroller */}
      <View className="w-20 h-24 bg-red-800 rounded-lg justify-center overflow-hidden">
        <NumberScroller
          r={dateScrollRef}
          height={NUM_HEIGHT}
          length={31}
          setter={setCurrentDate}
        />
      </View>

      {/* Year Scroller */}
      <View className="w-20 h-24 bg-red-800 rounded-lg justify-center overflow-hidden">
        <NumberScroller
          r={yearScrollRef}
          height={NUM_HEIGHT}
          length={100} // Show 100 years (2000–2099)
          setter={(index) => setCurrentYear(2000 + index - 1)}
        />
      </View>
    </View>
  );
};

export default DateScroller;

