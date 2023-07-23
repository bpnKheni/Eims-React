import MainLayout from "../../../components/layouts/MainLayout";
import { Row, Col, Form } from "react-bootstrap";
import EditAndDelete from "../../../components/shared/Actions/EditAndDelete";
import { IoIosAddCircle } from "react-icons/io";
import { actions } from "../../../redux/store";
import Table from "../../../components/shared/Table";
import { useNavigate } from "react-router-dom";

const Expense = () => {
    const navigate = useNavigate();
    const expenseData = [
        {
            id: 1,
            date: "2023-06-01",
            name: "John Doe",
            totalSalary: 5000,
            pendingSalary: 2000,
            post: "Teacher",
        },
        {
            id: 2,
            date: "2023-06-02",
            name: "Jane Smith",
            totalSalary: 4000,
            pendingSalary: 1000,
            post: "Assistant",
        },
    ];
    const columns = [
        {
            name: "actions",
            label: "Edit&Delete",
            renderer: (expense) => (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <EditAndDelete onEdit={() => handleIncomeEdit()} onDelete={() => handleExpenseDelete(expense._id)} />
                </div>
            ),
        },
        {
            name: "number",
            label: "No",
            renderer: (_, index) => index + 1,
        },
        {
            name: "date",
            label: "Date",
        },
        { name: "name", label: "Student Name" },
        { name: "salary", label: "Total Salary" },
        { name: "salary", label: "Pending Salary" },
        { name: "post", label: "Post" },
    ];

    const handleExpenseDelete = (id) => {
        actions.modal.openDelete({ id, type: "EXPENSE" });
    };

    const handleIncomeEdit = () => {
        navigate("/accounts/update-expense");
    };
    return (
        <MainLayout>
            <div>
                <h3 className="mt-3">All expenses Report</h3>
                <Row className="mt-3">
                    <Col lg={4}>
                        <Form.Control
                            type="text"
                            placeholder="Search by id..."
                            className="input_style shadow-none mb-2 mb-lg-0"
                            // value={idSearch}
                            // onChange={(e) => setIdSearch(e.target.value)}
                        />
                    </Col>
                    <Col lg={4}>
                        <Form.Control
                            type="text"
                            placeholder="Search by Name...."
                            className="input_style shadow-none mb-2 mb-lg-0"
                            // value={nameSearch}
                            // onChange={(e) => setNameSearch(e.target.value)}
                        />
                    </Col>
                    <Col lg={4}>
                        <Form.Control
                            type="text"
                            placeholder="Search by Phone no...."
                            className="input_style shadow-none mb-2 mb-lg-0"
                            // value={phoneSearch}
                            // onChange={(e) => setPhoneSearch(e.target.value)}
                        />
                    </Col>
                </Row>
                <div style={{ overflow: "auto" }} className="border border-dark mt-3">
                    <Table columns={columns} items={expenseData} />
                </div>
                <div className="position-fixed bottom-0 end-0 p-3">
                    <IoIosAddCircle onClick={() => navigate("/accounts/create-expense")} size={62} style={{ color: "#3660F8", cursor: "pointer" }} />
                </div>
            </div>
        </MainLayout>
    );
};

export default Expense;
