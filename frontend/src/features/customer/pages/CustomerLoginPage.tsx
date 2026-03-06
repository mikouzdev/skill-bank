import { ThemeProvider } from "@emotion/react";
import { CenterFloatingForm } from "../../../styles/formsTheme";
import { CustomerLoginPageForm } from "../components/CustomerLoginPageForm";
import { formsTheme } from "../../../styles/theme";
import { Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../app/hooks/useAuth";
import { useEffect, useState } from "react";
import type { components } from "@api-types/openapi";

type OfferPage = components["schemas"]["OfferPage"];

export default function CustomerLoginPage() {
  const navigate = useNavigate();

  const offerFromStorage = () => {
    const stored = sessionStorage.getItem("customerOffer");
    if (!stored) return;
    return stored ? (JSON.parse(stored) as OfferPage) : undefined;
  };

  const [offer, setOffer] = useState<OfferPage | undefined>(offerFromStorage);

  const { offerLogin } = useAuth();
  const { sID, oID } = useParams();
  const salesID = Number(sID) || undefined;
  const offerID = Number(oID) || undefined;

  useEffect(() => {
    if (offer) {
      void navigate("/customerOffer", { replace: true });
    }
  }, [offer, navigate]);

  async function handleCustomerLogin(password: string) {
    try {
      if (salesID === undefined || offerID === undefined) return;
      const response = await offerLogin(salesID, offerID, { password });
      setOffer(response);

      sessionStorage.setItem("customerOffer", JSON.stringify(response));
    } catch (error) {
      console.log(error);
    }
  }

  if (offerID === undefined || salesID === undefined)
    return <Typography>Missing offer parameters in URL</Typography>;

  return (
    <ThemeProvider theme={formsTheme}>
      <CenterFloatingForm>
        <CustomerLoginPageForm onSubmit={handleCustomerLogin} />
      </CenterFloatingForm>
    </ThemeProvider>
  );
}
