import { formatAddress } from "../../../utils/constants/helper/stringBuilders";
import "./style.scss";

const PersonalDetails = () => {
    const state = JSON.parse(localStorage.getItem("STUDENT_DETAIL"));
    const { dateOfBirth, gender, school, schoolTime, lastYearPercentage, batch, shift, rollNumber, fees } = state || {};

    const detailsObj = [
        { label: "Address", value: formatAddress(state) },
        { label: "Date Of Birth", value: dateOfBirth },
        { label: "Gender", value: gender },
        { label: "School name", value: school },
        { label: "school time", value: schoolTime },
        { label: "Last Year Percentage", value: lastYearPercentage },
        { label: "Batch", value: batch },
        { label: "Shift", value: shift },
        { label: "Roll No", value: rollNumber },
        { label: "Fees", value: fees },
    ];

    return (
        <div>
            <table className="personalDetails_table">
                <tbody>
                    {detailsObj?.map(({ label, value }, idx) => {
                        return (
                            <tr key={`${label}__${idx}`}>
                                <td>{label}</td>
                                <td>{value || "-"}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default PersonalDetails;
