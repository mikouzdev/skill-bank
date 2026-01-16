import { Avatar, Box, Stack, Typography, Button, Checkbox } from "@mui/material"
import { useConsultantDetails } from "../../consultant/hooks/useConsultantDetails";

type Props = {
  consultantID: number;
};

export const UserCard = ({consultantID}: Props) => {

const { consultant, skills, employments, projects, loading } =
    useConsultantDetails(consultantID);

  if (loading) return <Typography>Loading...</Typography>;
  if (!employments || !consultant || !projects || !skills)
    return <Typography>Error while fetching data.</Typography>;  


  return(
    <>
      <Box sx={{p: "12px", textWrap: "nowrap"}}> 
        <Stack direction="row" spacing={2} >
          <Box >
          <Checkbox />
          </Box>
          <Box>
          <Avatar alt={consultant.user.name} src={consultant.profilePictureUrl} />
          </Box>
          <Box>
            <Box >{consultant.user.name}</Box>
          </Box>
          
          <Box>Consultant </Box>
          <Box>123 Days ago</Box>
          
          
            <Box sx={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
            <Button type="submit">Change role</Button>  
              <Button type="submit">View profile</Button>  
          </Box>
          
        </Stack>
      </Box>
    </>
    )

}