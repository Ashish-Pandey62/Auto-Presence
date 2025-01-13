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
import { useState } from "react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const [preveiwImage, setPreviewImage] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      caption: "",
      images: undefined,
    },
  });

  const handlePreviewImage = (files: FileList | null) => {
    if (files && files[0]) {
      setPreviewImage(URL.createObjectURL(files[0]));
    }
  };

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
        setPreviewImage(null);
        console.log("Post created successfully!");
        router.push("/analytics");
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
                    <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-primary transition-colors">
                      <div className="flex flex-col items-center">
                        {preveiwImage ? (
                          <div className="relative">
                            <img
                              src={preveiwImage}
                              alt="preview image"
                              className="w-40 h-40 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setPreviewImage(null); // Clear the preview
                                field.onChange(null); // Clear the field value
                              }}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <>
                            <Upload className="w-8 h-8 text-primary mb-2" />
                            <input
                              type="file"
                              accept="image/png, image/jpg, image/jpeg, image/gif"
                              onChange={(e) => {
                                field.onChange(e.target.files);
                                handlePreviewImage(e.target.files);
                              }}
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
                          </>
                        )}
                      </div>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
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
