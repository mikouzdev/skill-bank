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
import { useAuth } from "../../../../app/hooks/useAuth";
import { useSnackbar } from "../../../../shared/components/useSnackbar";
import { useOffers } from "../../../../shared/hooks/useOffers";
import { useNavigate, useParams } from "react-router-dom";
import { updateOffer } from "../../../../shared/api/offers.api";

type ConsultantList = components["schemas"]["AllConsultantsResponse"];
type OfferPageBodyPartial = components["schemas"]["OfferPageBodyPartial"];

// TODO: add ability to add/remove selected consultants
export default function OfferEditingPage() {
  const emptyOffer: OfferPageBodyPartial = {
    customerId: 0,
    name: null,
    description: null,
    shortDescription: null,
    consultantPages: [],
  };

  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const {
    offers,
    loading: offersLoading,
    error,
  } = useOffers(currentUser?.salespersonId ?? null);

  const { id } = useParams();
  const offerId = Number(id);
  const currentOffer = offers?.find((o) => o.id === offerId);

  const { showError, showSuccess } = useSnackbar();
  const [consultants, setConsultants] = useState<ConsultantList>([]);
  const [addedConsultants, setAddedConsultants] = useState<ConsultantList>([]);
  const [offer, setOffer] = useState<OfferPageBodyPartial>(emptyOffer);

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

  useEffect(() => {
    function setOfferToCurrent() {
      if (!currentOffer || !consultants) return;

      setOffer({
        customerId: currentOffer?.customerId,
        description: currentOffer?.description,
        name: currentOffer?.name,
        shortDescription: currentOffer?.description,
        consultantPages: currentOffer?.consultantPages || [],
      });

      const selectedConsultants = consultants.filter((c) =>
        currentOffer.consultantPages.some((page) => page.consultantId === c.id)
      );
      setAddedConsultants(selectedConsultants);
    }

    setOfferToCurrent();
  }, [consultants, currentOffer]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!currentUser || currentUser?.salespersonId === null) {
      showError("You are not authorized to create an offer.");
      return;
    }

    const updatedOffer: OfferPageBodyPartial = {
      name: offer.name,
      description: offer.description,
      shortDescription: offer.shortDescription,
      customerId: Number(offer.customerId),
      consultantPages: [],
      password: offer.password,
      // comment left for possible future use, if wanted to add / remove consultants from a existing offer
      //   consultantPages: addedConsultants.map((c) => ({
      //     consultantId: c.id,
      //   })),
    };

    try {
      if (currentOffer === undefined) return;
      await updateOffer(
        currentUser.salespersonId,
        currentOffer.id,
        updatedOffer
      );
      showSuccess("Offer updated succesfully!");
      await navigate(-1);
    } catch (error) {
      showError("Failed to update offer.");
      console.log(error);
    }
  }

  // comment left for possible future use, if wanted to add / remove consultants from a existing offer
  //   function handleSelectConsultant(consultant: Consultant) {
  //     if (addedConsultants.some((c) => c.id === consultant.id)) return;
  //     setAddedConsultants((prev) => [...prev, consultant]);
  //   }

  function handleRemoveConsultant(id: number) {
    setAddedConsultants((prev) => prev.filter((c) => c.id !== id));
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setOffer((prev) => ({ ...prev, [name]: value }));
  }

  if (offersLoading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error fetching offers</Typography>;
  if (currentOffer === undefined)
    return <Typography>Offer not found</Typography>;

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
          value={offer.password}
          onChange={handleChange}
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
                    disabled
                  />
                }
                disablePadding
              >
                <ListItemButton disabled>
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
          Update offer
        </Button>
      </Box>
    </Stack>
  );

  return (
    <Container>
      <Stack gap={3}>
        <Box>
          <Typography variant="h5" gutterBottom>
            Edit offer
          </Typography>
          {offerDetailsForm}
        </Box>

        <Divider />

        {/* comment left for possible future use, if wanted to add / remove consultants from a existing offer */}
        {/* <Box>
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
        </Box> */}
      </Stack>
    </Container>
  );
}
