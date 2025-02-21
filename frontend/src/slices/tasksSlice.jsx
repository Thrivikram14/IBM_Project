import { createSlice } from '@reduxjs/toolkit';

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: [],
  reducers: {
    setTasks: (state, action) => action.payload,
    addTask: (state, action) => [...state, action.payload],
    updateTask: (state, action) => state.map(task => task._id === action.payload._id ? action.payload : task),
    deleteTask: (state, action) => state.filter(task => task._id !== action.payload),
  },
});

export const { setTasks, addTask, updateTask, deleteTask } = tasksSlice.actions;
export default tasksSlice.reducer;