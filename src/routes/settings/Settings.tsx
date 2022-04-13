import useUpdateTitle from "../../components/title-provider/useUpdateTitle";
import UnderConstruction from "../../components/under-construction/UnderConstruction";

const Settings = () => {
  useUpdateTitle("Settings");

  return <UnderConstruction />;
};

export default Settings;
