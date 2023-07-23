import "./style.scss";

export const Loader = ({ height }) => {
    return (
        <div className="flex_center w-100" style={{ height: height || "75vh" }}>
            <span className="loader"></span>
        </div>
    );
};
