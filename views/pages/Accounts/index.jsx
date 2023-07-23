import { useEffect, useRef, useState } from "react";
import { Row, Col, Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import _ from "lodash";
import { endOfDay, isEqual, isSameMonth, isSameYear, isWithinInterval, parse, startOfDay } from "date-fns";

import "../../styles/admission_enquiry_table.scss";
import "./style.scss";
import Table from "../../../components/shared/Table";
import filter from "../../../assets/images/Accounts/Filter.svg";
import AccountFilter from "../../../components/Filter/AccountFilter";
import { actions } from "../../../redux/store";
import { isValidArray } from "../../../utils/constants/validation/array";
import { useOutsideAlerter } from "../../../utils/constants/hooks/useOutsideAlert";
import { useGetAllFeesCollectionQuery } from "../../../api/account";

const Accounts = () => {
    const { accountFilterObj } = useSelector((state) => state?.utils);
    const { percentageFrom, percentageTo, byFees, feesReportFrom, feesReportTo, byPaymentMethod, chequeNumber } = accountFilterObj;

    const [isFormVisible, setIsFormVisible] = useState(false);
    const [filteredAccountData, setFilteredAccountData] = useState([]);
    const [searchQuery, setSearchQuery] = useState({
        _id: "",
        name: "",
        contactNumber: "",
    });

    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef, setIsFormVisible);

    const handleFilterButtonClick = () => setIsFormVisible(!isFormVisible);

    const { data: accountData, isFetching } = useGetAllFeesCollectionQuery(null, { refetchOnMountOrArgChange: true });

    useEffect(() => {
        if (![200, 201, 202, "success", "Success"].includes(accountData?.status)) return;
        const { _id, contactNumber, name } = searchQuery;
        setFilteredAccountData(accountData?.data);

        if (_id || contactNumber || name) {
            setFilteredAccountData((prevData) => {
                return prevData?.filter(({ _id, contactNumber, studentName, studentSurName }) => {
                    const isSearchIncludes = (query) => {
                        return query?.toLowerCase().includes(searchQuery["_id"].toLowerCase() || searchQuery["contactNumber"] || searchQuery["name"]);
                    };

                    return isSearchIncludes(_id) || isSearchIncludes(contactNumber) || isSearchIncludes(`${studentName} ${studentSurName}`);
                });
            });
        }
        if (percentageTo && percentageFrom) {
            setFilteredAccountData((prevData) => {
                return prevData?.filter((item) => {
                    const ptFrom = parseInt(percentageFrom);
                    const ptTo = parseInt(percentageTo);
                    const calculatedPercentage = (100 * item?.pendingAmount) / item?.totalAmount;
                    return calculatedPercentage >= ptFrom && calculatedPercentage <= ptTo;
                });
            });
        }

        if (byFees) setFilteredAccountData((prevData) => handleFilterByFees(prevData, byFees, feesReportFrom, feesReportTo));
        if (byPaymentMethod) setFilteredAccountData((prevData) => handleFilterByPaymentMethod(prevData, byPaymentMethod, chequeNumber));
    }, [accountData, accountFilterObj, searchQuery]);

    const hanleRowClick = (item) => {
        actions.modal.openAdmission(item);
        actions.enquiry.setStudentId(item?._id);
    };

    const handleSearchQuery = (e) => {
        setSearchQuery((prevValue) => ({ ...prevValue, [e.target.name]: e.target.value }));
    };

    const columns = [
        {
            name: "number",
            label: "No",
            renderer: (_, index) => index + 1,
        },
        {
            name: "date",
            label: "Date",
            sortable: true, // Add sortable property to enable sorting
        },
        { name: "paymentMethod", label: "Payment method", sortable: true },
        { name: "rollNumber", label: "Roll No.", sortable: true },
        { name: "name", label: "Student Name", renderer: ({ studentName, studentSurName }) => `${studentName || " "} ${studentSurName || ""}` },
        { name: "totalAmount", label: "Total Fees" },
        { name: "pendingAmount", label: "Pending Fees" },
        { name: "totalCollectedAmount", label: "Collect Fees" },
        { name: "status", label: "Status", renderer: (item) => _.capitalize(item?.status || "") },
        { name: "contactNumber", label: "Ph. No." },
    ];

    return (
        <>
            <div className=" overflow-x-hidden overflow-y-auto pb-5" style={{ overflowY: "auto", height: "calc(100vh - 80px)" }}>
                <div className="position-relative">
                    <div className="d-flex justify-content-between align-items-center">
                        <h3 className="mt-3">All Fees Collections Report</h3>
                        <div ref={wrapperRef} style={{ zIndex: "5" }}>
                            <button className="border-0 bg-white" onClick={handleFilterButtonClick}>
                                <img src={filter} alt="filter image icon" loading="eager" />
                            </button>
                            <div className="overLay">
                                {isFormVisible && (
                                    <AccountFilter
                                        isFormVisible={isFormVisible}
                                        setIsFormVisible={() => setIsFormVisible(!isFormVisible)}
                                        filterConditionObj={accountFilterObj}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <Row className="mt-3">
                    <Col lg={4}>
                        <AccountSearchInput name="_id" handleSearchQuery={handleSearchQuery} placeholder="Search by id..." valueObj={searchQuery} />
                    </Col>
                    <Col lg={4}>
                        <AccountSearchInput name="name" handleSearchQuery={handleSearchQuery} placeholder="Search by Name...." valueObj={searchQuery} />
                    </Col>
                    <Col lg={4} className="">
                        <AccountSearchInput
                            name="contactNumber"
                            handleSearchQuery={handleSearchQuery}
                            placeholder="Search by Phone no...."
                            valueObj={searchQuery}
                        />
                    </Col>
                </Row>
                <div style={{ overflow: "auto", height: "calc(100vh - 270px)" }} className="border border-dark mt-3">
                    <Table
                        columns={columns}
                        items={!isFetching && filteredAccountData}
                        className="table_width"
                        isLoading={isFetching}
                        onRowClick={(item) => hanleRowClick(item)}
                        sortable={true}
                    />
                </div>
            </div>
        </>
    );
};

export default Accounts;

const AccountSearchInput = ({ handleSearchQuery, valueObj, name, ...props }) => {
    return (
        <Form.Control
            {...props}
            onChange={handleSearchQuery}
            name={name}
            value={valueObj[name]}
            type="text"
            size="lg"
            className="input_style shadow-none mb-2 mb-lg-0"
        />
    );
};

const handleFilterByFees = (data, byFees, feesReportFrom, feesReportTo) => {
    switch (byFees) {
        case "Today":
            return handleFeesByTodayFilter(data);
        case "Month":
            return handleFeesByMonthFilter(data);
        case "Year":
            return handleFeesByYearFilter(data);
        case "Custom":
            return handleFeesByCustomRangeFilter(data, feesReportFrom, feesReportTo);
        default:
            break;
    }
};

const handleFeesByTodayFilter = (data) => isValidArray(data) && data?.filter(({ date }) => isEqual(parse(date, "dd/MM/yyyy", new Date()), new Date()));

const handleFeesByMonthFilter = (data) => data?.filter(({ date }) => isSameMonth(parse(date, "dd/MM/yyyy", new Date()), new Date()));

const handleFeesByYearFilter = (data) => data.filter(({ date }) => isSameYear(parse(date, "dd/MM/yyyy", new Date()), new Date()));

const handleFeesByCustomRangeFilter = (data, feesReportFrom, feesReportTo) => {
    return data.filter(({ date }) => {
        return isWithinInterval(parse(date, "dd/MM/yyyy", new Date()), { start: startOfDay(new Date(feesReportFrom)), end: endOfDay(new Date(feesReportTo)) });
    });
};

const handleFilterByPaymentMethod = (data, paymentMethod, chequeNumber) => {
    switch (paymentMethod) {
        case "Cash":
            return handlePaymentFilterByCash(data);
        case "Cheque":
            return handlePaymentFilterByCheque(data, chequeNumber);
        case "UPI":
            return handlePaymentFilterByUPI(data);
        default:
            break;
    }
};

const handlePaymentFilterByCash = (data) => data.filter(({ paymentMethod }) => paymentMethod === "cash");

const handlePaymentFilterByCheque = (data, chequeNumberStr) => {
    return data.filter(({ paymentMethod, chequeNumber }) => chequeNumber === chequeNumberStr && paymentMethod === "cheque");
};

const handlePaymentFilterByUPI = (data) => data.filter(({ paymentMethod }) => paymentMethod === "UPI");
