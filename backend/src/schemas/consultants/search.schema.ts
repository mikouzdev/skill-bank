import { z } from "zod";

/** Comparison operator for numeric filters */
export const RangeSchema = z
  .enum(["GREATER", "LESSER", "EQUAL"])
  .describe("Comparison operator used when evaluating numeric values");

/** Skill proficiency filter */
export const SkillSchema = z.object({
  skill: z
    .string()
    .describe("Name of the skill")
    .meta({ example: "TypeScript" }),

  proficiency: z
    .number()
    .min(0)
    .max(5)
    .describe("Proficiency level for the skill")
    .meta({ example: 4 }),

  range: RangeSchema.meta({ example: "GREATER" }),
});

/** Root JSON filter object */
export const JsonFilterSchema = z
  .object({
    filter_skills: z
      .array(SkillSchema)
      .describe("List of skill-based filters")
      .meta({
        example: [
          {
            skill: "TypeScript",
            proficiency: 4,
            range: "GREATER",
          },
        ],
      }),

    experienceInMonths: z
      .number()
      .min(0)
      .describe("Required experience in months")
      .meta({ example: 24 }),

    range: RangeSchema.meta({ example: "GREATER" }),

    keywords: z
      .array(z.string())
      .describe("Free-text keyword filters")
      .meta({ example: ["backend", "typescript", "cloud"] }),
  })
  .partial();

export type Skill = z.infer<typeof SkillSchema>;
export type JsonFilter = z.infer<typeof JsonFilterSchema>;
