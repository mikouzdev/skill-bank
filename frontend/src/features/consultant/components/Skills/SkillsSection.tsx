import { Box, Typography, Rating, Button } from "@mui/material";
import { useState } from "react";
import Circle from "@mui/icons-material/Circle";
import CircleIcon from "@mui/icons-material/Circle";

interface Skill {
  id: number;
  skill: string;
  points: number;
}
interface MockConsultant {
  skills: Skill[];
}
const skill: Skill = { id: 0, skill: "Java", points: 4 };
const skill1: Skill = { id: 1, skill: "C#", points: 3 };
const skill2: Skill = { id: 2, skill: "Python", points: 2 };
const consultant: MockConsultant[] = [{ skills: [skill, skill1, skill2] }];

export default function Skills() {
  const [user, setUser] = useState<MockConsultant[]>(consultant);

  function setSkill(input: number, id: number) {
    setUser((prev) =>
      prev.map((el) => ({
        ...el,
        skills: el.skills.map((s) =>
          s.id === id && s.points > -1 ? { ...s, points: input } : s
        ),
      }))
    );
  }

  return (
    <Box sx={{ p: 2, border: 1 }}>
      <Typography>
        Skills
        <Button>Add new Skill</Button>
      </Typography>
      <p>
        {user.map((el) => {
          return el.skills.map((el) => {
            return (
              <>
                <Typography>{el.skill}</Typography>
                <Rating
                  key={el.id}
                  name="hover-feedback"
                  value={el.points}
                  precision={1}
                  icon={<CircleIcon fontSize="inherit" />}
                  sx={{
                    color: "rgba(34, 130, 255, 1)",
                  }}
                  onChange={(event, newValue) => {
                    setSkill(newValue!, el.id);
                  }}
                  emptyIcon={
                    <Circle style={{ opacity: 0.55 }} fontSize="inherit" />
                  }
                />
              </>
            );
          });
        })}
      </p>
    </Box>
  );
}
