import useUpdateTitle from "../../components/title-provider/useUpdateTitle";
import UnderConstruction from "../../components/under-construction/UnderConstruction";

const Progress = () => {
  useUpdateTitle("Progress");

  return <UnderConstruction />;
};

export default Progress;
