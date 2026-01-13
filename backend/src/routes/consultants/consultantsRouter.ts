import { Router, type Request, type Response } from "express";
import { LocalStorageService } from "../../storage/localStorage.js";
import {
  ConsultantIdParamsSchema,
  UpdateConsultantSchema,
} from "../../schemas/consultants/consultants.schema.js";
import { prisma } from "../../db/prismaClient.js";
import { fileTypeFromBuffer } from "file-type";
import { uploadFile } from "../../middlewares/file.js";

// TODO: Check all env variables in a single place
const PROFILE_PICTURE_PREFIX =
  process.env.PROFILE_PICTURE_PREFIX ??
  (() => {
    throw new Error("Env missing: PROFILE_PICTURE_PREFIX");
  })();

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

consultantsRouter.get("/:consultantId", async (req: Request, res: Response) => {
  const parsedParams = ConsultantIdParamsSchema.safeParse(req.params);
  if (!parsedParams.success) {
    res.status(400).json(parsedParams.error);
    return;
  }
  const consultantId = parsedParams.data.consultantId;

  let consultant = null;
  try {
    consultant = await prisma.consultant.findFirst({
      where: { id: consultantId },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });
  } catch (err) {
    res.status(500).json(err);
    return;
  }

  if (consultant === null) {
    res.status(404).json({ message: "Not found" });
    return;
  }
  res.json(consultant);
});

//Endpoint for if personal info of consultant is private or not
consultantsRouter.get("/:consultantId/info", async (req: Request, res: Response) => {
  const parsedParams = ConsultantIdParamsSchema.safeParse(req.params);
  if (!parsedParams.success) {
    res.status(400).json(parsedParams.error);
    return;
  }
  const consultantId = parsedParams.data.consultantId;

  let consultantAttributes = null;
  try {
    consultantAttributes = await prisma.consultantAttribute.findFirst({
      where: { consultantId: consultantId }
    });
  } catch (err) {
    res.status(500).json(err);
    return;
  }

  if (consultantAttributes === null) {
    res.status(404).json({ message: "Not found" });
    return;
  }
  else if (consultantAttributes.visibility == "LIMITED" ) {
    res.send("Profile visibility is limited");
  }
  else {
    res.send("Profile visibility is not limited");
  }
});

consultantsRouter.put(
  "/me",
  uploadFile("profilePicture"),
  async (req: Request, res: Response) => {
    const parsedBody = UpdateConsultantSchema.safeParse(req.body);
    if (!parsedBody.success) {
      res.status(400).json(parsedBody.error);
      return;
    }
    const { description, roleTitle, user } = parsedBody.data;
    const profilePicture = req.file;
    let profilePictureUrl;

    // TODO: use consultantId from a JWT token instead of getting the first
    //       entry from the database
    let consultantId;
    try {
      const consultant = await prisma.consultant.findFirst();
      if (consultant === null) {
        res.status(404).json({ message: "No mock data found" });
        return;
      }
      consultantId = consultant.id;
    } catch (err) {
      res.status(500).json(err);
      return;
    }

    if (profilePicture !== undefined) {
      let imageType;
      try {
        imageType = await fileTypeFromBuffer(profilePicture.buffer);
      } catch (err) {
        res.status(400).json(err);
        return;
      }

      if (imageType === undefined) {
        return res.status(400).json({ message: "Unknown file type" });
      }

      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(imageType.mime)) {
        return res.status(400).json({ message: "Unsupported image type" });
      }

      // Get the URL of the previous image
      let consultant = null;
      try {
        consultant = await prisma.consultant.findFirst({
          where: { id: consultantId },
        });
      } catch (err) {
        res.status(500).json(err);
        return;
      }
      if (consultant === null) {
        res.status(404).json({ message: "Consultant id not found" });
        return;
      }

      // Delete the previous image
      const storageService = new LocalStorageService();
      const previousFilename = new URL(consultant.profilePictureUrl).pathname
        .split("/")
        .pop();

      if (previousFilename !== undefined) {
        try {
          await storageService.delete(previousFilename);
        } catch (err) {
          res.status(500).json(err);
          return;
        }
      }

      // Add a new picture
      const profilePictureFileName = `${consultantId}_pp${new Date().getTime()}.${
        imageType.ext
      }`;
      profilePictureUrl = `${PROFILE_PICTURE_PREFIX}/${profilePictureFileName}`;

      try {
        await storageService.save(
          profilePictureFileName,
          profilePicture.buffer
        );
      } catch (err) {
        res.status(500).json(err);
        return;
      }
    }

    try {
      await prisma.consultant.update({
        where: { id: consultantId },
        data: {
          ...(description !== undefined ? { description } : {}),
          ...(roleTitle !== undefined ? { roleTitle } : {}),
          ...(profilePictureUrl !== undefined ? { profilePictureUrl } : {}),
          user: {
            update: {
              ...(user?.name !== undefined ? { name: user.name } : {}),
            },
          },
        },
      });
    } catch (err) {
      res.status(500).json(err);
      return;
    }

    res.status(204).json();
  }
);
