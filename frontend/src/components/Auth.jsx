import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { supabase } from '../supabaseClient';
import { setUser } from '../slices/userSlice';
import 'bootstrap/dist/css/bootstrap.min.css';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const dispatch = useDispatch();

  const handleAuth = async (e) => {
    e.preventDefault();
    if (isSignUp) {
      const { data: { user }, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        console.error('Error signing up:', error.message);
      } else {
        const { error: insertError } = await supabase
          .from('users')
          .insert([{ user_ID: user.id, email, password }]);
        if (insertError) {
          console.error('Error inserting user data:', insertError.message);
        } else {
          dispatch(setUser(user));
        }
      }
    } else {
      const { data: { user }, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.error('Error signing in:', error.message);
      } else {
        dispatch(setUser(user));
      }
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card shadow-lg p-4" style={{ width: '25rem' }}>
        <h2 className="text-center mb-4 text-primary">
          {isSignUp ? 'Create your account' : 'Sign in to your account'}
        </h2>
        <form onSubmit={handleAuth}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>
        <div className="text-center mt-3">
          <p>
            {isSignUp ? 'Already have an account?' : 'New to the platform?'}
            <button className="btn btn-link" onClick={() => setIsSignUp(!isSignUp)}>
              {isSignUp ? 'Sign In instead' : 'Create an account'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
