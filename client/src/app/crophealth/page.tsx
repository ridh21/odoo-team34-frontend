"use client";

import React, { useState, useEffect, useRef } from "react";
import FarmerNav from "@/components/FarmerNavbar";
import axios from "axios";
import Image from "next/image";
import {
  FaLeaf, FaHistory, FaCamera, FaUpload, FaInfoCircle,
  FaChevronDown, FaChevronRight, FaExclamationTriangle,
  FaCheckCircle, FaTimesCircle, FaThumbsUp, FaThumbsDown,
  FaSearch, FaSpinner, FaTrash, FaFileMedical, FaVirus,
  FaGoogle, FaExternalLinkAlt, FaShieldAlt
} from "react-icons/fa";
import { BiCrop } from "react-icons/bi";
import { GiMedicines } from "react-icons/gi";
import { MdOutlineHealthAndSafety } from "react-icons/md";

const CropHealthDiagnosis = () => {
  // State management
  const [activeTab, setActiveTab] = useState("diagnosis");
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [diagnosisResult, setDiagnosisResult] = useState(null);
  const [diagnosisHistory, setDiagnosisHistory] = useState([]);
  const [expandedHistory, setExpandedHistory] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState({});
  const fileInputRef = useRef(null);

  // Fetch diagnosis history on component mount
  useEffect(() => {
    fetchDiagnosisHistory();
  }, []);

  const fetchDiagnosisHistory = async () => {
    try {
      setIsLoading(true);
      // Replace with your actual API endpoint
      const response = await axios.get("https://crop.kindwise.com/api/v1/identification");
      setDiagnosisHistory(response.data || mockHistoryData);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching diagnosis history:", error);
      setError("Failed to load diagnosis history. Please try again later.");
      setIsLoading(false);
      // For demo purposes, use mock data
      setDiagnosisHistory(mockHistoryData);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(file);
      setDiagnosisResult(null);
    }
  };

  const handleDiagnose = async () => {
	if (!selectedImage) {
	  setError("Please select an image to diagnose");
	  return;
	}

	try {
	  setIsLoading(true);
	  setError(null);

	  // Convert image to base64
	  const base64Image = await new Promise((resolve) => {
		const reader = new FileReader();
		reader.onload = () => resolve(reader.result);
		reader.readAsDataURL(selectedImage);
	  });

	  // Make API request to KindWise crop identification service
	  try {
		const response = await axios.post(
		  'https://crop.kindwise.com/api/v1/identification',
		  {
			images: [base64Image],
			latitude: 49.207,
			longitude: 16.608,
			similar_images: true
		  },
		  {
			headers: {
			  'Api-Key': 'isekQXDEIwz98Kx8wRQ5zjfFIHmC6cfepXUxmPtXcdwKvJOTJj', // Replace with your actual API key
			  'Content-Type': 'application/json'
			}
		  }
		);

		console.log("API Response:", response.data);

		// Extract relevant data from the API response
		if (response.data && response.data.result) {
		  const apiResult = response.data.result;
		  const cropSuggestions = apiResult.crop?.suggestions || [];
		  const diseaseSuggestions = apiResult.disease?.suggestions || [];
		  const isPlant = apiResult.is_plant?.binary || false;

		  // Check if it's a plant and if we have crop suggestions
		  if (isPlant && cropSuggestions.length > 0) {
			const cropInfo = cropSuggestions[0];

			// Check if there are disease suggestions
			const isHealthy = !diseaseSuggestions || diseaseSuggestions.length === 0;

			// Create a result object that matches your application's expected format
			const result = {
			  crop: {
				gbif_id: cropInfo.id || null,
				image: cropInfo.similar_images?.[0]?.url || null,
				images: (cropInfo.similar_images || []).map(img => img.url || img),
				common_names: [cropInfo.name || "Unknown Plant"],
				taxonomy: {
				  kingdom: cropInfo.taxonomy?.kingdom || "Plantae",
				  phylum: cropInfo.taxonomy?.phylum || "",
				  class: cropInfo.taxonomy?.class || "",
				  order: cropInfo.taxonomy?.order || "",
				  family: cropInfo.taxonomy?.family || "",
				  genus: cropInfo.taxonomy?.genus || "",
				  species: cropInfo.taxonomy?.species || ""
				}
			  },
			  disease: isHealthy ?
				{ severity: "None" } :
				{
				  type: diseaseSuggestions[0]?.type || "Unknown",
				  common_names: [diseaseSuggestions[0]?.name || "Unknown Disease"],
				  taxonomy: diseaseSuggestions[0]?.taxonomy || {},
				  gbif_id: diseaseSuggestions[0]?.id || null,
				  image: diseaseSuggestions[0]?.similar_images?.[0]?.url || null,
				  images: (diseaseSuggestions[0]?.similar_images || []).map(img => img.url || img),
				  description: diseaseSuggestions[0]?.description || "No description available",
				  treatment: {
					biological: diseaseSuggestions[0]?.treatment?.biological || "No biological treatment information available.",
					chemical: diseaseSuggestions[0]?.treatment?.chemical || "No chemical treatment information available.",
					prevention: diseaseSuggestions[0]?.treatment?.prevention || "No prevention information available."
				  },
				  symptoms: diseaseSuggestions[0]?.symptoms || {
					leaves: "No specific leaf symptoms information available.",
					stems: "No specific stem symptoms information available.",
					fruits: "No specific fruit symptoms information available."
				  },
				  severity: determineSeverity(diseaseSuggestions[0]?.probability),
				  spreading: diseaseSuggestions[0]?.spreading || "No information available about how this disease spreads."
				}
			};

			// Set the diagnosis result
			setDiagnosisResult(result);

			// Add to history
			const newHistoryItem = {
			  id: Date.now().toString(),
			  date: new Date().toISOString(),
			  cropName: cropInfo.name || "Unknown Plant",
			  diseaseName: isHealthy ? "Healthy" : (diseaseSuggestions[0]?.name || "Unknown Disease"),
			  severity: isHealthy ? "None" : determineSeverity(diseaseSuggestions[0]?.probability),
			  imageUrl: previewUrl,
			  result: result
			};

			setDiagnosisHistory([newHistoryItem, ...diagnosisHistory]);
			setIsLoading(false);
			return; // Exit early since we've processed the API response
		  }
		}

		// If we couldn't process the API response properly, fall back to mock data
		throw new Error("Could not process API response");

	  } catch (apiError) {
		console.error("API Error:", apiError);
		// Fall back to mock data
	  }

	  // Fallback: Use mock data
	  const isHealthy = Math.random() > 0.7;
	  setDiagnosisResult(isHealthy ? mockHealthyResult : mockDiagnosisResult);

	  // Add to history with mock data
	  const newHistoryItem = {
		id: Date.now().toString(),
		date: new Date().toISOString(),
		cropName: mockDiagnosisResult.crop.common_names[0],
		diseaseName: isHealthy ? "Healthy" : mockDiagnosisResult.disease.common_names[0],
		severity: isHealthy ? "None" : mockDiagnosisResult.disease.severity,
		imageUrl: previewUrl,
		result: isHealthy ? mockHealthyResult : mockDiagnosisResult
	  };

	  setDiagnosisHistory([newHistoryItem, ...diagnosisHistory]);
	  setIsLoading(false);
	} catch (error) {
	  console.error("Error during diagnosis:", error);
	  setError("Failed to diagnose the image. Please try again.");
	  setIsLoading(false);
	}
  };

  // Helper function to determine severity based on probability
  const determineSeverity = (probability) => {
	if (!probability) return "Low";
	if (probability > 0.8) return "High";
	if (probability > 0.5) return "Medium";
	return "Low";
  };
  const handleHistoryItemClick = (id) => {
    if (expandedHistory === id) {
      setExpandedHistory(null);
    } else {
      setExpandedHistory(id);
      const historyItem = diagnosisHistory.find(item => item.id === id);
      if (historyItem) {
        setDiagnosisResult(historyItem.result);
        setPreviewUrl(historyItem.imageUrl);
      }
    }
  };

  const handleDeleteHistory = async (id, e) => {
    e.stopPropagation();
    try {
      // Replace with your actual API endpoint
      // await axios.delete(`/api/crop-health/history/${id}`);

      // Update local state
      setDiagnosisHistory(diagnosisHistory.filter(item => item.id !== id));
      if (expandedHistory === id) {
        setExpandedHistory(null);
      }
    } catch (error) {
      console.error("Error deleting history item:", error);
      setError("Failed to delete history item. Please try again.");
    }
  };

  const handleFeedback = async (id, isPositive) => {
    try {
      // Replace with your actual API endpoint
      // await axios.post(`/api/crop-health/feedback`, {
      //   id,
      //   feedback: isPositive ? 'positive' : 'negative'
      // });

      // Update local state
      setFeedback({
        ...feedback,
        [id]: isPositive ? 'positive' : 'negative'
      });
    } catch (error) {
      console.error("Error sending feedback:", error);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-orange-500';
      case 'low':
        return 'text-yellow-500';
      case 'none':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const openGoogleSearch = (searchTerm) => {
    if (!searchTerm) return;
    const url = `https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <FarmerNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <MdOutlineHealthAndSafety className="mr-2 text-green-600" size={32} />
            Crop Health Diagnosis
          </h1>
          <p className="mt-2 text-gray-600">
            Upload images of your crops to diagnose diseases and get treatment recommendations
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8 border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("diagnosis")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "diagnosis"
                  ? "border-green-500 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } transition-colors duration-200`}
            >
              <div className="flex items-center">
                <FaLeaf className="mr-2" />
                New Diagnosis
              </div>
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "history"
                  ? "border-green-500 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } transition-colors duration-200`}
            >
              <div className="flex items-center">
                <FaHistory className="mr-2" />
                Diagnosis History
              </div>
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Image Upload */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <FaCamera className="mr-2 text-green-600" />
                Upload Crop Image
              </h2>

              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current.click()}
              >
                {previewUrl ? (
                  <div className="relative">
                    <img
                      src={previewUrl}
                      alt="Selected crop"
                      className="mx-auto max-h-64 rounded-lg"
                    />
                    <button
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewUrl(null);
                        setSelectedImage(null);
                      }}
                    >
                      <FaTimesCircle />
                    </button>
                  </div>
                ) : (
                  <div className="py-8">
                    <FaUpload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              <button
                onClick={handleDiagnose}
                disabled={isLoading || !selectedImage}
                className={`mt-4 w-full py-2 px-4 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                  isLoading || !selectedImage
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700"
                } transition-colors`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <FaSpinner className="animate-spin mr-2" />
                    Diagnosing...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <FaSearch className="mr-2" />
                    Diagnose Crop
                  </span>
                )}
              </button>

              {error && (
                <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  <p className="flex items-center">
                    <FaExclamationTriangle className="mr-2" />
                    {error}
                  </p>
                </div>
              )}

              <div className="mt-4 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg">
                <p className="text-sm flex items-center">
                  <FaInfoCircle className="mr-2" />
                  For best results, ensure the image clearly shows the affected part of the plant.
                </p>
              </div>
            </div>

            {/* History List (Mobile Only) */}
            {activeTab === "history" && (
              <div className="lg:hidden">
                <HistoryList
                  diagnosisHistory={diagnosisHistory}
                  expandedHistory={expandedHistory}
                  handleHistoryItemClick={handleHistoryItemClick}
                  handleDeleteHistory={handleDeleteHistory}
                  getSeverityColor={getSeverityColor}
                  isLoading={isLoading}
                />
              </div>
            )}
          </div>

          {/* Right Panel - Results or History */}
          <div className="lg:col-span-2">
            {activeTab === "diagnosis" && (
              <DiagnosisResults
                diagnosisResult={diagnosisResult}
                handleFeedback={handleFeedback}
                feedback={feedback}
                getSeverityColor={getSeverityColor}
                openGoogleSearch={openGoogleSearch}
              />
            )}

            {activeTab === "history" && (
              <div className="hidden lg:block">
                <HistoryList
                  diagnosisHistory={diagnosisHistory}
                  expandedHistory={expandedHistory}
                  handleHistoryItemClick={handleHistoryItemClick}
                  handleDeleteHistory={handleDeleteHistory}
                  getSeverityColor={getSeverityColor}
                  isLoading={isLoading}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// History List Component
const HistoryList = ({
  diagnosisHistory,
  expandedHistory,
  handleHistoryItemClick,
  handleDeleteHistory,
  getSeverityColor,
  isLoading
}) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-center items-center py-8">
          <FaSpinner className="animate-spin text-green-500 mr-2" />
          <span>Loading history...</span>
        </div>
      </div>
    );
  }

  if (diagnosisHistory.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-8">
          <FaHistory className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No diagnosis history</h3>
          <p className="mt-1 text-sm text-gray-500">
            Your previous diagnoses will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <FaHistory className="mr-2 text-green-600" />
        Diagnosis History
      </h2>

      <div className="space-y-4">
        {diagnosisHistory.map((item) => (
          <div
            key={item.id}
            className={`border rounded-lg overflow-hidden transition-all duration-200 ${
              expandedHistory === item.id ? 'border-green-500 shadow-md' : 'border-gray-200 hover:border-green-300'
            }`}
          >
            <div
              className="flex items-center justify-between p-4 cursor-pointer"
              onClick={() => handleHistoryItemClick(item.id)}
            >
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-md overflow-hidden flex-shrink-0 bg-gray-100">
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.cropName}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-900">{item.cropName}</h3>
                  <div className="flex items-center">
                    <span className={`text-xs ${getSeverityColor(item.severity)}`}>
                      {item.diseaseName}
                    </span>
                    <span className="mx-2 text-gray-300">•</span>
                    <span className="text-xs text-gray-500">
                      {new Date(item.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <button
                  onClick={(e) => handleDeleteHistory(item.id, e)}
                  className="text-gray-400 hover:text-red-500 p-1 rounded-full transition-colors"
                  aria-label="Delete"
                >
                  <FaTrash size={14} />
                </button>
                <div className="ml-2 text-gray-400">
                  {expandedHistory === item.id ? <FaChevronDown /> : <FaChevronRight />}
                </div>
              </div>
            </div>

            {expandedHistory === item.id && (
              <div className="border-t border-gray-200 p-4 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <BiCrop className="mr-1 text-green-600" />
                      Crop Details
                    </h4>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Name:</span> {item.cropName}
                    </p>
                    {item.result?.crop?.taxonomy && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Scientific Name:</span> {item.result.crop.taxonomy.genus} {item.result.crop.taxonomy.species}
                      </p>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                      {item.severity === "None" ? (
                        <FaCheckCircle className="mr-1 text-green-500" />
                      ) : (
                        <FaVirus className="mr-1 text-red-500" />
                      )}
                      {item.severity === "None" ? "Health Status" : "Disease Details"}
                    </h4>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Status:</span> {item.diseaseName}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Severity:</span>
                      <span className={getSeverityColor(item.severity)}> {item.severity}</span>
                    </p>
                  </div>
                </div>

                {item.result?.disease?.treatment && item.severity !== "None" && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <GiMedicines className="mr-1 text-blue-600" />
                      Treatment Summary
                    </h4>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {item.result.disease.treatment.prevention}
                    </p>
                  </div>
                )}

                <div className="mt-4 flex justify-end">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleHistoryItemClick(item.id);
                    }}
                    className="text-sm text-green-600 hover:text-green-800 font-medium"
                  >
                    View Full Details
                  </a>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Diagnosis Results Component
const DiagnosisResults = ({ diagnosisResult, handleFeedback, feedback, getSeverityColor, openGoogleSearch }) => {
  if (!diagnosisResult) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-12">
          <FaFileMedical className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No diagnosis results</h3>
          <p className="mt-1 text-sm text-gray-500">
            Upload an image and click "Diagnose Crop" to see results here.
          </p>
        </div>
      </div>
    );
  }

  const { crop, disease } = diagnosisResult;
  const resultId = Date.now().toString();
  const isHealthy = !disease || disease.severity === "None";

  return (
    <div className="space-y-6">
      {/* Diagnosis Summary */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <FaLeaf className="mr-2 text-green-600" />
            Diagnosis Results
          </h2>

        </div>

        <div className={`${isHealthy ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'} border rounded-lg p-4 mb-6`}>
          <div className="flex items-start">
            {isHealthy ? (
              <FaCheckCircle className="text-green-600 mt-0.5 mr-2 flex-shrink-0" />
            ) : (
              <FaExclamationTriangle className="text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
            )}
            <div>
              <p className={`font-medium ${isHealthy ? 'text-green-800' : 'text-yellow-800'}`}>
                {isHealthy ? 'Healthy Crop Detected' : 'Potential Disease Detected'}
              </p>
              <p className={`text-sm ${isHealthy ? 'text-green-700' : 'text-yellow-700'}`}>
                {isHealthy
                  ? 'Good news! Your crop appears to be healthy with no signs of disease.'
                  : 'We\'ve identified your crop and detected a potential disease. Review the details below.'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
              <BiCrop className="mr-2 text-green-600" />
              Crop Identification
            </h3>
            <div className="flex items-start">
              {crop.image && (
                <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 mr-4 bg-gray-100">
                  <img
                    src={crop.image}
                    alt={crop.common_names[0]}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div>
                <p className="font-medium text-gray-900">{crop.common_names[0]}</p>
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">Scientific Name:</span> {crop.taxonomy.genus} {crop.taxonomy.species}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">GBIF ID:</span> {crop.gbif_id}
                </p>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
              {isHealthy ? (
                <FaShieldAlt className="mr-2 text-green-500" />
              ) : (
                <FaVirus className="mr-2 text-red-500" />
              )}
              {isHealthy ? 'Health Status' : 'Disease Detection'}
            </h3>
            <div className="flex items-start">
              {!isHealthy && disease.image && (
                <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 mr-4 bg-gray-100">
                  <img
                    src={disease.image}
                    alt={disease.common_names[0]}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div>
                <p className="font-medium text-gray-900">
                  {isHealthy ? 'Healthy' : disease.common_names[0]}
                </p>
                {!isHealthy && (
                  <>
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">Type:</span> {disease.type}
                    </p>
                    <p className="text-sm mt-1">
                      <span className="font-medium">Severity:</span>
                      <span className={`ml-1 ${getSeverityColor(disease.severity)}`}>
                        {disease.severity}
                      </span>
                    </p>
                  </>
                )}
                {isHealthy && (
                  <p className="text-sm text-gray-600 mt-1">
                    No signs of disease or pest infestation detected in the uploaded image.
                  </p>
                )}

                {!isHealthy && (
                  <button
                    onClick={() => openGoogleSearch(`${disease.common_names[0]} ${crop.common_names[0]} disease treatment`)}
                    className="mt-2 flex items-center text-sm text-blue-600 hover:text-blue-800"
                  >
                    <FaGoogle className="mr-1" />
                    Search on Google
                    <FaExternalLinkAlt className="ml-1" size={10} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Disease Details - Only show if disease is detected */}
      {!isHealthy && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <FaVirus className="mr-2 text-red-500" />
            Disease Information
          </h2>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Description</h3>
            <p className="text-gray-700">{disease.description}</p>

            {disease.wiki_description && (
              <div className="mt-4 text-sm text-gray-600">
                <p>{disease.wiki_description}</p>
                {disease.wiki_url && (
                  <a
                    href={disease.wiki_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 mt-2 inline-block"
                  >
                    Read more on Wikipedia
                  </a>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-3">Symptoms</h3>
              {disease.symptoms && (
                <div className="space-y-3">
                  {Object.entries(disease.symptoms).map(([part, symptom]) => (
                    <div key={part} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <p className="text-sm">
                        <span className="font-medium capitalize">{part}:</span> {symptom}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-3">Spreading Mechanism</h3>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-sm text-gray-700">{disease.spreading}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-3">Treatment & Management</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {disease.treatment && Object.entries(disease.treatment).map(([method, details]) => (
                <div key={method} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h4 className="font-medium text-gray-800 capitalize mb-2">{method}</h4>
                  <p className="text-sm text-gray-700">{details}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Additional Images */}
      {(crop.images?.length > 0 || (!isHealthy && disease.images?.length > 0)) && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <FaCamera className="mr-2 text-green-600" />
            Reference Images
          </h2>

          {crop.images?.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Healthy Crop Images</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {crop.images.slice(0, 4).map((img, index) => (
                  <div key={index} className="rounded-lg overflow-hidden bg-gray-100 aspect-square">
                    <img
                      src={img.url || img}
                      alt={`${crop.common_names[0]} reference ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {!isHealthy && disease.images?.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-3">Disease Reference Images</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {disease.images.slice(0, 4).map((img, index) => (
                  <div key={index} className="rounded-lg overflow-hidden bg-gray-100 aspect-square">
                    <img
                      src={img.url || img}
                      alt={`${disease.common_names[0]} reference ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Taxonomy Information */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <FaInfoCircle className="mr-2 text-blue-600" />
          Scientific Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Crop Taxonomy */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-3">Crop Taxonomy</h3>
            {crop.taxonomy ? (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <table className="w-full text-sm">
                  <tbody>
                    {Object.entries(crop.taxonomy).map(([key, value]) => (
                      <tr key={key} className="border-b border-gray-200 last:border-0">
                        <td className="py-2 font-medium text-gray-700 capitalize">{key}</td>
                        <td className="py-2 text-gray-900">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/*{crop.gbif_id && (
                  <a
                    href={`https://www.gbif.org/species/${crop.gbif_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm mt-3 inline-block"
                  >
                    View on GBIF Database
                  </a>
                )}*/}
              </div>
            ) : (
              <p className="text-gray-700">No detailed taxonomy information available.</p>
            )}
          </div>


        </div>
      </div>
    </div>
  );
};

// Mock data for demonstration purposes
const mockDiagnosisResult = {
  crop: {
    gbif_id: 2879088,
    image: "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1566842600175-97dca3c5ad01?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
    ],
    common_names: ["Tomato", "Tamatar"],
    taxonomy: {
      kingdom: "Plantae",
      phylum: "Tracheophyta",
      class: "Magnoliopsida",
      order: "Solanales",
      family: "Solanaceae",
      genus: "Solanum",
      species: "lycopersicum"
    }
  },
  disease: {
    type: "Fungal",
    common_names: ["Early Blight", "Alternaria Leaf Spot"],
    taxonomy: {
      kingdom: "Fungi",
      phylum: "Ascomycota",
      class: "Dothideomycetes",
      order: "Pleosporales",
      family: "Pleosporaceae",
      genus: "Alternaria",
      species: "solani"
    },
    eppo_code: "ALTESO",
    eppo_regulation_status: {
      status: "Non-quarantine",
      region: "Global"
    },
    gbif_id: 5252223,
    image: "https://images.unsplash.com/photo-1598512752271-33f913a5af13?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1598512752271-33f913a5af13?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1598512752271-33f913a5af13?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
    ],
    wiki_url: "https://en.wikipedia.org/wiki/Alternaria_solani",
    wiki_description: "Alternaria solani is a fungal pathogen that produces a disease in tomato and potato plants called early blight. The pathogen produces distinctive 'bullseye' patterned leaf spots and can also cause stem lesions and fruit rot on tomato and tuber blight on potato.",
    description: "Early blight is one of the most common tomato diseases, occurring nearly every season wherever tomatoes are grown. It affects leaves, fruits and stems and can be severely yield limiting when susceptible cultivars are used and weather is favorable.",
    treatment: {
      biological: "Apply compost tea or Bacillus subtilis-based biological fungicides as a preventative measure. Introduce beneficial microorganisms to the soil to compete with the pathogen.",
      chemical: "Apply copper-based fungicides or approved synthetic fungicides like chlorothalonil, mancozeb, or azoxystrobin according to label instructions. Rotate between different chemical classes to prevent resistance.",
      prevention: "Practice crop rotation with non-solanaceous crops for 2-3 years. Remove and destroy infected plant debris. Use disease-free seeds and transplants. Maintain adequate plant spacing for good air circulation. Water at the base of plants and avoid overhead irrigation."
    },
    symptoms: {
      leaves: "Dark brown to black lesions with concentric rings (target-like or bullseye pattern), yellowing around lesions, older leaves affected first",
      stems: "Dark, sunken cankers may form on stems",
      fruits: "Dark, leathery spots usually at the stem end, often with concentric rings"
    },
    severity: "Medium",
    spreading: "The fungus overwinters on infected plant debris in the soil. Spores are spread by wind, water, insects, and human activity. Warm, humid conditions with temperatures between 24-29°C (75-84°F) favor disease development. Alternating wet and dry periods accelerate disease progression."
  }
};

// Mock data for healthy crop result
const mockHealthyResult = {
  crop: {
    gbif_id: 2879088,
    image: "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1566842600175-97dca3c5ad01?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
    ],
    common_names: ["Tomato", "Tamatar"],
    taxonomy: {
      kingdom: "Plantae",
      phylum: "Tracheophyta",
      class: "Magnoliopsida",
      order: "Solanales",
      family: "Solanaceae",
      genus: "Solanum",
      species: "lycopersicum"
    }
  },
  disease: {
    severity: "None"
  }
};

// Mock history data
const mockHistoryData = [
  {
    id: "1",
    date: "2023-07-15T10:30:00Z",
    cropName: "Tomato",
    diseaseName: "Early Blight",
    severity: "Medium",
    imageUrl: "https://images.unsplash.com/photo-1598512752271-33f913a5af13?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    result: {
      ...mockDiagnosisResult,
      crop: {
        ...mockDiagnosisResult.crop,
        common_names: ["Tomato", "Tamatar"],
        image: "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
      },
      disease: {
        ...mockDiagnosisResult.disease,
        common_names: ["Early Blight", "Alternaria Leaf Spot"],
        severity: "Medium"
      }
    }
  },
  {
    id: "2",
    date: "2023-07-10T14:15:00Z",
    cropName: "Rice",
    diseaseName: "Blast",
    severity: "High",
    imageUrl: "https://images.unsplash.com/photo-1536054953991-2f9aed6c1a8b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    result: {
      ...mockDiagnosisResult,
      crop: {
        ...mockDiagnosisResult.crop,
        common_names: ["Rice", "Chawal"],
        image: "https://images.unsplash.com/photo-1536054953991-2f9aed6c1a8b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
      },
      disease: {
        ...mockDiagnosisResult.disease,
        common_names: ["Rice Blast", "Magnaporthe Blast"],
        severity: "High"
      }
    }
  },
  {
    id: "3",
    date: "2023-07-05T09:45:00Z",
    cropName: "Potato",
    diseaseName: "Healthy",
    severity: "None",
    imageUrl: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    result: {
      ...mockHealthyResult,
      crop: {
        ...mockHealthyResult.crop,
        common_names: ["Potato", "Aloo"],
        image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
      }
    }
  },
  {
    id: "4",
    date: "2023-06-28T16:20:00Z",
    cropName: "Wheat",
    diseaseName: "Leaf Rust",
    severity: "Low",
    imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1c5a1ec21?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    result: {
      ...mockDiagnosisResult,
      crop: {
        ...mockDiagnosisResult.crop,
        common_names: ["Wheat", "Gehun"],
        image: "https://images.unsplash.com/photo-1574323347407-f5e1c5a1ec21?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
      },
      disease: {
        ...mockDiagnosisResult.disease,
        common_names: ["Leaf Rust", "Brown Rust"],
        severity: "Low"
      }
    }
  }
];

export default CropHealthDiagnosis;