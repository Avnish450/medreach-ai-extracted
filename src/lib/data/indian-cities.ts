export interface IndianCity {
  id: string;
  name: string;
  state: string;
  region: 'North' | 'South' | 'West' | 'East' | 'Central' | 'Northeast';
  isPopular?: boolean;
  lat: number;
  lng: number;
}

export const POPULAR_INDIAN_CITIES = [
  'All India',
  'New Delhi',
  'Mumbai',
  'Bengaluru',
  'Chennai',
  'Kolkata',
  'Hyderabad',
  'Pune',
  'Ahmedabad',
  'Jaipur',
  'Lucknow',
  'Chandigarh',
  'Kochi',
  'Patna',
  'Indore',
  'Bhopal',
  'Bhubaneswar',
  'Visakhapatnam',
  'Guwahati',
  'Surat',
  'Nagpur',
  'Varanasi',
  'Amritsar',
  'Dehradun',
  'Coimbatore',
  'Goa',
  'Ranchi',
  'Gurugram',
  'Noida'
];

export const INDIAN_CITIES: IndianCity[] = [
  { id: 'delhi', name: 'New Delhi', state: 'Delhi NCR', region: 'North', isPopular: true, lat: 28.6139, lng: 77.2090 },
  { id: 'gurugram', name: 'Gurugram', state: 'Haryana (NCR)', region: 'North', isPopular: true, lat: 28.4595, lng: 77.0266 },
  { id: 'noida', name: 'Noida', state: 'Uttar Pradesh (NCR)', region: 'North', isPopular: true, lat: 28.5355, lng: 77.3910 },
  { id: 'mumbai', name: 'Mumbai', state: 'Maharashtra', region: 'West', isPopular: true, lat: 19.0760, lng: 72.8777 },
  { id: 'pune', name: 'Pune', state: 'Maharashtra', region: 'West', isPopular: true, lat: 18.5204, lng: 73.8567 },
  { id: 'nagpur', name: 'Nagpur', state: 'Maharashtra', region: 'West', isPopular: true, lat: 21.1458, lng: 79.0882 },
  { id: 'bengaluru', name: 'Bengaluru', state: 'Karnataka', region: 'South', isPopular: true, lat: 12.9716, lng: 77.5946 },
  { id: 'mysuru', name: 'Mysuru', state: 'Karnataka', region: 'South', isPopular: false, lat: 12.2958, lng: 76.6394 },
  { id: 'mangalore', name: 'Mangalore', state: 'Karnataka', region: 'South', isPopular: false, lat: 12.9141, lng: 74.8560 },
  { id: 'chennai', name: 'Chennai', state: 'Tamil Nadu', region: 'South', isPopular: true, lat: 13.0827, lng: 80.2707 },
  { id: 'coimbatore', name: 'Coimbatore', state: 'Tamil Nadu', region: 'South', isPopular: true, lat: 11.0168, lng: 76.9558 },
  { id: 'madurai', name: 'Madurai', state: 'Tamil Nadu', region: 'South', isPopular: false, lat: 9.9252, lng: 78.1198 },
  { id: 'hyderabad', name: 'Hyderabad', state: 'Telangana', region: 'South', isPopular: true, lat: 17.3850, lng: 78.4867 },
  { id: 'kolkata', name: 'Kolkata', state: 'West Bengal', region: 'East', isPopular: true, lat: 22.5726, lng: 88.3639 },
  { id: 'ahmedabad', name: 'Ahmedabad', state: 'Gujarat', region: 'West', isPopular: true, lat: 23.0225, lng: 72.5714 },
  { id: 'surat', name: 'Surat', state: 'Gujarat', region: 'West', isPopular: true, lat: 21.1702, lng: 72.8311 },
  { id: 'vadodara', name: 'Vadodara', state: 'Gujarat', region: 'West', isPopular: false, lat: 22.3072, lng: 73.1812 },
  { id: 'jaipur', name: 'Jaipur', state: 'Rajasthan', region: 'North', isPopular: true, lat: 26.9124, lng: 75.7873 },
  { id: 'jodhpur', name: 'Jodhpur', state: 'Rajasthan', region: 'North', isPopular: false, lat: 26.2389, lng: 73.0243 },
  { id: 'lucknow', name: 'Lucknow', state: 'Uttar Pradesh', region: 'North', isPopular: true, lat: 26.8467, lng: 80.9462 },
  { id: 'varanasi', name: 'Varanasi', state: 'Uttar Pradesh', region: 'North', isPopular: true, lat: 25.3176, lng: 82.9739 },
  { id: 'kanpur', name: 'Kanpur', state: 'Uttar Pradesh', region: 'North', isPopular: false, lat: 26.4499, lng: 80.3319 },
  { id: 'agra', name: 'Agra', state: 'Uttar Pradesh', region: 'North', isPopular: false, lat: 27.1767, lng: 78.0081 },
  { id: 'chandigarh', name: 'Chandigarh', state: 'Punjab / Haryana', region: 'North', isPopular: true, lat: 30.7333, lng: 76.7794 },
  { id: 'amritsar', name: 'Amritsar', state: 'Punjab', region: 'North', isPopular: true, lat: 31.6340, lng: 74.8723 },
  { id: 'ludhiana', name: 'Ludhiana', state: 'Punjab', region: 'North', isPopular: false, lat: 30.9010, lng: 75.8573 },
  { id: 'kochi', name: 'Kochi', state: 'Kerala', region: 'South', isPopular: true, lat: 9.9312, lng: 76.2673 },
  { id: 'thiruvananthapuram', name: 'Thiruvananthapuram', state: 'Kerala', region: 'South', isPopular: false, lat: 8.5241, lng: 76.9366 },
  { id: 'indore', name: 'Indore', state: 'Madhya Pradesh', region: 'Central', isPopular: true, lat: 22.7196, lng: 75.8577 },
  { id: 'bhopal', name: 'Bhopal', state: 'Madhya Pradesh', region: 'Central', isPopular: true, lat: 23.2599, lng: 77.4126 },
  { id: 'patna', name: 'Patna', state: 'Bihar', region: 'East', isPopular: true, lat: 25.5941, lng: 85.1376 },
  { id: 'bhubaneswar', name: 'Bhubaneswar', state: 'Odisha', region: 'East', isPopular: true, lat: 20.2961, lng: 85.8245 },
  { id: 'visakhapatnam', name: 'Visakhapatnam', state: 'Andhra Pradesh', region: 'South', isPopular: true, lat: 17.6868, lng: 83.2185 },
  { id: 'vijayawada', name: 'Vijayawada', state: 'Andhra Pradesh', region: 'South', isPopular: false, lat: 16.5062, lng: 80.6480 },
  { id: 'guwahati', name: 'Guwahati', state: 'Assam', region: 'Northeast', isPopular: true, lat: 26.1445, lng: 91.7362 },
  { id: 'shillong', name: 'Shillong', state: 'Meghalaya', region: 'Northeast', isPopular: false, lat: 25.5788, lng: 91.8933 },
  { id: 'dehradun', name: 'Dehradun', state: 'Uttarakhand', region: 'North', isPopular: true, lat: 30.3165, lng: 78.0322 },
  { id: 'ranchi', name: 'Ranchi', state: 'Jharkhand', region: 'East', isPopular: true, lat: 23.3441, lng: 85.3096 },
  { id: 'raipur', name: 'Raipur', state: 'Chhattisgarh', region: 'Central', isPopular: false, lat: 21.2514, lng: 81.6296 },
  { id: 'goa', name: 'Goa (Panaji)', state: 'Goa', region: 'West', isPopular: true, lat: 15.4909, lng: 73.8278 },
  { id: 'srinagar', name: 'Srinagar', state: 'Jammu & Kashmir', region: 'North', isPopular: false, lat: 34.0837, lng: 74.7973 },
  { id: 'shimla', name: 'Shimla', state: 'Himachal Pradesh', region: 'North', isPopular: false, lat: 31.1048, lng: 77.1734 },
  { id: 'agartala', name: 'Agartala', state: 'Tripura', region: 'Northeast', isPopular: false, lat: 23.8315, lng: 91.2868 }
];
