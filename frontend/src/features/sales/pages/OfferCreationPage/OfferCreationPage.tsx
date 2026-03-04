import type { components } from "@api-types/openapi";
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Container,
  Dialog,
  DialogContent,
  Divider,
  IconButton,
  InputAdornment,
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
import { createOffer } from "../../../../shared/api/offers.api";
import { useAuth } from "../../../../app/hooks/useAuth";
import { useSnackbar } from "../../../../shared/components/useSnackbar";
import { Casino } from "@mui/icons-material";

type ConsultantList = components["schemas"]["AllConsultantsResponse"];
type Consultant = components["schemas"]["ConsultantResponse"];
type OfferPageBody = components["schemas"]["OfferPageBody"];

const emptyOffer: OfferPageBody = {
  customerId: 0,
  name: null,
  description: null,
  shortDescription: null,
  password: "",
  consultantPages: [],
};

export default function OfferCreationPage() {
  const { currentUser } = useAuth();
  const { showError, showSuccess } = useSnackbar();
  const [consultants, setConsultants] = useState<ConsultantList>([]);
  const [addedConsultants, setAddedConsultants] = useState<ConsultantList>([]);
  const [offer, setOffer] = useState<OfferPageBody>(emptyOffer);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [generatedLink, setGeneratedLink] = useState<string>("");

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
    setOffer((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!currentUser || currentUser?.salespersonId === null) {
      showError("You are not authorized to create an offer.");
      return;
    }

    const newOffer: OfferPageBody = {
      ...offer,
      customerId: Number(offer.customerId),
      consultantPages: addedConsultants.map((c) => ({
        id: 0, // required in body,
        offerPageId: 0, // required in body
        consultantId: c.id,
        showInfo: true,
        isAccepted: false,
        customerReview: null,
      })),
    };

    try {
      const createdOffer = await createOffer(
        currentUser.salespersonId,
        newOffer
      );

      // get current url, example localhost:5173
      const siteUrl = window.location.host;
      setGeneratedLink(
        `${siteUrl}/customerlogin/${createdOffer.data.id}/${createdOffer.data.salespersonId}`
      );
      setDialogOpen(true);

      // reset form
      setOffer(emptyOffer);
      setAddedConsultants([]);
      showSuccess("Offer created succesfully!");
    } catch (error) {
      showError("Failed to create offer. Does customerID exist?");
      console.log(error);
    }
  }

  const generatePassword = () => {
    const glyphs =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!\"'#¤%&/()=?";

    let randomPassword = "";
    for (let i = 0; i < 8; i++) {
      randomPassword += glyphs[Math.floor(Math.random() * glyphs.length)];
    }

    setOffer((prev) => ({
      ...prev,
      password: randomPassword,
    }));
  };

  const offerDetailsForm = (
    <Stack gap={3} component={"form"} onSubmit={(e) => void handleSubmit(e)}>
      <Stack direction={"row"} gap={3} justifyContent={"space-between"}>
        <TextField
          fullWidth
          size="small"
          type="text"
          label="Offer name"
          name="name"
          required
          value={offer.name || ""}
          onChange={handleChange}
        />

        <TextField
          fullWidth
          size="small"
          type="text"
          label="Offer short description"
          name="shortDescription"
          required
          value={offer.shortDescription || ""}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          size="small"
          type="text"
          label="Offer password"
          name="password"
          required
          value={offer.password}
          onChange={handleChange}
          slotProps={{
            htmlInput: { minLength: 8 },
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end" onClick={generatePassword}>
                    <Casino />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
        <TextField
          fullWidth
          size="small"
          type="number"
          label="Recipents Customer ID"
          name="customerId"
          required
          value={offer.customerId}
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
            label="Offer description"
            name="description"
            multiline
            sx={{
              height: "100%",
              "& .MuiInputBase-root": { height: "100%", alignItems: "stretch" },
              "& textarea": { height: "100% !important" },
            }}
            value={offer.description || ""}
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
              <ListItem
                key={c.id}
                secondaryAction={
                  <Checkbox
                    edge="end"
                    checked={true}
                    onChange={() => handleRemoveConsultant(c.id)}
                  />
                }
                disablePadding
              >
                <ListItemButton>
                  <ListItemAvatar>
                    <Avatar
                      alt={`${c.user.name} picture`}
                      src={c.profilePictureUrl}
                    />
                  </ListItemAvatar>
                  <ListItemText primary={c.user.name} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Stack>
      </Stack>
      <Box display={"flex"} justifyContent={"flex-end"}>
        <Button type="submit" size="small">
          Create offer
        </Button>
      </Box>
    </Stack>
  );

  const offerLinkDialog = (
    <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
      <DialogContent>
        <Stack spacing={2} alignItems={"center"}>
          <Typography variant="h6">Link for generated offer:</Typography>
          <Typography>{generatedLink}</Typography>
        </Stack>
      </DialogContent>
    </Dialog>
  );

  return (
    <>
      {offerLinkDialog}
      <Container>
        <Stack gap={3}>
          <Box>
            <Typography variant="h5" gutterBottom>
              Create offer
            </Typography>
            {offerDetailsForm}
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
