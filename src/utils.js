function isMy() {
  return typeof my !== 'undefined';
}

const apis = isMy() ? my : wx;

function isString(o) {
  return typeof o === 'string';
}

function isArray(o) {
  return Object.prototype.toString.call(o) === '[Object array]';
}

/* eslint-disable no-undef */
const DOMExceptionError = typeof DOMException === 'undefined'
  ? Error
  : DOMException;
/* eslint-enable no-undef */

export default {
  isString,
  isArray,
  DOMExceptionError,
  isMy,
  apis,
};

export {
  isString,
  isArray,
  DOMExceptionError,
  isMy,
  apis,
};
