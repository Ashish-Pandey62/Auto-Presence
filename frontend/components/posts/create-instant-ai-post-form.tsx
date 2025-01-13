import { useForm, useWatch } from "react-hook-form";
import { Button } from "../ui/button";
import { CardContent } from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { API_URL } from "@/constants/constants";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  vibes: z.string().min(1, "Please enter your post vibes."),
  product: z.string().min(1, "Please enter your product name."),
  postType: z.enum(["image_only", "image_and_text"]),
  text: z.string().optional(),
  text_layering: z.enum(["forward", "backward"]),
});

export const CreateInstantAIPostForm = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vibes: "",
      product: "",
      postType: "image_only",
      text: "",
      text_layering: "forward",
    },
  });

  const postType = useWatch({
    control: form.control,
    name: "postType",
    defaultValue: "image_only",
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log("Form submitted:", values);

      const formData = new FormData();
      formData.append("vibe", values.vibes);
      formData.append("product_name", values.product);
      formData.append("post_type", values.postType);
      formData.append("text", values.text || "");
      formData.append("brand", "1");
      formData.append("product", "1");

      let response;

      response = await fetch(`${API_URL}/api/instagram/ai/post/`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      const data = await response.json();
      console.log("API response:", data);
      form.reset();
      router.push("/analytics");
    } catch (error) {
      console.error("Form submission error:", error);
    }
  }
  return (
    <CardContent>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="vibes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Post Vibes</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter post vibes"
                    className="w-full"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="postType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Post Type</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value || "image_only"}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select post type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="image_only">Image Only</SelectItem>
                        <SelectItem value="image_and_text">
                          Image and Text
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="product"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter product name"
                    className="w-full"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {postType === "image_and_text" && (
            <>
              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Overlay Text (optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter text to overlay on image"
                        className="w-full"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="text_layering"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Text Layering</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value || "Forward"}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select text layering" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="forward">Forward</SelectItem>
                            <SelectItem value="backward">Backward</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
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
  );
};
