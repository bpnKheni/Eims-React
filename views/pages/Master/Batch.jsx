import { useEffect, useState } from "react";

import "./style.scss";
import { actions } from "../../../redux/store";
import EditAndDelete from "../../../components/shared/Actions/EditAndDelete";
import { useGetBatchQuery } from "../../../api/batch";
import { HeaderContainer } from "../../../components/shared/Headers/HeaderCotainer";

const Standard = () => {
    const [standardData, setStandardData] = useState([]);

    const { data, isFetching } = useGetBatchQuery(null, {
        refetchOnMountOrArgChange: true,
    });

    useEffect(() => {
        if (!data || data?.status !== 200) return;
        setStandardData(data?.data);
    }, [data]);

    const handleOpen = (e, data = { open: true, data: null }) => {
        actions.modal.openBatch({ ...data, open: true });
    };

    const handleOpenDelete = (e, id) => {
        actions.modal.openDelete({ id, type: "BATCH" });
    };

    return (
        <div>
            <HeaderContainer handleOpen={() => handleOpen()} title="Batch" />
            <div className="master_wrappers_scroll">
                <div className="standard__wrapper">
                    {standardData?.map((item) => {
                        return (
                            <Card key={item?._id}>
                                <CardDetails
                                    standard={item?.standardId?.name}
                                    name={item?.name}
                                    onDelete={(e) => handleOpenDelete(e, item?._id)}
                                    onEdit={(e) => handleOpen(e, item)}
                                />
                            </Card>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Standard;

export const Card = ({ children }) => {
    return <div className="card__container">{children}</div>;
};

export const CardDetails = ({ standard, name, onDelete, isLoading, onEdit }) => {
    return (
        <div className="d-flex">
            <div style={{ width: "80%" }}>
                <p className="my-0"> Standard : {standard || "-"}</p>
                <p className="my-0">Batch : {name || "-"}</p>
            </div>
            <div style={{ width: "20%", textAlign: "right" }}>
                <EditAndDelete isLoading={isLoading} onEdit={(e) => onEdit(e)} onDelete={(e) => onDelete(e)} />
            </div>
        </div>
    );
};
