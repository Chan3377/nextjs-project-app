import CreateProjectForm from "@/components/CreateProjectForm";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
function AddProjectPage() {
  const queryClient = new QueryClient();
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CreateProjectForm />
    </HydrationBoundary>
  );
}
export default AddProjectPage;
