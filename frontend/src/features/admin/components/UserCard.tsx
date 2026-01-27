import { Avatar, Box, Stack, Button, Checkbox } from "@mui/material";
import { ChangeUserRole } from "./ChangeUserRole";
import type { components } from "@api-types/openapi";

type SelectedUser = { id: number; name: string };
type UserResponse = components["schemas"]["UserResponse"];

type Props = {
  user: UserResponse;
  selected: boolean;
  onToggle: (user: SelectedUser) => void;
};

export const UserCard = ({ user, selected, onToggle }: Props) => {
  return (
    <>
      <Box sx={{ p: "12px", textWrap: "nowrap" }}>
        <Stack direction="row" spacing={2}>
          <Box>
            <Checkbox
              checked={selected}
              onChange={() =>
                onToggle({
                  id: user.id,
                  name: user.name,
                })
              }
            />
          </Box>
          <Box>
            <Avatar alt={user.name} />
          </Box>
          <Box>
            <Box>{user.name}</Box>
          </Box>

          {/* todo: show all roles */}
          <Box>{user.roles?.[0]?.role ? user.roles[0].role : "N/A"}</Box>
          <Box>123 Days ago</Box>

          <Box
            sx={{ width: "100%", display: "flex", justifyContent: "flex-end" }}
          >
            {/* <Button type="submit">Change role</Button>   */}
            <ChangeUserRole id={user.id} name={user.name} />
            <Button type="submit">View profile</Button>
          </Box>
        </Stack>
      </Box>
    </>
  );
};
