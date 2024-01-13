import { Howl } from "howler";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import playIcon from "@/assets/icons/play-outline.svg";
import openingSfx from "@/assets/audio/VO_JA_Furina_Opening_Treasure_Chest_02.ogg";
import ViewSheet from "./ViewSheet";
import PageMetadata from "@/components/containers/PageMetadata";
import ArtworkListing from "./ArtworkListing";
import { useCallback } from "react";

const openingChestSfx = new Howl({
  src: openingSfx,
  preload: true,
});

const ArtworksPage = () => {
  const { id: viewArtId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const goBack = useCallback(() => {
    if (location.key !== "default") {
      navigate(-1);
    } else {
      navigate("/treasures");
    }
  }, [location, navigate]);

  return (
    <div className="container py-16">
      <PageMetadata title={viewArtId ? "View Artwork" : "Treasures"} />

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

      <ArtworkListing />

      <ViewSheet isOpen={viewArtId != null} id={viewArtId} onClose={goBack} />
    </div>
  );
};

export default ArtworksPage;
