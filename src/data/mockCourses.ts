export interface Course {
  id: number;
  name: string;
  subtext: string;
  status: 'Published' | 'Ongoing' | 'Draft';
  instructor: string;
  location: string;
  startDate: string;
  endDate:string;
  capacity: string;
}

export const mockCourses: Course[] = [
  {
    id: 1,
    name: 'Introduction to Mathematics',
    subtext: 'course',
    status: 'Published',
    instructor: 'Not Assigned',
    location: 'Online',
    startDate: '1/1/2025',
    endDate: '6/30/2025',
    capacity: '45 / 100',
  },
  {
    id: 2,
    name: 'Advanced Programming',
    subtext: 'course',
    status: 'Ongoing',
    instructor: 'Not Assigned',
    location: 'Hybrid',
    startDate: '2/15/2025',
    endDate: '7/15/2025',
    capacity: '32 / 50',
  },
  {
    id: 3,
    name: 'Molecular Biology',
    subtext: 'course',
    status: 'Draft',
    instructor: 'Not Assigned',
    location: 'On-campus',
    startDate: '3/1/2025',
    endDate: '8/15/2025',
    capacity: '12 / 30',
  },
]; 