import { Box, Typography, Rating, Button } from "@mui/material";
import Circle from "@mui/icons-material/Circle";
import CircleIcon from "@mui/icons-material/Circle";

import { type SkillsResponse } from "../../types/types";

type Props = {
  data: SkillsResponse;
};

export default function Skills({ data }: Props) {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5">
        Skills
        <Button>Add new Skill</Button>
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateRows: "repeat(3, 1fr)",
          gridAutoFlow: "column",
          gridAutoColumns: "max-content",
          columnGap: 4,
        }}
      >
        {data.map((skill) => {
          return (
            <Box key={skill.id} sx={{ width: "fit-content" }}>
              <Typography>{skill.skillName}</Typography>
              <Rating
                name="hover-feedback"
                value={skill.proficiency}
                precision={1}
                icon={<CircleIcon fontSize="inherit" />}
                sx={{
                  color: "rgba(34, 130, 255, 1)",
                }}
                emptyIcon={
                  <Circle style={{ opacity: 0.55 }} fontSize="inherit" />
                }
              />
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
