import { useParams, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import styles from "../task.module.css"

export default function Task({ todos, setTodos }) {
  const { id } = useParams()
  const navigate = useNavigate()

  const [todo, setTodo] = useState(null)
  const [editingText, setEditingText] = useState("")
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    fetch(`http://localhost:3005/todos/${id}`)
      .then((res) => {
        if (!res.ok) {
          navigate("/404")
          return
        }
        return res.json()
      })
      .then((data) => {
        if (data) {
          setTodo(data)
          setEditingText(data.title)
        }
      })
  }, [id, navigate])

  const requestEditTodo = () => {
    fetch(`http://localhost:3005/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editingText }),
    })
      .then((res) => res.json())
      .then((editedTodo) => {
        setTodos((prev) =>
          prev.map((t) => (t.id === Number(id) ? editedTodo : t))
        )
        setTodo(editedTodo)
        setIsEditing(false)
      })
  }

  const requestDeleteTodo = () => {
    fetch(`http://localhost:3005/todos/${id}`, {
      method: "DELETE",
    }).then(() => {
      setTodos((prev) => prev.filter((t) => t.id !== Number(id)))
      navigate("/")
    })
  }

  if (!todo) return null

  return (
    <div className={styles.container}>
      <button onClick={() => navigate(-1)} className={styles.backBtn}>
        ←
      </button>

      {isEditing ? (
        <div className={styles.editingContainer}>
          <input
            value={editingText}
            onChange={(e) => setEditingText(e.target.value)}
            className={styles.editField}
          />
          <button onClick={requestEditTodo} className={styles.saveBtn}>
            💾
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className={styles.deleteBtn + " " + styles.cancelBtn}
          >
            X
          </button>
        </div>
      ) : (
        <>
          <div className={styles.titleContainer}>
            <div className={styles.title}>
              {todo.title}
              <div className={styles.buttonContainer}>
                <button
                  onClick={() => setIsEditing(true)}
                  className={styles.editBtn}
                  title="Редактировать"
                ></button>
                <button
                  onClick={requestDeleteTodo}
                  className={styles.deleteBtn}
                  title="Удалить"
                >
                  X
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
