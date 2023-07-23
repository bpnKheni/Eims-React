import { useState, useEffect } from "react";
import { Row, Col, Form } from "react-bootstrap";
import "../../styles/admission_enquiry_table.scss";
import Table from "../../../components/shared/Table";
import EditAndDelete from "../../../components/shared/Actions/EditAndDelete";
import Select from "react-select";
import { customStyles } from "../../../components/shared/options/styles/styles";
import { actions } from "../../../redux/store";
import { useGetStandardQuery } from "../../../api/standard";
import { FaFilter } from "react-icons/fa";
import "./style.scss";
import ContactFilter from "../../../components/Filter/ContactFilter";
import { useGetContactListQuery } from "../../../api/contactList";
import { useGetContactsQuery } from "../../../api/studentContact";
import { handleEnquiryFormData } from "../../../components/shared/modals/mobile";
import { useNavigate } from "react-router-dom";

const StudentContact = () => {
    const [standardOptions, setStandardOptions] = useState([]);
    const [selectedStandard, setSelectedStandard] = useState();
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const [isFormVisible, setIsFormVisible] = useState(false);

    const navigate = useNavigate();

    const handleFilterButtonClick = () => setIsFormVisible(!isFormVisible);

    const { data, isFetching } = useGetStandardQuery(null, {
        refetchOnMountOrArgChange: true,
    });

    const { data: studentsContactData, isFetching: isStudentFetching } = useGetContactsQuery();
    console.log("ContactList", studentsContactData);

    const handleEditClick = (item) => {
        console.log("item >>>>> ", item);
        handleEnquiryFormData(item, "UPDATE_DATA");
        actions.enquiry.setIsUpdatingEnquiry(true);
        actions.enquiry.setStudentId(item?.studentId);
        actions.enquiry.addEnquiryNumber(item?.enquiryNumber);
        actions.enquiry.setIsStudentConfirmed(true);
        navigate("/enquiry/form-first");
    };

    const columns = [
        {
            name: "actions",
            label: "Edit&Delete",
            renderer: (student) => (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <EditAndDelete onDelete={(e) => handleOpenDelete(e, student._id)} onEdit={(e) => handleEditClick(student)} />
                </div>
            ),
        },
        {
            name: "standard",
            label: "Standard",
        },
        {
            name: "firstName",
            label: "Student Name",
        },
        {
            name: "middleName",
            label: "Father Name",
        },
        { name: "contact1", label: "Mobile No." },
        { name: "contact2", label: "Mobile No." },
        { name: "userName", label: "Username" },
        {
            name: "password",
            label: "Password",
            renderer: (item) => {
                return <span className="fs-5">{`********`}</span>;
            },
        },
    ];

    useEffect(() => {
        if (!data || data?.status !== 200) return;
        const standardOption = data?.data?.map((item) => ({ value: item?._id, label: item?.name }));
        setStandardOptions([{ label: "Select Standard", value: "" }, ...standardOption]);
    }, [data, selectedStandard]);

    useEffect(() => {
        if (studentsContactData?.status !== 200) return;
        setFilteredData(studentsContactData?.data);

        // Filter by selected standard
        if (selectedStandard && selectedStandard !== "") {
            setFilteredData((prevItem) => {
                return prevItem?.filter((studentObj) => studentObj.standard === selectedStandard?.label);
            });
        }

        // Filter by search query
        const query = searchQuery.toLowerCase();
        if (searchQuery) {
            setFilteredData((prevItem) => {
                return prevItem.filter((studentObj) => {
                    console.log("studentObj >>>> ", studentObj);
                    const nameMatch = studentObj?.studentName?.toLowerCase?.().includes(query);
                    const phoneMatch = String(studentObj?.contact1)?.includes?.(searchQuery) || String(studentObj?.contact2)?.includes?.(searchQuery);
                    return nameMatch || phoneMatch;
                });
            });
        }
    }, [studentsContactData, searchQuery, selectedStandard]);

    const handleOpenDelete = (id) => {
        actions.modal.openDelete({ id, type: "STUDENT-CONTACT" });
    };

    return (
        <>
            <h3 className="mt-3">All Contacts</h3>
            <div className="overflow-x-hidden" style={{ height: "calc(100vh - 140px)", overflow: "auto" }}>
                <Row className="row my-3">
                    <Col sm={6} className={"mb-2 mb-lg-0"}>
                        <Select
                            placeholder="Select Standard"
                            isDisabled={isFetching}
                            value={selectedStandard}
                            onChange={setSelectedStandard}
                            options={standardOptions}
                            styles={customStyles}
                        />
                    </Col>
                    <Col sm={6}>
                        <Form.Control
                            type="text"
                            placeholder="Search by Name and Number"
                            className="input_style shadow-none mb-2 mb-lg-0 mt-2 mt-md-0"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </Col>
                    {/*  <Col sm={6} lg={2} className="col-12 col-sm-6 col-md-6 col-lg-2 col-xl-2 col-xxl-2 mt-2 mt-lg-0 d-flex">
                        <button type="submit" className="button_style">
                            Search
                        </button>
                        <div className="position-relative">
                                <button className="filter-contant border-0" onClick={handleFilterButtonClick}>
                                    <FaFilter size={28} />
                                </button>
                            <div className="overLay w-100 mt-2">
                                {isFormVisible && (
                                    <ContactFilter
                                        isFormVisible={isFormVisible}
                                        setIsFormVisible={() => setIsFormVisible(!isFormVisible)}
                                        filterConditionObj={accountFilterObj}
                                    />
                                )}
                            </div>
                        </div>
                    </Col> */}
                </Row>

                <div className="mt-3 staff-list-container border border-dark" style={{ height: "calc(100vh - 284px)", overflow: "auto" }}>
                    <Table columns={columns} items={filteredData} />
                </div>
            </div>
        </>
    );
};

export default StudentContact;
