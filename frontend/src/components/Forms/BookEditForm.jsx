import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Loading from "../Loader/Loader";
import axios from 'axios';
import {
  Container,
  Grid,
  TextField,
  Button,
  Typography,
  Box
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { notifySuccess } from '../../toastConfig';
import { ToastContainer } from 'react-toastify';
import { fetchBooks } from '../../redux/bookSlice';

const URL = "http://localhost:3000/books";

const BookEdit = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [book, setBook] = useState(null);
  const [coverImage, setCoverImage] = useState(null); // State to hold the cover image data URL
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const books = useSelector(state => state.books.books); // Access the books from the Redux store

  useEffect(() => {
    setLoading(true);
    async function getBookDetails() {
      const bookData = books.find(data => data.id === id);
      if (bookData) {
        setBook(bookData);
        setCoverImage(bookData.cover_id); // Set initial cover image data URL
      } else {
        setBook(null);
      }
      setLoading(false);
    }
    getBookDetails();
  }, [id, books]);

  const handleUpdate = async (updatedBook) => {
    try {
      await axios.put(`${URL}/${id}`, updatedBook);
      // Dispatch updateBook action
      notifySuccess("Successfully updated book");
      setTimeout(() => {
        navigate(`/book/${id}`);
      }, 1000);
    } catch (error) {
      console.error('Error updating book:', error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result); // Set the data URL for the cover image
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedBook = {
      id: book.id,
      author: e.target.author.value,
      cover_id: coverImage, // Use the data URL of the image as cover_id
      edition_count: e.target.edition_count.value,
      first_publish_year: e.target.first_publish_year.value,
      title: e.target.title.value,
      subject_place: e.target.subject_place.value,
      subject_date: e.target.subject_date.value,
      note: e.target.note.value,
    };

    handleUpdate(updatedBook);
  };

  if (loading) return <Loading />;

  return (
    <Container maxWidth="md">
      <ToastContainer />
      <Box my={4}>
        <Button variant="contained" onClick={() => navigate(`/book/${id}`)}>
          Go Back
        </Button>
        <Typography variant="h4" component="h1" gutterBottom>
          Edit Book
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="title"
                label="Title"
                defaultValue={book?.title}
                variant="outlined"
                multiline
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="author"
                label="Author"
                defaultValue={book?.author}
                variant="outlined"
                multiline
                required
              />
            </Grid>
            <Grid item xs={12}>
              <input
                type="file"
                name="cover_id"
                accept="image/*"
                onChange={handleFileChange} // Handle file selection
              />
            </Grid>
            {coverImage && ( // Display preview of the selected image
              <Grid item xs={12}>
                <img src={coverImage} alt="Cover Preview" style={{ maxWidth: '100%' }} />
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="edition_count"
                label="Edition Count"
                defaultValue={book?.edition_count}
                variant="outlined"
                type="number"
                multiline
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="first_publish_year"
                label="First Publish Year"
                defaultValue={book?.first_publish_year}
                variant="outlined"
                type="number"
                multiline
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="subject_place"
                label="Subject Place"
                defaultValue={book?.subject_place}
                variant="outlined"
                multiline
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="subject_date"
                label="Subject Date"
                defaultValue={book?.subject_date}
                variant="outlined"
                multiline
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="note"
                label="Note"
                defaultValue={book?.note}
                variant="outlined"
                multiline
                rows={4}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary">
                Save Changes
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Container>
  );
};

export default BookEdit;
