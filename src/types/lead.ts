// Lead types for the application

export type LeadSource = 'website' | 'referral' | 'social';
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'converted';

export interface Lead {
  id: string;
  provider_id: string;
  name: string;
  email: string;
  phone: string;
  source: LeadSource;
  status: LeadStatus;
  created_at: string;
  updated_at?: string;
}

export interface LeadCreate {
  name: string;
  email: string;
  phone: string;
  source: LeadSource;
  status: LeadStatus;
}

export interface LeadUpdate extends Partial<LeadCreate> {} 