import moment from "moment";
import { API } from "./schemas";
import { addDays } from "date-fns";
const { EDUCATIONAL, GUARDIAN, PERSONAL } = API.ENQUIRY;

export const defaultPersonalValues = {
    [PERSONAL.PHOTO]: null,
    [PERSONAL.PREFIX]: "mr",
    [PERSONAL.FIRST_NAME]: "",
    [PERSONAL.LAST_NAME]: "",
    [PERSONAL.MIDDLE_NAME]: "",
    [PERSONAL.HOUSE_NO]: "",
    [PERSONAL.ADDRESS1]: "",
    [PERSONAL.ADDRESS2]: "",
    [PERSONAL.LANDMARK]: "",
    [PERSONAL.PINCODE]: "",
    [PERSONAL.CITY]: "",
    [PERSONAL.STATE]: "",
    [PERSONAL.DATE_OF_BIRTH]: null,
    [PERSONAL.GENDER]: "male",
};

export const defaultEducationalValues = {
    [EDUCATIONAL.STANDARD_ID]: "",
    [EDUCATIONAL.PASS_FROM]: "false",
    [EDUCATIONAL.SCHOOL_TIME]: "",
    [EDUCATIONAL.LAST_YEAR_PERCENTAGE]: "",
    [EDUCATIONAL.SCHOOL]: "",
    // [EDUCATIONAL.SUBJECTS]: [
    //     // Subject IDs Array
    //     { [EDUCATIONAL.SUBJECT]: "" },
    // ],
    [EDUCATIONAL.FEES]: "",
    [EDUCATIONAL.DISCOUNT]: "",
    [EDUCATIONAL.REMARK_FOR_FEES]: "",
    [EDUCATIONAL.REMARK_FOR_STUDENT]: "",
    [EDUCATIONAL.REFERENCE]: "",
};

export const defaultSiblingValues = {
    [GUARDIAN.STUDY_HERE]: "false",
    [GUARDIAN.SIBLING_CONTACT1]: "",
    [GUARDIAN.SIBLING_LAST_NAME]: "",
    [GUARDIAN.SIBLING_MIDDLE_NAME]: "",
    [GUARDIAN.SIBLING_FIRST_NAME]: "",
    [GUARDIAN.SIBLING_PREFIX]: "mr",
};

export const defaultGuardianValues = {
    [GUARDIAN.PARENT_PREFIX]: "mr",
    [GUARDIAN.PARENT_LAST_NAME]: "",
    [GUARDIAN.PARENT_FIRST_NAME]: "",
    [GUARDIAN.PARENT_MIDDLE_NAME]: "",
    [GUARDIAN.CONTACT1]: "",
    [GUARDIAN.SMS_ON1]: "false",
    [GUARDIAN.CONTACT2]: "",
    [GUARDIAN.SMS_ON2]: "false",
    [GUARDIAN.OCCUPATION]: "",
    [GUARDIAN.SIBLINGS]: [],
};

export const defaultMobileNumber = {
    MobileNumber: "",
};

export const defaultAdmissonConfirm = {
    studentId: "",
    addmissionDate: new Date(),
    batchId: "",
    rollNumber: "",
    date: new Date(),
    amount: null,
    totalFees: null,
    mode: "cash",
    chequeNumber: "",
    shiftId: "",
    reason: "",
};

export const defaultAttendance = {
    standardId: "",
    date: new Date(),
    batchId: "",
    studentId: [
        {
            studentId: "",
            attendance: true,
        },
    ],
};

export const defaultStaffValue = {
    prefix: "mr",
    surName: "",
    name: "",
    fatherName: "",
    address: "",
    building: "",
    area: "",
    landmark: "",
    contact1: "",
    contact2: "",
    dateOfBirth: "",
    email: "",
    qualification: "",
    designation: "",
    password: "",
    role: "",
    isActive: true,
    salary: null,
    standardSubject: [{ standardId: "", subjectId: "" }],
};

export const defaultCreateNotice = {
    standardId: "",
    batchId: "",
    date: addDays(new Date(), 1),
    title: "",
    details: "",
};

export const defaultAccountFilterObj = {
    startDate: "",
    endDate: "",
    byFees: "",
    feesReportFrom: "",
    feesReportTo: "",
    byPaymentMethod: "",
    chequeNumber: "",
};

export const defaultProgressFilterObj = {
    startDate: "",
    endDate: "",
    lastFewExamFrom: "",
    lastFewExamTo: "",
};

export const defaultExamReportValues = {
    testNumber: "",
    standardId: "",
    studentResult: [
        {
            studentId: "",
            marks: null,
            isAbsent: false,
        },
    ],
};

export const defaultExamValue = {
    standardId: "",
    subjectId: "",
    date: new Date(),
    totalMarks: "",
    testNumber: "",
    notes: "",
};
