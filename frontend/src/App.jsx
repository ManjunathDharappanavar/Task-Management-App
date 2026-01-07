import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tasks, setTasks] = useState([]);
  const [editId, setEditId] = useState(null);
  const [openDetailsId, setOpenDetailsId] = useState(null);

  // Fetch tasks on initial render
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/items');
      const data = await res.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  // CREATE or UPDATE
  const handleSave = async () => {
    if (!title.trim()) return;

    const taskData = { title: title.trim(), description: description.trim() };

    try {
      if (editId !== null) {
        const res = await fetch(`http://localhost:5000/api/items/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(taskData)
        });
        const updatedTask = await res.json();
        setTasks(tasks.map((t) => t._id === editId ? updatedTask : t));
        setEditId(null);
      } else {
        const res = await fetch('http://localhost:5000/api/items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(taskData)
        });
        const newTask = await res.json();
        setTasks([newTask, ...tasks]);
      }

      setTitle("");
      setDescription("");
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/items/${id}`, { method: 'DELETE' });
      setTasks(tasks.filter((t) => t._id !== id));
      if (openDetailsId === id) setOpenDetailsId(null);
      if (editId === id) setEditId(null);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // EDIT (populate form)
  const handleEdit = (taskItem) => {
    setTitle(taskItem.title);
    setDescription(taskItem.description || "");
    setEditId(taskItem._id);
  };

  // Toggle complete
  // const toggleComplete = async (id) => {
  //   const task = tasks.find((t) => t._id === id);
  //   if (!task) return;

  //   const updatedCompleted = !task.status;
  //   try {
  //     const res = await fetch(`http://localhost:5000/api/items/${id}`, {
  //       method: 'PUT',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ ...task, statu: updatedCompleted })
  //     });
  //     const updatedTask = await res.json();
  //     setTasks(tasks.map((t) => t._id === id ? updatedTask : t));
  //   } catch (error) {
  //     console.error('Error toggling complete:', error);
  //   }
  // };

  // Toggle complete (status)
const toggleComplete = async (id) => {
  const task = tasks.find((t) => t._id === id);
  if (!task) return;

  try {
    const res = await fetch(`http://localhost:5000/api/items/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: !task.status })
    });

    const updatedTask = await res.json();

    setTasks(tasks.map((t) => (t._id === id ? updatedTask : t)));
  } catch (error) {
    console.error("Error toggling status:", error);
  }
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
            <li key={t._id} className={t.status ? "completed" : ""}>
              <div className="task-main">
                <div className="task-left">
                  {/* <input
                    type="checkbox"
                    checked={t.status}
                    onChange={() => toggleComplete(t._id)}
                  /> */}

                  <input
                    type="checkbox"
                    checked={t.status}
                    onChange={() => toggleComplete(t._id)}
                  />

                  <button className="title-btn" onClick={() => toggleDetails(t._id)}>
                    {t.title}
                  </button>
                </div>

                <div className="task-actions">
                  <button onClick={() => handleEdit(t)}>Edit</button>
                  <button className="delete" onClick={() => handleDelete(t._id)}>
                    Delete
                  </button>
                </div>
              </div>

              {openDetailsId === t._id && (
                <div className="task-details">
                  <p><strong>Description:</strong> {t.description || "—"}</p>
                  <p><strong>Created:</strong> {t.createdAt}</p>
                  <p><strong>Status:</strong> {t.status ? "Completed" : "Pending"}</p>
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
