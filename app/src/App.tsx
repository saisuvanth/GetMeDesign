import './App.css';
import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './layouts/Login';
import Register from './layouts/Register';
import Home from './layouts/Home';
import { NotificationProvider } from './hooks/useNotif';
import { AuthContextProvider } from './contexts/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

const PrivateRoute = lazy(() => import('./utils/PrivateRoute'));
const PublicRoute = lazy(() => import('./utils/PublicRoute'));

function App() {

  return (
    <div className="App">
      <AuthContextProvider>
        <GoogleOAuthProvider clientId='25271568058-3olmjkgn2o92cb6fpd0dfplpk8f2apo4.apps.googleusercontent.com'>
          <NotificationProvider>
            <Routes>
              <Route path='/' element={<Suspense><PrivateRoute /></Suspense>}>
                <Route path='/' element={<Home />} />
              </Route>
              <Route path='/' element={<Suspense><PublicRoute /></Suspense>}>
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
              </Route>
            </Routes>
          </NotificationProvider>
        </GoogleOAuthProvider>
      </AuthContextProvider>
    </div>
  );
}

export default App;
