import { useMemo, useState } from 'react';
import './App.css';

let nextId = 1;

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  const remaining = useMemo(() => tasks.filter((task) => !task.done).length, [tasks]);

  const handleAddTask = (event) => {
    event.preventDefault();
    const trimmed = newTask.trim();
    if (!trimmed) return;

    setTasks((prev) => [
      ...prev,
      { id: nextId++, text: trimmed, done: false },
    ]);
    setNewTask('');
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
        <h1>Simple React Todo</h1>
        <p>{remaining} task{remaining === 1 ? '' : 's'} left</p>
      </header>

      <form className="new-task" onSubmit={handleAddTask}>
        <input
          type="text"
          value={newTask}
          onChange={(event) => setNewTask(event.target.value)}
          placeholder="Add a new task"
        />
        <button type="submit">Add</button>
      </form>

      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id} className={task.done ? 'done' : ''}>
            <label>
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => toggleTask(task.id)}
              />
              <span>{task.text}</span>
            </label>
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
