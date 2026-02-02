import { Chip } from "@mui/material";
import type { SkillFilterRule } from "./SkillSearchBuilder";

type Props = {
  rule: SkillFilterRule;
  onDelete: (id: string) => void;
};

export const SkillRuleItem = ({ rule, onDelete }: Props) => {
  return (
    <Chip
      label={`${rule.skill} ${rule.operator} ${rule.skillLevel}`}
      onDelete={() => onDelete(rule.id)}
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
