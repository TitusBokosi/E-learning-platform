const errorHandler = (err, req, res, next) => {

    const statusCode = err.statusCode || 500;
    const status = err.status || "error";

          console.error("❌ ERROR:", {
    method: req.method,
    url: req.originalUrl,
    message: err.message,
    stack: err.stack,
    body: req.body,
    params: req.params,
    user: req.user?.id,
  });
        
        if (err.isOperational){
            res.status(statusCode).json({
                status,
                message: err.message
            });
        }
        else{
            res.status(500).json({
                status,
                message: "Something went wrong!"
            });
        }
    
};

    

module.exports = { errorHandler };
