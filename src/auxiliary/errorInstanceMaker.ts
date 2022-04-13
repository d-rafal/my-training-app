const errorInstanceMaker = (
  messageText: string,
  functionName?: string,
  componentName?: string
) => {
  let text = "";

  if (componentName) {
    text = `Error in component: ${componentName}${
      functionName ? `:${functionName}` : ""
    } : ${messageText}`;
  } else if (functionName) {
    text = `Error in function: ${functionName} : ${messageText}`;
  } else {
    text = `${messageText}`;
  }
  return new Error(text);
};

export default errorInstanceMaker;
