import { useMemo } from 'react';
import { trpc } from '@/providers/trpc';

export interface SettingItem {
  id: number;
  key: string;
  value: string;
  group_name: string;
  label_ar: string;
  label_en: string;
  input_type: string;
  options: string[] | null;
  sort_order: number;
}

export function useStoreSettings() {
  const utils = trpc.useUtils();
  const { data, isLoading, error } = trpc.listSettings.useQuery();
  const updateMutation = trpc.updateSetting.useMutation({
    onSuccess: () => utils.listSettings.invalidate(),
  });

  const settings = useMemo((): SettingItem[] => {
    if (!data || !Array.isArray(data)) return [];
    return data.map((s: any) => ({
      id: s.id,
      key: s.key,
      value: s.value ?? '',
      group_name: s.group_name,
      label_ar: s.label_ar,
      label_en: s.label_en,
      input_type: s.input_type,
      options: s.options,
      sort_order: s.sort_order,
    }));
  }, [data]);

  const byGroup = useMemo(() => {
    const grouped: Record<string, SettingItem[]> = {};
    for (const s of settings) {
      if (!grouped[s.group_name]) grouped[s.group_name] = [];
      grouped[s.group_name].push(s);
    }
    return grouped;
  }, [settings]);

  const get = (key: string): string => {
    return settings.find((s) => s.key === key)?.value ?? '';
  };

  const update = (key: string, value: string) => {
    updateMutation.mutate({ key, value });
  };

  return {
    settings,
    byGroup,
    get,
    update,
    isLoading,
    isUpdating: updateMutation.isPending,
    error: error?.message || null,
  };
}
