export class CreateStudentDto {
  student_name: string;
  title: string;
  gender: string;
  adhar_no?: string;
  email: string;
  mobile: string;
  college_name: string;
  college_id: string;
  university: string;
  dateofbirth: string;
  state: string;
  city: string;
  currentlocation: string;
  pincode: string;
  about?: string;
  active: boolean;
  skills?: string[];
  profile_image?: string;
  resume_url?: string;
}
