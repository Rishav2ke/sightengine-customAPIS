import { useState } from "react";
import axios from "axios";

function ImageModeration() {
  const [activeTab, setActiveTab] = useState("image");

  const [image, setImage] = useState(null);
  const [imageResult, setImageResult] = useState("");

  const [text, setText] = useState("");
  const [textResult, setTextResult] = useState("");

  const [loading, setLoading] = useState(false);

  const handleImageSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      setImageResult("Please select an image.");
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

      setImageResult(
        response.data.safe
          ? "✅ Image is Safe"
          : "❌ Image Violates Policy"
      );
    } catch (error) {
      console.error(error);
      setImageResult("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleTextSubmit = async (e) => {
    e.preventDefault();

    if (!text.trim()) {
      setTextResult("Please enter some text.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:5000/api/check-text",
        {
          text,
        }
      );

      setTextResult(
        response.data.safe
          ? "✅ Text is Safe"
          : "❌ Text Violates Policy"
      );
    } catch (error) {
      console.error(error);
      setTextResult("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 flex items-center justify-center p-4">

      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl p-8">

        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          AI Content Moderation
        </h1>

        <p className="text-center text-gray-500 mb-6">
          Moderate images and text using AI.
        </p>

        <div className="flex mb-6 bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => setActiveTab("image")}
            className={`flex-1 py-3 rounded-lg font-medium transition ${
              activeTab === "image"
                ? "bg-indigo-600 text-white"
                : "text-gray-600"
            }`}
          >
            Image Moderation
          </button>

          <button
            onClick={() => setActiveTab("text")}
            className={`flex-1 py-3 rounded-lg font-medium transition ${
              activeTab === "text"
                ? "bg-green-600 text-white"
                : "text-gray-600"
            }`}
          >
            Text Moderation
          </button>
        </div>

        {activeTab === "image" && (
          <>
            <form
              onSubmit={handleImageSubmit}
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
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold"
              >
                {loading ? "Checking..." : "Check Image"}
              </button>
            </form>

            {imageResult && (
              <div className="mt-6 p-4 rounded-xl bg-gray-100 border">
                <p className="text-center font-medium">
                  {imageResult}
                </p>
              </div>
            )}
          </>
        )}

        {activeTab === "text" && (
          <>
            <form
              onSubmit={handleTextSubmit}
              className="space-y-5"
            >
              <textarea
                rows="6"
                value={text}
                onChange={(e) =>
                  setText(e.target.value)
                }
                placeholder="Enter text to moderate..."
                className="w-full border rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-green-500"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold"
              >
                {loading ? "Checking..." : "Check Text"}
              </button>
            </form>

            {textResult && (
              <div className="mt-6 p-4 rounded-xl bg-gray-100 border">
                <p className="text-center font-medium">
                  {textResult}
                </p>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}

export default ImageModeration;