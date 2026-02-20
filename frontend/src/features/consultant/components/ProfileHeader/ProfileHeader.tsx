import {
  Avatar,
  Box,
  Button,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";

import { AccountCircle, Inbox } from "@mui/icons-material";
import { SiGitlab, SiGithub, SiLinkedin } from "react-icons/si";
import { MdEmail } from "react-icons/md";
import type { components } from "@api-types/openapi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../app/hooks/useAuth";

type Consultant = components["schemas"]["ConsultantResponse"];
type AttributeList = components["schemas"]["GetAttributesResponse"];

type Props = {
  data: Consultant;
  attributes: AttributeList;
  isCommentView?: boolean;
};

export default function ProfileHeader({
  data,
  attributes,
  isCommentView,
}: Props) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const isOwnProfile = currentUser?.consultantId === data.id;
  const isAuthorized =
    isOwnProfile ||
    currentUser?.roles.some((r) => r === "SALESPERSON" || r === "ADMIN");

  async function navigateToComments() {
    try {
      await navigate(
        isOwnProfile
          ? `/consultant/me/comments`
          : `/consultant/${data.id}/comments`
      );
    } catch (err) {
      console.log(err);
    }
  }

  async function navigateToProfile() {
    try {
      await navigate(
        isOwnProfile ? `/consultant/me` : `/consultant/${data.id}`
      );
    } catch (err) {
      console.log(err);
    }
  }

  let linkedInLink = "";
  let gitLabLink = "";
  let gitHubLink = "";

  for (const attribute of attributes) {
    if (attribute.type === "LINK") {
      if (attribute.value.startsWith("https://linkedin.com")) {
        linkedInLink = attribute.value;
      } else if (attribute.value.startsWith("https://github.com")) {
        gitHubLink = attribute.value;
      } else if (attribute.value.startsWith("https://gitlab.com")) {
        gitLabLink = attribute.value;
      }
    }
  }

  const ICON_SIZE = 30;
  const iconLinkStack = (
    <Stack direction="row" spacing={2} alignItems={"center"}>
      {linkedInLink && (
        <IconButton
          href={linkedInLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          <SiLinkedin size={ICON_SIZE} />
        </IconButton>
      )}

      {gitHubLink && (
        <IconButton href={gitHubLink} target="_blank" rel="noopener noreferrer">
          <SiGithub size={ICON_SIZE} />
        </IconButton>
      )}

      {gitLabLink && (
        <IconButton href={gitLabLink} target="_blank" rel="noopener noreferrer">
          <SiGitlab size={ICON_SIZE} />
        </IconButton>
      )}

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
      <Box sx={{ display: "flex", ml: "auto", alignItems: "flex-start" }}>
        {isAuthorized && (
          <Button
            size="small"
            startIcon={!isCommentView ? <Inbox /> : <AccountCircle />}
            sx={{ px: 1 }}
            onClick={
              !isCommentView
                ? () => void navigateToComments()
                : () => void navigateToProfile()
            }
          >
            {!isCommentView ? "View comments" : "View profile"}
          </Button>
        )}
      </Box>
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

      <Stack spacing={1} width={"100%"}>
        {headerTitle}

        <Typography>{data.description}</Typography>
      </Stack>
    </Box>
  );
}
