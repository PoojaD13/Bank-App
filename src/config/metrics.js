const client = require("prom-client");

client.collectDefaultMetrics();

const httpRequestCounter = new client.Counter({
  name: "http_request_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"],
});

const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.1, 0.5, 1, 2, 5], // Define your desired buckets
});

module.exports = { client, httpRequestCounter, httpRequestDuration };
