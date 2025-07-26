import MainLayout from "@/components/layout/MainLayout/MainLayout";
type layoutProps = {
  children: React.ReactNode;
};

export default async function layout({ children }: layoutProps) {
  return (
    <div>
      <MainLayout>
        <div className="">{children}</div>
      </MainLayout>
    </div>
  );
}
