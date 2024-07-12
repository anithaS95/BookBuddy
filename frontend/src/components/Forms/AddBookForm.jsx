import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Grid, TextField, TextareaAutosize, Button } from '@mui/material';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { notifySuccess, notifyError } from '../../toastConfig';
import { ToastContainer } from 'react-toastify';
import { addBook, fetchBooks } from '../../redux/bookSlice'; // Import Redux actions

const AddBookForm = () => {
  const [newBook, setNewBook] = useState({
    author: "",
    edition_count: "",
    first_publish_year: "",
    title: "",
    subject_place: "",
    subject_date: "",
    note: ""
  });

  const [imageFile, setImageFile] = useState(null); // State to hold the selected image file
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAddBook = async () => {
    try {
      const imageData = await readImageData(imageFile); // Read image data as base64 string

      const bookData = {
        author: newBook.author,
        edition_count: newBook.edition_count,
        first_publish_year: newBook.first_publish_year,
        title: newBook.title,
        subject_place: newBook.subject_place,
        subject_date: newBook.subject_date,
        note: newBook.note,
        cover_id: imageData, // Pass base64 image data
      };

      await axios.post('http://localhost:3000/books', bookData);
      notifySuccess("Successfully added book");

      dispatch(fetchBooks()); // Dispatch the fetchBooks action to update the state with the new book list
      setTimeout(() => {
        navigate(`/book`);
      }, 1000);

      setNewBook({
        author: '',
        edition_count: '',
        first_publish_year: '',
        title: '',
        subject_place: '',
        subject_date: '',
        note: '',
      });
    } catch (error) {
      notifyError('Book not added');
    }
  };

  const readImageData = (file) => {
    return new Promise((resolve, reject) => {
      if (!file) {
        resolve(null);
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewBook({
      ...newBook,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAddBook();
  };

  const handleCancel = () => {
    navigate('/book');
  };

  return (
    <Container maxWidth="sm">
      <form onSubmit={handleSubmit} className="add-book-form">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="text"
              name="author"
              value={newBook.author}
              onChange={handleChange}
              label="Author"
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="text"
              name="edition_count"
              value={newBook.edition_count}
              onChange={handleChange}
              label="Edition Count"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="text"
              name="first_publish_year"
              value={newBook.first_publish_year}
              onChange={handleChange}
              label="First Publish Year"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              type="text"
              name="title"
              value={newBook.title}
              onChange={handleChange}
              label="Title"
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              type="text"
              name="subject_place"
              value={newBook.subject_place}
              onChange={handleChange}
              label="Subject Place"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              type="text"
              name="subject_date"
              value={newBook.subject_date}
              onChange={handleChange}
              label="Subject Date"
            />
          </Grid>
          <Grid item xs={12}>
            <TextareaAutosize
              rowsMin={3}
              name="note"
              value={newBook.note}
              onChange={handleChange}
              placeholder="Note"
              style={{ width: '100%' }}
            />
          </Grid>
          <Grid item xs={12}>
            <input
              type="file"
              onChange={handleFileChange}
              accept="image/*"
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Add Book
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button variant="outlined" color="secondary" onClick={handleCancel}>
              Cancel
            </Button>
          </Grid>
        </Grid>
      </form>
      <ToastContainer />
    </Container>
  );
};

export default AddBookForm;
