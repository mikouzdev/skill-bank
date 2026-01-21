import { Paper, Box, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import {
  getConsultants,
  searchConsultants,
} from "../../consultant/api/consultants.api";
import { UserCard } from "../components/UserCard";
import { AddUserDialog } from "../components/AddUserDialog";
import SearchBar from "../../../shared/components/Search";
import { DeleteUsersDialog } from "../components/DeleteUsersDialog";


type SelectedUser = {
  id: number;
  name: string;
}

export const ManageUsersPage = () => {

  const [ids, setIds] = useState<number[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<SelectedUser[]>([]);
  const [search, setSearch] = useState<string>("");

  const toggleSelected = (user: SelectedUser) => {
  setSelectedUsers(prev =>
    prev.some(u => u.id === user.id)
      ? prev.filter(u => u.id !== user.id)
      : [...prev, user]
    );
  };

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
    load().catch(console.error);
  }, []);

  const loadConsultants = async () => {
    try {
      const response = await searchConsultants(search);
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
          <Box key={id} sx={{ m: 3, background: "white" } }>
            <UserCard
              consultantID={id}
              selected={selectedUsers.some(u => u.id === id)}
              onToggle={toggleSelected}
             />
          </Box>
        ))}
        
      </Paper>
      <Stack 
        direction="row"
        spacing={2}
        sx={{ mt: 1 }}
        justifyContent="space-between"
        alignItems="center"
      >
        <Box>
          <AddUserDialog />
        </Box>
        <Box >
          <DeleteUsersDialog selectedUsers={selectedUsers} />
        </Box>
      </Stack>      
    </>
  );
};
