"use client"

import React, { useCallback, useEffect, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Filter, Sliders, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { CarFilterControls } from "./filter-controls"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export const CarFilters = ({ filters }) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Get current filter values from searchParams
  const currentBrand = searchParams.get("brand") || ""
  const currentBodyType = searchParams.get("bodyType") || ""
  const currentFuelType = searchParams.get("fuelType") || ""
  const currentTransmission = searchParams.get("transmission") || ""
  const currentMinPrice = searchParams.get("minPrice")
    ? parseInt(searchParams.get("minPrice"))
    : filters.priceRange.min
  const currentMaxPrice = searchParams.get("maxPrice")
    ? parseInt(searchParams.get("maxPrice"))
    : filters.priceRange.max
  const currentSortBy = searchParams.get("sortBy") || "newest"

  // Local state for filters
  const [brand, setBrand] = useState(currentBrand)
  const [bodyType, setBodyType] = useState(currentBodyType)
  const [fuelType, setFuelType] = useState(currentFuelType)
  const [transmission, setTransmission] = useState(currentTransmission)
  const [priceRange, setPriceRange] = useState([
    currentMinPrice,
    currentMaxPrice,
  ])
  const [sortBy, setSortBy] = useState(currentSortBy)
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  // Update local state when URL parameters change
  useEffect(() => {
    setBrand(currentBrand)
    setBodyType(currentBodyType)
    setFuelType(currentFuelType)
    setTransmission(currentTransmission)
    setPriceRange([currentMinPrice, currentMaxPrice])
    setSortBy(currentSortBy)
  }, [
    currentBrand,
    currentBodyType,
    currentFuelType,
    currentTransmission,
    currentMinPrice,
    currentMaxPrice,
    currentSortBy,
  ])
  useEffect(() => {
    // Apply filters immediately when sort changes
    setTimeout(() => applyFilters(), 0)
  }, [sortBy])

  // Count active filters
  const activeFilterCount = [
    brand,
    bodyType,
    fuelType,
    transmission,
    currentMinPrice > filters.priceRange.min ||
      currentMaxPrice < filters.priceRange.max,
  ].filter(Boolean).length

  // Update URL when filters change
  const applyFilters = useCallback(() => {
    const params = new URLSearchParams()

    if (brand) params.set("brand", brand)
    if (bodyType) params.set("bodyType", bodyType)
    if (fuelType) params.set("fuelType", fuelType)
    if (transmission) params.set("transmission", transmission)
    if (priceRange[0] > filters.priceRange.min)
      params.set("minPrice", priceRange[0].toString())
    if (priceRange[1] < filters.priceRange.max)
      params.set("maxPrice", priceRange[1].toString())
    if (sortBy !== "newest") params.set("sortBy", sortBy)

    // Preserve search and page params if they exist
    const search = searchParams.get("search")
    const page = searchParams.get("page")
    if (search) params.set("search", search)
    if (page && page !== "1") params.set("page", page)

    const query = params.toString()
    const url = query ? `${pathname}?${query}` : pathname

    router.push(url)
    setIsSheetOpen(false)
  }, [
    brand,
    sortBy,
    bodyType,
    fuelType,
    transmission,
    priceRange,
    pathname,
    searchParams,
    filters.priceRange.min,
    filters.priceRange.max,
  ])

  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    switch (filterName) {
      case "brand":
        setBrand(value)
        break
      case "bodyType":
        setBodyType(value)
        break
      case "fuelType":
        setFuelType(value)
        break
      case "transmission":
        setTransmission(value)
        break
      case "priceRange":
        setPriceRange(value)
        break
    }
  }

  // Handle clearing specific filter
  const handleClearFilter = (filterName) => {
    handleFilterChange(filterName, "")
  }

  // Clear all filters
  const clearFilters = () => {
    setBrand("")
    setBodyType("")
    setFuelType("")
    setTransmission("")
    setPriceRange([filters.priceRange.min, filters.priceRange.max])
    setSortBy("newest")

    // Keep search term if exists
    const params = new URLSearchParams()
    const search = searchParams.get("search")
    if (search) params.set("search", search)

    const query = params.toString()
    const url = query ? `${pathname}?${query}` : pathname

    router.push(url)
    setIsSheetOpen(false)
  }

  // Current filters object for the controls component
  const currentFilters = {
    brand,
    bodyType,
    fuelType,
    transmission,
    priceRange,
    priceRangeMin: filters.priceRange.min,
    priceRangeMax: filters.priceRange.max,
  }

  return (
    <div className="flex lg:flex-col justify-between gap-4">
      {/* mobile screen filters  */}

      <div className="lg:hidden mb-4">
        <div className="flex items-center">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filters
                {activeFilterCount > 0 && (
                  <Badge className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-full sm:max-w-md overflow-y-auto"
            >
              <SheetHeader>
                <SheetTitle>Filters </SheetTitle>
              </SheetHeader>

              <div className="p-4">
                <CarFilterControls
                  filters={filters}
                  currentFilters={currentFilters}
                  onFilterChange={handleFilterChange}
                  onClearFilter={handleClearFilter}
                />
              </div>

              <SheetFooter className="sm:justify-between flex-row pt-2 border-t space-x-4 mt-auto">
                <Button
                  type="button"
                  variant="outline"
                  onClick={clearFilters}
                  className="flex-1"
                >
                  Reset
                </Button>
                <Button type="button" onClick={applyFilters} className="flex-1">
                  Show Results
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      {/* sort Selection  */}
      <Select
        value={sortBy}
        onValueChange={(value) => {
          setSortBy(value)
        }}
      >
        <SelectTrigger className="w-[180px] lg:w-full">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          {[
            { value: "newest", label: "Newest First" },
            { value: "priceAsc", label: "Price: Low to High" },
            { value: "priceDesc", label: "Price: High to Low" },
          ].map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Desktop filters  */}
      <div className="hidden lg:block sticky top-24">
        <div className="border rounded-lg overflow-hidden bg-white">
          <div className="p-4  border-b bg-gray-50 flex justify-between items-center">
            <h3 className="font-medium flex items-center">
              <Sliders className="h-4 w-4 mr-2" />
              Filters
            </h3>

            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-sm text-gray-600"
                onClick={clearFilters}
              >
                <X className="h-3  w-3 mr-1" />
                Clear All
              </Button>
            )}
          </div>

          <div className="p-4">
            <CarFilterControls
              filters={filters}
              currentFilters={currentFilters}
              onFilterChange={handleFilterChange}
              onClearFilter={handleClearFilter}
            />
          </div>

          <div className="px-4 py-4 border-t">
            <Button onClick={applyFilters} className="w-full">
              Apply Filters
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
