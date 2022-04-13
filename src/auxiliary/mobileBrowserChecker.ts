const mobileBrowserChecker = (
  callbackOnTrue?: () => void,
  callbackOnFalse?: () => void
) => {
  if (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  ) {
    callbackOnTrue && callbackOnTrue();
  } else {
    callbackOnFalse && callbackOnFalse();
  }
};

export default mobileBrowserChecker;
