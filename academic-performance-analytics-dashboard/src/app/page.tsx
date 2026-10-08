import { redirect } from "next/navigation";

/** The dashboard itself is plain HTML/CSS/JS in public/dashboard (portable to Flask). */
export default function HomePage() {
  redirect("/dashboard/index.html");
}
