import pb from "@/utility/api";
import { useInfiniteQuery } from "react-query";
import { Link } from "react-router-dom";
import LazyImage from "@/components/ui/LazyImage";
import React, { useMemo } from "react";
import Button from "@/components/ui/Button";
import { useBottomScrollListener } from "react-bottom-scroll-listener";
import { Skeleton } from "@/components/ui/Skeleton";

const ArtworkListing = () => {
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteQuery({
      queryKey: ["artworks"],
      queryFn: ({ pageParam = 1 }) => {
        return pb
          .collection("artworks")
          .getList(pageParam, 12, { sort: "-created" });
      },
      getNextPageParam: (lastPage) =>
        lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    });

  useBottomScrollListener<HTMLDivElement>(
    () => {
      if (!isFetchingNextPage) {
        fetchNextPage();
      }
    },
    { offset: 100 }
  );

  const items = useMemo(
    () => data?.pages.flatMap((i) => i.items) || [],
    [data]
  );

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mt-8">
        {items.map((item) => (
          <Link
            key={item.id}
            to={`/treasures/${item.id}`}
            className="bg-white rounded-lg shadow border border-gray-300 overflow-hidden hover:scale-105 transition-all relative"
          >
            <LazyImage
              lazySrc={pb.files.getUrl(item, item.image, { thumb: "32x48" })}
              src={pb.files.getUrl(item, item.image, { thumb: "256x384" })}
              className="w-full aspect-[0.8] object-cover"
            />
            <div className="absolute bottom-2 left-2 px-3 py-1 rounded-md bg-black/20 backdrop-blur-sm z-[2]">
              <p className="text-white">{item.artistName}</p>
            </div>
          </Link>
        ))}

        {isLoading || isFetchingNextPage
          ? [...Array(12)].map((_, idx) => (
              <Skeleton key={idx} className="aspect-[0.8]" />
            ))
          : null}
      </div>

      {hasNextPage && !isFetchingNextPage ? (
        <div className="flex justify-center mt-8">
          <Button
            onClick={() => {
              if (!isFetchingNextPage) {
                fetchNextPage();
              }
            }}
            variant="solid"
            className="min-w-[200px]"
          >
            Load More
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default React.memo(ArtworkListing);
