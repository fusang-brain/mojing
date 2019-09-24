import ReactDOM from 'react-dom';

/**
 * get ReactNode by Componetn instance
 * @param {*} reactNode
 */
export const getDOM = (reactNode?: React.ReactInstance) => {
  return ReactDOM.findDOMNode(reactNode); // eslint-disable-line
};
