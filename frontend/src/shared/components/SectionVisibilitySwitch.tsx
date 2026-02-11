import type { components } from "@api-types/openapi";
import { FormControlLabel, Switch } from "@mui/material";
import { useState } from "react";
import { updateSection } from "../../features/consultant/api/consultants.api";

type SectionBody = components["schemas"]["PageSectionBodyPartial"];
type SectionVisibility = SectionBody["visibility"];

interface Props {
  sectionData: SectionBody;
}

export default function SectionVisibilitySwitch({ sectionData }: Props) {
  const [section, setSection] = useState<SectionBody>(sectionData);
  const [loading, setLoading] = useState<boolean>(false);

  async function changeSectionVisibilityChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    if (loading) return;

    const newVisibility: SectionVisibility = e.target.checked
      ? "PUBLIC"
      : "LIMITED";

    const prevVisibility = section.visibility;

    setSection((s) => ({ ...s, visibility: newVisibility }));

    try {
      setLoading(true);

      // artificial delay :)
      await new Promise((res) => setTimeout(res, 125));

      await updateSection({ ...section, visibility: newVisibility });
    } catch (error) {
      console.error("failed to update section:", section.name, error);
      // undo switch if failed
      setSection((s) => ({ ...s, visibility: prevVisibility }));
    } finally {
      setLoading(false);
    }
  }

  return (
    <FormControlLabel
      control={
        <Switch
          checked={section.visibility === "PUBLIC"}
          onChange={(e) => {
            void changeSectionVisibilityChange(e);
          }}
          disabled={loading}
        />
      }
      label="Visible to other consultants"
    />
  );
}
