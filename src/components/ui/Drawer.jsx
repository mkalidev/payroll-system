import React, { useRef, useState } from "react";
import { X, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useCreateWorkspace } from "../hooks/useWorkspace";

const Drawer = ({ setIsOpen }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const { register, handleSubmit, watch } = useForm();
  const { createWorkspaceFn, isPending: isCreatingWorkspace } =
    useCreateWorkspace();

  const MAX_SIZE_MB = 3;
  const value = watch("monthlyRevenue");

  // compute the percent along the track
  const min = 0,
    max = 1000000;
  const percent = ((value - min) / (max - min)) * 100;

  const handleUploadClick = () => {
    setError("");
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type - reject SVG and only allow JPG, JPEG, PNG, GIF
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    const fileType = file.type.toLowerCase();

    if (!allowedTypes.includes(fileType)) {
      setError(
        "Only JPG, JPEG, PNG, and GIF files are allowed. SVG files are not supported."
      );
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    // Additional check using file extension as backup
    const fileName = file.name.toLowerCase();
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif"];
    const hasValidExtension = allowedExtensions.some((ext) =>
      fileName.endsWith(ext)
    );

    if (!hasValidExtension) {
      setError(
        "Invalid file format. Please upload JPG, JPEG, PNG, or GIF files only."
      );
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    const fileSizeInMB = file.size / (1024 * 1024);

    if (fileSizeInMB > MAX_SIZE_MB) {
      setError("File size exceeds 3MB. Please upload a smaller image.");
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageSrc(reader.result);
      setError("");
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setImageFile(null);
    setImageSrc(null);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = (data) => {
    // Create FormData object
    const formData = new FormData();

    // Append all form fields to FormData
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("description", data.description);
    formData.append("monthlyRevenue", data.monthlyRevenue);
    formData.append("employeeCount", data.employeeCount);

    // Append the image file if it exists
    if (imageFile) {
      formData.append("logo", imageFile);
    }

    createWorkspaceFn(formData, {
      onSuccess: () => {
        setIsOpen(false);
        setImageSrc(null);
        setImageFile(null);
        setError("");
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex h-screen">
      {/* Backdrop */}
      <div
        className="flex-1 bg-c-bg/20 backdrop-blur-xs bg-opacity-50"
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer */}
      <div className="w-full max-w-md bg-white h-screen overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Create new workspace
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div div className="space-y-6 pl-0">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block mb-4">
                  Workspace logo
                </label>
                <div className="flex items-end space-x-4 justify-between">
                  <div className="h-24 w-24 rounded-lg border border-dashed overflow-hidden relative">
                    {imageSrc ? (
                      <img
                        src={imageSrc}
                        alt="avatar"
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="flex-1">
                    <button
                      className="text-c-color hover:text-c-color/50 font-medium text-sm"
                      onClick={handleUploadClick}
                    >
                      Upload
                    </button>
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      JPG, GIF or PNG. 2MB Max.
                    </p>
                    {error && (
                      <p className="text-xs text-red-500 mt-1">{error}</p>
                    )}
                  </div>
                </div>
                {imageSrc && (
                  <button
                    type="button"
                    onClick={handleRemove}
                    className="p-2 flex gap-2 items-center text-sm text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-gray-400" />
                    Remove
                  </button>
                )}
              </div>
              <div className="space-y-3">
                <div className="space-y-2 w-full">
                  <label className="text-sm font-medium text-gray-700 block">
                    Workspace name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter workspace name"
                    {...register("name", { required: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-c-color focus:border-transparent"
                  />
                </div>
                <div className="space-y-2 w-full">
                  <label className="text-sm font-medium text-gray-700 block">
                    Workspace email
                  </label>
                  <input
                    type="email"
                    placeholder="Enter workspace email"
                    {...register("email", { required: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-c-color focus:border-transparent"
                  />
                </div>
                <div className="space-y-2 w-full">
                  <label className="text-sm font-medium text-gray-700 block">
                    Workspace description
                  </label>
                  <textarea
                    name=""
                    id=""
                    rows="3"
                    placeholder="Enter workspace description"
                    {...register("description", { required: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-c-color focus:border-transparent"
                  ></textarea>
                </div>
                <div className="space-y-2 relative w-full">
                  <label className="text-sm font-medium text-gray-700 block">
                    Monthly revenue
                  </label>
                  <input
                    type="range"
                    min={min}
                    max={max}
                    step={1000}
                    {...register("monthlyRevenue", { valueAsNumber: true })}
                    className="
            w-full
            h-2
            bg-gray-200
            rounded
            appearance-none
            focus:outline-none
            focus:ring-2 focus:ring-c-color
            /* thumb */
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-4
            [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:bg-c-color
            [&::-webkit-slider-thumb]:rounded-full
            [&::-moz-range-thumb]:w-4
            [&::-moz-range-thumb]:h-4
            [&::-moz-range-thumb]:bg-c-color
            [&::-moz-range-thumb]:rounded-full
          "
                  />
                  <div
                    style={{ left: `${percent}%` }}
                    className="w-fit bg-white border border-gray-300 rounded px-2 py-1 text-sm shadow"
                  >
                    ${value}
                  </div>
                </div>
                <div className="space-y-2 w-full">
                  <label className="text-sm font-medium text-gray-700 block">
                    Number of employees
                  </label>
                  <select
                    name=""
                    id=""
                    defaultValue=""
                    {...register("employeeCount", { required: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-c-color focus:border-transparent"
                  >
                    <option value="" disabled>
                      Select number of employees
                    </option>
                    <option value="1-10">1-10</option>
                    <option value="11-50">11-50</option>
                    <option value="51-100">51-100</option>
                    <option value="101-200">101-200</option>
                    <option value="201-500">201-500</option>
                    <option value="501+">501+</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              className="flex-1 py-4 px-6 bg-c-color text-white cursor-pointer rounded-lg text-sm font-medium hover:bg-c-bg transition-colors"
              onClick={handleSubmit(onSubmit)}
            >
              {isCreatingWorkspace ? "Creating..." : "Create Workspace"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Drawer;
