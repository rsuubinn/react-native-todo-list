import AsyncStorage from "@react-native-async-storage/async-storage";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { theme } from "../colors";

const STORAGE_WORKING_KEY = "@working";

const Header = ({ working, setWorking }) => {
  const work = async () => {
    setWorking(true);
    await AsyncStorage.setItem(STORAGE_WORKING_KEY, JSON.stringify(true));
  };
  const travel = async () => {
    setWorking(false);
    await AsyncStorage.setItem(STORAGE_WORKING_KEY, JSON.stringify(false));
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={work}>
        <Text
          style={{
            ...styles.buttonText,
            color: working ? "white" : theme.grey,
          }}
        >
          Work
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={travel}>
        <Text
          style={{
            ...styles.buttonText,
            color: !working ? "white" : theme.grey,
          }}
        >
          Travel
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 80,
  },
  buttonText: {
    color: "white",
    fontSize: 30,
    fontWeight: 600,
  },
});

export default Header;
