// Lead types for the application

export type LeadSource = 'website' | 'referral' | 'social';
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'converted';

export interface Lead {
  id: string;
  provider_id: string;
  first_name: string;
  last_name: string;
  name?: string; // Computed field for display
  email: string;
  phone: string;
  source: LeadSource;
  status: LeadStatus;
  created_at: string;
  updated_at?: string;
  notes?: string;
}

export interface LeadCreate {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  source: LeadSource;
  status: LeadStatus;
  notes?: string;
}

export interface LeadUpdate extends Partial<LeadCreate> {} 