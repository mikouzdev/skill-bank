import { Box, Typography, Rating, Button } from "@mui/material";
import Circle from "@mui/icons-material/Circle";
import CircleIcon from "@mui/icons-material/Circle";

import { type SkillsResponse } from "../../consultant/types/types";

type Props = {
  data: SkillsResponse;
};

export default function SkillsBuilder({ data }: Props) {
  return (
    <Box sx={{ p: 0 }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(2, max-content)", // 2 columns
          gridTemplateRows: "repeat(2, auto)", // 2 rows
          gap: 0,
        }}
      >
        {data.slice(0, 4).map((skill) => (
          <Box
            key={skill.id}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              width: "fit-content",
            }}
          >
            <Typography sx={{ whiteSpace: "nowrap" }}>
              {skill.skillName}
            </Typography>

        

        <Rating
          readOnly
          name={`skill-${skill.id}`}
          value={skill.proficiency}
          precision={1}
          icon={<CircleIcon fontSize="inherit" />}
          emptyIcon={<Circle style={{ opacity: 0.55 }} fontSize="inherit" />}
          sx={{
            color: "rgba(34, 130, 255, 1)",
            "& .MuiRating-icon": {
            fontSize: 10, 
          },           
          }}
          

        />
          </Box>
        ))}
      </Box>
    </Box>
  );
}

