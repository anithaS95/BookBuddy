# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)




//addbook 

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Loading from '../Loader/Loader';
import coverImg from '../../images/cover_not_found.jpg';
import { useGlobalContext } from '../../context.';
import axios from 'axios';
import { notifySuccess, notifyError } from '../../toastConfig';
import { ToastContainer } from 'react-toastify';
import Rating from 'react-rating-stars-component';
import {
  Container,
  Grid,
  Typography,
  Button,
  IconButton,
  Box,
  Card,
  CardMedia,
  CardContent,
  TextField,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import './BookDetails.css';

const BookDetails = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [book, setBook] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const { fetchBooks, books } = useGlobalContext();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    async function getBookDetails() {
      const selectedBook = books.find(book => book.id === id);

      if (selectedBook) {
        setBook(selectedBook);
      } else {
        setBook(null);
      }

      // try {
      //   const response = await axios.get(`http://localhost:9000/books/${id}`);
      //   setComments(response.data);
      //   console.log(response.data,"res");
      // } catch (error) {
      //   console.error("Error fetching comments", error);
      // }

      setLoading(false);
    }
    getBookDetails();
  }, [id, books, fetchBooks]);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8000/books/${book.id}`);
      notifySuccess("Successfully deleted");
      fetchBooks();
      setTimeout(() => {
        navigate('/book');
      }, 1000);

    } catch (error) {
      notifyError("Error deleting book");
    }
  };

  const handleUpdate = () => {
    navigate(`/book/${id}/edit`);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(newComment)
      await axios.post(`http://localhost:3000/comments`,{comment:newComment});
      setNewComment('');
    } catch (error) {
      notifyError("Error submitting comment");
    }
  };

  const handleRating = async (newRating) => {
    try {
      const response = await axios.post(`/books/${id}/rate`, { rating: newRating });
      setBook(response.data);
      notifySuccess("Rating submitted");
    } catch (error) {
      notifyError("Error submitting rating");
    }
  };
  

  

  if (loading) return <Loading />;

  return (
    <Container className="book-details" sx={{ mt: 4 }}>
      <ToastContainer />
      <IconButton onClick={() => navigate('/book')} sx={{ mb: 2 }}>
        <ArrowBackIcon fontSize="large" />
        <Typography variant="body1" sx={{ ml: 1 }}>
          Go Back
        </Typography>
      </IconButton>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: 450, width: 350, objectFit: 'contain' }}>
            <CardMedia component="img" image={book?.cover_id} alt="cover img" />
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={8}>
          <CardContent>
            <Typography variant="h4" component="div" gutterBottom>
              {book?.title}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Author:</strong> {book?.author}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Subject Places:</strong> {book?.subject_place}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Subject Date:</strong> {book?.subject_date}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Subjects:</strong> {book?.note}
            </Typography>
          </CardContent>
        </Grid>
      </Grid>

      <Box mt={4} display="flex" justifyContent="space-between">
        <Button variant="contained" color="primary" onClick={handleUpdate}>
          Update Book
        </Button>
        <Button variant="contained" color="secondary" onClick={handleDelete}>
          Delete Book
        </Button>
      </Box>

      <Box mt={4}>
        <Typography variant="h5" component="div" gutterBottom>
          Comments
        </Typography>
        {/* <List>
    {book?.comments.map((comment, index) => (
      <React.Fragment key={index}>
        <ListItem alignItems="flex-start">
          <ListItemText primary={comment} />
        </ListItem>
        {index < book.comments.length - 1 && <Divider variant="inset" component="li" />}
      </React.Fragment>
    ))}
  </List> */}
        <Box mt={2}>
          <form onSubmit={handleCommentSubmit}>
            <TextField
              label="Add a comment"
              variant="outlined"
              fullWidth
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              multiline
              rows={4}
            />
            <Box mt={2} display="flex" justifyContent="flex-end">
              <Button type="submit" variant="contained" color="primary">
                Submit
              </Button>
            </Box>
          </form>
        </Box>
      </Box>

      <Box mt={4}>
        <Typography variant="h5" component="div" gutterBottom>
          Rate this book
        </Typography>
        <Rating
          count={5}
          size={30}
          activeColor="#ffd700"
          value={book?.ratings?.length ? book.ratings.reduce((a, b) => a + b, 0) / book.ratings.length : 0}
          onChange={handleRating}
        />
      </Box>
    </Container>
  );
};

export default BookDetails;




//backend

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'uploads/'));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

app.post('/books', upload.single('cover_id'), async (req, res) => {
  try {
    const { title, author, edition_count, first_publish_year, subject_place, subject_date, note } = req.body;
    const cover_id = req.file ? req.file.filename : '';

    const newBook = new Book({
      title,
      author,
      cover_id,
      edition_count,
      first_publish_year,
      subject_place,
      subject_date,
      note
    });

    const savedBook = await newBook.save();

    res.status(201).json({ message: 'Book added successfully', book: savedBook });
  } catch (error) {
    console.error('Error adding book:', error);
    res.status(500).json({ error: 'Failed to add book' });
  }
});



//old code

import React, { useState } from 'react';
import { useGlobalContext } from '../../context.';
import { useNavigate } from 'react-router-dom';
import { Container, Grid, TextField, TextareaAutosize, Button } from '@mui/material';
import axios from 'axios';
import { notifySuccess, notifyError } from '../../toastConfig';
import { ToastContainer } from 'react-toastify';
import ErrorBoundary from '../../ErrorBoundary';

const AddBookForm = () => {
  const [newBook, setNewBook] = useState({
    author: "",
    cover_id: "",
    edition_count: "",
    first_publish_year: "",
    title: "",
    subject_place: "",
    subject_date: "",
    note: ""
  });

  const { fetchBooks } = useGlobalContext();
  const navigate = useNavigate();

  const handleAddBook = async (newBook) => {
    try {
      console.log(newBook);
      await axios.post('http://localhost:8000/books', newBook);
      notifySuccess("succussfully book added")
      setTimeout(()=>{
        navigate('/book');
      },1000)
      
      fetchBooks();
      setNewBook({
        author: '',
        cover_id: '',
        edition_count: '',
        first_publish_year: '',
        title: '',
        subject_place: '',
        subject_date: '',
        note: '',
      });
    } catch (error) {
      notifyError('book not added');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewBook({
      ...newBook,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAddBook(newBook);
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
              name="cover_id"
              value={newBook.cover_id}
              onChange={handleChange}
              label="Cover ID"
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
      <ToastContainer/>
    </Container>
  );
};

export default AddBookForm;
