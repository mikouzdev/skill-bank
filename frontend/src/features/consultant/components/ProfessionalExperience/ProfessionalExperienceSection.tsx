import { Box, Typography, Stack } from "@mui/material";
import ProfessionalExperienceItem from "./ProfessionalExperienceItem";
import { type ConsultantProfessionalExperienceItem } from "../../types/types";

export default function ProfessionalExperience() {
  const mockupItems: ConsultantProfessionalExperienceItem[] = [
    {
      id: 1,
      employer: "Company ABC",
      jobTitle: "Full-stack Developer",
      description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.    
    `,
      start: "03/2022",
      employmentSkills: [
        "JavaScript",
        "React.js",
        "Express.js",
        "Docker",
        "Azure",
      ],
    },
    {
      id: 2,
      employer: "Company XYZ",
      jobTitle: "Backend Developer",
      description: `At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium 
      voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate 
      non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. 
      Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio 
      cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. 
      Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et 
      molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias 
      consequatur aut perferendis doloribus asperiores repellat.`,
      start: "02/2021",
      end: "09/2022",
      employmentSkills: ["C#", "ASP.NET", "Docker"],
    },
    {
      id: 3,
      employer: "Company 123",
      jobTitle: "Mainframe Developer",
      description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
      start: "12/1990",
      end: "01/2000",
      employmentSkills: ["Cobol", "Assembly", "C"],
    },
  ];

  return (
    <Box
      sx={{
        p: 2,
      }}
    >
      <Stack spacing={1} sx={{ maxWidth: 1200 }}>
        <Typography variant="h5">Professional Experience</Typography>
        <Stack spacing={1}>
          {mockupItems.map((item, i) => (
            <ProfessionalExperienceItem key={i} item={item} />
          ))}
        </Stack>
      </Stack>
    </Box>
  );
}
