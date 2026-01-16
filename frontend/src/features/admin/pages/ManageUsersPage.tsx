import { Paper, Box } from "@mui/material"
import { useEffect, useState } from "react";
import { getConsultants } from "../../consultant/api/consultants.api";
import { UserCard } from "../components/UserCard";


export const ManageUsersPage = () => {

  const [ids, setIds] = useState<number[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await getConsultants(); // change this to all users
        const consultants = response.data;
        setIds(consultants.map((c) => c.userId));
      } catch (err) {
        console.error("Failed to load users", err);
      }
    };
    load();
  }, []);

  return(
  <>
    <Paper sx={{  border: 1, margin: "16px", background: "#efefef"}}>
                
      {ids.map((id) => (
        <Box key={id} sx={{ m: 3, background: "white" }}>
          <UserCard consultantID={id} />
        </Box>
      ))}
 
      
     </Paper>
  </>
)
}