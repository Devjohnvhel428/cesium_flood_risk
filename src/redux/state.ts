// q@ts-nocheck
/* qeslint-disable */
import { User } from "@supabase/supabase-js";

export interface AppState {
    loading: boolean;
    user: User | undefined;
    error: string | null;
}

export interface SettingsState {
    visibleCloud: boolean;
}
