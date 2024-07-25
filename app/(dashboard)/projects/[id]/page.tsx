import EditProjectForm from "@/components/EditProjectForm";
import { getSingleProjectAction } from "@/utils/actions";

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["project", params.id],
    queryFn: () => getSingleProjectAction(params.id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EditProjectForm projectId={params.id} />
    </HydrationBoundary>
  );
}
export default ProjectDetailPage;
