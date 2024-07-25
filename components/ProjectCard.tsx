"use client";
import { ProjectType } from "@/utils/types";
import { MapPin, Briefcase, CalendarDays, RadioTower } from "lucide-react";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import ProjectInfo from "./ProjectInfo";
import DeleteProjectButton from "./DeleteProjectButton";

function ProjectCard({ project }: { project: ProjectType }) {
  const date = new Date(project.createdAt).toLocaleDateString();
  return (
    <Card className="bg-muted">
      <CardHeader>
        <CardTitle>{project.title}</CardTitle>
        <CardDescription>{project.description}</CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="mt-4 grid grid-cols-2 gap-4">
        <ProjectInfo icon={<Briefcase />} text={project.mode} />
        <ProjectInfo icon={<MapPin />} text={project.technologies} />
        <ProjectInfo icon={<CalendarDays />} text={date} />
        <Badge className="w-32 justify-center">
          <ProjectInfo
            icon={<RadioTower className="w-4 h-4" />}
            text={project.status}
          />
        </Badge>
      </CardContent>
      <CardFooter className="flex gap-4">
        <Button asChild size="sm">
          <Link href={`/projects/${project.id}`}>edit</Link>
        </Button>
        <DeleteProjectButton id={project.id} />
      </CardFooter>
    </Card>
  );
}
export default ProjectCard;
