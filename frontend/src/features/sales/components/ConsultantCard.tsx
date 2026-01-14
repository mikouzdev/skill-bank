import { Avatar, Box, Stack, Typography, Button } from "@mui/material"
import { useConsultantDetails } from "../../consultant/hooks/useConsultantDetails";
import SkillsBuilder from "./SkillsBuilder";

type Props = {
  consultantID: number;
};

export const ConsultantCard = ({consultantID}: Props) => {

const { consultant, skills, employments, projects, loading } =
    useConsultantDetails(consultantID);

  if (loading) return <Typography>Loading...</Typography>;
  if (!employments || !consultant || !projects || !skills)
    return <Typography>Error while fetching data.</Typography>;  


  return(
    <>
      <Box sx={{p: "12px"}}> 
        <Stack direction="row" spacing={2}>
          <Box>
          <Avatar alt={consultant.user.name} src={consultant.profilePictureUrl} />
          </Box>
          <Box>
            <Box>{consultant.user.name}</Box>
            <Box>{consultant.roleTitle}</Box>
          </Box>
          
          <Box>
            <Box>Professional Expereience</Box>
            <Box>5+ years</Box>
          </Box>
          
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start"}}>
            <SkillsBuilder data={skills}/>
            <Box sx={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
            <Button type="submit" sx={{ml: "auto" }}>View profile</Button>  
          </Box>
          </Box>
        </Stack>
      </Box>
    </>
    )

}