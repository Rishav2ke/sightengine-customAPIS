import { useState } from "react";
import axios from "axios";

function ImageModeration() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      setResult("Please select an image.");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:5000/api/check-image",
        formData
      );

      setResult(
        response.data.safe
          ? "✅ Image is Safe"
          : "❌ Image Violates Policy"
      );
    } catch (error) {
      console.error(error);
      setResult("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 flex items-center justify-center p-4">
      
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">

        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          AI Image Moderation
        </h1>

        <p className="text-center text-gray-500 mb-6">
          Upload an image and check whether it is safe.
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div className="border-2 border-dashed border-indigo-400 rounded-xl p-6 text-center">

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setImage(e.target.files[0])
              }
              className="w-full"
            />

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition duration-300"
          >
            {loading ? "Checking..." : "Check Image"}
          </button>
        </form>

        {result && (
          <div className="mt-6 p-4 rounded-xl bg-gray-100 border">
            <p className="text-center font-medium">
              {result}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ImageModeration;