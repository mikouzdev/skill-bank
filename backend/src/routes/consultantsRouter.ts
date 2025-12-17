import { Router, type Request, type Response } from "express";
import fileUpload from "express-fileupload";
import { LocalStorageService } from "../storage/localStorage.js";
import { ConsultantIdParamsSchema } from "../schemas/consultants.schema.js";
import { prisma } from "../db/prismaClient.js";

export const consultantsRouter = Router();

consultantsRouter.get("/", async (req: Request, res: Response) => {
  try {
    const consultants = await prisma.consultant.findMany();
    res.send(consultants);
    return;
  } catch (err) {
    res.status(500).json(err);
    return;
  }
});

consultantsRouter.get("/:consultantId", (req: Request, res: Response) => {
  const parsedParams = ConsultantIdParamsSchema.safeParse(req.params);
  if (!parsedParams.success) {
    res.status(400).json(parsedParams.error);
    return;
  }

  const consultantId = parsedParams.data.consultantId;
  const profilePictureUrl = `/static/${consultantId}_profile_picture.jpg`;

  // TODO: change temporary values into real ones
  res.json({
    consultantId,
    userId: 1,
    description: "Mock Description",
    roleTitle: "Mock Developer",
    profilePictureUrl,
  });
});

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
        res.status(500).json(err);
        return;
      }
    }

    res.send();
  }
);
