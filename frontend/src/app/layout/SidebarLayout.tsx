import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Box } from "@mui/material";

export function SidebarLayout() {
  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box component="main" sx={{ p: 2, flexGrow: 1, minWidth: 0 }}>
        <Outlet />
      </Box>
    </Box>
  );
}
