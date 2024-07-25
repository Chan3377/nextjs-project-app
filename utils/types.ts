import * as z from "zod";

export type ProjectType = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  clerkId: string;
  title: string;
  description: string;
  technologies: string;
  image: string;
  url: string;
  status: string;
  mode: string;
};

export enum ProjectStatus {
  Pending = "Pending",
  Progress = "In progress",
  Done = "Done",
}

export enum ProjectMode {
  Portfolio = "Portfolio project",
  Saas = "Saas project",
  Work = "Real-world project",
}

// Enums in TypeScript are a special type that allows you to define a set of named constants. They can be numeric or string-based.

export const CreateAndEditProjectSchema = z.object({
  title: z
    .string()
    .min(2, { message: "Project title must be 2 or more characters long" }),
  description: z.string().min(2, {
    message: "Project description must be 2 or more characters long",
  }),
  technologies: z.string().min(2, {
    message: "Project technologies must be 2 or more characters long",
  }),
  image: z.string().min(2, {
    message: "Project image must be 2 or more characters long",
  }),
  url: z.string().url({ message: "Project URL must be a valid URL" }),
  status: z.nativeEnum(ProjectStatus),
  mode: z.nativeEnum(ProjectMode),
});

export type CreateAndEditProjectType = z.infer<
  typeof CreateAndEditProjectSchema
>;
