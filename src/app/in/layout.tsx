import MainLayout from "@/components/layout/MainLayout/MainLayout";
import axios from "axios";
import { DocumentProvider } from "./_components/DocumentProvider";
type layoutProps = {
  children: React.ReactNode;
};

export default async function layout({ children }: layoutProps) {
  const documents = async () => {
    const response = await axios.get(
      `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/api/in/documents`
    );
    if (response.status === 200) {
      console.log("Documents fetched successfully:", response.data);
      return response.data;
    } else {
      console.error("Failed to fetch documents");
      return [];
    }
  };

  return (
    <div>
      <DocumentProvider documents={await documents()}>
        <MainLayout>
          <div className="container mx-auto">{children}</div>
        </MainLayout>
      </DocumentProvider>
    </div>
  );
}
