import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const BackButton = ({ className = "" }: { className?: string }) => {
  const navigate = useNavigate();

  const goBack = () => {
    try {
      // If there's history, go back; otherwise go to home
      if (window.history.length > 1) navigate(-1);
      else navigate("/");
    } catch (e) {
      navigate("/");
    }
  };

  return (
    <button
      onClick={goBack}
      className={`inline-flex items-center justify-center p-2 rounded hover:bg-secondary/20 ${className}`}
      aria-label="Go back"
    >
      <ArrowLeft className="w-4 h-4" />
    </button>
  );
};

export default BackButton;
