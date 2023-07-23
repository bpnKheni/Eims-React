import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "react-bootstrap";

import "../../styles/StudentRecords.scss";
import { Label } from "../../../components/shared/forms";
import StudentCard from "../../../components/shared/Card";
import StandardSelect from "../../../components/shared/options/StandardSelect";
import { actions } from "../../../redux/store";
import BatchSelect from "../../../components/shared/options/BatchSelect";
import { useGetStudentRecordQuery } from "../../../api/student";
import { isValidArray } from "../../../utils/constants/validation/array";
import { StandardModifiedSelectStyle } from "../../../components/shared/options/styles/CreatableSelect";

const StudentRecords = () => {
    const navigate = useNavigate();
    const { selectedStandard: standardId, selectedBatch: batchId } = useSelector((state) => state.student);

    /// need to pass query inside params and not in the body
    const { data: studentRecord, isFetching } = useGetStudentRecordQuery({ standardId, batchId }, { refetchOnMountOrArgChange: true });

    const navigateToStudentDetails = (e, data) => {
        e.preventDefault();
        navigate("/student-records/student-details/personal-details");
        localStorage.setItem("STUDENT_DETAIL", JSON.stringify({ ...data, standardId }));
    };

    return (
        <>
            <Row>
                <Col className="text-center">{""}</Col>
            </Row>

            <div>
                <Row className="mt-2">
                    <Col className="">
                        <Label name="Standard" title="Standard" />
                        <StandardSelect styles={StandardModifiedSelectStyle} handleChange={(standard) => actions.student.setStandard(standard)} />
                    </Col>
                    <Col className="">
                        <Label name="Batch" title="Batch" />
                        <BatchSelect styles={StandardModifiedSelectStyle} handleChange={(batch) => actions.student.setBatch(batch)} />
                    </Col>
                </Row>
                <Row className="gy-3 gx-3 pb-5 px-2 mt-3" style={{ height: "calc(100vh - 220px)", overflow: "auto" }}>
                    {!isFetching &&
                        isValidArray(studentRecord?.data) &&
                        studentRecord?.data?.map((data, idx) => {
                            return (
                                <Col key={idx} sm={6} md={6} lg={4} xl={4} xxl={3}>
                                    <div onClick={(e) => navigateToStudentDetails(e, data)} className="text-decoration-none h-100">
                                        <StudentCard studentData={data} />
                                    </div>
                                </Col>
                            );
                        })}
                </Row>
            </div>
        </>
    );
};

export default StudentRecords;
