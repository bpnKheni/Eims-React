import { createSlice } from "@reduxjs/toolkit";
import { defaultAccountFilterObj, defaultProgressFilterObj } from "../../utils/constants/api/defaultValue";

export const utilsSlice = createSlice({
    name: "utils",
    initialState: {
        passwordStr: "",
        accountFilterObj: defaultAccountFilterObj,
        progressFilterObj: defaultProgressFilterObj,
    },
    reducers: {
        setPasswordStr: (state, action) => {
            state.passwordStr = action.payload;
        },
        setAccountFilter: (state, action) => {
            state.accountFilterObj = action.payload;
        },
        setProgressFilter: (state, action) => {
            state.progressFilterObj = action.payload;
        },
    },
});

export const { setPasswordStr, setAccountFilter } = utilsSlice.actions;

export default utilsSlice.reducer;
