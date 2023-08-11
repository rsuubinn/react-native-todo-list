import { AntDesign, Fontisto, MaterialIcons } from "@expo/vector-icons";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { theme } from "../colors";

const TodoLists = ({ todos, setTodos, working, saveTodos }) => {
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
    const newTodos = { ...todos };
    newTodos[key].text = newText;
    setTodos(newTodos);
    saveTodos(newTodos);
  };

  const endEditTodo = (key) => {
    const newTodos = { ...todos };
    newTodos[key].isEdit = false;
    setTodos(newTodos);
    saveTodos(newTodos);
  };

  return (
    <ScrollView>
      {Object.keys(todos).map((key) =>
        todos[key].working === working ? (
          <View style={styles.todo} key={key}>
            <TouchableOpacity onPress={() => completeTodo(key)}>
              <MaterialIcons
                name={
                  todos[key].completed ? "check-box" : "check-box-outline-blank"
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
                  todos[key].completed ? styles.todoCompleted : styles.todoText,
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
                <AntDesign name="edit" color={theme.grey} size={18}></AntDesign>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteTodo(key)}>
                <Fontisto name="trash" color={theme.grey} size={18}></Fontisto>
              </TouchableOpacity>
            </View>
          </View>
        ) : null
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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

export default TodoLists;
