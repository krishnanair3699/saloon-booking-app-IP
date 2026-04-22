import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'hi' | 'mr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    welcome: 'Welcome to Serenity Spa',
    selectCity: 'Select Your City',
    selectService: 'Select a Service',
    bookNow: 'Book Now',
    massage: 'Massage Therapy',
    facial: 'Facial Treatment',
    bodyWrap: 'Body Wrap',
    aromatherapy: 'Aromatherapy',
    hotStone: 'Hot Stone Massage',
    deepTissue: 'Deep Tissue Massage',
    thai: 'Thai Massage',
    ayurvedic: 'Ayurvedic Treatment',
    selectDate: 'Select Date & Time',
    bookingDetails: 'Booking Details',
    personalInfo: 'Personal Information',
    name: 'Full Name',
    email: 'Email Address',
    phone: 'Phone Number',
    date: 'Date',
    time: 'Time',
    service: 'Service',
    location: 'Location',
    proceed: 'Proceed to Payment',
    payment: 'Payment',
    total: 'Total Amount',
    discount: 'Discount',
    finalAmount: 'Final Amount',
    couponCode: 'Coupon Code',
    apply: 'Apply',
    confirmBooking: 'Confirm Booking',
    mumbai: 'Mumbai',
    delhi: 'Delhi',
    bangalore: 'Bangalore',
    back: 'Back',
    next: 'Next',
    duration: 'Duration',
    minutes: 'minutes',
    price: 'Price',
    firstName: 'First time with us? Use code',
    forDiscount: 'for 15% off!',
    bookingConfirmed: 'Booking Confirmed!',
    thankYou: 'Thank you for choosing Serenity Spa',
    confirmationSent: 'A confirmation has been sent to your email and phone',
    backToHome: 'Back to Home',
  },
  hi: {
    welcome: 'सेरेनिटी स्पा में आपका स्वागत है',
    selectCity: 'अपना शहर चुनें',
    selectService: 'सेवा चुनें',
    bookNow: 'अभी बुक करें',
    massage: 'मालिश चिकित्सा',
    facial: 'फेशियल ट्रीटमेंट',
    bodyWrap: 'बॉडी रैप',
    aromatherapy: 'अरोमाथेरेपी',
    hotStone: 'हॉट स्टोन मसाज',
    deepTissue: 'डीप टिश्यू मसाज',
    thai: 'थाई मसाज',
    ayurvedic: 'आयुर्वेदिक उपचार',
    selectDate: 'तारीख और समय चुनें',
    bookingDetails: 'बुकिंग विवरण',
    personalInfo: 'व्यक्तिगत जानकारी',
    name: 'पूरा नाम',
    email: 'ईमेल पता',
    phone: 'फोन नंबर',
    date: 'तारीख',
    time: 'समय',
    service: 'सेवा',
    location: 'स्थान',
    proceed: 'भुगतान के लिए आगे बढ़ें',
    payment: 'भुगतान',
    total: 'कुल राशि',
    discount: 'छूट',
    finalAmount: 'अंतिम राशि',
    couponCode: 'कूपन कोड',
    apply: 'लागू करें',
    confirmBooking: 'बुकिंग की पुष्टि करें',
    mumbai: 'मुंबई',
    delhi: 'दिल्ली',
    bangalore: 'बेंगलुरु',
    back: 'पीछे',
    next: 'अगला',
    duration: 'अवधि',
    minutes: 'मिनट',
    price: 'मूल्य',
    firstName: 'पहली बार? कोड का उपयोग करें',
    forDiscount: '15% छूट के लिए!',
    bookingConfirmed: 'बुकिंग की पुष्टि हो गई!',
    thankYou: 'सेरेनिटी स्पा चुनने के लिए धन्यवाद',
    confirmationSent: 'पुष्टिकरण आपके ईमेल और फोन पर भेजा गया है',
    backToHome: 'होम पर वापस जाएं',
  },
  mr: {
    welcome: 'सेरेनिटी स्पा मध्ये आपले स्वागत आहे',
    selectCity: 'तुमचे शहर निवडा',
    selectService: 'सेवा निवडा',
    bookNow: 'आता बुक करा',
    massage: 'मसाज थेरपी',
    facial: 'फेशियल ट्रीटमेंट',
    bodyWrap: 'बॉडी रॅप',
    aromatherapy: 'अरोमाथेरपी',
    hotStone: 'हॉट स्टोन मसाज',
    deepTissue: 'डीप टिश्यू मसाज',
    thai: 'थाई मसाज',
    ayurvedic: 'आयुर्वेदिक उपचार',
    selectDate: 'तारीख आणि वेळ निवडा',
    bookingDetails: 'बुकिंग तपशील',
    personalInfo: 'वैयक्तिक माहिती',
    name: 'पूर्ण नाव',
    email: 'ईमेल पत्ता',
    phone: 'फोन नंबर',
    date: 'तारीख',
    time: 'वेळ',
    service: 'सेवा',
    location: 'स्थान',
    proceed: 'पेमेंटसाठी पुढे जा',
    payment: 'पेमेंट',
    total: 'एकूण रक्कम',
    discount: 'सूट',
    finalAmount: 'अंतिम रक्कम',
    couponCode: 'कूपन कोड',
    apply: 'लागू करा',
    confirmBooking: 'बुकिंग पुष्टी करा',
    mumbai: 'मुंबई',
    delhi: 'दिल्ली',
    bangalore: 'बेंगलोर',
    back: 'मागे',
    next: 'पुढे',
    duration: 'कालावधी',
    minutes: 'मिनिटे',
    price: 'किंमत',
    firstName: 'प्रथमच? कोड वापरा',
    forDiscount: '15% सवलतीसाठी!',
    bookingConfirmed: 'बुकिंगची पुष्टी झाली!',
    thankYou: 'सेरेनिटी स्पा निवडल्याबद्दल धन्यवाद',
    confirmationSent: 'तुमच्या ईमेल आणि फोनवर पुष्टीकरण पाठवले आहे',
    backToHome: 'होमवर परत जा',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
