import React from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DeleteJob from "./DeleteJob";

interface ListJobProps {
  jobs: any[];
  onEdit: (job: any) => void;
  onDelete: () => void;
}

const ListJob: React.FC<ListJobProps> = ({ jobs, onEdit, onDelete }) => {
  if (!jobs.length) return <p className="text-gray-500">No jobs found.</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {jobs.map((job) => {
        // Convert tags string to array, handle both string and array formats
        const tagsArray = Array.isArray(job.tags) 
          ? job.tags 
          : (job.tags ? job.tags.split(',').map((tag: string) => tag.trim()) : []);

        return (
          <Card key={job.id}>
            <CardHeader>
              <h2 className="text-xl font-bold">{job.title}</h2>
              <p className="text-gray-600">
                {job.company} - {job.location} ({job.job_type})
              </p>
              <p className="text-gray-400 text-sm">
                Posted: {new Date(job.posting_date).toLocaleDateString()}
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {tagsArray.map((tag: string, idx: number) => (
                  <span key={idx} className="text-xs bg-gray-200 px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button size="sm" onClick={() => onEdit(job)}>
                Edit
              </Button>
              <DeleteJob id={job.id} onDeleted={onDelete} />
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};

export default ListJob;