// App.js
import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import './index.css';
import { ToastContainer } from 'react-toastify';
import Loading from './components/Loader/Loader';
import UserProfile from './components/User.js/User';
import { store } from './redux/store';
import {ThemeProvider} from './themeContext'; 

const Home = lazy(() => import('./pages/Home/Home'));
const BookList = lazy(() => import('./components/BookList/BookList'));
const BookDetails = lazy(() => import('./components/BookDetails/BookDetails'));
const Login = lazy(() => import('./pages/Login/Login'));
const Register = lazy(() => import('./pages/Register/Register'));
const AddBookForm = lazy(() => import('./components/Forms/AddBookForm'));
const BookEdit = lazy(() => import('./components/Forms/BookEditForm'));

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider> 
        <Router>
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/addbook" element={<AddBookForm />} />
              <Route path="/book" element={<BookList />} />
              <Route path="/book/:id" element={<BookDetails />} />
              <Route path="/book/:id/edit" element={<BookEdit />} />
            </Routes>
          </Suspense>
          <ToastContainer />
        </Router>
      </ThemeProvider>
    </Provider>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
