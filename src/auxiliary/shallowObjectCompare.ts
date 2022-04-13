const shallowObjectCompare: (
  obj1: {
    [key: string]: any;
  },
  obj2: {
    [key: string]: any;
  }
) => boolean = (
  obj1: {
    [key: string]: any;
  },
  obj2: {
    [key: string]: any;
  }
): boolean =>
  Object.keys(obj1).length === Object.keys(obj2).length &&
  Object.keys(obj1).every(
    (key) => obj2.hasOwnProperty(key) && obj1[key] === obj2[key]
  );

export default shallowObjectCompare;
