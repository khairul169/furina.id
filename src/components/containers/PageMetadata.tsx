import Helmet from "react-helmet";

type PageMetadataProps = {
  title?: string;
  description?: string;
  keywords?: string;
  allowIndex?: boolean;
};

const PageMetadata = (props: PageMetadataProps) => {
  return (
    <Helmet>
      <title>{[props.title, "Furina.id"].filter((i) => !!i).join(" - ")}</title>
      <meta
        name="description"
        content={props.description || "Welcome to Furina.id"}
      />
      <meta
        name="keywords"
        content={[
          props.keywords,
          "furina.id, furina build, furina gameplay, furina guide, furina genshin",
        ]
          .filter((i) => !!i)
          .join(", ")}
      />
      <meta
        name="robots"
        content={
          props.allowIndex !== false ? "index, follow" : "noindex, nofollow"
        }
      />
    </Helmet>
  );
};

export default PageMetadata;
