import { MediaPlayer } from "@/components/media-player";
import { mediaItems } from "@/data/site";

export function VideoShowcase({ limit }: { limit?: number }) {
  const items = typeof limit === "number" ? mediaItems.slice(0, limit) : mediaItems;
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {items.map((item) => (
        <article key={item.src} className="overflow-hidden rounded-md border border-navy-900/10 bg-white shadow-sm">
          <MediaPlayer src={item.src} poster={item.poster} title={item.title} className="aspect-video" />
          <div className="p-5">
            <h3 className="font-display text-xl font-bold text-navy-950">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-navy-600">{item.description}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
