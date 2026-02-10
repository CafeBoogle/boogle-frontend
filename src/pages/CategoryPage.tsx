import { useNavigate } from "react-router-dom";

function CategoryPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen  flex flex-col items-center justify-center px-6 py-12">
      <button
        className="px-4 py-2 bg-black text-white rounded-md"
        onClick={() => navigate("/filter")}
      >
        선택 완료
      </button>
    </div>
  );
}

export default CategoryPage;
