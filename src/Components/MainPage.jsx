import styles from "../app.module.css"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

export default function MainPage({ todos, setTodos }) {
  const [inputText, setInputText] = useState("")
  const [isSorting, setIsSorting] = useState(false)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetch("http://localhost:3005/todos")
      .then((res) => res.json())
      .then((data) => setTodos(data))
  }, [])

  const sortByAlphabet = () => {
    setTodos((prevTodos) =>
      [...prevTodos].sort((a, b) =>
        isSorting
          ? a.title.localeCompare(b.title, "ru")
          : b.title.localeCompare(a.title, "ru")
      )
    )
    setIsSorting((prev) => !prev)
  }

  const todoFieldOnChange = ({ target }) => {
    const value = target.value
    setInputText(value)
    if (error) setError("")
  }

  const requestAddTodo = (event) => {
    event.preventDefault()

    if (inputText === "") {
      setError("Введите то, что планируете сделать")
      return
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
      .finally(() => setInputText(""))
  }

  const searchFieldOnChange = ({ target }) => {
    setSearch(target.value)
  }
  const filteredTodos = todos.filter((todo) =>
    todo.title.toLowerCase().includes(search.toLowerCase())
  )

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
        <input
          className={styles.searchField}
          value={search}
          placeholder="Поиск..."
          type="text"
          onChange={searchFieldOnChange}
        />
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
        {filteredTodos.map(({ id, title }) => (
          <li key={id} className={styles.listItem}>
            <Link to={`/task/${id}`} className={styles.todoLink}>
              {title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
