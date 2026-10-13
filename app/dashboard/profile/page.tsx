import { getProfileData } from "@/actions/profile/get-profile-data";
import ProfileClient from "@/components/profile/client";
import { redirect } from "next/navigation";


export default async function ProfilePage() {

  const user = await getProfileData();
  if (!user) {
    redirect("/login");
  }
  return <ProfileClient user={user} />;
}
