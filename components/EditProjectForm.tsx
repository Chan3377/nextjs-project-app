"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  CreateAndEditProjectSchema,
  CreateAndEditProjectType,
  ProjectMode,
  ProjectStatus,
} from "@/utils/types";

import { Button } from "./ui/button";
import { Form } from "./ui/form";
import CustomFormSelect, { CustomFormField } from "./FormComponents";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useToast } from "./ui/use-toast";

import { getSingleProjectAction, updateProjectAction } from "@/utils/actions";

function EditProjectForm({ projectId }: { projectId: string }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const router = useRouter();
  const { data } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => getSingleProjectAction(projectId),
  });
  const { mutate, isPending } = useMutation({
    mutationFn: (values: CreateAndEditProjectType) =>
      updateProjectAction(projectId, values),
    onSuccess: (data) => {
      if (!data) {
        toast({ description: "there was an error" });
        return;
      }
      toast({ description: "project updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      queryClient.invalidateQueries({ queryKey: ["charts"] });

      router.push("/projects");
    },
  });

  // 1. Define your form.
  const form = useForm<CreateAndEditProjectType>({
    resolver: zodResolver(CreateAndEditProjectSchema),
    defaultValues: {
      title: data?.title || "",
      description: data?.description || "",
      technologies: data?.technologies || "",
      image: data?.image || "",
      url: data?.url || "",
      status: (data?.status as ProjectStatus) || ProjectStatus.Pending,
      mode: (data?.mode as ProjectMode) || ProjectMode.Portfolio,
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: CreateAndEditProjectType) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    mutate(values);
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="bg-muted p-8 rounded"
      >
        <h2 className="capitalize font-semibold text-4xl mb-6">edit project</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 items-start">
          {/* title */}
          <CustomFormField name="title" control={form.control} />
          {/* description */}
          <CustomFormField name="description" control={form.control} />
          {/* technologies */}
          <CustomFormField name="technologies" control={form.control} />
          {/* image */}
          <CustomFormField name="image" control={form.control} />
          {/* url */}
          <CustomFormField name="url" control={form.control} />

          {/* status */}
          <CustomFormSelect
            name="status"
            control={form.control}
            labelText="project status"
            items={Object.values(ProjectStatus)}
          />
          {/* mode */}
          <CustomFormSelect
            name="mode"
            control={form.control}
            labelText="project mode"
            items={Object.values(ProjectMode)}
          />
          <Button
            type="submit"
            className="self-end capitalize"
            disabled={isPending}
          >
            {isPending ? "updating..." : "edit project"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
export default EditProjectForm;
