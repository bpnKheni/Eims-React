import { isValidArray } from "../validation/array";

function validateAndPreparePayload(data) {
    const siblings = data || [];
    const arr = [];
    siblings.forEach((sibling, index) => {
        const { studyHere, siblingContact1, siblingLastName, siblingMiddleName, siblingFirstName, siblingPrefix } = sibling;
        const isValid = studyHere !== undefined && siblingContact1 && siblingLastName && siblingMiddleName && siblingFirstName && siblingPrefix;
        if (!isValid && index === 0) return;
        isValid && arr.push(sibling);
    });

    return arr;
}

export const appendIntoFormData = (payload) => {
    const formData = new FormData();
    Object.entries(payload)?.forEach(([name, value]) => {
        if (["subjects"].includes(name)) return formData.append(name, JSON.stringify(value));
        if (["siblings"].includes(name)) {
            const data = validateAndPreparePayload(value);
            return formData.append(name, isValidArray(data) ? JSON.stringify(data) : null);
        }
        if (name === "photo") return formData.append(name, value ?? null);
        value && formData.append(name, value);
    });
    return formData;
};

// Common function for appending payload data in to formdata
export const prepareFormData = (payload) => {
    const formData = new FormData();
    if (!payload) return null;
    Object.entries(payload)?.forEach(([name, value]) => {
        value && formData.append(name, value);
    });
    return formData;
};

export const setFormValues = (formData, setValue) => {
    Object.entries(formData).forEach(([name, value]) => setValue(name, value));
};
