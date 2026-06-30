import { useMemo, useState } from 'react';
import './App.css';

let nextId = 1;

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [priority, setPriority] = useState('Medium');

  const remaining = useMemo(() => tasks.filter((task) => !task.done).length, [tasks]);

  const handleAddTask = (event) => {
    event.preventDefault();
    const trimmed = newTask.trim();
    if (!trimmed) return;

    setTasks((prev) => [
      ...prev,
      { id: nextId++, text: trimmed, done: false, priority },
    ]);
    setNewTask('');
    setPriority('Medium');
  };

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, done: !task.done } : task))
    );
  };

  const clearCompleted = () => {
    setTasks((prev) => prev.filter((task) => !task.done));
  };

  return (
    <div className="app-shell">
      <header>
        <div className="header-top">
          <h1>Simple React Todo</h1>
          <span className="pill">Prioritize what matters</span>
        </div>
        <p className="subtitle">
          A calm workspace with just the essentials: add tasks, pick a priority, and stay on target.
        </p>
        <p className="remaining">
          {remaining} task{remaining === 1 ? '' : 's'} left
        </p>
      </header>

      <form className="new-task" onSubmit={handleAddTask}>
        <input
          type="text"
          value={newTask}
          onChange={(event) => setNewTask(event.target.value)}
          placeholder="Add a new task"
          aria-label="New task"
        />
        <select value={priority} onChange={(event) => setPriority(event.target.value)}>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <button type="submit">Add</button>
      </form>

      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id} className={`task-item ${task.done ? 'done' : ''}`}>
            <div className="task-content">
              <label>
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => toggleTask(task.id)}
                />
                <span>{task.text}</span>
              </label>
              <span className={`priority-pill ${task.priority.toLowerCase()}`}>
                {task.priority}
              </span>
            </div>
          </li>
        ))}
        {tasks.length === 0 && <li className="empty">Your list is empty.</li>}
      </ul>

      <footer>
        <button type="button" onClick={clearCompleted} disabled={!tasks.some((task) => task.done)}>
          Clear completed
        </button>
      </footer>
    </div>
  );
}

export default App;
