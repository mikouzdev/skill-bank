import type { components } from "@api-types/openapi";
import type { AxiosResponse } from "axios";
import {
  Stack,
  Box,
  TextField,
  Button,
  Typography,
  Switch,
  FormControlLabel,
  InputAdornment,
} from "@mui/material";
import { useState } from "react";
import { SiGitlab, SiGithub, SiLinkedin } from "react-icons/si";
import { createAttribute, updateAttribute } from "../../api/consultants.api";
import SectionVisibilitySwitch from "../../../../shared/components/SectionVisibilitySwitch";
import { useSnackbar } from "../../../../shared/components/useSnackbar";

type AttributeList = components["schemas"]["GetAttributesResponse"];
type AttributeResponse = components["schemas"]["Attribute"];
type AttributeBody = components["schemas"]["AttributeBody"];

interface Props {
  attributes: AttributeList;
}

type Links = {
  linkedIn: string;
  gitHub: string;
  gitLab: string;
};

export default function EditableExternalLinks({ attributes }: Props) {
  const { showError } = useSnackbar();

  const ICON_SIZE: number = 30;

  let linkedInLink = "";
  let gitLabLink = "";
  let gitHubLink = "";

  for (const attribute of attributes) {
    if (attribute.type === "LINK") {
      if (attribute.value.startsWith("https://linkedin.com/in")) {
        linkedInLink = attribute.value;
        linkedInLink = linkedInLink.split("/").filter(Boolean).pop() || "";
      } else if (attribute.value.startsWith("https://github.com")) {
        gitHubLink = attribute.value;
        gitHubLink = gitHubLink.split("/").filter(Boolean).pop() || "";
      } else if (attribute.value.startsWith("https://gitlab.com")) {
        gitLabLink = attribute.value;
        gitLabLink = gitLabLink.split("/").filter(Boolean).pop() || "";
      }
    }
  }

  const [links, setLinks] = useState<Links>({
    linkedIn: linkedInLink,
    gitHub: gitHubLink,
    gitLab: gitLabLink,
  });

  const [visibility, setVisibility] = useState({
    linkedIn: true,
    gitHub: true,
    gitLab: true,
  });

  const [loading, setLoading] = useState<boolean>(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    let processedValue = e.target.value;

    // converts full links to only username
    // example: "https://gitlab.com/alice" -> "alice"
    switch (e.target.name) {
      case "linkedIn":
      case "gitHub":
      case "gitLab": {
        const username = e.target.value.split("/").filter(Boolean).pop();
        processedValue = username || "";
        break;
      }
    }

    setLinks((prev) => ({ ...prev, [e.target.name]: processedValue }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const linkedInAt = attributes.find((att) => att.label === "LinkedIn");
    const gitHubAt = attributes.find((att) => att.label === "GitHub");
    const gitLabAt = attributes.find((att) => att.label === "GitLab");

    // todo: add LIMITED (consultant cant fetch own LIMITED links yet)
    const linkedInPayload: AttributeBody = {
      label: linkedInAt?.label || "LinkedIn",
      value: "https://linkedin.com/in/" + links.linkedIn,
      type: "LINK",
      visibility: visibility.linkedIn ? "PUBLIC" : "PUBLIC",
    };

    const gitHubPayload: AttributeBody = {
      label: gitHubAt?.label || "GitHub",
      value: "https://github.com/" + links.gitHub,
      type: "LINK",
      visibility: visibility.gitHub ? "PUBLIC" : "PUBLIC",
    };

    const gitLabPayload: AttributeBody = {
      label: gitLabAt?.label || "GitLab",
      value: "https://gitlab.com/" + links.gitLab,
      type: "LINK",
      visibility: visibility.gitLab ? "PUBLIC" : "PUBLIC",
    };

    try {
      setLoading(true);

      const updatePromises: Promise<AxiosResponse<AttributeResponse>>[] = [];

      // update or create linkedin
      if (links.linkedIn.trim()) {
        if (linkedInAt) {
          updatePromises.push(updateAttribute(linkedInAt.id, linkedInPayload));
        } else {
          updatePromises.push(createAttribute(linkedInPayload));
        }
      }

      // update or create github
      if (links.gitHub.trim()) {
        if (gitHubAt) {
          updatePromises.push(updateAttribute(gitHubAt.id, gitHubPayload));
        } else {
          updatePromises.push(createAttribute(gitHubPayload));
        }
      }

      // update or create gitlab
      if (links.gitLab.trim()) {
        if (gitLabAt) {
          updatePromises.push(updateAttribute(gitLabAt.id, gitLabPayload));
        } else {
          updatePromises.push(createAttribute(gitLabPayload));
        }
      }

      await Promise.all(updatePromises);
    } catch (error) {
      console.log("failed to update attributes: ", error);
      showError("Failed to update or create attributes.");
    } finally {
      setLoading(false);
    }
  }

  const sectionTitle = (
    <Stack direction={"row"} spacing={1}>
      <Typography variant="h5">External Links</Typography>
      <SectionVisibilitySwitch
        sectionData={{ name: "NETWORKING_LINKS", visibility: "PUBLIC" }}
      />
    </Stack>
  );

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          padding: 2,
          width: "100%",
          maxWidth: "100%",
        }}
        component="form"
        onSubmit={(e) => void handleSubmit(e)}
      >
        {sectionTitle}
        <Stack gap={2} width={"100%"}>
          <Stack direction={"column"} gap={2} width={"100%"}>
            <Stack direction={"row"} gap={2} width={"100%"} alignItems="center">
              <SiLinkedin size={ICON_SIZE} />
              <Stack spacing={1} width={"100%"}>
                <TextField
                  name="linkedIn"
                  label="LinkedIn"
                  value={links.linkedIn}
                  variant="outlined"
                  type="text"
                  onChange={handleChange}
                  fullWidth
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          https://linkedin.com/in/
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <FormControlLabel
                  control={
                    <Switch
                      size="small"
                      checked={visibility.linkedIn}
                      onChange={(e) =>
                        setVisibility((prev) => ({
                          ...prev,
                          linkedIn: e.target.checked,
                        }))
                      }
                    />
                  }
                  label="Visible to other consultants"
                />
              </Stack>
            </Stack>
            <Stack direction={"row"} gap={2} width={"100%"} alignItems="center">
              <SiGithub size={ICON_SIZE} />
              <Stack spacing={1} width={"100%"}>
                <TextField
                  name="gitHub"
                  label="Github"
                  value={links.gitHub}
                  variant="outlined"
                  type="text"
                  onChange={handleChange}
                  fullWidth
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          https://github.com/
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <FormControlLabel
                  control={
                    <Switch
                      size="small"
                      checked={visibility.gitHub}
                      onChange={(e) =>
                        setVisibility((prev) => ({
                          ...prev,
                          gitHub: e.target.checked,
                        }))
                      }
                    />
                  }
                  label="Visible to other consultants"
                />
              </Stack>
            </Stack>
            <Stack direction={"row"} gap={2} width={"100%"} alignItems="center">
              <SiGitlab size={ICON_SIZE} />
              <Stack spacing={1} width={"100%"}>
                <TextField
                  name="gitLab"
                  label="GitLab"
                  value={links.gitLab}
                  variant="outlined"
                  type="text"
                  onChange={handleChange}
                  fullWidth
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          https://gitlab.com/
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <FormControlLabel
                  control={
                    <Switch
                      size="small"
                      checked={visibility.gitLab}
                      onChange={(e) =>
                        setVisibility((prev) => ({
                          ...prev,
                          gitLab: e.target.checked,
                        }))
                      }
                    />
                  }
                  label="Visible to other consultants"
                />
              </Stack>
            </Stack>
          </Stack>
          <Box sx={{ ml: "auto" }}>
            <Button
              variant="contained"
              size="small"
              type="submit"
              loading={loading}
            >
              Apply edits
            </Button>
          </Box>
        </Stack>
      </Box>
    </>
  );
}
