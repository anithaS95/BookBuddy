import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBooks } from '../../redux/bookSlice'; // Adjust the path if necessary
import Book from "../BookList/Book";
import Loading from "../Loader/Loader";
import "./BookList.css";
import ErrorBoundary from '../../ErrorBoundary';

const BookList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { books, loading, resultTitle } = useSelector((state) => state.books);

  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch]);

  if (loading) return <Loading />;

  // Sort books by published date in descending order (newest first)
  // const sortedBooks = books.sort((a, b) => new Date(b?.published) - new Date(a?.published));/
  const reversedBooks = [...books].reverse();

  return (
    <ErrorBoundary>
    <section className='booklist'>
      <div className='container'>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom:"20px" }}>
          <h2 style={{ marginBottom:"0", fontSize:"20px" }}>{resultTitle} {books.length} books</h2>
          <button style={{ marginLeft: 'auto', fontSize:"20px", fontWeight:600 }} onClick={() => navigate("/home")}>Go Home</button>
        </div>
        <div className='booklist-content grid'>
          {!showAddForm && (
            <button onClick={() => setShowAddForm(true)}>Add New Book</button>
          )}
          {showAddForm && (
            navigate("/addbook")
          )}
          {
            reversedBooks.map((item, index) => (
              <Book key={index} {...item} />
            ))
          }
        </div>
      </div>
    </section>
    </ErrorBoundary>
  );
};

export default BookList;
