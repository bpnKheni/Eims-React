import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Form } from "react-bootstrap";
import { IoIosAddCircle } from "react-icons/io";

import "./style.scss";
import "../../styles/admission_enquiry_table.scss";
import Table from "../../../components/shared/Table";
import EditAndDelete from "../../../components/shared/Actions/EditAndDelete";
import { useGetStaffQuery } from "../../../api/staff";
import { actions } from "../../../redux/store";

const Staff = () => {
    const navigate = useNavigate();
    const [idSearch, setIdSearch] = useState("");
    const [nameSearch, setNameSearch] = useState("");
    const [phoneSearch, setPhoneSearch] = useState("");
    const [filteredData, setFilteredData] = useState([]);

    const { data: staffResponse, isLoading, isError } = useGetStaffQuery(null, { refetchOnMountOrArgChange: true });

    useEffect(() => {
        if (!staffResponse || staffResponse.status !== 200) return;
        const staffData = staffResponse.data;

        let filteredStaffData = [...staffData];

        // Filter by name
        if (nameSearch) {
            filteredStaffData = filteredStaffData.filter((staffObj) => {
                const firstName = staffObj?.surName || "";
                const lastName = staffObj?.name || "";
                const name = `${firstName} ${lastName}`;
                return (
                    firstName.toLowerCase().includes(nameSearch.toLowerCase()) ||
                    lastName.toLowerCase().includes(nameSearch.toLowerCase()) ||
                    name.toLowerCase().includes(nameSearch.toLowerCase())
                );
            });
        }

        // Filter by phone number
        if (phoneSearch) {
            filteredStaffData = filteredStaffData.filter((staffObj) => String(staffObj?.contact1).includes(phoneSearch));
        }
        // Filter by ID
        if (idSearch) {
            filteredStaffData = filteredStaffData.filter((staffObj) => String(staffObj?._id).includes(idSearch));
        }

        setFilteredData(filteredStaffData);
    }, [staffResponse, idSearch, nameSearch, phoneSearch]);

    const handleOpenDelete = (e, id) => {
        actions.modal.openDelete({ id, type: "STAFF" });
    };

    const handleOpenEdit = (e, staff) => {
        navigate(`/update-staff/${staff?._id}`, { state: { staffData: staff } });
    };
    const columns = [
        {
            name: "actions",
            label: "Edit&Delete",
            renderer: (staff) => (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <EditAndDelete onDelete={(e) => handleOpenDelete(e, staff._id)} onEdit={(e) => handleOpenEdit(e, staff)} />
                </div>
            ),
        },
        {
            name: "number",
            label: "No",
            renderer: (_, index) => index + 1,
        },
        {
            name: "name",
            label: "Name",
            renderer: (staff) => (
                <span>
                    {staff?.surName || " "} {staff?.name || ""}
                </span>
            ),
        },
        { name: "qualification", label: "Qualification" },
        { name: "contact1", label: "Ph No." },
        { name: "designation", label: "Post" },
        // { name: "standard", label: "Standard" },
    ];

    if (isLoading) return <div>Loading staff data...</div>;
    if (isError) return <div>Error retrieving staff data.</div>;

    return (
        <>
            <div className="overflow-auto pb-5 overflow-x-hidden" style={{ height: "88vh" }}>
                <h3 className="mt-3">All Staff</h3>
                <div>
                    <Row className="mt-3">
                        <Col md={4}>
                            <Form.Control
                                type="text"
                                placeholder="Search by id..."
                                className="input_style shadow-none mb-2 mb-lg-0"
                                value={idSearch}
                                onChange={(e) => setIdSearch(e.target.value)}
                            />
                        </Col>
                        <Col md={4}>
                            <Form.Control
                                type="text"
                                placeholder="Search by Name...."
                                className="input_style shadow-none mb-2 mb-lg-0"
                                value={nameSearch}
                                onChange={(e) => setNameSearch(e.target.value)}
                            />
                        </Col>
                        <Col md={4}>
                            <Form.Control
                                type="text"
                                placeholder="Search by Phone no...."
                                className="input_style shadow-none mb-2 mb-lg-0"
                                value={phoneSearch}
                                onChange={(e) => setPhoneSearch(e.target.value)}
                            />
                        </Col>
                    </Row>

                    <div className="mt-3 staff-list-container" style={{ height: "calc(100vh - 284px)", overflow: "auto" }}>
                        <Table
                            columns={columns}
                            items={filteredData.map((staff, index) => ({
                                ...staff,
                                index: index + 1,
                            }))}
                        />
                    </div>
                </div>

                <div className="position-fixed bottom-0 end-0 p-3 ">
                    <IoIosAddCircle onClick={() => navigate("/create-staff")} size={62} style={{ color: "#3660F8", cursor: "pointer" }} />
                </div>
            </div>
        </>
    );
};

export default Staff;
