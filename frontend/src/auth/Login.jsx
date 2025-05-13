import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import useNavigate
import { useLoginMutation } from '../features/users/usersSlice';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../features/auth/authSlice';

function Login() {
  const [login, { isLoading, isSuccess, error }] = useLoginMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const credentials = {
        username,
        password,
      };
      await login(credentials); 
      
    } catch (error) {
      console.error('Login error:', error); // Log the error for debugging
      
    } finally {
      setUsername("")
      setPassword("")
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login({ username, password }).unwrap();
      dispatch(setCredentials(user));
    } catch (err) {
      console.error('Failed to login: ', err);
    }
  };

  return (
    <>
      {isSuccess && <Link to={'/users'}>View Users</Link>}
      <h3 className="text-center mt-5">Login</h3>
      <div className='login-bg container w-50 mt-5 mx-auto p-5 rounded-top-5 shadow-lg'>
        <form onSubmit={handleSubmit}>
          <input
            type="text" className='form-control rounded-0'
            placeholder="Username"
            value={username} required
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password" className='form-control mt-2 rounded-0'
            placeholder="Password"
            value={password} required
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className='w-50 mx-auto mt-4'>
            <button type="submit" disabled={isLoading} className='btn btn-secondary w-100'>
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </div>

          {error && <p className="text-danger text-center mt-2">Login failed: Incorrect credentials</p>}
          {isSuccess && <p className="text-info text-center mt-2">Successfully logged in </p>}
        </form>
      </div>

    </>
  );
}

export default Login;
