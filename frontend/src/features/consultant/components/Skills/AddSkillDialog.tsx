import type { components } from "@api-types/openapi";
import {
  Button,
  Dialog,
  DialogTitle,
  MenuItem,
  Rating,
  Select,
  Stack,
  Typography,
  type SelectChangeEvent,
} from "@mui/material";
import { useState } from "react";
import { addSkill } from "../../api/consultants.api";
import { Circle } from "@mui/icons-material";
import CircleIcon from "@mui/icons-material/Circle";

type SkillTagList = components["schemas"]["SkillTagList"];
type SkillRequest = Partial<components["schemas"]["ConsultantSkill"]>;
type ConsultantSkill = components["schemas"]["ConsultantSkill"];

type Props = {
  skillData: SkillTagList;
  onSkillAdded?: (skill: ConsultantSkill) => void;
};

export default function AddSkillDialog({ skillData, onSkillAdded }: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<SkillTagList[number]>();
  const [profiency, setProfiency] = useState<number>(3);
  const [loading, setLoading] = useState<boolean>(false);

  function handleChange(e: SelectChangeEvent) {
    const newSelected = skillData.find(
      (skill) => skill.name === e.target.value
    );
    setSelected(newSelected);
  }

  function handleProfiencyChange(
    _e: React.SyntheticEvent,
    newValue: number | null
  ) {
    if (newValue === null) return;
    setProfiency(newValue);
  }

  async function handleAddSkill() {
    if (selected?.id === undefined) return;
    try {
      setLoading(true);

      // skill payload
      const newSkill: SkillRequest = {
        skillName: selected.name,
        proficiency: profiency,
      };

      // just to see the loading icon :)
      await new Promise((res) => setTimeout(res, 400));

      const response = await addSkill(newSkill);
      onSkillAdded?.(response.data);
      setIsOpen(false);
    } catch (error) {
      console.log(error);
      // todo: change alert to a more sophisticated feedback.
      alert("failed to add skill :-( \nskill probably already added");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button
        style={{
          backgroundColor: "white",
          color: "black",
          borderRadius: 38,
          height: 32,
        }}
        onClick={() => setIsOpen(true)}
      >
        Add Skill
      </Button>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <DialogTitle>Add skill</DialogTitle>
        <Stack padding={2} spacing={2} minWidth={300}>
          <Typography>Category (not implemented)</Typography>
          <Select>{/* todo category select */}</Select>
          <Typography>Skill</Typography>
          <Select value={selected?.name ?? ""} onChange={handleChange}>
            {skillData.map((skill) => (
              <MenuItem value={skill.name} key={skill.id}>
                {skill.name}
              </MenuItem>
            ))}
          </Select>

          <Typography>Profiency</Typography>
          <Rating
            value={profiency}
            onChange={handleProfiencyChange}
            name="hover-feedback"
            precision={1}
            icon={<CircleIcon fontSize="inherit" />}
            sx={{
              color: "rgba(34, 130, 255, 1)",
            }}
            emptyIcon={<Circle style={{ opacity: 0.55 }} fontSize="inherit" />}
          />
          <Button
            variant="contained"
            onClick={() => void handleAddSkill()}
            loading={loading}
          >
            Add skill
          </Button>
        </Stack>
      </Dialog>
    </>
  );
}
