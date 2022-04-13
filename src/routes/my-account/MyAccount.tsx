import useUpdateTitle from "../../components/title-provider/useUpdateTitle";
import UnderConstruction from "../../components/under-construction/UnderConstruction";

const MyAccount = () => {
  useUpdateTitle("My Account");

  return <UnderConstruction />;
};

export default MyAccount;
