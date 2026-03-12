import { supabase } from '../lib/supabase';

export interface Position {
  id?: string;
  portfolio_id?: string;
  ticker: string;
  shares: number;
  avgCost: number;
  currentPrice?: number;
}

export interface Portfolio {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
}

// Get user's default portfolio
export const getDefaultPortfolio = async (): Promise<Portfolio | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('portfolios')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error) {
    console.error('Error fetching portfolio:', error);
    return null;
  }

  return data;
};

// Get all positions for a portfolio
export const getPositions = async (portfolioId: string): Promise<Position[]> => {
  const { data, error } = await supabase
    .from('positions')
    .select('*')
    .eq('portfolio_id', portfolioId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching positions:', error);
    return [];
  }

  return data.map(pos => ({
    id: pos.id,
    portfolio_id: pos.portfolio_id,
    ticker: pos.ticker,
    shares: Number(pos.shares),
    avgCost: Number(pos.avg_cost),
  }));
};

// Add a new position
export const addPosition = async (
  portfolioId: string,
  ticker: string,
  shares: number,
  avgCost: number
): Promise<Position | null> => {
  const { data, error } = await supabase
    .from('positions')
    .insert([
      {
        portfolio_id: portfolioId,
        ticker: ticker.toUpperCase(),
        shares,
        avg_cost: avgCost,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Error adding position:', error);
    return null;
  }

  return {
    id: data.id,
    portfolio_id: data.portfolio_id,
    ticker: data.ticker,
    shares: Number(data.shares),
    avgCost: Number(data.avg_cost),
  };
};

// Update a position
export const updatePosition = async (
  positionId: string,
  shares: number,
  avgCost: number
): Promise<boolean> => {
  const { error } = await supabase
    .from('positions')
    .update({
      shares,
      avg_cost: avgCost,
    })
    .eq('id', positionId);

  if (error) {
    console.error('Error updating position:', error);
    return false;
  }

  return true;
};

// Delete a position
export const deletePosition = async (positionId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('positions')
    .delete()
    .eq('id', positionId);

  if (error) {
    console.error('Error deleting position:', error);
    return false;
  }

  return true;
};