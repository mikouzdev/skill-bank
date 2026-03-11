import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useState } from "react";

type Operator = "GREATER" | "EQUAL" | "LESSER";
export type SkillFilterRule = {
  id: string;
  skill: string;
  skillLevel: string;
  operator: Operator;
};

type SkillSearchBuilderProps = {
  onAddRule: (rule: Omit<SkillFilterRule, "id">) => void;
};

export const ProfessionalExperienceSearchBuilder = ({
  onAddRule,
}: SkillSearchBuilderProps) => {
  const [skill, setSkill] = useState("");
  const [operator, setOperator] = useState<Operator | "">("");
  const [skillLevel, setSkillLevel] = useState<string>("");

  const handleAdd = () => {
    if (!skill || !operator || skillLevel === "") {
      return;
    }

    onAddRule({
      skill,
      skillLevel,
      operator,
    });

    setSkill("");
    setOperator("");
    setSkillLevel("");
  };

  return (
    <>
      <FormControl>
        <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
          Filter by skills
        </Typography>

        <Box display="flex" gap={2} alignItems="center">
          <InputLabel>Skill</InputLabel>
          <Select
            labelId="skill"
            id="skill"
            label="skills"
            value={skill}
            displayEmpty
            onChange={(e) => setSkill(e.target.value)}
          >
            <MenuItem value="" disabled>
              <em>Pick a skill level</em>
            </MenuItem>
            <MenuItem value={"skill1"}>skill1</MenuItem>
            <MenuItem value={"skill2"}>skill2</MenuItem>
            <MenuItem value={"skill3"}>skill3</MenuItem>
          </Select>

          <InputLabel>User role</InputLabel>
          <Select
            labelId="rule"
            id="rule"
            label="rule"
            value={operator}
            displayEmpty
            onChange={(e) => setOperator(e.target.value)}
          >
            <MenuItem value="" disabled>
              <em>Comparator</em>
            </MenuItem>
            <MenuItem value={"GREATER"}>greater than</MenuItem>
            <MenuItem value={"EQUAL"}>equal to</MenuItem>
            <MenuItem value={"LESSER"}>lesser than</MenuItem>
          </Select>

          <InputLabel>User role</InputLabel>
          <Select
            labelId="level"
            id="level"
            label="level"
            value={skillLevel}
            displayEmpty
            onChange={(e) => setSkillLevel(e.target.value)}
          >
            <MenuItem value="" disabled>
              <em>level</em>
            </MenuItem>
            <MenuItem value={"0"}>0</MenuItem>
            <MenuItem value={"1"}>1</MenuItem>
            <MenuItem value={"2"}>2</MenuItem>
            <MenuItem value={"3"}>3</MenuItem>
            <MenuItem value={"4"}>4</MenuItem>
            <MenuItem value={"5"}>5</MenuItem>
          </Select>
          <Button onClick={handleAdd}>Add</Button>
        </Box>
      </FormControl>
    </>
  );
};
