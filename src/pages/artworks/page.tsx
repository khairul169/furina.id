import pb from "@/utility/api";
import { Howl } from "howler";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import playIcon from "@/assets/icons/play-outline.svg";
import openingSfx from "@/assets/audio/VO_JA_Furina_Opening_Treasure_Chest_02.ogg";
import ViewSheet from "./viewSheet";
import useModal from "@/hooks/useModal";
import LazyImage from "@/components/ui/LazyImage";

const openingChestSfx = new Howl({
  src: openingSfx,
  preload: true,
});

const ArtworksPage = () => {
  const { data } = useQuery({
    queryKey: ["artworks"],
    queryFn: () =>
      pb.collection("artworks").getList(1, 100, { sort: "-created" }),
  });
  const viewItemModal = useModal<string>();

  return (
    <div className="container py-16">
      <h1 className="text-2xl">Treasures</h1>
      <div>
        <p className="italic inline">Take it. Ahem... I allow you!</p>
        <button
          type="button"
          className="bg-white rounded border-2 border-primary-300 hover:bg-gray-200 p-1 md:p-0.5 ml-2"
        >
          <img
            src={playIcon}
            alt="play"
            className="h-4"
            onClick={() => openingChestSfx.play()}
          />
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mt-8">
        {data?.items.map((item) => (
          <Link
            key={item.id}
            // to={`/treasures/${item.id}`}
            to="#"
            className="bg-white rounded-lg shadow border border-gray-300 overflow-hidden hover:scale-105 transition-all relative"
            onClick={(e) => {
              e.preventDefault();
              viewItemModal.onOpen(item.id);
            }}
          >
            <LazyImage
              lazySrc={pb.files.getUrl(item, item.image, { thumb: "32x48" })}
              src={pb.files.getUrl(item, item.image)}
              className="w-full aspect-[0.8] object-cover"
            />
            <div className="absolute bottom-2 left-2 px-3 py-1 rounded-md bg-black/20 backdrop-blur-sm">
              <p className="text-white">{item.artistName}</p>
            </div>
          </Link>
        ))}
      </div>

      <ViewSheet modal={viewItemModal} />
    </div>
  );
};

export default ArtworksPage;
