function withLogging(fn) {
  return function(...args) {
    console.log('Logging:', ...args);
    return fn.apply(this, args);
  }
}
function withTiming(fn) {
  return function(...args) {
    const start = performance.now();
    const result = fn.apply(this, args);
    const end = performance.now();
    console.log(`Thời gian phân tích: ${(end - start).toFixed(2)}ms`);
    return result;
  }
}
export { withLogging, withTiming };