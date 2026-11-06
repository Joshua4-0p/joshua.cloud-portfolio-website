import { profile } from "@/content/site";

export default function Home() {
  return (
    <main id="main">
      <h1>{profile.name}</h1>
      <a href="#drum">{profile.hint}</a>
    </main>
  );
}
