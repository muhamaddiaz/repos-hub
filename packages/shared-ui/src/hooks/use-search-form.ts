import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { searchQuerySchema, type SearchQueryInput } from "../schemas/search.schema";

interface UseSearchFormProps {
  onInputChange?: (query: string) => void;
  onSearch: (query: string) => void;
  error?: string | null;
}

export function useSearchForm({ onInputChange, onSearch, error }: UseSearchFormProps) {
  const form = useForm<SearchQueryInput>({
    resolver: zodResolver(searchQuerySchema),
    mode: "onChange",
    defaultValues: { query: "" },
  });

  const { watch, setValue, setError, clearErrors } = form;
  const query = watch("query");

  useEffect(() => {
    if (onInputChange) {
      onInputChange(query);
    }

    if (error) {
      setError("query", { type: "external", message: error });
    }
    else if (query && form.formState.errors.query?.type === "external") {
      clearErrors("query");
    }
  }, [query, onInputChange, error, setError, clearErrors, form.formState.errors.query?.type]);

  const handleSubmit = (data: SearchQueryInput) => {
    if (data.query.trim()) {
      onSearch(data.query.trim());
    }
  };

  const resetQuery = () => setValue("query", "");

  return {
    ...form,
    query,
    handleSubmit: form.handleSubmit(handleSubmit),
    resetQuery,
    currentError: form.formState.errors.query?.message,
  };
}
