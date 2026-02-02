import { Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";

type Props = {
  keywords: string[];
  onAdd: (keyword: string) => void;
  onDelete: (keyword: string) => void;
};

export const KeywordSearchBuilder = ({ onAdd }: Props) => {
  const [term, setTerm] = useState("");

  const handleAdd = () => {
    const trimmed = term.trim();
    if (!trimmed) return;

    onAdd(trimmed);
    setTerm("");
  };

  return (
    <>
      <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
        Filter by keywords
      </Typography>

      <Box display="flex" gap={2} alignItems="center">
        <TextField
          label="Keyword"
          fullWidth
          value={term}
          onChange={(e) => setTerm(e.target.value)}
        />
        <Button variant="contained" onClick={handleAdd} disabled={!term.trim()}>
          Add
        </Button>
      </Box>
    </>
  );
};
