import { Paper, Box, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { UserCard } from "../components/UserCard";
import { AddUserDialog } from "../components/AddUserDialog";
import { DeleteUsersDialog } from "../components/DeleteUsersDialog";
import { createUser, deleteUser, getUsers } from "../api/admin.api";
import type { components } from "@api-types/openapi";
// import { searchConsultants } from "../../consultant/api/consultants.api";
// import SearchBar from "../../../shared/components/Search";

type UserRequest = components["schemas"]["UserBody"];
type UserListResponse = components["schemas"]["AllUsersResponse"];

type SelectedUser = {
  id: number;
  name: string;
};

export const ManageUsersPage = () => {
  const [users, setUsers] = useState<UserListResponse>([]);
  const [selectedUsers, setSelectedUsers] = useState<SelectedUser[]>([]);
  // const [search, setSearch] = useState<string>("");

  const toggleSelected = (user: SelectedUser) => {
    setSelectedUsers((prev) =>
      prev.some((u) => u.id === user.id)
        ? prev.filter((u) => u.id !== user.id)
        : [...prev, user]
    );
  };

  useEffect(() => {
    const load = async () => {
      try {
        const response = await getUsers();
        setUsers(response.data);
      } catch (err) {
        console.error("Failed to load users", err);
      }
    };
    void load();
  }, []);

  // commented because it searches only consultants and not all users

  // const loadConsultants = async () => {
  //   try {
  //     const response = await searchConsultants(search);
  //     const consultants = response.data;
  //     setIds(consultants.map((c) => c.userId));
  //   } catch (err) {
  //     console.error("Failed to load consultants", err);
  //   }
  // };

  // todo: replace alerts with some more sophisticated feedback
  async function handleCreateNewUser(user: UserRequest): Promise<boolean> {
    console.log("user payload: ", user);
    try {
      const response = await createUser(user);
      setUsers((prev) => [...prev, response.data]);
      alert("Succesfully created a new user");
      return true;
    } catch (error: unknown) {
      console.log("failed to create user: ", error);
      alert("Failed to create user, more info in console");
      return false;
    }
  }

  async function handleDeleteUsers(): Promise<boolean> {
    for (const selected of selectedUsers) {
      try {
        await deleteUser(selected.id);
        setUsers((prev) => prev.filter((user) => user.id !== selected.id));
        setSelectedUsers([]);
      } catch (error) {
        console.log(`failed to delete user: ${selected.name}`, error);
        return false;
      }
    }

    return true;
  }

  return (
    <>
      <Paper sx={{ border: 1, margin: "16px", background: "#efefef" }}>
        {/* <SearchBar
          getText={setSearch}
          loadConsultants={() => void loadConsultants()}
        /> */}
        {users.map((user) => (
          <Box key={user.id} sx={{ m: 3, background: "white" }}>
            <UserCard
              user={user}
              selected={selectedUsers.some((u) => u.id === user.id)}
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
          <AddUserDialog onAddUser={handleCreateNewUser} />
        </Box>
        <Box>
          <DeleteUsersDialog
            selectedUsers={selectedUsers}
            onDelete={handleDeleteUsers}
          />
        </Box>
      </Stack>
    </>
  );
};
