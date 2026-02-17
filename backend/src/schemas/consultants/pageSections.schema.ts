import { z } from "zod";

export const PageSectionSchema = z
  .object({
    id: z.number().meta({ example: "1" }),
    consultantId: z.number().meta({ example: "1" }),
    name: z.enum(["GENERAL", "NETWORKING_LINKS", "DESCRIPTION", "SKILLS", "EMPLOYMENTS", "PROJECTS"]).meta({ example: "GENERAL" }),
    visibility: z.enum(["LIMITED", "PUBLIC"]).meta({ example: "PUBLIC" }),
  })
  .meta({ id: "PageSection" });

export const CommentSchema = z
  .object({
    id: z.number().meta({ example: "1" }),
    pageSectionId: z.number().meta({ example: "1" }),
    userId: z.number().meta({ example: "1" }),
    userRole: z.enum(["CONSULTANT", "SALESPERSON", "CUSTOMER", "ADMIN"]).meta({ example: "CONSULTANT" }),
    createdAt: z.date().meta({ example: "2025-12-19T14:01:24.308Z" }),
    updatedAt: z.date().meta({ example: "2025-12-19T14:01:24.308Z" }),
    listPosition: z.number().meta({ example: "1" }),
    replyToId: z.number().meta({ example: "1" }),
  })
  .meta({ id: "Comment" });

export const GetPageSectionsResponseSchema = z
  .array(
    PageSectionSchema.extend({
      comments: z.array(CommentSchema)
    })
  )
  .meta({ id: "GetPageSectionsResponse" });

export const ConsultantIdSectionNameParamsSchema = z.object({
  consultantId: z.coerce.number().meta({ example: "1" }),
  sectionName: z.enum(["GENERAL", "NETWORKING_LINKS", "DESCRIPTION", "SKILLS", "EMPLOYMENTS", "PROJECTS"]).meta({ example: "GENERAL" }),
}).meta({ id: "GetConsultantIdSectionNameParams" });

export const SectionNameParamsSchema = z.object({
  sectionName: z.enum(["GENERAL", "NETWORKING_LINKS", "DESCRIPTION", "SKILLS", "EMPLOYMENTS", "PROJECTS"]).meta({ example: "GENERAL" }),
}).meta({ id: "GetSectionNameParams" });

export const PageSectionBodySchema = PageSectionSchema.omit({
  id: true,
  consultantId: true,
}).meta({ id: "PageSectionBody" });

export const PageSectionBodyPartialSchema =  PageSectionBodySchema.partial({
  name: true,
  visibility: true
}).meta({ id: "PageSectionBodyPartial" });

export const GetCommentsResponseSchema = z.array(CommentSchema);
