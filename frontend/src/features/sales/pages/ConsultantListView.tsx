import { Paper, Box } from "@mui/material"
import { ConsultantCard } from "../components/ConsultantCard"
import { useEffect, useState } from "react";
import { getConsultants } from "../../consultant/api/consultants.api";


export const ConsultantListView = () => {

  const [ids, setIds] = useState<number[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await getConsultants();
        const consultants = response.data;
        setIds(consultants.map((c) => c.userId));
      } catch (err) {
        console.error("Failed to load consultants", err);
      }
    };
    load();
  }, []);

  return(
  <>
    <Paper sx={{  border: 1, margin: "16px", background: "#efefef"}}>
                
      {ids.map((id) => (
        <Box key={id} sx={{ m: 3, border: 1, background: "white" }}>
          <ConsultantCard consultantID={id} />
        </Box>
      ))}
 
     </Paper>
  </>
)
}