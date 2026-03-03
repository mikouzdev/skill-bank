import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Box,
  Divider,
  useMediaQuery,
  AppBar,
  Toolbar,
  Button,
  useTheme,
} from "@mui/material";
import { Person, Edit, People, Logout, Groups } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import CustomerAcceptConsultant from "../../features/customer/components/CustomerAcceptConsultant";

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
    path: "consultant/me",
    icon: <Person />,
    roles: [ROLES.CONSULTANT],
  },
  {
    text: "Consultants",
    path: "/listConsultants",
    icon: <People />,
    roles: [ROLES.CONSULTANT, ROLES.SALESPERSON],
  },
  {
    text: "Consultant lists",
    path: "/salesConsultantsList",
    icon: <Groups />,
    roles: [ROLES.SALESPERSON],
  },
  {
    text: "Create list",
    path: "/salesConsultantsList/create",
    icon: <Groups />,
    roles: [ROLES.SALESPERSON],
  },
  {
    text: "Edit profile",
    path: "consultant/me/edit",
    icon: <Edit />,
    roles: [ROLES.CONSULTANT],
  },
  { text: "Sales", path: "/sales", roles: [ROLES.SALESPERSON] }, //sales
  { text: "Admin", path: "/manage-users", roles: [ROLES.ADMIN] }, //admin
  {
    text: "Skill Editing",
    path: "/editSkills",
    roles: [ROLES.ADMIN, ROLES.SALESPERSON],
  },
  {
    text: "Offers",
    path: "/offers",
    icon: <People />,
    roles: [ROLES.CUSTOMER],
  },
  {
    text: "Offers",
    path: "/manage-offers",
    icon: <People />,
    roles: [ROLES.SALESPERSON],
  },
  {
    text: "Create offer",
    path: "/manage-offers/create",
    icon: <People />,
    roles: [ROLES.SALESPERSON],
  },
  {
    text: "Log Out",
    path: "/logout",
    icon: <Logout />,
    roles: [ROLES.CUSTOMER, ROLES.CONSULTANT, ROLES.ADMIN, ROLES.SALESPERSON],
  },
];

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuth();
  const { currentUser } = useAuth();

  const roles = user.currentUser?.roles ?? [];
  const activeRole = currentUser?.roles?.[0];
  const visibleItems = navItems.filter((item) => {
    return activeRole ? item.roles?.includes(activeRole) : false;
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const desktopSidebar = (
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

          <Divider sx={{ my: 2 }} />
          <CustomerAcceptConsultant roles={roles} />
        </List>
      </Box>
    </Drawer>
  );

  const mobileNavbar = (
    <AppBar>
      <Toolbar>
        {visibleItems.map((item) => (
          <Button
            key={item.path}
            onClick={() => void navigate(item.path)}
            sx={{
              flexDirection: "column",
              fontSize: 11,
            }}
          >
            {item.icon}
            {item.text}
          </Button>
        ))}
      </Toolbar>
    </AppBar>
  );

  return isMobile ? mobileNavbar : desktopSidebar;
}
