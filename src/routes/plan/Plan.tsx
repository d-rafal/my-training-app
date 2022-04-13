import useUpdateTitle from "../../components/title-provider/useUpdateTitle";
import UnderConstruction from "../../components/under-construction/UnderConstruction";

const Plan = () => {
  useUpdateTitle("Plan");
  return <UnderConstruction />;
};

export default Plan;
