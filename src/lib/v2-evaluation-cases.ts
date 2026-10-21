/** Synthetic pairs only. Labels describe author-intended scenario identity, not real events. */
export type EvaluationCase={id:string;group:string;category:string;description:string};
export const EVALUATION_CASES:readonly EvaluationCase[]=[
{id:"tree-a",group:"tree",category:"fallen_tree",description:"A large tree fell across the northern entrance road."},
{id:"tree-b",group:"tree",category:"fallen_tree",description:"Collapsed tree trunk is blocking traffic at the north entrance."},
{id:"flood-a",group:"flood",category:"flooding",description:"Rainwater has accumulated at the central underpass."},
{id:"flood-b",group:"flood",category:"flooding",description:"The tunnel beneath the central junction is flooded after heavy rain."},
{id:"hole-a",group:"pothole",category:"pothole",description:"A deep pothole appeared beside the west roundabout."},
{id:"hole-b",group:"pothole",category:"pothole",description:"Broken asphalt formed a large hole next to the western roundabout."},
{id:"work-a",group:"construction",category:"roadworks",description:"Road construction machinery occupies one lane near the school."},
{id:"work-b",group:"construction",category:"roadworks",description:"Maintenance works have narrowed the carriageway by the school."},
{id:"block-a",group:"obstruction",category:"road_obstruction",description:"An abandoned delivery truck blocks the industrial street."},
{id:"block-b",group:"obstruction",category:"road_obstruction",description:"A stationary lorry prevents vehicles from passing on the industrial road."},
{id:"storm-a",group:"storm",category:"storm_damage",description:"Wind damaged the street light structure near the park."},
{id:"storm-b",group:"storm",category:"storm_damage",description:"A broken lamp post is leaning by the public park after a storm."},
{id:"tree-c",group:"other-tree",category:"fallen_tree",description:"Small branches fell near the southern bicycle track."},
{id:"tree-d",group:"other-tree",category:"fallen_tree",description:"Fallen tree limbs are scattered beside the south cycle path."},
{id:"flood-c",group:"other-flood",category:"flooding",description:"Standing water appeared at the eastern estate gate."},
{id:"flood-d",group:"other-flood",category:"flooding",description:"A puddle covered the road beside the east housing entrance."}
] as const;
