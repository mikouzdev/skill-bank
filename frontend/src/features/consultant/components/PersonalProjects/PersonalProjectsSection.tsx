import { Box, Typography, Stack } from "@mui/material";
import type { ConsultantProfileProjectItem } from "../../types/types";
import PersonalProjectItem from "./PersonalProjectItem";

export default function PersonalProjects() {
  const mockupProjects: ConsultantProfileProjectItem[] = [
    {
      id: 1,
      name: "Project A",
      description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
      sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
      Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
      Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
      start: "03/03/2023",
      end: "",
      projectSkills: ["Angular.js", "Docker", "Azure", "C#"],
      projectLinks: [{ id: 0, url: "a", label: "b" }],
    },
    {
      id: 2,
      name: "Project B",
      description: `Duis viverra fermentum neque quis luctus. 
      Mauris turpis nisi, posuere a pharetra dignissim, 
      fermentum vitae urna. Maecenas eget laoreet orci, 
      eget finibus dui. Quisque ullamcorper volutpat quam quis efficitur. 
      Praesent interdum semper justo nec tristique. 
      Duis sit amet felis ac dui pharetra dapibus sed id tortor. 
      Sed elementum arcu eu lacus ornare dapibus. Cras vel dictum felis. `,
      start: "14/06/2022",
      end: "07/10/2022",
      projectSkills: [
        "C#",
        "C++",
        "Holy C",
        "Go",
        "Rust",
        "Azure",
        "AWS",
        "Docker",
      ],
      projectLinks: [{ id: 0, url: "a", label: "b" }],
    },
  ];

  return (
    <Box
      sx={{
        p: 2,
      }}
    >
      <Stack spacing={1} sx={{ maxWidth: 1200 }}>
        <Typography variant="h5">Personal Projects</Typography>
        <Stack spacing={1}>
          {mockupProjects.map((item) => (
            <PersonalProjectItem item={item} />
          ))}
        </Stack>
      </Stack>
    </Box>
  );
}
