import { Router, type Response } from "express";
import { ConsultantIdParamsSchema } from "../../schemas/consultants/consultants.schema.js";
import {
  ConsultantIdSectionNameParamsSchema,
  SectionNameParamsSchema,
  PageSectionBodyPartialSchema,
  CommentBodySchema,
} from "../../schemas/consultants/pageSections.schema.js";
import { Visibility } from "../../generated/prisma/enums.js";
import { prisma } from "../../db/prismaClient.js";
import {
  authenticate,
  type AuthenticatedRequest,
} from "../../middlewares/authentication.js";

export const pageSectionsRouter = Router();

/**
 * Get a consultant's page sections
 * @route GET /consultants/{consultantId}/sections
 * @returns [sections]
 */
pageSectionsRouter.get(
  "/:consultantId/sections",
  authenticate,
  async (req: AuthenticatedRequest, res: Response) => {
    const parsedParams = ConsultantIdParamsSchema.safeParse(req.params);
    if (!parsedParams.success) {
      res.status(400).json(parsedParams.error);
      return;
    }
    const { consultantId } = parsedParams.data;
    const roles = req.user?.roles ?? [];
    let isSameConsultant = false;
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        roles: { select: { role: true } },
        consultant: { select: { id: true } },
      },
    });
    const consultantIdOfCurrentUser = user?.consultant?.id;
    if (consultantIdOfCurrentUser !== undefined && consultantIdOfCurrentUser !== null && consultantIdOfCurrentUser === consultantId) {
      isSameConsultant = true;
    }
    let allowedVisibilities = [Visibility.PUBLIC, Visibility.LIMITED];
    //Sales/admin can see everyone, consult gets only public UNLESS the consultant ID is same as current user's consultant ID
    if (!roles?.includes("ADMIN") && !roles?.includes("SALESPERSON") && isSameConsultant === false) {
      allowedVisibilities = [Visibility.PUBLIC];
    }
    let sections = null;
    try {
      sections = await prisma.pageSection.findMany({
        where: {
          consultantId,
          visibility: {
            in: allowedVisibilities,
          },
        },
        include: {
          comments: true,
        },
      });
    } catch (err) {
      res.status(500).json(err);
      return;
    }

    res.json(sections);
  }
);
/**
 * Get a consultant's page section by name
 * @route GET /consultants/{consultantId}/sections/{sectionName}
 * @returns page section
 */
pageSectionsRouter.get(
  "/:consultantId/sections/:sectionName",
  authenticate,
  async (req: AuthenticatedRequest, res: Response) => {
    const parsedParams = ConsultantIdSectionNameParamsSchema.safeParse(
      req.params
    );
    if (!parsedParams.success) {
      res.status(400).json(parsedParams.error);
      return;
    }
    const { consultantId, sectionName } = parsedParams.data;
    const roles = req.user?.roles ?? [];
    let isSameConsultant = false;
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        roles: { select: { role: true } },
        consultant: { select: { id: true } },
      },
    });
    const consultantIdOfCurrentUser = user?.consultant?.id;
    if (consultantIdOfCurrentUser !== undefined && consultantIdOfCurrentUser !== null && consultantIdOfCurrentUser === consultantId) {
      isSameConsultant = true;
    }
    if (!roles?.includes("ADMIN") && !roles?.includes("SALESPERSON") && isSameConsultant === false) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    let pageSection = null;
    try {
      pageSection = await prisma.pageSection.findFirst({
        where: {
          name: sectionName,
          consultantId: consultantId,
        },
        include: {
          comments: {},
        },
      });
    } catch (err) {
      res.status(500).json(err);
      return;
    }

    if (pageSection === null) {
      res.status(404).json({ message: "Not found" });
      return;
    }
    res.json(pageSection);
  }
);
/**
 * Update a page section
 * @route PUT /consultants/me/sections/{sectionName}
 * @returns updated page section
 */
pageSectionsRouter.put(
  "/me/sections/:sectionName",
  authenticate,
  async (req: AuthenticatedRequest, res: Response) => {
    const parsedParams = SectionNameParamsSchema.safeParse(req.params);
    if (!parsedParams.success) {
      res.status(400).json(parsedParams.error);
      return;
    }
    const { sectionName } = parsedParams.data;

    const parsedBody = PageSectionBodyPartialSchema.safeParse(req.body);
    if (!parsedBody.success) {
      res.status(400).json(parsedBody.error);
      return;
    }
    const { name, visibility } = parsedBody.data;

    let pageSection = null;
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        roles: { select: { role: true } },
        consultant: { select: { id: true } },
      },
    });
    if (user === null) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const consultantId = user?.consultant?.id;
    try {
      if (consultantId !== undefined && consultantId !== null) {
        const consultant = await prisma.consultant.findUnique({
          where: { id: consultantId },
        });
        if (consultant === null) {
          res.status(404).json({ message: "Consultant not found" });
          return;
        }
        pageSection = await prisma.pageSection.update({
          where: {
            consultantId_name: {
              consultantId,
              name: sectionName,
            },
          },
          data: {
            ...(name !== undefined ? { name } : {}),
            ...(visibility !== undefined ? { visibility } : {}),
          },
        });
      }
    } catch (err) {
      res.status(500).json(err);
      return;
    }

    res.json(pageSection);
  }
);
/**
 * Post a comment on consultant page section
 * @route POST /consultants/{consultantId}/sections/{sectionName}/comments
 * @returns comment
 */
pageSectionsRouter.post(
  "/:consultantId/sections/:sectionName/comments",
  authenticate,
  async (req: AuthenticatedRequest, res: Response) => {
    const parsedParams = ConsultantIdSectionNameParamsSchema.safeParse(
      req.params
    );
    if (!parsedParams.success) {
      res.status(400).json(parsedParams.error);
      return;
    }
    const { consultantId, sectionName } = parsedParams.data;

    const parsedBody = CommentBodySchema.safeParse(req.body);
    if (!parsedBody.success) {
      res.status(400).json(parsedBody.error);
      return;
    }
    const { replyToId, content } = parsedBody.data;

    let comment = null;
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        roles: { select: { role: true } },
        consultant: { select: { id: true } },
      },
    });
    if (user === null) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    //Unsure what should be user's "primary" role, so for now just use first role in list
    const userRole = user.roles[0]?.role;
    if (userRole === undefined) {
      res.status(404).json({ message: "User role invalid" });
      return;
    }
    const pageSection = await prisma.pageSection.findUnique({
      where: {
        consultantId_name: {
          consultantId,
          name: sectionName,
        },
      }
    });
    if (pageSection === null) {
      res.status(404).json({ message: "Page section not found" });
      return;
    }
    try {
      if (consultantId !== undefined && consultantId !== null) {
        const consultant = await prisma.consultant.findUnique({
          where: { id: consultantId },
        });
        if (consultant === null) {
          res.status(404).json({ message: "Consultant not found" });
          return;
        }
        comment = await prisma.comment.create({
          data: {
            pageSectionId: pageSection?.id,
            userId: user.id,
            userRole: userRole,
            ...(replyToId !== undefined ? { replyToId: replyToId } : {}),
            content: content,
          },
        });
      }
    } catch (err) {
      res.status(500).json(err);
      return;
    }

    res.status(201).json(comment);
});