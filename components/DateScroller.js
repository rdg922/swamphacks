import { useEffect, useContext, useState, useRef } from "react";
import {
  View,
  ActivityIndicator,
  Text,
  TextInput,
  Platform,
  Alert,
  TouchableOpacity,
  ScrollView,
  Modal,
  InteractionManager
} from "react-native";

const NumberScroller = ({ r, height, setter, length }) => {
    const handleScroll = (event) => {
        const y = event.nativeEvent.contentOffset.y;
        const index = Math.round(y / height);
        setter(index + 1);
      };
    
      const handleMomentumScrollEnd = (event) => {
        const y = event.nativeEvent.contentOffset.y;
        const index = Math.round(y / height);
        setter(index + 1);
      };

    return (
        <ScrollView
            ref={r}
            showsVerticalScrollIndicator={false}
            snapToInterval={height}
            snapToAlignment="start"
            decelerationRate="fast"
            className="w-full h-12 overflow-visible"
            contentContainerStyle={{alignItems: 'center'}}
            onScroll={handleScroll}
            onMomentumScrollEnd={handleMomentumScrollEnd}
            scrollEventThrottle={16}
        >
            {Array.from({ length }, (_, i) => i+1).map((item, index) => (
            <View key={index}> 
                <Text className="text-6xl">{item}</Text>
            </View>
            ))}
        </ScrollView>
    )
}

const DateScroller = () => {

  const [currentMonth, setCurrentMonth] = useState(0);
  const [currentDate, setCurrentDate] = useState(0);
  const [currentYear, setCurrentYear] = useState(0);

  const testScrollRef = useRef(null);
  const monthScrollRef = useRef(null);
  const dateScrollRef = useRef(null);
  const yearScrollRef = useRef(null);

  const scrollToDate = () => {
       const today = new Date();
       const monthIdx = today.getMonth();
       const dateIdx = today.getDate();
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
    }

    useEffect(() => {
    if (monthScrollRef.current && dateScrollRef.current && yearScrollRef.current) setTimeout(scrollToDate, 10);
    }, [monthScrollRef.current, dateScrollRef.current, yearScrollRef.current])

    const NUM_HEIGHT = 60;

    return (
        <View className="flex-row space-x-2 justify-center w-full">
            <View className="w-20 h-24 bg-red-800 rounded-lg justify-center overflow-hidden">
              <View className="w-full h-12 overflow-visible">
                <NumberScroller r={monthScrollRef} height={NUM_HEIGHT} length={12} setter={setCurrentMonth}/>
            </View>
            </View>
            <View className="w-20 h-24 bg-red-800 rounded-lg justify-center overflow-hidden">
              <View className="w-full h-12 overflow-visible">
                <NumberScroller r={monthScrollRef} height={NUM_HEIGHT} length={12} setter={setCurrentMonth}/>
            </View>
            </View>
            <View className="w-20 h-24 bg-red-800 rounded-lg justify-center overflow-hidden">
              <View className="w-full h-12 overflow-visible">
                <NumberScroller r={dateScrollRef} height={NUM_HEIGHT} length={31} setter={setCurrentDate}/>
            </View>
            </View>
            <View className="w-20 h-24 bg-red-800 rounded-lg justify-center overflow-hidden">
              <View className="w-full h-12 overflow-visible">
              <NumberScroller r={yearScrollRef} height={NUM_HEIGHT} length={99} setter={setCurrentYear}/>
            </View>
            </View>
            </View>
    )
}

export default DateScroller;