import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { googleSheetsService, SHEET_NAMES } from './googleSheets';
import { BusinessSettings } from './types';

export interface ProductItem {
  id: string;
  name: string;
  subtitle: string;
  category: string;
  categoryName: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  woodType: string;
  availableWoods: string[];
  dimensions: string;
  availableSizes: string[];
  finishes: string[];
  glassOption?: string[];
  hardware?: string[];
  features: string[];
  warranty: string;
  seasoningGrade: string;
  images: string[];
  description: string;
  isHeroFeatured?: boolean;
  heroStyle?: string;
  createdDate: string;
}

export interface CustomerRecord {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  createdDate: string;
  ordersCount: number;
  totalSpend: number;
}

export interface OrderRecord {
  id: string;
  customerId: string;
  customerName: string;
  phone: string;
  email: string;
  items: Array<{
    id: string;
    productId: string;
    name: string;
    image: string;
    selectedWood: string;
    selectedSize: string;
    selectedFinish: string;
    selectedGlass?: string;
    unitPrice: number;
    quantity: number;
  }>;
  subtotal: number;
  discount: number;
  gst: number;
  shipping: number;
  total: number;
  deliveryAddress: string;
  city: string;
  state: string;
  pincode: string;
  paymentMethod: string;
  paymentStatus: 'Pending' | 'Advance Paid' | 'Completed' | 'Pay on Delivery';
  status: 'New' | 'Confirmed' | 'Processing' | 'Ready' | 'Shipped' | 'Delivered' | 'Cancelled';
  orderDate: string;
  estimatedDelivery?: string;
  statusHistory: Array<{ status: string; timestamp: string; note?: string }>;
}

export interface QuoteRecord {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  itemType: string; // Door or Window
  width: string;
  height: string;
  woodType: string;
  designPreference: string;
  finish: string;
  glassOption: string;
  quantity: number;
  location: string;
  additionalRequirements: string;
  uploadedDesign?: string;
  requestDate: string;
  status: 'New' | 'Pending Review' | 'Estimator Assigned' | 'Quote Sent' | 'Site Visit Scheduled' | 'Completed' | 'Declined';
}

export interface ContactRecord {
  id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  date: string;
  status: 'Unread' | 'Replied' | 'Archived';
}

export interface ReviewRecord {
  id: string;
  customerName: string;
  city: string;
  product: string;
  rating: number;
  review: string;
  image?: string;
  date: string;
  approvalStatus: 'Pending' | 'Approved' | 'Rejected';
}

interface DataStore {
  products: ProductItem[];
  customers: CustomerRecord[];
  orders: OrderRecord[];
  quotes: QuoteRecord[];
  contacts: ContactRecord[];
  reviews: ReviewRecord[];
  settings: BusinessSettings;
}

const DEFAULT_SETTINGS: BusinessSettings = {
  name: 'WOODCRAFT',
  tagline: 'Beautiful Wood. Built to Last.',
  phone: process.env.BUSINESS_PHONE || '+91 98424 04467',
  alternatePhone: process.env.ALTERNATE_PHONE || '+91 77083 78003',
  whatsapp: process.env.WHATSAPP_PHONE || '+91 98424 04467',
  whatsappNumber: process.env.WHATSAPP_PHONE || '+91 98424 04467',
  email: process.env.BUSINESS_EMAIL || 'tawfiqmmohammed361@gmail.com',
  address: process.env.SHOWROOM_ADDRESS || 'Woodcraft Experience Centre, Plot 42, Timber Yard Industrial Area, South Bengaluru, Karnataka 560078',
  city: 'Bengaluru',
  state: 'Karnataka',
  pincode: '560078',
  businessHours: process.env.BUSINESS_HOURS || 'Mon - Sat: 9:30 AM - 8:00 PM | Sun: By Appointment',
  googleMapUrl: 'https://maps.google.com/?q=Bengaluru+Timber+Yard',
  showroomPhotoUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1400&q=85',
};

