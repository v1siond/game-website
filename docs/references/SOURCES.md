# Reference art, and where it came from

Isometric art we MODEL AGAINST. None of it ships, and none of the image FILES live in this repository: they are
licensed stock previews, so they sit in the workspace at `.claude-workspace/game-website/references/` and only
their sources are recorded here. Every tile this engine draws is authored in `priv/tilegen/tiles.json`, baked
by `bake.mjs` and served from the database.

**Why this file exists.** An object was built from a written description of a reference instead of the reference
itself, and came out nothing like the thing it was named after. A text description is not a reference. Step 1 of
`../OBJECT-CONSTRUCTION.md` is: find real isometric art of the thing you are about to build, record it here, and
get it approved before modelling anything.

**A first set was gathered from OpenGameArt and REJECTED on sight**: *"none of the references are good, I'll
share ones witht he same name"*. The set below is his.

## Sheets, and what each one is for

| Reference | For | What to take from it |
|---|---|---|
| [Isometric bridge collection](https://img.magnific.com/free-vector/bridges-details-isometric-elements-collection-with-modern-metallic-constructions-ancient-wooden-stone-viaducts-spans-isolated-vector-illustration_1284-30093.jpg) | **THE bridge sheet.** 11 bridges, one of every type asked for | Split into `references/split/bridge-01..11`. Stone arch viaduct, brick trestle on cylindrical piers, gatehouse bridge with crenellated towers, suspension bridge, steel truss viaduct, steel arch on concrete cylinders, WOOD arched footbridge, red stone humped bridge, rope-and-plank footbridge, modern highway on piers with lamp posts, stone bridge with turreted towers |
| [River, roads, canal bridges](https://media.istockphoto.com/id/1723579707/vector/isometric-river-roads-canal-bridges-tower-engineering-modern-water-highway-and-landmark.jpg) | Crossings in context, on actual water | `split/canal-01..10`. How a deck MEETS the bank, which is where ours fails |
| [Bridge set icons](https://media.istockphoto.com/id/683004652/vector/bridge-set-icons.jpg) | 17 more crossings, small | `split/iconbridge-01..17` |
| [Cave entrance in forest](https://thumbs.dreamstime.com/b/illustration-shows-cave-entrance-surrounded-lush-vegetation-rocky-terrain-dark-create-mysterious-adventurous-397889678.jpg) | Forest cave entrance | Rock mass, vegetation crowding it |
| [Underground cave entrance, forest](https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQANtDP7302QpHoHBaHaIj9hkqHkWLHZdD7DeDHi21bQS9oADwJ6htVJx9t) | **THE cave entrance reference** | A rocky outcrop with a DARK MOUTH cut into it, greenery growing over the top, boulders scattered at its feet, a stream beside it. The mouth is a hole in a MASS, never a dark patch on the floor |
| [Forest portal](https://thumbs.dreamstime.com/b/isometric-pixel-art-landscape-river-rocks-glowing-portal-tree-digital-green-environment-serene-features-winding-387810876.jpg) | A portal as an exit marker | A standing RING with a glow, on open ground, read from across the map |
| [Dense forest, dark entrance](https://image.cdn2.seaart.me/2025-08-10/d2bsiode878c73apibdg/7506483bec52b2d911e98ec282b38f97_high.webp) | **The best single reference we have for a woodland** | The way out is not one big arch object. It is the PATH, plus the dark canopy closing in either side, plus scatter. Also carries two small plank bridges over a stream, ruined columns, benches, logs, rocks and blooms. Study the whole picture, not just the entrance |
| [Bridge gate town](https://i.redd.it/z5x9szk30xt61.jpg) | A gate that is also a crossing | |
| [Gate and fence types](https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGR8UyGj-sGu2-Irn9Vc1r0_YBmnwUQx0qKpQWGrgK5T1c9Kz7aspI9eM) | Fence and gate PANELS, 16 of them | `split/gate-01..16`. Not map entrances, despite the name: these are garden and boundary fences. Still worth having, because every one is a post, panel, post family, which is the construction we want |

## Splitting a sheet into its pieces

One image holding twelve bridges becomes twelve references. `.claude-workspace/game-website/references/` holds
the sheets and the pieces; the splitter floods the near-white ground, labels what is left as connected blobs,
drops anything under a pixel-count floor, and writes each blob with a small margin. Bounding-box merging is OFF
on purpose: neighbouring isometric objects have overlapping boxes, so merging chains the whole sheet into one.

## Adding one

Same projection this engine draws, or it teaches the wrong proportions and is worse than nothing. Record the
row before the file is used. Do not commit licensed stock into this repository.

## More to draw on

His list, not yet gathered: entrances to **Pokemon** towns and cities, **Zelda**, **Death's Door**, **Ori**,
**Hollow Knight**.

## Recovered from the whole prompt history, 2026-09-15

*"IF I PASS A FUCKING REFERENCE, IS BECAUSE I WANT TO SAVE IT, STORE IT AND WORK IN THE FUCKING OBJECT OR
DESIGN UNTIL IT MATCHES THE REFERENCE AS CLOSE TO 100% AS POSIBLE, ANYTHING LESS THAN THAT IS UNACEPTABLE"*.

The sheets above were gathered for the bridge and entrance work. They are not everything he has sent: sweeping
every prompt turned up **41 more** that had only ever existed in the chat, against 10 already held. They are
in `.claude-workspace/game-website/references/by-subject/`, filed by what they are, with the sentence he typed
around each recorded in `_recovered.json`. Same rule as above: the FILES stay out of this repository.

Nine were filtered back OUT. They were screenshots of our own renders, which he sends to report a defect: the
opposite of a reference, the thing to change rather than the thing to match.

| subject | count | what is in it |
|---|---|---|
| `by-subject/bridges/` | 2 | more crossings in context, on actual water |
| `by-subject/buildings/` | 6 | church and cathedral photographs, and an isometric modern block |
| `by-subject/entrances/` | 5 | a cave mouth in lush vegetation, the isometric forest whose canopy closes over the path, and the dense forest entrance he called good |
| `by-subject/objects/` | 3 | objects he pointed at while asking for the compositions list to be kept up to date |
| `by-subject/pathways/` | 9 | the nine he sent for pathway variance (beach city street, clifftop path, rocky track, woodland crossroads, park path, trail beside a river, swamp boardwalk to a cave, swamp trail to a temple, swamp island), plus a park with a plank bridge and a forest path winding between trees |
| `by-subject/trees/` | 5 | the five behind 'we need to have more variance of trees, like we are using the same for all forest variations' |
| `by-subject/units/` | 1 | how a human unit should read |
| `by-subject/unsorted/` | 2 | shared without a sentence naming them; open them before using them |
| `by-subject/water/` | 7 | rivers and banks in context, and the shots behind 'we should use optimized tiles with z-width' and the swamp water complaints |
| `by-subject/whole-map/` | 1 | whole isometric scenes to model the overall read against: an RPG town with market stalls and wooden paths, and a conifer forest |

### Still missing

Vecteezy refuses every automated request, so three he linked are recorded by URL and label only, and need
saving by hand from a browser:

- *"pathway from rocky terrain, rocky rustic pathway"*, `static.vecteezy.com/.../051/331/589/non_2x/isometric-forest-path-illustration...`
- isometric hill with river, `static.vecteezy.com/.../073/164/866/small/isometric-hill-with-r...`
- isometric park or forest, `static.vecteezy.com/.../025/339/328/small/isometric-park-or-for...`
