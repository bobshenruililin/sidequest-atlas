import { WealthGraph } from "@/features/yuen-chuen/WealthGraph";
import { YuenChuenDisclaimer } from "@/features/yuen-chuen/YuenChuenDisclaimer";
import { loadYuenChuenGraph } from "@/lib/yuen-chuen";

export const metadata = {
  title: "Yuen Chuen Atlas",
  description:
    "Bro-voice yearbook roasts of Hong Kong public myths, linked by wealth lore.",
};

export default async function YuenChuenIndexPage() {
  const graph = await loadYuenChuenGraph();

  return (
    <div className="space-y-10">
      <section className="border-b border-rule pb-8">
        <p className="eyebrow">side project</p>
        <h1 className="mt-3 font-serif text-5xl leading-tight md:text-7xl">
          Yuen Chuen Atlas
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">
          Short mean bro yearbook entries for foundation namesakes, four
          families, tycoons, professors, and hall legends — click the wealth
          links.
        </p>
      </section>

      <YuenChuenDisclaimer />

      <WealthGraph figures={graph.figures} edges={graph.edges} />
    </div>
  );
}
