import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Loading from '../Loader/Loader';
import coverImg from '../../images/cover_not_found.jpg';
import { fetchBooks } from '../../redux/bookSlice';
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
import ErrorBoundary from '../../ErrorBoundary';

const BookDetails = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [book, setBook] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState(""); 
  const [ratings, setRatings] = useState({ rating: 0 });
  const [isFollowing, setIsFollowing] = useState(false);
  const navigate = useNavigate();
  const userId = 1; // Assume logged in user has ID 1

  const dispatch = useDispatch();
  const books = useSelector((state) => state.books.books);

  useEffect(() => {
    setLoading(true);
    async function getBookDetails() {
      const selectedBook = books.find(book => book.id === id);

      if (selectedBook) {
        setBook(selectedBook);
      } else {
        setBook(null);
      }    
      
        

      try {
        const comment = await axios.get(`http://localhost:3005/comments`);
        let data = comment.data.find( res => res.id === id)
        setComments(data.comments) 
        

       
      } catch (error) {
        await axios.post(`http://localhost:3005/comments`,{id:id,comment:[]})
        console.error("Error fetching data", error);
      }

      try {
        const res = await axios.get(`http://localhost:2000/ratings/${id}`);
        setRatings(res.data);
      } catch (error) {
        console.error("Error fetching data", error);
      }

      try {
        const followResponse = await axios.get(`http://localhost:3006/followers?bookId=${id}`);
       
        setIsFollowing(followResponse.data.length > 0);
      } catch (error) {
        console.error("Error fetching data", error);
      }
      setLoading(false);
    }
    getBookDetails();
  }, [id, books]);

  useEffect(() => {
    if (!books.length) {
      dispatch(fetchBooks());
    }
  }, [dispatch, books.length]);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/books/${id}`);
      dispatch(fetchBooks());
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
      const existingCommentsResponse = await axios.get(`http://localhost:3005/comments/${id}`);
      let existingComments = existingCommentsResponse.data.comments || [];
      existingComments.push(newComment);
      await axios.put(`http://localhost:3005/comments/${id}`, { comments: existingComments });
      notifySuccess("Comment added");
      setNewComment('');
      setComments(existingComments);
    } catch (error) {
      notifyError("Error submitting comment");
    }
  };

  const handleRating = async (newRating) => {
    try {
      await axios.post(`http://localhost:2000/ratings`, { rating: newRating, id: id });
      notifySuccess("Rating submitted");
      setRatings({ rating: newRating });
    } catch (error) {
      notifyError("Error submitting rating");
    }
  };

  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        const response = await axios.get(`http://localhost:3006/followers?bookId=${id}`);
        const followerId = response.data[0].id;
        await axios.delete(`http://localhost:3006/followers/${followerId}`);
        setIsFollowing(false);
        notifySuccess("Unfollowed book");
      } else {
        await axios.post(`http://localhost:3006/followers`, { userId, bookId: id });
        setIsFollowing(true);
        notifySuccess("Followed book");
      }
    } catch (error) {
      notifyError("Error following/unfollowing book");
    }
  };

  console.log(book);

  if (loading) return <Loading />;

  return (
    <ErrorBoundary>
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
          <Card sx={{ height: 450, width: 300, objectFit: 'contain' }}>
            <CardMedia component="img" image={book?.cover_id || coverImg} alt="cover img" />
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
        <Button variant="contained" color={isFollowing ? "secondary" : "primary"} onClick={handleFollowToggle}>
          {isFollowing ? "Unfollow" : "Follow"}
        </Button>
      </Box>

      <Box mt={4}>
        <Typography variant="h5" component="div" gutterBottom>
          Comments
        </Typography>
        {comments !== undefined ? (
          <List>
            {comments.map((comment, index) => (
              <ListItem key={index} alignItems="flex-start">
                <ListItemText primary={comment} />
              </ListItem>
            ))}
          </List>
        ) : (
          <div></div>
        )}
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
          onChange={handleRating}
          value={ratings.rating}
        />
      </Box>
    </Container>
    </ErrorBoundary>
  );
};

export default BookDetails;
