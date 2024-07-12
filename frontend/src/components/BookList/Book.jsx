import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import coverImg from "../../images/cover_not_found.jpg";

const BookCard = (book) => {
  
  return (
    <Card sx={{ maxWidth: 300 }}>
      <CardMedia
        sx={{ height: 260 }}
        image={book.cover_id || coverImg}
        title={book.title}
      />
      <CardContent>
        <Typography gutterBottom variant="h4" component="div" fontWeight={700}>
          {book.title}
        </Typography>
        <Typography variant="h5" color="text.secondary">
          <span style={{ fontWeight: 600 }}>Author:</span> {book.author}
        </Typography>
        <Typography variant="h5" color="text.secondary">
          <span style={{ fontWeight: 600 }}>Total Editions:</span> {book.edition_count}
        </Typography>
        <Typography variant="h5" color="text.secondary">
          <span style={{ fontWeight: 600 }}>First Publish Year:</span> {book.first_publish_year}
        </Typography>
      </CardContent>
      <CardActions>
        <Link to={`/book/${book.id}`}>
          <Button size="small">Learn More</Button>
        </Link>
      </CardActions>
    </Card>
  );
};

export default BookCard;
