import { NavLink, Outlet } from "react-router-dom";

const Master = () => {
    return (
        <>
            <div className="tab__container">
                <CustomNav path="/master/standard" name="Standard" />
                <CustomNav path="/master/subject" name="Subject" />
                <CustomNav path="/master/shift" name="Shift" />
                <CustomNav path="/master/batch" name="Batch" />
                <CustomNav path="/master/standard-and-subject" name="Standard & Subject" />
            </div>
            <Outlet />
        </>
    );
};

export default Master;

export const CustomNav = ({ path, name }) => {
    return (
        <NavLink to={path} className={({ isActive }) => (isActive ? "menu active__menu text-truncate" : "menu text-truncate")}>
            {name}
        </NavLink>
    );
};
