export const notFoundHandler = (res, req) => {
  res.status(404).json({
    message: 'Route not found',
  });
};
