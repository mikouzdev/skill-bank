import type { components } from "@api-types/openapi";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import { useState } from "react";

type SkillCategoryBody = components["schemas"]["skillCategoryBody"];

interface Props {
  onCreate: (payload: SkillCategoryBody) => Promise<boolean>;
}

export default function CategoryCreationDialog({ onCreate }: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [form, setForm] = useState<SkillCategoryBody>({
    name: "",
    skillTags: [],
  });

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, name: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    // just to see the loading icon :)
    await new Promise((res) => setTimeout(res, 200));

    const newCategory: SkillCategoryBody = {
      name: form.name.trim(),
      skillTags: form.skillTags,
    };

    const success = await onCreate(newCategory);
    setLoading(false);
    if (success) {
      setForm({ name: "", skillTags: [] });
      setIsOpen(false);
    }
  }

  return (
    <>
      <Button size="small" onClick={() => setIsOpen(true)}>
        Add category
      </Button>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <DialogTitle>Add new category</DialogTitle>
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
              label="Category name"
              value={form.name}
              onChange={handleNameChange}
            />

            <Stack direction={"row"} gap={3} justifyContent={"center"}>
              <Button
                color="secondary"
                size="small"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" size="small" loading={loading}>
                Add
              </Button>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
}
