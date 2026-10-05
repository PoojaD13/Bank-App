const {
  httpRequestCounter,
  httpRequestDuration,
} = require("../config/metrics");
const metricsMiddleware = (req, res, next) => {
  const start = process.hrtime();

  res.on("finish", () => {
    const [seconds, nanoseconds] = process.hrtime(start);
    const duration = seconds + nanoseconds / 1e9;

    const route = req.route?.path || req.path;
    const statusCode = res.statusCode.toString();

    httpRequestCounter.inc({
      method: req.method,
      route,
      status_code: statusCode,
    });

    httpRequestDuration.observe(
      {
        method: req.method,
        route,
        status_code: statusCode,
      },
      duration,
    );
  });
  next();
};

module.exports = metricsMiddleware;
