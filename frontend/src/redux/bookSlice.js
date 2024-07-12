import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const URL = "http://localhost:3000/books";

export const fetchBooks = createAsyncThunk('books/fetchBooks', async () => {
  const response = await axios.get(URL);
  return response.data;
});

const bookSlice = createSlice({
  name: 'books',
  initialState: {
    books: [],
    loading: false,
    resultTitle: '',
    searchTerm: 'the lost world',
  },
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setResultTitle: (state, action) => {
      state.resultTitle = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.books = action.payload;
        state.resultTitle = action.payload.length > 0 ? 'Your Search Result' : 'No Search Result Found!';
      })
      .addCase(fetchBooks.rejected, (state) => {
        state.loading = false;
        state.books = [];
        state.resultTitle = 'No Search Result Found!';
      });
  },
});

export const { setSearchTerm, setResultTitle } = bookSlice.actions;

export default bookSlice.reducer;
  