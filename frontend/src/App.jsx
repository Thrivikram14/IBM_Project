import React, { useEffect } from 'react';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import Auth from './components/Auth';
import { supabase } from './supabaseClient';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, clearUser } from './slices/userSlice';
import { setTasks } from './slices/tasksSlice';
import axios from 'axios';
import './index.css';

function App() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const tasks = useSelector(state => state.tasks);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:3001/tasks');
      dispatch(setTasks(response.data));
    } catch (error) {
      console.error('There was an error fetching the tasks!', error);
    }
  };

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Session:', session);
      dispatch(setUser(session?.user ?? null));
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed:', session);
      dispatch(setUser(session?.user ?? null));
    });

    return () => subscription.unsubscribe();
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user, dispatch]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    dispatch(clearUser());
  };

  if (!user) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <Auth />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light">
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
        <div className="container">
          <span className="navbar-brand">Task Flow</span>
          <div className="d-flex align-items-center">
            <span className="text-white me-3">
              Welcome, {user.email}
            </span>
            <button 
              className="btn btn-outline-light" 
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container">
        <div className="row">
          <div className="col-12 mb-4">
            <div className="card shadow-sm">
              <div className="card-header bg-white">
                <h4 className="card-title mb-0">Create New Task</h4>
              </div>
              <div className="card-body">
                <TaskForm fetchTasks={fetchTasks} />
              </div>
            </div>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-12">
            <TaskList tasks={tasks} />
          </div>
        </div>
      </div>

      <footer className="bg-white py-4 mt-auto">
        <div className="container">
          <div className="text-center text-muted">
            <small>© 2025 Task Management Application. All rights reserved.</small>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;