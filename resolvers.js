const fs = require('fs');

const TASKS_FILE = './tasks.json';

// Helper function to load tasks from the JSON file
const loadTasks = () => {
  try {
    const data = fs.readFileSync(TASKS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// Helper function to save tasks to the JSON file
const saveTasks = (tasks) => {
  fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
};

// Load tasks initially and set up auto-increment counter
let tasks = loadTasks();
let taskCounter = tasks.length > 0 ? Math.max(...tasks.map(task => task.id)) + 1 : 1;

const resolvers = {
  Query: {
    tasks: () => tasks,
    task: (_, { id }) => tasks.find(task => task.id === id),
  },

  Mutation: {
    addTask: (_, { title, description }) => {
      const newTask = {
        id: taskCounter++, // Auto-increment ID
        title,
        description: description || '',
        completed: false,
      };
      tasks.push(newTask);
      saveTasks(tasks); // Save to JSON file
      return newTask;
    },

    updateTask: (_, { id, title, description, completed }) => {
      const taskIndex = tasks.findIndex(task => task.id === id);
      if (taskIndex === -1) throw new Error("Task not found");

      const updatedTask = {
        ...tasks[taskIndex],
        title: title !== undefined ? title : tasks[taskIndex].title,
        description: description !== undefined ? description : tasks[taskIndex].description,
        completed: completed !== undefined ? completed : tasks[taskIndex].completed,
      };
      tasks[taskIndex] = updatedTask;
      saveTasks(tasks); // Save to JSON file
      return updatedTask;
    },

    deleteTask: (_, { id }) => {
      const taskIndex = tasks.findIndex(task => task.id === id);
      if (taskIndex === -1) return false;

      tasks.splice(taskIndex, 1);
      saveTasks(tasks); // Save to JSON file
      return true;
    },
  },
};

module.exports = resolvers;
