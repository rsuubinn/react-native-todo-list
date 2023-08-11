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
import { Fontisto, AntDesign, MaterialIcons } from "@expo/vector-icons";
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

  const onClickEditBtn = (key) => {
    const newTodo = todos[key];
    const newIsEdit = !newTodo.isEdit;
    const newTodos = Object.assign(
      { ...todos },
      { [key]: { ...newTodo, isEdit: newIsEdit } }
    );
    setTodos(newTodos);
    saveTodos(newTodos);
  };

  // 투 두 저장하기
  const saveTodos = async (saveTodo) => {
    await AsyncStorage.setItem(STORAGE_TODOS_KEY, JSON.stringify(saveTodo));
  };

  // 투 두 추가하기
  const addToDo = async () => {
    if (text === "") return;
    const newTodos = Object.assign(
      { ...todos },
      {
        [Date.now()]: { text, working, completed: false, isEdit: false },
      }
    );
    setTodos(newTodos);
    await saveTodos(newTodos);
    setText("");
  };

  // 투 두 불러오기
  const loadTodos = async () => {
    const s = await AsyncStorage.getItem(STORAGE_TODOS_KEY);
    s !== null ? setTodos(JSON.parse(s)) : null;
  };

  // 투 두 삭제하기
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

  // 투 두 완료하기
  const completeTodo = (key) => {
    const newTodo = todos[key];
    const newTodos = Object.assign(
      { ...todos },
      { [key]: { ...newTodo, completed: !newTodo.completed } }
    );
    setTodos(newTodos);
    saveTodos(newTodos);
  };

  // 투 두 텍스트 업데이트
  const editTodo = (key, newText) => {
    if (newText === "") deleteTodo(key);
    const newTodos = { ...todos };
    newTodos[key].text = newText;
    setTodos(newTodos);
    saveTodos(newTodos);
  };

  const endEditTodo = (key) => {};

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
      />
      <ScrollView>
        {Object.keys(todos).map((key) =>
          todos[key].working === working ? (
            <View style={styles.todo} key={key}>
              <TouchableOpacity onPress={() => completeTodo(key)}>
                <MaterialIcons
                  name={
                    todos[key].completed
                      ? "check-box"
                      : "check-box-outline-blank"
                  }
                  color={theme.grey}
                  size={18}
                ></MaterialIcons>
              </TouchableOpacity>
              {todos[key].isEdit ? (
                <TextInput
                  style={styles.todoTextEditing}
                  value={todos[key].text}
                  onChangeText={(newText) => editTodo(key, newText)}
                  autoFocus={true}
                  returnKeyType="done"
                  onBlur={() => endEditTodo(key)}
                />
              ) : (
                <Text
                  style={[
                    todos[key].completed
                      ? styles.todoCompleted
                      : styles.todoText,
                  ]}
                >
                  {todos[key].text}
                </Text>
              )}
              <View style={styles.icons}>
                <TouchableOpacity
                  style={{ display: todos[key].completed ? "none" : null }}
                  onPress={() => onClickEditBtn(key)}
                >
                  <AntDesign
                    name="edit"
                    color={theme.grey}
                    size={18}
                  ></AntDesign>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteTodo(key)}>
                  <Fontisto
                    name="trash"
                    color={theme.grey}
                    size={18}
                  ></Fontisto>
                </TouchableOpacity>
              </View>
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
  todoCompleted: {
    textDecorationLine: "line-through",
    opacity: 0.5,
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  todoTextEditing: {
    color: "black",
    fontSize: 16,
    fontWeight: "500",
    backgroundColor: "white",
    paddingHorizontal: 10,
    fontSize: 16,
  },
  icons: {
    flexDirection: "row",
  },
});
