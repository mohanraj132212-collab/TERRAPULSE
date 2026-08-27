/* TerraPulse Structured Plant Disease Knowledge Base */

export const DISEASE_DATABASE = [
  {
    id: 'healthy_leaf',
    name: 'Healthy Leaf',
    category: 'Normal',
    severity: 'None',
    severityBadge: 'badge-good',
    confidenceRange: [94, 99],
    problem: 'No cellular damage or plant pathogen lesions detected on foliage.',
    solution: 'Maintain current watering, fertilization schedule, and daily environmental monitoring.',
    prevention: 'Continue routine leaf inspections, balance soil moisture between 40%–70%, and ensure proper spacing for airflow.',
    imagePlaceholder: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'leaf_spot',
    name: 'Leaf Spot',
    category: 'Fungal Infection',
    severity: 'Moderate',
    severityBadge: 'badge-warning',
    confidenceRange: [91, 97],
    problem: 'Fungal pathogens (Cercospora/Septoria) causing circular dark brownish lesions with yellow halos on lower foliage.',
    solution: 'Prune and safely discard affected foliage. Apply organic copper-based fungicide or neem oil spray early in the morning.',
    prevention: 'Avoid overhead sprinkler watering, increase plant canopy spacing, and clean gardening shears between cuts.',
    imagePlaceholder: 'https://images.unsplash.com/photo-1592417817098-8f3d6ef23a81?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'powdery_mildew',
    name: 'Powdery Mildew',
    category: 'Fungal Disease',
    severity: 'Moderate',
    severityBadge: 'badge-warning',
    confidenceRange: [89, 96],
    problem: 'White to grayish powdery fungal spores coating leaf surfaces, restricting leaf photosynthesis and stunting growth.',
    solution: 'Spray potassium bicarbonate solution or diluted sulfur fungicide. Ensure affected leaves receive indirect sunlight.',
    prevention: 'Maintain relative humidity between 50%–75% and improve greenhouse ventilation to avoid high humidity stagnation.',
    imagePlaceholder: 'https://images.unsplash.com/photo-1587334274328-64186a80aeff?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'bacterial_leaf_blight',
    name: 'Bacterial Leaf Blight',
    category: 'Bacterial Infection',
    severity: 'High',
    severityBadge: 'badge-critical',
    confidenceRange: [90, 95],
    problem: 'Xanthomonas bacteria causing water-soaked leaf margins that quickly turn necrotic, yellow, and translucent.',
    solution: 'Immediately isolate affected plants. Treat with bactericide copper hydroxide spray. Remove infected plant matter.',
    prevention: 'Use disease-resistant certified seed stock, rotate crops annually, and avoid working in wet fields.',
    imagePlaceholder: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'early_blight',
    name: 'Early Blight',
    category: 'Fungal Infection',
    severity: 'Moderate',
    severityBadge: 'badge-warning',
    confidenceRange: [92, 98],
    problem: 'Alternaria solani fungus causing target-like concentric ring spots on mature leaves, leading to defoliation.',
    solution: 'Apply chlorothalonil or bio-fungicide containing Bacillus subtilis. Mulch around base to prevent soil splash.',
    prevention: 'Rotate Solanaceae crops every 2-3 years, clear crop debris post-harvest, and stake plants off damp soil.',
    imagePlaceholder: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'late_blight',
    name: 'Late Blight',
    category: 'Oomycete Infection',
    severity: 'Critical',
    severityBadge: 'badge-critical',
    confidenceRange: [93, 99],
    problem: 'Phytophthora infestans causing rapid dark water-soaked leaf decay with white mildew fuzz underneath during cool damp conditions.',
    solution: 'Urgently treat with systemic fungicide (Mefenoxam or Mancozeb). Destroy severely infected plants to protect field.',
    prevention: 'Monitor field humidity when above 85% and apply preventive protective fungicides prior to rainy periods.',
    imagePlaceholder: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'rust',
    name: 'Puccinia Rust',
    category: 'Fungal Disease',
    severity: 'Moderate',
    severityBadge: 'badge-warning',
    confidenceRange: [88, 95],
    problem: 'Reddish-orange rust pustules forming on lower leaf undersides, releasing powdery spores that rupture epidermis.',
    solution: 'Apply sulfur powder or tebuconazole fungicide. Remove heavily rusted leaves immediately.',
    prevention: 'Destroy alternative host weeds around field perimeter and irrigate early morning to dry leaf surfaces quickly.',
    imagePlaceholder: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'nutrient_deficiency',
    name: 'Nutrient Deficiency (Chlorosis)',
    category: 'Abiotic Stress',
    severity: 'Moderate',
    severityBadge: 'badge-warning',
    confidenceRange: [90, 96],
    problem: 'Nitrogen or Iron deficiency producing interveinal leaf yellowing while leaf veins remain green.',
    solution: 'Apply balanced NPK foliage spray or chelated iron liquid fertilizer. Test soil pH to unblock mineral uptake.',
    prevention: 'Maintain soil pH between 5.8 and 7.0, and incorporate well-rotted organic compost into root zone.',
    imagePlaceholder: 'https://images.unsplash.com/photo-1587334274328-64186a80aeff?auto=format&fit=crop&w=600&q=80'
  }
];

export function getDiseaseById(id) {
  return DISEASE_DATABASE.find(d => d.id === id) || DISEASE_DATABASE[1];
}

export function getRandomDisease() {
  const index = Math.floor(Math.random() * DISEASE_DATABASE.length);
  return DISEASE_DATABASE[index];
}
