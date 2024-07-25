"use client";
import { getAllProjectsAction } from "@/utils/actions";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import ProjectCard from "./ProjectCard";
import ButtonContainer from "./ButtonContainer";
import ComplexButtonContainer from "./ComplexButtonContainer";

function ProjectsList() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";
  const projectStatus = searchParams.get("projectStatus") || "all";

  const pageNumber = Number(searchParams.get("page")) || 1;

  const { data, isPending } = useQuery({
    queryKey: ["projects", search, projectStatus, pageNumber],
    queryFn: () =>
      getAllProjectsAction({ search, projectStatus, page: pageNumber }),
  });

  const projects = data?.projects || [];

  const count = data?.count || 0;
  const page = data?.page || 0;
  const totalPages = data?.totalPages || 0;

  if (isPending) return <h2 className="text-xl">Please wait...</h2>;
  if (projects.length < 1)
    return <h2 className="text-xl">No Projects Found...</h2>;

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-semibold capitalize">
          {count} projects found
        </h2>
        {totalPages < 2 ? null : (
          <ComplexButtonContainer currentPage={page} totalPages={totalPages} />
        )}
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        {/* {button} */}
        {projects.map((project) => {
          return <ProjectCard key={project.id} project={project} />;
        })}
      </div>
    </>
  );
}
export default ProjectsList;
