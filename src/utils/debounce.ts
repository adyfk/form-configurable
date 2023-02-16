const debounce = (func: any, wait: number) => {
  let timeout: any;
  return function mainFunction(...args: any) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export default debounce;
