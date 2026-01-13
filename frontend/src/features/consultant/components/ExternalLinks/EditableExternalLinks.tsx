import { Stack, Box, TextField, Button, Typography } from "@mui/material";
import { useState } from "react";
import { SiGitlab, SiGithub, SiLinkedin } from "react-icons/si";

interface Props {
  links: string[] | null | undefined;
}

export default function EditableExternalLinks({ links }: Props) {
  const [gitLab, setGitlab] = useState("");
  const [gitHub, setGithub] = useState("");
  const [linkedIn, setLinkedIn] = useState("");

  function handleGitHubChange(event: React.ChangeEvent<HTMLInputElement>) {
    setGithub(event.target.value);
  }
  function handleGitLabChange(event: React.ChangeEvent<HTMLInputElement>) {
    setGitlab(event.target.value);
  }
  function handleLinkedInChange(event: React.ChangeEvent<HTMLInputElement>) {
    setLinkedIn(event.target.value);
  }
  const ICON_SIZE: number = 30;
  return (
    <>
      <Typography variant="h5">External Links</Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 3,
          width: "100%",
        }}
      >
        <Stack gap={2} width={"100%"}>
          <Stack direction={"column"} gap={2} width={"40%"}>
            <Stack direction={"row"} gap={2} width={"100%"} alignItems="center">
              <SiLinkedin size={ICON_SIZE} />
              <TextField
                label="LinkedIn"
                value={linkedIn}
                onChange={handleLinkedInChange}
                variant="outlined"
                type="text"
              />
            </Stack>
            <Stack direction={"row"} gap={2} width={"100%"} alignItems="center">
              <SiGithub size={ICON_SIZE} />
              <TextField
                label="Github"
                value={gitHub}
                onChange={handleGitHubChange}
                variant="outlined"
                type="text"
              />{" "}
            </Stack>

            <Stack direction={"row"} gap={2} width={"100%"} alignItems="center">
              <SiGitlab size={ICON_SIZE} />
              <TextField
                label="GitLab"
                value={gitLab}
                onChange={handleGitLabChange}
                variant="outlined"
                type="text"
              />{" "}
            </Stack>
          </Stack>{" "}
          <Box sx={{ ml: "auto" }}>
            <Button
              variant="contained"
              size="small"
              /*onClick={() => {
              void handleSubmitEdits();
            }}
            loading={loading}*/
            >
              Apply edits
            </Button>
          </Box>{" "}
        </Stack>
      </Box>
    </>
  );
}
