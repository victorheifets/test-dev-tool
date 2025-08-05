export interface RegistrationForm {
  id: string;
  title: string;
  description: string;
  is_active: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
  form_url: string;
  provider_id: string;
}

export interface RegistrationFormCreate {
  title: string;
  description: string;
  is_active?: boolean;
}

export interface RegistrationFormUpdate {
  title?: string;
  description?: string;
  is_active?: boolean;
}

export interface RegistrationFormPublishRequest {
  title: string;
  description: string;
}

export interface RegistrationFormResponse {
  success: boolean;
  message: string;
  data: RegistrationForm;
}

export interface RegistrationFormListResponse {
  success: boolean;
  message: string;
  data: RegistrationForm[];
  total: number;
}

export interface RegistrationFormPublishResponse {
  success: boolean;
  message: string;
  data: {
    form_id: string;
    title: string;
    description: string;
    published_at?: string;
  };
}