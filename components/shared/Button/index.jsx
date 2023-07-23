import React from "react";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import PropTypes from "prop-types";

export default function LoadingButton({ isLoading, handleClick }) {
  return (
    <Button variant="primary" disabled={isLoading} onClick={handleClick}>
      {isLoading ? (
        <>
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
          />{" "}
          Loading...
        </>
      ) : (
        "Register"
      )}
    </Button>
  );
}

LoadingButton.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired,
};
