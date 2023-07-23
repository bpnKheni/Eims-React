import { createSlice } from "@reduxjs/toolkit";
import { defaultEducationalValues, defaultGuardianValues, defaultPersonalValues } from "../../utils/constants/api/defaultValue";

export const enquirySlice = createSlice({
    name: "enquiry",
    initialState: {
        personalData: defaultPersonalValues,
        educationData: defaultEducationalValues,
        guardianData: defaultGuardianValues,
        MobileNumber: "",
        enquiryNumber: "",
        isUpdatingEnquiry: false,
        isConfirmingAdmission: false,
        isStudentConfirmed: false,
        studentId: "",
        schoolId: { value: "", label: "", id: "" },
    },
    reducers: {
        addMobileNumber: (state, action) => {
            state.MobileNumber = action.payload;
        },
        addEnquiryNumber: (state, action) => {
            state.enquiryNumber = action.payload;
        },
        addPersonalData: (state, action) => {
            state.personalData = action.payload;
        },
        addEducationData: (state, action) => {
            state.educationData = action.payload;
        },
        addGuardianData: (state, action) => {
            state.guardianData = action.payload;
        },
        setIsUpdatingEnquiry: (state, action) => {
            state.isUpdatingEnquiry = action.payload;
        },
        setIsConfirmAdmission: (state, action) => {
            state.isConfirmingAdmission = action.payload;
        },
        setStudentId: (state, action) => {
            state.studentId = action.payload;
        },
        setSelectedSchool: (state, action) => {
            state.schoolId = action.payload;
        },
        setIsStudentConfirmed: (state, action) => {
            state.isStudentConfirmed = action.payload;
        },
        resetMobileNumber: (state) => {
            state.MobileNumber = "";
        },
        resetPersonalData: (state) => {
            state.personalData = defaultPersonalValues;
        },
        resetEducationData: (state) => {
            state.educationData = defaultEducationalValues;
        },
        resetGuardianData: (state) => {
            state.guardianData = defaultGuardianValues;
        },
        resetEnquiryNumber: (state) => {
            state.enquiryNumber = "";
        },
    },
});

export const {
    addPersonalData,
    addEducationData,
    addGuardianData,
    addMobileNumber,
    addEnquiryNumber,
    setIsUpdatingEnquiry,
    setIsConfirmAdmission,
    setStudentId,
    setSelectedSchool,
    resetPersonalData,
    resetEducationData,
    resetGuardianData,
    resetMobileNumber,
    resetEnquiryNumber,
    setIsStudentConfirmed,
} = enquirySlice.actions;

export default enquirySlice.reducer;
