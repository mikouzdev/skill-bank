import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Box,
} from "@mui/material";
import { Person, Edit, People } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";

const DRAWER_WIDTH = 220;

interface NavItem {
  text: string;
  path: string;
  icon?: React.ReactElement;
  roles?: ("CONSULTANT" | "SALESPERSON" | "CUSTOMER" | "ADMIN")[];
}

const navItems: NavItem[] = [
  { text: "My profile", path: "/me", icon: <Person /> }, // consultant
  { text: "Consultants", path: "/listConsultants", icon: <People /> }, // consultant, sales
  { text: "Edit profile", path: "/me/edit", icon: <Edit /> }, // consultant
  { text: "Sales", path: "/sales" },
  { text: "Admin", path: "/manage-users" },
  { text: "Skill Editing", path: "/editSkills" }, // admin, sales
];

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const visibleItems = navItems.filter((item) => {
    if (!item.roles) return true;
    //todo: use role based visibility on items
  });

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: DRAWER_WIDTH,
        },
      }}
    >
      <Box>
        <List>
          {visibleItems.map((item) => (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => void navigate(item.path)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}
