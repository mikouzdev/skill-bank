import { Avatar, Box, Stack, Typography, Button, Checkbox } from "@mui/material"
import { useConsultantDetails } from "../../consultant/hooks/useConsultantDetails";
import { ChangeUserRole } from "./ChangeUserRole";


type SelectedUser = { id: number; name: string };


type Props = {
  consultantID: number;
  selected: boolean;
  onToggle: (user: SelectedUser) => void;
};

export const UserCard = ({consultantID, selected, onToggle}: Props) => {

const { consultant, loading } =
    useConsultantDetails(consultantID);

  if (loading) return <Typography>Loading...</Typography>;
  if ( !consultant )
    return <Typography>Error while fetching data.</Typography>;  


  return(
    <>
      <Box sx={{p: "12px", textWrap: "nowrap"}}> 
        <Stack direction="row" spacing={2} >
          <Box >
          <Checkbox 
          checked={selected}
          onChange={() => onToggle({
            id: consultantID,
            name: consultant.user.name,
            }
          )}
          />
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
            {/* <Button type="submit">Change role</Button>   */}
            <ChangeUserRole id={consultant.userId} name={consultant.user.name} />
            <Button type="submit">View profile</Button>  
          </Box>
          
        </Stack>
      </Box>
    </>
    )

}