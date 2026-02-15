"use client";

import { useState } from "react";
import Image from "next/image";
import NavBar from "@/components/NavBar/NavBar";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handlePrediction = async () => {
    if (!selectedFile) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/v1/diagnose",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error:", error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-green-50">
      <NavBar />

      <div className="flex justify-center items-center mt-12">
        <h1 className="text-4xl font-bold text-gray-800 text-center font-[Open_Sans]">
          Image Based Disease Prediction System
        </h1>
      </div>

      <div className="flex flex-col justify-center items-center mt-16">

        {/* SHOW UPLOAD SECTION ONLY IF NO RESULT */}
        {!result && (
          <>
            <div className="w-96 min-h-72 bg-white shadow-xl rounded-2xl flex flex-col justify-center items-center border-2 border-dashed border-green-400 p-6">

              <p className="mb-6 text-gray-600 font-medium">
                Upload an Image (.png, .jpg, .jpeg)
              </p>

              <input
                type="file"
                accept=".png, .jpeg, .jpg"
                onChange={handleImageChange}
                className="text-black font-medium 
                  file:bg-green-700 
                  file:text-white 
                  file:px-6 
                  file:py-2 
                  file:rounded-lg 
                  file:border-none 
                  file:cursor-pointer 
                  file:hover:bg-green-800"
              />

              {preview && (
                <div className="mt-6">
                  <Image
                    src={preview}
                    alt="Preview"
                    width={250}
                    height={250}
                    className="rounded-lg shadow-md object-cover"
                  />
                </div>
              )}
            </div>

            <button
              onClick={handlePrediction}
              className="mt-8 bg-green-700 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-800 transition duration-300 shadow-lg"
            >
              {loading ? "Predicting..." : "Get Prediction"}
            </button>
          </>
        )}

        {/* SHOW RESULT SECTION */}
        {result && (
          <div className="w-96 bg-white shadow-xl rounded-2xl p-6 text-center">

            <Image
              src={preview}
              alt="Uploaded"
              width={250}
              height={250}
              className="rounded-lg shadow-md object-cover mx-auto"
            />

            <h2 className="mt-6 text-2xl font-bold text-green-700">
              Disease: {result.disease}
            </h2>

            <p className="mt-2 text-lg font-semibold text-gray-700">
              Confidence: {result.confidence}
            </p>

            <div className="mt-6 border-t pt-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Remedies
              </h3>
              <p className="text-gray-500 mt-2">
                {/* Blank as requested */}
                 Coming Soon !!
             </p>
            </div>

          </div>
        )}

   
      </div>
       
    </div>
  );
}
