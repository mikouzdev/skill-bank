import { Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";

interface Props {
  getText: (value: string) => void;
  loadConsultants: () => void;
}

export default function SearchBar({ getText, loadConsultants }: Props) {
  const [search, setSearch] = useState("");

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    setSearch(event.target.value);
    getText(event.target.value);
  }
  return (
    <Paper
      elevation={1}
      sx={{
        p: 2,
        mb: 2,
        display: "flex",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Stack direction={"row"} spacing={2} alignItems="center">
        <Typography variant="subtitle1">Search consultant</Typography>
        <TextField
          id="outlined-basic"
          label="Search"
          variant="outlined"
          size="small"
          value={search}
          onChange={handleChange}
        />
        <Button onClick={() => void loadConsultants()} size="small">
          Search
        </Button>
      </Stack>
    </Paper>
  );
}
