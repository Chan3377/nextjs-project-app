"use server";

import prisma from "./db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import {
  CreateAndEditProjectSchema,
  CreateAndEditProjectType,
  ProjectType,
} from "./types";
import { Prisma } from "@prisma/client";
import dayjs from "dayjs";

function authenticateAndRedirect(): string {
  const { userId } = auth();
  console.log("userId", userId);

  if (!userId) redirect("/");
  return userId;
}

export async function createProjectAction(
  values: CreateAndEditProjectType
): Promise<ProjectType | null> {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  const userId = authenticateAndRedirect();
  try {
    CreateAndEditProjectSchema.parse(values);
    const project: ProjectType = await prisma.project.create({
      data: {
        ...values,
        clerkId: userId,
      },
    });
    return project;
  } catch (error) {
    console.log(error);
    return null;
  }
}

type GetAllProjectsActionTypes = {
  search?: string;
  projectStatus?: string;
  page?: number;
  limit?: number;
};

export async function getAllProjectsAction({
  search,
  projectStatus,
  page = 1,
  limit = 10,
}: GetAllProjectsActionTypes): Promise<{
  projects: ProjectType[];
  count: number;
  page: number;
  totalPages: number;
}> {
  const userId = authenticateAndRedirect();
  try {
    let whereClause: Prisma.ProjectWhereInput = {
      clerkId: userId,
    };
    if (search) {
      whereClause = {
        ...whereClause,
        OR: [
          {
            title: {
              contains: search,
            },
            description: {
              contains: search,
            },
          },
        ],
      };
    }

    if (projectStatus && projectStatus !== "all") {
      whereClause = {
        ...whereClause,
        status: projectStatus,
      };
    }

    const skip = (page - 1) * limit;

    const projects: ProjectType[] = await prisma.project.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });

    const count: number = await prisma.project.count({
      where: whereClause,
    });
    const totalPages = Math.ceil(count / limit);

    return { projects, count, page, totalPages };
  } catch (error) {
    return { projects: [], count: 0, page: 1, totalPages: 0 };
  }
}

export async function deleteProjectAction(
  id: string
): Promise<ProjectType | null> {
  const userId = authenticateAndRedirect();

  try {
    const project: ProjectType = await prisma.project.delete({
      where: {
        id,
        clerkId: userId,
      },
    });
    return project;
  } catch (error) {
    return null;
  }
}

export async function getSingleProjectAction(
  id: string
): Promise<ProjectType | null> {
  let project: ProjectType | null = null;
  const userId = authenticateAndRedirect();

  try {
    project = await prisma.project.findUnique({
      where: {
        id,
        clerkId: userId,
      },
    });
  } catch (error) {
    project = null;
  }
  if (!project) {
    redirect("/projects");
  }
  return project;
}

export async function updateProjectAction(
  id: string,
  values: CreateAndEditProjectType
): Promise<ProjectType | null> {
  const userId = authenticateAndRedirect();

  try {
    const project: ProjectType = await prisma.project.update({
      where: {
        id,
        clerkId: userId,
      },
      data: {
        ...values,
      },
    });
    return project;
  } catch (error) {
    return null;
  }
}

export async function getStatsAction(): Promise<{
  pending: number;
  progress: number;
  done: number;
}> {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  const userId = authenticateAndRedirect();
  // just to show Skeleton
  // await new Promise((resolve) => setTimeout(resolve, 5000));
  try {
    const stats = await prisma.project.groupBy({
      by: ["status"],
      _count: {
        status: true,
      },
      where: {
        clerkId: userId, // replace userId with the actual clerkId
      },
    });
    // console.log(stats); => to find stats oject

    const statsObject = stats.reduce((acc, curr) => {
      acc[curr.status] = curr._count.status;
      return acc;
    }, {} as Record<string, number>);

    const defaultStats = {
      pending: 0,
      progress: 0,
      done: 0,
      ...statsObject,
    };
    return defaultStats;
  } catch (error) {
    redirect("/projects");
  }
}

export async function getChartsDataAction(): Promise<
  Array<{ date: string; count: number }>
> {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  const userId = authenticateAndRedirect();
  const sixMonthsAgo = dayjs().subtract(6, "month").toDate();
  try {
    const projects = await prisma.project.findMany({
      where: {
        clerkId: userId,
        createdAt: {
          gte: sixMonthsAgo,
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    // console.log(projects); => check projects data object

    let applicationsPerMonth = projects.reduce((acc, project) => {
      const date = dayjs(project.createdAt).format("MMM YY");

      const existingEntry = acc.find((entry) => entry.date === date);

      if (existingEntry) {
        existingEntry.count += 1;
      } else {
        acc.push({ date, count: 1 });
      }

      return acc;
    }, [] as Array<{ date: string; count: number }>);

    return applicationsPerMonth;
  } catch (error) {
    redirect("/projects");
  }
}
