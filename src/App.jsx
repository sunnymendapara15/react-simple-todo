import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './App.css';

let nextId = 1;

const formatDuration = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (value) => String(value).padStart(2, '0');
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [priority, setPriority] = useState('Medium');
  const intervalRef = useRef(null);

  const remaining = useMemo(() => tasks.filter((task) => !task.done).length, [tasks]);
  const totalTime = useMemo(
    () => tasks.reduce((acc, task) => acc + task.elapsed, 0),
    [tasks]
  );

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTasks((prev) =>
        prev.map((task) =>
          task.running ? { ...task, elapsed: task.elapsed + 1 } : task
        )
      );
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, []);

  const handleAddTask = (event) => {
    event.preventDefault();
    const trimmed = newTask.trim();
    if (!trimmed) return;

    setTasks((prev) => [
      ...prev,
      {
        id: nextId++,
        text: trimmed,
        done: false,
        priority,
        elapsed: 0,
        running: false,
      },
    ]);
    setNewTask('');
    setPriority('Medium');
  };

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== id) return task;
        const nextDone = !task.done;
        return {
          ...task,
          done: nextDone,
          running: nextDone ? false : task.running,
        };
      })
    );
  };

  const toggleTimer = useCallback((id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, running: !task.running } : task
      )
    );
  }, []);

  const clearCompleted = () => {
    setTasks((prev) => prev.filter((task) => !task.done));
  };

  return (
    <div className="app-shell">
      <header>
        <div className="header-top">
          <h1>Simple React Todo</h1>
          <span className="pill">Prioritize your focus</span>
        </div>
        <p className="subtitle">
          Track work, start a timer per task, and let the visuals remind you that every minute matters.
        </p>
        <div className="header-bottom">
          <p className="remaining">
            {remaining} task{remaining === 1 ? '' : 's'} left
          </p>
          <p className="total-time">
            Total focus: <strong>{formatDuration(totalTime)}</strong>
          </p>
        </div>
      </header>

      <form className="new-task" onSubmit={handleAddTask}>
        <div className="input-row">
          <input
            type="text"
            value={newTask}
            onChange={(event) => setNewTask(event.target.value)}
            placeholder="Add a new task"
            aria-label="New task"
          />
          <select
            value={priority}
            onChange={(event) => setPriority(event.target.value)}
            aria-label="Task priority"
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
        <button type="submit">Add task</button>
      </form>

      <ul className="task-list">
        {tasks.map((task) => (
          <li
            key={task.id}
            className={`task-item ${task.done ? 'done' : ''} ${task.running ? 'running' : ''}`}
          >
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
            <div className="task-meta">
              <div className="timer">
                <span>{formatDuration(task.elapsed)}</span>
                {task.running && <span className="dot" aria-hidden="true" />}
              </div>
              <button
                type="button"
                className={`timer-button ${task.running ? 'stop' : 'start'}`}
                onClick={() => toggleTimer(task.id)}
              >
                {task.running ? 'Stop' : 'Start'}
              </button>
            </div>
          </li>
        ))}
        {tasks.length === 0 && (
          <li className="empty">Add your first task and start a timer.</li>
        )}
      </ul>

      <footer>
        <button
          type="button"
          onClick={clearCompleted}
          disabled={!tasks.some((task) => task.done)}
        >
          Clear completed
        </button>
      </footer>
    </div>
  );
}

export default App;
