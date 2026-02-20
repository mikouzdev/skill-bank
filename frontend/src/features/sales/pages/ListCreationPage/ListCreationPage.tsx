import type { components } from "@api-types/openapi";
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { useEffect, useState } from "react";
import { getConsultants } from "../../../consultant/api/consultants.api";
import { ConsultantCard } from "../../components/ConsultantCard";
import { useAuth } from "../../../../app/hooks/useAuth";
import { useSnackbar } from "../../../../shared/components/useSnackbar";
import { createSalesList } from "../../../../shared/api/offers.api";
import NoteAddDialog from "./NoteAddDialog";

type ConsultantList = components["schemas"]["AllConsultantsResponse"];
type Consultant = components["schemas"]["ConsultantResponse"];
type SalesListBody = components["schemas"]["SalesListBody"];

const emptyList: SalesListBody = {
  description: "",
  shortDescription: "",
  isReviewDone: false,
  salesListItems: [],
};

type Note = {
  consultantId: number;
  note: string;
};

export default function ListCreationPage() {
  const { currentUser } = useAuth();
  const { showError, showSuccess } = useSnackbar();
  const [consultants, setConsultants] = useState<ConsultantList>([]);
  const [addedConsultants, setAddedConsultants] = useState<ConsultantList>([]);
  const [list, setList] = useState<SalesListBody>(emptyList);
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    async function fetchConsultants() {
      try {
        const response = await getConsultants();
        setConsultants(response.data);
      } catch (error) {
        console.log(error);
      }
    }

    void fetchConsultants();
  }, []);

  function handleSelectConsultant(consultant: Consultant) {
    if (addedConsultants.some((c) => c.id === consultant.id)) return;
    setAddedConsultants((prev) => [...prev, consultant]);
  }

  function handleRemoveConsultant(id: number) {
    setAddedConsultants((prev) => prev.filter((c) => c.id !== id));
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setList((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!currentUser || currentUser?.salespersonId === null) {
      showError("You are not authorized to create an offer.");
      return;
    }

    const newList: SalesListBody = {
      ...list,
      salesListItems: addedConsultants.map((c) => ({
        consultantId: c.id,
        isAccepted: false,
        isHidden: false,
        salesNote: notes.find((n) => n.consultantId === c.id)?.note || "",
      })),
    };

    try {
      await createSalesList(currentUser.salespersonId, newList);
      // reset form
      setList(emptyList);
      setAddedConsultants([]);
      showSuccess("List created succesfully!");
    } catch (error) {
      showError("Failed to create list.");
      console.log(error);
    }
  }

  const handleAddNote = (consultantId: number, note: string) => {
    setNotes((prev) => {
      const existingIndex = prev.findIndex(
        (n) => n.consultantId === consultantId
      );

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = { consultantId, note };
        return updated;
      }

      return [...prev, { consultantId, note }];
    });
  };

  const listDetailsForm = (
    <Stack gap={3} component={"form"} onSubmit={(e) => void handleSubmit(e)}>
      <Stack direction={"row"} gap={3} justifyContent={"space-between"}>
        <TextField
          fullWidth
          size="small"
          type="text"
          label="List short description"
          name="shortDescription"
          required
          value={list.shortDescription || ""}
          onChange={handleChange}
        />
      </Stack>

      {/* description */}
      <Stack direction={"row"} gap={3} justifyContent={"space-between"}>
        <Stack flex={1} maxHeight={180} height={180}>
          <TextField
            fullWidth
            size="small"
            type="text"
            label="List description"
            name="description"
            multiline
            sx={{
              height: "100%",
              "& .MuiInputBase-root": { height: "100%", alignItems: "stretch" },
              "& textarea": { height: "100% !important" },
            }}
            value={list.description || ""}
            onChange={handleChange}
          />
        </Stack>

        {/* added consultants */}
        <Stack
          flex={1}
          sx={{ border: "1px solid rgba(0,0,0,0.25)" }}
          height={180}
          maxHeight={180}
          overflow={"scroll"}
        >
          <List>
            {addedConsultants.map((c) => (
              <ListItem key={c.id} disablePadding>
                <ListItemButton>
                  <ListItemAvatar>
                    <Avatar
                      alt={`${c.user.name} picture`}
                      src={c.profilePictureUrl}
                    />
                  </ListItemAvatar>
                  <ListItemText primary={c.user.name} />
                </ListItemButton>
                <Stack direction={"row"} spacing={1}>
                  <NoteAddDialog consultant={c} onNoteAdd={handleAddNote} />

                  <Checkbox
                    edge="end"
                    checked={true}
                    onChange={() => handleRemoveConsultant(c.id)}
                  />
                </Stack>
              </ListItem>
            ))}
          </List>
        </Stack>
      </Stack>
      <Box display={"flex"} justifyContent={"flex-end"}>
        <Button type="submit" size="small">
          Create list
        </Button>
      </Box>
    </Stack>
  );

  return (
    <>
      <Container>
        <Stack gap={3}>
          <Box>
            <Typography variant="h5" gutterBottom>
              Create list
            </Typography>
            {listDetailsForm}
          </Box>

          <Divider />

          <Box>
            <Typography variant="h5" gutterBottom>
              Select consultants
            </Typography>
            <Stack gap={3}>
              {consultants.map((c) => (
                <ConsultantCard
                  key={c.id}
                  consultantID={c.id}
                  selectable
                  onSelect={handleSelectConsultant}
                />
              ))}
            </Stack>
          </Box>
        </Stack>
      </Container>
    </>
  );
}
