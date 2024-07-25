import ProjectsList from "@/components/ProjectsList";
import SearchForm from "@/components/SearchForm";
import { getAllProjectsAction } from "@/utils/actions";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

async function AllProjectsPage() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["project", "", "all", 1],
    queryFn: () => getAllProjectsAction({}),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SearchForm />
      <ProjectsList />
    </HydrationBoundary>
  );
}
export default AllProjectsPage;
