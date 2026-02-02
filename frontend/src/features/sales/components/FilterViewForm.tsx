import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";

import { SkillSearchBuilder } from "./SkillSearchBuilder";
import type { SkillFilterRule } from "./SkillSearchBuilder";
import { SkillRuleItem } from "./SkillRuleItem";
import { KeywordRuleItem } from "./KeywordRuleItem";

import { KeywordSearchBuilder } from "./KeywordSearchBuilder";

export const FilterViewForm = () => {
  const [open, setOpen] = useState(false);
  const [skillRules, setSkillRules] = useState<SkillFilterRule[]>([]);
  const [keywords, setKeywords] = useState<string[]>([]);

  const handleAddSkillRule = (rule: Omit<SkillFilterRule, "id">) => {
    setSkillRules((prev) => [...prev, { ...rule, id: crypto.randomUUID() }]);
  };

  const handleAddKeyword = (keyword: string) => {
    setKeywords((prev) => {
      const k = keyword.trim();
      if (!k) {
        return prev;
      }

      return [...prev, k];
    });
  };

  const handleDeleteKeyword = (keyword: string) => {
    setKeywords((prev) => prev.filter((k) => k !== keyword));
  };

  const handleSubmit = () => {
    const payload = {
      filter_skills: skillRules,
      keywords: keywords,
    };

    console.log("submit payload:", payload);
    setOpen(false);
  };

  return (
    <>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Filter
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Filters</DialogTitle>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            //console.log("submit payload:", skillRules, keywords);  //For debugging
            handleSubmit();
            setOpen(false);
          }}
        >
          <DialogContent>
            <Stack direction="column" spacing={2} sx={{ mt: 1 }}>
              <KeywordSearchBuilder
                keywords={keywords}
                onAdd={handleAddKeyword}
                onDelete={handleDeleteKeyword}
              />
              <SkillSearchBuilder onAddRule={handleAddSkillRule} />
            </Stack>

            <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
              Active filters
            </Typography>

            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {keywords.map((k) => (
                <KeywordRuleItem
                  key={k}
                  keyword={k}
                  onDelete={handleDeleteKeyword}
                />
              ))}

              {skillRules.map((r) => (
                <Typography key={r.id} variant="subtitle1">
                  <SkillRuleItem
                    rule={r}
                    onDelete={(id) =>
                      setSkillRules((prev) =>
                        prev.filter((rule) => rule.id !== id)
                      )
                    }
                  />
                </Typography>
              ))}
            </Box>
          </DialogContent>

          <DialogActions sx={{ align: "center" }}>
            <Button
              type="submit"
              variant="contained"
              onClick={() => {
                console.log("Sending following request: ");
                handleSubmit();
                setOpen(false);
              }}
            >
              {" "}
              Apply filters
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};
