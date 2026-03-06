import type { components } from "@api-types/openapi";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { setAccepted } from "../api/customer.api";
import { Button, ListItem } from "@mui/material";
import { Check } from "@mui/icons-material";
import { useSnackbar } from "../../../shared/components/useSnackbar";

type OfferPage = components["schemas"]["OfferPage"];

type Props = {
  roles: ("CONSULTANT" | "SALESPERSON" | "CUSTOMER" | "ADMIN")[]; //change this to a type?
};

export default function CustomerAcceptConsultant({ roles }: Props) {
  const { showSuccess, showError } = useSnackbar();

  const [searchParams, setSearchParams] = useSearchParams();
  const salesId = Number(searchParams.get("salesId"));
  const offerId = Number(searchParams.get("offerId"));
  const consultantPageId = Number(searchParams.get("consultantPageId"));
  const isAccepted = useMemo(
    () => searchParams.get("isAccepted") === "true",
    [searchParams]
  );

  // updates the isAccepted status of the consultant also in the sessionStorage to correctly display the button state.
  const updateStoredOfferAcceptedStatus = (accepted: boolean) => {
    const storedOffer = sessionStorage.getItem("customerOffer");

    if (!storedOffer) return;

    const offer = JSON.parse(storedOffer) as OfferPage;

    sessionStorage.setItem(
      "customerOffer",
      JSON.stringify({
        ...offer,
        consultantPages: offer.consultantPages.map((consultant) =>
          consultant.id === consultantPageId
            ? { ...consultant, isAccepted: accepted }
            : consultant
        ),
      })
    );
  };

  // validation that customer is viewing a consultant that exists in an offer.
  const isValidCustomer = () => {
    if (!roles.some((r) => r === "CUSTOMER")) return false;
    if (!consultantPageId) return false;
    if (!offerId) return false;
    if (!salesId) return false;

    // otherwise return true
    return true;
  };

  async function setConsultantAcceptStatus() {
    if (!isValidCustomer()) return;

    try {
      const response = await setAccepted(salesId, offerId, consultantPageId, {
        isAccepted: !isAccepted,
      });

      updateStoredOfferAcceptedStatus(response.data.isAccepted);

      setSearchParams(
        (prev) => {
          const nextParams = new URLSearchParams(prev);
          nextParams.set("isAccepted", String(response.data.isAccepted));
          return nextParams;
        },
        { replace: true } // added to not create a new browser history when accepting or unaccepting
      );

      showSuccess(
        response.data.isAccepted
          ? "Consultant accepted"
          : "Consultant unaccepted"
      );
    } catch (error) {
      console.log(error);
      showError("Failed to change accepted status.");
    }
  }

  // button for customer to accept consultant in an offer.
  return (
    isValidCustomer() && (
      <ListItem sx={{ display: "flex", justifyContent: "center" }}>
        <Button
          size="small"
          sx={{ px: 2 }}
          onClick={() => void setConsultantAcceptStatus()}
        >
          <Check sx={{ mr: 1 }} fontSize="small" />
          {isAccepted ? "Accepted" : "Accept"}
        </Button>
      </ListItem>
    )
  );
}
