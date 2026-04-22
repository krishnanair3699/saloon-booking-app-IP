import { Service } from '../contexts/BookingContext';

export const cities = [
  { id: 'mumbai', name: 'Mumbai', image: 'ae0afacf99613e636b5b27a1284d1b080e288b6b.png' },
  { id: 'delhi', name: 'Delhi', image: '8b7624c7a992211fc633287cba43b2a90ce91ded.png' },
];

export const bodyAreas = [
  { id: 'lower', name: 'Lower Body', icon: 'legs' },
  { id: 'torso', name: 'Torso', icon: 'body' },
  { id: 'upper', name: 'Upper Body', icon: 'arms' },
];

export const services: Record<string, any[]> = {
  lower: [
    {
      id: 'lower-1',
      name: 'Foot Reflexology Massage',
      price: 1200,
      duration: '45 min',
      zone: 'Feet & Lower Legs',
      description: 'Traditional Thai foot massage targeting pressure points',
      category: 'lower',
    },
    {
      id: 'lower-2',
      name: 'Full Leg Thai Massage',
      price: 1800,
      duration: '60 min',
      zone: 'Complete Legs',
      description: 'Deep tissue massage for legs with herbal compress',
      category: 'lower',
    },
    {
      id: 'lower-3',
      name: 'Hip & Thigh Therapy',
      price: 2000,
      duration: '50 min',
      zone: 'Hips & Thighs',
      description: 'Focused therapy for hip flexibility and tension release',
      category: 'lower',
    },
  ],
  torso: [
    {
      id: 'torso-1',
      name: 'Thai Abdominal Massage',
      price: 1500,
      duration: '40 min',
      zone: 'Abdomen & Core',
      description: 'Gentle massage to improve digestion and core wellness',
      category: 'torso',
    },
    {
      id: 'torso-2',
      name: 'Back & Spine Deep Tissue',
      price: 2200,
      duration: '60 min',
      zone: 'Full Back & Spine',
      description: 'Intensive back massage with hot stone therapy',
      category: 'torso',
    },
    {
      id: 'torso-3',
      name: 'Lower Back Pain Relief',
      price: 1800,
      duration: '45 min',
      zone: 'Lower Back',
      description: 'Targeted relief for chronic lower back pain',
      category: 'torso',
    },
    {
      id: 'torso-4',
      name: 'Full Torso Thai Yoga',
      price: 2500,
      duration: '75 min',
      zone: 'Complete Torso',
      description: 'Assisted yoga stretches combined with massage',
      category: 'torso',
    },
  ],
  upper: [
    {
      id: 'upper-1',
      name: 'Neck & Shoulder Relief',
      price: 1400,
      duration: '35 min',
      zone: 'Neck & Shoulders',
      description: 'Perfect for desk workers and stress relief',
      category: 'upper',
    },
    {
      id: 'upper-2',
      name: 'Arms & Hands Massage',
      price: 1200,
      duration: '40 min',
      zone: 'Arms & Hands',
      description: 'Relaxing massage for arms with pressure point therapy',
      category: 'upper',
    },
    {
      id: 'upper-3',
      name: 'Head & Scalp Therapy',
      price: 1600,
      duration: '45 min',
      zone: 'Head & Scalp',
      description: 'Soothing head massage with aromatic oils',
      category: 'upper',
    },
    {
      id: 'upper-4',
      name: 'Full Upper Body Session',
      price: 2400,
      duration: '70 min',
      zone: 'Neck, Shoulders, Arms',
      description: 'Complete upper body relaxation experience',
      category: 'upper',
    },
  ],
};