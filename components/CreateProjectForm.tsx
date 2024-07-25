"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  ProjectStatus,
  ProjectMode,
  CreateAndEditProjectSchema,
  CreateAndEditProjectType,
} from "@/utils/types";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { CustomFormSelect, CustomFormField } from "./FormComponents";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProjectAction } from "@/utils/actions";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

function CreateProjectForm() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationFn: (values: CreateAndEditProjectType) =>
      createProjectAction(values),
    onSuccess: (data) => {
      if (!data) {
        toast({ description: "there was an error" });
        return;
      }
      toast({ description: "project created successfully" });
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
      title: "",
      description: "",
      technologies: "",
      image: "",
      url: "",
      status: ProjectStatus.Pending,
      mode: ProjectMode.Portfolio,
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: CreateAndEditProjectType) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    // console.log(values);
    mutate(values);
  }

  return (
    <Form {...form}>
      <form
        className="bg-muted p-8 rounded"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <h2 className="capitalize font-semibold text-4xl mb-6">add project</h2>
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
            {isPending ? "loading..." : "create project"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default CreateProjectForm;
