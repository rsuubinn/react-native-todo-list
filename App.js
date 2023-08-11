import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { theme } from "./colors";
import Header from "./components/Header";
import TodoInput from "./components/TodoInput";
import TodoLists from "./components/TodoLists";

const STORAGE_TODOS_KEY = "@toDos";
const STORAGE_WORKING_KEY = "@working";

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [todos, setTodos] = useState([]);

  // 투 두 저장하기
  const saveTodos = async (saveTodo) => {
    await AsyncStorage.setItem(STORAGE_TODOS_KEY, JSON.stringify(saveTodo));
  };

  // 투 두 불러오기
  const loadTodos = async () => {
    const s = await AsyncStorage.getItem(STORAGE_TODOS_KEY);
    s !== null ? setTodos(JSON.parse(s)) : null;
  };

  // 선택했던 카테고리 유지
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
      <Header working={working} setWorking={setWorking} />
      <TodoInput
        working={working}
        todos={todos}
        text={text}
        setText={setText}
        setTodos={setTodos}
        saveTodos={saveTodos}
      />
      <TodoLists
        todos={todos}
        setTodos={setTodos}
        working={working}
        saveTodos={saveTodos}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 15,
  },
});
