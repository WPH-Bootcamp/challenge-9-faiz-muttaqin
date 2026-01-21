import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FilterState } from '@/types';

const initialState: FilterState = {
  category: 'all',
  minPrice: 0,
  maxPrice: 1000000,
  minRating: 0,
  sortBy: 'name',
  searchQuery: '',
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setCategory: (state, action: PayloadAction<string>) => {
      state.category = action.payload;
    },
    setPriceRange: (
      state,
      action: PayloadAction<{ min: number; max: number }>
    ) => {
      state.minPrice = action.payload.min;
      state.maxPrice = action.payload.max;
    },
    setMinRating: (state, action: PayloadAction<number>) => {
      state.minRating = action.payload;
    },
    setSortBy: (
      state,
      action: PayloadAction<'name' | 'price-asc' | 'price-desc' | 'rating'>
    ) => {
      state.sortBy = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    resetFilters: (state) => {
      state.category = 'all';
      state.minPrice = 0;
      state.maxPrice = 1000000;
      state.minRating = 0;
      state.sortBy = 'name';
      state.searchQuery = '';
    },
  },
});

export const {
  setCategory,
  setPriceRange,
  setMinRating,
  setSortBy,
  setSearchQuery,
  resetFilters,
} = filtersSlice.actions;

export default filtersSlice.reducer;

// Selectors
export const selectFilters = (state: { filters: FilterState }) => state.filters;
