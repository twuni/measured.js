import 'regenerator-runtime/runtime';

import { PerformanceObserver, performance } from 'perf_hooks';

import crypto from 'crypto';

const STUB = () => true;

// eslint-disable-next-line no-magic-numbers
const generateId = () => crypto.randomBytes(32).toString('base64');

const getMeasurement = (performanceObserverItems) => {
  const [{ duration, name, startTime }] = performanceObserverItems.getEntries();
  const endTime = startTime + duration;
  const measurement = { duration, endTime, id: name, startTime };
  return measurement;
};

/**
 * @typedef {Object} measured~Measurement
 *
 * @param {number} duration - The amount of time, in milliseconds, elapsed during execution.
 * @param {number} endTime - The timestamp at which the execution completed.
 * @param {number} startTime - The timestamp at which the execution started.
 */

/**
 * @callback measured~Callback
 *
 * @param {measured~Measurement} measurement - A measurement of the execution time of the wrapped behavior.
 */

/**
 * @typedef {Object} measured~Options
 *
 * @param {string} [id] - A unique identifier for the wrapped behavior, used to create labels for the underlying Node.js Performance API.
 * @param {measured~Callback} [onComplete] - A callback invoked after the wrapped behavior has completed, whether it resolves or rejects.
 * @param {measured~Callback} [onReject] - A callback invoked only after the wrapped behavior has rejected.
 * @param {measured~Callback} [onResolve] - A callback invoked only after the wrapped behavior has resolved.
 */

/**
 * Transparently measure the execution time of an asynchronous function.
 *
 * @param {Function} behavior - The behavior to be measured.
 * @param {measured~Options} [options={}] - Configuration options.
 *
 * @returns {*} - Wraps the given behavior.
 */
const measured = (behavior, options = {}) => {
  const {
    id = generateId(),
    onComplete = STUB,
    onReject = STUB,
    onResolve = STUB
  } = options;

  const before = `${id}:before`;
  const after = `${id}:after`;

  const clearMarks = () => {
    performance.clearMarks(before);
    performance.clearMarks(after);
  };

  // The way the Node.js Performance API is designed makes this rule counter-productive
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    const state = {};

    const observer = new PerformanceObserver((items) => {
      const measurement = getMeasurement(items);

      if (measurement.id === id) {
        clearMarks();
        observer.disconnect();

        if (state.isRejected) {
          onReject({ ...measurement });
          reject(state.error);
        } else {
          onResolve({ ...measurement });
          resolve(state.result);
        }

        onComplete(measurement);
      }
    });

    observer.observe({ entryTypes: ['measure'] });

    performance.mark(before);

    try {
      state.result = await behavior();
    } catch (error) {
      // Set this flag to support cases where the thrown error is falsey
      state.isRejected = true;

      state.error = error;
    }

    performance.mark(after);
    performance.measure(id, before, after);
  });
};

export { measured };

export default measured;
