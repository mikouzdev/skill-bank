import {
  Box,
  CircularProgress,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import {
  PersonOutline,
  GroupsOutlined,
  EditOutlined,
} from "@mui/icons-material";

import { useAuth } from "../../../app/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { updateRole } from "../api/updateRole";
import { theme } from "../../../styles/theme";

const roleBoxSx = {
  width: 140,
  height: 140,
  borderRadius: 2,
  border: 2,
  borderColor: "divider",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 1,
  cursor: "pointer",

  "&:hover": {
    bgcolor: "action.hover",
    transform: "scale(1.01)",
  },

  "&:active": {
    bgcolor: "action.selected",
    transform: "scale(0.97)",
  },
};

const iconSx = { fontSize: 64 };

export const LoginRolePageForm = () => {
  const { currentUser, refreshCurrentUser } = useAuth();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const roles = currentUser?.roles ?? [];
  if (roles.length <= 1)
    return (
      <Box sx={{ display: "flex" }}>
        <CircularProgress />
      </Box>
    );
  const handleSetActiveRole = async (role: string, path: string) => {
    try {
      await updateRole(role);
      await refreshCurrentUser();
    } catch (error) {
      console.error("Failed to change role:", error);
    }
    void navigate(path);
  };

  return (
    <Paper sx={{ padding: 2 }}>
      <Typography component="h1" variant="h4" sx={{ textAlign: "center" }}>
        Please select your role
      </Typography>

      <Stack
        direction={isMobile ? "column" : "row"}
        spacing={2}
        sx={{ mt: 2, justifyContent: "center", alignItems: "center" }}
      >
        {currentUser?.roles.includes("CONSULTANT") && (
          <Box
            data-cy="consultant-role-selector"
            sx={roleBoxSx}
            onClick={() =>
              void handleSetActiveRole("CONSULTANT", "/consultant/me")
            }
          >
            <PersonOutline sx={iconSx} />
            <Typography variant="subtitle1">Consultant</Typography>
          </Box>
        )}

        {currentUser?.roles.includes("SALESPERSON") && (
          <Box
            data-cy="salesperson-role-selector"
            sx={roleBoxSx}
            onClick={() => void handleSetActiveRole("SALESPERSON", "/sales")}
          >
            <GroupsOutlined sx={iconSx} />
            <Typography variant="subtitle1">Sales</Typography>
          </Box>
        )}

        {currentUser?.roles.includes("ADMIN") && (
          <Box
            data-cy="admin-role-selector"
            sx={roleBoxSx}
            onClick={() => void handleSetActiveRole("ADMIN", "/manage-users")}
          >
            <EditOutlined sx={iconSx} />
            <Typography variant="subtitle1">Admin</Typography>
          </Box>
        )}
      </Stack>
    </Paper>
  );
};
