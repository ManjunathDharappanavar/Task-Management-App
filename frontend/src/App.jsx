import React, { useState } from "react";
import "./App.css";

const initialTasks = [
  {
    id: 1,
    title: "Buy groceries",
    description: "Milk, Bread, Eggs, Fruits",
    completed: false,
    createdAt: new Date().toLocaleString(),
  },
  {
    id: 2,
    title: "Read a chapter",
    description: "Finish chapter 5 of the React book",
    completed: false,
    createdAt: new Date().toLocaleString(),
  },
];

function App() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tasks, setTasks] = useState(initialTasks);
  const [editId, setEditId] = useState(null);
  const [openDetailsId, setOpenDetailsId] = useState(null);

  // CREATE or UPDATE
  const handleSave = () => {
    if (!title.trim()) return;

    if (editId !== null) {
      setTasks(
        tasks.map((t) =>
          t.id === editId ? { ...t, title: title.trim(), description: description.trim() } : t
        )
      );
      setEditId(null);
    } else {
      const newTask = {
        id: Date.now(),
        title: title.trim(),
        description: description.trim(),
        completed: false,
        createdAt: new Date().toLocaleString(),
      };
      setTasks([newTask, ...tasks]);
    }

    setTitle("");
    setDescription("");
  };

  // DELETE
  const handleDelete = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
    if (openDetailsId === id) setOpenDetailsId(null);
    if (editId === id) setEditId(null);
  };

  // EDIT (populate form)
  const handleEdit = (taskItem) => {
    setTitle(taskItem.title);
    setDescription(taskItem.description || "");
    setEditId(taskItem.id);
  };

  // Toggle complete
  const toggleComplete = (id) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  // View details
  const toggleDetails = (id) => {
    setOpenDetailsId(openDetailsId === id ? null : id);
  };

  return (
    <div className="app">
      <div className="task-container">
        <h2>📝 Task Manager</h2>

        <div className="form-row">
          <input
            type="text"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="form-actions">
            <button onClick={handleSave}>{editId ? "Update Task" : "Add Task"}</button>
            {editId && (
              <button
                className="cancel"
                onClick={() => {
                  setEditId(null);
                  setTitle("");
                  setDescription("");
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        <h3>Tasks ({tasks.length})</h3>

        <ul className="task-list">
          {tasks.map((t) => (
            <li key={t.id} className={t.completed ? "completed" : ""}>
              <div className="task-main">
                <div className="task-left">
                  <input
                    type="checkbox"
                    checked={t.completed}
                    onChange={() => toggleComplete(t.id)}
                  />
                  <button className="title-btn" onClick={() => toggleDetails(t.id)}>
                    {t.title}
                  </button>
                </div>

                <div className="task-actions">
                  <button onClick={() => handleEdit(t)}>Edit</button>
                  <button className="delete" onClick={() => handleDelete(t.id)}>
                    Delete
                  </button>
                </div>
              </div>

              {openDetailsId === t.id && (
                <div className="task-details">
                  <p><strong>Description:</strong> {t.description || "—"}</p>
                  <p><strong>Created:</strong> {t.createdAt}</p>
                  <p><strong>Status:</strong> {t.completed ? "Completed" : "Pending"}</p>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
