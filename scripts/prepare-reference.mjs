// Create private content packets without overwriting existing notes.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '_reference');
const projects = {
  'alscn-ferroelectrics': 'Device stacks/geometries; experiment design and physics choices; PUND excitation; polarization/hysteresis plots; thermal conditions; calibration evidence. Separate simulation (up to 400°C) and measurement (up to 800°C) ranges and confirm each. Explain convergence interventions. Do not infer spatial domains from the Memory parameter.',
  'sot-mram-dtco': 'Public fellowship scope; β-W/CoFeB/MgO stack; your contribution versus prior fabrication; sample geometry/resistance; model-input provenance; current characterization/model evidence. Distinguish completed results, active work, and future objectives.',
  'ito-izo-thesis': 'Public title and adviser; back-gated device/contact geometry; over-extension/shorting hypothesis; B1500/probe-station baseline leakage and noise; performed measurements; TLM/layout/model progress. State which steps are actually complete.',
  'cntfet-lbnl': 'Internship dates; NEGF/electrostatics framework; illumination-dependent trapping investigation; completed versus initiated Verilog-A work; device tests you performed; unfinished items; publicly shareable diagrams/results and lab permission.',
  'device-modelling': 'SOI-FET/FinFET geometry; mesh, physics and sweeps; baseline definition and metric behind the earlier 3% claim; plots; research recognition and personal contribution.',
  'tia-optical-receiver': 'Specifications; schematic/block diagram; stage/bias/loading choices; gain, bandwidth, noise and power plots; supply/load/corner; schematic versus extracted/post-layout results; PVT/Monte Carlo if performed. Verify 519 kΩ, 311 MHz, 3.5 mW.',
  'sram-array': 'Bitcell/peripheral sizing; array architecture; read/write timing definitions and waveforms; SNM/write margin; supply/corners; power/area; derivation of the reported 46% figure-of-merit improvement.',
  'semiconductor-memory': 'Network/dataset and split; hardware-aware training; 4-bit estimator; 2T2R mapping; OxRAM/PCM nonideality assumptions; baselines/ablations; Macro-F1 definition and degradation; energy/latency methodology. Confirm the actual architecture rather than reusing old webpage text.',
  'sensor-board': 'Three-board block diagram; requirements; interface/component decisions; permitted schematics/layouts; initial bring-up and revision evidence; your responsibilities; employer publication restrictions.',
  'graphene-transistor': 'Fabrication/transfer process; PDMS microfluidics; dimensions; transfer/output and pH-response curves; sample count; repeatability; support for four devices at a 0 V Dirac point and up to 0.395 kΩ/pH; individual versus team contribution.',
  'mems-cantilever': 'Masks/process flow; DRIE, release, packaging; SEM/profilometry; resonance, displacement and snap-in; model-measurement comparison; fabrication and characterization ownership.',
  'mems-gyroscope': 'Architecture/specifications; mode shapes; frequency split and tuning; simulation assumptions; fabrication status; dimensions and design choices; limitations.',
  'dsa': 'Polymer/template and performed process steps; SEM/AFM/ellipsometry; measured pitch and domain size; order/defects; distinguish 40 nm natural pitch, approximately 20 nm domains, and demonstrated resolution.',
  'cdse-quantum-dots': 'Synthesis conditions; growth time series; UV-Vis/fluorescence/STEM; size extraction and 3.75 nm evidence; broadening/aggregation interpretation; individual contribution.'
};
for (const [slug, specific] of Object.entries(projects)) {
  const dir = path.join(root,slug);
  for (const folder of ['', 'figures', 'data', 'reports']) fs.mkdirSync(path.join(dir,folder), {recursive:true});
  const notes = path.join(dir,'notes.md');
  if (!fs.existsSync(notes)) fs.writeFileSync(notes,`# ${slug}\n\nPRIVATE REFERENCE — not approved for publication.\n\n## Project-specific packet\n${specific}\n\n## Basics\nPublic title, role, dates, organization/course, collaborators, team size:\n\n## Problem and constraints\n\n## My contribution vs. team contribution\n\n## Decisions and approach\n\n## Results and verification\nFor each value: unit, conditions, baseline, and whether measured/simulated/extracted/estimated.\n\n## Problems, limitations and lessons\n\n## Figure captions\nFilename, what it shows, axes/units, test conditions, source/credit.\n\n## Publication permissions\nMark each file PUBLIC / PRIVATE REFERENCE / DO NOT PUBLISH. Nothing is automatically published.\n`);
}
fs.mkdirSync(path.join(root,'brainwaves'),{recursive:true});
const brainwaves = path.join(root,'brainwaves','notes.md');
if (!fs.existsSync(brainwaves)) fs.writeFileSync(brainwaves,'# Brainwaves — private drafts\n\nFor each book or essay: the idea that stayed with you, a real decision it affected, what you disagree with, and who might find it useful. Rough bullets are enough.\n\nFirst pieces: one technical reflection, one book note, and one personal engineering interest.\n\nDo not write invented first-person experiences or publish draft text automatically.\n');
console.log(`Private packets ready: ${Object.keys(projects).length} projects + Brainwaves.`);
