import { Button, Container, Stack, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../../app/hooks/useAuth";
import { useOffers } from "../../../../shared/hooks/useOffers";
import { ConsultantCard } from "../../components/ConsultantCard";
import { deleteOffer } from "../../../../shared/api/offers.api";
import { useSnackbar } from "../../../../shared/components/useSnackbar";
import { useState } from "react";

export default function SalesSingleOfferPage() {
  const navigate = useNavigate();
  const { showError, showSuccess } = useSnackbar();

  const { id } = useParams();
  const { currentUser } = useAuth();
  const { offers } = useOffers(currentUser?.salespersonId ?? null);

  const [loading, setLoading] = useState<boolean>(false);

  async function handleDeleteOffer() {
    if (!currentUser?.salespersonId || !offer?.id) return;
    try {
      setLoading(true);
      await deleteOffer(currentUser.salespersonId, offer?.id);
      await navigate(-1);
      showSuccess("Offer deleted succesfully.");
    } catch (error) {
      console.log(error);
      showError("Failed to delete offer.");
    } finally {
      setLoading(false);
    }
  }

  if (currentUser?.salespersonId === null) return null;

  const offer = offers?.find((o) => o.id === Number(id));
  if (offer === undefined) return <Typography>Offer not found.</Typography>;

  const deleteButton = (
    <Button
      size="small"
      loading={loading}
      onClick={() => void handleDeleteOffer()}
    >
      Delete offer
    </Button>
  );

  const editButton = (
    <Button size="small" loading={loading}>
      Edit offer (WIP)
    </Button>
  );

  const mappedConsultantPages = offer.consultantPages.map((c) => (
    <ConsultantCard key={c.id} consultantID={c.consultantId} />
  ));

  return (
    <Container>
      <Stack gap={2}>
        <Stack direction={"row"} gap={1} justifyContent={"flex-end"}>
          {/* todo: abilities to edit offer */}
          {editButton}
          {deleteButton}
        </Stack>
        <Stack textAlign={"center"}>
          <Typography variant="h5" gutterBottom>
            {offer.name ?? `Offer ${offer.id}`}
          </Typography>
          <Typography>{offer.description}</Typography>
        </Stack>
        <Stack gap={2}>{mappedConsultantPages}</Stack>
      </Stack>
    </Container>
  );
}
