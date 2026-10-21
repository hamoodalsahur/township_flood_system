/** Entirely authored fictional examples. Distinct scenario groups per split.
 * Ground-truth "same incident" labels are illustrative, not field-confirmed. */
export type EvaluationSplit="development"|"holdout";
export type EvaluationLanguage="en"|"ms";
export type EvaluationCase={id:string;group:string;category:string;language:EvaluationLanguage;description:string;split:EvaluationSplit};
export const EVALUATION_CASES:readonly EvaluationCase[]=[
  {
    "id": "tree-north-a",
    "group": "development-tree-north",
    "category": "fallen_tree",
    "language": "en",
    "description": "A large tree collapsed across the north entrance road.",
    "split": "development"
  },
  {
    "id": "tree-north-b",
    "group": "development-tree-north",
    "category": "fallen_tree",
    "language": "en",
    "description": "The main northern entrance is blocked by a fallen tree trunk.",
    "split": "development"
  },
  {
    "id": "tree-south-a",
    "group": "development-tree-south",
    "category": "fallen_tree",
    "language": "ms",
    "description": "Pokok tumbang menghalang jalan berhampiran kolam di bahagian selatan.",
    "split": "development"
  },
  {
    "id": "tree-south-b",
    "group": "development-tree-south",
    "category": "fallen_tree",
    "language": "ms",
    "description": "Batang pokok jatuh menutup laluan tepi kolam selatan.",
    "split": "development"
  },
  {
    "id": "flood-central-a",
    "group": "development-flood-central",
    "category": "flooding",
    "language": "en",
    "description": "Floodwater covers the central road underpass after rainfall.",
    "split": "development"
  },
  {
    "id": "flood-central-b",
    "group": "development-flood-central",
    "category": "flooding",
    "language": "ms",
    "description": "Laluan bawah tanah di simpang tengah dinaiki air hujan.",
    "split": "development"
  },
  {
    "id": "flood-east-a",
    "group": "development-flood-east",
    "category": "flooding",
    "language": "ms",
    "description": "Air bertakung di pintu masuk kawasan perumahan timur.",
    "split": "development"
  },
  {
    "id": "flood-east-b",
    "group": "development-flood-east",
    "category": "flooding",
    "language": "en",
    "description": "Standing water at the eastern residential estate gate.",
    "split": "development"
  },
  {
    "id": "pothole-west-a",
    "group": "development-pothole-west",
    "category": "pothole",
    "language": "en",
    "description": "A deep pothole is beside the western roundabout.",
    "split": "development"
  },
  {
    "id": "pothole-west-b",
    "group": "development-pothole-west",
    "category": "pothole",
    "language": "ms",
    "description": "Lubang besar pada jalan berhampiran bulatan barat.",
    "split": "development"
  },
  {
    "id": "pothole-south-a",
    "group": "development-pothole-south",
    "category": "pothole",
    "language": "ms",
    "description": "Jalan berlubang berhampiran simpang selatan kilang.",
    "split": "development"
  },
  {
    "id": "pothole-south-b",
    "group": "development-pothole-south",
    "category": "pothole",
    "language": "ms",
    "description": "Permukaan jalan rosak dengan lubang di persimpangan kilang selatan.",
    "split": "development"
  },
  {
    "id": "works-school-a",
    "group": "development-works-school",
    "category": "roadworks",
    "language": "en",
    "description": "Construction equipment narrows a lane by the school.",
    "split": "development"
  },
  {
    "id": "works-school-b",
    "group": "development-works-school",
    "category": "roadworks",
    "language": "en",
    "description": "One carriageway near the school is occupied by maintenance machinery.",
    "split": "development"
  },
  {
    "id": "works-industrial-a",
    "group": "development-works-industrial",
    "category": "roadworks",
    "language": "ms",
    "description": "Kerja penyelenggaraan jalan dijalankan di kawasan industri.",
    "split": "development"
  },
  {
    "id": "works-industrial-b",
    "group": "development-works-industrial",
    "category": "roadworks",
    "language": "en",
    "description": "Road repair works are ongoing within the industrial area.",
    "split": "development"
  },
  {
    "id": "obstruction-warehouse-a",
    "group": "development-obstruction-warehouse",
    "category": "road_obstruction",
    "language": "en",
    "description": "An abandoned lorry blocks the warehouse access road.",
    "split": "development"
  },
  {
    "id": "obstruction-warehouse-b",
    "group": "development-obstruction-warehouse",
    "category": "road_obstruction",
    "language": "ms",
    "description": "Lori yang ditinggalkan menghalang laluan ke gudang.",
    "split": "development"
  },
  {
    "id": "obstruction-school-a",
    "group": "development-obstruction-school",
    "category": "road_obstruction",
    "language": "ms",
    "description": "Tong sampah besar terjatuh dan menghalang jalan sebelah sekolah.",
    "split": "development"
  },
  {
    "id": "obstruction-school-b",
    "group": "development-obstruction-school",
    "category": "road_obstruction",
    "language": "ms",
    "description": "Laluan berhampiran sekolah terhalang oleh bekas sampah yang tumbang.",
    "split": "development"
  },
  {
    "id": "storm-park-a",
    "group": "development-storm-park",
    "category": "storm_damage",
    "language": "en",
    "description": "Strong winds damaged a streetlight next to the park.",
    "split": "development"
  },
  {
    "id": "storm-park-b",
    "group": "development-storm-park",
    "category": "storm_damage",
    "language": "ms",
    "description": "Lampu jalan di tepi taman rosak selepas ribut kuat.",
    "split": "development"
  },
  {
    "id": "storm-market-a",
    "group": "development-storm-market",
    "category": "storm_damage",
    "language": "ms",
    "description": "Bumbung pondok bas berhampiran pasar rosak akibat angin kencang.",
    "split": "development"
  },
  {
    "id": "storm-market-b",
    "group": "development-storm-market",
    "category": "storm_damage",
    "language": "en",
    "description": "Heavy wind damaged the bus shelter roof near the market.",
    "split": "development"
  },
  {
    "id": "tree-lake-a",
    "group": "holdout-tree-lake",
    "category": "fallen_tree",
    "language": "en",
    "description": "A tree fell across the road beside the lake.",
    "split": "holdout"
  },
  {
    "id": "tree-lake-b",
    "group": "holdout-tree-lake",
    "category": "fallen_tree",
    "language": "ms",
    "description": "Jalan tepi tasik dihalang oleh pokok yang tumbang.",
    "split": "holdout"
  },
  {
    "id": "tree-busstop-a",
    "group": "holdout-tree-busstop",
    "category": "fallen_tree",
    "language": "ms",
    "description": "Dahan pokok besar menghalang jalan berhampiran hentian bas.",
    "split": "holdout"
  },
  {
    "id": "tree-busstop-b",
    "group": "holdout-tree-busstop",
    "category": "fallen_tree",
    "language": "en",
    "description": "Large fallen branches obstruct the road by the bus stop.",
    "split": "holdout"
  },
  {
    "id": "flood-clinic-a",
    "group": "holdout-flood-clinic",
    "category": "flooding",
    "language": "en",
    "description": "Rainwater flooded the street outside the clinic.",
    "split": "holdout"
  },
  {
    "id": "flood-clinic-b",
    "group": "holdout-flood-clinic",
    "category": "flooding",
    "language": "en",
    "description": "Water pooling along the clinic access road after heavy rain.",
    "split": "holdout"
  },
  {
    "id": "flood-factory-a",
    "group": "holdout-flood-factory",
    "category": "flooding",
    "language": "ms",
    "description": "Jalan utama depan kilang dinaiki air.",
    "split": "holdout"
  },
  {
    "id": "flood-factory-b",
    "group": "holdout-flood-factory",
    "category": "flooding",
    "language": "en",
    "description": "Floodwater is spreading across the factory entrance road.",
    "split": "holdout"
  },
  {
    "id": "pothole-market-a",
    "group": "holdout-pothole-market",
    "category": "pothole",
    "language": "ms",
    "description": "Terdapat lubang jalan yang dalam di pintu belakang pasar.",
    "split": "holdout"
  },
  {
    "id": "pothole-market-b",
    "group": "holdout-pothole-market",
    "category": "pothole",
    "language": "ms",
    "description": "Lubang besar pada permukaan jalan di laluan belakang pasar.",
    "split": "holdout"
  },
  {
    "id": "pothole-library-a",
    "group": "holdout-pothole-library",
    "category": "pothole",
    "language": "en",
    "description": "Broken asphalt left a pothole beside the library.",
    "split": "holdout"
  },
  {
    "id": "pothole-library-b",
    "group": "holdout-pothole-library",
    "category": "pothole",
    "language": "ms",
    "description": "Permukaan tar berlubang di tepi perpustakaan.",
    "split": "holdout"
  },
  {
    "id": "works-gateway-a",
    "group": "holdout-works-gateway",
    "category": "roadworks",
    "language": "en",
    "description": "Workers are resurfacing the road near the main gateway.",
    "split": "holdout"
  },
  {
    "id": "works-gateway-b",
    "group": "holdout-works-gateway",
    "category": "roadworks",
    "language": "ms",
    "description": "Kerja menurap semula jalan berlaku di pintu masuk utama.",
    "split": "holdout"
  },
  {
    "id": "works-bridge-a",
    "group": "holdout-works-bridge",
    "category": "roadworks",
    "language": "ms",
    "description": "Jambatan kecil sedang dibaiki dan satu lorong digunakan.",
    "split": "holdout"
  },
  {
    "id": "works-bridge-b",
    "group": "holdout-works-bridge",
    "category": "roadworks",
    "language": "en",
    "description": "Bridge maintenance occupies one lane on the small crossing.",
    "split": "holdout"
  },
  {
    "id": "obstruction-apartment-a",
    "group": "holdout-obstruction-apartment",
    "category": "road_obstruction",
    "language": "en",
    "description": "A parked delivery van blocks the apartment driveway.",
    "split": "holdout"
  },
  {
    "id": "obstruction-apartment-b",
    "group": "holdout-obstruction-apartment",
    "category": "road_obstruction",
    "language": "en",
    "description": "Apartment entrance obstructed by a stationary delivery vehicle.",
    "split": "holdout"
  },
  {
    "id": "obstruction-workshop-a",
    "group": "holdout-obstruction-workshop",
    "category": "road_obstruction",
    "language": "ms",
    "description": "Palet kayu menghalang jalan di luar bengkel.",
    "split": "holdout"
  },
  {
    "id": "obstruction-workshop-b",
    "group": "holdout-obstruction-workshop",
    "category": "road_obstruction",
    "language": "ms",
    "description": "Laluan hadapan bengkel disekat oleh beberapa palet.",
    "split": "holdout"
  },
  {
    "id": "storm-sports-a",
    "group": "holdout-storm-sports",
    "category": "storm_damage",
    "language": "en",
    "description": "Storm winds damaged the fencing at the sports complex.",
    "split": "holdout"
  },
  {
    "id": "storm-sports-b",
    "group": "holdout-storm-sports",
    "category": "storm_damage",
    "language": "ms",
    "description": "Pagar kompleks sukan rosak akibat ribut petang.",
    "split": "holdout"
  },
  {
    "id": "storm-shops-a",
    "group": "holdout-storm-shops",
    "category": "storm_damage",
    "language": "ms",
    "description": "Papan tanda kedai tercabut selepas hujan ribut.",
    "split": "holdout"
  },
  {
    "id": "storm-shops-b",
    "group": "holdout-storm-shops",
    "category": "storm_damage",
    "language": "en",
    "description": "A shop sign was torn loose by the storm near the retail row.",
    "split": "holdout"
  }
] as const;

export function evaluationSplit(split:EvaluationSplit):EvaluationCase[] {
 return EVALUATION_CASES.filter(c=>c.split===split);
}
