import { Material } from "@/domain/model/material/Material";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { MaterialService } from "@/domain/model/material/MaterialService";
import { getMaterialAPIClient } from "@/external-interfaces/api";

export function useQueryMaterial({ id }: { id: Material["id"] }) {
  const materialService = new MaterialService(getMaterialAPIClient());

  return useSuspenseQuery({
    queryKey: ["material", id],
    queryFn: () => {
      return materialService.getMaterial(id);
    },
  });
}

export function useQueryMaterials() {
  const materialService = new MaterialService(getMaterialAPIClient());

  return useSuspenseQuery({
    queryKey: ["materials"],
    queryFn: () => {
      return materialService.getMaterials();
    },
  });
}

function useRefetchMaterials() {
  const queryClient = useQueryClient();

  return () => {
    return queryClient.refetchQueries({ queryKey: ["materials"] });
  };
}

function useRefetchMaterial() {
  const queryClient = useQueryClient();

  return (id: string) => {
    return queryClient.refetchQueries({ queryKey: ["material", id] });
  };
}

export function useCreateMaterial() {
  const materialService = new MaterialService(getMaterialAPIClient());
  const refetchMaterials = useRefetchMaterials();
  const refetchMaterial = useRefetchMaterial();

  return useMutation({
    mutationFn: (
      ...params: Parameters<typeof materialService.createMaterial>
    ) => materialService.createMaterial(...params),
    onSuccess: ({ id }) => {
      return Promise.all([refetchMaterials(), refetchMaterial(id)]);
    },
  });
}

export function useUpdateMaterial() {
  const materialService = new MaterialService(getMaterialAPIClient());
  const refetchMaterials = useRefetchMaterials();
  const refetchMaterial = useRefetchMaterial();

  return useMutation({
    mutationFn: (
      ...params: Parameters<typeof materialService.updateMaterial>
    ) => materialService.updateMaterial(...params),
    onSuccess: ({ id }) => {
      return Promise.all([refetchMaterials(), refetchMaterial(id)]);
    },
  });
}

export function useDeleteMaterial() {
  const materialService = new MaterialService(getMaterialAPIClient());
  const refetchMaterials = useRefetchMaterials();

  return useMutation({
    mutationFn: (
      ...params: Parameters<typeof materialService.deleteMaterial>
    ) => materialService.deleteMaterial(...params),
    onSuccess: () => {
      return Promise.all([refetchMaterials()]);
    },
  });
}
