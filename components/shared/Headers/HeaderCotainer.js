import "./style.scss";

export const HeaderContainer = ({ handleOpen, title }) => {
  return (
    <div className="d-flex justify-content-center">
      <div className="header__wrapper">
        <p className="button_label_name">{title}</p>
        <div
          className="create_standard mt-1 mb-3 text-end"
          onClick={handleOpen}
        >
          +
        </div>
      </div>
    </div>
  );
};
