import Sheet from "@/components/ui/Sheet";
import pb from "@/utility/api";
import { useQuery } from "react-query";
import loadingIllust from "@/assets/images/l9fsdoa2j7vb1.gif";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { ChevronLeft } from "lucide-react";
import LazyImage from "@/components/ui/LazyImage";
import { useEffect, useState } from "react";

type Props = {
  id?: string | null;
  isOpen?: boolean;
  onClose: () => void;
};

const ViewSheet = ({ id: viewId, isOpen, onClose }: Props) => {
  const [id, setId] = useState(viewId);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["artwork", id],
    queryFn: () => pb.collection("artworks").getOne(id || ""),
    enabled: !!id,
  });

  useEffect(() => {
    if (viewId) {
      setId(viewId);
    }
  }, [viewId, setId]);

  return (
    <Sheet
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
      title="View Item"
      position="bottom"
      className="md:rounded-t-none h-[90vh] md:h-screen"
    >
      {isLoading ? (
        <div className="min-h-[320px] flex flex-col items-center justify-center text-center">
          <img src={loadingIllust} className="h-40 animate-bounce" />
          <p className="mt-2">Please wait a moment...</p>
        </div>
      ) : isError || !data ? (
        <div className="min-h-[320px] flex flex-col items-center justify-center text-center">
          <h1 className="text-2xl">An error occured.</h1>
          <p className="mt-2">Cannot load item</p>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row md:h-full">
          <div className="flex-1 bg-gray-50 flex items-center justify-center">
            <a href={data.srcUrl} target="_blank" className="w-full h-full">
              <LazyImage
                lazySrc={pb.files.getUrl(data, data.image, { thumb: "32x48" })}
                src={pb.files.getUrl(data, data.image)}
                className="w-full h-full object-contain"
                containerClassName="w-full h-full"
                placeholderClassName="scale-x-110 -translate-x-10"
                placeholder={
                  <div className="absolute z-10 inset-0 flex items-center justify-center">
                    <p className="text-center bg-white py-1 px-2 rounded animate-bounce">
                      Loading...
                    </p>
                  </div>
                }
              />
            </a>
          </div>

          <div className="md:w-1/3 border-t md:border-t-0 py-4 md:pt-0 px-4 lg:px-8 overflow-y-auto">
            <Button className="flex pl-2 mb-6" onClick={onClose}>
              <ChevronLeft /> Back
            </Button>

            {data.caption?.length > 0 ? (
              <div className="my-4 border-b pb-4">
                {data.caption.split("\n").map((text: string, idx: number) => (
                  <p key={idx}>{text}</p>
                ))}
              </div>
            ) : null}

            <Badge>Artist Name</Badge>
            <p className="mt-1 truncate">{data.artistName}</p>

            <Badge className="mt-4">Source</Badge>
            <a
              href={data.srcUrl}
              target="_blank"
              className="block mt-1 link truncate"
            >
              {cleanUrl(data.srcUrl)}
            </a>

            <p className="text-sm mt-8 w-full">
              <i>Disclaimer:</i>
              <br />I do not own this work of art. Please visit the original
              post to see more from{" "}
              <a href={data.srcUrl} target="_blank" className="link">
                {data.artistName}
              </a>
              .<br />
              Let me know if this artwork needs to be removed by emailing{" "}
              <a href="mailto:khai@rul.sh" className="link">
                khai@rul.sh
              </a>
            </p>
          </div>
        </div>
      )}
    </Sheet>
  );
};

const cleanUrl = (url: string) => {
  return url.replace("https://", "").replace("http://", "").replace("www.", "");
};

export default ViewSheet;
