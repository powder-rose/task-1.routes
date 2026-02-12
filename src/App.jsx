import { useEffect, useState } from "react";
import styles from "./app.module.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [inputText, setInputText] = useState("");
  const [error, setError] = useState("");
  const [editingText, setEditingText] = useState("");
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [isSorting, setIsSorting] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3005/todos")
      .then((res) => res.json())
      .then((data) => setTodos(data));
  }, []);

  const todoFieldOnChange = ({ target }) => {
    const value = target.value;
    setInputText(value);
    if (error) setError("");
  };

  const requestAddTodo = (event) => {
    event.preventDefault();

    if (inputText === "") {
      setError("Введите то, что планируете сделать");
      return;
    }

    fetch("http://localhost:3005/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: inputText,
      }),
    })
      .then((res) => res.json())
      .then((newTodo) => setTodos((prevTodos) => [...prevTodos, newTodo]))
      .finally(() => setInputText(""));
  };

  const requestEditTodo = (id) => {
    fetch(`http://localhost:3005/todos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: editingText,
      }),
    })
      .then((res) => res.json())
      .then((editedTodo) => {
        setTodos((prevTodos) =>
          prevTodos.map((todo) => (todo.id === id ? editedTodo : todo)),
        );
      });
    setEditingTodoId(null);
    setInputText("");
  };

  const startEditingTodo = (id, title) => {
    setEditingTodoId(id);
    setEditingText(title);
  };

  const cancelEdit = () => {
    setEditingTodoId(null);
    setEditingText("");
  };

  const requestDeleteTodo = (id) => {
    fetch(`http://localhost:3005/todos/${id}`, {
      method: "DELETE",
    }).then(() => {
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    });
  };

  const sortByAlphabet = () => {
    setTodos((prevTodos) =>
      [...prevTodos].sort((a, b) =>
        isSorting
          ? a.title.localeCompare(b.title, "ru")
          : b.title.localeCompare(a.title, "ru"),
      ),
    );
    setIsSorting((prev) => !prev);
  };

  return (
    <div className={styles.container}>
      {error && <div>{error}</div>}
      <form onSubmit={requestAddTodo} className={styles.form}>
        <input
          value={inputText}
          className={styles.field}
          onChange={todoFieldOnChange}
          type="text"
        />

        <button className={styles.addBtn}>Добавить</button>
        <button
          type="button"
          title="Сортировать"
          className={styles.sortBtn}
          onClick={sortByAlphabet}
        >
          ↑↓
        </button>
      </form>
      <ul className={styles.list}>
        {todos.map(({ id, title }) => (
          <li key={id} className={styles.listItem}>
            {editingTodoId === id ? (
              <div className={styles.editFormContainer}>
                <input
                  className={styles.editField}
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                />
                <button
                  title="Сохранить"
                  className={styles.saveBtn}
                  onClick={() => requestEditTodo(id)}
                >
                  💾
                </button>
                <button
                  title="Отмена"
                  onClick={() => cancelEdit(id)}
                  className={styles.deleteBtn + " " + styles.cancelBtn}
                >
                  X
                </button>
              </div>
            ) : (
              <>
                {title}
                <div className={styles.buttonsContainer}>
                  <button
                    title="Редактировать"
                    onClick={() => startEditingTodo(id, title)}
                    className={styles.editBtn}
                  />
                  <button
                    title="Удалить"
                    onClick={() => requestDeleteTodo(id)}
                    className={styles.deleteBtn}
                  >
                    X
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App
