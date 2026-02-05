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
import { useAuth } from "../hooks/useAuth";

const DRAWER_WIDTH = 220;

const ROLES = {
  CONSULTANT: "CONSULTANT",
  SALESPERSON: "SALESPERSON",
  CUSTOMER: "CUSTOMER",
  ADMIN: "ADMIN",
} as const;

interface NavItem {
  text: string;
  path: string;
  icon?: React.ReactElement;
  roles?: ("CONSULTANT" | "SALESPERSON" | "CUSTOMER" | "ADMIN")[]; //change this to a type?
}

const navItems: NavItem[] = [
  {
    text: "My profile",
    path: "/me",
    icon: <Person />,
    roles: [ROLES.CONSULTANT],
  }, // consultant
  {
    text: "Consultants",
    path: "/listConsultants",
    icon: <People />,
    roles: [ROLES.CONSULTANT, ROLES.SALESPERSON],
  }, // consultant, sales
  {
    text: "Edit profile",
    path: "/me/edit",
    icon: <Edit />,
    roles: [ROLES.CONSULTANT],
  }, // consultant
  { text: "Sales", path: "/sales", roles: [ROLES.SALESPERSON] }, //sales
  { text: "Admin", path: "/manage-users", roles: [ROLES.ADMIN] }, //admin
  {
    text: "Skill Editing",
    path: "/editSkills",
    roles: [ROLES.ADMIN, ROLES.SALESPERSON],
  }, // admin, sales
  {
    text: "Offers",
    path: "/offers",
    icon: <People />,
    roles: [ROLES.CUSTOMER],
  },
];

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuth();

  const role = user.currentUser?.roles ?? [];
  const visibleItems = navItems.filter((item) => {
    return item.roles?.some((r) => role.includes(r));
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
