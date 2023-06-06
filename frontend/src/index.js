import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import { Provider } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import store from './store';
import PrivateRoute from './components/PrivateRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import RegisterPage from './pages/RegisterPage';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="" element={<PrivateRoute />}>
        <Route path="/" element={<HomePage />} />
      </Route>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Route>
  )
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
