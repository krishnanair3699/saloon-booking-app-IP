export interface MassageType {
  value: string;
  label: string;
  names: string[];
}

export const MASSAGE_TYPES: MassageType[] = [
  {
    value: 'torso',
    label: 'Torso',
    names: [
      'Swedish Torso Massage',
      'Deep Tissue Torso',
      'Hot Stone Torso',
      'Aromatherapy Torso',
      'Thai Torso Massage',
      'Shiatsu Torso',
      'Sports Torso Massage'
    ]
  },
  {
    value: 'upper_body',
    label: 'Upper Body',
    names: [
      'Shoulder & Neck Massage',
      'Upper Back Deep Tissue',
      'Arm & Hand Massage',
      'Head & Shoulder Massage',
      'Neck Tension Relief',
      'Upper Body Swedish',
      'Back & Shoulder Thai'
    ]
  },
  {
    value: 'lower_back',
    label: 'Lower Back',
    names: [
      'Lower Back Pain Relief',
      'Lumbar Deep Tissue',
      'Lower Back Swedish',
      'Hip & Lower Back',
      'Sciatic Relief Massage',
      'Lower Spine Therapy',
      'Lower Back Sports Massage'
    ]
  }
];

export const getMassageNamesByType = (type: string): string[] => {
  const massageType = MASSAGE_TYPES.find(mt => mt.value === type);
  return massageType ? massageType.names : [];
};