const INITIAL_PRODUCTS: ProductItem[] = [
  {
    id: 'wc-door-curved-carving',
    name: 'Master Hand-Carved Royal Teak Entrance Door',
    subtitle: 'Arched paneling with sweeping floral relief carvings and geometric box frames',
    category: 'main-doors',
    categoryName: 'Main Doors',
    price: 42999,
    originalPrice: 52000,
    rating: 5.0,
    reviewsCount: 46,
    inStock: true,
    woodType: 'Burma Teak',
    availableWoods: ['Burma Teak', 'African Teak (CP)', 'Indian Rosewood (Sheesham)'],
    dimensions: '3.5 ft x 7.0 ft x 45mm',
    availableSizes: [
      '3.0 ft x 6.5 ft (Standard)',
      '3.5 ft x 7.0 ft (Traditional Main Door)',
      '4.0 ft x 7.5 ft (Grand Double Leaf)',
      'Custom Dimensions',
    ],
    finishes: ['Honey Oak Polish', 'Natural Matte', 'Deep Walnut Gloss', 'Espresso Dark'],
    glassOption: ['None (100% Solid Teak)'],
    hardware: ['Antique Brass Heavy Pull Handle', 'None (Frame & Shutter Only)'],
    features: [
      '100% Solid mature Burma Teak heartwood (zero veneer or hollow core)',
      'Intricate sweeping floral scrollwork chiseled by senior master woodworkers',
      'Arched side panel profile with multi-tiered geometric raised framing',
      'Seasoned in-house to 8% moisture for complete warp and crack prevention',
      'Hand-rubbed polyurethane marine protective coat',
    ],
    warranty: '15 Years Full Timber & Carving Structural Warranty',
    seasoningGrade: 'Grade A+ Kiln-Dried Solid Hardwood',
    images: [
      '/images/teak_carved_door_1788192941419.jpg',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'A masterpiece from our workshop, this solid teak entrance door features an elegant arched side rail with deeply sculpted floral relief carvings, paired with 4 geometric raised panels. Every curve is chiseled by hand from single-piece seasoned teak planks.',
    isHeroFeatured: true,
    heroStyle: 'Carved',
    createdDate: new Date().toISOString().split('T')[0],
  },
  {
    id: 'wc-cot-royal-frame',
    name: 'Solid Teak Wood Royal Cot & Bed Frame',
    subtitle: 'Heavy-duty solid timber cot frame with hand-chiseled headboard crown and solid wood slats',
    category: 'cots-beds',
    categoryName: 'Cots & Bed Frames',
    price: 38500,
    originalPrice: 48000,
    rating: 4.95,
    reviewsCount: 38,
    inStock: true,
    woodType: 'Burma Teak',
    availableWoods: ['Burma Teak', 'African Teak (CP)', 'Indian Rosewood (Sheesham)'],
    dimensions: 'Queen Size (5.0 ft x 6.5 ft)',
    availableSizes: [
      'Single (3.0 ft x 6.5 ft)',
      'Queen Size (5.0 ft x 6.5 ft)',
      'King Size (6.0 x 6.5 ft)',
      'Super King (6.5 x 7.0 ft)',
      'Custom Dimensions',
    ],
    finishes: ['Honey Oak Polish', 'Natural Matte', 'Deep Walnut Gloss'],
    hardware: ['Heavy Duty Steel Joint Bolts & Slats Included'],
    features: [
      '100% Solid Seasoned Hardwood frame with 4x4 inch solid corner pillars',
      'Hand-carved royal crown headboard with floral relief crest',
      'Includes 10 heavy solid wood cross-slats with reinforced center spine',
      'Zero creak mortise-and-tenon bolted joinery engineered for lifetime use',
      'Smooth hand-sanded edges with multi-coat PU natural wood finish',
    ],
    warranty: '20 Years Structural & Wood Durability Warranty',
    seasoningGrade: 'Grade A Kiln-Dried Hardwood (Moisture < 8%)',
    images: [
      '/images/teak_cot_bed_1788192954616.jpg',
      '/images/carved_headboard_heart_1788192971731.jpg',
      '/images/carved_teak_headboard_1788192987846.jpg',
    ],
    description: 'Built for generations of sound sleep, this solid wood cot features thick structural pillars, solid timber side rails, and an ornate hand-carved crown headboard.',
    isHeroFeatured: true,
    heroStyle: 'Classic',
    createdDate: new Date().toISOString().split('T')[0],
  },
  {
    id: 'wc-headboard-diamond-quilted',
    name: 'Handcrafted Quilted Diamond Teak Headboard',
    subtitle: 'Solid wood headboard with diamond-cushioned wood carving and personalized center heart emblem',
    category: 'headboards',
    categoryName: 'Custom Headboards',
    price: 18999,
    originalPrice: 24500,
    rating: 4.9,
    reviewsCount: 29,
    inStock: true,
    woodType: 'Burma Teak',
    availableWoods: ['Burma Teak', 'African Teak (CP)', 'Indian Rosewood (Sheesham)'],
    dimensions: 'Queen (5.0 ft wide x 3.5 ft high)',
    availableSizes: [
      'Single (3.0 ft wide)',
      'Queen (5.0 ft wide)',
      'King (6.0 ft wide)',
      'Super King (6.5 ft wide)',
    ],
    finishes: ['Honey Oak Polish', 'Natural Matte', 'Deep Walnut Gloss'],
    features: [
      'Intricate 3D diamond quilted relief pattern chiseled directly into solid timber',
      'Center heart medallion with customizable personalized name or monogram carving',
      'Decorative crosshatch textured side posts with sculpted finials',
      'Pre-drilled mounting slots to attach easily to any standard cot frame or wall',
    ],
    warranty: '15 Years Warranty on Timber & Carving',
    seasoningGrade: 'Seasoned Solid Hardwood (Moisture Balanced)',
    images: [
      '/images/carved_headboard_heart_1788192971731.jpg',
      '/images/teak_cot_bed_1788192954616.jpg',
    ],
    description: 'An extraordinary display of traditional Indian carpentry, this headboard mimics the luxurious look of button-tufted upholstery entirely carved out of solid natural teakwood.',
    isHeroFeatured: false,
    heroStyle: 'Carved',
    createdDate: new Date().toISOString().split('T')[0],
  },
  {
    id: 'wc-headboard-heritage-engraved',
    name: 'Heritage Personalized Floral Teak Headboard',
    subtitle: 'Artisan carved royal crest headboard with custom engraved name medallion & finial posts',
    category: 'headboards',
    categoryName: 'Custom Headboards',
    price: 21500,
    originalPrice: 28000,
    rating: 5.0,
    reviewsCount: 32,
    inStock: true,
    woodType: 'Burma Teak',
    availableWoods: ['Burma Teak', 'African Teak (CP)', 'Indian Rosewood (Sheesham)'],
    dimensions: 'King (6.0 ft wide x 4.0 ft high)',
    availableSizes: [
      'Queen (5.0 ft wide)',
      'King (6.0 ft wide)',
      'Super King (6.5 ft wide)',
      'Custom Dimensions',
    ],
    finishes: ['Honey Oak Polish', 'Natural Matte', 'Deep Walnut Gloss'],
    features: [
      'Large heart crest carved with custom 3D raised letters of your choice (e.g. SAHI SAMI SABEER)',
      'Flowing floral garland carvings framing the top crown arch',
      'Turned wooden spherical finial tops on solid timber posts',
      'Rich honey teak finish showing the organic annual ring grain',
    ],
    warranty: '15 Years Structural Warranty',
    seasoningGrade: 'Grade A Seasoned Hardwood',
    images: [
      '/images/carved_teak_headboard_1788192987846.jpg',
      '/images/carved_headboard_heart_1788192971731.jpg',
    ],
    description: 'Make your bedroom truly one-of-a-kind. Handcrafted from heavy teak slabs with twin floral bouquets and an expansive central heart that is individually carved with your chosen names or monogram.',
    isHeroFeatured: false,
    heroStyle: 'Carved',
    createdDate: new Date().toISOString().split('T')[0],
  },
  {
    id: 'wc-door-01',
    name: 'Royal Heritage Burma Teak Main Door',
    subtitle: 'Hand-carved architectural entrance door with solid teak frame and brass accents',
    category: 'main-doors',
    categoryName: 'Main Doors',
    price: 34999,
    originalPrice: 42999,
    rating: 4.9,
    reviewsCount: 128,
    inStock: true,
    woodType: 'Burma Teak',
    availableWoods: ['Burma Teak', 'African Teak (CP)', 'Indian Rosewood (Sheesham)'],
    dimensions: '4.0 ft x 7.5 ft x 45mm',
    availableSizes: [
      '3.5 ft x 7.0 ft (Standard)',
      '4.0 ft x 7.5 ft (Grand Entry)',
      '4.5 ft x 8.0 ft (Villa Estate)',
      'Custom Dimensions',
    ],
    finishes: ['Honey Oak Polish', 'Natural Matte', 'Deep Walnut Gloss', 'Espresso Dark'],
    glassOption: ['None (100% Solid Teak)', '6mm Antique Beveled Inset'],
    hardware: ['Antique Brass Heavy Pull Handle', 'Matte Black High-Security Lockset', 'None (Frame & Shutter)'],
    features: [
      '100% Kiln-Dried Burma Teak (Moisture < 8%)',
      'Solid 45mm thickness for high acoustic & thermal insulation',
      'Termite & borer proof with 15-year timber warranty',
      'Hand-finished with multi-layer PU polyurethane protective seal',
    ],
    warranty: '15 Years Warranty against warping, termites & structural cracks',
    seasoningGrade: 'Grade A+ Kiln-Dried Teak (FSC Certified)',
    images: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'The Royal Heritage Burma Teak Main Door is the crown jewel of our entrance collection. Sculpted from mature, slow-grown Burma teakwood known for its natural golden grain and rich oily resistance to weather. Featuring deep beveling, traditional mortise-and-tenon structural joinery, and an imposing 45mm core that commands attention while providing maximum safety.',
    isHeroFeatured: true,
    heroStyle: 'Classic',
    createdDate: new Date().toISOString().split('T')[0],
  },
  {
    id: 'wc-door-02',
    name: 'Contemporary Minimalist Teak Pivot Door',
    subtitle: 'Wide-format modern entrance door with continuous grain and recessed black handle',
    category: 'designer-doors',
    categoryName: 'Designer Doors',
    price: 39999,
    originalPrice: 48999,
    rating: 4.95,
    reviewsCount: 94,
    inStock: true,
    woodType: 'African Teak (CP)',
    availableWoods: ['African Teak (CP)', 'American White Oak', 'Burma Teak', 'Indian Rosewood (Sheesham)'],
    dimensions: '4.5 ft x 8.0 ft x 50mm',
    availableSizes: [
      '4.0 ft x 7.5 ft',
      '4.5 ft x 8.0 ft (Oversized Pivot)',
      '5.0 ft x 8.5 ft (Architectural)',
    ],
    finishes: ['Natural Matte', 'Deep Walnut Gloss', 'Espresso Dark'],
    glassOption: ['None (Solid Wood)', 'Fluted Glass Side Lite', 'Tinted Black Glass Strip'],
    hardware: ['German Heavy-Duty Pivot Hinge System', 'Full-Length Integrated Black Pull Handle'],
    features: [
      'Heavy-duty floor-mounted 360° pivot mechanism included',
      'Seamless horizontal wood grain pattern book-matched across the door',
      'Magnetic silent latch and European multi-point locking system',
    ],
    warranty: '12 Years Structural & Hardware Warranty',
    seasoningGrade: 'Grade A Vacuum Pressure Treated Timber',
    images: [
      'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'Designed for modern luxury villas and contemporary apartments, this wide pivot door glides effortlessly with the touch of a finger on German hydraulic pivot bearings.',
    isHeroFeatured: true,
    heroStyle: 'Modern',
    createdDate: new Date().toISOString().split('T')[0],
  },
  {
    id: 'wc-door-03',
    name: 'Sacred Traditional Pooja Room Double Door',
    subtitle: 'Intricate CNC cut geometric jaali pattern with solid brass bell insets and bell carvings',
    category: 'pooja-doors',
    categoryName: 'Pooja Doors',
    price: 28999,
    originalPrice: 34999,
    rating: 4.88,
    reviewsCount: 156,
    inStock: true,
    woodType: 'Indian Rosewood (Sheesham)',
    availableWoods: ['Indian Rosewood (Sheesham)', 'Burma Teak', 'African Teak (CP)'],
    dimensions: '3.5 ft x 7.0 ft x 38mm',
    availableSizes: ['3.0 ft x 6.5 ft', '3.5 ft x 7.0 ft (Standard Double)', '4.0 ft x 7.5 ft'],
    finishes: ['Honey Oak Polish', 'Natural Matte', 'Deep Walnut Gloss'],
    glassOption: ['Frosted Privacy Glass behind Jaali', 'Clear Toughened (5mm)', 'None (Open Jaali Grid)'],
    hardware: ['Heritage Pure Brass Bell Insets (12 Pcs)', 'Antique Brass Tower Bolt & Handles'],
    features: [
      'Includes 12 pure acoustic brass temple bells embedded into timber cavities',
      'Precision laser CNC & hand-carved floral om/kalash motifs',
      'Zero-rattle glass gasket seals for acoustic harmony',
    ],
    warranty: '10 Years Termite & Seasoning Guarantee',
    seasoningGrade: 'Kiln Dried Sheesham Heartwood',
    images: [
      'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'Breathe timeless sanctity into your prayer sanctuary. This double shutter pooja door features precision-carved traditional jaali grids integrated with 12 sonorous pure brass temple bells.',
    isHeroFeatured: false,
    createdDate: new Date().toISOString().split('T')[0],
  },
  {
    id: 'wc-win-01',
    name: 'Grand Colonial Wooden Casement Window with Mesh',
    subtitle: 'Classic 3-panel timber window with toughened glass and stainless steel insect screen',
    category: 'wooden-windows',
    categoryName: 'Wooden Windows',
    price: 18499,
    originalPrice: 22999,
    rating: 4.85,
    reviewsCount: 82,
    inStock: true,
    woodType: 'American White Oak',
    availableWoods: ['American White Oak', 'African Teak (CP)', 'Honshu Pine', 'Red Meranti'],
    dimensions: '5.0 ft x 4.0 ft (3 Shutter)',
    availableSizes: ['4.0 ft x 4.0 ft (2 Shutter)', '5.0 ft x 4.0 ft (3 Shutter)', '6.0 ft x 4.5 ft (4 Shutter)'],
    finishes: ['Natural Matte', 'Honey Oak Polish', 'Deep Walnut Gloss'],
    glassOption: ['5mm Saint-Gobain Clear Toughened', 'Acoustic Double Glazed 16mm DGU'],
    hardware: ['Friction Stay Brass Hinges', 'Multi-Point Cremone Bolt Window Lock'],
    features: [
      'Double weather-seal EPDM rubber gaskets for rainwater & wind proofing',
      'Concealed SS304 mosquito insect mesh shutter included',
      'Acoustic noise reduction up to 34dB with DGU glass',
    ],
    warranty: '10 Years Leakage & Wood Warranty',
    seasoningGrade: 'Grade A Kiln-Dried White Oak',
    images: [
      'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'Engineered for luxury residences that cherish natural ventilation and colonial aesthetics.',
    isHeroFeatured: false,
    createdDate: new Date().toISOString().split('T')[0],
  },
  {
    id: 'wc-win-02',
    name: 'Architectural Timber Sliding Patio Window / Balcony Door',
    subtitle: 'Heavy duty lift-and-slide solid wood sliding door with panoramic glass panes',
    category: 'sliding-windows',
    categoryName: 'Sliding Windows',
    price: 31999,
    originalPrice: 38999,
    rating: 4.92,
    reviewsCount: 67,
    inStock: true,
    woodType: 'Burma Teak',
    availableWoods: ['Burma Teak', 'African Teak (CP)', 'American White Oak'],
    dimensions: '8.0 ft x 7.0 ft (2 Track 2 Panel)',
    availableSizes: ['6.0 ft x 7.0 ft', '8.0 ft x 7.0 ft', '10.0 ft x 8.0 ft (3 Track 3 Panel)'],
    finishes: ['Natural Matte', 'Honey Oak Polish', 'Deep Walnut Gloss'],
    glassOption: ['6mm Saint-Gobain Toughened Clear', 'Double Glazed Tinted Solar Control'],
    hardware: ['German Heavy-Duty Stainless Steel Roller Track (300kg rated)', 'Flush Keyed Lockset'],
    features: [
      'Ultra-smooth whisper-quiet glide mechanism',
      'Heavy weather-resistant bottom sill track with integrated water drainage',
      'Full perimeter brush seals preventing dust and wind ingress',
    ],
    warranty: '10 Years Smooth-Track & Structural Warranty',
    seasoningGrade: 'Grade A+ Burma Teak',
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'Transform your balcony or living terrace with vast timber-framed sliding spans.',
    isHeroFeatured: true,
    heroStyle: 'Modern',
    createdDate: new Date().toISOString().split('T')[0],
  },
  {
    id: 'wc-door-04',
    name: 'Acoustic Solid Core Bedroom Panel Door',
    subtitle: 'Sound-dampening 4-panel solid hardwood interior door with luxury satin finish',
    category: 'bedroom-doors',
    categoryName: 'Bedroom Doors',
    price: 16999,
    originalPrice: 20999,
    rating: 4.87,
    reviewsCount: 110,
    inStock: true,
    woodType: 'Red Meranti',
    availableWoods: ['Red Meranti', 'Honshu Pine', 'African Teak (CP)', 'American White Oak'],
    dimensions: '3.25 ft x 7.0 ft x 38mm',
    availableSizes: ['3.0 ft x 7.0 ft', '3.25 ft x 7.0 ft', '3.5 ft x 7.0 ft'],
    finishes: ['Honey Oak Polish', 'Natural Matte', 'Deep Walnut Gloss', 'Espresso Dark'],
    glassOption: ['None (Solid Wood Core)'],
    hardware: ['Satin Nickel Mortise Lever Handle & Cylinder Lock', 'Heavy Duty Ball Bearing Hinges'],
    features: [
      'Engineered solid core with timber cross-banding to resist all warping',
      'Drop-down automatic acoustic bottom seal for bedroom tranquility',
      'Smooth hand-buffed polyurethane satin finish',
    ],
    warranty: '10 Years Anti-Warp & Delamination Guarantee',
    seasoningGrade: 'Kiln Dried Grade A Timber',
    images: [
      'https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'Engineered for peace, privacy, and architectural cohesion inside bedrooms, study rooms, and master suites.',
    isHeroFeatured: false,
    createdDate: new Date().toISOString().split('T')[0],
  }
];

const INITIAL_REVIEWS: ReviewRecord[] = [
  {
    id: 'rev-01',
    customerName: 'Rajesh & Meenakshi Sundaram',
    city: 'Sadashivanagar, Bengaluru',
    product: 'Royal Heritage Burma Teak Main Door',
    rating: 5,
    review: 'The sheer weight and grain pattern of the Burma teak door took our breath away. WOODCRAFT custom sized it to 8.5 feet for our villa. The brass insets and finish are true master craftsmanship!',
    image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=600&q=80',
    date: '2026-06-14',
    approvalStatus: 'Approved',
  },
  {
    id: 'rev-02',
    customerName: 'Ar. Ananya Deshmukh',
    city: 'Jubilee Hills, Hyderabad',
    product: 'Contemporary Minimalist Teak Pivot Door',
    rating: 5,
    review: 'As an architect, I am extremely particular about wood moisture content and hardware tolerances. The hydraulic pivot door operates smoothly with zero drag. The African teak grain matching is world-class.',
    image: 'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?auto=format&fit=crop&w=600&q=80',
    date: '2026-07-02',
    approvalStatus: 'Approved',
  },
  {
    id: 'rev-03',
    customerName: 'Vikram & Swati Singhania',
    city: 'Boat Club Road, Pune',
    product: 'Sacred Traditional Pooja Room Double Door',
    rating: 5,
    review: 'The embedded brass bells in the pooja door chime with such an auspicious sound when opened. Delivered on the promised date in custom foam crate packing.',
    image: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=600&q=80',
    date: '2026-07-28',
    approvalStatus: 'Approved',
  }
];

export class StoreManager {
  private dataPath: string;
  private data: DataStore;

  constructor() {
    const dir = path.join(process.cwd(), 'server', 'data');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    this.dataPath = path.join(dir, 'store.json');
    this.data = this.loadData();
  }

  private loadData(): DataStore {
    try {
      if (fs.existsSync(this.dataPath)) {
        const raw = fs.readFileSync(this.dataPath, 'utf-8');
        const parsed = JSON.parse(raw);
        return {
          products: parsed.products && parsed.products.length > 0 ? parsed.products : INITIAL_PRODUCTS,
          customers: parsed.customers || [],
          orders: parsed.orders || [],
          quotes: parsed.quotes || [],
          contacts: parsed.contacts || [],
          reviews: parsed.reviews || INITIAL_REVIEWS,
          settings: { ...DEFAULT_SETTINGS, ...(parsed.settings || {}) },
        };
      }
    } catch (e) {
      console.warn('[Store] Initializing new store due to read error');
    }

    const initial: DataStore = {
      products: INITIAL_PRODUCTS,
      customers: [],
      orders: [],
      quotes: [],
      contacts: [],
      reviews: INITIAL_REVIEWS,
      settings: DEFAULT_SETTINGS,
    };
    this.saveData(initial);
    return initial;
  }

  private saveData(dataToSave: DataStore) {
    try {
      fs.writeFileSync(this.dataPath, JSON.stringify(dataToSave, null, 2), 'utf-8');
    } catch (e: any) {
      console.error('[Store] Error saving store:', e.message);
    }
  }

  // ==================== PRODUCTS ====================
  public getProducts(): ProductItem[] {
    return this.data.products;
  }

  public getProductById(id: string): ProductItem | undefined {
    return this.data.products.find((p) => p.id === id);
  }

  public async addProduct(productData: Partial<ProductItem>): Promise<ProductItem> {
    const newProduct: ProductItem = {
      id: productData.id || `wc-${Date.now().toString(36)}`,
      name: productData.name || 'Custom Handcrafted Timber Door',
      subtitle: productData.subtitle || '100% Solid Seasoned Hardwood',
      category: productData.category || 'main-doors',
      categoryName: productData.categoryName || 'Main Doors',
      price: Number(productData.price) || 19999,
      originalPrice: Number(productData.originalPrice) || (Number(productData.price) ? Math.round(Number(productData.price) * 1.25) : 24999),
      rating: productData.rating || 5.0,
      reviewsCount: productData.reviewsCount || 0,
      inStock: productData.inStock !== undefined ? Boolean(productData.inStock) : true,
      woodType: productData.woodType || 'Burma Teak',
      availableWoods: productData.availableWoods || ['Burma Teak', 'African Teak (CP)', 'American White Oak'],
      dimensions: productData.dimensions || '3.5 ft x 7.0 ft x 38mm',
      availableSizes: productData.availableSizes || ['3.5 ft x 7.0 ft', '4.0 ft x 7.5 ft', 'Custom Dimensions'],
      finishes: productData.finishes || ['Natural Matte', 'Honey Oak Polish', 'Deep Walnut Gloss'],
      glassOption: productData.glassOption || ['None (Solid Wood)'],
      hardware: productData.hardware || ['None (Frame & Shutter)'],
      features: productData.features || ['100% Kiln-Dried Timber', 'Termite & Borer Proof', 'Hand-Crafted Finish'],
      warranty: productData.warranty || '10 Years Structural Warranty',
      seasoningGrade: productData.seasoningGrade || 'Grade A Kiln-Dried',
      images: productData.images && productData.images.length > 0 ? productData.images : ['https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80'],
      description: productData.description || 'Premium solid wood craftsmanship built for generational durability.',
      isHeroFeatured: Boolean(productData.isHeroFeatured),
      heroStyle: productData.heroStyle || 'Classic',
      createdDate: new Date().toISOString().split('T')[0],
    };

    this.data.products.unshift(newProduct);
    this.saveData(this.data);

    // Sync to Google Sheets
    const discount = `${Math.round(((newProduct.originalPrice - newProduct.price) / newProduct.originalPrice) * 100)}%`;
    await googleSheetsService.appendRow(SHEET_NAMES.PRODUCTS, [
      newProduct.id,
      newProduct.name,
      newProduct.categoryName,
      newProduct.description,
      newProduct.woodType,
      'Solid Kiln-Dried Timber',
      newProduct.dimensions,
      newProduct.finishes.join(', '),
      (newProduct.glassOption || []).join(', '),
      newProduct.price,
      newProduct.originalPrice,
      discount,
      newProduct.inStock ? 'In Stock' : 'Made to Order',
      newProduct.images[0] || '',
      newProduct.createdDate,
    ]);

    return newProduct;
  }

  public async updateProduct(id: string, updates: Partial<ProductItem>): Promise<ProductItem | null> {
    const index = this.data.products.findIndex((p) => p.id === id);
    if (index === -1) return null;

    const current = this.data.products[index];
    const updated: ProductItem = {
      ...current,
      ...updates,
      price: updates.price !== undefined ? Number(updates.price) : current.price,
      originalPrice: updates.originalPrice !== undefined ? Number(updates.originalPrice) : current.originalPrice,
      inStock: updates.inStock !== undefined ? Boolean(updates.inStock) : current.inStock,
    };

    this.data.products[index] = updated;
    this.saveData(this.data);
    return updated;
  }

  public async deleteProduct(id: string): Promise<boolean> {
    const initialLen = this.data.products.length;
    this.data.products = this.data.products.filter((p) => p.id !== id);
    if (this.data.products.length !== initialLen) {
      this.saveData(this.data);
      return true;
    }
    return false;
  }

  // ==================== CUSTOMERS & ORDERS ====================
  public getOrders(): OrderRecord[] {
    return this.data.orders;
  }

  public getCustomers(): CustomerRecord[] {
    return this.data.customers;
  }

  public findOrder(orderId: string, phone: string): OrderRecord | undefined {
    const cleanId = orderId.trim().toUpperCase();
    const cleanPhone = phone.trim().replace(/[^0-9]/g, '');

    return this.data.orders.find((o) => {
      const matchId = o.id.toUpperCase() === cleanId;
      const orderPhoneClean = o.phone.replace(/[^0-9]/g, '');
      const matchPhone = orderPhoneClean.endsWith(cleanPhone) || cleanPhone.endsWith(orderPhoneClean);
      return matchId && matchPhone;
    });
  }

  public async createOrder(orderInput: {
    customerName: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    items: any[];
    subtotal: number;
    discount: number;
    gst: number;
    shipping: number;
    total: number;
    paymentMethod: string;
  }): Promise<OrderRecord> {
    const orderId = `WC-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    let customer = this.data.customers.find((c) => c.phone === orderInput.phone || (orderInput.email && c.email === orderInput.email));
    
    if (!customer) {
      customer = {
        id: `CUST-${Date.now().toString(36).toUpperCase()}`,
        name: orderInput.customerName,
        phone: orderInput.phone,
        email: orderInput.email,
        address: orderInput.address,
        city: orderInput.city,
        state: orderInput.state,
        pincode: orderInput.pincode,
        createdDate: new Date().toISOString().split('T')[0],
        ordersCount: 1,
        totalSpend: orderInput.total,
      };
      this.data.customers.unshift(customer);

      // Append customer to Google Sheets
      await googleSheetsService.appendRow(SHEET_NAMES.CUSTOMERS, [
        customer.id,
        customer.name,
        customer.phone,
        customer.email,
        customer.address,
        customer.city,
        customer.state,
        customer.pincode,
        customer.createdDate,
      ]);
    } else {
      customer.ordersCount += 1;
      customer.totalSpend += orderInput.total;
    }

    const orderDate = new Date().toISOString().split('T')[0];
    const newOrder: OrderRecord = {
      id: orderId,
      customerId: customer.id,
      customerName: orderInput.customerName,
      phone: orderInput.phone,
      email: orderInput.email,
      items: orderInput.items,
      subtotal: orderInput.subtotal,
      discount: orderInput.discount,
      gst: orderInput.gst,
      shipping: orderInput.shipping,
      total: orderInput.total,
      deliveryAddress: `${orderInput.address}, ${orderInput.city}, ${orderInput.state} - ${orderInput.pincode}`,
      city: orderInput.city,
      state: orderInput.state,
      pincode: orderInput.pincode,
      paymentMethod: orderInput.paymentMethod || 'Pay on Confirmation',
      paymentStatus: 'Advance Paid',
      status: 'New',
      orderDate,
      statusHistory: [
        {
          status: 'New',
          timestamp: new Date().toISOString(),
          note: 'Order placed by customer and logged to Woodcraft joinery queue.',
        },
      ],
    };

    this.data.orders.unshift(newOrder);
    this.saveData(this.data);

    // Append to Google Sheets for each item or aggregate
    for (const item of newOrder.items) {
      await googleSheetsService.appendRow(SHEET_NAMES.ORDERS, [
        newOrder.id,
        customer.id,
        newOrder.customerName,
        newOrder.phone,
        item.productId || item.id,
        item.name,
        item.quantity,
        item.unitPrice,
        newOrder.total,
        newOrder.deliveryAddress,
        newOrder.orderDate,
        newOrder.paymentStatus,
        newOrder.status,
      ]);
    }

    return newOrder;
  }

  public async updateOrderStatus(orderId: string, status: OrderRecord['status'], note?: string): Promise<OrderRecord | null> {
    const order = this.data.orders.find((o) => o.id === orderId);
    if (!order) return null;

    order.status = status;
    order.statusHistory.push({
      status,
      timestamp: new Date().toISOString(),
      note: note || `Status updated to ${status} by Woodcraft production manager.`,
    });

    this.saveData(this.data);

    // Update in Google Sheets (Order ID column is 0, Order Status column is 12)
    await googleSheetsService.updateRowStatus(SHEET_NAMES.ORDERS, 0, orderId, 12, status);

    return order;
  }

  // ==================== QUOTES ====================
  public getQuotes(): QuoteRecord[] {
    return this.data.quotes;
  }

  public async createQuote(input: {
    customerName: string;
    phone: string;
    email: string;
    itemType: string;
    width: string;
    height: string;
    woodType: string;
    designPreference: string;
    finish: string;
    glassOption: string;
    quantity: number;
    location: string;
    additionalRequirements?: string;
    uploadedDesign?: string;
  }): Promise<QuoteRecord> {
    const quoteId = `QT-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const requestDate = new Date().toISOString().split('T')[0];

    const newQuote: QuoteRecord = {
      id: quoteId,
      customerName: input.customerName,
      phone: input.phone,
      email: input.email || 'N/A',
      itemType: input.itemType || 'Door',
      width: input.width || 'Custom',
      height: input.height || 'Custom',
      woodType: input.woodType || 'Burma Teak',
      designPreference: input.designPreference || 'Architectural Custom',
      finish: input.finish || 'Natural Matte',
      glassOption: input.glassOption || 'None (Solid Wood)',
      quantity: Number(input.quantity) || 1,
      location: input.location || 'Bengaluru',
      additionalRequirements: input.additionalRequirements || 'None',
      uploadedDesign: input.uploadedDesign || '',
      requestDate,
      status: 'New',
    };

    this.data.quotes.unshift(newQuote);
    this.saveData(this.data);

    // Append to Google Sheets
    await googleSheetsService.appendRow(SHEET_NAMES.QUOTE_REQUESTS, [
      newQuote.id,
      newQuote.customerName,
      newQuote.phone,
      newQuote.email,
      newQuote.itemType,
      newQuote.width,
      newQuote.height,
      newQuote.woodType,
      newQuote.designPreference,
      newQuote.finish,
      newQuote.glassOption,
      newQuote.quantity,
      newQuote.location,
      newQuote.additionalRequirements,
      newQuote.uploadedDesign || 'None',
      newQuote.requestDate,
      newQuote.status,
    ]);

    return newQuote;
  }

  public async updateQuoteStatus(quoteId: string, status: QuoteRecord['status']): Promise<QuoteRecord | null> {
    const quote = this.data.quotes.find((q) => q.id === quoteId);
    if (!quote) return null;

    quote.status = status;
    this.saveData(this.data);

    // Update in Google Sheets (Quote ID column 0, Status column 16)
    await googleSheetsService.updateRowStatus(SHEET_NAMES.QUOTE_REQUESTS, 0, quoteId, 16, status);
    return quote;
  }

  // ==================== CONTACT MESSAGES ====================
  public getContacts(): ContactRecord[] {
    return this.data.contacts;
  }

  public async createContact(input: { name: string; phone: string; email: string; message: string }): Promise<ContactRecord> {
    const id = `MSG-${Date.now().toString(36).toUpperCase()}`;
    const date = new Date().toISOString().split('T')[0];

    const newContact: ContactRecord = {
      id,
      name: input.name,
      phone: input.phone,
      email: input.email || 'N/A',
      message: input.message,
      date,
      status: 'Unread',
    };

    this.data.contacts.unshift(newContact);
    this.saveData(this.data);

    // Append to Google Sheets
    await googleSheetsService.appendRow(SHEET_NAMES.CONTACT_MESSAGES, [
      newContact.id,
      newContact.name,
      newContact.phone,
      newContact.email,
      newContact.message,
      newContact.date,
      newContact.status,
    ]);

    return newContact;
  }

  public async updateContactStatus(id: string, status: ContactRecord['status']): Promise<ContactRecord | null> {
    const contact = this.data.contacts.find((c) => c.id === id);
    if (!contact) return null;
    contact.status = status;
    this.saveData(this.data);
    await googleSheetsService.updateRowStatus(SHEET_NAMES.CONTACT_MESSAGES, 0, id, 6, status);
    return contact;
  }

  // ==================== REVIEWS ====================
  public getApprovedReviews(): ReviewRecord[] {
    return this.data.reviews.filter((r) => r.approvalStatus === 'Approved');
  }

  public getAllReviews(): ReviewRecord[] {
    return this.data.reviews;
  }

  public async createReview(input: {
    customerName: string;
    city?: string;
    product: string;
    rating: number;
    review: string;
    image?: string;
  }): Promise<ReviewRecord> {
    const id = `REV-${Date.now().toString(36).toUpperCase()}`;
    const date = new Date().toISOString().split('T')[0];

    const newReview: ReviewRecord = {
      id,
      customerName: input.customerName,
      city: input.city || 'India',
      product: input.product,
      rating: Number(input.rating) || 5,
      review: input.review,
      image: input.image || '',
      date,
      approvalStatus: 'Pending',
    };

    this.data.reviews.unshift(newReview);
    this.saveData(this.data);

    // Append to Google Sheets
    await googleSheetsService.appendRow(SHEET_NAMES.REVIEWS, [
      newReview.id,
      newReview.customerName,
      newReview.product,
      newReview.rating,
      newReview.review,
      newReview.image || '',
      newReview.date,
      newReview.approvalStatus,
    ]);

    return newReview;
  }

  public async updateReviewStatus(id: string, approvalStatus: ReviewRecord['approvalStatus']): Promise<ReviewRecord | null> {
    const review = this.data.reviews.find((r) => r.id === id);
    if (!review) return null;
    review.approvalStatus = approvalStatus;
    this.saveData(this.data);
    await googleSheetsService.updateRowStatus(SHEET_NAMES.REVIEWS, 0, id, 7, approvalStatus);
    return review;
  }

  // ==================== SETTINGS & STATS ====================
  public getSettings(): BusinessSettings {
    return this.data.settings;
  }

  public updateSettings(updates: Partial<BusinessSettings>): BusinessSettings {
    this.data.settings = {
      ...this.data.settings,
      ...updates,
    };
    this.saveData(this.data);
    return this.data.settings;
  }

  public getDashboardStats() {
    const pendingOrders = this.data.orders.filter((o) => o.status === 'New' || o.status === 'Confirmed' || o.status === 'Processing').length;
    const newQuotes = this.data.quotes.filter((q) => q.status === 'New' || q.status === 'Pending Review').length;
    const pendingMessages = this.data.contacts.filter((c) => c.status === 'Unread').length;
    const pendingReviews = this.data.reviews.filter((r) => r.approvalStatus === 'Pending').length;
    const totalRevenue = this.data.orders.reduce((sum, o) => sum + (o.status !== 'Cancelled' ? o.total : 0), 0);

    return {
      totalProducts: this.data.products.length,
      totalOrders: this.data.orders.length,
      totalCustomers: this.data.customers.length,
      newQuoteRequests: newQuotes,
      pendingOrders,
      pendingMessages,
      pendingReviews,
      totalRevenue,
    };
  }
}

export const storeManager = new StoreManager();
