import { Box, Container, Stack, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../app/hooks/useAuth";
import { getSections } from "../api/consultants.api";
import { useEffect, useState } from "react";
import { useConsultantDetails } from "../hooks/useConsultantDetails";
import ProfileHeader from "../components/ProfileHeader/ProfileHeader";
import type { components } from "@api-types/openapi";
import ConsultantSectionCard from "../components/ConsultantSectionCard";

type SectionList = components["schemas"]["GetPageSectionsResponse"];

export default function ConsultantCommentsPage() {
  const [sections, setSections] = useState<SectionList>([]);
  const { currentUser, isLoading: authLoading } = useAuth();

  const { id } = useParams();
  const consultantIdParam = Number(id) || undefined;

  const targetConsultantId = consultantIdParam || currentUser?.consultantId;
  const { consultant, attributes } = useConsultantDetails(
    targetConsultantId || 0
  );

  // consultant should be allowed to view only their own profile comments
  // sales and admin can view everyones comments.
  const isOwnProfile = targetConsultantId === currentUser?.consultantId;
  const isAuthorized =
    isOwnProfile ||
    currentUser?.roles.some((r) => r === "SALESPERSON" || r === "ADMIN");

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthorized) return;

    async function fetchPageSections() {
      if (!targetConsultantId) return;
      try {
        const response = await getSections(targetConsultantId);
        setSections(response.data);
      } catch (error) {
        console.log(error);
      }
    }

    void fetchPageSections();
  }, [targetConsultantId, authLoading, isAuthorized]);

  if (!isAuthorized)
    return (
      <Typography>
        You are not authorized to view this consultants comments.
      </Typography>
    );

  if (!consultant || !attributes)
    return <Typography>Consultant not found.</Typography>;

  const mappedSections = sections.map(
    (s) =>
      s.comments.length > 0 && (
        <ConsultantSectionCard
          key={s.id}
          section={s}
          replyAllowed={isOwnProfile}
        />
      )
  );

  return (
    <Container
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
    >
      <ProfileHeader data={consultant} attributes={attributes} isCommentView />
      <Box>
        <Stack>
          <Typography variant="h5" gutterBottom>
            Comments
          </Typography>
        </Stack>
        <Stack spacing={2}>{mappedSections}</Stack>
      </Box>
    </Container>
  );
}
