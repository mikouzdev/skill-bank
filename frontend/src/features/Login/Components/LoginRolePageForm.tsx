import { Box, Paper, Stack, Typography } from "@mui/material"
import { PersonOutline, GroupsOutlined, EditOutlined } from "@mui/icons-material"

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
      transform: "scale(1.01)"
    },
    
    "&:active": {
      bgcolor: "action.selected",
      transform: "scale(0.97)",
    },
}

const iconSx = { fontSize: 64 } 

export const LoginRolePageForm = () => {
  
  return (
    <Paper sx={{ padding: 2 }}>
      <Typography component="h1" variant="h4" sx={{ textAlign: "center" }}>
        Please select your role
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mt: 2, justifyContent: "center" }}>
        <Box sx={roleBoxSx}>
          <PersonOutline sx={iconSx} />
          <Typography variant="subtitle1">Consultant</Typography>
        </Box>

        <Box sx={roleBoxSx}>
          <GroupsOutlined sx={iconSx} />
          <Typography variant="subtitle1">Sales</Typography>
        </Box>

        <Box sx={roleBoxSx}>
          <EditOutlined sx={iconSx} />
          <Typography variant="subtitle1">Admin</Typography>
        </Box>
      </Stack>
    </Paper>
  )
}
