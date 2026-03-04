import { Paper, Box, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { UserCard } from "../components/UserCard";
import { AddUserDialog } from "../components/AddUserDialog";
import { DeleteUsersDialog } from "../components/DeleteUsersDialog";
import { createUser, deleteUser, getUsers, updateUser } from "../api/admin.api";
import type { components } from "@api-types/openapi";
import { useSnackbar } from "../../../shared/components/useSnackbar";
import { getConsultants } from "../../consultant/api/consultants.api";
// import { searchConsultants } from "../../consultant/api/consultants.api";
// import SearchBar from "../../../shared/components/Search";

type UserRequest = components["schemas"]["UserBody"];
type UserBodyPartial = components["schemas"]["UserBodyPartial"];
type UserListResponse = components["schemas"]["AllUsersResponse"];
type ConsultantProfile = components["schemas"]["ConsultantResponse"];

type SelectedUser = {
  id: number;
  name: string;
};

export const ManageUsersPage = () => {
  const { showSuccess, showError } = useSnackbar();
  const [users, setUsers] = useState<UserListResponse>([]);
  const [selectedUsers, setSelectedUsers] = useState<SelectedUser[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [consultants, setConsultants] = useState<ConsultantProfile[]>([]);
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
        setError("");
        setLoading(true);
        const response = await getUsers();
        const consultantsResponse = await getConsultants();
        setUsers(response.data);
        setConsultants(consultantsResponse.data);
      } catch (err) {
        console.error("Failed to load users", err);
        setError("Failed to load users");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  if (loading) return <Typography>Loading...</Typography>;

  if (error) return <Typography>{error}</Typography>;

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
    try {
      const response = await createUser(user);
      setUsers((prev) => [...prev, response.data]);
      showSuccess("User created succesfully.");
      return true;
    } catch (error: unknown) {
      console.log("failed to create user: ", error);
      showError("Failed to create user, more info in console");
      return false;
    }
  }

  async function handleDeleteUsers(): Promise<boolean> {
    for (const selected of selectedUsers) {
      try {
        await deleteUser(selected.id);
        setUsers((prev) => prev.filter((user) => user.id !== selected.id));
      } catch (error) {
        console.log(`failed to delete user: ${selected.name}`, error);
        showError("Error while deleting user");
        return false;
      }
    }
    setSelectedUsers([]);
    return true;
  }

  async function handleUpdateUser(
    id: number,
    payload: UserBodyPartial
  ): Promise<boolean> {
    try {
      const response = await updateUser(id, payload);
      setUsers((prev) =>
        prev.map((user) => (user.id === id ? response.data : user))
      );
      return true;
    } catch (error) {
      console.log("failed to update user: ", error);
      showError("Error while updating user.");
      return false;
    }
  }

  const getConsultantId = (user: number) => {
    let match;
    try {
      match = consultants.find((c) => c.userId === user);
      console.log(match);
    } catch (e) {
      console.error(e);
    }

    if (match != null) {
      return match.id;
    }
  };

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
              consultantId={getConsultantId(user.id) || undefined}
              selected={selectedUsers.some((u) => u.id === user.id)}
              onToggle={toggleSelected}
              onRoleChangeSubmit={(id, payload) =>
                handleUpdateUser(id, payload)
              }
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
