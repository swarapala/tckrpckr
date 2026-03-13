import { supabase } from '../lib/supabase';

export interface Watchlist {
  id: string;
  user_id: string;
  name: string;
  tickers: string[];
  created_at: string;
}

// Get user's watchlists
export const getWatchlists = async (): Promise<Watchlist[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('watchlists')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching watchlists:', error);
    return [];
  }

  return data || [];
};

// Get default watchlist (or create if doesn't exist)
export const getDefaultWatchlist = async (): Promise<Watchlist | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Try to get existing watchlist
  const { data, error } = await supabase
    .from('watchlists')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error && error.code === 'PGRST116') {
    // No watchlist exists, create one
    const { data: newWatchlist, error: createError } = await supabase
      .from('watchlists')
      .insert([
        {
          user_id: user.id,
          name: 'My Watchlist',
          tickers: [],
        },
      ])
      .select()
      .single();

    if (createError) {
      console.error('Error creating watchlist:', createError);
      return null;
    }

    return newWatchlist;
  }

  if (error) {
    console.error('Error fetching watchlist:', error);
    return null;
  }

  return data;
};

// Add ticker to watchlist
export const addToWatchlist = async (
  watchlistId: string,
  ticker: string
): Promise<boolean> => {
  try {
    // Get current watchlist
    const { data: watchlist, error: fetchError } = await supabase
      .from('watchlists')
      .select('tickers')
      .eq('id', watchlistId)
      .single();

    if (fetchError) {
      console.error('Error fetching watchlist:', fetchError);
      return false;
    }

    // Check if ticker already exists
    const currentTickers = watchlist.tickers || [];
    if (currentTickers.includes(ticker.toUpperCase())) {
      return true; // Already in watchlist
    }

    // Add ticker
    const updatedTickers = [...currentTickers, ticker.toUpperCase()];

    const { error: updateError } = await supabase
      .from('watchlists')
      .update({ tickers: updatedTickers })
      .eq('id', watchlistId);

    if (updateError) {
      console.error('Error updating watchlist:', updateError);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    return false;
  }
};

// Remove ticker from watchlist
export const removeFromWatchlist = async (
  watchlistId: string,
  ticker: string
): Promise<boolean> => {
  try {
    // Get current watchlist
    const { data: watchlist, error: fetchError } = await supabase
      .from('watchlists')
      .select('tickers')
      .eq('id', watchlistId)
      .single();

    if (fetchError) {
      console.error('Error fetching watchlist:', fetchError);
      return false;
    }

    // Remove ticker
    const currentTickers = watchlist.tickers || [];
    const updatedTickers = currentTickers.filter(
      (t: string) => t !== ticker.toUpperCase()
    );

    const { error: updateError } = await supabase
      .from('watchlists')
      .update({ tickers: updatedTickers })
      .eq('id', watchlistId);

    if (updateError) {
      console.error('Error updating watchlist:', updateError);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error removing from watchlist:', error);
    return false;
  }
};