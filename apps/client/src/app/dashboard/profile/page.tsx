import { requireUser } from "@/data/user/require-user";
import { ProfilePage } from "./_components/profile-page";

export default async function Page() {
  await requireUser(); // protect route
  return <ProfilePage />;
}
