import { Router, type Request, type Response } from "express";
import fileUpload from "express-fileupload";
import z from "zod";
import { LocalStorageService } from "../storage/localStorage.js";

export const consultantsRouter = Router();

consultantsRouter.put(
  "/me",
  fileUpload(),
  async (req: Request, res: Response) => {
    const profilepicture = req.files?.profilepicture;
    if (profilepicture === undefined || Array.isArray(profilepicture)) {
      res.status(400).send({ error: "Invalid inputs" });
      return;
    }

    const storageService = new LocalStorageService();

    try {
      await storageService.save(profilepicture.name, profilepicture.data);
    } catch (err) {
      if (err instanceof Error) {
        res.status(500).send({ error: err });
      }
    }

    res.send();
  }
);

consultantsRouter.get("/:consultantId", (req: Request, res: Response) => {
  const ParamsSchema = z.object({
    consultantId: z.number(),
  });

  const parsedParams = ParamsSchema.safeParse(req.params);
  if (!parsedParams.success) {
    res.status(400).send({ error: "Invalid inputs" });
    return;
  }

  const id = parsedParams.data.consultantId;

  // Temporary profile picture
  const profilePictureUrl =
    "https://gitlab.com/uploads/-/system/user/avatar/30356562/avatar.png";

  res.send({ id, profilePictureUrl });
});
