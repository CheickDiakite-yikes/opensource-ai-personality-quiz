
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

/**
 * Uploads a user avatar to Supabase storage
 * @param file The image file to upload
 * @param userId The user ID
 * @returns The URL of the uploaded avatar
 */
export const uploadAvatar = async (file: File, userId: string): Promise<string | null> => {
  try {
    // Create a unique file name based on user ID
    const fileExt = file.name.split('.').pop();
    const fileName = `avatar-${userId}`;
    const filePath = `${fileName}.${fileExt}`;

    // Upload the file to the avatars bucket
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, {
        upsert: true,
        cacheControl: '3600'
      });

    if (uploadError) {
      console.error('Error uploading avatar:', uploadError);
      return null;
    }

    // Get the public URL for the file
    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error('Error in uploadAvatar:', error);
    return null;
  }
};
