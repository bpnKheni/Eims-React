import { useEffect, useState } from "react";
import { format, isEqual, parse } from "date-fns";
import { Col, Row, Form } from "react-bootstrap";
import { IoIosAddCircle } from "react-icons/io";
import { useNavigate } from "react-router-dom";

import "./style.scss";
import EditAndDelete from "../../../components/shared/Actions/EditAndDelete";
import { actions } from "../../../redux/store";
import { CustomDatePicker } from "../Enquiry/Enquiry";
import { useGetNoticeQuery } from "../../../api/noticeboard";
import { isValidArray } from "../../../utils/constants/validation/array";

const Noticeboard = () => {
    const navigate = useNavigate();

    const [noticeData, setNoticeData] = useState({ upcomingNotice: [], pastNotice: [] });
    const [date, setDate] = useState();
    const [query, setQuery] = useState("");

    const { data, isFetching } = useGetNoticeQuery(null, { refetchOnMountOrArgChange: true });

    useEffect(() => {
        if (data?.status !== 200) return;

        setNoticeData(isValidArray(data?.data) ? data?.data : []);

        if (date) {
            setNoticeData((prevData) => {
                return isValidArray(prevData) ? prevData.filter((noticeObj) => isEqual(parse(noticeObj?.date, "dd/MM/yyyy", new Date()), date)) : [];
            });
        }

        if (query) {
            setNoticeData((prevData) => {
                return isValidArray(prevData) ? prevData.filter((noticeObj) => noticeObj?.title?.toLowerCase().includes(query?.toLowerCase())) : [];
            });
        }

        setNoticeData((prevData) => {
            const formatString = "dd/MM/yyyy";
            const upcomingNotice = [];
            const pastNotice = [];

            const currentDate = new Date();
            isValidArray(prevData) &&
                prevData?.forEach((noticeObj) => {
                    parse(noticeObj?.date, formatString, new Date()) > currentDate ? upcomingNotice.push(noticeObj) : pastNotice.push(noticeObj);
                });

            return { upcomingNotice, pastNotice };
        });
    }, [data, date, query]);

    const handleEdit = (data = { open: true, data: null }) => {
        navigate(`/edit-notice/${data?._id}`, { state: data });
    };

    const handleDeleteOpen = (id) => {
        actions.modal.openDelete({ id, type: "NOTICE" });
    };

    return (
        <div className="overFlow_set">
            <div className="title_text fs-4">Notice board</div>
            <Row className="px-2">
                <Col sm={12} md={6}>
                    <div className="datepicker-container">
                        <CustomDatePicker
                            dateFormat="dd/MM/yyyy"
                            showPopperArrow={false}
                            placeholderText="Search by date"
                            selected={date}
                            onChange={(date) => setDate(date)}
                            className="custom-noticeboard-date-picker"
                            isClearable
                        />
                    </div>
                </Col>
                <Col sm={12} md={6} className="mt-3 mt-md-0">
                    <Form.Control
                        onChange={(e) => setQuery(e.target.value)}
                        value={query}
                        placeholder="Search by Title"
                        size="lg"
                        className="input_field shadow-none"
                    />
                </Col>
            </Row>
            <div className="Notice_board_container">
                <Row className="h-100 px-2">
                    <Col sm={12} md={6}>
                        <div className="Notice_container pt-3">
                            <p className="title p-0 m-0 text-center fs-5 fw-bold">Upcoming Notice</p>
                            <div className="Notice_content">
                                {noticeData?.upcomingNotice?.map((item, idx) => {
                                    return (
                                        <SingleNotice
                                            key={idx?.toString()}
                                            data={item}
                                            handleEdit={(e) => handleEdit(item)}
                                            handleDelete={(e) => handleDeleteOpen(item?._id)}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    </Col>
                    <Col sm={12} md={6} className="mt-3 mt-md-0">
                        <div className="Notice_container pt-3">
                            <p className="title p-0 m-0 text-center fs-5 fw-bold">Past Notice</p>
                            <div className="Notice_content">
                                {noticeData?.pastNotice?.map((item, idx) => {
                                    return (
                                        <SingleNotice
                                            key={idx?.toString()}
                                            data={item}
                                            handleEdit={(e) => handleEdit(item)}
                                            handleDelete={(e) => handleDeleteOpen(item?._id)}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
            <div className="position-fixed bottom-0 end-0 p-3">
                <button
                    className="border-0 bg-transparent"
                    onClick={() => {
                        navigate("/create-notice");
                        actions.student.setStandard("");
                        actions.student.setBatch("");
                    }}
                >
                    <IoIosAddCircle size={62} style={{ color: "#3660F8", cursor: "pointer" }} />
                </button>
            </div>
        </div>
    );
};

export default Noticeboard;

const SingleNotice = (props) => {
    const { date, details, postedByName, timeDifference, title } = props?.data;
    const { handleEdit, handleDelete } = props;

    return (
        <div className="Notice_wrapper">
            <p className="text-start">
                <span className="date_text text-start fs-6 py-1">{formatNoticeDate(date)}</span>
            </p>
            <p className="note fs-4 fw-normal lh-base my-2 ps-2 p-0 m-0">{title}</p>
            <p className="note fs-6 fw-normal lh-base my-2 ps-2 p-0 m-0">{details}</p>
            <div className="d-flex justify-content-between">
                <span className="mute_text align-self-end fs-5">
                    {postedByName || ""}/{timeDifference || ""}
                </span>
                <EditAndDelete onEdit={(e) => handleEdit(e)} onDelete={(e) => handleDelete(e)} />
            </div>
        </div>
    );
};

const formatNoticeDate = (dateString) => {
    const parsedDate = parse(dateString, "dd/MM/yyyy", new Date());
    const formattedDate = format(parsedDate, "dd MMMM, yyyy");
    return formattedDate;
};
