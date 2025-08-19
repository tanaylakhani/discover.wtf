import { createClient } from "@supabase/supabase-js";

// Create a single supabase client for interacting with your database
const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_ANON_KEY as string
);

export const uploadCommentMedia = async (
  file: File,
  userId: string,
  linkId: string
) => {
  try {
    const { data, error } = await supabase.storage
      .from("discover-media")
      .upload(`${file.name}-${userId}-${new Date().getTime()}`, file, {
        cacheControl: "3600",
        upsert: true,
        metadata: {
          userId: userId,
          linkId: linkId,
        },
      });

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    const { data: publicData } = supabase.storage
      .from("discover-media")
      .getPublicUrl(data.path);

    return {
      success: true,
      data: { url: publicData?.publicUrl, type: file.type },
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: (error as Error).message || "Failed to upload media",
    };
  }
};

export default supabase;
