// utils/asyncWrapper.js - Wrapper for handling async errors

const asyncWrapper = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = { asyncWrapper };
