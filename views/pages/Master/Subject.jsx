import { useEffect, useState } from "react";
import { actions } from "../../../redux/store";
import { useGetSubjectQuery } from "../../../api/subject";
import { Stack } from "react-bootstrap";
import { Card } from "./Standard";
import EditAndDelete from "../../../components/shared/Actions/EditAndDelete";
import { HeaderContainer } from "../../../components/shared/Headers/HeaderCotainer";

const Subject = () => {
    const [subjectData, setSubjectData] = useState([]);

    const { data, isFetching } = useGetSubjectQuery(null, {
        refetchOnMountOrArgChange: true,
    });

    useEffect(() => {
        if (!data || data?.status !== 200) return;
        setSubjectData(data?.data);
    }, [data]);

    const handleOpen = (e, data = { open: true, data: null }) => {
        actions.modal.openSubject(data);
    };

    const handleOpenDelete = (e, id) => {
        actions.modal.openDelete({ id, type: "SUBJECT" });
    };

    return (
        <Stack>
            <HeaderContainer handleOpen={() => handleOpen()} title="Subject" />
            <div className="master_wrappers_scroll">
                <div className="standard__wrapper">
                    {subjectData?.map((item) => {
                        return (
                            <Card key={item?._id}>
                                <CardDetails
                                    fees={item?.fees}
                                    name={item?.name}
                                    onDelete={(e) => handleOpenDelete(e, item?._id)}
                                    onEdit={(e) => handleOpen(e, item)}
                                />
                            </Card>
                        );
                    })}
                </div>
            </div>
        </Stack>
    );
};

export default Subject;

export const CardDetails = ({ fees, name, onDelete, isLoading, onEdit }) => {
    return (
        <div className="d-flex">
            <div
                style={{
                    width: "80%",
                }}
                className="align-self-center"
            >
                <p className="p-0 m-0">Subject : {name || "-"}</p>
            </div>
            <div
                style={{
                    width: "20%",
                }}
            >
                <EditAndDelete isLoading={isLoading} onEdit={(e) => onEdit(e)} onDelete={(e) => onDelete(e)} />
            </div>
        </div>
    );
};
