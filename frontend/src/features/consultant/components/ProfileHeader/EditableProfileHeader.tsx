import {
  Avatar,
  Box,
  Button,
  Stack,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import type { components } from "@api-types/openapi";
import { useState, useRef } from "react";
import { updateProfile } from "../../api/consultants.api";

type Consultant = components["schemas"]["ConsultantResponse"];

type Props = {
  data: Consultant;
};

export default function EditableProfileHeader({ data }: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [editedDetails, setEditedDetails] = useState<Consultant>(data);
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedDetails({
      ...editedDetails,
      user: { ...editedDetails.user, name: event.target.value },
    });
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedDetails({ ...editedDetails, roleTitle: event.target.value });
  };

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEditedDetails({ ...editedDetails, description: event.target.value });
  };

  // TODO: ability to update phone number and email
  const handleSubmitEdits = async () => {
    try {
      setLoading(true);
      const formData = new FormData();

      // full name
      if (editedDetails.user.name) {
        formData.append("user[name]", editedDetails.user.name);
      }

      if (editedDetails.roleTitle) {
        formData.append("roleTitle", editedDetails.roleTitle);
      }

      if (editedDetails.description) {
        formData.append("description", editedDetails.description);
      }

      if (profilePictureFile) {
        formData.append("profilePicture", profilePictureFile);
      }

      // just to see the loading icon :)
      await new Promise((res) => setTimeout(res, 500));

      await updateProfile(formData);
    } catch (error) {
      console.error("Failed to update profile details", error);
      alert("error while trying to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      setProfilePictureFile(file);
      const reader = new FileReader();

      // set profile picture "preview"
      reader.onload = (e) => {
        setEditedDetails({
          ...editedDetails,
          profilePictureUrl: e.target?.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChangePicture = () => {
    fileInputRef.current?.click();
  };

  const headerTitle = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: 3,
      }}
    >
      <Stack gap={2} width={"100%"}>
        <Stack direction={"row"} gap={2} width={"100%"}>
          <TextField
            label="Full name"
            value={editedDetails.user.name}
            onChange={handleNameChange}
            variant="outlined"
            type="text"
            fullWidth
          />
          <TextField
            label="Title"
            value={editedDetails.roleTitle}
            onChange={handleTitleChange}
            variant="outlined"
            fullWidth
          />
        </Stack>
        <TextField
          label="Description"
          value={editedDetails.description}
          onChange={handleDescriptionChange}
          variant="outlined"
          fullWidth
          minRows={3}
          multiline
        />
        <Stack direction={"row"} gap={2}>
          <TextField
            label="Phone"
            defaultValue="phone (not implemented)"
            variant="outlined"
            fullWidth
            disabled
          />
          <TextField
            label="Email"
            defaultValue="email (not implemented)"
            variant="outlined"
            fullWidth
            disabled
          />
        </Stack>
        <Box sx={{ ml: "auto" }}>
          <Button
            variant="contained"
            size="small"
            onClick={() => {
              void handleSubmitEdits();
            }}
            loading={loading}
          >
            Apply edits
          </Button>
        </Box>
      </Stack>
    </Box>
  );

  const PROFILE_PICTURE_SIZE = isMobile ? 80 : 170;
  const profilePicture = (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flexDirection: isMobile ? "row" : "column",
        justifyContent: isMobile ? "center" : "flex-start",
        gap: 1,
      }}
    >
      <Avatar
        alt={editedDetails.user.name}
        src={editedDetails.profilePictureUrl}
        sx={{ width: PROFILE_PICTURE_SIZE, height: PROFILE_PICTURE_SIZE }}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
      <Button variant="outlined" size="small" onClick={handleChangePicture}>
        Change picture
      </Button>
    </Box>
  );

  return (
    <Box
      sx={{
        mt: isMobile ? 6 : 0,
        p: 2,
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        justifyContent: "center",
        gap: 3,
        width: "100%",
        maxWidth: "100%",
      }}
    >
      {profilePicture}

      <Stack spacing={1} sx={{ flex: 1 }}>
        {headerTitle}
      </Stack>
    </Box>
  );
}
