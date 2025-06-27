import DocumentCard from "./_components/DocumentCard";
import { libyaLawCategories } from "../../mock/lawCategories";

export default function Home() {
  return (
    <div className="py-12 px-4">
      {libyaLawCategories ? (
        libyaLawCategories.map((cat) => (
          <div key={cat.id} className="mb-12 w-full">
            <h2 className="text-2xl font-bold mb-6 text-right">{cat.name}</h2>
            <div className="flex justify-end gap-10 mb-8 flex-wrap">
              {cat.books.length > 0
                ? cat.books.map((book, idx) => (
                    <DocumentCard
                      key={`book-${cat.id}-${idx}`}
                      title={book.title}
                      description={`الجهة: ${book.publisher}`}
                    />
                  ))
                : ""}
            </div>
          </div>
        ))
      ) : (
        <div
          className="text-center text-gray-500 h-[calc(100vh-200px)]
        flex items-center justify-center text-3xl"
        >
          لا توجد قوانين متاحة حاليًا
        </div>
      )}
    </div>
  );
}
