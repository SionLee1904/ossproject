import { supabase } from "../lib/supabaseClient";

// RLS가 있어서 기본적으로 "내 것만" 보이지만,
// 안전하게 user_id eq를 같이 걸어도 OK.
export async function listFavorites(userId) {
  const { data, error } = await supabase
    .from("favorites")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function createFavorite(payload) {
  const { data, error } = await supabase
    .from("favorites")
    .insert(payload)
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function updateFavorite(id, patch) {
  const { data, error } = await supabase
    .from("favorites")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function deleteFavorite(id) {
  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("id", id);

  if (error) throw error;
  return true;
}
