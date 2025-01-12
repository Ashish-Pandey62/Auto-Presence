"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { Upload } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { API_URL } from "@/constants/constants";

const formSchema = z.object({
  caption: z.string().nonempty("Please enter a caption."),
  images: z
    .custom<FileList>()
    .refine(
      (files) => files && files.length > 0,
      "Please upload at least one image."
    )
    .refine(
      (files) =>
        Array.from(files || []).every((file) =>
          ["image/png", "image/jpeg", "image/jpg", "image/gif"].includes(
            file.type
          )
        ),
      "All images must be a PNG, JPG, or GIF format."
    )
    .refine(
      (files) =>
        Array.from(files || []).every((file) => file.size <= 10 * 1024 * 1024),
      "Each image must be less than 10 MB"
    ),
});

export const CreateInstantPostForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      caption: "",
      images: undefined,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const formData = new FormData();
      formData.append("post_caption", values.caption);
      formData.append("brand", "1");
      formData.append("product", "1");

      if (values.images) {
        Array.from(values.images).forEach((file) => {
          formData.append("post_images", file);
        });
      }

      const response = await fetch(`${API_URL}/api/instagram/post/`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        form.reset();
        console.log("Post created successfully!");
      } else {
        throw new Error("Failed to create post.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="caption"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Caption</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter a caption" />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Upload Images</FormLabel>
                  <FormControl>
                    <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-purple-500 transition-colors">
                      <div className="flex flex-col items-center">
                        <Upload className="w-8 h-8 text-purple-400 mb-2" />
                        <input
                          type="file"
                          accept="image/png, image/jpg, image/jpeg, image/gif"
                          onChange={(e) => field.onChange(e.target.files)}
                          multiple
                          className="hidden"
                          id="images-upload"
                        />
                        <label
                          htmlFor="images-upload"
                          className="cursor-pointer text-center"
                        >
                          <p className="text-gray-500">Upload files</p>
                          <p className="text-gray-500 text-sm">
                            or drag and drop
                          </p>
                          <p className="text-gray-400 text-sm">
                            PNG, JPG, GIF up to 10MB each
                          </p>
                        </label>
                      </div>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Submitting..." : "Submit Post"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </div>
  );
};
