import { useEffect, useState } from "react";
import Select from "react-select";

import "./style.scss";
import { useGetSubjectQuery } from "../../../api/subject";
import { useCreateStandardAndSubjectMutation, useGetStandardAndSubjectQuery } from "../../../api/standardAndSubject";
import Table from "../../../components/shared/Table";
import { showErrorToast } from "../../../utils/constants/api/toast";
import { standardSelectStyle } from "../../../components/shared/options/styles/CreatableSelect";
import { actions } from "../../../redux/store";
import { useSelector } from "react-redux";
import { Form } from "react-bootstrap";

const StandardAndSubject = () => {
    const selectedOption = useSelector((state) => state.student.selectedStdAndSub);

    const [standardAndSubject, setStandardAndSubject] = useState([]);
    const [currentStandardSubjects, setCurrentStandardSubjects] = useState([]);
    const [currentStandardData, setCurrentStandardData] = useState({});
    const [subjects, setSubjects] = useState([]);

    const { data: subjectResponse, isFetching } = useGetSubjectQuery();

    const { data: stdAndSubjectResponse, isFetching: isStandardAndSubjectFetching } = useGetStandardAndSubjectQuery(null, { refetchOnMountOrArgChange: false });
    const [addStdAndSubjectReq, { isLoading }] = useCreateStandardAndSubjectMutation();

    useEffect(() => {
        actions.student.setStandardAndSubject(null);
    }, []);

    useEffect(() => {
        if (!subjectResponse || !stdAndSubjectResponse) return;

        const newStdAndSubjectOption = stdAndSubjectResponse.data?.map((item) => ({
            value: item?.standardId,
            label: item?.standard,
            data: item,
        }));

        setStandardAndSubject(newStdAndSubjectOption);
        setSubjects(subjectResponse?.data);
    }, [subjectResponse, stdAndSubjectResponse]);

    const handleStandardSelection = (currentStandardObj) => {
        actions.student.setStandardAndSubject(currentStandardObj);
        setCurrentStandardData(currentStandardObj?.data || {});
        setCurrentStandardSubjects(currentStandardObj ? currentStandardObj?.data?.subjects?.map((subject) => subject.sub) : []);
    };

    const updateCurrentSubject = (name, checked) => {
        const updatedSubjects = [...currentStandardSubjects];
        if (checked) updatedSubjects.push(name);
        else {
            const index = updatedSubjects.indexOf(name);
            if (index > -1) updatedSubjects.splice(index, 1);
        }
        setCurrentStandardSubjects(updatedSubjects);
    };

    const updateFees = (subjectName, value) => {
        const { subjects: subjectObj } = currentStandardData || {};
        const subjectIndex = subjectObj.findIndex(({ sub }) => sub === subjectName);

        const currentSubjectsArray = [...subjectObj];
        if (subjectIndex !== -1) {
            currentSubjectsArray[subjectIndex] = {
                ...currentSubjectsArray[subjectIndex],
                fees: value,
            };
        } else {
            const extraSubjectIndex = subjects.findIndex((subject) => subject.name === subjectName);
            if (extraSubjectIndex === -1) return;

            const newSubject = { sub: subjectName, fees: value };
            currentSubjectsArray.push(newSubject);
        }

        setCurrentStandardData((prevState) => ({ ...prevState, subjects: currentSubjectsArray }));
    };

    const handleFeesValAsPerSubject = (subjectObj) => currentStandardData?.subjects?.find((subject) => subject.sub === subjectObj.name)?.fees || "";

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentStandardData?.standardId) showErrorToast("Provide a standard");
        else {
            const missingFeesSubjects = subjects.filter(
                (subject) => currentStandardSubjects.includes(subject.name) && !currentStandardData.subjects.find((s) => s.sub === subject.name)?.fees
            );
            // if (missingFeesSubjects.length > 0) showErrorToast("Please enter fees for all selected subjects");
            // else {
                const selectedData = preparePayload(currentStandardSubjects, currentStandardData, subjects);
                await addStdAndSubjectReq(selectedData);
            // }
        }
    };

    const columns = [
        {
            name: "",
            label: "Select",
            renderer: (subjectObj) => (
                <Form.Check
                    type="checkbox"
                    disabled={!selectedOption}
                    name={subjectObj.name}
                    checked={currentStandardSubjects.includes(subjectObj.name)}
                    onChange={(e) => updateCurrentSubject(e.target.name, e.target.checked)}
                    className="shadow-none table_checkbox"
                />
            ),
        },
        { name: "name", label: "Subject" },
        {
            name: "",
            label: "Fees",
            renderer: (subjectObj) => (
                <input
                    type="number"
                    value={`${handleFeesValAsPerSubject(subjectObj)}`}
                    disabled={!currentStandardSubjects.includes(subjectObj.name)}
                    onChange={(e) => updateFees(subjectObj.name, e.target.value)}
                    min={0}
                    className={currentStandardSubjects?.includes(subjectObj?.name) ? "fees__input" : "d-none"}
                />
            ),
        },
    ];

    return (
        <form className="position-relative h-100 bottom-0">
            <div className="w-100 d-flex justify-content-center mt-3 ">
                <label className="label bg_of_select1 bg-white w-50 ">
                    Standard
                    <Select
                        isDisabled={isFetching || isStandardAndSubjectFetching}
                        value={selectedOption}
                        onChange={(currentVal) => handleStandardSelection(currentVal)}
                        options={standardAndSubject}
                        components={{ IndicatorSeparator: () => null }}
                        styles={standardSelectStyle}
                    />
                </label>
            </div>
            <div className="master_wrappers_scroll">
                <div className="mt-3 border border-dark table_last_columns_width">
                    <Table columns={columns} items={subjects} />
                </div>
                <div className="d-flex justify-content-center mt-3">
                    <button className="button-submit" onClick={handleSubmit} disabled={isLoading || isFetching}>
                        Submit
                    </button>
                </div>
            </div>
        </form>
    );
};

export default StandardAndSubject;

const preparePayload = (currentStandardSubjects, currentStandardData, subjects) => {
    return {
        standardId: currentStandardData?.standardId,
        subjects: currentStandardSubjects.map((subjectName) => {
            const subject = subjects.find((s) => s.name === subjectName);
            const fees = currentStandardData.subjects.find((s) => s.sub === subjectName)?.fees || "";
            return {
                subject: subject?._id || "",
                fees: fees,
            };
        }),
    };
};

// Set the default option as the first option
// if (newStdAndSubjectOption.length > 0) {
//     // setSelectedOption(newStdAndSubjectOption[0]);
//     actions.student.setStandardAndSubject(newStdAndSubjectOption[0]);
//     setCurrentStandardData(newStdAndSubjectOption[0]?.data || {});
//     setCurrentStandardSubjects(newStdAndSubjectOption[0]?.data?.subjects?.map((subject) => subject.sub) || []);
// }
