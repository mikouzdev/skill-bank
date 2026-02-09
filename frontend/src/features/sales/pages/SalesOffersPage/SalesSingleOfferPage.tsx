import { Button, Container, Stack, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../../app/hooks/useAuth";
import { useOffers } from "../../../../shared/hooks/useOffers";
import { ConsultantCard } from "../../components/ConsultantCard";

export default function SalesSingleOfferPage() {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const { offers } = useOffers(currentUser?.salespersonId ?? null);

  if (currentUser?.salespersonId === null) return null;

  const offer = offers?.find((o) => o.id === Number(id));

  if (offer === undefined) return <Typography>Offer not found.</Typography>;

  return (
    <Container>
      <Stack gap={2}>
        <Stack direction={"row"} gap={1} justifyContent={"flex-end"}>
          {/* todo: abilities to edit and delete offer */}
          <Button size="small">Edit offer (wip)</Button>
          <Button size="small">Delete offer (wip)</Button>
        </Stack>
        <Stack textAlign={"center"}>
          <Typography variant="h5" gutterBottom>
            {offer.name ?? `Offer ${offer.id}`}
          </Typography>
          <Typography>{offer.description}</Typography>
        </Stack>

        <Stack gap={2}>
          {offer.consultantPages.map((c) => (
            <ConsultantCard key={c.id} consultantID={c.consultantId} />
          ))}
        </Stack>
      </Stack>
    </Container>
  );
}
