"use client";

import { useState } from "react";
import { ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { API_URL } from "@/constants/constants";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  product_name: z.string().nonempty("Please enter your product name."),
  product_description: z
    .string()
    .nonempty("Please enter your product description."),
  product_images: z
    .custom<FileList>()
    .refine(
      (files) => files && files.length > 0,
      "Please upload at least one product image."
    )
    .refine((files) => {
      if (!files) return false;
      return Array.from(files).every((file) => file.size <= 10 * 1024 * 1024);
    }, "Each image must be less than 10 MB")
    .refine((files) => {
      if (!files) return false;
      return Array.from(files).every((file) =>
        ["image/png", "image/jpeg", "image/jpg", "image/gif"].includes(
          file.type
        )
      );
    }, "Images must be PNG, JPG, or GIF"),
});

export default function ProductForm() {
  const router = useRouter();
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      product_name: "",
      product_description: "",
      product_images: undefined,
    },
  });

  const handleImagePreview = (files: FileList | null) => {
    if (files) {
      const newImages = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setPreviewImages((prev) => [...prev, ...newImages]);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log("Form submitted:", values);

      const formData = new FormData();
      formData.append("product_name", values.product_name);
      formData.append("description_about_product", values.product_description);

      if (values.product_images) {
        Array.from(values.product_images).forEach((file) => {
          formData.append("product_images", file);
        });
      }
      formData.append("brand", "1");

      // Handle your API submission here
      console.log("FormData:", formData);
      const response = await fetch(`${API_URL}/api/products/`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      const data = await response.json();
      console.log("API response:", data);
      form.reset();
      setPreviewImages([]);
      router.push("/dashboard");
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">
          Product Submission
        </h1>

        <Card>
          <CardHeader>
            <CardTitle>Add New Product</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="product_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter product name" />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="product_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Description</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Describe your product..."
                          className="min-h-[150px]"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="product_images"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Images</FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                          {previewImages.map((image, index) => (
                            <img
                              key={index}
                              src={image}
                              alt={`Product ${index + 1}`}
                              className="w-full h-40 object-cover rounded-lg"
                            />
                          ))}
                          <div className="border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 transition-colors">
                            <div className="flex flex-col items-center justify-center h-40">
                              <ImagePlus className="h-8 w-8 text-gray-400" />
                              <input
                                type="file"
                                accept="image/png, image/jpg, image/jpeg, image/gif"
                                multiple
                                onChange={(e) => {
                                  field.onChange(e.target.files);
                                  handleImagePreview(e.target.files);
                                }}
                                className="hidden"
                                id="product-images"
                              />
                              <label
                                htmlFor="product-images"
                                className="cursor-pointer text-center"
                              >
                                <span className="mt-2 text-sm text-gray-500">
                                  Add Image
                                </span>
                                <p className="text-gray-400 text-sm">
                                  PNG, JPG, GIF up to 10MB
                                </p>
                              </label>
                            </div>
                          </div>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  Submit Product
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
