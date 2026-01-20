import { Paper, Box } from "@mui/material";
import { ConsultantCard } from "../components/ConsultantCard";
import { useEffect, useState } from "react";
import {
  filterConsultants,
  getConsultants,
} from "../../consultant/api/consultants.api";
import SearchBar from "../../../shared/components/Search";

export const ConsultantListView = () => {
  const [ids, setIds] = useState<number[]>([]);
  const [search, setSearch] = useState<string>("");

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
    load().catch(console.error);
  }, []);

  const loadConsultants = async () => {
    try {
      const response = await filterConsultants(search);
      const consultants = response.data;
      setIds(consultants.map((c) => c.userId));
    } catch (err) {
      console.error("Failed to load consultants", err);
    }
  };

  return (
    <>
      <Paper sx={{ border: 1, margin: "16px", background: "#efefef" }}>
        <SearchBar
          getText={setSearch}
          loadConsultants={() => void loadConsultants()}
        />
        {ids.map((id) => (
          <Box key={id} sx={{ m: 3, border: 1, background: "white" }}>
            <ConsultantCard consultantID={id} />
          </Box>
        ))}
      </Paper>
    </>
  );
};
