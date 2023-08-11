import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Fontisto } from "@expo/vector-icons";
import { theme } from "./colors";

const STORAGE_TODOS_KEY = "@toDos";
const STORAGE_WORKING_KEY = "@working";

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [todos, setTodos] = useState([]);
  const work = async () => {
    setWorking(true);
    await AsyncStorage.setItem(STORAGE_WORKING_KEY, JSON.stringify(true));
  };
  const travel = async () => {
    setWorking(false);
    await AsyncStorage.setItem(STORAGE_WORKING_KEY, JSON.stringify(false));
  };

  const onChangeText = (payload) => {
    setText(payload);
  };

  const saveTodos = async (saveTodo) => {
    await AsyncStorage.setItem(STORAGE_TODOS_KEY, JSON.stringify(saveTodo));
  };

  const addToDo = async () => {
    if (text === "") return;
    const newTodos = Object.assign(
      { ...todos },
      {
        [Date.now()]: { text, working },
      }
    );
    setTodos(newTodos);
    await saveTodos(newTodos);
    setText("");
  };

  const loadTodos = async () => {
    const s = await AsyncStorage.getItem(STORAGE_TODOS_KEY);
    s !== null ? setTodos(JSON.parse(s)) : null;
  };

  const deleteTodo = (key) => {
    Alert.alert("삭제", "정말 삭제하시겠습니까?", [
      { text: "취소" },
      {
        text: "삭제",
        style: "destructive",
        onPress: () => {
          const newTodos = { ...todos };
          delete newTodos[key];
          setTodos(newTodos);
          saveTodos(newTodos);
        },
      },
    ]);
  };

  const loadWorking = async () => {
    const nowWorking = await AsyncStorage.getItem(STORAGE_WORKING_KEY);
    nowWorking ? setWorking(JSON.parse(nowWorking)) : null;
  };

  useEffect(() => {
    loadTodos();
    loadWorking();
  }, []);
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
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
      <TextInput
        onSubmitEditing={addToDo}
        returnKeyType="done"
        autoFocus={true}
        style={styles.input}
        value={text}
        onChangeText={onChangeText}
        placeholder={
          working ? "할 일을 입력해주세요." : "어디로 가고 싶으신가요?"
        }
        keyboardType="numeric"
      />
      <ScrollView>
        {Object.keys(todos).map((key) =>
          todos[key].working === working ? (
            <View style={styles.todo} key={key}>
              <Text style={styles.todoText}>{todos[key].text}</Text>
              <TouchableOpacity onPress={() => deleteTodo(key)}>
                <Fontisto name="pencil" color={theme.grey} size={18}></Fontisto>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteTodo(key)}>
                <Fontisto name="trash" color={theme.grey} size={18}></Fontisto>
              </TouchableOpacity>
            </View>
          ) : null
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 15,
  },
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
  input: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  todo: {
    backgroundColor: theme.toDoBg,
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  todoText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});
