import MainLayout from "@/components/layout/MainLayout/MainLayout";
import axios from "axios";
import { DocumentProvider } from "./_components/DocumentProvider";
import NotificationDialog from "./_components/notifcaitonDialog";
type layoutProps = {
  children: React.ReactNode;
};

export default async function layout({ children }: layoutProps) {
  const documents = async () => {
    try {
      const response = await axios.get(
        `${
          process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
        }/api/in/documents`
      );
      if (response.status === 200) {
        return response.data;
      } else {
        console.error("Failed to fetch documents");
        return [];
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error);
      } else {
        console.error("Error fetching documents:", error);
      }
      return [];
    }
  };

  return (
    <div>
      <DocumentProvider documents={await documents()}>
        <MainLayout>
          <div className="container mx-auto">{children}</div>
        </MainLayout>
        <NotificationDialog />
      </DocumentProvider>
    </div>
  );
}
