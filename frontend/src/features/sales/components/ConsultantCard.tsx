import { Avatar, Box, Stack, Typography, Button, Paper } from "@mui/material";
import { useConsultantDetails } from "../../consultant/hooks/useConsultantDetails";
import SkillsBuilder from "./SkillsBuilder";
import type { components } from "@api-types/openapi";
import { useNavigate, type To } from "react-router-dom";

type Consultant = components["schemas"]["ConsultantResponse"];

type Props = {
  consultantID: number;
  selectable?: boolean;
  salesNote?: string;
  onSelect?: (consultant: Consultant) => void;
  offer?: OfferInfo;
};

type OfferInfo = {
  id: number;
  salesId: number;
  consultantPageId: number;
  isAccepted: boolean;
};

export const ConsultantCard = ({
  consultantID,
  selectable,
  salesNote,
  onSelect,
  offer,
}: Props) => {
  const { consultant, skills, employments, projects, loading } =
    useConsultantDetails(consultantID);

  const navigate = useNavigate();

  // add search params to url if offerId and salesId is provided. For customer.
  const queryLink: To = {
    pathname: `/consultant/${consultantID}`,
    search:
      offer?.id && offer.salesId
        ? `?${new URLSearchParams({
            salesId: String(offer.salesId),
            offerId: String(offer.id),
            consultantPageId: String(offer.consultantPageId),
            isAccepted: String(offer.isAccepted),
          }).toString()}`
        : "",
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (!employments || !consultant || !projects || !skills)
    return <Typography>Error while fetching data.</Typography>;

  return (
    <>
      <Paper sx={{ p: 1 }}>
        <Stack direction="column" spacing={2}>
          <Stack direction="row" gap={4}>
            {/* picture, name, title */}
            <Stack direction={"row"} gap={2} alignItems={"center"}>
              <Avatar
                alt={consultant.user.name}
                src={consultant.profilePictureUrl}
              />
              <Stack direction={"column"}>
                <Typography>{consultant.user.name}</Typography>
                <Typography variant="body2">{consultant.roleTitle}</Typography>
              </Stack>
            </Stack>

            {/* professional exp */}
            <Stack direction={"column"} justifyContent={"center"}>
              <Typography>Professional Expereience</Typography>
              <Typography variant="body2">5+ years</Typography>
            </Stack>
            <SkillsBuilder data={skills} />
          </Stack>

          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            {/* used for sales offer creation to add consultant to new offer */}
            <Stack direction={"row"} gap={1} alignItems={"center"}>
              {salesNote && (
                <Typography variant="body2">Note: {salesNote}</Typography>
              )}

              {selectable && (
                <Button size="small" onClick={() => onSelect?.(consultant)}>
                  Select
                </Button>
              )}

              <Button
                size="small"
                type="submit"
                onClick={() => void navigate(queryLink)}
              >
                View profile
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Paper>
    </>
  );
};
