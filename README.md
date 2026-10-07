Banking Backend

A production-oriented banking REST API built with Node.js, Express.js, and MongoDB, focusing on financial consistency, security, event-driven architecture, caching, and observability.

Features

Core Banking

- User and account management
- Customer and employee roles
- Deposit, withdrawal, and fund transfer
- Transaction status management
- Double-entry ledger
- Balance calculation from ledger entries

Financial Correctness

- MongoDB transactions
- Atomic financial operations
- Concurrency handling
- Idempotency keys
- Transaction reversal using compensating ledger entries

Security

- Password hashing
- JWT authentication
- Access and refresh tokens
- Role-based authorization
- Permission-based access control
- Rate limiting
- Request validation
- HTTP-only refresh-token cookie

Approval Workflow

Implemented a dynamic multi-level approval system for operations requiring authorization.

Withdrawal Request
       ↓
Find Bank Rule
       ↓
Create Approval Request
       ↓
Level 1 Approval
       ↓
Level 2 Approval
       ↓
Final Approval
       ↓
Cashier Processing
       ↓
Financial Transaction
       ↓
Ledger Entries

Approval requests maintain a snapshot of the applicable approval rule so that changes to the original rule do not affect an ongoing request.

Event-Driven Architecture

RabbitMQ is used for asynchronous processing.

Banking API
     ↓
RabbitMQ Exchange
     ├── Email Worker
    

Implemented:

- Transaction events
- Email worker
- Message acknowledgements
- Retry handling
- Dead-letter queues
- Consumer error handling

Redis

Redis is used for caching and short-lived data.

MongoDB remains the source of truth for financial data.

Monitoring

Application metrics are collected using Prometheus and visualized through Grafana.

Node.js API
     ↓
 /metrics
     ↓
Prometheus
     ↓
Grafana

Monitored areas include:

- HTTP request count
- Response latency
- HTTP errors
- Transaction metrics
- RabbitMQ metrics
- Redis metrics

Docker

The application infrastructure is containerized using Docker.

Services include:

- Node.js application
- worker
- Redis
- RabbitMQ
- Prometheus
- Grafana

Docker health checks are configured for service health monitoring.

---

Architecture

                         Client
                           │
                           ↓
                    ┌─────────────┐
                    │   Express   │
                    │     API     │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │ Controllers │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │  Services   │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              ↓            ↓            ↓
          MongoDB        Redis       RabbitMQ
                                        │
                                        ↓               
                                 Email Worker 
                                

                    Prometheus ← /metrics
                         ↓
                      Grafana

---

Financial Transaction Flow

A financial operation follows a controlled transaction flow:

Transaction Request
        ↓
Authentication
        ↓
Authorization
        ↓
Validation
        ↓
Idempotency Check
        ↓
MongoDB Transaction
        ↓
Financial Operation
        ↓
Ledger Entries
        ↓
Transaction Record
        ↓
Commit
        ↓
Publish Event
        ↓
RabbitMQ

MongoDB transactions ensure that related financial changes are committed or rolled back together.

---

Double-Entry Ledger

Financial movements are recorded using double-entry accounting.

For example, a transfer of ₹1,000:

Source Account       Debit   ₹1,000
Destination Account  Credit  ₹1,000

The ledger provides an auditable record of financial movements.

---

Idempotency

Financial APIs use idempotency keys to prevent duplicate processing when clients retry the same request.

Example:

POST /api/v1/transactions/transfer
Idempotency-Key: <unique-key>

If the same request is received again, the existing operation can be identified instead of creating another financial transaction.

This protects against:

- Network retries
- Client retries
- Duplicate requests
- Request timeouts

---

Concurrency Handling

Financial operations must remain consistent when multiple requests target the same account simultaneously.

The application uses MongoDB transactions and atomic database operations to protect financial state from race conditions.

---


---

Approval Workflow

Operations requiring approval are separated from actual financial execution.

Withdrawal Request
        ↓
Approval Required?
     ↙       ↘
   No         Yes
   ↓           ↓
