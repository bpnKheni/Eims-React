import { createSlice } from "@reduxjs/toolkit";

export const studentSlice = createSlice({
    name: "student",
    initialState: {
        selectedStandard: "",
        selectedBatch: "",
        selectedSubject: "",
        selectedStdAndSub: null,
    },
    reducers: {
        setStandard: (state, action) => {
            state.selectedStandard = action.payload;
        },
        setBatch: (state, action) => {
            state.selectedBatch = action.payload;
        },
        setSubject: (state, action) => {
            state.selectedSubject = action.payload;
        },
        setStandardAndSubject: (state, action) => {
            state.selectedStdAndSub = action.payload;
        },
    },
});

export const { setStandard, setBatch, setSubject, setStandardAndSubject } = studentSlice.actions;

export default studentSlice.reducer;
