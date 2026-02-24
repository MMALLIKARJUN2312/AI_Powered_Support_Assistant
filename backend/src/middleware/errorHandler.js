// Centralized error handler

const errorHandler = (error, req, res, next) => {
  console.error("Unhandled Error:", error);

  res.status(500).json({
    error: "Internal server error"
  });
};

export default errorHandler;