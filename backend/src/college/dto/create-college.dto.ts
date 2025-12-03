export class CreateCollegeDto {
  status: number;
  college_name: string;
  email: string;
  college_type: string;
  country: string;
  state: string;
  city: string;
  pincode: string;
  contact_person_mobile: string;
  contact_person_email: string;
  website?: string;
  contact_person_name?: string;
  about?: string;
  address_line?: string;
  cro_id?: string;
}
