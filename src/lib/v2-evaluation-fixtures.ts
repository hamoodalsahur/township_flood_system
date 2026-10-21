/** Entirely invented demonstration descriptions; labels represent intended scenarios, not observations. */
import type {HazardCategory} from "./demo-hazards";
export type LabelledPair={id:string;category:HazardCategory;first:string;second:string;sameEvent:boolean};
export const EVALUATION_PAIRS:readonly LabelledPair[]=[
{id:"tree-01",category:"fallen_tree",first:"A big tree fell across the school entrance.",second:"The school gate is blocked by a collapsed tree.",sameEvent:true},
{id:"tree-02",category:"fallen_tree",first:"Branches are blocking the east access lane.",second:"Large fallen branches obstruct the eastern lane.",sameEvent:true},
{id:"tree-03",category:"fallen_tree",first:"Pokok tumbang menutup jalan masuk taman.",second:"Fallen tree blocks the housing entrance road.",sameEvent:true},
{id:"tree-04",category:"fallen_tree",first:"A tree is down beside the sports field.",second:"Tree fell beside the northern factory entrance.",sameEvent:false},
{id:"tree-05",category:"fallen_tree",first:"Branches block the south roundabout.",second:"Tree trunk is down at the north playground.",sameEvent:false},
{id:"tree-06",category:"fallen_tree",first:"Pokok tumbang dekat sekolah.",second:"Tree fell outside the industrial gate.",sameEvent:false},
{id:"flood-01",category:"flooding",first:"Water covers the road beneath the bridge.",second:"The underpass is flooded with standing water.",sameEvent:true},
{id:"flood-02",category:"flooding",first:"Jalan depan kedai dinaiki air selepas hujan.",second:"Water pooling on the street outside the shops.",sameEvent:true},
{id:"flood-03",category:"flooding",first:"Deep puddles at the western junction.",second:"Floodwater has collected at the west junction.",sameEvent:true},
{id:"flood-04",category:"flooding",first:"Water accumulated at the west entrance.",second:"Flooding outside the eastern clinic.",sameEvent:false},
{id:"flood-05",category:"flooding",first:"The road beneath the bridge is flooded.",second:"A small puddle formed by the distant park.",sameEvent:false},
{id:"flood-06",category:"flooding",first:"Air bertakung di lorong belakang sekolah.",second:"Air naik di simpang pasar malam.",sameEvent:false},
{id:"hole-01",category:"pothole",first:"Large pothole beside the bus stop.",second:"Deep road surface hole next to the bus shelter.",sameEvent:true},
{id:"hole-02",category:"pothole",first:"Lubang besar di jalan masuk kawasan rumah.",second:"Large hole in the residential entrance pavement.",sameEvent:true},
{id:"hole-03",category:"pothole",first:"Broken road surface near the petrol station.",second:"Pothole spotted by the fuel station.",sameEvent:true},
{id:"hole-04",category:"pothole",first:"Pothole by the bus stop.",second:"Road hole beside the warehouse loading bay.",sameEvent:false},
{id:"hole-05",category:"pothole",first:"Cracked lane outside the western apartment.",second:"Damaged tarmac at the eastern school turn.",sameEvent:false},
{id:"hole-06",category:"pothole",first:"Jalan berlubang dekat stesen minyak.",second:"Lubang kecil dekat dewan komuniti.",sameEvent:false},
{id:"work-01",category:"roadworks",first:"Workers digging a trench at the junction.",second:"Road repair excavation at the same junction.",sameEvent:true},
{id:"work-02",category:"roadworks",first:"Temporary cones for repairs beside the shops.",second:"Maintenance crew set up cones outside the shops.",sameEvent:true},
{id:"work-03",category:"roadworks",first:"Kerja pembaikan jalan di depan klinik.",second:"Street maintenance in front of the clinic.",sameEvent:true},
{id:"work-04",category:"roadworks",first:"Repair work by the hospital.",second:"Road resurfacing near the far stadium.",sameEvent:false},
{id:"work-05",category:"roadworks",first:"Construction cones at the north exit.",second:"Maintenance barriers around the southern junction.",sameEvent:false},
{id:"work-06",category:"roadworks",first:"Kontraktor baiki jalan dekat kedai.",second:"Kerja korek parit dekat pejabat pos.",sameEvent:false},
{id:"block-01",category:"road_obstruction",first:"A delivery truck blocks the access lane.",second:"Lorry parked across the entrance lane.",sameEvent:true},
{id:"block-02",category:"road_obstruction",first:"Traffic cones are scattered at the bridge.",second:"Loose safety cones obstruct the bridge lane.",sameEvent:true},
{id:"block-03",category:"road_obstruction",first:"Sampah besar menghalang laluan utama.",second:"Large rubbish pile blocks the main access lane.",sameEvent:true},
{id:"block-04",category:"road_obstruction",first:"Truck obstructs the western service road.",second:"Car blocking the east residential street.",sameEvent:false},
{id:"block-05",category:"road_obstruction",first:"Loose barrels in front of the market.",second:"Abandoned furniture outside the stadium.",sameEvent:false},
{id:"block-06",category:"road_obstruction",first:"Lori menghalang pintu masuk gudang.",second:"Kereta rosak di hadapan klinik.",sameEvent:false},
{id:"storm-01",category:"storm_damage",first:"High winds damaged the road sign near the park.",second:"Storm bent the signpost beside the park.",sameEvent:true},
{id:"storm-02",category:"storm_damage",first:"Bumbung diterbangkan angin dekat simpang.",second:"Roof panels blown into the nearby junction.",sameEvent:true},
{id:"storm-03",category:"storm_damage",first:"Storm tore the awning from a roadside shelter.",second:"Wind damaged the shelter roof by the road.",sameEvent:true},
{id:"storm-04",category:"storm_damage",first:"Storm damaged a sign outside the clinic.",second:"Wind broke a sign across town by the lake.",sameEvent:false},
{id:"storm-05",category:"storm_damage",first:"Flying roof panels at the north exit.",second:"Broken shelter roof at the south factory.",sameEvent:false},
{id:"storm-06",category:"storm_damage",first:"Dahan patah selepas ribut dekat pasar.",second:"Papan tanda rosak selepas ribut dekat sekolah.",sameEvent:false},
{id:"other-01",category:"other",first:"An uncovered drain is beside the footpath.",second:"Open roadside drain near the walking path.",sameEvent:true},
{id:"other-02",category:"other",first:"Stray construction material near the gate.",second:"Building materials left by the gate.",sameEvent:true},
{id:"other-03",category:"other",first:"Wayfinding sign has fallen outside the hall.",second:"Directional sign knocked over near the community hall.",sameEvent:true},
{id:"other-04",category:"other",first:"Open drain close to the east park.",second:"Uncovered gutter by the west factory.",sameEvent:false},
{id:"other-05",category:"other",first:"Broken footpath rail at the north school.",second:"Loose drain cover outside the south shops.",sameEvent:false},
{id:"other-06",category:"other",first:"Papan tanda rosak depan kedai.",second:"Longkang terbuka di taman permainan.",sameEvent:false},
];

/** Hand-tagged language slices of this small fictional evaluation dataset. */
export const MALAY_LANGUAGE_CASE_IDS = [
 "tree-03","tree-06","flood-02","flood-06","hole-02","hole-06",
 "work-03","work-06","block-03","block-06","storm-02","storm-06","other-06"
] as const;