Execute     Approval Request
               ↓
         Approval Levels
               ↓
         Final Approval
               ↓
         Cashier Processing
               ↓
        Execute Withdrawal

The approval system supports:

- Dynamic approval rules
- Multiple approval levels
- Role-based approval
- Approve/reject actions
- Approval snapshots
- Concurrent approval protection

---

RabbitMQ

RabbitMQ handles asynchronous processing so background operations do not block the main API request.

Transaction Completed
        ↓
RabbitMQ Exchange
        ↓
Routing Key
        ↓
Queue
        ↓
Consumer
        ↓
Email Service

Failed messages can be retried and eventually moved to a dead-letter queue.

Main Queue
    ↓
Processing
    ↓
Temporary Failure
    ↓
Retry
    ↓
Retry Limit Reached
    ↓
Dead Letter Queue

---

Technology Stack

Category        |   Technology
Runtime         |    Node.js
Framework       |    Express.js
Database        |    MongoDB
ODM             |    Mongoose
Authentication  | JWT
Password Hashing| bcrypt
Cache           | Redis
Message Broker  | RabbitMQ
Email            | Nodemailer
Logging          | Winston / Morgan
Metrics          | Prometheus
Monitoring       | Grafana
Containerization | Docker
API Testing      | Postman

---

Project Structure

src/
├── config/
├── constant/
├── controllers/
├── models/
├── routers/
├── services/
├── middlewares/
├── utils/
├── validation/
├── rabbitMQ/
├── cached/
├── prometheus/
├── app.js
└── index.js

The application separates:

- HTTP handling
- Business logic
- Data access
- Authentication and authorization
- Messaging
- Caching
- Monitoring
- Configuration

---

Running Locally

Prerequisites

- Node.js
- Docker
- Docker Compose
- Git

Clone

git clone <REPOSITORY_URL>
cd Band-app

Install dependencies

npm install

Environment variables

Create a ".env" file using ".env.example".

Example:

NODE_ENV=development
PORT=5000

MONGODB_URL=your_mongodb_connection

JWT_SECRET=your_secret
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

REDIS_URL=redis://localhost:6379

RABBITMQ_URL=amqp://localhost:5672

Add any other variables required by the application.

Never commit ".env" or credentials to GitHub.

Start infrastructure

docker compose up -d

Check containers:

docker ps

Start the API

npm run dev

For RabbitMQ workers run separately:

npm run worker

---

API Testing

The APIs are tested using Postman.

Main API areas include:

Authentication
Accounts
Customers
Employees
Transactions
Withdrawals
Loans
Approvals

---

Monitoring

Prometheus collects application metrics from:

GET /metrics

Grafana visualizes these metrics through dashboards.

Application
     ↓
 /metrics
     ↓
Prometheus
     ↓
Grafana

---

Health Checks

Docker health checks are configured to verify whether required services are healthy and ready to handle requests.

---

Key Engineering Decisions

Why MongoDB transactions?

Financial operations may require multiple database changes. Transactions ensure related changes are committed or rolled back together.

Why a ledger?

The ledger provides an auditable record of financial movements instead of relying only on a mutable balance value.

Why idempotency?

Network failures and client retries can cause duplicate requests. Idempotency prevents duplicate financial processing.

Why RabbitMQ?

Email and notification processing can happen asynchronously without blocking the main banking operation.

Why Redis?

Redis provides fast access for caching and short-lived data while MongoDB remains the source of truth for financial information.

Why Prometheus and Grafana?

Logs provide individual event details, while metrics provide numerical measurements of application behaviour over time.

---

Project Goals

The project was built to demonstrate backend engineering concepts beyond basic CRUD:

- Financial consistency
- Database transactions
- Concurrency handling
- Idempotency
- Authorization
- Approval workflows
- Event-driven architecture
- Message reliability
- Caching
- Observability
- Containerization
- Continuous integration

---

Disclaimer

This is an educational and portfolio project and is not intended to handle real customer funds or production banking operations.
