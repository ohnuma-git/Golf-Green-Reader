import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type insertAnalysisSchema } from "@shared/schema";
import { z } from "zod";

// Types derived from schema
type AnalysisResponse = z.infer<typeof api.analyze.list.responses[200]>[number];
type CreateAnalysisInput = z.infer<typeof api.analyze.create.input>;

export function useAnalyses() {
  return useQuery({
    queryKey: [api.analyze.list.path],
    queryFn: async () => {
      const res = await fetch(api.analyze.list.path);
      if (!res.ok) throw new Error("Failed to fetch history");
      return api.analyze.list.responses[200].parse(await res.json());
    },
  });
}

export function useAnalyzeGreen() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateAnalysisInput) => {
      // Input validation before request
      const validated = api.analyze.create.input.parse(data);
      
      const res = await fetch(api.analyze.create.path, {
        method: api.analyze.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });

      if (!res.ok) {
        if (res.status === 400) {
           const err = await res.json();
           throw new Error(err.message || "Invalid image data");
        }
        throw new Error("Analysis failed. Please try again.");
      }

      return api.analyze.create.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.analyze.list.path] });
    },
  });
}
