import { Chip } from "@mui/material";

type Props = {
  keyword: string;
  onDelete: (keyword: string) => void;
};

export const KeywordRuleItem = ({ keyword, onDelete }: Props) => {
  return (
    <Chip
      label={`${keyword}`}
      onDelete={() => onDelete(keyword)}
      variant="outlined"
      sx={{
        flexDirection: "row-reverse",
        paddingLeft: "10px",
        marginRight: "0px",
        paddingRight: "0px",

        "&:hover .MuiChip-deleteIcon": { color: "red" },
      }}
    />
  );
};
