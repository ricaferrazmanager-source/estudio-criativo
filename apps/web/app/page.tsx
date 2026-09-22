import { requireMember } from "../lib/supabase";
import Studio from "./studio";
export default async function Home() {
  const member = await requireMember();
  return <Studio email={member.email} admin={member.admin} />;
}
