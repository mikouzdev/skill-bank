import { Router, type Request, type Response } from "express";
import fileUpload from "express-fileupload";
import { LocalStorageService } from "../storage/localStorage.js";
import { GetConsultantSchema } from "../schemas/consultants.schema.js";

export const consultantsRouter = Router();

consultantsRouter.put(
  "/me",
  fileUpload(),
  async (req: Request, res: Response) => {
    const profilepicture = req.files?.profilepicture;

    // Try to add profile picture to local storage
    if (profilepicture !== undefined && !Array.isArray(profilepicture)) {
      const storageService = new LocalStorageService();

      try {
        await storageService.save(profilepicture.name, profilepicture.data);
      } catch (err) {
        if (err instanceof Error) {
          res.status(500).send({ error: err });
        }
      }
    }

    res.send();
  }
);

consultantsRouter.get("/:consultantId", (req: Request, res: Response) => {
  const parsedParams = GetConsultantSchema.safeParse(req.params);
  if (!parsedParams.success) {
    res.status(400).send({ error: "Invalid inputs" });
    return;
  }

  const id = parsedParams.data.consultantId;

  const profilePictureUrl = `/static/${id}_profile_picture.jpg`;

  res.send({ id, profilePictureUrl });
});
