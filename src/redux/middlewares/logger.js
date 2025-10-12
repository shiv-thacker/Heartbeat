/**
 * Redux Logger Middleware
 * Logs all actions and state changes in development mode
 */

const logger = (store) => (next) => (action) => {
  if (__DEV__) {
    console.group(action.type);
    console.info('dispatching', action);
    const result = next(action);
    console.log('next state', store.getState());
    console.groupEnd();
    return result;
  }
  return next(action);
};

export default logger;
