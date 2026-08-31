export interface GoogleSheetConfig {
  sheetId: string;
  clientEmail: string;
  privateKey: string;
}

export interface SheetRowProduct {
  'Product ID': string;
  'Product Name': string;
  'Category': string;
  'Description': string;
  'Wood Type': string;
  'Material': string;
  'Dimensions': string;
  'Finish': string;
  'Glass Option': string;
  'Price': string | number;
  'Original Price': string | number;
  'Discount': string;
  'Stock Status': string;
  'Product Image': string;
  'Created Date': string;
}

export interface SheetRowCustomer {
  'Customer ID': string;
  'Name': string;
  'Phone': string;
  'Email': string;
  'Address': string;
  'City': string;
  'State': string;
  'Pincode': string;
  'Created Date': string;
}

export interface SheetRowOrder {
  'Order ID': string;
  'Customer ID': string;
  'Customer Name': string;
  'Phone': string;
  'Product ID': string;
  'Product Name': string;
  'Quantity': string | number;
  'Price': string | number;
  'Total Amount': string | number;
  'Delivery Address': string;
  'Order Date': string;
  'Payment Status': string;
  'Order Status': string;
}

export interface SheetRowQuote {
  'Quote ID': string;
  'Customer Name': string;
  'Phone': string;
  'Email': string;
  'Door/Window': string;
  'Width': string;
  'Height': string;
  'Wood Type': string;
  'Design Preference': string;
  'Finish': string;
  'Glass Option': string;
  'Quantity': string | number;
  'Location': string;
  'Additional Requirements': string;
  'Uploaded Design': string;
  'Request Date': string;
  'Quote Status': string;
}

export interface SheetRowContact {
  'Message ID': string;
  'Name': string;
  'Phone': string;
  'Email': string;
  'Message': string;
  'Date': string;
  'Status': string;
}

export interface SheetRowReview {
  'Review ID': string;
  'Customer Name': string;
  'Product': string;
  'Rating': string | number;
  'Review': string;
  'Image': string;
  'Date': string;
  'Approval Status': string;
}

export interface BusinessSettings {
  name: string;
  tagline: string;
  phone: string;
  alternatePhone?: string;
  whatsapp: string;
  whatsappNumber?: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  businessHours: string;
  googleMapUrl: string;
  showroomPhotoUrl: string;
}
