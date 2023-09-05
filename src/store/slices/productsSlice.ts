import {
  createSlice,
  PayloadAction,
  createAction,
  createAsyncThunk,
} from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import { RootState } from '@/store/store';
import CategoryController from '@/api/controllers/CategoryController';
import { ICategoryWithSubcategories } from '@/api/types';

const hydrateAction = createAction<SliceTypes>(HYDRATE);

export interface ProductsState {
  products: [];
  categories: ICategoryWithSubcategories[];
}

const initialState: ProductsState = {
  products: [],
  categories: [],
};

export const getAllCategories = createAsyncThunk(
  'products/fetchAllCategories',
  async (): Promise<ICategoryWithSubcategories[]> => {
    const productController = new CategoryController();
    const response = await productController.getCategoriesWithSubcategories();
    console.log('response fetchAllCategories', response);

    return response;
  }
);

enum ESlices {
  products = 'products',
}

type SliceTypes = Record<ESlices, string[]>;

export const productsSlice = createSlice({
  name: ESlices.products,
  initialState,
  reducers: {
    setStateProducts(state: ProductsState, action: PayloadAction<[]>) {
      return {
        ...state,
        products: action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      hydrateAction,
      (
        state: ProductsState,
        action: PayloadAction<SliceTypes>
      ): ProductsState => ({
        ...state,
        ...action.payload.products,
      })
    );
    builder.addCase(
      getAllCategories.fulfilled,
      (
        state: ProductsState,
        action: PayloadAction<ICategoryWithSubcategories[]>
      ): ProductsState =>
        // const { results, total } = action.payload;
        // const newFilteredProducts = [...results];
        ({
          ...state,
          categories: action.payload,
          // totalFilteredProducts: total,
        })
    );
  },
});

export const { setStateProducts } = productsSlice.actions;
export const selectProductState = (state: RootState): ProductsState =>
  state.products;

export default productsSlice.reducer;
