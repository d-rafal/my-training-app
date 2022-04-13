import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const DeleteIconButton = ({
  onClick,
}: {
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}) => {
  return (
    <IconButton aria-label="delete" onClick={onClick}>
      <DeleteIcon />
    </IconButton>
  );
};

export default DeleteIconButton;
