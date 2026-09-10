const httpStatus = require("http-status").default;
const ApiError = require("../utils/ApiError");
const mongoose = require("mongoose");

const { Transaction } = require("../models");
const {
  transactionTypes,
  transactionStatus,
} = require("../constant/transaction");
const { ledgerTypes } = require("../constant/ledger-types");

const accountService = require("./account.service");
const ledgerService = require("./ledger.service");
const emailService = require("./email.service");

const getTransaction = async (key) => {
  const data = await Transaction.findOne({
    idempotencyKey: key,
  });
  return data;
};

const createTxn = async (body) => {
  let txn;

  // validate IdepotencyKey
  const isTransactionExist = await getTransaction(body.idempotencyKey);

  if (isTransactionExist) {
    if (isTransactionExist.status === transactionStatus.completed) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `Transaction already completed ${isTransactionExist}`,
      );
    } else if (isTransactionExist.status === transactionStatus.pending) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Transaction is still in process",
      );
    } else if (isTransactionExist.status === transactionStatus.failed) {
      throw new ApiError(
        httpStatus,
        INTERNAL_SERVER_ERROR,
        "Transaction failed, please try again",
      );
    } else if (isTransactionExist.status === transactionStatus.reverse) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Please try again");
    }
  }

  // based on transaction type creates and entries in ledger
  switch (body.transferType) {
    case transactionTypes.transfer: {
      // Validating account number
      const fromAccountExist = await accountService.getAccountDetails(
        body.fromAccountNo,
      );
      const toAccountExist = await accountService.getAccountDetails(
        body.toAccountNo,
      );
      if (!fromAccountExist || !toAccountExist) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          "Account doesnt exist or inactive",
        );
      }

      body.fromAccount = fromAccountExist._id;
      body.toAccount = toAccountExist._id;

      // create Transaction
      txn = await Transaction.create(body);

      // entry ledger for both accounts
      const session = await mongoose.startSession();

      try {
        await session.withTransaction(async () => {
          // get balance of the from user and check the balance is enough
          const balance = await accountService.getAccountBalance(
            fromAccountExist._id,
          );
          if (balance < body.amount) {
            throw new ApiError(
              httpStatus.BAD_REQUEST,
              `Insufficient balance, your balance is ${balance} requested amount is ${body.amount}.`,
            );
          }

          await ledgerService.createLedgerEntry(
            {
              account: fromAccountExist._id,
              amount: body.amount,
              transaction: txn._id,
              type: ledgerTypes.debit,
            },
            session,
          );
          await ledgerService.createLedgerEntry(
            {
              account: toAccountExist._id,
              amount: body.amount,
              transaction: txn._id,
              type: ledgerTypes.credit,
            },
            session,
          );

          txn.status = transactionStatus.completed;
          await txn.save({ session });
        });
      } catch (err) {
        txn = await Transaction.updateOne(
          {
            _id: txn._id,
          },
          { $set: { status: transactionStatus.failed } },
          { new: true },
        );
        throw err;
      } finally {
        await session.endSession();
      }
      break;
    }
    case transactionTypes.deposit: {
      const toAccountExist = await accountService.getAccountDetails(
        body.toAccountNo,
      );
      if (!toAccountExist) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Account doesnt exist");
      }
      body.toAccount = toAccountExist._id;

      // create Transaction

      txn = await Transaction.create(body);

      const session = await mongoose.startSession();

      try {
        await session.withTransaction(async () => {
          await ledgerService.createLedgerEntry(
            {
              account: toAccountExist._id,
              amount: body.amount,
              transaction: txn._id,
              type: ledgerTypes.credit,
            },
            session,
          );

          txn.status = transactionStatus.completed;
          await txn.save({ session });
        });
      } catch (err) {
        txn = await Transaction.updateOne(
          {
            _id: txn._id,
          },
          { $set: { status: transactionStatus.failed } },
          { new: true },
        );
        throw err;
      } finally {
        await session.endSession();
      }
      break;
    }

    case transactionTypes.withdrawal: {
      const fromAccountExist = await accountService.getAccountDetails(
        body.fromAccountNo,
      );
      if (!fromAccountExist) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Account doesnt exist");
      }
      body.fromAccount = fromAccountExist._id;

      // create Transaction
      txn = await Transaction.create(body);

      // entry in the ledger
      const session = await mongoose.startSession();

      try {
        await session.withTransaction(async () => {
          // check for the balance
          const balance = await accountService.getAccountBalance(
            fromAccountExist._id,
          );
          if (balance < body.amount) {
            throw new ApiError(
              httpStatus.BAD_REQUEST,
              `Insufficient balance, your balance is ${balance} requested amount is ${body.amount}.`,
            );
          }

          await ledgerService.createLedgerEntry(
            {
              account: fromAccountExist._id,
              amount: body.amount,
              transaction: txn._id,
              type: ledgerTypes.debit,
            },
            session,
          );

          txn.status = transactionStatus.completed;
          await txn.save({ session });
        });
      } catch (err) {
        txn = await Transaction.updateOne(
          {
            _id: txn._id,
          },
          { $set: { status: transactionStatus.completed } },
          { new: true },
        );
        throw err;
      } finally {
        await session.endSession();
      }
      break;
    }
  }
  // // to send the email
  // if (body.transferType != transactionTypes.deposit) {
  //   emailService.sendTransactionEmail(fromAccountExist.email, body.amount,transferType.);
  // }
  // emailService.sendTransactionEmail;
  return txn;
};

const getAllTransaction = async (accNo, filter, options) => {
  filter.$or = [{ fromAccountNo: accNo }, { toAccountNo: accNo }];

  const data = await Transaction.paginate(filter, options);
  return data;
};

module.exports = {
  createTxn,
  getTransaction,
  getAllTransaction,
};

// have to resolve the the logineed person id is same and also the tnx status inconsistency is their test it
