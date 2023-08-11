import { StyleSheet, TextInput } from "react-native";

const TodoInput = ({ working, todos, text, setText, setTodos, saveTodos }) => {
  const onChangeText = (payload) => {
    setText(payload);
  };

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

  return (
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
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  todoTextEditing: {
    color: "black",
    fontSize: 16,
    fontWeight: "500",
    backgroundColor: "white",
    paddingHorizontal: 10,
    fontSize: 16,
  },
});

export default TodoInput;
