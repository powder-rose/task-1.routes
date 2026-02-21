import { useEffect, useState } from "react"
import styles from "./app.module.css"
import { Routes, Route, Navigate, Outlet } from "react-router-dom"
import MainPage from "./Components/MainPage"
import Task from "./Components/Task"
import NotFound from "./Components/NotFound.jsx"

function App() {
  const [todos, setTodos] = useState([])

  useEffect(() => {
    fetch("http://localhost:3005/todos")
      .then((res) => res.json())
      .then((data) => setTodos(data))
  }, [])

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={<MainPage todos={todos} setTodos={setTodos} />}
        />
        <Route
          path="task/:id"
          element={<Task todos={todos} setTodos={setTodos} />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
