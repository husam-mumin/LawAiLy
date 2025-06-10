import DocumentCard from "../_components/DocumentCard";

export default function Home() {
  return (
    <div className="py-12 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 justify-items-center gap-20">
        <DocumentCard />
        <DocumentCard />
        <DocumentCard />
        <DocumentCard />
      </div>
    </div>
  );
}
