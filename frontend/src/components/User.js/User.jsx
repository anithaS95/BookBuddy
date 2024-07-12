import React from 'react';
import { Container, Grid, Card, CardContent, Typography, List, ListItem, ListItemText, Avatar } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(4),
  },
  card: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  avatar: {
    width: theme.spacing(7),
    height: theme.spacing(7),
    marginBottom: theme.spacing(2),
  },
  list: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
}));

const UserProfile = () => {
 

  return (
    <Container >
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card >
            <CardContent>
              <Avatar
                alt="User Profile"
                src="" // Placeholder image
                
              />
              <Typography variant="h5" component="h2">
                XYZ
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Card >
            <CardContent>
              <Typography variant="h6" component="h3">
                Following List
              </Typography>
              <List >
                <ListItem>
                  <ListItemText primary="User 1" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="User 2" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="User 3" />
                </ListItem>
                {/* Add more list items as needed */}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default UserProfile;
