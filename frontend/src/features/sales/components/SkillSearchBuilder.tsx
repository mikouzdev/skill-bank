import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

type Operator = "GREATER" | "EQUAL" | "LESSER";
export type SkillFilterRule = {
  id: string;
  skill: string;
  skillLevel: string;
  operator: Operator;
};

type SkillDto = {
  id: number;
  categoryid: number | null;
  name: string;
};

type SkillSearchBuilderProps = {
  onAddRule: (rule: Omit<SkillFilterRule, "id">) => void; //(rule: SkillFilterRule) => void;
};

export const SkillSearchBuilder = ({ onAddRule }: SkillSearchBuilderProps) => {
  const [skill, setSkill] = useState("");
  const [operator, setOperator] = useState<Operator | "">("");
  const [skillLevel, setSkillLevel] = useState<string>("");

  const [skills, setSkills] = useState<SkillDto[]>([]);
  const [loadingSkills, setLoadingSkills] = useState(false);
  const [, setSkillsError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadSkills = async () => {
      setLoadingSkills(true);
      setSkillsError(null);

      try {
        const res = await fetch("http://localhost:5173/skills");

        if (!res.ok) throw new Error(`Failed to load skills (${res.status})`);

        const data = (await res.json()) as SkillDto[];

        if (!cancelled) setSkills(data);
      } catch (e) {
        if (!cancelled)
          setSkillsError(e instanceof Error ? e.message : "Unknown error");
      } finally {
        if (!cancelled) setLoadingSkills(false);
      }
    };

    void loadSkills();
    return () => {
      cancelled = true;
    };
  }, []);

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
      </FormControl>

      <Box display="flex" gap={2} alignItems="center">
        <FormControl>
          <InputLabel id="skill" shrink={true}>
            {" "}
            Skill
          </InputLabel>
          <Select
            labelId="skill"
            id="skill"
            label="skills"
            value={skill}
            displayEmpty
            notched={true}
            onChange={(e) => setSkill(e.target.value)}
          >
            <MenuItem value="" disabled>
              <em>{loadingSkills ? "Loading..." : "Pick a skill"}</em>
            </MenuItem>

            {skills.map((s) => (
              <MenuItem key={s.id} value={s.name}>
                {s.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel id="operator" shrink={true}>
            Operator
          </InputLabel>
          <Select
            labelId="operator"
            id="operator"
            label="operator"
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
        </FormControl>
        <FormControl>
          <InputLabel id="level" shrink={true}>
            Level
          </InputLabel>
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
        </FormControl>
        <FormControl>
          <Button onClick={handleAdd}>Add</Button>
        </FormControl>
      </Box>
    </>
  );
};
