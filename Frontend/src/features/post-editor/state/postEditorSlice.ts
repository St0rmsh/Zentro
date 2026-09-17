import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface EditorState {
  title: string;
  subtitle?: string;
  content: string;
  category: string;
  tags: string[];
  coverImage?: string;
  isPublished: boolean;
  
  // UI State
  isSaving: boolean;
  lastSavedAt?: string;
  uploadProgress: number;
  validationErrors: Record<string, string>;
  isDirty: boolean;
}

const initialState: EditorState = {
  title: '',
  subtitle: '',
  content: '',
  category: 'General',
  tags: [],
  isPublished: false,
  
  isSaving: false,
  uploadProgress: 0,
  validationErrors: {},
  isDirty: false,
};

const postEditorSlice = createSlice({
  name: 'postEditor',
  initialState,
  reducers: {
    setEditorState: (state, action: PayloadAction<Partial<EditorState>>) => {
      return { ...state, ...action.payload, isDirty: true };
    },
    resetEditor: () => initialState,
    setSavingStatus: (state, action: PayloadAction<boolean>) => {
      state.isSaving = action.payload;
    },
    setLastSavedAt: (state, action: PayloadAction<string>) => {
      state.lastSavedAt = action.payload;
      state.isDirty = false;
    },
    setUploadProgress: (state, action: PayloadAction<number>) => {
      state.uploadProgress = action.payload;
    },
    setValidationErrors: (state, action: PayloadAction<Record<string, string>>) => {
      state.validationErrors = action.payload;
    },
    clearValidationErrors: (state) => {
      state.validationErrors = {};
    }
  },
});

export const { 
  setEditorState, 
  resetEditor, 
  setSavingStatus, 
  setLastSavedAt, 
  setUploadProgress,
  setValidationErrors,
  clearValidationErrors
} = postEditorSlice.actions;

export default postEditorSlice.reducer;
