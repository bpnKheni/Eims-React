export const validateSuccessResponse = (response) => {
  return !!response && [200, 201].includes(response?.status);
};

export const getErrorResponseMessage = (response) => {
  return response && response.error && response.error.message;
};
