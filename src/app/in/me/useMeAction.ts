import { useEffect, useState } from "react";
import axios from "axios";
import { userType } from "@/models/Users";


export function useMeAction(user: userType) {
  
  const [firstName, setFirstName] = useState( "");
  const [lastName, setLastName] = useState( "");
  const [photoUrl, setPhotoUrl] = useState( "");
  const [loading, setLoading] = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setPhotoUrl(user.AvatarURL || "");
    }
  }, [user]);

  // Update firstName and lastName only
  const updateName = async (fields: { firstName?: string; lastName?: string }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.patch(`/api/in/user?id=${user._id}`, fields);
      if (fields.firstName !== undefined) setFirstName(fields.firstName);
      if (fields.lastName !== undefined) setLastName(fields.lastName);
      return res.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || "حدث خطأ أثناء تحديث الاسم");
      } else if (err instanceof Error) {
        setError(err.message || "حدث خطأ أثناء تحديث الاسم");
      } else {
        setError("حدث خطأ غير متوقع أثناء تحديث الاسم");
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update photoUrl only
  const updatePhoto = async (image: File) => {
    setPhotoLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("userId", user._id);
      const uploadRes = await axios.post("/api/in/user/uploadImage", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const photoUrl = uploadRes.data.url;
      if (!photoUrl) {
        setError("لم يتم تحميل الصورة بنجاح");
      }

      const res = await axios.patch(`/api/in/user?id=${user._id}`, { photoUrl });
      setPhotoUrl(photoUrl);
      return res.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || "حدث خطأ أثناء تحديث الصورة");
      } else if (err instanceof Error) {
        setError(err.message || "حدث خطأ أثناء تحديث الصورة");
      } else {
        setError("حدث خطأ غير متوقع أثناء تحديث الصورة");
      }
      return null;
    } finally {
      setPhotoLoading(false);
    }
  };

  return {
    firstName,
    lastName,
    photoUrl,
    updateName,
    updatePhoto,
    loading,
    error,
    photoLoading,
  };
}
