import {
  Avatar,
  Box,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";

import { SiGitlab, SiGithub, SiLinkedin } from "react-icons/si";
import { MdEmail } from "react-icons/md";
import type { ConsultantProfileHeader } from "../../types/types";

type Props = {
  data: ConsultantProfileHeader;
};

export default function ProfileHeader({ data }: Props) {
  // attributes that have a existing icon.
  const linkedin = data.attributes.find((a) => a.label === "linkedin");
  const github = data.attributes.find((a) => a.label === "github");
  const gitlab = data.attributes.find((a) => a.label === "gitlab");
  const email = data.attributes.find((a) => a.label === "email");
  const phone = data.attributes.find((a) => a.label === "phone");

  const ICON_SIZE = 30;
  const iconLinkStack = (
    <Stack direction="row" spacing={2} alignItems={"center"}>
      {linkedin && (
        <IconButton
          href={linkedin.value}
          target="_blank"
          rel="noopener noreferrer"
        >
          <SiLinkedin size={ICON_SIZE} />
        </IconButton>
      )}

      {github && (
        <IconButton
          href={github.value}
          target="_blank"
          rel="noopener noreferrer"
        >
          <SiGithub size={ICON_SIZE} />
        </IconButton>
      )}

      {gitlab && (
        <IconButton
          href={gitlab.value}
          target="_blank"
          rel="noopener noreferrer"
        >
          <SiGitlab size={ICON_SIZE} />
        </IconButton>
      )}

      {email && (
        <IconButton href={`mailto:${email.value}`}>
          <MdEmail size={ICON_SIZE} />
        </IconButton>
      )}
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
        <Typography variant="h4">{data.name}</Typography>
        {/* TODO: add consultant profile title from available data */}
        {/* <Typography variant="h6">Full-stack Developer</Typography> */}
      </Stack>
      {iconLinkStack}
    </Box>
  );

  const PROFILE_PICTURE_SIZE = 170;
  const profilePicture = (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Avatar
        alt={data.name}
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
        justifyContent: "center",
        gap: 3,
      }}
    >
      {profilePicture}

      <Stack spacing={1} sx={{ maxWidth: 1000 }}>
        {headerTitle}

        <Typography>{data.description}</Typography>
        <Divider />
        {phone && <Typography>Phone: {phone.value}</Typography>}
      </Stack>
    </Box>
  );
}
