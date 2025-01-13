import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Task {
  id?: string; // Mark as optional since Firestore generates it
  title: string;
  description: string;
  category: string;
  dueDate: string;
  createdAt: string;
  status: string;
  [key: string]: any; // Allow additional fields for dynamic keys
}

interface TaskState {
  tasks: Task[];
}

const initialState: TaskState = {
  tasks: [],
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
    },
    reorderTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
    },
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex(
        (task) => task.id === action.payload.id
      );
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    deleteTask: (state, action: PayloadAction<String>) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
    },
    updateTaskStatus: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex(
        (task) => task.id === action.payload.id
      );
      if (index !== -1) {
        state.tasks[index].status = action.payload.status;
      }
    },
  },
});

export const {
  setTasks,
  reorderTasks,
  addTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
} = taskSlice.actions;
export default taskSlice.reducer;
