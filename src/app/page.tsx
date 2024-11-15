"use client"
import { useState, useEffect } from 'react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  priority: string; // Added priority to each task
}

const Page = () => {
  const [task, setTask] = useState('');
  const [priority, setPriority] = useState('Low'); // Default priority
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<'All' | 'Active' | 'Completed'>('All');

  // Load tasks from localStorage on initial render
  useEffect(() => {
    const savedTodos = JSON.parse(localStorage.getItem('todos') || '[]');
    setTodos(savedTodos);
  }, []);

  // Save tasks to localStorage whenever the todos list changes
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // Add a new task
  const addTask = () => {
    if (task.trim() === '') return;

    const newTask = {
      id: Date.now(),
      text: task,
      completed: false,
      priority,
    };

    setTodos([...todos, newTask]);
    setTask('');
    setPriority('Low'); // Reset priority to "Low"
  };

  // Toggle task completion
  const toggleCompletion = (id: number) => {
    setTodos(todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  // Delete a task
  const deleteTask = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // Filter tasks based on their state (All, Active, Completed)
  const filteredTodos = todos.filter(todo => {
    if (filter === 'All') return true;
    if (filter === 'Active') return !todo.completed;
    if (filter === 'Completed') return todo.completed;
    return true;
  });

  return (
    <div className="min-h-40 flex flex-col items-center justify-center bg-gray-50 py-10">
      <h1 className="text-4xl hover:bg-violet-400 font-semibold mb-8 text-center text-blue-600 border-double border-4 border-cyan-500 bg-amber-300 rounded-full h-15 w-50 font-serif ">Todo App</h1>
            {/* Input section */}
      <div className="flex items-center mb-4 space-x-2">
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          className="px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="What needs to be done?"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <button
          onClick={addTask}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-all duration-200"
        >
          Add Task
        </button>
      </div>

      {/* Filter section */}
      <div className="mb-4">
        <button
          onClick={() => setFilter('All')}
          className={`px-4 py-2 mx-2 rounded-md ${filter === 'All' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('Active')}
          className={`px-4 py-2 mx-2 rounded-md ${filter === 'Active' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Active
        </button>
        <button
          onClick={() => setFilter('Completed')}
          className={`px-4 py-2 mx-2 rounded-md ${filter === 'Completed' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Completed
        </button>
      </div>

      {/* Task list */}
      <ul className="w-full max-w-lg space-y-4">
        {filteredTodos.map((todo) => (
          <li
            key={todo.id}
            className={`flex justify-between items-center p-4 bg-white rounded-md shadow-md transition-all duration-300 ${todo.completed ? 'bg-gray-200 line-through text-gray-500' : ''}`}
          >
            <span
              onClick={() => toggleCompletion(todo.id)}
              className={`cursor-pointer ${todo.completed ? 'text-gray-500' : 'text-black'}`}
            >
              {todo.text}
            </span>

            <span
              className={`px-3 py-1 text-xs rounded-full ${todo.priority === 'High' ? 'bg-red-500 text-white' : todo.priority === 'Medium' ? 'bg-yellow-400 text-black' : 'bg-green-500 text-white'}`}
            >
              {todo.priority}
            </span>

            <button
              onClick={() => deleteTask(todo.id)}
              className="text-red-500 hover:text-red-700 focus:outline-none transition-all duration-200"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Page;
