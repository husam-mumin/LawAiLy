import MainLayout from "@/components/layout/MainLayout/MainLayout";
import NotificationDialog from "./_components/notifcaitonDialog";
type layoutProps = {
  children: React.ReactNode;
};

export default async function layout({ children }: layoutProps) {
  return (
    <div>
      <MainLayout>
        <div className="">{children}</div>
        <NotificationDialog />
      </MainLayout>
    </div>
  );
}
