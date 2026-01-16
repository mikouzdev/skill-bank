import { Avatar, Box, IconButton, Stack, Typography } from "@mui/material";

import { SiGitlab, SiGithub, SiLinkedin } from "react-icons/si";
import { MdEmail } from "react-icons/md";
import type { components } from "@api-types/openapi";

type Consultant = components["schemas"]["ConsultantResponse"];

type Props = {
  data: Consultant;
};

export default function ProfileHeader({ data }: Props) {
  // TODO: fetch links for icons.
  const ICON_SIZE = 30;
  const iconLinkStack = (
    <Stack direction="row" spacing={2} alignItems={"center"}>
      <IconButton
        href="http://linkedin.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        <SiLinkedin size={ICON_SIZE} />
      </IconButton>

      <IconButton
        href="http://github.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        <SiGithub size={ICON_SIZE} />
      </IconButton>

      <IconButton
        href="http://gitlab.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        <SiGitlab size={ICON_SIZE} />
      </IconButton>

      <IconButton href="emailto:">
        <MdEmail size={ICON_SIZE} />
      </IconButton>
    </Stack>
  );

  // name, title and attribute icon links.
  const headerTitle = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: 3,
      }}
    >
      <Stack>
        <Typography variant="h4">{data.user.name}</Typography>
        <Typography variant="h6">{data.roleTitle}</Typography>
      </Stack>
      {iconLinkStack}
    </Box>
  );

  const PROFILE_PICTURE_SIZE = 170;
  const profilePicture = (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Avatar
        alt={data.user.name}
        src={data.profilePictureUrl}
        sx={{ width: PROFILE_PICTURE_SIZE, height: PROFILE_PICTURE_SIZE }}
      />
    </Box>
  );

  return (
    <Box
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        gap: 3,
      }}
    >
      {profilePicture}

      <Stack spacing={1} sx={{ maxWidth: 1000 }}>
        {headerTitle}

        <Typography>{data.description}</Typography>
      </Stack>
    </Box>
  );
}
