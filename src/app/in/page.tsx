import DocumentCard from "../_components/DocumentCard";
import News from "../_components/News";

export default function Home() {
  return (
    <div className="py-12">
      <div className="flex flex-col md:flex-row  justify-center items-center gap-6 md:gap-20">
        <News className="" />
        <News className="" />
      </div>
      <div className="flex justify-center flex-wrap gap-20 mt-12">
        <DocumentCard />
        <DocumentCard />
        <DocumentCard />
        <DocumentCard />
      </div>
    </div>
  );
}
