"use client"

import { useEffect, useState } from "react"
import { Input } from "./ui/input"
import { Camera, Upload } from "lucide-react"
import { Button } from "./ui/button"
import { useDropzone } from "react-dropzone"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import useFetch from "@/hooks/use-fetch"
import { processImageSearch } from "@/actions/home"

const HomeSearch = () => {
  const router = useRouter()
  const [searchCar, setSearchCar] = useState("")
  const [isImageSearchActive, setIsImageSearchActive] = useState(false)
  const [imagePreview, setImagePreview] = useState("")
  const [searchImage, setSearchImage] = useState(null)
  const [isUploading, setIsUploading] = useState(false)

  const {
    loading: isProcessing,
    fn: processImageFn,
    data: processResult,
    error: processError,
  } = useFetch(processImageSearch)

  // function to handle input search

  const handleTextSubmit = (e) => {
    e.preventDefault()
    if (!searchCar.trim()) {
      toast.error("Please enter a car name")
      return
    }
    router.push(`/cars?search=${encodeURIComponent(searchCar)}`)
  }

  // function to handle drag & drop image search

  const handleImageSearch = async (e) => {
    e.preventDefault()
    if (!searchImage) {
      toast.error("Please upload an image first")
      return
    }
    //add ai logic to search car with image

    await processImageFn(searchImage)
  }

  // Handle process result and errors with useEffect
  useEffect(() => {
    if (processResult?.success) {
      const params = new URLSearchParams()

      // Add extracted params to the search
      if (processResult.data.brand)
        params.set("brand", processResult.data.brand)
      if (processResult.data.bodyType)
        params.set("bodyType", processResult.data.bodyType)
      if (processResult.data.color)
        params.set("color", processResult.data.color)

      // Redirect to search results
      router.push(`/cars?${params.toString()}`)
    }
  }, [processResult, router])

  useEffect(() => {
    if (processError) {
      toast.error(
        "Failed to analyze image: " + (processError.message || "Unknown error")
      )
    }
  }, [processError])

  // Handle image upload with react-dropzone
  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0]
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB")
      return
    }
    setIsUploading(true)
    setSearchImage(file)

    const reader = new FileReader()

    reader.onloadend = () => {
      setImagePreview(reader.result)
      setIsUploading(false)
      toast.success("Image uploaded successfully")
    }

    reader.onerror = () => {
      setIsUploading(false)
      toast.error("Failed to read tha image")
    }

    reader.readAsDataURL(file)
  }

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: {
        "image/*": [".jpeg ", ".jpg", ".png"],
      },
      maxFiles: 1,
    })

  return (
    <div>
      <form onSubmit={handleTextSubmit}>
        <div className="relative flex items-center">
          <Input
            type="text"
            placeholder="Enter brand, model or use our AI Image Search..."
            value={searchCar}
            onChange={(e) => setSearchCar(e.target.value)}
            className="pl-10 pr-12 py-6 w-full rounded-full border-gray-50 bg-white/90 backdrop-blur-sm"
          />

          <div className="absolute right-[100px]">
            <Camera
              size={35}
              onClick={() => setIsImageSearchActive(!isImageSearchActive)}
              className="cursor-pointer rounded-full  p-1.5"
              style={{
                background: isImageSearchActive ? "black" : "",
                color: isImageSearchActive ? "white" : "",
              }}
            />
          </div>

          <Button type="submit" className="absolute right-2 rounded-full ">
            Search
          </Button>
        </div>
      </form>

      {/* Drag  drop functionality */}

      {isImageSearchActive && (
        <div className="mt-4">
          <form onSubmit={handleImageSearch} className=" space-y-4">
            <div className="border-2 border-dashed border-gray-400 rounded-3xl p-6">
              {imagePreview ? (
                <div className="flex flex-col items-center">
                  <img
                    src={imagePreview}
                    alt="Car Preview"
                    className="h-40 object-contain mb-4"
                  />
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchImage(null)
                      setImagePreview("")
                      toast.info("Image Removed")
                    }}
                  >
                    Remove Image
                  </Button>
                </div>
              ) : (
                <div {...getRootProps()} className="cursor-pointer ">
                  <input {...getInputProps()} />
                  <div className="flex flex-col items-center ">
                    <Upload className="h-12 w-12 text-gray-400 mb-2" />
                    <p className="to-gray-500 mb-2">
                      {isDragActive && !isDragReject
                        ? "Drop the file here to upload"
                        : "Drag & drop a car image or click to select"}
                    </p>
                    {isDragReject && (
                      <p className="text-red-500 mb-2">Invalid image type</p>
                    )}

                    <p className="text-gray-400 text-sm">
                      Supports : JPEG , JPG , PNG (max 5MB)
                    </p>
                  </div>
                </div>
              )}
            </div>
            {imagePreview && (
              <Button
                type="submit"
                disabled={isUploading || isProcessing}
                className="w-full"
              >
                {isUploading
                  ? "Uploading..."
                  : isProcessing
                  ? "Analyzing Image..."
                  : "Search with this image"}
              </Button>
            )}
          </form>
        </div>
      )}
    </div>
  )
}

export default HomeSearch
