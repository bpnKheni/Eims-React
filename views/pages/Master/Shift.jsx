import { useEffect, useState } from "react";
import { actions } from "../../../redux/store";
import { Card } from "./Standard";
import EditAndDelete from "../../../components/shared/Actions/EditAndDelete";
import { useGetShiftQuery } from "../../../api/shift";
import { HeaderContainer } from "../../../components/shared/Headers/HeaderCotainer";

const Shift = () => {
    const [subjectData, setSubjectData] = useState([]);

    const { data, isFetching } = useGetShiftQuery(null, {
        refetchOnMountOrArgChange: true,
    });

    useEffect(() => {
        if (!data || data?.status !== 200) return;
        setSubjectData(data?.data);
    }, [data]);

    const handleOpen = (e, data = { open: true, data: null }) => {
        actions.modal.openShift(data);
    };

    const handleOpenDelete = (e, item) => {
        actions.modal.openDelete({ id: item?._id, type: "SHIFT", confirmationMessage: `Are you sure you want to delete this ${item?.name} Shift?` });
    };

    return (
        <div>
            <HeaderContainer handleOpen={() => handleOpen()} title="Shift" />
            <div className="master_wrappers_scroll">
                <div className="standard__wrapper">
                    {subjectData?.map((item) => {
                        return (
                            <Card key={item?._id}>
                                <CardDetails
                                    fees={item?.fees}
                                    name={item?.name}
                                    onDelete={(e) => handleOpenDelete(e, item)}
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

export default Shift;

export const CardDetails = ({ name, onDelete, isLoading, onEdit }) => {
    return (
        <div className="d-flex">
            <div style={{ width: "80%" }} className="align-self-center">
                <p className="p-0 m-0">Shift : {name || "-"}</p>
            </div>
            <div style={{ width: "20%" }}>
                <EditAndDelete isLoading={isLoading} onEdit={(e) => onEdit(e)} onDelete={(e) => onDelete(e)} />
            </div>
        </div>
    );
};
