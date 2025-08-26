import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface FilterSortProps {
  onFilterChange: (filters: any) => void;
  onSortChange: (sort: string) => void;
}

const FilterSortJob: React.FC<FilterSortProps> = ({ onFilterChange, onSortChange }) => {
  const [filters, setFilters] = useState({ title: "", jobType: "all", location: "", tags: "" });
  const [sort, setSort] = useState("none");
  const [showFilters, setShowFilters] = useState(false); // toggle for mobile

  const handleChange = (name: string, value: string) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    onFilterChange(filters);
    onSortChange(sort === "none" ? "" : sort);
  };

  const handleSort = (value: string) => {
    setSort(value);
    onSortChange(value === "none" ? "" : value);
  };

  const resetFilters = () => {
    const empty = { title: "", jobType: "all", location: "", tags: "" };
    setFilters(empty);
    setSort("none");
    onFilterChange(empty);
    onSortChange("");
  };

  return (
    <div className="mb-4">
      {/* Mobile toggle button */}
      <div className="md:hidden mb-2">
        <Button onClick={() => setShowFilters(prev => !prev)}>
          {showFilters ? "Hide Filters" : "Show Filters"}
        </Button>
      </div>

      {/* Filters container */}
      <div
        className={`flex flex-col md:flex-row gap-2 items-center transition-all duration-300 ${
          showFilters ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0 overflow-hidden md:max-h-full md:opacity-100"
        }`}
      >
        <Input
          name="title"
          placeholder="Search by title"
          value={filters.title}
          onChange={(e) => handleChange("title", e.target.value)}
        />

        <Select
          value={filters.jobType}
          onValueChange={(val) => handleChange("jobType", val)}
        >
          <SelectTrigger className="w-[180px] w-full">
            <SelectValue placeholder="Select Job Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Job Types</SelectItem>
            <SelectItem value="Full-time">Full-time</SelectItem>
            <SelectItem value="Part-time">Part-time</SelectItem>
            <SelectItem value="Internship">Internship</SelectItem>
            <SelectItem value="Contract">Contract</SelectItem>
          </SelectContent>
        </Select>

        <Input
          name="location"
          placeholder="Location"
          value={filters.location}
          onChange={(e) => handleChange("location", e.target.value)}
        />

        <Input
          name="tags"
          placeholder="Tags"
          value={filters.tags}
          onChange={(e) => handleChange("tags", e.target.value)}
        />

        <Select value={sort} onValueChange={handleSort}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Sort By</SelectItem>
            <SelectItem value="date_desc">Date Posted: Newest First</SelectItem>
            <SelectItem value="date_asc">Date Posted: Oldest First</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={applyFilters} className="bg-blue-500 text-white hover:bg-blue-600 cursor-pointer">
          Search
        </Button>

        <Button variant="secondary" onClick={resetFilters} className="bg-gray-500 text-white hover:bg-gray-600 cursor-pointer">
          Reset
        </Button>
      </div>
    </div>
  );
};

export default FilterSortJob;
