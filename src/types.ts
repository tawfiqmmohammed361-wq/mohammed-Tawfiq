export type ProductCategory = 
  | 'all'
  | 'main-doors'
  | 'bedroom-doors'
  | 'pooja-doors'
  | 'wooden-windows'
  | 'sliding-windows'
  | 'teak-doors'
  | 'designer-doors'
  | 'cots-beds'
  | 'headboards'
  | 'custom-doors';

export type WoodType = 
  | 'Burma Teak'
  | 'African Teak (CP)'
  | 'Indian Rosewood (Sheesham)'
  | 'American White Oak'
  | 'Honshu Pine'
  | 'Red Meranti'
  | 'Mahogany';

export type WoodFinish = 
  | 'Natural Matte'
  | 'Honey Oak Polish'
  | 'Deep Walnut Gloss'
  | 'Espresso Dark'
  | 'Rustic Weathered'
  | 'Raw Sanded Untreated';

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  category: ProductCategory;
  categoryName: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  images: string[];
  description: string;
  woodType: WoodType;
  availableWoods: WoodType[];
  dimensions: string; // e.g., "3.5 ft x 7.0 ft x 38mm"
  availableSizes: string[];
  finishes: WoodFinish[];
  glassOption?: string[];
  hardware?: string[];
  features: string[];
  isHeroFeatured?: boolean;
  heroStyle?: 'Classic' | 'Modern' | 'Premium' | 'Carved';
  warranty: string;
  seasoningGrade: string;
  supportsEngraving?: boolean;
  engravingPlaceholder?: string;
}

export interface CustomDesignConfig {
  productType: 'Main Door' | 'Bedroom Door' | 'Pooja Door' | 'Wooden Window' | 'Sliding Window' | 'French Door';
  widthFeet: number;
  widthInches: number;
  heightFeet: number;
  heightInches: number;
  thicknessMm: 32 | 38 | 45 | 50;
  woodType: WoodType;
  designStyle: 'Minimal Plain Solid' | '4-Panel Classic Roman' | 'CNC Geometric Lattice' | 'Sacred Brass Inset' | 'Fluted Glass Contemporary' | 'Chevron Herringbone Inlay';
  finish: WoodFinish;
  glassOption: 'None (Solid Wood)' | 'Clear Toughened (6mm)' | 'Frosted Fluted Privacy' | 'Beveled Antique Stained Glass';
  hardware: 'None (Frame & Shutter Only)' | 'Matte Black Architectural Set' | 'Antique Brass Heritage Handle & Lock' | 'Satin Stainless Modern Kit';
  includeFrame: boolean;
  additionalNotes: string;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  image: string;
  categoryName?: string;
  selectedWood: WoodType | string;
  selectedSize: string;
  selectedFinish: WoodFinish | string;
  selectedGlass?: string;
  selectedHardware?: string;
  unitPrice: number;
  quantity: number;
  isCustom?: boolean;
  customEngravingText?: string;
  customConfig?: CustomDesignConfig | any;
  customDetails?: {
    width: number;
    height: number;
    thickness: number;
    carvingStyle?: string;
    notes?: string;
  };
}

export interface QuoteRequest {
  id: string;
  name: string;
  phone: string;
  email: string;
  itemType: string;
  requiredSize: string;
  preferredWood: string;
  quantity: number;
  location: string;
  designPhotoName?: string;
  additionalReqs: string;
  preferredVisitDate?: string;
  createdAt: string;
  status: 'Pending Review' | 'Estimator Assigned' | 'Quote Sent' | 'Site Visit Scheduled';
}

export interface Review {
  id: string;
  name: string;
  city: string;
  rating: number;
  date: string;
  productPurchased: string;
  comment: string;
  verifiedPurchase: boolean;
  avatarUrl?: string;
  photoUrl?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  gst: number;
  shipping: number;
  total: number;
  advancePaid: number;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state?: string;
  pincode: string;
  paymentMethod: 'UPI' | 'Card' | 'NetBanking' | 'Advance 30%' | string;
  status: 'Confirmed' | 'Wood Seasoning' | 'Carpentry & Joinery' | 'Hand Polishing' | 'Quality Passed' | 'Dispatched' | 'Installed' | string;
  orderDate: string;
  estimatedDelivery: string;
}

export interface BusinessSettings {
  businessName?: string;
  name?: string;
  tagline?: string;
  whatsappNumber?: string;
  whatsapp?: string;
  phone?: string;
  alternatePhone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  hours?: string;
  businessHours?: string;
  googleMapUrl?: string;
  showroomPhotoUrl?: string;
  googleSheetConfigured?: boolean;
}

