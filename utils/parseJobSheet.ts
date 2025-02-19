export function parseJobSheetText(text: string) {
  // More flexible parsing with multiple pattern attempts
  const patterns = {
    customerName: [
      /Customer[\s:]+([^\n]+)/i,
      /Name[\s:]+([^\n]+)/i,
      /Client[\s:]+([^\n]+)/i
    ],
    customerPhone: [
      /Phone[\s:]+(\d[\d\s]{7,})/i,
      /Contact[\s:]+(\d[\d\s]{7,})/i,
      /(\d{4}\s?\d{3}\s?\d{3})/
    ],
    bikeModel: [
      /Bike[\s:]+([^\n]+)/i,
      /Model[\s:]+([^\n]+)/i,
      /Motorcycle[\s:]+([^\n]+)/i,
      /Vehicle[\s:]+([^\n]+)/i
    ],
    workRequired: [
      /Work Required[\s:]+([\s\S]+?)(?=Work Done|Notes|$)/i,
      /Service Needed[\s:]+([\s\S]+?)(?=Work Done|Notes|$)/i,
      /Issues[\s:]+([\s\S]+?)(?=Work Done|Notes|$)/i
    ],
    laborCost: [
      /Labor[\s:]*\$?(\d+\.?\d*)/i,
      /Service Fee[\s:]*\$?(\d+\.?\d*)/i,
      /Work Cost[\s:]*\$?(\d+\.?\d*)/i
    ],
    partsCost: [
      /Parts[\s:]*\$?(\d+\.?\d*)/i,
      /Materials[\s:]*\$?(\d+\.?\d*)/i,
      /Components[\s:]*\$?(\d+\.?\d*)/i
    ]
  };

  const tryPatterns = (patternGroup: RegExp[]) => {
    for (const pattern of patternGroup) {
      const match = text.match(pattern);
      if (match && match[1]) return match[1].trim();
    }
    return '';
  };

  return {
    customerName: tryPatterns(patterns.customerName) || 'Unknown Customer',
    customerPhone: tryPatterns(patterns.customerPhone) || 'No Phone',
    bikeModel: tryPatterns(patterns.bikeModel) || 'Unknown Model',
    workRequired: tryPatterns(patterns.workRequired) || 'No work description',
    workDone: text.match(/Work Done[\s:]+([\s\S]+?)(?=Notes|$)/i)?.[1]?.trim() || '',
    laborCost: parseFloat(tryPatterns(patterns.laborCost)) || 0,
    partsCost: parseFloat(tryPatterns(patterns.partsCost)) || 0,
    notes: text.match(/Notes[\s:]+([\s\S]+)/i)?.[1]?.trim() || ''
  };
} 