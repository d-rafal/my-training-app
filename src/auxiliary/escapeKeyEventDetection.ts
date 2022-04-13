const escapeKeyEventDetection = <T>(
  e: React.KeyboardEvent<T>,
  callbackIfTrue: () => void
): void => {
  if (e.key === "Escape") callbackIfTrue();
};

export { escapeKeyEventDetection };
