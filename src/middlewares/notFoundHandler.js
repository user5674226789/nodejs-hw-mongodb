export const notFoundHandler = (res) => {
  res.status(404).json({
    message: 'Route not found',
  });
};
