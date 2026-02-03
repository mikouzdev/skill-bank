import type { components } from "@api-types/openapi";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { useState } from "react";

type PostSkillTagBody = components["schemas"]["PostSkillTagBody"];

interface Props {
  onCreate: (payload: PostSkillTagBody) => Promise<boolean>;
}

export default function SkillCreationDialog({ onCreate }: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [form, setForm] = useState<PostSkillTagBody>({
    name: "",
    categoryId: null,
  });

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, name: e.target.value }));
  }

  // function handleCategoryChange(e: React.ChangeEvent<HTMLSelectElement>) {
  //     setForm((prev) => ({ ...prev, categoryId: e.target.value }));
  //   }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    // just to see the loading icon :)
    await new Promise((res) => setTimeout(res, 200));

    const success = await onCreate(form);
    setLoading(false);
    if (success) {
      setForm({ name: "", categoryId: null });
      setIsOpen(false);
    }
  }

  return (
    <>
      <Button size="small" onClick={() => setIsOpen(true)}>
        Add skill
      </Button>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <DialogTitle>Add new skill</DialogTitle>
        <DialogContent>
          <Stack
            direction={"column"}
            spacing={2}
            p={1}
            component={"form"}
            onSubmit={(e) => void handleSubmit(e)}
          >
            <TextField
              type="text"
              label="Skill name"
              value={form.name}
              onChange={handleNameChange}
            />
            {/* todo: categories */}
            <FormControl fullWidth>
              <InputLabel id="category-select-label">Category WIP</InputLabel>
              <Select labelId="category-select-label" label="Category WIP">
                <MenuItem>cat 1</MenuItem>
                <MenuItem>cat 2</MenuItem>
              </Select>
            </FormControl>
            <Box textAlign={"center"}>
              <Button type="submit" loading={loading}>
                Add
              </Button>
            </Box>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
}
