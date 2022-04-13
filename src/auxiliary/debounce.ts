interface NextCall {
  nextCallIsWaiting: boolean;
  arg: any[];
}

function debounce(
  fn: (...rest: any[]) => void,
  waitingTime: number,
  scope?: any
) {
  let timeout: any = null;
  let callBlockingActive = false;
  let nextCall: NextCall = { nextCallIsWaiting: false, arg: null! };
  let context: any = null;

  function intervalFn() {
    if (nextCall.nextCallIsWaiting) {
      fn.apply<any, any[], void>(context, nextCall.arg);
      nextCall.nextCallIsWaiting = false;
      timeout = setTimeout(intervalFn, waitingTime);
    } else {
      callBlockingActive = false;
      nextCall.arg = null!;
      context = null;
    }
  }

  function returnFn(this: any, ...rest: any[]) {
    context = scope || this;

    if (callBlockingActive) {
      nextCall.nextCallIsWaiting = true;
      nextCall.arg = rest;
    } else {
      callBlockingActive = true;
      timeout = setTimeout(intervalFn, waitingTime);
      fn.apply<any, any[], void>(context, rest);
    }
  }

  returnFn.cancel = () => {
    clearTimeout(timeout);
    callBlockingActive = false;
    nextCall.nextCallIsWaiting = false;
    nextCall.arg = null!;
    context = null;
  };

  return returnFn;
}

export default debounce;
