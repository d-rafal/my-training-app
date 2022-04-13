import { useState } from "react";

const useStateMachine = <T,>(initialState: Readonly<T>) => {
  const [machineState, setMachineState] = useState<T>(initialState);
  return [machineState, setMachineState] as const;
};

export default useStateMachine;
