import { useEffect, useState } from "react";
import { Form, Modal } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";

import { actions } from "../../../../redux/store";
import { useGetStandardQuery } from "../../../../api/standard";
import { Label, capitalize, InputItem } from "../../forms";
import { Validation } from "../../../../utils/constants/validation/validation";
import { isValidArray } from "../../../../utils/constants/validation/array";
import { useCreateBatchMutation, useUpdateBatchMutation } from "../../../../api/batch";
import CustomSelect from "../../options/CustomSelect";

const BatchModal = () => {
    const { open, data } = useSelector((state) => state?.modal?.batch) || {};
    const [addReq, { isLoading: isCreating }] = useCreateBatchMutation();
    const [updateReq, { isLoading: isUpdating }] = useUpdateBatchMutation();
    const { data: standardData, isFetching } = useGetStandardQuery(null, {
        refetchOnMountOrArgChange: true,
    });

    const [standardOptions, setStandardOptions] = useState([{ value: "", label: "" }]);

    const form = useForm({
        defaultValues: {
            name: "",
            standardId: "",
        },
        resolver: yupResolver(Validation.BATCH),
    });

    const {
        formState: { errors },
        handleSubmit,
        register,
        getValues,
        setValue,
        reset,
    } = form;

    useEffect(() => {
        if (!standardData || standardData?.status !== 200) return;
        setStandardOptions(() => {
            return (
                isValidArray(standardData?.data) &&
                standardData?.data?.map(({ _id, name }) => {
                    return { value: _id, label: name };
                })
            );
        });
    }, [standardData]);

    useEffect(() => {
        if (!data) return;
        setValue("standardId", data?.standardId?._id || "");
        setValue("name", data?.name || "");

        return () => reset();
    }, [setValue, data, reset]);

    const handleClose = () => actions.modal.closeBatch();

    const watch = form.watch();

    // Create and Update API
    const onSubmit = async (body) => {
        const response = data?._id ? await updateReq({ ...body, _id: data?._id }) : await addReq(body);
        const message = `Batch ${data?._id ? "updated" : "created"} successfully`;
        if ([200, 201, 202, "success", "Success"].includes(response?.data?.status)) {
            toast.success(message);
            form.reset();
        }
        handleClose();
    };

    return (
        <Modal show={open} onHide={handleClose} animation={true} centered>
            <Modal.Body className="rounded-5 bg-white edit_modal_width">
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Label title={capitalize("standard")} htmlFor={"standard"} classNameLabel={"masterLabelClassName"} />
                    <CustomSelect
                        isFetching={isFetching}
                        {...register("standardId")}
                        field={register("standardId")}
                        form={{ setValue, getValues }}
                        options={standardOptions}
                        className="w-100"
                    />
                    {errors.standardId && <span>{errors.standardId.message}</span>}
                    <InputItem title={"Batch"} name={"name"} form={form} classNameLabel={"masterLabelClassName"} className={"masterInputClassName"} />
                    <div className="d-flex mt-3">
                        <button type="submit" disabled={isUpdating || isCreating} className="modal_save_button w-50 me-3">
                            Save
                        </button>
                        <button type="button" onClick={handleClose} className="w-50 modal_close_button">
                            Close
                        </button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default BatchModal;
