const helpers = {
  wrapArray(value: any | any[]): any[] {
    return Array.isArray(value) ? value : [value];
  },
};

export default helpers;
