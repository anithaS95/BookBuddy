import React, { useRef, useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setSearchTerm, setResultTitle } from '../../redux/bookSlice';
import './SearchForm.css';

const SearchForm = () => {
  const searchText = useRef('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const books = useSelector((state) => state.books.books);

  useEffect(() => searchText.current.focus(), []);

  const handleSubmit = (e) => {
    e.preventDefault();
    let tempSearchTerm = searchText.current.value.trim();
    if (tempSearchTerm.replace(/[^\w\s]/gi, '').length === 0) {
      dispatch(setSearchTerm("the lost world"));
      dispatch(setResultTitle("Please Enter Something ..."));
      return;
    } else {
      dispatch(setSearchTerm(tempSearchTerm));
      const foundBook = books.find(book => book.title.toLowerCase() === tempSearchTerm.toLowerCase());
      if (foundBook) {
        navigate(`/book/${foundBook.id}`);
      } else {
        dispatch(setResultTitle("No book found with that title."));
      }
    }
  };

  return (
    <div className='search-form'>
      <div className='container'>
        <div className='search-form-content'>
          <form className='search-form' onSubmit={handleSubmit}>
            <div className='search-form-elem flex flex-sb bg-white'>
              <input type="text" className='form-control' placeholder='Enter book title...' ref={searchText} />
              <button type="submit" className='flex flex-c'>
                <FaSearch className='text-purple' size={32} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SearchForm;
