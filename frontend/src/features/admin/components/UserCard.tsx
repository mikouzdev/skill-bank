import { Avatar, Box, Stack, Button, Checkbox } from "@mui/material";
import { ChangeUserRole } from "./ChangeUserRole";
import type { components } from "@api-types/openapi";
import dayjs from "dayjs";

type SelectedUser = { id: number; name: string };
type UserResponse = components["schemas"]["UserResponse"];
type UserBody = components["schemas"]["UserBodyPartial"];

type Props = {
  user: UserResponse;
  selected: boolean;
  onToggle: (user: SelectedUser) => void;
  onRoleChangeSubmit: (id: number, user: UserBody) => Promise<boolean>;
};

// user creation date
function userCreationDate(date: string | Date) {
  const now = dayjs();
  const target = date;

  const seconds = now.diff(target, "second");
  if (seconds < 60) return `${seconds} seconds ago`;

  const minutes = now.diff(target, "minute");
  if (minutes < 60) return `${minutes} minutes ago`;

  const hours = now.diff(target, "hour");
  if (hours < 24) return `${hours} hours ago`;

  const days = now.diff(target, "day");
  return `${days} days ago`;
}

export const UserCard = ({
  user,
  selected,
  onToggle,
  onRoleChangeSubmit,
}: Props) => {
  return (
    <>
      <Box sx={{ p: "12px", textWrap: "nowrap" }}>
        <Stack direction="row" spacing={2} alignItems="center">
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
          <Box>{userCreationDate(user.createdAt)}</Box>

          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-end",
              gap: 1,
            }}
          >
            <ChangeUserRole user={user} onSubmit={onRoleChangeSubmit} />
            <Button variant="contained" type="submit">
              View profile
            </Button>
          </Box>
        </Stack>
      </Box>
    </>
  );
};
