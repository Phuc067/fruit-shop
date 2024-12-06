import { useNavigate } from "react-router-dom";
export default function BackButton(){

  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };
  return <>
  <button
        onClick={handleBack}
        className="bg-gray-200 text-gray-800  py-4 rounded-md hover:bg-gray-300 flex gap-2 items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
        Quay lại
      </button>
  </>
}
